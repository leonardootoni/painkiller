/**
 * Remote Datatable Component.
 * @author Leonardo Otoni
 */
import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import PaginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { QueryParams } from '../../api';

export enum ColumnAlignment {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

// Data Table Column Definition
export interface ColumnDef {
  dataField: string;
  hidden?: boolean;
  text: string;
  headerAlign?: ColumnAlignment;
}

/**
 * @property data - DataTable data rows
 * @property columns - DataTable columns definition
 * @property totalSize - Max records in the Database that fulfill the search criteria
 * @property onClickRowRoute - Route to redirect on select a DataTable row.
 * @property onTablePageChange - Function to fetch data based on parent args
 * @property currentPage - Sets the current DataTable Navigator Page
 */
type DataTableProps = {
  data: RowT<string, string>[];
  columns: ColumnDef[];
  totalSize: number;
  onClickRow: (rowData: object, rowIndex: number) => void;
  onTablePageChange: (query: QueryParams) => void;
  currentPage: number;
};

// Base type for a DataTable row
type tableRow = {
  id: string;
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  totalSize,
  onClickRow,
  onTablePageChange,
  currentPage = 1,
}: DataTableProps) => {
  /**
   * Invokes the parent handler to perform click row action
   * @param e
   * @param row
   * @param rowIndex
   */
  const clickRowHandler = (e: React.MouseEvent<HTMLElement>, row: object, rowIndex: number) => {
    onClickRow(row, rowIndex);
  };

  const pageOptions = {
    sizePerPageList: [
      // { text: '10', value: 10 },
      // { text: '20', value: 20 },
    ],
    showTotal: true,
    page: currentPage,
    sizePerPage: 10,
    totalSize,
  };

  const rowEvents = {
    onClick: clickRowHandler,
  };

  /**
   * Fired on Navigatior page change.
   * Build a Query Object setting default page and total records to fetch.
   * @param type
   * @param param1
   */
  const onPageChangeHandler = async (type: TableChangeType, { page = 1, sizePerPage = 10 }: TableChangeNewState) => {
    const query: QueryParams = {
      params: { page, limit: sizePerPage },
    };
    onTablePageChange(query);
  };

  return (
    <BootstrapTable
      remote
      bootstrap4
      keyField="id"
      striped
      hover
      condensed
      data={data}
      columns={columns}
      rowEvents={rowEvents}
      pagination={PaginationFactory(pageOptions)}
      onTableChange={onPageChangeHandler}
      noDataIndication={() => <>No data to display</>}
    />
  );
};

export default DataTable;
