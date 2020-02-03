import { MigrationInterface, QueryRunner, Table, TableCheck } from 'typeorm';

export class CreateContacts1579212188055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'contacts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '1',
            comment: 'Contact type (P = Person, C = Company)',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            comment: 'Contact name',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '50',
            comment: "Contact's email",
          },
          {
            name: 'website',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: "Contact's Website",
          },
          {
            name: 'phone1',
            type: 'varchar',
            length: '20',
            comment: "Contact's primary phone",
          },
          {
            name: 'phone1_ext',
            type: 'varchar',
            length: '6',
            isNullable: true,
            comment: 'Primary phone extension',
          },
          {
            name: 'phone2',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'Contact secondary phone',
          },
          {
            name: 'phone2_ext',
            type: 'varchar',
            length: '6',
            isNullable: true,
            comment: 'Secondary phone extension',
          },
          {
            name: 'address',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: "Contact's address",
          },
          {
            name: 'address_compl',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: "Contact's complement address",
          },
          {
            name: 'city',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: "Contact's city",
          },
          {
            name: 'province',
            type: 'varchar',
            length: '2',
            isNullable: true,
            comment: "Contact's province",
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '10',
            isNullable: true,
            comment: "Contact's Postal Code",
          },
          {
            name: 'country',
            type: 'varchar',
            length: '2',
            isNullable: true,
            comment: "Contact's Country",
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
        checks: [
          new TableCheck({
            name: 'chk_contact_type',
            columnNames: ['type'],
            expression: `type = 'P' or type = 'C'`,
          }),
        ],
        indices: [
          { name: 'idx_contacts_type', columnNames: ['type'], isUnique: false },
          { name: 'idx_contacts_name', columnNames: ['name'], isUnique: false },
          { name: 'idx_contacts_email', columnNames: ['email'], isUnique: true },
          { name: 'idx_contacts_primary_phone', columnNames: ['phone1'], isUnique: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('contacts');
  }
}
