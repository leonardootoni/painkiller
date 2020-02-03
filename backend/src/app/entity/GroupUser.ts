import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from './AbstractEntity';
import User from './User';
import Group from './Group';

@Entity({ name: 'groups_users' })
export default class GroupUser extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group!: Group;
}
