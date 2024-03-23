import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
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
import { adminRouter } from 'shared/router';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { dictionaryUpdateScheme } from 'shared/schemas';
import { IUser } from 'shared/types';

const { getOne, update } = adminRouter.dictionary;

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
  @Patch(update.route)
  @UsePipes(new ZodValidationPipe(dictionaryUpdateScheme))
  update(
    @Param(update.mask, ParseIntPipe) id: number,
    @Body() data: UpdateDictionaryDto,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.update({ ...data, id, user });
  }

  @ApiOperation({
    summary: 'Find dictionary',
    description: 'Find dictionary values',
  })
  @ApiResponse({ status: 200, type: DictionarySwaggerScheme })
  @Get(getOne.route)
  find(
    @Param(getOne.mask, ParseIntPipe) id: number,
  ): Promise<DictionarySwaggerScheme | null> {
    return this.service.findById(id);
  }
}
