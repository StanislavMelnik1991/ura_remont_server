import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import {
  BrandWithLocales,
  CreateBrandDto,
  IdOnlyResponse,
  UpdateBrandDto,
} from 'shared/schemas';

@ApiTags('Admins commands', 'Brand')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin/brand')
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  create(@Body() data: CreateBrandDto): Promise<IdOnlyResponse> {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Update brand',
    description: 'Update brand',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Patch('/:id')
  update(
    @Body() data: UpdateBrandDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.service.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Get brand',
    description: 'Get brand',
  })
  @ApiResponse({ status: 200, type: BrandWithLocales })
  @Get('/:id')
  getBrand(@Param('id', ParseIntPipe) id: number): Promise<BrandWithLocales> {
    return this.service.getBrand(id);
  }
}
