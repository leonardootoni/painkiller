import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  VersionColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import AbstractEntity, { Blocked } from './AbstractEntity';
import GroupUser from './GroupUser';

@Entity({ name: 'users' })
export default class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Length(1, 50)
  @Column()
  name!: string;

  @IsEmail()
  @Length(1, 50)
  @Column()
  email!: string;

  @Length(40, 150)
  @Column()
  hash!: string;

  @Column({ type: 'enum', enum: Blocked, default: Blocked.false })
  blocked!: boolean;

  @Column({ name: 'login_attempts', type: 'integer', nullable: true })
  attempts!: number | null;

  @Column({ name: 'last_login_attempt', type: 'timestamp', nullable: true })
  lastLoginAttempt?: Date | null;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn()
  private version!: number;

  /**
   * Transient properties
   */
  password!: string;

  token!: string;

  permissions!: object[];

  @BeforeInsert()
  private beforeInsert(): void {
    // Workaround to solve a bug since 0.2.19 version
    this.createdAt = new Date();
  }

  @OneToMany(
    () => GroupUser,
    groupsUser => groupsUser.user
  )
  groupsUser!: GroupUser[];
}
