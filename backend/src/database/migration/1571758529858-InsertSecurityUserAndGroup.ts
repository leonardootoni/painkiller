import { MigrationInterface, QueryRunner } from 'typeorm';
import User from '../../app/entity/User';
import Group from '../../app/entity/Group';

const adminUser = new User();
adminUser.name = 'Administrator';
adminUser.email = 'admin@painkiller.com';
adminUser.hash = '$2a$08$CodBEGnFAGEiux2mudJBOOyoIXdQ3GRKSKaAV/zmpPHCCTIQbm5Je';
adminUser.blocked = false;

const groups = [
  {
    name: 'Administrators',
    blocked: false,
    description: 'Sysadmin Group',
  },
  {
    name: 'Financials',
    blocked: false,
    description: "Financial's Department Group",
  },
  {
    name: 'Job Site',
    blocked: false,
    description: 'JobSite Department Group',
  },
  {
    name: 'Warehouse',
    blocked: false,
    description: 'Warehouse Department Group',
  },
  {
    name: 'Projects',
    blocked: false,
    description: "Project's Department Group",
  },
];

export class InsertSecurityUserAndGroup1571758529858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // insert Admin User
    await queryRunner.manager.getRepository(User).save(adminUser);

    // Insert Administrative Groups
    groups.forEach(async element => {
      const group = new Group();
      group.name = element.name;
      group.blocked = element.blocked;
      group.description = element.description;
      await queryRunner.manager.getRepository(Group).save(group);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // const user = await queryRunner.manager
    //   .getRepository('User')
    //   .findOneOrFail({ where: { email: adminUser.email } });

    // await queryRunner.manager.getRepository('GroupUser').delete({ user });
    // await queryRunner.manager.getRepository('User').delete({ email: adminUser.email });

    // await Promise.all(
    //   groups.map(element =>
    //     queryRunner.manager.getRepository('Group').delete({ name: element.name })
    //   )
    // );
    await queryRunner.manager.getRepository('GroupUser').delete({});
    await queryRunner.manager.getRepository('User').delete({});
    await queryRunner.manager.getRepository('Group').delete({});
  }
}
