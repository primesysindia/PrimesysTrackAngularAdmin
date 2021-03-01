import { TestBed } from '@angular/core/testing';

import { GetDeviceService } from './get-device.service';

describe('GetDeviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDeviceService = TestBed.get(GetDeviceService);
    expect(service).toBeTruthy();
  });
});
