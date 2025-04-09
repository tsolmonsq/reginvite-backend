import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UserModule } from './users/users.module';
import { Guest } from './guests/guest.entity';
import { Event } from './events/event.entity';
import { EventModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { OrganizersService } from './organizers/organizers.service';
import { OrganizersModule } from './organizers/organizers.module';
import { Organizer } from './organizers/organizer.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Adjust this as needed
      port: 5432,
      username: 'tsolmonbatbold',
      password: '11081108',
      database: 'reginvite',
      entities: [User, Organizer, Event, Guest],
      synchronize: true, // Set to false for production
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
    }),
    ConfigModule.forRoot(),
    EmailModule,
    UserModule,
    EventModule,
    GuestsModule,
    AuthModule,
    OrganizersModule
  ],
  controllers: [AppController],
  providers: [AppService, OrganizersService],
})
export class AppModule {}
