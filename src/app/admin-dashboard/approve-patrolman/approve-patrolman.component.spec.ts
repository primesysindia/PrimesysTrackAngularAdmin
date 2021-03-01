import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePatrolmanComponent } from './approve-patrolman.component';

describe('ApprovePatrolmanComponent', () => {
  let component: ApprovePatrolmanComponent;
  let fixture: ComponentFixture<ApprovePatrolmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePatrolmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePatrolmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
