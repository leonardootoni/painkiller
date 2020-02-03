import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
/**
 * Closure table to solve TaxonomyNodes tree. It is used only by Typeorm and has no Entity Mapping
 */
export class CreateTaxonomyNodesClosure1580320416011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'taxonomy_nodes_closure',
        columns: [
          { name: 'id_ancestor', type: 'integer', isPrimary: true },
          { name: 'id_descendant', type: 'integer', isPrimary: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'fk_taxonomy_nodes_closures_ancestor',
            referencedTableName: 'taxonomy_nodes',
            columnNames: ['id_ancestor'],
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: 'fk_taxonomy_nodes_closures_descendant',
            referencedTableName: 'taxonomy_nodes',
            columnNames: ['id_descendant'],
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('taxonomy_nodes_closure');
  }
}
