import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

import uploadConfig from '@config/upload';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    switch (uploadConfig.driver) {
      case 'disk':
        if (!this.avatar) {
          return `${process.env.APP_API_URL}/assets/default_avatar.png`;
        }
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        if (!this.avatar) {
          return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/default_avatar.png`;
        }
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
