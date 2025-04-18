import {
    Entity, PrimaryGeneratedColumn, Column, OneToOne,
    JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn,
  } from 'typeorm';
  import { Template } from '../../template/entities/template.entity';
  import { Event } from 'src/events/entities/event.entity';
  
  @Entity()
  export class InvitationTemplate {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Template, { eager: true })
    baseTemplate: Template;

    @OneToOne(() => Event, (event) => event.invitationTemplate)
    @JoinColumn()
    event: Event;
  
    @Column({ default: 'Arial' })
    font: string;
  
    @Column({ default: '#ec4899' })
    color: string;
  
    @Column({ default: true })
    show_qr: boolean;
  
    @Column({ default: true })
    show_rsvp: boolean;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  