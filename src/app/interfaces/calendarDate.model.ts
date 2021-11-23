import { Reminder } from './reminder';

export interface CalendarDate {
    date: string;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    reminders?: Reminder[];
}
