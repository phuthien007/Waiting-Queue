import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/role.guard';
import { HasRole } from 'src/common/decorators';

@ApiTags('sessions')
@Controller('/api/sessions')
@UseGuards(RoleGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}
}
