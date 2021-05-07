import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsiteInspectionFormComponent } from './onsite-inspection-form.component';

describe('OnsiteInspectionFormComponent', () => {
  let component: OnsiteInspectionFormComponent;
  let fixture: ComponentFixture<OnsiteInspectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsiteInspectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsiteInspectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
