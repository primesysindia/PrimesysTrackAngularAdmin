import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKeymenMutipleBeatComponent } from './add-keymen-mutiple-beat.component';

describe('AddKeymenMutipleBeatComponent', () => {
  let component: AddKeymenMutipleBeatComponent;
  let fixture: ComponentFixture<AddKeymenMutipleBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKeymenMutipleBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKeymenMutipleBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
