import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UsePipes,
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
import { DictionarySwaggerScheme, UpdateDictionaryDto } from 'types/swagger';
import { adminRouter } from 'shared/routes';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';

const {
  idMask,
  getCurrent: { baseRoute: getRoute },
  update: { baseRoute: updateRoute, scheme },
} = adminRouter.dictionary.current;

@ApiTags('Translation')
@Controller()
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
  @Patch(updateRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  update(
    @Param(idMask, ParseIntPipe) id: number,
    @Body() data: UpdateDictionaryDto,
  ) {
    return this.service.update({ ...data, id });
  }

  @ApiOperation({
    summary: 'Find dictionary',
    description: 'Find dictionary values',
  })
  @ApiResponse({ status: 200, type: DictionarySwaggerScheme })
  @Get(getRoute)
  find(
    @Param(idMask, ParseIntPipe) id: number,
  ): Promise<DictionarySwaggerScheme | null> {
    return this.service.findById(id);
  }
}
