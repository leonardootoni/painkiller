import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, Redirect, RouteProps } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Alert,
} from 'reactstrap';

import * as Yup from 'yup';

import CustomInputForm from '../../../assets/components/form/Input';
import API from '../../../assets/api';
import { AuthContext, UserAuthState, UserAuthData } from '../../../assets/store/auth/AuthContext';

type LoginForm = {
  email: string;
  password: string;
};

const formInitialState: LoginForm = {
  email: '',
  password: '',
};

const formSchema: Yup.ObjectSchema<LoginForm> = Yup.object<LoginForm>().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .min(6)
    .required(),
});

type LoginState = {
  errorMessage: string;
};

class Login extends Component<RouteProps, LoginState> {
  constructor(props: Readonly<RouteProps>) {
    super(props);
    Login.contextType = AuthContext;
    this.state = { errorMessage: '' };
  }

  doLogin = async (formValues: LoginForm) => {
    try {
      const userLoginData = (await API.post('/session', formValues)).data as UserAuthData;
      (this.context as UserAuthState).signup(userLoginData);
    } catch (error) {
      this.setState({ errorMessage: 'Invalid credentials.' });
    }
  };

  render() {
    const { errorMessage } = this.state;
    const authenticated = (this.context as UserAuthState).isAuthenticated();
    if (authenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Formik
                      enableReinitialize
                      initialValues={formInitialState}
                      validationSchema={formSchema}
                      onSubmit={values => this.doLogin(values)}
                    >
                      <Form>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            type="text"
                            name="email"
                            placeholder="email"
                            autoComplete="email"
                            component={CustomInputForm}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Field
                            type="password"
                            name="password"
                            placeholder="password"
                            autoComplete="current-password"
                            component={CustomInputForm}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button type="submit" color="primary" className="px-4">
                              Login
                            </Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Formik>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Login;
