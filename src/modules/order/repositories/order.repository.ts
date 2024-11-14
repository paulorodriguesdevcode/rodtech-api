import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../../config/database/schemas/order';
import { CreateOrderDto } from '../controllers/order.controller';
import {
  Customer,
  CustomerDocument,
} from '../../../config/database/schemas/customer';
import { Product, ProductDocument } from 'src/config/database/schemas/product';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find({ isDeleted: false }).exec();
  }

  async findOneById(id: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ id, isDeleted: false }).lean().exec();
  }

  async findOneByNumber(number: string): Promise<OrderDocument | null> {
    return this.orderModel.findOne({ number, isDeleted: false }).lean().exec();
  }

  async findOneOrFail(number: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({ number, isDeleted: false })
      .lean()
      .exec();
    if (!order) {
      throw new HttpException('Ordem de serviço não encontrado', 400);
    }
    return order;
  }

  async create(dto: CreateOrderDto): Promise<OrderDocument> {
    const { customerId, productId, quantity } = dto;
    const customer = await this.customerModel.findOne({ id: customerId });
    if (!customer) {
      throw new HttpException('Cliente não encontrado', 404);
    }

    const product = await this.productModel.findOne({ id: productId });
    if (!product) {
      throw new HttpException('Produto não encontrado', 404);
    }

    if (product.quantity < quantity) {
      throw new HttpException(
        `Quantidade (${quantity}) indisponivel no estoque (${product.quantity})`,
        400,
      );
    }

    product.quantity = product.quantity - quantity;

    await product.save();

    const totalValue = quantity * product.saleValue;
    const interest = product.saleValue - product.purchaseValue;

    if (interest <= 0) {
      throw new HttpException('Margem de lucro abaixo do esperado', 400);
    }

    const newOrder = new this.orderModel({
      id: uuidv4(),
      customer,
      product,
      quantity,
      totalValue,
      interest,
    });

    return newOrder.save();
  }

  listOrdersByCustomerId(id: string) {
    return this.orderModel.find({ 'customer.id': id, isDeleted: false }).exec();
  }

  async update(
    id: string,
    updateOrderDto: Partial<Order>,
  ): Promise<OrderDocument> {
    const existingOrder = await this.orderModel.findOne({
      id,
      isDeleted: false,
    });
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    Object.assign(existingOrder, updateOrderDto);
    return existingOrder.save();
  }

  async delete(id: string): Promise<void> {
    const existingOrder = await this.orderModel.findOne({
      id,
      isDeleted: false,
    });
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    existingOrder.isDeleted = true;
    await existingOrder.save();
  }

  async deleteOrdersByCustomerId(customerId: string): Promise<void> {
    await this.orderModel.updateMany(
      { 'customer.id': customerId },
      { $set: { isDeleted: true } },
    );
  }
}
