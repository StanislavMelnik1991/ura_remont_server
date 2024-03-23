import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
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
import { IUser } from 'shared/types';

const { create, update } = adminRouter.product;
const { create: createValue } = adminRouter.propertyValues;

@ApiTags('Admins commands', 'Product')
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
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(productCreateScheme))
  create(@Body() data: CreateProductDto, @Req() { user }: { user: IUser }) {
    return this.service.create({ ...data, user });
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Update production values',
  })
  @ApiResponse({ status: 200 })
  @Patch(update.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(productUpdateScheme))
  update(
    @Body() data: UpdateProductDto,
    @Param(update.mask, ParseIntPipe) id: number,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.update({ ...data, id, user });
  }

  @ApiOperation({
    summary: 'Create product property value',
    description: 'Create value for product property',
  })
  @ApiResponse({ status: 200 })
  @ApiTags('Properties')
  @Post(createValue.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ZodValidationPipe(propertyValueCreateScheme))
  createValue(
    @Body() data: CreatePropertyValueDto,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.createValue({ ...data, user });
  }
}
