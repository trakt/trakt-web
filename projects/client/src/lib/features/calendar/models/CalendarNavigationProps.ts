export type CalendarNavigationProps = {
  activeDate: Date;
  maxDate?: Date;
  navigation?: {
    onNext: () => void;
    onPrevious: () => void;
    onReset: () => void;
  };
};
