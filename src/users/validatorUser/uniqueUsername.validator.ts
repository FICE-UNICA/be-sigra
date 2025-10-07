import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(username: string, args: ValidationArguments) {
    const existing = await this.prisma.usuario.findUnique({
      where: { username }
    });
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `El usuario '${args.value}' ya está en uso.`;
  }
}
