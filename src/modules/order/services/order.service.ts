import { HttpException, Injectable } from '@nestjs/common';
import { Order, OrderDocument } from '../../../config/database/schemas/order';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../controllers/order.controller';
import EmailService from 'src/common/email.service';
import { UtilsService } from 'src/common';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  list(): Promise<OrderDocument[]> {
    return this.orderRepository.findAll();
  }

  findOne(id: string): Promise<any> {
    return this.orderRepository.findOneById(id);
  }

  create(dto: CreateOrderDto): Promise<OrderDocument> {
    return this.orderRepository.create(dto);
  }

  listByCustomerId(id: string): Promise<OrderDocument[]> {
    return this.orderRepository.listOrdersByCustomerId(id);
  }

  update(id: string, user: Partial<Order>): Promise<OrderDocument> {
    return this.orderRepository.update(id, user);
  }

  delete(id: string): Promise<void> {
    return this.orderRepository.delete(id);
  }

  deleteOrdersByCustomerId(id: string): Promise<void> {
    return this.orderRepository.deleteOrdersByCustomerId(id);
  }

  async sendOSByEmail(dto: { number: string; signature: string }) {
    const order = await this.orderRepository.findOneOrFail(dto.number);

    const filePathSignature = await UtilsService.saveSignatureAndReturnPath(
      dto.signature,
      dto.number,
    );

    const urlPdfGenerated = await EmailService.PDFOSGenerate({
      to: order?.customer.email,
      subject: `Sua ordem de serviço - ${dto.number}`,
      text: `sua ordem de serviço ${dto.number}`,
      order: order as any,
      filePathSignature,
    });

    if (!urlPdfGenerated) {
      throw new HttpException('Não foi possivel gerar o PDF da O.S', 400);
    }

    EmailService.sendOSByEmail({
      to: order?.customer.email,
      subject: `Sua ordem de serviço - ${dto.number}`,
      text: `Olá, ${order?.customer?.name}! Segue em anexo sua Ordem de Serviço (O.S.).`,
      customer: order.customer,
      pdfPath: urlPdfGenerated,
    });
  }
}
