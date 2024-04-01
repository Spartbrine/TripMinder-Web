import { AuthenticationService } from 'shared/services/authentication.service';
import { Paginable } from './pagination';
import { ApiService } from 'shared/services/api.service';
import { SaleCanceledService } from 'src/app/services/salecanceled.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FilterParams,
  SearchOptions,
  DialogData,
  User,
  Sale,
  SaleDetail,
  PaymentInmediat,
  Account,
  Client,
  SendEmail,
  SaleCanceled,
  AssignamentCollection,
  Configuration,
} from 'shared/interfaces';
import { Confirm, Toast } from 'shared/alerts';
import { DialogBase } from './dialog.base';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportService } from 'src/app/services/report.service';
import { ConfigurationService } from 'src/app/services/configuration.service'


export interface FilterOption<T> {
  label: string;
  property: keyof T;
}

export abstract class Catalog<T, U extends DialogBase> extends Paginable<T> {
  saleEntity: Sale;
  details: SaleDetail[];
  paymentInmediat: PaymentInmediat;
  email: SendEmail;
  margin = { top: 0, right: 8, bottom: 0, left: 8 };

  saleCanceled: SaleCanceled;
  configuration: Configuration

  /** The params that should be defined for loading and reloading entities */
  abstract params: FilterParams<T>;
  private assignedDefault = false;
  private defaultParams: FilterParams<T> = {};

  /** Object used to save the entity data when it's going to be saved as new */
  entity: T;
  /** Object used to save the entity data temporarily when it's going to be updated */
  temporal: T;
  dialogRef: MatDialogRef<U, T>;
  user: User;

  /** Var used to filtering the entity data */
  filter = false;
  abstract selectedOption: keyof T;
  /**
   * **Example:**
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *
   *  constructor() {
   *    this.filterOptions = [
   *      {
   *        label: 'Nombre',
   *        property: 'name'
   *      }
   *    ]
   *  }
   * }
   * ```
   */
  abstract filterOptions: FilterOption<T>[];
  private defaultKeys: (keyof FilterParams<T>)[] = [];
  search_ = '';

  constructor(
    public service: ApiService<T>,
    public auth: AuthenticationService,
    public dialog: MatDialog,
    public saleCanceledService?: SaleCanceledService,
    public reportService?: ReportService,
    public configurationService?: ConfigurationService

  ) {
    super(service, auth);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.configuration = configurationService.configurationObject
    this.restore();
  }

  get filteredParams() {
    const { params, filterOptions } = this;
    const filtered = {};
    for (const key in params) {
      if (key in params) {
        const option = filterOptions.find(fop => fop.property == key);
        if (option) {
          filtered[key] = option.label;
        }
      }
    }
    return filtered;
  }

  openDialog(
    update: boolean = false,
    id?: number,
    readOnly: boolean = false,
    byField?: number,
    cancel: boolean = false,
    sale: boolean = false,
    type_payment?: string,
    isListClientsWhithDebt?: boolean,
    assignamentCollection?: AssignamentCollection
  ) {
    const catalog = update ? this.search(id) : this.entity;

    this.temporal = { ...catalog };

    const dialogData: DialogData<T> = {
      entity: catalog,
      temporal: this.temporal,
      options: { update, readonly: readOnly, cancel },
      extras: byField,
      type_payment: type_payment,
      assignamentCollection: assignamentCollection,
      configuration: this.configuration
    };

    if (assignamentCollection) {
      this.entity['id_municipality'] = assignamentCollection.id_municipality
      this.entity['id_agent'] = assignamentCollection.id_agent

    }


    this.dialogRef = this.getRefDialog(dialogData);

    this.dialogRef.afterClosed().subscribe((result: T | undefined) => {
      if (result) {
        // const dialogRef = this.dialog.open(LoadingComponent);
        result = this.validateExtras(result);
        if (update) {
          const index = this.entities.indexOf(catalog);
          const id_ = this.getIdFrom(result);
          if (cancel) {
            result['status'] = 'Cancelada';
          }
          this.service.update(id_, result).subscribe(
            response => {
              const message = 'Actualizado correctamente';
              if (index > -1) {
                this.entities[index] = response;
                if (!cancel) {
                  Toast.fire({
                    icon: 'success',
                    title: message,
                  });
                } else {
                  Toast.fire({
                    icon: 'success',
                    title: 'Venta cancelada correctamente',
                  });

                  this.generatePdfSaleCancel(response);
                }
              }
              // dialogRef.close();
            },
            error => {
              Toast.fire({
                icon: 'error',
                title: 'Error en la actualización',
              });
              console.error(error);
              // dialogRef.close();
            }
          );
        } else {
          if (isListClientsWhithDebt) {
            this.service
              .listClientWithDebt(this.params)
              .subscribe(response => (this.entities = response.data.data));
          }
          else {
            this.service.store(result).subscribe(
              response => {
                const message = 'Agregado correctamente';
                this.reload(false,);
                Toast.fire({
                  icon: 'success',
                  title: message,
                });
                if (sale) {
                  this.configuration = this.configurationService.configurationObject
                  const date = new Date();
                  const options = { timeZone: 'America/Mexico_City' };
                  date.toLocaleString('es-MX', options);
                  let output =
                    String(date.getDate()).padStart(2, '0') +
                    '-' +
                    String(date.getMonth() + 1).padStart(2, '0') +
                    '-' +
                    date.getFullYear();
                  let array_date = String(result['sale_date']).split('-');

                  let date_final =
                    array_date[2] + '-' + array_date[1] + '-' + array_date[0];
                  let stringdetail = '';
                  const doc = new jspdf({
                    format: [98, 190]
                  });

                  doc.addImage(this.configuration.image_report, 'png', 5, 5, 20, 7);

                  autoTable(doc, {
                    margin: { top: 3, right: 8, bottom: 0, left: 30 },
                    body: [
                      [
                        {
                          content:
                            this.configuration.name +
                            '\nDIRECCIÓN: ' + this.configuration.direction +
                            '\nTEL: ' + this.configuration.phone,

                          styles: {
                            halign: 'center',
                            fontSize: 8,
                          },
                        },

                        {
                          content:
                            'TICKET DE VENTA' +
                            '\nFolio: ' +
                            response['id'] +
                            '\nFECHA: ' +
                            output,
                          styles: {
                            halign: 'center',
                            fontSize: 8,
                          },
                        },
                      ],
                    ],
                    theme: 'plain',
                    styles: {}
                  });
                  this.details = result['detail'];
                  this.details.forEach(detail => {
                    stringdetail = stringdetail + '\n';
                    stringdetail =
                      stringdetail +
                      detail.product.name +
                      '---------------' +
                      detail.amount +
                      '--------------' +
                      detail.price;
                  });

                  let test = this.details.map(getdata);
                  function getdata(datos) {
                    if (result['type_payment'] == 'Crédito') {
                      return [
                        datos.product.name,
                        datos.amount,
                        '$' + datos.price,
                        '$' + datos.sale_price,
                      ];
                    } else if (result['type_payment'] == 'Contado') {
                      return [
                        datos.product.name,
                        datos.amount,
                        '$' + datos.price,
                        '$' + datos.sale_price,
                      ];
                    }
                  }
                  if (result['type_payment'] == 'Crédito') {

                    // autoTable(doc, {
                    //   margin: this.margin,
                    //   startY: (doc as any).lastAutoTable.finalY + 3,
                    //   body: [
                    //     [
                    //       {
                    //         content:
                    //           'DATOS DEL CLIENTE',
                    //         styles: {
                    //           halign: 'center',
                    //           fontSize: 7,
                    //         },
                    //       },

                    //     ],
                    //   ],
                    //   theme: 'plain',
                    // });

                    autoTable(doc, {
                      margin: this.margin,
                      startY: (doc as any).lastAutoTable.finalY + 3,
                      body: [
                        [
                          // {
                          //   content:
                          //     'Nombre:' +
                          //     '\nUbicación: ' +
                          //     '\nDirección: ' +
                          //     '\nReferencia: ' +
                          //     '\nRecurrencia de pago: ',
                          //   styles: {
                          //     halign: 'left',
                          //     fontSize: 7,
                          //   },
                          // },
                          {
                            content:
                              result['client'].name +
                              '\n' + result['client'].locality.municipality.name + ',' + result['client'].locality.municipality.state.name +
                              '\n' + result['client'].street + ' #' + result['client'].externalNumber + ' x ' + result['client'].streetLine2 + ', ' + result['client'].locality.name +
                              '\n' + result['client'].reference,
                            styles: {
                              halign: 'left',
                              fontSize: 9,
                              fontStyle: 'bold'
                            }
                          },
                          {
                            content:
                              result['client'].payment_type +
                              '\n' + date_final,
                            styles: {
                              halign: 'right',
                              fontSize: 9,
                              fontStyle: 'bold'
                            }
                          },
                        ],
                      ],
                      theme: 'plain',
                    });

                    // interface DataSale {
                    //   ubication: string,
                    //   type_sale: string,
                    //   type_payment: string,
                    //   date: string,
                    // }

                    // const datasSale: DataSale[] = [
                    //   {
                    //     ubication: result['locality'].name + ' (' + result['locality'].municipality.name + ',' + result['locality'].municipality.state.name + ')',
                    //     type_sale: result['type'],
                    //     type_payment: result['type_payment'],
                    //     date: date_final
                    //   }
                    // ]

                    // const testDataSale = datasSale.map(getDataSale)

                    // function getDataSale(datos) {
                    //   return [
                    //     datos.ubication,
                    //     datos.type_sale,
                    //     datos.type_payment,
                    //     datos.date
                    //   ];
                    // }

                    // autoTable(doc, {
                    //   margin: this.margin,
                    //   startY: (doc as any).lastAutoTable.finalY + 1,
                    //   body: [
                    //     [
                    //       {
                    //         content:
                    //           'DATOS DE LA VENTA',
                    //         styles: {
                    //           halign: 'center',
                    //           fontSize: 7,
                    //         },
                    //       },

                    //     ],
                    //   ],
                    //   theme: 'plain',
                    // });

                    // autoTable(doc, {
                    //   margin: this.margin,
                    //   startY: (doc as any).lastAutoTable.finalY + 1,
                    //   columns: [
                    //     {
                    //       header: 'Ubicacion',
                    //       dataKey: 'ubication',
                    //     },
                    //     {
                    //       header: 'Tipo de venta',
                    //       dataKey: 'type_sale'
                    //     },
                    //     {
                    //       header: 'Tipo de pago',
                    //       dataKey: 'type_payment'
                    //     },
                    //     {
                    //       header: 'Fecha de venta',
                    //       dataKey: 'date',
                    //     },
                    //   ],
                    //   body: testDataSale,
                    //   theme: 'grid',
                    //   headStyles: {
                    //     textColor: '#424242',
                    //     fillColor: '#f0f0f0',
                    //     fontSize: 6,
                    //     cellPadding: .9
                    //   },
                    //   bodyStyles: {
                    //     fillColor: '#ffffff',
                    //     fontSize: 6,
                    //     cellPadding: .9
                    //   },
                    // });


                    autoTable(doc, {
                      margin: this.margin,
                      startY: (doc as any).lastAutoTable.finalY + 5,
                      columns: [
                        {
                          header: 'Producto',
                          dataKey: 'product.name',
                        },
                        { header: 'Cantidad', dataKey: 'amount' },
                        { header: 'Precio Total', dataKey: 'price' },
                        {
                          header: 'Precio Individual',
                          dataKey: 'sale_price',
                        },
                      ],
                      body: test,
                      theme: 'striped',
                      headStyles: {
                        textColor: '#ffffff',
                        fillColor: '#808080',
                        fontSize: 8,
                        cellPadding: .9
                      },
                      bodyStyles: {
                        fillColor: '#ffffff',
                        fontSize: 8,
                        cellPadding: .9
                      },
                    });
                  } else if (result['type_payment'] == 'Contado') {
                    autoTable(doc, {
                      margin: this.margin,
                      startY: (doc as any).lastAutoTable.finalY + 5,
                      body: [
                        [
                          {
                            content:
                              '\nTipo de venta: ' +
                              result['type'] +
                              '\nTipo de pago: ' +
                              result['type_payment'] +
                              '\nFecha de venta: ' +
                              date_final,

                            styles: {
                              halign: 'left',
                              fontSize: 9,
                            },
                          },
                        ],
                      ],
                      theme: 'plain',
                      styles: {
                        cellPadding: { top: -3, right: 1, bottom: 0, left: 1 },
                      }
                    });
                    autoTable(doc, {
                      margin: this.margin,
                      startY: (doc as any).lastAutoTable.finalY + 5,
                      columns: [
                        {
                          header: 'Producto',
                          dataKey: 'product.name',
                        },
                        { header: 'Cantidad', dataKey: 'amount' },
                        { header: 'Precio Total', dataKey: 'price' },
                        {
                          header: 'Precio Individual',
                          dataKey: 'sale_price',
                        },
                      ],
                      body: test,
                      theme: 'striped',
                      headStyles: {
                        textColor: '#ffffff',
                        fillColor: '#808080',
                        fontSize: 8,
                        cellPadding: .9
                      },
                      bodyStyles: {
                        fillColor: '#ffffff',
                        fontSize: 8,
                        cellPadding: .9
                      },
                    });
                  }

                  this.paymentInmediat = result['paymentInmediat'];
                  if (this.paymentInmediat.amount != 0) {
                    let totalWithDiscount =
                      Number(result['total']) -
                      Number(this.paymentInmediat.amount_discount);
                    autoTable(doc, {
                      margin: this.margin,
                      startY: (doc as any).lastAutoTable.finalY + 5,
                      body: [
                        [
                          {
                            content:
                              '\nSUBTOTAL: ' +
                              '$' +
                              result['total'] +
                              '\nDESCUENTO: ' +
                              this.paymentInmediat.discount +
                              '%' +
                              '\nDESCUENTO APLICADO: ' +
                              '$' +
                              this.paymentInmediat.amount_discount +
                              '\nTOTAL: ' +
                              '$' +
                              totalWithDiscount,
                            // "\n DATOS DEL PAGO" +

                            // "\n---------------------------" +
                            // "\nMONTO EN EFECTIVO: " + this.paymentInmediat.amount +
                            // "\nCAMBIO: " + this.paymentInmediat.change,

                            styles: {
                              halign: 'right',
                              fontSize: 9,
                            },
                          },
                        ],
                      ],
                      theme: 'plain',
                      styles: {
                        cellPadding: { top: -3, right: 1, bottom: 0, left: 1 },
                      }
                    });
                  }

                  this.service.single(response['id']).subscribe(entity => {
                    if (result['type_payment'] == 'Crédito') {
                      let amountpost =
                        Number(result['total']) - Number(result['payment']);

                      autoTable(doc, {
                        margin: this.margin,
                        startY: (doc as any).lastAutoTable.finalY + 8,
                        body: [
                          [
                            {
                              content:
                                'TOTAL DE LA VENTA: ' +
                                '\nVENDEDOR: ',
                              styles: {
                                halign: 'left',
                                fontSize: 9
                              },
                            },
                            {
                              content:
                                '$' + result['total'].toFixed(2) +
                                '\n' + entity['agent'].name,
                              styles: {
                                halign: 'right',
                                fontSize: 9,
                              },
                            },
                          ],
                        ],
                        theme: 'plain',
                        styles: {
                          cellPadding: { top: -3, right: 1, bottom: 0, left: 1 },
                        }
                      });

                      autoTable(doc, {
                        margin: this.margin,
                        startY: (doc as any).lastAutoTable.finalY + 8,
                        body: [
                          [
                            {
                              content:
                                'Enganche sugerido:' +
                                '\nEnganche dado:',
                              styles: {
                                halign: 'left',
                                fontSize: 9
                              },
                            },
                            {
                              content:
                                '$' + result['suggested_hitch'].toFixed(2) +
                                '\n' +
                                '$' + result['payment'].toFixed(2),
                              styles: {
                                halign: 'right',
                                fontSize: 9
                              },
                            },
                          ],
                        ],
                        theme: 'plain',
                        styles: {
                          cellPadding: { top: -3, right: 1, bottom: 0, left: 1 },
                        }
                      });

                      autoTable(doc, {
                        margin: this.margin,
                        body: [
                          [
                            {
                              content:
                                '---------------------------------------------------------------------',
                              styles: {
                                halign: 'left',
                              },
                            },

                          ],
                        ],
                        theme: 'plain',
                        styles: {
                          cellPadding: { top: -5, right: 1, bottom: 0, left: 1 },
                        }
                      });

                      autoTable(doc, {
                        margin: this.margin,
                        body: [
                          [
                            {
                              content:
                                'Deuda restante: ' +
                                '$' +
                                amountpost.toFixed(2),
                              styles: {
                                halign: 'left',
                                fontSize: 9
                              },
                            },
                            {
                              content:
                                'Cobratario: ' + entity['agent_collector'].name,
                              styles: {
                                halign: 'right',
                                fontSize: 9
                              },
                            },
                          ],
                        ],
                        theme: 'plain',
                        styles: {
                          cellPadding: { top: -5, right: 1, bottom: 0, left: 1 },
                        }
                      });

                      let cells = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
                      cells.length = cells.length - this.details.length
                      autoTable(doc, {
                        margin: this.margin,
                        startY: (doc as any).lastAutoTable.finalY + 2,
                        columns: [
                          {
                            header: 'Fecha',
                          },
                          {
                            header: 'Pago',
                          },
                          {
                            header: 'Resta',
                          },
                          {
                            header: 'Firma',
                          },
                        ],
                        body: cells,
                        theme: 'grid',
                        headStyles: {
                          fillColor: '#808080',
                          halign: 'center',
                          fontSize: 8,
                          lineColor: '#808080',
                          lineWidth: 0.3,
                          cellPadding: .9
                        },
                        bodyStyles: {
                          fontSize: 8,
                          lineColor: 60,
                          lineWidth: 0.3,
                          cellPadding: 1.1
                        }
                      });



                      // doc.addPage('desglose');
                      // doc.addImage(this.configuration.image_report, 'png', 15, 15, 40, 15);
                      // autoTable(doc, {
                      //   body: [
                      //     [
                      //       {
                      //         content:
                      //           'COMERCIALIZADORA LEON' +
                      //           '\n DIRECCIÓN: Homún ' +
                      //           '\n TEL: 9991755456',

                      //         styles: {
                      //           halign: 'right',
                      //           fontSize: 10,
                      //         },
                      //       },

                      //       {
                      //         content:
                      //           'DESGLOSE DE VENTA: ' + '\n' + response['id'] + '\nFECHA: ' + output,
                      //         styles: {
                      //           halign: 'center',
                      //           fontSize: 10,
                      //         },
                      //       },
                      //     ],
                      //   ],
                      //   theme: 'plain',
                      //   styles: {},
                      // });



                      // autoTable(doc, {
                      //   columns: [
                      //     {
                      //       header: 'Fecha',
                      //     },
                      //     {
                      //       header: 'Pago',
                      //     },
                      //     {
                      //       header: 'Resta',
                      //     },
                      //     {
                      //       header: 'Firma',
                      //     },
                      //   ],
                      //   body: [
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //     [],
                      //   ],
                      //   theme: 'grid',
                      //   headStyles: {
                      //     fillColor: this.configuration.color_table,
                      //     halign: 'center',
                      //   },
                      // });

                    }
                    doc.setDrawColor(52, 58, 64);
                    //doc.rect(14, 26, 182, 24);
                    doc.setLineWidth(0.2);
                    doc.save('TicketVenta-' + response['id'] + '.pdf');
                  });

                }
                this.restore();
                // dialogRef.close();
              },
              error => {
                Toast.fire({
                  icon: 'error',
                  title: 'Error en la actualización',
                });
                console.error(error);
                // dialogRef.close();
              }
            );
          }
        }
      } else {
        if (update) {
          const index = this.entities.indexOf(catalog);
          this.entities[index] = this.temporal;
        } else {
          this.restore();
        }
      }
    });
  }

  generatePdfSaleCancel(result: T) {
    this.configuration = this.configurationService.configurationObject
    const docSaleCancel = new jspdf();
    const date = new Date();
    const options = { timeZone: 'America/Mexico_City' };
    date.toLocaleString('es-MX', options);
    let output =
      String(date.getDate()).padStart(2, '0') +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      date.getFullYear();
    docSaleCancel.addImage(this.configuration.image_report, 'png', 15, 15, 40, 15);
    autoTable(docSaleCancel, {
      body: [
        [
          {
            content:
              this.configuration.name +
              '\n DIRECCIÓN: ' + this.configuration.direction +
              '\n TEL: ' + this.configuration.phone,

            styles: {
              halign: 'right',
              fontSize: 10,
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {},
    });

    autoTable(docSaleCancel, {
      body: [
        [
          {
            content: 'CANCELACIÓN DE VENTA',

            styles: {
              halign: 'center',
              fontSize: 25,
              textColor: '#FF0000',
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {},
    });

    this.saleCanceledService
      .list({ id_sale: result['id'] })
      .subscribe(response => {
        this.saleCanceled = response.data.data[0];
        autoTable(docSaleCancel, {
          body: [
            [
              {
                content: 'Folio de Venta: ' + this.saleCanceled.id_sale,
                styles: {
                  halign: 'center',
                  fontSize: 15,
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {},
        });
        autoTable(docSaleCancel, {
          body: [
            [
              {
                content:
                  'Venta hecha por: ' + this.saleCanceled.sale.agent.name,
                styles: {
                  halign: 'center',
                  fontSize: 15,
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {},
        });
        autoTable(docSaleCancel, {
          body: [
            [
              {
                content: 'Razón: ' + this.saleCanceled.reason,
                styles: {
                  halign: 'center',
                  fontSize: 15,
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {},
        });
        autoTable(docSaleCancel, {
          body: [
            [
              {
                content:
                  'Fecha de Cancelación: ' + this.saleCanceled.date_canceled,
                styles: {
                  halign: 'center',
                  fontSize: 15,
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {},
        });

        const pageCount = docSaleCancel.getNumberOfPages();
        for (var i = 1; i <= pageCount; i++) {
          docSaleCancel.setPage(i);
          docSaleCancel.setFontSize(8);
          docSaleCancel.text(
            'Página ' + String(i) + ' de ' + String(pageCount),
            210 - 20,
            320 - 30,
            null,
            null
          );
        }
        let nameDocument = 'VentaCancelada' + '_' + result['id'] + '.pdf';
        docSaleCancel.save(nameDocument);
        var blobPDF = docSaleCancel.output('blob');
        var base64data;

        var reader = new FileReader();
        reader.readAsDataURL(blobPDF);
        reader.onload = (e: any) => {
          base64data = e.target.result! as string;
          this.email = {
            name: nameDocument,
            email: 'jona_sabido@hotmail.com',
            subject: 'Venta Cancelada',
            content: 'a',
            file: base64data,
          };
          this.service.sendEmail(this.email).subscribe(
            response => {
              const message = 'Email enviado';
              Toast.fire({
                icon: 'success',
                title: message,
              });
            },
            error => {
              Toast.fire({
                icon: 'error',
                title: 'Error al enviar email',
              });
            }
          );
        };
      });

  }

  public delete(id: number) {
    const msgtitle = '¿Estás seguro?';
    const msgtext = 'No será capaz de revertir esto';
    const btnConfirm = 'Confirmar';
    const btnCancel = 'Cancelar';
    Confirm.fire({
      title: msgtitle,
      text: msgtext,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: btnConfirm,
      cancelButtonText: btnCancel,
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        this.service.destroy(id).subscribe(
          response => {
            const message = 'Correcto!';
            const msgtext_ = 'Se eliminó correctamente';
            Toast.fire(message, msgtext_, 'success');
            this.reload(true);
          },
          error => Toast.fire('Error', 'Ocurrió un error al eliminar', 'error')
        );
      }
    });
  }

  toggleFilter() {
    this.filter = !this.filter;
    const { filterOptions } = this;
    if (this.filter) {
      if (filterOptions.length) {
        this.selectedOption = filterOptions[0].property;
        this.extractDefaultParams();
      }
    } else {
      this.restoreDefaultParams();
      this.selectedOption = undefined;
      this.reload(false,);
    }
  }

  cleanFilter() {
    this.restoreDefaultParams();
    this.selectedOption = undefined;
    this.filter = false;
    this.reload(false,);
  }

  private extractDefaultParams() {
    const { params, assignedDefault } = this;

    if (params && !assignedDefault) {
      Object.assign(this.defaultParams, params);
      this.assignedDefault = true;
    }

    this.params = {};

    if ('limit' in this.defaultParams) {
      this.params.limit = this.defaultParams.limit;
    }

    if ('rel' in this.defaultParams) {
      this.params.rel = this.defaultParams.rel;
    }

    this.defaultKeys.forEach(
      key => (this.params[key] = this.defaultParams[key])
    );
  }

  public setDefaultParam<K extends keyof FilterParams<T>>(
    key: K,
    value: FilterParams<T>[K]
  ) {
    this.defaultParams[key] = value;
    this.params[key] = value;
    this.defaultKeys.push(key);
  }

  private restoreDefaultParams() {
    this.params = {};
    Object.assign(this.params, this.defaultParams);
  }

  /**
   * This method is useful when you need to do extra validation to an entity.
   *
   * If there's no validation for this `entity: T`, the normal behaviour looks
   * like this:
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected validateExtras(entity: User): User {
   *    return entity;
   *  }
   * }
   * ```
   */
  protected abstract validateExtras(entity: T): T;
  /**
   * Retrieves the `id` value from the given `entity: T`
   *
   * **Note:** This method normally behaves like this:
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected getIdFrom(entity: User): string {
   *    return entity.id;
   *  }
   * }
   * ```
   *
   * The reason why this method is abstract is because it could vary which property
   * is the `id` of the type `<T>`
   */
  protected abstract getIdFrom(entity: T): number;
  /**
   * Searchs for an entity with the param `id` into the `this.entities` property
   *
   * **Note:** This method normally behaves like this:
   * ```ts
   *  this.entities.find(e => e.id == id);
   * ```
   *
   * The reason why this method is abstract is because it could vary which property
   * is the `id` of the type `<T>`
   */
  protected abstract search(id: number): T;
  protected abstract getRefDialog(
    dialogData: DialogData<T, any>
  ): MatDialogRef<U, T>;
  /**
   * This method consist on initialize the `entity: T` to the default values
   *
   * **Example:**
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected restore(): void {
   *    this.entity = {
   *        id: '',
   *        name: '',
   *        password: ''
   *        // etc...
   *    }
   *  }
   * }
   * ```
   */
  protected abstract restore(): void;
}
