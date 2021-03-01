import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveHierarchyComponent } from './approve-hierarchy.component';

describe('ApproveHierarchyComponent', () => {
  let component: ApproveHierarchyComponent;
  let fixture: ComponentFixture<ApproveHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
