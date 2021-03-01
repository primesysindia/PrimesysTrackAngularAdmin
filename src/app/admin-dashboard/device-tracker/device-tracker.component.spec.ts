import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTrackerComponent } from './device-tracker.component';

describe('DeviceTrackerComponent', () => {
  let component: DeviceTrackerComponent;
  let fixture: ComponentFixture<DeviceTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
