import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Documento } from '../../../../models/documento.model';
import { DocumentoTipo } from '../../../../models/documento-tipo.model';

import { DocumentoService } from '../../../../core/services/documento.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DocumentoFormComponent } from '../documento-form/documento-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conductor-documentos',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './conductor-documentos.component.html',
  styleUrl: './conductor-documentos.component.css'
})
export class ConductorDocumentosComponent implements OnChanges {
  @Input() idConductor: number = 0;

  displayedColumns: string[] = ['id', 'tipoDocumento', 'descripcion', 'fechaVencimiento', 'estado', 'acciones'];
  documents: Documento[] = [];
  documentsTipos: DocumentoTipo[] = [];

  constructor(
    private documentoService: DocumentoService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit() {
    this.loadDocumentTipos();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['idConductor'] && this.idConductor) {
      this.loadDocuments();
    }
  }

  loadDocuments() {
    this.documentoService.getDocumentsByConductor(this.idConductor).subscribe(
      {
        next: (docs) => {
          this.documents = docs;
        },
        error: (error) => {
          console.error('Error fetching documents', error);
        }
      }
    );
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(DocumentoFormComponent, {
      width: '500px',
      data: { idEntidad: this.idConductor, tipoEntidad: 'CONDUCTOR' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocuments();
      }
    });
  }

  openEditDialog(document: Documento) {
    const dialogRef = this.dialog.open(DocumentoFormComponent, {
      width: '500px',
      data: { document },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocuments();
      }
    });
  }

  downloadDocument(doc: Documento) {
    this.documentoService.downloadDocument(doc.idDocumento).subscribe(
      {
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.rutaArchivo;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading document', error);
        }
      }
    );
  }

  getFileNameFromRutaArchivo(rutaArchivo: string): string {
    return rutaArchivo.substring(rutaArchivo.lastIndexOf('/') + 1);
  }

  deleteDocument(id: number) {
    // Implement confirmation dialog if desired
    console.log('Deleting document', id);

    Swal.fire({
      title: '¿Estás seguro de eliminar el documento?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentoService.deleteDocument(id).subscribe(
          {
            next: () => {
              Swal.fire('Documento eliminado', 'El documento ha sido eliminado correctamente', 'success');
              this.loadDocuments();
            },
            error: (error) => {
              console.error('Error deleting document', error);
            }
          }
        );
      }
    });    
  }

  loadDocumentTipos() {
    this.documentoService.getDocumentoTipos().subscribe(
      {
        next: (types) => {
          this.documentsTipos = types;
        },
        error: (error) => {
          console.error('Error al obtener los tipos de documentos', error);
        }
      }
    );
  }

  getTipoDocumentoNombre(idTipo: number): string {
    return this.documentsTipos.find((tipo) => tipo.idDocumentoTipo === idTipo)?.nombreTipo || 'Desconocido';
  }

  getTipoDocumentoDescripcion(idTipo: number): string {
    return this.documentsTipos.find((tipo) => tipo.idDocumentoTipo === idTipo)?.descripcion || 'Desconocido';
  }
}
