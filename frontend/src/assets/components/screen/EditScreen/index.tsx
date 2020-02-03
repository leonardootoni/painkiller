/**
 * Default Application Edit Screen Component for CRUD Logics.
 * It concentrate and generalize most of default behaviour for
 * @author Leonardo Otoni
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { AppAlertBar, AppAlertMessageBar, AppAlertBarColor } from '../../AlertBar';
import ButtonBar, { AppButtonBarElement, AppButtonBarColor, ButtonType, AppButton } from '../../ButtonBar';
import SpinnerModal from '../../SpinnerModal';
import ConfirmModal, { ConfirmationModalLabel } from '../../ConfirmModal';

const DELETE_MODAL_TITLE = 'Warning';
const DELETE_CONFIRM_MSG = 'Are you sure to permanently delete this record? This operation cannot be recovered.';

// Default Success Operation Messages
enum SUCCESS_MESSAGE {
  CREATED = 'Record successfully created.',
  UPDATED = 'Record successfully updated.',
  DELETED = 'Record successfully deleted.',
}

// TODO Remove no-explicity-any when possible
// Default format for Form Components
export interface MainFormProps {
  formData: any;
  submitHandler: (values: any) => void;
}

/**
 * @property routePath - The Route path registred as a valid React Router Dom Route. E.g.: /users/:id
 * @property title - Search Screen title
 * @property newAction - function to perform "New" button click action
 * @property loadAction - function to request load record from backend when passing a numeric id
 * @property createAction - function to perform "Save" button click action for new records
 * @property updateAction - function to perform "Save" button click action for existings records
 * @property deleteAction - function to perform "Delete" button click action
 * @property hideDeleteButton - Flag to show/hide the Delete button
 * @property lockScreen - Activate or Deactivate Spinner Modal mode
 * @property messages - AppAlertMessageBar containing info messages
 * @property children - React Node Elements
 */
export interface MainScreenProps {
  routePath: string;
  title: string;
  newAction: Function;
  loadAction: (id: number) => Promise<void>;
  createAction: (formData: any) => Promise<void>;
  updateAction: (formData: any) => Promise<void>;
  deleteAction: Function;
  hideDeleteButton?: boolean;
  lockScreen?: boolean;
  messages: AppAlertMessageBar;
  MainForm: React.ComponentType<MainFormProps>;
  mainFormData: object;
  children?: ReactNode;
}

const MainScreen: React.FC<MainScreenProps> = ({
  routePath,
  title,
  newAction,
  loadAction,
  createAction,
  updateAction,
  deleteAction,
  hideDeleteButton = true,
  lockScreen = false,
  messages,
  children,
  MainForm,
  mainFormData,
}: MainScreenProps): React.ReactElement => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [screenMessages, setScreenMessages] = useState<AppAlertMessageBar>(messages);
  const [isSpinner, setSpinner] = useState(lockScreen);

  // State data to control redirect to previous page (back button)
  const isUnmounted = useRef(false);

  // Set urlEnd state in order to decide invoke load record operation or not
  const location = useLocation();
  const { pathname: url } = location;
  const [urlEnd] = useState(url.substring(url.lastIndexOf('/') + 1));

  const history = useHistory();

  // Render Parent messages
  useEffect(() => {
    setScreenMessages(messages);
  }, [messages]);

  // Display a Confirmation Modal before to perform the Delete Operation
  const toggleModal = async () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  // Trigger the New button click
  const performNewAction = async () => {
    try {
      await newAction(); // Parent view must to do clean operations like set a blank form state, etc.
      history.push(`${routePath}/new`);
    } catch (error) {
      const errorInfo = error.errors ? [...error.errors] : [error.message];
      setScreenMessages({ messages: errorInfo, color: AppAlertBarColor.danger });
    }
  };

  // Invoke parent load operation when rendering an URL ending with number id
  useEffect(() => {
    // Trigger the Parents load function
    const performLoadAction = async (id: number) => {
      setSpinner(true);
      (async () => {
        try {
          await loadAction(id);
        } catch (error) {
          const errorInfo = error.errors ? [...error.errors] : [error.message];
          setScreenMessages({ messages: errorInfo, color: AppAlertBarColor.danger });
        } finally {
          setSpinner(false);
        }
      })();
    };

    const id = Number.parseInt(urlEnd, 10);
    if (!isUnmounted.current && Number.isFinite(id)) {
      performLoadAction(id);
    }

    return () => {
      isUnmounted.current = true;
    };
  }, [loadAction, urlEnd]);

  // Trigger the Back button click
  const performBackAction = () => {
    history.push(routePath);
  };

  // Interceptor invoked after confirmation on Toggle Modal
  const performDeleteAction = async (action: Function) => {
    toggleModal();
    setSpinner(true);
    (async () => {
      try {
        await action();
        setScreenMessages({ messages: [SUCCESS_MESSAGE.DELETED] });
        history.push(`${routePath}/new`);
      } catch (error) {
        const errorInfo = error.errors ? [...error.errors] : [error.message];
        setScreenMessages({ messages: errorInfo, color: AppAlertBarColor.danger });
      } finally {
        setSpinner(false);
      }
    })();
  };

  /**
   * Default Form Submit Action Handler. If there is not a valid id in the form, the Child Action
   * to be dispatched will be createAction. Otherwise, updateAction. The decision is made based on
   * the Form id property.
   * @param formFields - Object containing all the Formik form properties
   */
  const performSubmitAction = async (formFields: object) => {
    interface FormId {
      id: string;
    }
    const { id } = formFields as FormId;
    setSpinner(true);

    (async () => {
      try {
        if (!id) {
          // without id, will always try to create a new record
          await createAction(formFields);
          setScreenMessages({ messages: [SUCCESS_MESSAGE.CREATED] });
        } else {
          await updateAction(formFields);
          setScreenMessages({ messages: [SUCCESS_MESSAGE.UPDATED] });
        }
      } catch (error) {
        const errorInfo = error.errors ? [...error.errors] : [error.message];
        setScreenMessages({ messages: errorInfo, color: AppAlertBarColor.danger });
      } finally {
        setSpinner(false);
      }
    })();
  };

  // By default all action buttons are disabled
  const buttons: AppButtonBarElement[] = [
    {
      title: AppButton.SAVE,
      color: AppButtonBarColor.primary,
      type: ButtonType.submit,
      formName: 'mainForm',
      disabled: true,
    },
    {
      title: AppButton.NEW,
      color: AppButtonBarColor.success,
      type: ButtonType.button,
      action: () => performNewAction(),
      disabled: true,
    },
    {
      title: AppButton.DELETE,
      color: AppButtonBarColor.danger,
      type: ButtonType.button,
      action: () => toggleModal(),
      disabled: true,
    },
    {
      title: AppButton.BACK,
      color: AppButtonBarColor.info,
      type: ButtonType.button,
      action: () => performBackAction(),
      disabled: false,
    },
  ];

  // Based on parent state, define is Delete button will be hidden or not
  const index = buttons.findIndex(btn => btn.title === AppButton.DELETE);
  switch (hideDeleteButton) {
    case true:
      buttons[index].hide = true;
      break;
    default:
      delete buttons[index].hide;
      break;
  }

  return (
    <div className="animated fadeIn">
      {isSpinner ? <SpinnerModal /> : null}
      <ConfirmModal
        show={showConfirmationModal}
        title={DELETE_MODAL_TITLE}
        icon={ConfirmationModalLabel.Warning}
        message={DELETE_CONFIRM_MSG}
        confirmAction={() => performDeleteAction(deleteAction)}
        cancelAction={() => toggleModal()}
      />
      <AppAlertBar color={screenMessages.color} messages={screenMessages.messages} />
      <Card>
        <CardHeader>
          <strong>{title}</strong>
        </CardHeader>
        <CardBody>
          <ButtonBar buttons={buttons} />
          <MainForm formData={mainFormData} submitHandler={(formFields: object) => performSubmitAction(formFields)} />
          {children}
        </CardBody>
      </Card>
    </div>
  );
};

export default MainScreen;
