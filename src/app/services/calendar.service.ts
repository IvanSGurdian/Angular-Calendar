import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reminder } from '../interfaces/reminder';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  reminders: Reminder[] = [
    {
      color: '#d50000',
      id: 1,
      dateTime: new Date(),
      text: 'Review my assessment',
      city: 'Managua'
    }
  ];

  constructor() { }

  create(data: Reminder): Reminder {
    data.id = this.reminders.length > 0 ? this.reminders[this.reminders.length - 1].id + 1 : 1;
    this.reminders.push(data);
    return data;
  }

  edit(data: Reminder): Reminder {
    const originalReminder = this.reminders.find(rem => {
      return rem.id === data.id;
    });

    const remIndex = this.reminders.indexOf(originalReminder);
    this.reminders[remIndex] = data;
    return data;
  }

  list(year: string, month: string): Observable<Reminder[]> {
    const filteredReminders = this.reminders.filter(res => {
      const dateObject = new Date(res.dateTime);
      return (dateObject.getMonth() + 1).toString() === month && dateObject.getFullYear().toString() === year;
    });
    return of(filteredReminders);
  }

  delete(reminderId: string): boolean {
    console.log(reminderId);
    return true;
  }
}
