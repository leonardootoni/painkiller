import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGroups1570568902750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'groups',
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
            length: '50',
            comment: 'Group unique name',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            comment: 'Group description',
          },
          {
            name: 'blocked',
            type: 'boolean',
            default: false,
            comment: 'Define is a group is valid or not',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            comment: 'Record creation timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            comment: 'Record last update timestamp',
          },
          {
            name: 'version',
            type: 'integer',
            comment: 'Record incremental version number',
          },
        ],
        uniques: [
          {
            name: 'chk_group_name',
            columnNames: ['name'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('groups');
  }
}
