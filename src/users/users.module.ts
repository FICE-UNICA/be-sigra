import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UniqueUsernameConstraint } from './validatorUser/uniqueUsername.validator';
import { MatchPasswordConstraint } from './validatorUser/matchPassword.validator';
import { PasswordStrengthConstraint } from './validatorUser/passwordValidate.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UniqueUsernameConstraint,MatchPasswordConstraint, PasswordStrengthConstraint]
})
export class UsersModule {}
