export interface Reminder {
  id?: number;
  text: string;
  dateTime: Date;
  color: string;
  city?: string;
  weather?: {
    icon: string;
    description: string;
    main: string;
  };
}
