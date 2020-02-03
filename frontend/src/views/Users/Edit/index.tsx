import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import MainScreen from '../../../assets/components/screen/EditScreen';
import { AppAlertMessageBar } from '../../../assets/components/AlertBar';
import UserForm, { UserFormFields } from './UserMainForm';

import API from '../../../assets/api';

// initial form state
const initialFormState = {
  id: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  blocked: false,
};

// Resonse format for Post Requests
interface UserPostResponse {
  user: {
    id: string;
  };
}

// Response format for Get Requests
interface UserFetchResponse {
  user: {
    id: string;
    name: string;
    email: string;
    blocked: boolean;
  };
}

// Expected URL render parameters
type UrlParams = {
  id: string | undefined;
};

const ENDPOINT = '/users';
const ROUTE = '/users';
const WINDOW_TITLE = 'User';

/**
 * User Main screen Functional Component. It performs Create, Update and Delete CRUD operations.
 * @author Leonardo Otoni
 */
const User: React.FC<RouteComponentProps<UrlParams>> = (props: RouteComponentProps<UrlParams>) => {
  const [alertMessages, setAlertMessages] = useState<AppAlertMessageBar>({ messages: [] });
  const [pageForm, setPageForm] = useState<UserFormFields>(initialFormState);
  const [hideDeleteButton, setHideDeleteButton] = useState(true);

  const loadHandler = async (userId: number) => {
    const { user } = (await API.get(`${ENDPOINT}/${userId}`)).data as UserFetchResponse;
    setPageForm({
      id: user.id,
      name: user.name,
      email: user.email,
      blocked: user.blocked,
      password: '',
      confirmPassword: '',
    });
    setHideDeleteButton(false);
  };

  // Dispatch Create Operation on Save
  const saveHandler = async (formFields: UserFormFields) => {
    const response = (await API.post(ENDPOINT, { ...formFields })).data as UserPostResponse;
    const userData = { ...formFields };
    userData.id = response.user.id;

    // Remove password info from the form after successfully create a new User.
    userData.password = '';
    userData.confirmPassword = '';

    setPageForm(userData);
    setHideDeleteButton(false);
  };

  // Dispatch Update Operation on Save
  const updateHandler = async (formFields: UserFormFields) => {
    const { id, name, email, password, confirmPassword, blocked } = formFields;
    const userData = { name, email, password, confirmPassword, blocked };
    await API.put(`${ENDPOINT}/${id}`, userData);
  };

  // Dispatch New operation
  const newClickHandler = async () => {
    setPageForm(initialFormState);
    setHideDeleteButton(true);
    setAlertMessages({ messages: [] });
  };

  // Dispatch Delete operation
  const deleteClickHandler = async () => {
    const { id } = pageForm;
    await API.delete(`${ENDPOINT}/${id}`);
    setPageForm(initialFormState);
    setHideDeleteButton(true);
  };

  return (
    <MainScreen
      routePath={ROUTE}
      title={WINDOW_TITLE}
      messages={alertMessages}
      newAction={() => newClickHandler()}
      loadAction={(id: number) => loadHandler(id)}
      createAction={(formFields: UserFormFields) => saveHandler(formFields)}
      updateAction={(formFields: UserFormFields) => updateHandler(formFields)}
      deleteAction={() => deleteClickHandler()}
      hideDeleteButton={hideDeleteButton}
      MainForm={UserForm}
      mainFormData={pageForm}
    />
  );
};

export default User;
