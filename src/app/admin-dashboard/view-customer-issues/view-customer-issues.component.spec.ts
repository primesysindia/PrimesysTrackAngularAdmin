import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerIssuesComponent } from './view-customer-issues.component';

describe('ViewCustomerIssuesComponent', () => {
  let component: ViewCustomerIssuesComponent;
  let fixture: ComponentFixture<ViewCustomerIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
