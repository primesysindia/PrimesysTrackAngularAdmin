import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryNotFoundComponent } from './history-not-found.component';

describe('HistoryNotFoundComponent', () => {
  let component: HistoryNotFoundComponent;
  let fixture: ComponentFixture<HistoryNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
