import { MigrationInterface, QueryRunner } from 'typeorm';
import GroupUser from '../../app/entity/GroupUser';
import User from '../../app/entity/User';
import Group from '../../app/entity/Group';

export class AssociateUserAdminToAdminGroup1571765953192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // Insert association of Admin user and Administrator Group
    const user = await queryRunner.manager
      .getRepository(User)
      .findOneOrFail({ name: 'Administrator' });

    const group = await queryRunner.manager
      .getRepository(Group)
      .findOneOrFail({ name: 'Administrators' });

    const groupUser = new GroupUser();
    groupUser.group = group;
    groupUser.user = user;
    await queryRunner.manager.getRepository(GroupUser).save(groupUser);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const user = await queryRunner.manager
      .getRepository(User)
      .findOneOrFail({ name: 'Administrator' });

    const group = await queryRunner.manager
      .getRepository(Group)
      .findOneOrFail({ name: 'Administrators' });

    await queryRunner.manager.getRepository(GroupUser).delete({ group, user });
  }
}
