/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { Input, FormFeedback } from 'reactstrap';
import { FieldProps } from 'formik';

/**
 * Generic Form component that returns a reactstrap Input and FormFeedback when used as a Formik Field component.
 * @param fieldProps - Formik Field Props
 * @author Leonardo Otoni
 */
export default function CustomInputForm(fieldProps: FieldProps) {
  const {
    field,
    form: { touched, errors },
    ...remaining
  } = fieldProps;

  return (
    <>
      <Input invalid={!!(touched[field.name] && errors[field.name])} {...field} {...remaining} />
      {touched[field.name] && errors[field.name] && (
        <FormFeedback className="align-items-end capitalize-first-letter">{errors[field.name]}</FormFeedback>
      )}
    </>
  );
}
