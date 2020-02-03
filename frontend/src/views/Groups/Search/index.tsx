import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Main Components and Services
import SearchScreen from '../../../assets/components/screen/SearchScreen';
import RemoteDataTable, { ColumnDef, ColumnAlignment } from '../../../assets/components/RemoteDataTable';
import API, { QueryParams } from '../../../assets/api';

// Default ArgsForm Component
import GroupSearchArgsForm, { GroupSearchArgs } from './GroupSearchArgsForm';

// Datatable format
interface Group {
  id: number;
  name: string;
  blocked: boolean;
}

// Data Format from EndPoint
interface RemoteData {
  groups: Group[];
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
    dataField: 'blocked',
    text: 'Blocked',
    headerAlign: ColumnAlignment.Center,
  },
];

const ENDPOINT = '/groups';
const ROUTE = '/groups';
const WINDOW_TITLE = 'Group Search';

const GroupSearch: React.FC = () => {
  const history = useHistory();

  // Search args form fields
  const [argsForm, setArgsForm] = useState<GroupSearchArgs>({ name: '', blocked: false });

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
    const currentState: { [k: string]: string | boolean } = { ...argsForm };
    currentState[property] = value;
    setArgsForm(currentState as GroupSearchArgs);
  };

  // Request data to the Endpoint API
  const fetchData = async (query: QueryParams = { params: {} }) => {
    const fetchQuery = query;
    if (argsForm?.name) {
      fetchQuery.params.name = argsForm.name;
    }

    if (argsForm?.blocked) {
      fetchQuery.params.blocked = argsForm.blocked;
    }
    setCurrentPage((fetchQuery.params?.page as number) || 1);

    const data = (await API.get(`${ENDPOINT}`, { ...query })).data as RemoteData;
    setDataTableRows(data.groups);
    setDataTableTotalRows(data.count);
    setNoDataFound(data.count === 0);
  };

  const redirect = (row: object, rowId: number) => {
    const group = row as Group;
    history.push(`${ROUTE}/${group.id}`);
  };

  return (
    <>
      <SearchScreen title={WINDOW_TITLE} routePath={ROUTE} noDataFound={noDataFound}>
        <GroupSearchArgsForm initialFormState={argsForm} submitHandler={fetchData} formDataHandler={formStateHandler} />
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

export default GroupSearch;
