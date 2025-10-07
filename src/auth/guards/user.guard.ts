import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();
    if (user?.role !== 'USUARIO') {
      throw new ForbiddenException('Se requiere rol USUARIO');
    }
    return true;
  }
}