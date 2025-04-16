import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventFormField } from "./event-form-field.entity";
import { Event } from "src/events/event.entity";

@Entity()
export class EventForm {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn()
  event: Event;

  @OneToMany(() => EventFormField, (field) => field.form, { cascade: true })
  fields: EventFormField[];
}
