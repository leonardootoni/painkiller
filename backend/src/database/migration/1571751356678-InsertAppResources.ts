import { MigrationInterface, QueryRunner } from 'typeorm';
import Resource from '../../app/entity/Resource';

const resources = [
  {
    name: '/users',
    department: 'Security',
    description: "User's Registry",
  },
  {
    name: '/groups',
    department: 'Security',
    description: "User Group's Registry",
  },
  {
    name: '/resources',
    department: 'Security',
    description: "System's URLs",
  },
  {
    name: '/contacts',
    department: 'Ecosystem',
    description: "Company's Contacts",
  },
];

export class InsertAppResources1571751356678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    resources.forEach(async element => {
      const resource = new Resource();
      resource.name = element.name;
      resource.department = element.department;
      resource.description = element.description;

      await queryRunner.manager.getRepository('Resource').save(resource);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    resources.forEach(async element => {
      await queryRunner.manager.getRepository('Resource').delete({ name: element.name });
    });
  }
}
