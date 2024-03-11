import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminsAccessService } from './adminAccess.service';
import {
  CreateTypeDto,
  CreateTypePropertyDto,
  IdOnlyResponse,
} from 'shared/schemas';

@ApiTags('Admins commands')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin')
export class AdminsAccessController {
  constructor(private adminsService: AdminsAccessService) {}

  @ApiOperation({
    summary: 'Creation new products type',
    description: 'Only for admin',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/type')
  createDictionary(@Body() data: CreateTypeDto): Promise<IdOnlyResponse> {
    return this.adminsService.createType(data);
  }
  @ApiOperation({
    summary: 'Creation new products type property',
    description: 'Only for admin',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/type/:id')
  createProperty(
    @Body() { name, suffix, display, isFilter }: CreateTypePropertyDto,
    @Param('id') id: string,
  ): Promise<IdOnlyResponse> {
    return this.adminsService.createTypeProperties({
      id,
      name,
      suffix,
      display,
      isFilter,
    });
  }
}
