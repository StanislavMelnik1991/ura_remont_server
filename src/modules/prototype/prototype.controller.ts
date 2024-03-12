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
import { PrototypeProperty } from 'database';
import { PrototypeService } from './prototype.service';
import {
  CreatePrototypePropertyDto,
  CreateTypePropertyValueDto,
  IdOnlyResponse,
  PrototypeWithLocales,
  UpdatePrototypeDto,
  CreatePrototypeDto,
  TypePropertyValueResponse,
} from 'shared/schemas';

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
  @ApiResponse({ status: 200, type: PrototypeWithLocales })
  @Get('/:id')
  getType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrototypeWithLocales> {
    return this.service.getPrototype(id);
  }

  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeWithLocales] })
  @Get('/:id/properties')
  getProperties(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrototypeProperty[]> {
    return this.service.getProperties(id);
  }
  @ApiOperation({
    summary: 'Get prototype properties',
    description: 'Get prototype properties',
  })
  @ApiResponse({ status: 200, type: [PrototypeWithLocales] })
  @Get('/:id/values')
  getValues(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TypePropertyValueResponse[]> {
    return this.service.getValues(id);
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

  @ApiOperation({
    summary: 'Create prototype property',
    description: 'Create prototype property',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/:prototypeId/property/:propertyId/')
  createValue(
    @Body() { value }: CreateTypePropertyValueDto,
    @Param('prototypeId', ParseIntPipe) prototypeId: number,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): Promise<IdOnlyResponse> {
    return this.service.createValue({ value, propertyId, prototypeId });
  }
}
