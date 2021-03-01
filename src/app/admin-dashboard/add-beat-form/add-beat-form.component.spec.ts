import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeatFormComponent } from './add-beat-form.component';

describe('AddBeatFormComponent', () => {
  let component: AddBeatFormComponent;
  let fixture: ComponentFixture<AddBeatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBeatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBeatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
