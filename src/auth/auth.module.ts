import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Organizer } from 'src/organizers/organizer.entity';
import { JwtStrategy } from './jwt.strategy';
import { OrganizersModule } from 'src/organizers/organizers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organizer]),
    JwtModule.register({
      secret: 'supersecretkey',
      signOptions: { expiresIn: '1d' },
    }),
    OrganizersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
