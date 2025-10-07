import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Se requiere rol ADMIN');
    }
    return true;
  }
}
