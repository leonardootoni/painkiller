/**
 * Search Args Form Component. It validates an User data entry before submit any query.
 * The form state is stored in the parent component in order to be integrated with other components.
 * @author: Leonardo Otoni
 */
import React, { ChangeEvent } from 'react';
import { Row, Col, Label } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';

import CustomInputForm from '../../../assets/components/form/Input';
import { ArgsFormProps } from '../../../assets/components/screen/SearchScreen';

export type UserSearchArgs = {
  name: string;
  email: string;
};

const UserSearchArgsSchema: Yup.ObjectSchema<UserSearchArgs> = Yup.object<UserSearchArgs>().shape({
  name: Yup.string().min(3),
  email: Yup.string().min(3),
});

const UserSearchForm = ({ initialFormState, submitHandler, formDataHandler }: ArgsFormProps) => {
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
            <Label for="nameField">Name</Label>
            <Field
              type="text"
              name="name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => formDataHandler('name', e.target.value)}
              component={CustomInputForm}
            />
          </Col>
          <Col md={6}>
            <Label for="emailField">Email</Label>
            <Field
              type="text"
              name="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => formDataHandler('email', e.target.value)}
              component={CustomInputForm}
            />
          </Col>
        </Row>
      </Form>
    </Formik>
  );
};

export default UserSearchForm;
