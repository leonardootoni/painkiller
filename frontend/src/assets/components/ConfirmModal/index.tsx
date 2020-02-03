import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
/**
 * Default Application Comfirm Modal Alert.
 * It exihibt a dynamic alert message giving to the user a chance to abort the operation or confirm
 * it.
 * @author Leonardo Otoni
 */

enum LabelColor {
  Info = 'text-primary',
  Warning = 'text-warning',
  Danger = 'text-danger',
}

export enum ConfirmationModalLabel {
  Info = 'fa fa-3x fa-info-circle',
  Warning = 'fa fa-3x fa-exclamation-triangle',
  Danger = 'fa fa-3x fa-times-circle',
}

export interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  icon: ConfirmationModalLabel;
  confirmAction: (event: React.MouseEvent<HTMLElement>) => void;
  cancelAction: (event: React.MouseEvent<HTMLElement>) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  icon,
  confirmAction,
  cancelAction,
}: ConfirmModalProps) => {
  let iconColor = '';
  switch (icon) {
    case ConfirmationModalLabel.Warning:
      iconColor = LabelColor.Warning;
      break;
    case ConfirmationModalLabel.Danger:
      iconColor = LabelColor.Danger;
      break;
    default:
      iconColor = LabelColor.Info;
      break;
  }

  return (
    <>
      <Modal isOpen={show}>
        <ModalHeader toggle={cancelAction} className="bg-secondary py-1">
          {title}
        </ModalHeader>
        <ModalBody>
          <div className="d-flex">
            <div className="pr-3">
              <div className={iconColor}>
                <i className={icon} />
              </div>
            </div>
            <div>{message}</div>
          </div>
        </ModalBody>
        <ModalFooter className="py-2">
          <Button className="btn btn-danger" onClick={confirmAction}>
            Yes
          </Button>
          <Button className="btn btn-success" onClick={cancelAction}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ConfirmModal;
