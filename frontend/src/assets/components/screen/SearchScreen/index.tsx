/**
 * Default Application Search Screen for CRUD Logics.
 * @author Leonardo Otoni
 */
import React, { ReactNode, useState, useEffect, ReactElement } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Redirect } from 'react-router';
import ButtonBar, { AppButtonBarElement, AppButtonBarColor, ButtonType, AppButton } from '../../ButtonBar';
import { AppAlertMessageBar, AppAlertBar, AppAlertBarColor } from '../../AlertBar';
import SpinnerModal from '../../SpinnerModal';

/**
 * @property routePath - The Route path registred as a valid React-Router-Dom Route. E.g.: /users/:id
 * @property title - Search Screen title
 * @property messages - Application messages to be displayed on screen.
 * @property noDataFound - boolean value to exhibit a friendly default message if no data is found
 * @property children - React Node Elements [ArgsForm and DataTable]
 */
type SearchScreenProps = {
  routePath: string;
  title: string;
  messages?: AppAlertMessageBar;
  noDataFound?: boolean;
  children: ReactNode;
};

// PropType that must be used by the Children ArgsForm under this Component
export type ArgsFormProps = {
  initialFormState: object;
  submitHandler: () => void;
  formDataHandler: (property: string, value: string) => void;
};

const NO_DATA_FOUND = 'No data records found for the selection criteria';

const SearchScreen: React.FC<SearchScreenProps> = ({
  routePath,
  title,
  messages = { messages: [] },
  noDataFound = false,
  children,
}: SearchScreenProps) => {
  const [lockScreen, setLockScreen] = useState(false);
  const [screenMessages, setScreenMessages] = useState(messages);
  const [redirectNew, setRedirectNew] = useState(false);

  const buttonNewClickHandler = async () => {
    setRedirectNew(true);
  };

  const buttons: AppButtonBarElement[] = [
    {
      title: AppButton.SEARCH,
      color: AppButtonBarColor.primary,
      type: ButtonType.submit,
      formName: 'searchForm',
      disabled: false,
    },
    {
      title: AppButton.NEW,
      color: AppButtonBarColor.success,
      action: buttonNewClickHandler,
      type: ButtonType.button,
      disabled: true,
    },
  ];

  /**
   * Generic fetch data function. It calls parent fetchHandler.
   * @param parentHandler - Default post handler defined on form child Component
   */
  const fetchData = async (parentHandler: Function) => {
    setLockScreen(true);
    setScreenMessages({ messages: [] });
    (async () => {
      try {
        await parentHandler(); // invokes parent component fetchHandler
      } catch (error) {
        const errorInfo = error.errors ? [...error.errors] : [error.message];
        setScreenMessages({ messages: errorInfo, color: AppAlertBarColor.danger });
      } finally {
        setLockScreen(false);
      }
    })();
  };

  // Display or hide default message for No Data Found
  useEffect(() => {
    if (noDataFound) {
      setScreenMessages({ messages: [NO_DATA_FOUND], color: AppAlertBarColor.danger });
    }
  }, [noDataFound]);

  return (
    <>
      {redirectNew ? <Redirect to={`${routePath}/new`} push /> : null}
      <div className="animated fadeIn">
        {lockScreen ? <SpinnerModal /> : null}
        <AppAlertBar color={screenMessages.color} messages={screenMessages.messages} />
        <Card>
          <CardHeader>
            <strong>{title}</strong>
          </CardHeader>
          <CardBody>
            <ButtonBar buttons={buttons} />
            {/* Will modify the ArgsForm child component to use the internal fetchData function as the main submitHandler */}
            {React.Children.map(children, (child, index) => {
              // It considers that the ArgsForm is always the first child Element.
              if (index === 0) {
                const element = child as ReactElement;
                const cloneProps = { ...element.props };
                const { submitHandler } = cloneProps;
                const cloneElement = React.cloneElement(
                  child as React.ReactElement<ArgsFormProps>,
                  {
                    initialFormState: cloneProps.initialFormState,
                    formDataHandler: cloneProps.formDataHandler,
                    submitHandler: () => fetchData(submitHandler),
                  },
                  // <element.type
                  //   initialFormState={cloneProps.initialFormState}
                  //   formDataHandler={cloneProps.formDataHandler}
                  //   submitHandler={(formValues: object) => fetchData(submitHandler, formValues)}
                  // >
                  //   {children}
                  // </element.type>,
                );
                return cloneElement;
              }

              return child;
            })}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default SearchScreen;
