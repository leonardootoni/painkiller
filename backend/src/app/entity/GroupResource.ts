import {
  Entity,
  Column,
  UpdateDateColumn,
  VersionColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { IsBoolean } from 'class-validator';
import AbstractEntity, { Blocked } from './AbstractEntity';
import Group from './Group';
import Resource from './Resource';

@Entity('groups_resources')
export default class GroupResource extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group!: Group;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: 'resource_id' })
  resource!: Resource;

  @IsBoolean()
  @Column({ type: 'enum', enum: Blocked, default: Blocked.false })
  write!: boolean;

  @IsBoolean()
  @Column({ type: 'enum', enum: Blocked, default: Blocked.false })
  update!: boolean;

  @IsBoolean()
  @Column({ type: 'enum', enum: Blocked, default: Blocked.false })
  delete!: boolean;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn()
  private version!: number;

  @BeforeInsert()
  private beforeInsert(): void {
    // Workaround to solve a bug from 0.2.19 version
    this.createdAt = new Date();
  }
}
