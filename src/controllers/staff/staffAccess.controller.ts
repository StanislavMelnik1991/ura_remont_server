import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaffAccessService } from './staffAccess.service';
import {
  CreateDictionaryDto,
  FindDictionaryByLocaleDto,
  IdOnlyResponse,
  UpdateDictionaryDto,
} from 'shared/schemas';
import { Dictionary } from 'database';

@ApiTags('Stuff commands')
// @UseGuards(AdminRoleGuard)
@Controller('api/staff')
export class StaffAccessController {
  constructor(private stuffService: StaffAccessService) {}

  @ApiOperation({
    summary: 'Creation new translations',
    description: 'Only for staff',
  })
  @ApiResponse({ status: 200, type: IdOnlyResponse })
  @Post('/dictionary')
  createDictionary(@Body() data: CreateDictionaryDto) {
    return this.stuffService.createDictionary(data);
  }

  @ApiOperation({
    summary: 'Find existed translation',
    description: 'Only for staff',
  })
  @ApiResponse({ status: 200, type: Dictionary })
  @Post('/dictionary/find')
  findByLocale(@Body() data: FindDictionaryByLocaleDto) {
    return this.stuffService.findByLocale(data);
  }

  @ApiOperation({
    summary: 'Update existed translation',
    description: 'Only for staff',
  })
  @ApiResponse({ status: 200, type: Dictionary })
  @Patch('/dictionary/:id')
  update(@Body() data: UpdateDictionaryDto, @Param('id') id: string) {
    return this.stuffService.updateDictionary(data, id);
  }
}
