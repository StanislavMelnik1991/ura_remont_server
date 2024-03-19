import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
} from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  create: { baseRoute: creationRoute, scheme },
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
