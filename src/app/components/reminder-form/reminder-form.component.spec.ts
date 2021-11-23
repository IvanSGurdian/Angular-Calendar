import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Reminder } from 'src/app/interfaces/reminder';
import { CalendarService } from 'src/app/services/calendar.service';
import { WeatherService } from 'src/app/services/weather.service';

import { ReminderFormComponent } from './reminder-form.component';

describe('ReminderFormComponent', () => {
  let component: ReminderFormComponent;
  let fixture: ComponentFixture<ReminderFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const model = {
    color: '#d50000',
    dateTime: new Date(),
    text: 'Review my assessment',
    city: 'Managua'
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderFormComponent ],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: CalendarService,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.reminderForm.controls.city.setValue('');
    component.reminderForm.controls.dateTime.setValue('');
    component.reminderForm.controls.color.setValue('');
    component.reminderForm.controls.text.setValue('');
    expect(component.reminderForm.valid).toBeFalsy();
  });

  it('text field required validity', () => {
    const text = component.reminderForm.controls.text;
    expect(text.valid).toBeFalsy();

    text.setValue('');
    expect(text.hasError('required')).toBeTruthy();
  });

  it('text field maxLength validity', () => {
    const text = component.reminderForm.controls.text;
    expect(text.valid).toBeFalsy();

    text.setValue('Test reminder text with more than 30 characters');
    expect(text.hasError('maxLength')).toBeTruthy();
  });

  it('color field required validity', () => {
    const color = component.reminderForm.controls.color;
    expect(color.valid).toBeFalsy();

    color.setValue('');
    expect(color.hasError('required')).toBeTruthy();
  });

  it('date field required validity', () => {
    const dateTime = component.reminderForm.controls.dateTime;
    expect(dateTime.valid).toBeFalsy();

    dateTime.setValue(new Date());
    expect(dateTime.hasError('required')).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    spyOn(component, 'submitForm');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.submitForm).toHaveBeenCalledTimes(1);
  });

  it('should save valid reminder', () => {
    const data = {
      color: '#d50000',
      dateTime: new Date(),
      text: 'Review my assessment',
      city: 'Managua'
    }

    it('form should be valid', () => {
      component.reminderForm.setValue(data);
      expect(component.reminderForm.valid).toBeTruthy();
    });
  })
});
