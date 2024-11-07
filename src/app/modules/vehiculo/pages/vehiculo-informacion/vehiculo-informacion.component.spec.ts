import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculoInformacionComponent } from './vehiculo-informacion.component';

describe('VehiculoInformacionComponent', () => {
  let component: VehiculoInformacionComponent;
  let fixture: ComponentFixture<VehiculoInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculoInformacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiculoInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
