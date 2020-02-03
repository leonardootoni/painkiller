import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class CreateTaxonomyNodes1580318034835 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'taxonomy_nodes',
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
            isNullable: true,
            comment: 'Taxonomy node name',
          },
          {
            // due to a bug in typeorm, this name cannot be changed.
            // it follows: Mapped column name = 'parent', table column name has to be 'parentId'
            name: 'parentId',
            type: 'integer',
            isNullable: true,
            comment: 'Reference to the Parent Taxonomy node',
          },
          {
            name: 'taxonomy_id',
            type: 'integer',
            isNullable: true,
            comment: 'Reference to the Master Taxonomy',
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
            name: 'fk_taxonomy_nodes_taxonomy_master',
            referencedTableName: 'taxonomies',
            columnNames: ['taxonomy_id'],
            referencedColumnNames: ['id'],
          }),
          new TableForeignKey({
            name: 'fk_taxonomy_nodes_parent_node',
            referencedTableName: 'taxonomy_nodes',
            columnNames: ['parentId'],
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        indices: [
          { name: 'idx_taxonomy_nodes_parent_id', columnNames: ['parentId'] },
          { name: 'idx_taxonomy_nodes_taxonomy_id', columnNames: ['taxonomy_id'] },
        ],
        uniques: [
          new TableUnique({
            name: 'chk_taxonomy_nodes_unique',
            columnNames: ['parentId', 'taxonomy_id', 'name'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('taxonomy_nodes');
  }
}
