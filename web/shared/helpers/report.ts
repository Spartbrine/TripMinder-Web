import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SaleDetail,
  PaymentInmediat,
  Account,
  Client,
} from 'shared/interfaces';
import { ReportService } from 'src/app/services/report.service';
import configuration from 'src/app/configuration-report.json';


export class Report {
  details: SaleDetail[];
  account: Account;
  client: Client;
  paymentInmediat: PaymentInmediat;


  constructor(
    public reportService: ReportService,
  ) {

  }

  generateTicketSale(result: any) {
    
      let stringdetail = '';
      const doc = new jspdf();


      doc.addImage(this.configuration.image_report, 'png', 15, 15, 40, 15);

      autoTable(doc, {
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

            {
              content: 'REPORTE DE VENTA' + '\nFECHA: ' + result['sale_date'],
              styles: {
                halign: 'center',
                fontSize: 10,
              },
            },
          ],
        ],
        theme: 'plain',
        styles: {},
      });

      this.account = result['account'];
      this.details = result['detail'];
      this.client = result['client'];
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

      autoTable(doc, {
        body: [
          [
            {
              content:
                '\nCLIENTE: ' +
                this.account.client.name.toLocaleUpperCase() +
                '\nTIPO DE VENTA: ' +
                result['type'].toLocaleUpperCase() +
                '\nTIPO DE PAGO: ' +
                result['type_payment'].toLocaleUpperCase(),

              styles: {
                halign: 'left',
              },
            },
          ],
        ],
        theme: 'plain',
      });

      let test = this.details.map(getdata);
      function getdata(datos) {
        return [datos.product.name, datos.amount, datos.price, datos.hitch];
      }
      if (result['type_payment'] == 'Crédito') {
        autoTable(doc, {
          columns: [
            {
              header: 'Producto',
              dataKey: 'product.name',
            },
            { header: 'Cantidad', dataKey: 'amount' },
            { header: 'Precio', dataKey: 'price' },
            { header: 'Enganche', dataKey: 'hitch' },
          ],
          body: test,
          theme: 'striped',
          headStyles: {
            textColor: '#ffffff',
            fillColor: this.configuration.color_table
          },
          bodyStyles: {
            fillColor: '#ffffff',
          },
        });
      } else if (result['type_payment'] == 'Contado') {
        autoTable(doc, {
          columns: [
            {
              header: 'Producto',
              dataKey: 'product.name',
            },
            { header: 'Cantidad', dataKey: 'amount' },
            { header: 'Precio', dataKey: 'price' },
          ],
          body: test,
          theme: 'striped',
          headStyles: {
            textColor: '#ffffff',
            fillColor: this.configuration.color_table
          },
          bodyStyles: {
            fillColor: '#ffffff',
          },
        });
      }

      this.paymentInmediat = result['paymentInmediat'];
      if (this.paymentInmediat.amount != 0) {
        let totalWithDiscount =
          Number(result['total']) - Number(this.paymentInmediat.amount_discount);
        autoTable(doc, {
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
                },
              },
            ],
          ],
          theme: 'plain',
        });
      }

      if (result['type_payment'] == 'Crédito') {
        let amountpost =
          Number(Number(this.account.ammount) + Number(result['total'])) -
          Number(result['payment']);
        autoTable(doc, {
          body: [
            [
              {
                content:
                  '\nTOTAL DE LA VENTA: ' +
                  '$' +
                  result['total'] +
                  '\nABONADO: ' +
                  '$' +
                  result['payment'] +
                  '\nDEUDA TOTAL DE LA CUENTA: ' +
                  '$' +
                  amountpost,
                styles: {
                  halign: 'right',
                },
              },
            ],
          ],
          theme: 'plain',
        });
      }
      doc.setDrawColor(52, 58, 64);
      //doc.rect(14, 26, 182, 24);
      doc.setLineWidth(0.2);
      console.log(result);
      doc.save('ticket.pdf');
    
  }
}
