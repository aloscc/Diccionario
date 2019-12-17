import { TestBed } from '@angular/core/testing';

import { FilereaderService } from './filereader.service';

describe('FilereaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilereaderService = TestBed.get(FilereaderService);
    expect(service).toBeTruthy();
  });
});
