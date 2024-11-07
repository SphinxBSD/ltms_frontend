import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculoRegistrarComponent } from './vehiculo-registrar.component';

describe('VehiculoRegistrarComponent', () => {
  let component: VehiculoRegistrarComponent;
  let fixture: ComponentFixture<VehiculoRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculoRegistrarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiculoRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
