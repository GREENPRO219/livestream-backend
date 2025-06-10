import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Media } from '@media/entities/media.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  media_id: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn()
  created_at: Date;
} 