#!/usr/bin/env bash
# Bisection-based dependency upgrade verifier.
#
# Reads a JSON map of "<package>": "<target-version>" from $1
# (the output of `ncu --jsonUpgraded`).
#
# Strategy:
#   Phase 1 (fast, typecheck-only): apply the FULL candidate set, run
#     `deno install --allow-scripts` + `deno task check`. If green, adopt
#     all. If red, split in halves and recurse. Singletons that fail get
#     recorded as rejected; the rest of the tree keeps adopting green
#     subsets on a rolling baseline.
#   Phase 2 (final tests): run `deno task test:doctor` on the adopted set.
#     If it regresses at runtime, re-bisect the adopted set with full
#     verify (check + tests in parallel) to isolate the offender.
#   Phase 3 (build sanity): one `deno task build:doctor` on the survivors.
#
# Per-probe cost is one verify, not one per package, so a clean 30-package
# run finishes in ~1 probe instead of ~30. Worst case for K candidates
# with F failures is roughly F + log2(K) probes.
#
# Outputs:
#   /tmp/passing.txt              "<name>=<version>" per adopted bump
#   /tmp/failing.txt              "<name>=<version>" per rejected bump
#   ${LOG_DIR}/probe-<N>-<label>.log  per-probe full output
#
# Env:
#   LOG_DIR              defaults to /tmp/bisect-logs
#   TRAKT_CLIENT_ID      required for build:doctor

set -euo pipefail

INPUT_JSON="${1:?usage: ncu-bisect.sh <upgrades.json>}"
ROOT="$(git rev-parse --show-toplevel)"
CLIENT="$ROOT/projects/client"
LOG_DIR="${LOG_DIR:-/tmp/bisect-logs}"
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/probe-*.log "$LOG_DIR"/rejected-*.log

: > /tmp/passing.txt
: > /tmp/failing.txt

ORIGINAL_PKG="/tmp/bisect.pkg.original"
ORIGINAL_LOCK="/tmp/bisect.lock.original"
BASELINE_PKG="/tmp/bisect.pkg.baseline"
BASELINE_LOCK="/tmp/bisect.lock.baseline"
cp "$CLIENT/package.json" "$ORIGINAL_PKG"
cp "$ROOT/deno.lock"      "$ORIGINAL_LOCK"
cp "$ORIGINAL_PKG"  "$BASELINE_PKG"
cp "$ORIGINAL_LOCK" "$BASELINE_LOCK"

reset_baseline_to_original() {
  cp "$ORIGINAL_PKG"  "$BASELINE_PKG"
  cp "$ORIGINAL_LOCK" "$BASELINE_LOCK"
  cp "$ORIGINAL_PKG"  "$CLIENT/package.json"
  cp "$ORIGINAL_LOCK" "$ROOT/deno.lock"
}

TOTAL=$(jq 'length' "$INPUT_JSON")
PROBE_COUNT=0
START_TS=$(date +%s)

human_elapsed() {
  local secs=$(( $(date +%s) - START_TS ))
  printf '%02d:%02d' $((secs / 60)) $((secs % 60))
}

count_lines() { wc -l < "$1" 2>/dev/null | tr -d ' '; }

log() {
  printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" >&2
}

progress() {
  local adopted rejected unknown
  adopted=$(count_lines /tmp/passing.txt)
  rejected=$(count_lines /tmp/failing.txt)
  unknown=$(( TOTAL - adopted - rejected ))
  log "  ▸ probes=${PROBE_COUNT} | adopted=${adopted} | rejected=${rejected} | unknown=${unknown} | elapsed=$(human_elapsed)"
}

apply_set() {
  local set_json="$1"
  jq --argjson set "$set_json" '
    reduce ($set | to_entries[]) as $e (.;
      if (.dependencies // {})[$e.key]      then .dependencies[$e.key]     = $e.value
      elif (.devDependencies // {})[$e.key]  then .devDependencies[$e.key]  = $e.value
      elif (.peerDependencies // {})[$e.key] then .peerDependencies[$e.key] = $e.value
      else . end)
  ' "$BASELINE_PKG" > "$CLIENT/package.json.tmp"
  mv "$CLIENT/package.json.tmp" "$CLIENT/package.json"
}

revert_to_baseline() {
  cp "$BASELINE_PKG"  "$CLIENT/package.json"
  cp "$BASELINE_LOCK" "$ROOT/deno.lock"
}

commit_baseline() {
  cp "$CLIENT/package.json" "$BASELINE_PKG"
  cp "$ROOT/deno.lock"      "$BASELINE_LOCK"
}

# VERIFY_MODE controls which checks each probe runs.
#   fast  = install + check (typecheck only)         - used for phase-1 bisection
#   full  = install + check + tests                  - used for phase-2 bisection
VERIFY_MODE="${VERIFY_MODE:-fast}"

verify() {
  local label="$1"
  local log_file="$LOG_DIR/probe-$(printf '%03d' "$PROBE_COUNT")-${label}.log"

  log "  ⤷ install + check $([ "$VERIFY_MODE" = "full" ] && echo "+ tests") (mode=$VERIFY_MODE, log: $log_file)"
  if ! (cd "$ROOT" && deno install --allow-scripts) > "$log_file" 2>&1; then
    log "  ✗ install failed"
    return 1
  fi

  if [ "$VERIFY_MODE" = "fast" ]; then
    if ! (cd "$CLIENT" && deno task check) >> "$log_file" 2>&1; then
      log "  ✗ check failed"
      dump_probe_log "$log_file"
      return 1
    fi
    log "  ✓ verify passed (check)"
    return 0
  fi

  # full mode: check + test in parallel.
  local check_log="${log_file%.log}.check.log"
  local test_log="${log_file%.log}.test.log"
  (cd "$CLIENT" && deno task check) > "$check_log" 2>&1 &
  local check_pid=$!
  (cd "$CLIENT" && deno task test:doctor) > "$test_log" 2>&1 &
  local test_pid=$!

  local check_ok=0 test_ok=0
  wait "$check_pid" || check_ok=$?
  wait "$test_pid"  || test_ok=$?
  cat "$check_log" "$test_log" >> "$log_file"
  rm -f "$check_log" "$test_log"

  if [ "$check_ok" -ne 0 ] || [ "$test_ok" -ne 0 ]; then
    log "  ✗ verify failed (check_exit=$check_ok test_exit=$test_ok)"
    dump_probe_log "$log_file"
    return 1
  fi
  log "  ✓ verify passed (check + tests)"
  return 0
}

# Dump last 40 lines of a probe log to stderr so the failure reason is
# visible in the workflow log without artifact uploads. Capped to keep
# the workflow log readable when many probes fail in a row.
DUMPED_PROBES=0
dump_probe_log() {
  local log_file="$1"
  if [ "$DUMPED_PROBES" -ge 5 ]; then return; fi
  DUMPED_PROBES=$((DUMPED_PROBES + 1))
  log "  ── tail of $log_file ──"
  tail -n 40 "$log_file" 2>/dev/null | sed 's/^/       /' >&2
  log "  ── end of $log_file ──"
}

# Recursive bisection driven by side effects (no stdout capture).
# Appends adopted bumps to /tmp/passing.txt and rejected to /tmp/failing.txt.
# Updates baseline files for adopted bumps.
find_adoptable() {
  local set_json="$1"
  local count
  count=$(echo "$set_json" | jq 'length')
  [ "$count" -eq 0 ] && return

  PROBE_COUNT=$((PROBE_COUNT + 1))
  local names
  names=$(echo "$set_json" | jq -r 'keys | join(", ")')
  log "── probe #${PROBE_COUNT} | trying ${count} pkg(s): ${names}"

  apply_set "$set_json"
  if verify "n${count}"; then
    echo "$set_json" | jq -r 'to_entries[] | "\(.key)=\(.value)"' >> /tmp/passing.txt
    commit_baseline
    progress
    return
  fi

  if [ "$count" -eq 1 ]; then
    local bad bad_name
    bad=$(echo "$set_json" | jq -r 'to_entries[0] | "\(.key)=\(.value)"')
    bad_name=$(echo "$set_json" | jq -r 'keys[0]')
    echo "$bad" >> /tmp/failing.txt
    cp "$LOG_DIR/probe-$(printf '%03d' "$PROBE_COUNT")-n1.log" \
       "$LOG_DIR/rejected-${bad_name//\//__}.log" 2>/dev/null || true
    revert_to_baseline
    log "  ⛔ rejected: $bad"
    progress
    return
  fi

  # Split set in half. Left half runs first on current baseline; if it
  # adopts anything, baseline rolls forward before the right half starts.
  local mid=$((count / 2))
  local left_json right_json
  left_json=$(echo  "$set_json" | jq --argjson m "$mid" 'to_entries | .[:$m]  | from_entries')
  right_json=$(echo "$set_json" | jq --argjson m "$mid" 'to_entries | .[$m:] | from_entries')

  log "  ↳ splitting: left=${mid}, right=$((count - mid))"
  find_adoptable "$left_json"
  find_adoptable "$right_json"
}

log "╔══════════════════════════════════════════════════════════════════"
log "║ Bisection start: $TOTAL candidate(s)"
log "║ Phase 1: install + typecheck only (fast probes)"
log "╚══════════════════════════════════════════════════════════════════"

VERIFY_MODE=fast find_adoptable "$(cat "$INPUT_JSON")"

log ""
log "▶ Phase 2: final verify (tests + build) on adopted set"
TESTS_OK=0
if (cd "$CLIENT" && deno task test:doctor) > "$LOG_DIR/final-tests.log" 2>&1; then
  log "  ✓ tests passed"
else
  log "  ✗ tests failed - re-bisecting adopted set with full verify"
  TESTS_OK=1
fi

if [ "$TESTS_OK" -ne 0 ] && [ -s /tmp/passing.txt ]; then
  # Re-bisect what phase 1 adopted, this time with full verify (check + tests).
  # Reset baseline to the original pre-bump state so each probe applies on
  # top of a clean tree rather than the already-bumped phase-1 state.
  ADOPTED_JSON=$(jq -nR '[inputs | split("=") | {(.[0]): .[1:] | join("=")}] | add // {}' < /tmp/passing.txt)
  : > /tmp/passing.txt
  reset_baseline_to_original
  log ""
  log "── re-bisecting $(echo "$ADOPTED_JSON" | jq 'length') previously-adopted pkg(s) with tests"
  VERIFY_MODE=full find_adoptable "$ADOPTED_JSON"
fi

log ""
log "▶ Phase 3: final build:doctor on adopted set"
FINAL_BUILD_OK=0
if (cd "$CLIENT" && deno task build:doctor) > "$LOG_DIR/final-build.log" 2>&1; then
  log "  ✓ final build passed"
else
  log "  ✗ final build failed (log: $LOG_DIR/final-build.log)"
  FINAL_BUILD_OK=1
fi

ADOPTED_FINAL=$(count_lines /tmp/passing.txt)
REJECTED_FINAL=$(count_lines /tmp/failing.txt)
log ""
log "═══════════════════════════════════════════════════════════════════"
log " Summary: probes=${PROBE_COUNT} | adopted=${ADOPTED_FINAL} | rejected=${REJECTED_FINAL} | elapsed=$(human_elapsed)"
log " final build:doctor: $([ "$FINAL_BUILD_OK" -eq 0 ] && echo OK || echo FAIL)"
log "═══════════════════════════════════════════════════════════════════"

echo ""
echo "=== Passing ==="
cat /tmp/passing.txt || true
echo ""
echo "=== Failing ==="
cat /tmp/failing.txt || true

exit $FINAL_BUILD_OK
