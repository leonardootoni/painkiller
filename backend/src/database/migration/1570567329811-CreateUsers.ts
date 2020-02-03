import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1570567329811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            comment: 'User name',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            comment: 'User login attribute',
          },
          {
            name: 'hash',
            type: 'varchar',
            length: '150',
            comment: 'User password hash',
          },
          {
            name: 'blocked',
            type: 'boolean',
            default: false,
            comment: 'Define if a user can or cannot log on the system',
          },
          {
            name: 'login_attempts',
            type: 'integer',
            unsigned: true,
            isNullable: true,
            comment: 'The number of invalid user login attempts',
          },
          {
            name: 'last_login_attempt',
            type: 'timestamp',
            isNullable: true,
            comment: 'Timestamp of the last failed login attempt',
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
            name: 'chk_user_email',
            columnNames: ['email'],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users');
  }
}
