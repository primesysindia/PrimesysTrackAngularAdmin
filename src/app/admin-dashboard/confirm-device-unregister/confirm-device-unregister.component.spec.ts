import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeviceUnregisterComponent } from './confirm-device-unregister.component';

describe('ConfirmDeviceUnregisterComponent', () => {
  let component: ConfirmDeviceUnregisterComponent;
  let fixture: ComponentFixture<ConfirmDeviceUnregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeviceUnregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeviceUnregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
