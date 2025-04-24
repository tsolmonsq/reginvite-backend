import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { InvitationTemplate } from 'src/invitation-template/entities/invitation-template.entity';
import { EventForm } from 'src/event-form/entities/event-form.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Арга хэмжээний нэр

  @Column({ nullable: true, type: 'text' })
  description: string; // Дэлгэрэнгүй мэдээлэл

  @Column()
  location: string; 

  @Column({ type: 'timestamp',  nullable: true })
  start_time: Date; 

  @Column({ type: 'timestamp',  nullable: true })
  end_time: Date; 

  @Column({ nullable: true })
  imagePath: string; 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Organizer, (organizer) => organizer.events)
  organizer: Organizer;

  @OneToMany(() => Guest, (guest) => guest.event)
  guests: Guest[];

  @OneToOne(() => InvitationTemplate, (it) => it.event, {
    cascade: true,
    eager: true,
  })
  invitationTemplate: InvitationTemplate;

  @OneToMany(() => EventForm, (form) => form.event, {
    cascade: true,
  })
  forms: EventForm[];
}
