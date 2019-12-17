import { TestBed } from '@angular/core/testing';

import { DiccionaryService } from './diccionary.service';

describe('DiccionaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiccionaryService = TestBed.get(DiccionaryService);
    expect(service).toBeTruthy();
  });
});
