/**
 * Default User Selection Modal Popup.
 * It allows to pick up a user and send back data to parent components in order to associate entities.
 * @author Leonardo Otoni
 */
import React, { useState } from 'react';

import PopupScreen from '../../../assets/components/screen/PopupScreen';
import UserPopupForm, { UserPopupSearchArgs } from './UserPopupArgsForm';
import RemoteDataTable, { ColumnAlignment, ColumnDef } from '../../../assets/components/RemoteDataTable';
import API, { QueryParams } from '../../../assets/api';

interface User {
  id: number;
  name: string;
  blocked: boolean;
}
// Data Format from EndPoint
interface RemoteData {
  users: User[];
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
    dataField: 'email',
    text: 'Email',
    headerAlign: ColumnAlignment.Center,
  },
];

// Default Popup behaviour
interface PopupControl {
  onCloseHandler: Function;
  onPickDataHandler: (user: User) => void;
}

const ENDPOINT = '/users';
const ROUTE = '/users';
const WINDOW_TITLE = 'User Search';

const UserSearchPopup: React.FC<PopupControl> = ({ onCloseHandler, onPickDataHandler }: PopupControl) => {
  // Search args form fields
  const [argsForm, setArgsForm] = useState<UserPopupSearchArgs>({ name: '', email: '' });

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
    setArgsForm(currentState as UserPopupSearchArgs);
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

    if (argsForm?.email) {
      fetchQuery.params.email = argsForm.email;
    }
    setCurrentPage((fetchQuery.params?.page as number) || 1);

    const data = (await API.get(`${ENDPOINT}`, { ...fetchQuery })).data as RemoteData;
    setDataTableRows(data.users);
    setDataTableTotalRows(data.count);
    setNoDataFound(data.count === 0);
  };

  // Handler for Datatable row clicked
  const onClickRowHandler = (row: object, rowId: number) => {
    onPickDataHandler(row as User);
  };

  return (
    <PopupScreen title={WINDOW_TITLE} routePath={ROUTE} noDataFound={noDataFound} onCloseHandler={onCloseHandler}>
      <UserPopupForm initialFormState={argsForm} submitHandler={fetchData} formDataHandler={formStateHandler} />
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
