// documento.model.ts

export interface Documento {
    idDocumento: number;
    idDocumentoTipo: number;
    fechaVencimiento: string;
    estadoDocumento: string;
    idEntidad: number;
    tipoEntidad: 'CONDUCTOR' | 'VEHICULO';
    rutaArchivo: string;

    dominio?: string;
  }
  