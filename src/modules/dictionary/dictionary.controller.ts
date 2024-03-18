import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';
import { Roles } from 'decorators/roles.decorator';
import { RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import {
  DictionarySwaggerScheme,
  LocaleParamsDto,
  UpdateDictionaryDto,
} from 'types/swagger';

@ApiTags('Translation')
@Controller('api/translation')
export class DictionaryController {
  constructor(private service: DictionaryService) {}

  // @ApiOperation({
  //   summary: 'Create translation',
  //   description: 'Creation new translation',
  // })
  // @ApiResponse({ status: 200, type: IdOnlyResponse })
  // @Post('/')
  // create(@Body() data: CreateDictionaryDto): Promise<IdOnlyResponse> {
  //   return this.service.create(data);
  // }

  @ApiOperation({
    summary: 'Update translation',
    description: 'Update translation values',
  })
  @ApiResponse({ status: 200 })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Patch('/:id')
  update(
    @Body() data: UpdateDictionaryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Find dictionary',
    description: 'Find dictionary values',
  })
  @ApiResponse({ status: 200, type: DictionarySwaggerScheme })
  @Get('/:id')
  find(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DictionarySwaggerScheme | null> {
    return this.service.findById(id);
  }

  @ApiOperation({
    summary: 'Update existed translation',
    description: 'Only for staff',
  })
  @ApiResponse({ status: 200, type: String })
  @Get('/:locale/locale')
  localized(@Param() { locale }: LocaleParamsDto) {
    /*  console.log(routes.admin.type.current.getRoute(1)); */
    return { locale };
  }
}
