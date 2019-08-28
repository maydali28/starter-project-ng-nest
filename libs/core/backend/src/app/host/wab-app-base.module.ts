import {
  CacheInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpAuthModule } from './endpoints/auth/authentication.module';
import { HttpCoreModule } from './core/core.module';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { AttachAuthenticationHttpMiddleware } from './core/middleware/attach-authentication.middleware';

// Order of execution:
// - Middleware
// - Guards
// - Interceptors (before the stream is manipulated)
// - Pipes
// - Interceptors (after the stream is manipulated)
// - Exception filters (if any exception is caught)

const AppFilterProvider = {
  // setting up global filter
  provide: APP_FILTER,
  useClass: HttpExceptionFilter
};

const AppGuardProvider = {
  // setting up global guard
  provide: APP_GUARD,
  useClass: AuthorizationGuard
};

const CacheInterceptorProvider = {
  // setting up global caching
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor
};

const AppPipeProvider = {
  // setting up global validation and transformation
  provide: APP_PIPE,
  useFactory: () => new ValidationPipe({ transform: true })
};

@Module({
  imports: [HttpCoreModule, HttpAuthModule],
  controllers: [],
  providers: [
    AppFilterProvider,
    AppPipeProvider,
    CacheInterceptorProvider,
    AppGuardProvider
  ],
  exports: []
})
export class HttpWebAppBaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttachAuthenticationHttpMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
