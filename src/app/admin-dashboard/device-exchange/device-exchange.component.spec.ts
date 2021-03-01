import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceExchangeComponent } from './device-exchange.component';

describe('DeviceExchangeComponent', () => {
  let component: DeviceExchangeComponent;
  let fixture: ComponentFixture<DeviceExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
