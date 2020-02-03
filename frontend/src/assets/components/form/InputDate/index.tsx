/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react';
import { FormFeedback } from 'reactstrap';
import { FieldProps } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import { format } from 'date-fns';
import DatePicker from '../../ModalDatePicker/index';

/**
 * Generic Form component that returns a reactstrap Input and FormFeedback when used as a Formik Field component.
 * @param fieldProps - Formik Field Props
 * @author Leonardo Otoni
 */
export default function CustomInputDateForm(fieldProps: FieldProps) {
  const {
    field,
    form: { touched, errors, setFieldValue },
    ...remaining
  } = fieldProps;

  const thereIsError = !!(touched[field.name] && errors[field.name]);
  const fieldStyle = `form-control ${thereIsError ? 'is-invalid calendar-prepend-rounded-border' : ''}`;

  // Auxiliar pipe to enforce date entry numbers
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe('yyyy/mm/dd');

  const [showDatePicker, setShowDatePicker] = useState(false);

  /**
   * Set the picked date in the Formik state and hide the Popup Calendar
   * @param date - Selected date from DatePicker component
   */
  const pickDateHandler = (date: Date) => {
    setFieldValue(field.name, format(date, 'yyyy/MM/dd'));
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  return (
    <>
      {showDatePicker ? <DatePicker toggle={hideDatePicker} onPickDate={pickDateHandler} /> : null}
      <div className="input-group">
        <div className="input-group-prepend">
          <button
            type="button"
            className="input-group-text calendar-prepend"
            onClick={() => {
              setShowDatePicker(true);
            }}
          >
            <span className="calendar-prepend">
              <FontAwesomeIcon icon={faCalendar} />
            </span>
          </button>
        </div>
        <MaskedInput
          mask={[/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/]}
          className={`${fieldStyle}`}
          placeholder="yyyy/mm/dd"
          pipe={autoCorrectedDatePipe}
          guide
          value={field.value}
          {...field}
          {...remaining}
        />
        {touched[field.name] && errors[field.name] && (
          <FormFeedback className="align-items-end capitalize-first-letter">{errors[field.name]}</FormFeedback>
        )}
      </div>
    </>
  );
}
