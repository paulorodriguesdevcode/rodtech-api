import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '../../../config/database/schemas/customer';
import { OrderService } from 'src/modules/order/services/order.service';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private ordersService: OrderService,
  ) {}

  findAll(): Promise<CustomerDocument[]> {
    return this.customerModel
      .find({ isDeleted: false })
      .sort({ name: 1 })
      .exec();
  }

  async findById(id: string): Promise<CustomerDocument | null> {
    return this.customerModel.findOne({ id: id, isDeleted: false }).exec();
  }

  create(createCustomerDto: Customer): Promise<CustomerDocument> {
    return new this.customerModel(createCustomerDto).save();
  }

  async delete(id: string): Promise<void> {
    const existingCustomer = await this.customerModel.findOne({
      id,
      isDeleted: false,
    });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    existingCustomer.isDeleted = true;
    await existingCustomer.save();

    await this.ordersService.deleteOrdersByCustomerId(id);
  }

  async update(
    id: string,
    updateUserDto: Partial<Customer>,
  ): Promise<CustomerDocument> {
    const existingCustomer = await this.customerModel.findOne({
      id: id,
      isDeleted: false,
    });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    Object.assign(existingCustomer, updateUserDto);
    return existingCustomer.save();
  }
}
