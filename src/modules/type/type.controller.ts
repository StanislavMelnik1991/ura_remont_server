import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeService } from './type.service';
import {
  CreateTypeDto,
  IdOnlyResponse,
  TypeWithLocales,
  UpdateTypeDto,
} from 'shared/schemas';
import { RolesGuard } from 'guards';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';

@ApiTags('Admins commands', 'Type')
@Roles(RolesEnum.ADMIN, RolesEnum.USER)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('api/admin/type')
export class TypeController {
  constructor(private service: TypeService) {}

  @ApiOperation({
    summary: 'Create type',
    description: 'Creation new type of production',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/')
  create(@Body() data: CreateTypeDto): Promise<IdOnlyResponse> {
    return this.service.create(data);
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
    return this.service.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Get type',
    description: 'Get type',
  })
  @ApiResponse({ status: 200, type: TypeWithLocales })
  @Get('/:id')
  getType(@Param('id', ParseIntPipe) id: number): Promise<TypeWithLocales> {
    return this.service.getType(id);
  }
}
