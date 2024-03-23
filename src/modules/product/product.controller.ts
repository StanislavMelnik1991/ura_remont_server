import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
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
  CreatePropertyValueDto,
} from 'types/swagger';
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import {
  productCreateScheme,
  productUpdateScheme,
  propertyValueCreateScheme,
} from 'shared/schemas';

const { create, update } = adminRouter.product;
const { create: createValue } = adminRouter.propertyValues;

@ApiTags('Admins commands', 'Product')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class ProductController {
  constructor(private service: ProductService) {}

  @ApiOperation({
    summary: 'Create product',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200 })
  @Post(create.route)
  @UsePipes(new ZodValidationPipe(productCreateScheme))
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Update production values',
  })
  @ApiResponse({ status: 200 })
  @Patch(update.route)
  @UsePipes(new ZodValidationPipe(productUpdateScheme))
  update(
    @Body() data: UpdateProductDto,
    @Param(update.mask, ParseIntPipe) productId: number,
  ) {
    return this.service.update({ ...data, id: productId });
  }

  @ApiOperation({
    summary: 'Create product property value',
    description: 'Create value for product property',
  })
  @ApiResponse({ status: 200 })
  @ApiTags('Properties')
  @Post(createValue.route)
  @UsePipes(new ZodValidationPipe(propertyValueCreateScheme))
  createValue(@Body() data: CreatePropertyValueDto) {
    return this.service.createValue(data);
  }
}
