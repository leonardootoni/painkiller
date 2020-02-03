import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateGroupsUsers1571414172482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'groups_users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'integer',
          },
          {
            name: 'group_id',
            type: 'integer',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'Restrict',
            name: 'fk_groups_users_users',
          }),
          new TableForeignKey({
            columnNames: ['group_id'],
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            onDelete: 'Restrict',
            name: 'fk_groups_users_groups',
          }),
        ],
        uniques: [
          {
            name: 'chk_groups_users_user_id_group_id',
            columnNames: ['user_id', 'group_id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('groups_users', 'fk_groups_users_users');
    await queryRunner.dropForeignKey('groups_users', 'fk_groups_users_groups');
    await queryRunner.dropTable('groups_users');
  }
}
