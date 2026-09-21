import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPurchase } from './vendor-purchase';

describe('VendorPurchase', () => {
  let component: VendorPurchase;
  let fixture: ComponentFixture<VendorPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPurchase],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPurchase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
