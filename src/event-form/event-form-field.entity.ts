import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventForm } from "./event-form.entity";

export type FieldType = 'text' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'number';

@Entity()
export class EventFormField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EventForm, (form) => form.fields, { onDelete: 'CASCADE' })
  form: EventForm;

  @Column()
  label: string;

  @Column()
  type: FieldType;

  @Column({ default: false })
  required: boolean;

  @Column({ type: 'simple-array', nullable: true })
  options?: string[]; 
}
