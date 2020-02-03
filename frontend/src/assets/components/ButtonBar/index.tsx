import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useLocation } from 'react-router-dom';

import { AuthContext, UserAuthState, UserPermissions } from '../../store/auth/AuthContext';

export enum AppButtonBarColor {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
  light = 'light',
  dark = 'dark',
  white = 'white',
}

export enum ButtonType {
  button = 'button',
  submit = 'submit',
}

export interface AppButtonBarElement {
  title: string;
  color: AppButtonBarColor;
  type: ButtonType;
  formName?: string; // Form to be submited on click
  disabled: boolean;
  hide?: boolean;
  action?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface AppButtonBarProps {
  buttons: AppButtonBarElement[];
}

export enum AppButton {
  SEARCH = 'Search',
  NEW = 'New',
  SAVE = 'Save',
  DELETE = 'Delete',
  BACK = 'Back',
}

/**
 * Default Application Component Button Bar. It applies default authorization protection on AppButton Buttons.
 * @author Leonardo Otoni
 * @param buttons - List of buttons
 */
const ButtonBar: React.FC<AppButtonBarProps> = ({ buttons }: AppButtonBarProps): React.ReactElement => {
  const [protectedButtons, setProtectedButtons] = useState<AppButtonBarElement[] | null>(null);
  const [resourcePermissions, setResourcePermissions] = useState<UserPermissions | null>(null);
  const ctx = useContext(AuthContext) as UserAuthState;
  const location = useLocation();

  // Load the user Permissions in the State in order to apply Authorization on buttons
  const getUserResourcePermissions = useCallback(async () => {
    setResourcePermissions(await ctx.getResoucePermissions(location.pathname));
  }, [ctx, location]);

  // Trigger the Authorization Rules Loader.
  useEffect(() => {
    getUserResourcePermissions();
  }, [getUserResourcePermissions]);

  /**
   * Custom hook to apply Authorization Permissions on Default application Buttons according to
   * authorization rules loaded in the Authorization Context.
   * This operation will enable or disable the default buttons New, Save or Delete.
   */
  useEffect(() => {
    if (resourcePermissions) {
      // User has some permissions on this resource. It will apply all existing permissions
      const authorizedButtons = buttons.map(btn => {
        const button = btn;

        switch (button.title) {
          case AppButton.NEW:
            button.disabled = !resourcePermissions.write;
            break;
          case AppButton.SAVE:
            button.disabled = location.pathname.endsWith('new')
              ? !resourcePermissions.write
              : !resourcePermissions.update;
            break;
          case AppButton.DELETE:
            button.disabled = !resourcePermissions.del;
            break;
          default:
            break;
        }

        return button;
      });
      setProtectedButtons(authorizedButtons);
    }
  }, [buttons, location.pathname, resourcePermissions]);

  return (
    <Row className="d-flex justify-content-end mt-0 mx-0">
      {!protectedButtons
        ? null
        : protectedButtons
            .filter(button => !button.hide)
            .map((button, index) => {
              return (
                <Col key={`btn-${index + 1}`} col="6" sm="4" md="2" xl className="flex-grow-0 mb-3 ml-2 px-0">
                  <Button
                    block
                    type={button.type}
                    form={button.type === ButtonType.submit && button.formName ? button.formName : ''}
                    color={button.disabled ? AppButtonBarColor.secondary : button.color}
                    onClick={button.action}
                    aria-pressed="true"
                    className="text-white"
                    disabled={button.disabled}
                  >
                    {button.title}
                  </Button>
                </Col>
              );
            })}
    </Row>
  );
};

export default ButtonBar;
