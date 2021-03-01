import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRemoveUnregisterComponent } from './device-remove-unregister.component';

describe('DeviceRemoveUnregisterComponent', () => {
  let component: DeviceRemoveUnregisterComponent;
  let fixture: ComponentFixture<DeviceRemoveUnregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceRemoveUnregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRemoveUnregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
