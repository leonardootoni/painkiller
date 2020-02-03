import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Length } from 'class-validator';
import AbstractEntity from './AbstractEntity';
import GroupResource from './GroupResource';

@Entity('resources')
export default class Resource extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Length(1, 30)
  @Column()
  name!: string;

  @Length(1, 30)
  @Column()
  department!: string;

  @Length(1, 30)
  @Column()
  description!: string;

  @OneToMany(
    () => GroupResource,
    groupResource => groupResource.resource
  )
  groupResource!: GroupResource[];
}
