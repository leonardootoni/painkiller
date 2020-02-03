import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import Calendar from 'react-calendar';

type datePickerProps = {
  toggle: () => void;
  onPickDate: (date: Date) => void;
};
/**
 * Display a popup Calendar to pick-up a single date.
 * @param param0 - Must to provide functions to perform operations onPickDate and to toggle the
 * calendar visibility.
 * @author Leonardo Otoni
 */
const DatePicker = ({ onPickDate, toggle: toggleVisibility }: datePickerProps) => {
  return (
    <Modal isOpen toggle={toggleVisibility} centered size="sm" fade={false}>
      <ModalBody className="m-0 p-0">
        <Calendar
          onClickDay={(selectedDate: Date) => {
            onPickDate(selectedDate);
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default DatePicker;
