import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Event } from 'src/events/entities/event.entity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'New' })
  status: 'Sent' | 'Pending' | 'Failed' | 'By form' | 'New';

  @Column({ default: false })
  checked_in: boolean; 

  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  qr_token: string;

  @ManyToOne(() => Event, (event) => event.guests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' }) 
  event: Event;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
