
export default {
  parallel: 1,
  forceExit: true,
  format: [
    ["html", "test-results/e2e/cucumber-report.html"],
    ["junit", "test-results/e2e/cucumber-report.xml"]
  ],
  paths: [
    "./e2e/features/*.feature"
  ],
  import: [
    "./e2e/world.ts",
    "./e2e/support/*.ts"
  ]
}
