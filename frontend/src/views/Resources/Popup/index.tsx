/**
 * Default User Selection Modal Popup.
 * It allows to pick up a user and send back data to parent components in order to associate entities.
 * @author Leonardo Otoni
 */
import React, { useState } from 'react';

import PopupScreen from '../../../assets/components/screen/PopupScreen';
import ResourcePopupForm, { ResourcePopupSearchArgs } from './ResourcePopupArgsForm';
import RemoteDataTable, { ColumnAlignment, ColumnDef } from '../../../assets/components/RemoteDataTable';
import API, { QueryParams } from '../../../assets/api';

interface Resource {
  id: number;
  name: string;
  department: string;
}
// Data Format from EndPoint
interface RemoteData {
  resources: Resource[];
  count: number;
}

// Data table Column Definition
const dataTableColumns: ColumnDef[] = [
  {
    dataField: 'id',
    hidden: true,
    text: 'Id',
  },
  {
    dataField: 'name',
    text: 'Name',
    headerAlign: ColumnAlignment.Center,
  },
  {
    dataField: 'department',
    text: 'Department',
    headerAlign: ColumnAlignment.Center,
  },
];

// Default Popup behaviour
interface PopupControl {
  onCloseHandler: Function;
  onPickDataHandler: (resource: Resource) => void;
}

const ENDPOINT = '/resources';
const ROUTE = '/resources';
const WINDOW_TITLE = 'Resource Search';

const UserSearchPopup: React.FC<PopupControl> = ({ onCloseHandler, onPickDataHandler }: PopupControl) => {
  // Search args form fields
  const [argsForm, setArgsForm] = useState<ResourcePopupSearchArgs>({ name: '', department: '' });

  // RemoteDatable state data
  const [dataTableRows, setDataTableRows] = useState<RowT<string, string>[]>([]);
  const [dataTableTotalRows, setDataTableTotalRows] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Flag to notify the Popup component that no data was found
  const [noDataFound, setNoDataFound] = useState(false);

  /**
   * Keep the ArgsForm up to date according to the user entry
   * @param property - Current State property
   * @param value - Newest property value
   */
  const formStateHandler = (property: string, value: string) => {
    const currentState: { [k: string]: string } = { ...argsForm };
    currentState[property] = value;
    setArgsForm(currentState as ResourcePopupSearchArgs);
  };

  /**
   * Fetch data from the EndPoint.
   * @param query - Query params for GET requests
   * @returns - Total rows fetched
   */
  const fetchData = async (query: QueryParams = { params: {} }) => {
    const fetchQuery = { ...query };
    if (argsForm?.name) {
      fetchQuery.params.name = argsForm.name;
    }

    if (argsForm?.department) {
      fetchQuery.params.department = argsForm.department;
    }
    setCurrentPage((fetchQuery.params?.page as number) || 1);

    const data = (await API.get(`${ENDPOINT}`, { ...fetchQuery })).data as RemoteData;
    setDataTableRows(data.resources);
    setDataTableTotalRows(data.count);
    setNoDataFound(data.count === 0);
  };

  // Handler for Datatable row clicked
  const onClickRowHandler = (row: object, rowId: number) => {
    onPickDataHandler(row as Resource);
  };

  return (
    <PopupScreen title={WINDOW_TITLE} routePath={ROUTE} noDataFound={noDataFound} onCloseHandler={onCloseHandler}>
      <ResourcePopupForm initialFormState={argsForm} submitHandler={fetchData} formDataHandler={formStateHandler} />
      <RemoteDataTable
        data={dataTableRows}
        columns={dataTableColumns}
        totalSize={dataTableTotalRows}
        onClickRow={onClickRowHandler}
        onTablePageChange={fetchData}
        currentPage={currentPage}
      />
    </PopupScreen>
  );
};

export default UserSearchPopup;
