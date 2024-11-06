import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';

import { ConductorService } from '../../../../core/services/conductor.service';

@Component({
  selector: 'app-conductor-listar',
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
  templateUrl: './conductor-listar.component.html',
  styleUrl: './conductor-listar.component.css'
})
export class ConductorListarComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = [
    'nombres',
    'paterno',
    'materno',
    'ci',
    'licencia',
    'celular',
    'fechaContrato',
    'estado',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>();
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private conductorService: ConductorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadConductores();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadConductores(page: number = 0, size: number = 5, sort: string = 'idConductor', order: string = 'asc') {
    this.conductorService.getConductores(page, size, sort, order).subscribe(data => {
      this.dataSource.data = data.content;
      this.totalElements = data.totalElements;
    });
  }

  onPaginateChange(event: PageEvent) {
    this.loadConductores(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction);
  }

  onSortChange(sort: Sort) {
    this.loadConductores(this.paginator.pageIndex, this.paginator.pageSize, sort.active, sort.direction);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nombreCompleto(row: any): string {
    return `${row.nombres} ${row.paterno} ${row.materno}`;
  }

  verInfoConductor(id: number) {
    this.router.navigate(['/admin/conductores/informacion', id]); // Navega a la ruta de detalles
  }
}
