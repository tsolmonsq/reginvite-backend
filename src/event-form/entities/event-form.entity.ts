import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn()
  event: Event;

  @OneToMany(() => EventFormField, (field) => field.form, { cascade: true })
  fields: EventFormField[];
}
