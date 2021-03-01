import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKeymenBeatsComponent } from './edit-keymen-beats.component';

describe('EditKeymenBeatsComponent', () => {
  let component: EditKeymenBeatsComponent;
  let fixture: ComponentFixture<EditKeymenBeatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKeymenBeatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKeymenBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
