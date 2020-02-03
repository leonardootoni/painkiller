import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  VersionColumn,
  BeforeInsert,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Length, IsBoolean, ValidateIf, MaxLength } from 'class-validator';
import AbstractEntity, { Blocked } from './AbstractEntity';
import GroupResource from './GroupResource';
import GroupUser from './GroupUser';

@Entity({ name: 'groups' })
export default class Group extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Length(1, 50)
  @Column()
  name!: string;

  @IsBoolean()
  @Column({ type: 'enum', enum: Blocked, default: Blocked.false })
  blocked!: boolean;

  @ValidateIf(e => e?.description)
  @MaxLength(255)
  @Column()
  description?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn()
  private version!: number;

  @OneToMany(
    () => GroupResource,
    groupsResource => groupsResource.group
  )
  @JoinTable()
  groupResources!: GroupResource[];

  @OneToMany(
    () => GroupUser,
    groupUser => groupUser.group
  )
  @JoinTable()
  groupUsers!: GroupUser[];

  @BeforeInsert()
  private beforeInsert(): void {
    // Workaround to solve a bug from 0.2.19 version
    this.createdAt = new Date();
  }
}
