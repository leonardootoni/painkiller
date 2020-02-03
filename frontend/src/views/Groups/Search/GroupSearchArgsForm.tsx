/**
 * Group Search Args Form Component.
 * The form state is stored in the parent component in order to be integrated with other components.
 * @author: Leonardo Otoni
 */
import React, { ChangeEvent } from 'react';
import { Row, Col, Label, FormGroup } from 'reactstrap';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';

import CustomInputForm from '../../../assets/components/form/Input';
import { ArgsFormProps } from '../../../assets/components/screen/SearchScreen';

export type GroupSearchArgs = {
  name: string;
  blocked: boolean;
};

// Validation Schema
const GroupSearchArgsSchema: Yup.ObjectSchema<GroupSearchArgs> = Yup.object<GroupSearchArgs>().shape({
  name: Yup.string().min(3),
  blocked: Yup.boolean().required(),
});

const GroupSearchArgsForm: React.FC<ArgsFormProps> = ({
  initialFormState,
  submitHandler,
  formDataHandler,
}: ArgsFormProps) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...initialFormState }}
      validationSchema={GroupSearchArgsSchema}
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
          <Col md={6} className="d-flex align-items-center">
            <FormGroup check>
              <Field
                type="checkbox"
                name="blocked"
                onClick={(e: ChangeEvent<HTMLInputElement>) => {
                  formDataHandler('blocked', e.target.value);
                }}
                component={CustomInputForm}
              />
              <Label for="blockedField">Blocked</Label>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </Formik>
  );
};

export default GroupSearchArgsForm;
