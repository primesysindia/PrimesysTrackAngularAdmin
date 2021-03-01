import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBeatComponent } from './edit-beat.component';

describe('EditBeatComponent', () => {
  let component: EditBeatComponent;
  let fixture: ComponentFixture<EditBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
