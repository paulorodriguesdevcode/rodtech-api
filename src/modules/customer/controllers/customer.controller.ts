import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CustomerDocument } from '../../../config/database/schemas/customer';
import { JwtAuthGuard } from '../../../modules/auth/guards';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  list(): Promise<CustomerDocument[]> {
    return this.customerService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CustomerDocument | null> {
    return this.customerService.findById(id);
  }

  @Post()
  create(@Body() createCustomerDto: any): Promise<CustomerDocument> {
    return this.customerService.create(createCustomerDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.customerService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: any): Promise<any> {
    return this.customerService.update(id, user);
  }
}
