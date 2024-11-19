import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentoService } from '../../../../core/services/documento.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentoTipo } from '../../../../models/documento-tipo.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documento-form',
  standalone: true,
  imports: [
        // Angular Modules
        CommonModule,
        ReactiveFormsModule,
        // Angular Material Modules
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,   // Asegurarse de importar este módulo
        MatNativeDateModule,   // Asegurarse de importar este módulo
        MatButtonModule,
  ],
  providers: [ {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
  templateUrl: './documento-form.component.html',
  styleUrl: './documento-form.component.css'
})
export class DocumentoFormComponent {


  documentForm: FormGroup;
  fileToUpload: File | null = null;
  documentTipos: DocumentoTipo[] = [];
  isEditMode = false;

  readonly startDate = new Date(2000, 0, 1);

  documentoEstados: string[] = [
    'VIGENTE',
    'VENCIDO',
    'OBSERVADO',
  ];
  
  constructor(
    private fb: FormBuilder,
    private documentoService: DocumentoService,
    public dialogRef: MatDialogRef<DocumentoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        this.isEditMode = !!data.document;
        // Initialize the form
        this.documentForm = this.fb.group({
          idDocumentoTipo: [
            data.document?.idDocumentoTipo || '',
            Validators.required,
          ],
          fechaVencimiento: [
            data.document?.fechaVencimiento || '',
            Validators.required,
          ],
          estadoDocumento: [
            data.document?.estadoDocumento || '',
            Validators.required,
          ],
          idEntidad: [
            data.idEntidad || data.document?.idEntidad || '',
            Validators.required,
          ],
          tipoEntidad: [
            data.tipoEntidad || data.document?.tipoEntidad || '',
            Validators.required,
          ],
        });
        this.loadDocumentTipos();
  }

  loadDocumentTipos() {
    this.documentoService.getDocumentoTipos().subscribe(
      {
        next: (types) => {
          this.documentTipos = types;
        },
        error: (error) => {
          console.error('Error fetching document types', error);
        }
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && !this.isSupportedFileType(file)) {
      alert('Tipo de archivo no soportado.');
      return;
    }
    this.fileToUpload = file;
  }

  isSupportedFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return allowedTypes.includes(file.type);
  }

  onSubmit() {
    if (this.documentForm.invalid) {
      return;
    }

    const formattedDate = moment.default(this.documentForm.value.fechaVencimiento).format('YYYY-MM-DD');
    this.documentForm.get('fechaVencimiento')?.setValue(formattedDate);
    
    const formData = new FormData();
    Object.keys(this.documentForm.controls).forEach((key) => {
      formData.append(key, this.documentForm.get(key)?.value);
    });
    if (this.isEditMode) {
      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
      }
      this.documentoService
        .updateDocument(this.data.document.idDocumento, formData)
        .subscribe(
          {
            next: () => {
              Swal.fire({
                title: 'Documento actualizado',
                text: 'El documento ha sido actualizado correctamente.',
                icon: 'success',
              });
              this.dialogRef.close(true);
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al actualizar el documento.',
                icon: 'error',
              });
              console.error('Error al actualizar el documento', error);
            }
          }
        );
    } else {
      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Debe seleccionar un archivo.',
          icon: 'error',
        });
        return;
      }
      this.documentoService.createDocument(formData).subscribe(
        {
          next: () => {
            Swal.fire({
              title: 'Documento subido',
              text: 'El documento ha sido cargado correctamente.',
              icon: 'success',
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al subir el documento.',
              icon: 'error',
            });
            console.error('Error al subir el documento', error);
          }
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
