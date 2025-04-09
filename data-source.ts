import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Event } from './src/events/event.entity';
import { Guest } from './src/guests/guest.entity';
import { Organizer } from './src/organizers/organizer.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'tsolmonbatbold',
  password: '11081108',
  database: 'reginvite',
  entities: [User, Organizer, Event, Guest],
  migrations: ['src/migrations/*.ts'],
  synchronize: false
});
