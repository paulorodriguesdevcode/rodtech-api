import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductDocument } from 'src/config/database/schemas/product';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async list(): Promise<ProductDocument[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productRepository.findOneOrFail(id);
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.productRepository.create(dto);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    return this.productRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }

  async listByQuantity(minQuantity: number): Promise<ProductDocument[]> {
    return this.productRepository.findByQuantity(minQuantity);
  }
}
