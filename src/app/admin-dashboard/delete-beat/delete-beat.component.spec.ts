import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBeatComponent } from './delete-beat.component';

describe('DeleteBeatComponent', () => {
  let component: DeleteBeatComponent;
  let fixture: ComponentFixture<DeleteBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
