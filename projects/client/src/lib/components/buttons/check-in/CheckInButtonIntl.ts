export type CheckInButtonMeta = {
  title: string;
};

export type CheckInButtonIntl = {
  label: (meta: CheckInButtonMeta) => string;
  text: (meta: CheckInButtonMeta) => string;
};
