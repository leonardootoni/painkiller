/**
 * Alert Bar base Component.
 * @author Leonardo Otoni
 */

import React from 'react';
import { Alert } from 'reactstrap';

/**
 * Defines the bar color according to BootStrap main pallete.
 */
export enum AppAlertBarColor {
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

/**
 * Alert Messages Bar Component Properties interface
 */
export interface AppAlertMessageBar {
  color?: AppAlertBarColor;
  messages: string[];
}

/**
 * Application Default Alert Bar. Will only render an Alert Bar if messages are provided.
 * If a bar color is not provided, will render a default primary color.
 * @param props - {color, messages[]}
 */
export const AppAlertBar: React.FC<AppAlertMessageBar> = ({
  color = AppAlertBarColor.primary,
  messages = [],
}: AppAlertMessageBar): React.ReactElement => {
  const style = `mb-2 border-${color}`;
  let messageIndex = 0;
  const messageList = messages.map(message => {
    messageIndex += 1;
    return <div key={messageIndex}>{message}</div>;
  });

  return (
    <>
      {messageList.length > 0 && (
        <div className="animated fadeIn">
          <Alert color={color} className={style}>
            {messageList}
          </Alert>
        </div>
      )}
    </>
  );
};
