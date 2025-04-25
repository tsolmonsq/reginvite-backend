import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organizer } from 'src/organizers/entities/organizer.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Organizer, (organizer) => organizer.staffs, { onDelete: 'CASCADE' })
  organizer: Organizer;
}
