/**
 * Default Application Modal Popup Component.
 * It sets a modal screen that provides an interface to fetch data as well as a callback to process
 * the selected data.
 * @author Leonardo Otoni
 */
import React, { ReactNode, useState, useEffect, ReactElement } from 'react';
import { Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import ButtonBar, { AppButtonBarElement, AppButtonBarColor, ButtonType, AppButton } from '../../ButtonBar';
import { AppAlertMessageBar, AppAlertBar, AppAlertBarColor } from '../../AlertBar';
import SpinnerModal from '../../SpinnerModal';

// Default format for Popup Form Components
export interface PopupArgsFormProps {
  initialFormState: object;
  submitHandler: () => void;
  formDataHandler: (property: string, value: string) => void;
}

/**
 * @property routePath - The Route path registred as a valid React-Router-Dom Route. E.g.: /users/:id
 * @property title - Search Screen title
 * @property messages - Application messages to be displayed on screen.
 * @property onCloseHandler - Parent function responsible to hide the popup.
 * @property noDataFound - boolean value to exhibit a friendly default message if no data is found
 * @property children - React Node Elements
 */
export interface PopupScreenProps {
  routePath: string;
  title: string;
  messages?: AppAlertMessageBar;
  onCloseHandler: Function;
  noDataFound?: boolean;
  children: ReactNode;
}

const NO_DATA_FOUND = 'No data records found for the selection criteria';

const PopupScreen: React.FC<PopupScreenProps> = ({
  routePath,
  title,
  messages = { messages: [] },
  noDataFound = false,
  children,
  onCloseHandler,
}: PopupScreenProps): React.ReactElement => {
  const [lockScreen, setLockScreen] = useState(false);
  const [screenMessages, setScreenMessages] = useState(messages);

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

  const buttons: AppButtonBarElement[] = [
    {
      title: AppButton.SEARCH,
      color: AppButtonBarColor.primary,
      type: ButtonType.submit,
      formName: 'searchForm',
      disabled: false,
    },
  ];

  return (
    <Modal isOpen className="modal-lg" modalTransition={{ timeout: 75 }} backdropTransition={{ timeout: 50 }}>
      <ModalHeader toggle={() => onCloseHandler()} className="bg-secondary py-2 mb-0">
        {title}
      </ModalHeader>
      <ModalBody className="m-0 p-0">
        {lockScreen ? <SpinnerModal /> : null}
        <Card className="m-0 p-0">
          <CardBody className="pt-0">
            <div className="mb-3">
              <AppAlertBar color={screenMessages.color} messages={screenMessages.messages} />
            </div>
            <ButtonBar buttons={buttons} />
            {/* Will modify the ArgsForm child component to use the internal fetchData function as the main submitHandler */}
            {React.Children.map(children, (child, index) => {
              // It considers that the ArgsForm is always the first child Element.
              if (index === 0) {
                const element = child as ReactElement;
                const cloneProps = { ...element.props };
                const { submitHandler } = cloneProps;
                const cloneElement = React.cloneElement(child as React.ReactElement<PopupArgsFormProps>, {
                  initialFormState: cloneProps.initialFormState,
                  formDataHandler: cloneProps.formDataHandler,
                  submitHandler: () => fetchData(submitHandler),
                });
                return cloneElement;
              }

              return child;
            })}
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};

export default PopupScreen;
