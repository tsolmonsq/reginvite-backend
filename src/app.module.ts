import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { Guest } from './guests/guest.entity';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Adjust this as needed
      port: 5432,
      username: 'tsolmonbatbold',
      password: '11081108',
      database: 'reginvite',
      entities: [Event, Guest],
      synchronize: true, // Set to false for production
    }),
    ConfigModule.forRoot(),
    EmailModule,
    UsersModule,
    EventsModule,
    GuestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
