import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UserModule } from './users/users.module';
import { Guest } from './guests/entities/guest.entity';
import { Event } from './events/entities/event.entity';
import { EventModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { OrganizersService } from './organizers/organizers.service';
import { OrganizersModule } from './organizers/organizers.module';
import { Organizer } from './organizers/entities/organizer.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InvitationTemplate } from './invitation-template/entities/invitation-template.entity';
import { InvitationTemplateModule } from './invitation-template/invitation-template.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventFormModule } from './event-form/event-form.module';
import { EventForm } from './event-form/entities/event-form.entity';
import { EventFormField } from './event-form/entities/event-form-field.entity';
import { Template } from './template/entities/template.entity';
import { TemplateModule } from './template/entities/template.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [ 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Organizer, Event, Guest, InvitationTemplate, Template, EventForm, EventFormField],
        synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        ssl: {
          rejectUnauthorized: false, 
        },
      }),
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
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    UserModule,
    EventModule,
    GuestsModule,
    AuthModule,
    OrganizersModule,
    InvitationTemplateModule,
    EventFormModule,
    TemplateModule,
    ResponseModule
  ],
  controllers: [AppController],
  providers: [AppService, OrganizersService],
})
export class AppModule {}
