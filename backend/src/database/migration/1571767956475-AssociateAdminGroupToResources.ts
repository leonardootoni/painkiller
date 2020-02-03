import { MigrationInterface, QueryRunner } from 'typeorm';
import Resource from '../../app/entity/Resource';
import GroupResource from '../../app/entity/GroupResource';
import Group from '../../app/entity/Group';

export class AssociateAdminGroupToResources1571767956475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const group = await queryRunner.manager
      .getRepository(Group)
      .findOneOrFail({ name: 'Administrators' });

    const resources = await queryRunner.manager.getRepository(Resource).find();
    await Promise.all(
      resources.map(async element => {
        const gR = new GroupResource();
        gR.group = group;
        gR.resource = element;
        gR.write = true;
        gR.update = true;
        gR.delete = true;
        await queryRunner.manager.getRepository(GroupResource).save(gR);
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection
      .createQueryBuilder()
      .delete()
      .from(GroupResource)
      .execute();
  }
}
