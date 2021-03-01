import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeviceRemoveComponent } from './confirm-device-remove.component';

describe('ConfirmDeviceRemoveComponent', () => {
  let component: ConfirmDeviceRemoveComponent;
  let fixture: ComponentFixture<ConfirmDeviceRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeviceRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeviceRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
