import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { adminRouter, apiRouter } from 'shared/router';
import { ImageService } from './image.service';
import { Roles } from 'decorators/roles.decorator';
import { ONE_MB_IN_BYTES, RolesEnum } from 'shared/constants';
import { RolesGuard } from 'guards';
import { Response } from 'express';
import { IUser } from 'shared/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileSchema } from 'types/swagger';

const { deleteCurrent, updateCurrent } = adminRouter.images;
const { get } = apiRouter.images;

@ApiTags('Images')
@ApiBearerAuth()
@Controller()
export class ImageController {
  constructor(private service: ImageService) {}

  @ApiOperation({
    summary: 'Get characteristics for type',
    description: 'Get characteristics for type',
  })
  @ApiTags('Admins commands')
  @ApiResponse({ status: 200 })
  @Delete(deleteCurrent.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  deleteImage(@Param(deleteCurrent.mask, ParseIntPipe) id: number) {
    return this.service.deleteImage(id);
  }

  @ApiOperation({
    summary: 'Get characteristics for type',
    description: 'Get characteristics for type',
  })
  @ApiTags('Images')
  @ApiResponse({ status: 200 })
  @Get(get.route)
  getCharacteristics(
    @Param(get.mask, ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'image/jpeg');
    return this.service.getImage({ id, res });
  }

  @ApiOperation({
    summary: 'Update image',
    description: 'Update current image',
  })
  @ApiResponse({ status: 200 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Patch(updateCurrent.route)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param(updateCurrent.mask, ParseIntPipe) id: number,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.updateImage({ data: file.buffer, id, userId: user.id });
  }
}
