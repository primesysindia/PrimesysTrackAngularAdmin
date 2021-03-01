import { TestBed } from '@angular/core/testing';

import { BeatServiceService } from './beat-service.service';

describe('BeatServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeatServiceService = TestBed.get(BeatServiceService);
    expect(service).toBeTruthy();
  });
});
