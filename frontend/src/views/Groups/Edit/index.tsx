import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import MainScreen from '../../../assets/components/screen/EditScreen';
import { AppAlertMessageBar } from '../../../assets/components/AlertBar';
import GroupForm, { GroupFormFields, User, Resource, Operation } from './GroupMainForm';

import API from '../../../assets/api/index';

// initial form state
const initialFormState = {
  id: '',
  name: '',
  blocked: false,
  description: '',
  users: [],
  resources: [],
};

interface GroupFetchResponse {
  id: string;
  name: string;
  blocked: boolean;
  description?: string;
  users: User[];
  resources: Resource[];
}

// Resonse format for Post Requests
interface GroupPostResponse {
  group: {
    id: string;
  };
}

// Expected URL render parameters
type UrlParams = {
  id: string | undefined;
};

const ENDPOINT = '/groups';
const ROUTE = '/groups';
const WINDOW_TITLE = 'Group';

/**
 * Group Edit Screen Functional Component. It performs Create, Update and Delete CRUD operations on
 * Group Records.
 * @author Leonardo Otoni
 */
const EditGroupScreen: React.FC<RouteComponentProps<UrlParams>> = (props: RouteComponentProps<UrlParams>) => {
  const [alertMessages, setAlertMessages] = useState<AppAlertMessageBar>({ messages: [] });
  const [pageForm, setPageForm] = useState<GroupFormFields>(initialFormState);
  const [hideDeleteButton, setHideDeleteButton] = useState(true);

  const loadHandler = async (groupId: number) => {
    const group = (await API.get(`${ENDPOINT}/${groupId}`)).data as GroupFetchResponse;

    const nUsers = group.users.map(u => {
      const nU = u;
      nU.operation = Operation.UPDATE;
      return nU;
    });

    const nResources = group.resources.map(r => {
      const nR = r;
      nR.operation = Operation.UPDATE;
      return nR;
    });

    setPageForm({
      ...group,
      users: nUsers,
      resources: nResources,
    });
    setHideDeleteButton(false);
  };

  // Dispatch Create Operation on Save
  const saveHandler = async (formFields: GroupFormFields) => {
    const preparedFormFields = await prepareDataBeforeSubmit(formFields);
    const response = (await API.post(ENDPOINT, { ...preparedFormFields })).data as GroupPostResponse;
    const id = +response.group.id;
    loadHandler(id);
  };

  // Dispatch Update Operation on Save
  const updateHandler = async (formFields: GroupFormFields) => {
    const preparedFormFields = await prepareDataBeforeSubmit(formFields);

    // const { id, name, blocked, users, resources } = preparedFormFields;
    const { id } = preparedFormFields;
    const groupData = { ...preparedFormFields };
    await API.put(`${ENDPOINT}/${id}`, groupData);
    loadHandler(+id);
  };

  // Dispatch New operation
  const newHandler = async () => {
    setPageForm(initialFormState);
    setHideDeleteButton(true);
    setAlertMessages({ messages: [] });
  };

  // Dispatch Delete operation
  const deleteHandler = async () => {
    const { id } = pageForm;
    await API.delete(`${ENDPOINT}/${id}`);
    setPageForm(initialFormState);
    setHideDeleteButton(true);
  };

  const prepareDataBeforeSubmit = async (formFields: GroupFormFields): Promise<GroupFormFields> => {
    const newForm = formFields;
    if (newForm.users?.length > 0) {
      // Remove new users checked to exclusion
      newForm.users = newForm.users
        .filter(u => !(u.operation === Operation.CREATE && u.destroy === true))
        .map(u => {
          const modU = u;
          if (modU.destroy === true) {
            modU.operation = Operation.DELETE;
          }
          return modU;
        });
    }

    if (newForm.resources?.length > 0) {
      // Remove new resources checked to exclusion
      newForm.resources = newForm.resources
        .filter(r => !(r.operation === Operation.CREATE && r.destroy === true))
        .map(r => {
          const modR = r;
          if (modR.destroy === true) {
            modR.operation = Operation.DELETE;
          }
          return modR;
        });
    }

    return newForm;
  };

  return (
    <MainScreen
      routePath={ROUTE}
      title={WINDOW_TITLE}
      messages={alertMessages}
      newAction={() => newHandler()}
      loadAction={(id: number) => loadHandler(id)}
      createAction={(formFields: GroupFormFields) => saveHandler(formFields)}
      updateAction={(formFields: GroupFormFields) => updateHandler(formFields)}
      deleteAction={() => deleteHandler()}
      hideDeleteButton={hideDeleteButton}
      MainForm={GroupForm}
      mainFormData={pageForm}
    />
  );
};

export default EditGroupScreen;
