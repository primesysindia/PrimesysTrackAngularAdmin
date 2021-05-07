import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolmenBeatApprovalComponent } from './patrolmen-beat-approval.component';

describe('PatrolmenBeatApprovalComponent', () => {
  let component: PatrolmenBeatApprovalComponent;
  let fixture: ComponentFixture<PatrolmenBeatApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolmenBeatApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolmenBeatApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
