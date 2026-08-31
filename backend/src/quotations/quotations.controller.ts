import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto, UpdateQuotationDto, QuotationQueryDto } from './dto/quotation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

const storage = diskStorage({
  destination: './uploads/quotations',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get('public/preview')
  async previewPdf(@Res() res: any) {
    const filePath = await this.quotationsService.generateSamplePdf();
    return res.sendFile(filePath);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('stats')
  getStats() {
    return this.quotationsService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: QuotationQueryDto, @Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      query.createdById = req.user.id;
    }
    return this.quotationsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateQuotationDto, @Request() req) {
    return this.quotationsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('document', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|docx)$/)) {
          return cb(new BadRequestException('Only PDF and DOCX files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.quotationsService.update(id, dto, file?.filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/send')
  sendQuotation(@Param('id') id: string) {
    return this.quotationsService.sendQuotation(id);
  }
}
