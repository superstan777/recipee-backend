import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
  OneToMany,
} from 'typeorm';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';

export type UserRole = 'user' | 'admin';

@Check(`role IN ('user', 'admin')`)
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', default: 'user' })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => SidebarTag, (tag) => tag.user)
  sidebar_tags: SidebarTag[];
}
