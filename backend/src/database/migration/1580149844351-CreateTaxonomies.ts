import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaxonomies1580149844351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'taxonomies',
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
            comment: 'Taxonomy item name',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Taxonomy description',
          },
          {
            name: 'max_levels',
            type: 'integer',
            isNullable: true,
            comment: 'It defines how many recursive nodes a Taxonomy can have.',
          },
        ],
        indices: [{ name: 'idx_taxonomies_name', columnNames: ['name'], isUnique: true }],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('taxonomies');
  }
}
