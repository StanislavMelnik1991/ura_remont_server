import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto, IdOnlyResponse, UpdateBrandDto } from 'shared/schemas';
import { BrandScheme } from 'shared/schemas';

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
  @ApiResponse({ status: 200, type: BrandScheme })
  @Get('/:id')
  getBrand(@Param('id', ParseIntPipe) id: number): Promise<BrandScheme> {
    return this.service.getBrand(id);
  }
}
