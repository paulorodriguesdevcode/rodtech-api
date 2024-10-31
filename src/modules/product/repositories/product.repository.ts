import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/config/database/schemas/product';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ name: 1 }).exec();
  }

  async findOneById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ id }).lean().exec();
  }

  async findOneOrFail(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({ id }).lean().exec();
    if (!product) {
      throw new HttpException('Produto não encontrado', 404);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async update(
    id: string,
    updateProductDto: Partial<Product>,
  ): Promise<ProductDocument> {
    const existingProduct = await this.productModel.findOne({ id });
    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    Object.assign(existingProduct, updateProductDto);
    return existingProduct.save();
  }

  async delete(id: string): Promise<void> {
    const existingProduct = await this.productModel.findOne({ id });
    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    await this.productModel.deleteOne({ id });
  }

  async findByQuantity(minQuantity: number): Promise<ProductDocument[]> {
    return this.productModel.find({ quantity: { $gte: minQuantity } }).exec();
  }
}
