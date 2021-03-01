import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDiagnoseComponent } from './device-diagnose.component';

describe('DeviceDiagnoseComponent', () => {
  let component: DeviceDiagnoseComponent;
  let fixture: ComponentFixture<DeviceDiagnoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceDiagnoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDiagnoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
