const LIMITS = {
  maxMessageLength: 5_000,
  maxFiles: 10,
  maxFileSize: 10 * 1024 * 1024,
  maxTotalSize: 25 * 1024 * 1024,
  allowedExtensions: ['.csv', '.zip'],
} as const;

type ValidationFailure =
  | 'message-required'
  | 'message-too-long'
  | 'no-files'
  | 'too-many-files'
  | 'invalid-extension'
  | 'empty-file'
  | 'file-too-large'
  | 'total-too-large';

type ValidationResult =
  | { ok: true }
  | { ok: false; reason: ValidationFailure };

type TvTimeReportInput = {
  message: string;
  files: ReadonlyArray<File>;
};

const hasAllowedExtension = (name: string): boolean =>
  LIMITS.allowedExtensions.some((extension) =>
    name.toLowerCase().endsWith(extension)
  );

export function validateTvTimeReport(
  { message, files }: TvTimeReportInput,
): ValidationResult {
  if (message.trim().length === 0) {
    return { ok: false, reason: 'message-required' };
  }
  if (message.length > LIMITS.maxMessageLength) {
    return { ok: false, reason: 'message-too-long' };
  }

  if (files.length === 0) return { ok: false, reason: 'no-files' };
  if (files.length > LIMITS.maxFiles) {
    return { ok: false, reason: 'too-many-files' };
  }

  const hasInvalidExtension = files.some((file) =>
    !hasAllowedExtension(file.name)
  );
  if (hasInvalidExtension) return { ok: false, reason: 'invalid-extension' };

  const hasEmptyFile = files.some((file) => file.size === 0);
  if (hasEmptyFile) return { ok: false, reason: 'empty-file' };

  const hasOversizedFile = files.some((file) => file.size > LIMITS.maxFileSize);
  if (hasOversizedFile) return { ok: false, reason: 'file-too-large' };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > LIMITS.maxTotalSize) {
    return { ok: false, reason: 'total-too-large' };
  }

  return { ok: true };
}
