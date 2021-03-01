import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoIssueComponent } from './demo-issue.component';

describe('DemoIssueComponent', () => {
  let component: DemoIssueComponent;
  let fixture: ComponentFixture<DemoIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
