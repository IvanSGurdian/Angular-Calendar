import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import { CalendarDate } from 'src/app/interfaces/calendarDate.model';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject<boolean>();

  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  INITIAL_YEAR = dayjs().format('YYYY');
  INITIAL_MONTH = dayjs().format('M');

  currentMonthDays: CalendarDate[];
  previousMonthDays: CalendarDate[];
  nextMonthDays: CalendarDate[];
  days: CalendarDate[];
  selectedMonth;
  today = dayjs().format('YYYY-MM-DD');
  forecasts = {
    city: '',
    list: []
  };

  constructor(
    private calendarService: CalendarService,
    private weatherService: WeatherService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getRemindersList();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  openReminderForm(reminder?: Reminder) {

    if (!reminder) {
      reminder = {
        dateTime: null,
        text: null,
        city: null,
        color: null
      };
    }

    const dialogRef = this.matDialog.open(ReminderFormComponent, {
      width: '45vw',
      autoFocus: false,
      data: {
        reminder,
      },
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
      this.getRemindersList();
    });
  }

  getNumberOfDays(year: string, month: string): number {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

  createDaysOfMonth(year: string, month: string, reminders: Reminder[] = []): CalendarDate[] {
    return [...Array(this.getNumberOfDays(year, month))].map((day, index) => {

      const date =  dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD');
      const filteredReminders = reminders.filter(rem => {
        return dayjs(rem.dateTime).format('YYYY-MM-DD') === date;
      });

      const calendarDate: CalendarDate = {
        date,
        dayOfMonth: index + 1,
        isCurrentMonth: true,
        reminders: filteredReminders.sort((a, b) => {
          return dayjs(a.dateTime).isAfter(dayjs(b.dateTime)) ? 1 : -1;
        })
      };

      return calendarDate;
    });
  }

  getWeekday(date: string): number {
    return dayjs(date).weekday();
  }

  createPreviousMonthDays(year: string, month: string): CalendarDate[] {
    const firstDayOfMonth = this.getWeekday(this.currentMonthDays[0].date);

    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

    const visibleNumberOfDays = firstDayOfMonth ? firstDayOfMonth : 0;

    const previousMonthLastDay = dayjs(this.currentMonthDays[0].date).subtract(visibleNumberOfDays, 'day').date();

    return [...Array(visibleNumberOfDays)].map((day, index) => {
      const calendarDate: CalendarDate = {
        date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastDay + index}`).format('YYYY-MM-DD'),
        dayOfMonth: previousMonthLastDay + index,
        isCurrentMonth: false
      };

      return calendarDate;
    });
  }

  createNextMonthDays(year: string, month: string): CalendarDate[] {
    const lastDayOfMonth = this.getWeekday(`${year}-${month}-${this.currentMonthDays.length}`);

    const visibleNumberOfDays = lastDayOfMonth ? 6 - lastDayOfMonth : lastDayOfMonth;

    return [...Array(visibleNumberOfDays)].map((day, index) => {
      const calendarDate: CalendarDate = {
        date: dayjs(`${year}-${Number(month) + 1}-${index + 1}`).format('YYYY-MM-DD'),
        dayOfMonth: index + 1,
        isCurrentMonth: false
      };

      return calendarDate;
    });
  }

  createCalendar(year = this.INITIAL_YEAR, month = this.INITIAL_MONTH, reminders: Reminder[] = []): void {
    this.selectedMonth = dayjs(new Date(Number(year), Number(month) - 1)).format('MMMM YYYY');

    this.currentMonthDays = this.createDaysOfMonth(year, month, reminders);
    this.previousMonthDays = this.createPreviousMonthDays(year, month);
    this.nextMonthDays = this.createNextMonthDays(year, month);

    this.days = [...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays];
  }

  navigateToPreviousMonth() {
    this.selectedMonth = dayjs(this.selectedMonth).subtract(1, 'month');
    this.getRemindersList(this.selectedMonth.format('YYYY'), this.selectedMonth.format('M'));
  }

  navigateToNextMonth() {
    this.selectedMonth = dayjs(this.selectedMonth).add(1, 'month');
    this.getRemindersList(this.selectedMonth.format('YYYY'), this.selectedMonth.format('M'));
  }

  navigateToToday() {
    this.selectedMonth = dayjs(this.today);
    this.getRemindersList(this.selectedMonth.format('YYYY'), this.selectedMonth.format('M'));
  }

  getRemindersList(year = this.INITIAL_YEAR, month = this.INITIAL_MONTH) {
    this.calendarService.list(year, month).pipe(takeUntil(this.onDestroy$)).subscribe(reminders => {
      this.createCalendar(year, month, reminders);
    });
  }
}
