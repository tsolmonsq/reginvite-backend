import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Event } from 'src/events/event.entity';

@Entity()
export class InvitationTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  html: string;

  @Column()
  font: string;

  @Column()
  color: string;

  @Column({ default: true })
  show_qr: boolean;

  @Column({ default: true })
  show_rsvp: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Event, (event) => event.template)
  events: Event[];
}
