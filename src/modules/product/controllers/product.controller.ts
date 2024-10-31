import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import { ProductService } from '../services/product.service';
import { ProductDocument } from 'src/config/database/schemas/product';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async list(): Promise<ProductDocument[]> {
    return this.productService.list();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.findOne(id);
  }

  @Get('/quantity')
  async listByQuantity(
    @Query('min') minQuantity: number,
  ): Promise<ProductDocument[]> {
    return this.productService.listByQuantity(minQuantity);
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
