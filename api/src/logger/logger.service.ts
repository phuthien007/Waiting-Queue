import { ConsoleLogger, Injectable, Logger, Scope } from '@nestjs/common';

/**
 * LoggerService is a custom logger that extends the NestJS ConsoleLogger class and overrides the log methods
 * to add custom functionality. The LoggerService is set to be transient scoped so that a new instance is created for each request.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  error(message: any, trace?: string, context?: string) {
    // TO DO
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    // TO DO
    super.warn(message, context);
  }

  log(message: any, context?: string) {
    // TO DO
    super.log(message, context);
  }

  debug(message: any, context?: string) {
    // TO DO
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    // TO DO
    super.verbose(message, context);
  }
}
