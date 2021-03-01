import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviceDetailsComponent } from './edit-device-details.component';

describe('EditDeviceDetailsComponent', () => {
  let component: EditDeviceDetailsComponent;
  let fixture: ComponentFixture<EditDeviceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeviceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
