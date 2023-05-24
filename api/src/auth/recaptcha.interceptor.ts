import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { validateRecaptcha } from 'src/common/algorithm';

@Injectable()
export class RecaptchaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.body.token) {
      throw new BadRequestException('Recaptcha không hợp lệ');
    }
    validateRecaptcha(request.body.token);
    return next.handle();
  }
}
