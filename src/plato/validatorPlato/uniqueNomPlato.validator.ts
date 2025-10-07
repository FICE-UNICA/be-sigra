// src/plato/constraints/unique-plato-name.constraint.ts

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniquePlatoNameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(nombre: string, args: ValidationArguments) {
    const existing = await this.prisma.plato.findUnique({
      where: { nombre },
    });
    return !existing;  // válido si NO existe
  }

  defaultMessage(args: ValidationArguments) {
    return `El nombre de plato '${args.value}' ya está en uso.`;
  }
}
