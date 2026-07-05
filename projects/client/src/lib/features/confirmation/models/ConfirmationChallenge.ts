export type ConfirmationChallenge = {
  /** Instruction shown above the input (e.g. "Type your username to confirm"). */
  label: string;
  /** The exact text the user must type before the confirm action is enabled. */
  value: string;
  placeholder?: string;
};
