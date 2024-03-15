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
import { PrototypeService } from './prototype.service';
import {
  CreatePrototypeDto,
  CreatePrototypePropertyDto,
  IdOnlyResponse,
  PrototypeScheme,
  UpdatePrototypeDto,
} from 'shared/schemas';
import { PrototypeProperty } from 'database';

@ApiTags('Admins commands', 'Prototype')
// @UseGuards(AdminRoleGuard)
@Controller('api/admin/prototype')
export class PrototypeController {
  constructor(private service: PrototypeService) {}

  @ApiOperation({
    summary: 'Create prototype',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  create(@Body() data: CreatePrototypeDto): Promise<IdOnlyResponse> {
    return this.service.create(data);
  }

  @ApiOperation({
    summary: 'Update prototype',
    description: 'Update prototype values',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Patch('/:id')
  update(
    @Body() data: UpdatePrototypeDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.service.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Get prototype',
    description: 'Get prototype',
  })
  @ApiResponse({ status: 200, type: PrototypeScheme })
  @Get('/:id')
  getType(@Param('id', ParseIntPipe) id: number): Promise<PrototypeScheme> {
    return this.service.getPrototype(id);
  }

  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeScheme] })
  @Get('/:id/properties')
  getProperties(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrototypeProperty[]> {
    return this.service.getProperties(id);
  }

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/:id/property')
  createProperty(
    @Body() data: CreatePrototypePropertyDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IdOnlyResponse> {
    return this.service.createProperty({ ...data, prototypeId: id });
  }
}
