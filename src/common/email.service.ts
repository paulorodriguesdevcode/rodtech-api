import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as path from 'path';
import puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import { Customer } from 'src/config/database/schemas/customer';
import { UtilsService } from './utils.service';
import { PDFDocument } from 'pdf-lib';

dotenv.config();

interface OrderData {
  filePathSignature: string;
  to: string;
  subject: string;
  text: string;
  order: {
    description: string;
    price: number;
    parts: string[];
    isDeleted: boolean;
    startWorkDateTime: string;
    endWorkDateTime: string;
    id: string;
    number: string;
    createdAt: string;
    updatedAt: string;
    customer: {
      id: string;
      name: string;
      phone: string;
      document: string;
      email: string;
      city: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

class EmailService {
  static async sendOSByEmail(dto: {
    to: string;
    subject: string;
    text: string;
    customer: Customer;
    pdfPath: string;
  }) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        attachments: [
          {
            filename: `os-${dto.customer.id}.pdf`,
            path: dto.pdfPath,
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error, { mailOptions });
        } else {
          console.info(`E-mail enviado: ${info.messageId}`);
        }
      });
    } catch (error) {
      console.error('Ocorreu um erro ao tentar enviar O.S por email', error);
    }
  }

  static async PDFOSGenerate(
    orderData: OrderData,
  ): Promise<string | undefined> {
    try {
      const relativePath = path.join(
        process.cwd(),
        'src',
        'common',
        'templates',
        'emails',
      );

      const htmlFilePath = path.join(relativePath, 'template.html');
      const htmlTemplate = await fs.readFile(htmlFilePath, 'utf-8');

      const partsListHtml = orderData.order.parts
        .map((part) => `<li>${part}</li>`)
        .join('');

      const filledTemplate = htmlTemplate
        .replace('{{description}}', orderData.order.description)
        .replace('{{price}}', orderData.order.price.toFixed(2))
        .replace('{{city}}', orderData.order.customer.city)
        .replace('{{description}}', orderData.order.description)
        .replace('{{parts}}', `<ul>${partsListHtml}</ul>`)
        .replace(
          '{{startWorkDateTime}}',
          UtilsService.formatToBRDate(orderData.order.startWorkDateTime),
        )
        .replace(
          '{{endWorkDateTime}}',
          UtilsService.formatToBRDate(orderData.order.endWorkDateTime),
        )
        .replace('{{number}}', orderData.order.number)
        .replace('{{name}}', orderData.order.customer.name)
        .replace('{{phone}}', orderData.order.customer.phone)
        .replace('{{document}}', orderData.order.customer.document)
        .replace('{{email}}', orderData.order.customer.email)
        .replace('{{city}}', orderData.order.customer.city);

      const pdfName =
        UtilsService.generateUniqueFileName(orderData.order.number) + '.pdf';

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.setContent(filledTemplate);

      const pathOrderServices = path.join(
        process.cwd(),
        'src',
        'common',
        'order-services',
      );

      const tempPdfPath = path.join(pathOrderServices, 'temp-' + pdfName);

      await page.pdf({ path: tempPdfPath, format: 'A4' });

      await browser.close();

      const existingPdfBytes = await fs.readFile(tempPdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const imageBytes = await fs.readFile(orderData.filePathSignature);
      const image = await pdfDoc.embedPng(imageBytes);
      const imageBytes2 = await fs.readFile(
        './src/common/signatures/sarastore-sign.png',
      );
      const image2 = await pdfDoc.embedPng(imageBytes2);

      const pageWidth = firstPage.getWidth();
      const imageWidth = 100;
      const imageHeight = 50;
      const margin = 10;

      const spaceBetween = pageWidth - 2 * imageWidth - 2 * margin;
      const firstImageX = margin;
      const secondImageX = margin + imageWidth + spaceBetween;

      firstPage.drawImage(image, {
        x: firstImageX,
        y: 50,
        width: imageWidth,
        height: imageHeight,
      });

      firstPage.drawImage(image2, {
        x: secondImageX,
        y: 50,
        width: imageWidth,
        height: imageHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const finalPdfPath = path.join(pathOrderServices, pdfName);

      await fs.writeFile(finalPdfPath, pdfBytes);
      await fs.unlink(tempPdfPath);

      return finalPdfPath;
    } catch (error) {
      console.error(
        `Erro ao tentar gerar PDF da O.S ${orderData.order.number}`,
        error,
      );
    }
  }
}

export default EmailService;
