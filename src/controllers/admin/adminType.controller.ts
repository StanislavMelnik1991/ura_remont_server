import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminTypeService } from 'services/admin';
import { CreateTypeDto, IdOnlyResponse, UpdateTypeDto } from 'shared/schemas';

@ApiTags('Admins commands', 'Type')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin/type')
export class AdminTypeController {
  constructor(private adminsService: AdminTypeService) {}

  @ApiOperation({
    summary: 'Create type',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  create(@Body() data: CreateTypeDto): Promise<IdOnlyResponse> {
    return this.adminsService.create(data);
  }

  @ApiOperation({
    summary: 'Update type',
    description: 'Update type values',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Patch('/:id')
  update(
    @Body() data: UpdateTypeDto,
    @Param('id') id: string,
  ): Promise<IdOnlyResponse> {
    return this.adminsService.update({ ...data, id });
  }
}
