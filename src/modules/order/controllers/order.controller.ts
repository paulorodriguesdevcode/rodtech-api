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
import { OrderService } from '../services/order.service';
import { OrderDocument } from '../../../config/database/schemas/order';
import { JwtAuthGuard } from '../../auth/guards';

export interface CreateOrderDto {
  customerId: string;
  productId: string;
  quantity: number;
}

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  list(): Promise<OrderDocument[]> {
    return this.orderService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderDocument | null> {
    return this.orderService.findOne(id);
  }

  @Get(':customerId')
  listByCustomerId(
    @Body('customerId') customerId: string,
  ): Promise<OrderDocument[]> {
    return this.orderService.listByCustomerId(customerId);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    return this.orderService.create(createOrderDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: any): Promise<any> {
    return this.orderService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(id);
  }

  @Delete()
  deleteOrdersByCustomerId(@Body() customerId: string): Promise<void> {
    return this.orderService.deleteOrdersByCustomerId(customerId);
  }

  @Post('/send/email')
  sendByEmail(@Body() sendByEmailDTO: { number: string; signature: string }) {
    return this.orderService.sendOSByEmail(sendByEmailDTO);
  }
}
