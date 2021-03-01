import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatUpdateComponent } from './beat-update.component';

describe('BeatUpdateComponent', () => {
  let component: BeatUpdateComponent;
  let fixture: ComponentFixture<BeatUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeatUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
