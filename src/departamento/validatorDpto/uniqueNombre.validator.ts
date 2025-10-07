import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueDepartamentoNameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(nombre: string, args: ValidationArguments) {
    const existing = await this.prisma.departamento.findUnique({
      where: { nombre }
    });
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `El nombre de departamento '${args.value}' ya está en uso.`;
  }
}
