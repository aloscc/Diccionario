import { TestBed } from '@angular/core/testing';

import { IonicgestureconfigService } from './ionicgestureconfig.service';

describe('IonicgestureconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicgestureconfigService = TestBed.get(IonicgestureconfigService);
    expect(service).toBeTruthy();
  });
});
