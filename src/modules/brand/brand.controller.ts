import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  AdminBrandSwaggerSchema,
  BrandSwaggerSchema,
  CreateBrandDto,
  GetAllBrandsDto,
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: { baseRoute: creationRoute, scheme },
  getAll: { baseRoute: getAllRoute, scheme: getAllScheme },
  current: {
    getCurrent: { baseRoute: currentRoute },
    idMask,
  },
} = adminRouter.brand;

@ApiTags('Admins commands', 'Brand')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller()
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200, type: BrandSwaggerSchema })
  @Post(creationRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  create(@Body() data: CreateBrandDto): Promise<BrandSwaggerSchema> {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Get all brands',
    description: 'Get all brands with dictionaries',
  })
  @ApiResponse({ status: 200 })
  @Get(getAllRoute)
  @UsePipes(new ZodValidationPipe(getAllScheme))
  getAll(@Query() data: GetAllBrandsDto) {
    return this.service.getAllBrands(data);
  }

  @ApiOperation({
    summary: 'Get brand',
    description: 'Get brand',
  })
  @ApiResponse({ status: 200, type: AdminBrandSwaggerSchema })
  @Get(currentRoute)
  getBrand(
    @Param(idMask, ParseIntPipe) id: number,
  ): Promise<AdminBrandSwaggerSchema> {
    return this.service.getBrand(id);
  }
}
