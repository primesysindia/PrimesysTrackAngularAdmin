import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyTaskViewDialogComponent } from './copy-task-view-dialog.component';

describe('CopyTaskViewDialogComponent', () => {
  let component: CopyTaskViewDialogComponent;
  let fixture: ComponentFixture<CopyTaskViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyTaskViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyTaskViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
