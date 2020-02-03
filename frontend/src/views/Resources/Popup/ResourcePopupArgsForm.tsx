/**
 * Resource Search Popup form. It validates an User data entry before submit any query.
 * @author: Leonardo Otoni
 */
import React, { ChangeEvent } from 'react';
import { Row, Col, Label } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';

import CustomInputForm from '../../../assets/components/form/Input';
import { PopupArgsFormProps } from '../../../assets/components/screen/PopupScreen';

// Search Form Schema definition
export type ResourcePopupSearchArgs = {
  name: string;
  department: string;
};

const UserSearchArgsSchema: Yup.ObjectSchema<ResourcePopupSearchArgs> = Yup.object<ResourcePopupSearchArgs>().shape({
  name: Yup.string().min(3),
  department: Yup.string().min(3),
});

const ResourcePopupForm = ({ initialFormState, submitHandler, formDataHandler }: PopupArgsFormProps) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...initialFormState }}
      validationSchema={UserSearchArgsSchema}
      onSubmit={submitHandler}
    >
      <Form id="searchForm">
        <Row form className="mb-3">
          <Col md={6}>
            <Label for="resource">Resource</Label>
            <Field
              id="resource"
              type="text"
              name="name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => formDataHandler('name', e.target.value)}
              component={CustomInputForm}
            />
          </Col>
          <Col md={6}>
            <Label for="department">Department</Label>
            <Field
              id="department"
              type="text"
              name="department"
              onChange={(e: ChangeEvent<HTMLInputElement>) => formDataHandler('department', e.target.value)}
              component={CustomInputForm}
            />
          </Col>
        </Row>
      </Form>
    </Formik>
  );
};

export default ResourcePopupForm;
