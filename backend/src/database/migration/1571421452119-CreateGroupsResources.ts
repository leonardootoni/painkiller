import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateGroupsResources1571421452119 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'groups_resources',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'group_id',
            type: 'integer',
          },
          {
            name: 'resource_id',
            type: 'integer',
          },
          {
            name: 'write',
            type: 'boolean',
            default: false,
            comment: 'Permission to write a new information on a resource',
          },
          {
            name: 'update',
            type: 'boolean',
            default: false,
            comment: 'Permission to update information on a resource',
          },
          {
            name: 'delete',
            type: 'boolean',
            default: false,
            comment: 'Permission to delete a resource',
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
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['group_id'],
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            onDelete: 'Restrict',
            name: 'fk_groups_resources_groups',
          }),
          new TableForeignKey({
            columnNames: ['resource_id'],
            referencedTableName: 'resources',
            referencedColumnNames: ['id'],
            onDelete: 'Restrict',
            name: 'fk_groups_resources_resources',
          }),
        ],
        uniques: [
          {
            name: 'chk_groups_resources_group_id_resource_id',
            columnNames: ['group_id', 'resource_id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('groups_resources');
  }
}
