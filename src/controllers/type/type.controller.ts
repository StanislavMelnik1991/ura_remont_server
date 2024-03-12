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
import { TypeProperty } from 'database';
import { TypeService } from 'services';
import {
  CreateTypeDto,
  CreateTypePropertyDto,
  IdOnlyResponse,
  TypeWithLocales,
  UpdateTypeDto,
} from 'shared/schemas';

@ApiTags('Admins commands', 'Type')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin/type')
export class TypeController {
  constructor(private adminsService: TypeService) {}

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
    summary: 'Get type',
    description: 'Get type',
  })
  @ApiResponse({ status: 200, type: TypeWithLocales })
  @Get('/:id')
  getType(@Param('id', ParseIntPipe) id: number): Promise<TypeWithLocales> {
    return this.adminsService.getType(id);
  }

  @ApiOperation({
    summary: 'Get type properties',
    description: 'Get type properties',
  })
  @ApiResponse({ status: 200, type: [TypeWithLocales] })
  @Get('/:id/properties')
  getProperties(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TypeProperty[]> {
    return this.adminsService.getProperties(id);
  }

  @ApiOperation({
    summary: 'Create type properties',
    description: 'Create type properties',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/:id/properties')
  createProperty(
    @Body() data: CreateTypePropertyDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.adminsService.createProperty({ ...data, typeId: id });
  }
}
