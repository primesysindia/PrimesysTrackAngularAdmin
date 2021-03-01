import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatmasterBeatComponent } from './add-patmaster-beat.component';

describe('AddPatmasterBeatComponent', () => {
  let component: AddPatmasterBeatComponent;
  let fixture: ComponentFixture<AddPatmasterBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatmasterBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatmasterBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
