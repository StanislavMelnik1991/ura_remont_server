import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminBrandService } from 'services/admin';
import { CreateBrandDto, IdOnlyResponse, UpdateBrandDto } from 'shared/schemas';

@ApiTags('Admins commands', 'Brand')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin/brand')
export class AdminBrandController {
  constructor(private adminsService: AdminBrandService) {}

  @ApiOperation({
    summary: 'Create brand',
    description: 'Creation new brand',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  create(@Body() data: CreateBrandDto): Promise<IdOnlyResponse> {
    return this.adminsService.create(data);
  }

  @ApiOperation({
    summary: 'Update brand',
    description: 'Update brand',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Patch('/:id')
  update(
    @Body() data: UpdateBrandDto,
    @Param('id') id: string,
  ): Promise<IdOnlyResponse> {
    return this.adminsService.update({ ...data, id });
  }
}
