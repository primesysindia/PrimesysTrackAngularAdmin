import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRdpsComponent } from './upload-rdps.component';

describe('UploadRdpsComponent', () => {
  let component: UploadRdpsComponent;
  let fixture: ComponentFixture<UploadRdpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRdpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRdpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
