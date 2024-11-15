import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterLink, Router } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-vehiculo-listar',
  standalone: true,
  imports: [
    RouterLink,
    MatPaginator,
    MatSort,
    MatSortModule,
    MatFormFieldModule,
    MatLabel,
    CommonModule,
    MatTableModule,
    MatInput,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './vehiculo-listar.component.html',
  styleUrl: './vehiculo-listar.component.css'
})
export class VehiculoListarComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'placa',
    'marca',
    'modelo',
    'anio',
    'estado',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>();
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehiculoService: VehiculoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVehiculos();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  loadVehiculos(page: number = 0, size: number = 5, sort: string = 'id', order: string = 'asc') {
    this.vehiculoService.getVehiculos(page, size, sort, order).subscribe(
      {
        next: (data) => {
          this.dataSource.data = data.content;
          this.totalElements = data.totalElements;
        },
        error: (error) => {
          console.error(error);
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPaginateChange(event: PageEvent) {
    this.loadVehiculos(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction);
  }

  onSortChange(sort: Sort) {
    this.loadVehiculos(this.paginator.pageIndex, this.paginator.pageSize, sort.active, sort.direction);
  }

  verInfoVehiculo(id: number) {
    this.router.navigate(['/admin/vehiculos/informacion', id]);
  }
}
