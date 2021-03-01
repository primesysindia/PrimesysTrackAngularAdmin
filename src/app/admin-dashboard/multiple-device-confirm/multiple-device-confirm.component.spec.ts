import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDeviceConfirmComponent } from './multiple-device-confirm.component';

describe('MultipleDeviceConfirmComponent', () => {
  let component: MultipleDeviceConfirmComponent;
  let fixture: ComponentFixture<MultipleDeviceConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleDeviceConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDeviceConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
