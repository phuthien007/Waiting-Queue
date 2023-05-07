import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { LoggerService } from 'src/logger/logger.service';
import { validateSizeImage, validateTypeImage } from 'src/common/common';

@Injectable()
export class FilesService {
  constructor(private readonly log: LoggerService) {}

  /**
   * Create file
   * @param file file to create
   * @returns file name of created file in server
   */
  create(file: Express.Multer.File): string {
    // save file to disk and return filename
    // save in nodejs
    const path = process.env.FILE_PATH;

    const extensionFile = file.originalname.split('.').pop();
    if (!validateTypeImage(file.mimetype)) {
      throw new BadRequestException(
        'Định dạng file không hợp lệ!, chỉ nhận: jpg, jpeg, png, gif, svg, webp, tiff',
      );
    }

    if (!validateSizeImage(file.size)) {
      throw new BadRequestException(
        'Kích thước file không hợp lệ!, tối đa 50MB',
      );
    }

    const randomFileName = randomUUID();
    const fileName = `${path}/upload-${randomFileName}.${extensionFile}`;
    try {
      fs.writeFileSync(fileName, file.buffer);
      return `upload-${randomFileName}.${extensionFile}`;
    } catch (error) {
      this.log.error(error);
      throw new BadRequestException(
        'Xảy ra lỗi khi lưu file, vui lòng thử lại sau!',
      );
    }
  }

  findOne(fileName: string) {
    const path = process.env.FILE_PATH;

    try {
      // get resource
      return fs.readFileSync(`${path}/${fileName}`);
    } catch (error) {
      this.log.error(error);
      throw new BadRequestException('Không tìm thấy file cần');
    }
  }

  /**
   * Remove file
   * @param fileName file name to remove
   */
  remove(fileName: string) {
    const path = process.env.FILE_PATH;
    try {
      fs.unlinkSync(`${path}/${fileName}`);
    } catch (error) {
      this.log.error(error);
    }
  }
}
