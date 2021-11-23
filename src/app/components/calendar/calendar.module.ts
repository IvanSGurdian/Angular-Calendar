import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderFormModule } from '../reminder-form/reminder-form.module';


@NgModule({
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    ReminderFormModule,
  ],
  entryComponents: [ReminderFormComponent],
})
export class CalendarModule { }
