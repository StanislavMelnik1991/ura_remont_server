import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateValueDto,
} from 'types/swagger';

@ApiTags('Admins commands', 'Product')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('api/admin/product')
export class ProductController {
  constructor(private service: ProductService) {}

  @ApiOperation({
    summary: 'Create product',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200 })
  @Post('/')
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Update production values',
  })
  @ApiResponse({ status: 200 })
  @Patch('/:productId')
  update(
    @Body() data: UpdateProductDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.service.update({ ...data, id: productId });
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Update production values',
  })
  @ApiResponse({ status: 200 })
  @Post('/:productId/property/:propertyId')
  createValue(
    @Body() data: CreateValueDto,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.service.createValue({ ...data, productId, propertyId });
  }
}
