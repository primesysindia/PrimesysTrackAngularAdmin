import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeymenBeatVerificationComponent } from './keymen-beat-verification.component';

describe('KeymenBeatVerificationComponent', () => {
  let component: KeymenBeatVerificationComponent;
  let fixture: ComponentFixture<KeymenBeatVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeymenBeatVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeymenBeatVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
