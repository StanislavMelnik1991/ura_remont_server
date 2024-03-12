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
import { AdminTypeService } from 'services/admin';
import {
  CreateTypeDto,
  IdOnlyResponse,
  TypeWithLocales,
  UpdateTypeDto,
} from 'shared/schemas';

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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.adminsService.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Get brand',
    description: 'Get brand',
  })
  @ApiResponse({ status: 200, type: TypeWithLocales })
  @Get('/:id')
  getBrand(@Param('id', ParseIntPipe) id: number): Promise<TypeWithLocales> {
    return this.adminsService.getType(id);
  }
}
