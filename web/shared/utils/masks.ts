import { ArchivoExpediente } from 'shared/seduc-interfaces';
import { CasefileDocument } from 'shared/interfaces';

export function getMasks() {
  return {
    phone: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    curp: [/[A-Z]/, /[AEIOUX]/, /[A-Z]/, /[A-Z]/, /[0-9]/, /[0-9]/,
           /[0-1]/, /[0-9]/, /[0-3]/, /[0-9]/, /[MH]/, /[A-Z]/, /[A-Z]/,
           /[BCDFGHJKLMNÑPQRSTVWXYZ]/, /[BCDFGHJKLMNÑPQRSTVWXYZ]/, /[BCDFGHJKLMNÑPQRSTVWXYZ]/, /[0-9,A-Z]/,
           /[0-9]/]
  };
}

export function initArchivoExpediente(label: string, order: number) {
  return {
    agregado: '',
    almacenado: false,
    cancelado: false,
    curpAlumno: '',
    deposito: '',
    etiqueta: label,
    extension: 'N/A',
    modificado: '',
    nombre: '',
    notificacionEnviada: false,
    orden: order,
    validado: 0,
    cecytDocument: true
  };
}

export function toCasefileDocument(file: ArchivoExpediente) {
  return {
    fileType: file.extension,
    id: '',
    label: file.etiqueta,
    name: file.nombre,
    order: file.orden,
    type: 1,
    storaged: file.almacenado,
    status: file.validado
  } as CasefileDocument;
}

export function initCasefileDocument(documentLabel: string, documentOrder: number, documentType: number) {
  return {
    fileType: 'N/A',
    id: '',
    label: documentLabel,
    name: '',
    order: documentOrder,
    type: documentType,
    storaged: false,
    status: 0
  } as CasefileDocument;
}
