import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  room_id: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ nullable: true })
  media_id: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Column({
    type: 'enum',
    enum: ['Room', 'Media'],
    default: 'Media'
  })
  content_type: 'Room' | 'Media';

  @CreateDateColumn()
  created_at: Date;
} 