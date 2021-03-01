import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymenBeatApprovalComponent } from './keymen-beat-approval.component';

describe('KeymenBeatApprovalComponent', () => {
  let component: KeymenBeatApprovalComponent;
  let fixture: ComponentFixture<KeymenBeatApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymenBeatApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymenBeatApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
