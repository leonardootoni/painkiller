import React from 'react';
import { Modal } from 'reactstrap';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

/**
 * Default Application Spinner Modal that blocks the user operation while background tasks are running
 * @author Leonardo Otoni
 */
const SpinnerModal: React.FC = () => {
  return (
    <Modal
      isOpen
      centered
      modalTransition={{ timeout: 50 }}
      backdropTransition={{ timeout: 50 }}
      className="d-flex d-aling-items-center"
    >
      <div className="text-center" style={{ backgroundColor: '#282c34' }}>
        <Loader type="Bars" color="black" height={80} width={80} />
      </div>
    </Modal>
  );
};

export default SpinnerModal;
