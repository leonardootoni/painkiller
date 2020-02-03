import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Main Components and Services
import SearchScreen from '../../../assets/components/screen/SearchScreen';
import RemoteDataTable, { ColumnDef, ColumnAlignment } from '../../../assets/components/RemoteDataTable';
import API, { QueryParams } from '../../../assets/api';

// Default ArgsForm Component
import UserSearchForm, { UserSearchArgs } from './UserSearchArgsForm';

// Datatable format
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

const ENDPOINT = '/users';
const ROUTE = '/users';
const WINDOW_TITLE = 'User Search';

const UserSearch: React.FC = () => {
  const history = useHistory();
  // Search args form fields
  const [argsForm, setArgsForm] = useState<UserSearchArgs>({ name: '', email: '' });

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
    setArgsForm(currentState as UserSearchArgs);
  };

  // Request data to the Endpoint API
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

  const redirect = (row: object, rowId: number) => {
    const user = row as User;
    history.push(`${ROUTE}/${user.id}`);
  };

  return (
    <>
      <SearchScreen title={WINDOW_TITLE} routePath={ROUTE} noDataFound={noDataFound}>
        <UserSearchForm initialFormState={argsForm} submitHandler={fetchData} formDataHandler={formStateHandler} />
        <RemoteDataTable
          data={dataTableRows}
          columns={dataTableColumns}
          totalSize={dataTableTotalRows}
          onClickRow={redirect}
          onTablePageChange={fetchData}
          currentPage={currentPage}
        />
      </SearchScreen>
    </>
  );
};

export default UserSearch;
