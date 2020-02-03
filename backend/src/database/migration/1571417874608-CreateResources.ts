import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateResources1571417874608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'resources',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '30',
            comment: 'Application URI, like: /users, /session, etc.',
          },
          {
            name: 'department',
            type: 'varchar',
            length: '30',
            comment: 'Organizational department, like: Financial, Planning, Accounting, etc.',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '30',
            comment: 'Resource name description',
          },
        ],
        uniques: [
          {
            name: 'chk_resources_name',
            columnNames: ['name'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('resources');
  }
}
