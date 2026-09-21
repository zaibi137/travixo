import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLedger } from './vendor-ledger';

describe('VendorLedger', () => {
  let component: VendorLedger;
  let fixture: ComponentFixture<VendorLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorLedger],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorLedger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
