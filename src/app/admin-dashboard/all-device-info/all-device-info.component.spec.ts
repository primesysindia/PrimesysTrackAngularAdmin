import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeviceInfoComponent } from './all-device-info.component';

describe('AllDeviceInfoComponent', () => {
  let component: AllDeviceInfoComponent;
  let fixture: ComponentFixture<AllDeviceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDeviceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDeviceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
