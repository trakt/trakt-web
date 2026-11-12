export type CountUpProps = {
  value: number;
  active: boolean;
  format: (value: number) => string;
  duration: number;
};
