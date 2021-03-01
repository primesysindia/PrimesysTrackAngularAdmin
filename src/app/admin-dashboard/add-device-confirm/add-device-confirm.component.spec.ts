import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceConfirmComponent } from './add-device-confirm.component';

describe('AddDeviceConfirmComponent', () => {
  let component: AddDeviceConfirmComponent;
  let fixture: ComponentFixture<AddDeviceConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeviceConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
