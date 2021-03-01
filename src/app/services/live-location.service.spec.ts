import { TestBed } from '@angular/core/testing';

import { LiveLocationService } from './live-location.service';

describe('LiveLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveLocationService = TestBed.get(LiveLocationService);
    expect(service).toBeTruthy();
  });
});
