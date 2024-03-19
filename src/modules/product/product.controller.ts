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
  CreateValueDto,
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: { baseRoute: createRoute, scheme: createScheme },
  current: {
    idMask: productIdMask,
    update: { baseRoute: updateRoute, scheme: updateScheme },
    value: {
      create: {
        baseRoute: createValueRoute,
        idMask: propertyIdMask,
        scheme: createValueScheme,
      },
    },
  },
} = adminRouter.product;

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
  @Post(createRoute)
  @UsePipes(new ZodValidationPipe(createScheme))
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Update product',
    description: 'Update production values',
  })
  @ApiResponse({ status: 200 })
  @Patch(updateRoute)
  @UsePipes(new ZodValidationPipe(updateScheme))
  update(
    @Body() data: UpdateProductDto,
    @Param(productIdMask, ParseIntPipe) productId: number,
  ) {
    return this.service.update({ ...data, id: productId });
  }

  @ApiOperation({
    summary: 'Create product property value',
    description: 'Create value for product property',
  })
  @ApiResponse({ status: 200 })
  @ApiTags('Properties')
  @Post(createValueRoute)
  @UsePipes(new ZodValidationPipe(createValueScheme))
  createValue(
    @Body() data: CreateValueDto,
    @Param(productIdMask, ParseIntPipe) productId: number,
    @Param(propertyIdMask, ParseIntPipe) propertyId: number,
  ) {
    return this.service.createValue({ ...data, productId, propertyId });
  }
}
