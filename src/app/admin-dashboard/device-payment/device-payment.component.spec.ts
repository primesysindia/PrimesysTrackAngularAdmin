import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePaymentComponent } from './device-payment.component';

describe('DevicePaymentComponent', () => {
  let component: DevicePaymentComponent;
  let fixture: ComponentFixture<DevicePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
