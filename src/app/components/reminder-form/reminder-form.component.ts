import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements OnInit {

  reminderForm: FormGroup;
  colorOptions = ['#d50000', '#039be5', '#3f51b5', '#f6bf26', '#33b679', '#616161'];
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  weatherInfo;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {reminder: Reminder},
              private fb: FormBuilder, private calendarService: CalendarService,
              private dialogRef: MatDialog, private weatherService: WeatherService) { }

  ngOnInit(): void {
    if (this.data.reminder.id) {
      this.isEditing = true;
    }

    this.reminderForm = this.fb.group({
      text: [this.data.reminder.text, [Validators.maxLength(30), Validators.required]],
      dateTime: [this.data.reminder.dateTime, Validators.required],
      color: [this.data.reminder.color ? this.data.reminder.color : '#039be5', Validators.required],
      city: [this.data.reminder.city]
    });

    this.reminderForm.get('city').valueChanges.pipe(
      startWith(this.reminderForm.get('city').value),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((evt) => {
        this.isLoading = true;
        this.weatherInfo = null;
        console.log(evt);
        const city = evt;
        const date = dayjs(this.reminderForm.get('dateTime').value);
        if (city !== null) {
          return this.weatherService.getWeatherInformation(city).pipe(catchError(e => {
            this.errorMessage = e.error.message;
            this.isLoading = false;
            return EMPTY;
          }));
        } else {
          this.isLoading = false;
          return EMPTY;
        }
      })
    ).subscribe({
      next: res => {
        this.isLoading = false;
        const datesSet = [...new Set(res.weatherInfo.map(dt => dt.dt_txt).map(dt => dayjs(dt).format('YYYY MM DD')))];

        const dateGroups = datesSet.map(item => {
          const match = res.weatherInfo.filter(w => dayjs(w.dt_txt).format('YYYY MM DD') === item);
          return {
            date: item,
            weather: match.map(w => {
              return {
                time: dayjs(w.dt_txt).format('HH:mm a'),
                details: w.weather[0]
              };
            })
          };
        });

        this.weatherInfo = dateGroups;
      }
    });
  }

  submitForm(): void {
    const reminder: Reminder = this.reminderForm.value;

    if (this.reminderForm.invalid) {
      return;
    }

    if (this.isEditing) {
      reminder.id = this.data.reminder.id;
      this.calendarService.edit(reminder);
    } else {
      this.calendarService.create(reminder);
    }

    this.dialogRef.closeAll();
  }
}
