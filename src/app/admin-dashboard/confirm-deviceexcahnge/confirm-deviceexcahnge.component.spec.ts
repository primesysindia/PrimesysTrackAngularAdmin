import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeviceexcahngeComponent } from './confirm-deviceexcahnge.component';

describe('ConfirmDeviceexcahngeComponent', () => {
  let component: ConfirmDeviceexcahngeComponent;
  let fixture: ComponentFixture<ConfirmDeviceexcahngeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeviceexcahngeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeviceexcahngeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
