import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
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
import { BrandSwaggerSchema, CreateBrandDto } from 'types/swagger';

@ApiTags('Admins commands', 'Brand')
@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('api/admin/brand')
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200 })
  @Post('/')
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }

  // @ApiOperation({
  //   summary: 'Update brand',
  //   description: 'Update brand',
  // })
  // @ApiResponse({ status: 200 })
  // @Patch('/:id')
  // update(
  //   @Body() data: UpdateBrandDto,
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<IdOnlyResponse> {
  //   return this.service.update({ ...data, id });
  // }

  @ApiOperation({
    summary: 'Get brand',
    description: 'Get brand',
  })
  @ApiResponse({ status: 200, type: BrandSwaggerSchema })
  @Get('/:id')
  getBrand(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BrandSwaggerSchema | null> {
    return this.service.getBrand(id);
  }
}
