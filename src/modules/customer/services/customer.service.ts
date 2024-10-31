import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import {
  Customer,
  CustomerDocument,
} from '../../../config/database/schemas/customer';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  list(): Promise<CustomerDocument[]> {
    return this.customerRepository.findAll();
  }

  findById(id: string): Promise<CustomerDocument | null> {
    return this.customerRepository.findById(id);
  }

  create(createCustomerDto: any): Promise<CustomerDocument> {
    return this.customerRepository.create(createCustomerDto);
  }

  delete(id: string): Promise<void> {
    return this.customerRepository.delete(id);
  }

  update(id: string, user: Partial<Customer>): Promise<CustomerDocument> {
    return this.customerRepository.update(id, user);
  }
}
