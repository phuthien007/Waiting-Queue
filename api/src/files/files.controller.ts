import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRole } from 'src/common/decorators';
import { RoleGuard } from 'src/auth/role.guard';
import { RoleEnum } from 'src/common/enum';

@ApiTags('files')
@Controller('/api/files')
@UseGuards(RoleGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Upload file to server
   * @param file file to upload
   * @returns file name of uploaded file in server
   */
  @HasRole(RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @ApiBody({
    description: 'Upload file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The file has been successfully uploaded.',
  })
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    return this.filesService.create(file);
  }
  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // NOT ACTIVE
  @HasRole(RoleEnum.ADMIN)
  @Get('/download')
  @ApiOkResponse({
    description: 'The file has been successfully downloaded.',
  })
  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiProduces('image/*')
  findOne(@Query('fileName') fileName: string): StreamableFile {
    return new StreamableFile(this.filesService.findOne(fileName));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  @HasRole(RoleEnum.ADMIN)
  @Delete()
  remove(@Query('fileName') fileName: string) {
    return this.filesService.remove(fileName);
  }
}
