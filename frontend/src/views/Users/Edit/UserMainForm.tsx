/**
 * Search Args Form Component. It validates an User data entry before submit any query.
 * @author: Leonardo Otoni
 */
import React from 'react';
import { Row, Col, Label, FormGroup } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';

import CustomInputForm from '../../../assets/components/form/Input';

export interface UserFormFields {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  blocked: boolean;
}

interface UserFormProps {
  formData: UserFormFields;
  submitHandler: (values: UserFormFields) => void;
}

const UserFormSchema: Yup.ObjectSchema<UserFormFields> = Yup.object<UserFormFields>().shape({
  id: Yup.string(),
  name: Yup.string()
    .min(3)
    .required(),
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .min(8)
    .max(20)
    .oneOf([Yup.ref('confirmPassword')], 'Password and Confirm Password fields do not match.')
    .when('id', {
      is: id => !Number.isInteger(Number.parseInt(id, 10)),
      then: Yup.string()
        .required()
        .min(8)
        .max(20)
        .oneOf([Yup.ref('confirmPassword')], 'Password and Confirm Password fields do not match.'),
    }),
  confirmPassword: Yup.string()
    .min(8)
    .max(20)
    .oneOf([Yup.ref('password')], 'Password and Confirm Password fields do not match.')
    .when('id', {
      is: id => !Number.isInteger(Number.parseInt(id, 10)),
      then: Yup.string()
        .required()
        .min(8)
        .max(20)
        .oneOf([Yup.ref('password')], 'Password and Confirm Password fields do not match.'),
    }),
  blocked: Yup.boolean().required(),
  birthDate: Yup.date().required(),
});

const UserForm: React.FC<UserFormProps> = ({ formData, submitHandler }: UserFormProps) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formData }}
      validationSchema={UserFormSchema}
      onSubmit={values => submitHandler(values)}
    >
      {({ values }) => (
        <Form id="mainForm">
          <Row form>
            <Field id="id" type="hidden" name="id" value={values.id} component={CustomInputForm} />
            <Col md={6}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Field id="name" type="text" name="name" value={values.name} component={CustomInputForm} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Field id="email" type="text" name="email" value={values.email} component={CustomInputForm} />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  value={values.password}
                  autoComplete="off"
                  component={CustomInputForm}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="confirmPassword">Confirm Password</Label>
                <Field
                  id="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  autoComplete="off"
                  component={CustomInputForm}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="d-flex align-self-center">
              <FormGroup check inline>
                <Label check for="blocked">
                  <Field
                    id="blocked"
                    type="checkbox"
                    name="blocked"
                    checked={values.blocked}
                    component={CustomInputForm}
                  />
                  Blocked
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
