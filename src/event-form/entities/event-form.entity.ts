import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventFormField } from "./event-form-field.entity";
import { Event } from "src/events/entities/event.entity";

@Entity()
export class EventForm {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    type: 'enum',
    enum: ['public', 'rsvp'],
  })
  type: 'public' | 'rsvp';

  @Column({ type: 'boolean', default: true })
  is_open: boolean;

  @Column({ type: 'int', nullable: true })
  max_guests: number;

  @Column({ type: 'timestamp', nullable: true })
  close_at: Date;

  @ManyToOne(() => Event, (event) => event.forms, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => EventFormField, (field) => field.form, { cascade: true })
  fields: EventFormField[];
}
