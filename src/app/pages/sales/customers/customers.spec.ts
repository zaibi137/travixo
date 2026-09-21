import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersComponent } from './customers'; // Corrected import path and class name

describe('CustomerComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersComponent], // Standalone components are imported directly
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers initial lifecycle hooks and data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});