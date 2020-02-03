/**
 * Search Args Form Component. It validates an User data entry before submit any query.
 * @author: Leonardo Otoni
 */
import React, { useState } from 'react';
import { Row, Col, Label, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table } from 'reactstrap';
import classnames from 'classnames';
import { Form, Field, Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { AppSwitch } from '@coreui/react/';
import CustomInputForm from '../../../assets/components/form/Input';
import UserPopup from '../../Users/Popup';
import ResourcePopup from '../../Resources/Popup';

// Valid Operations on list elements of Users or Permissions
enum Permission {
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Operation {
  CREATE = 'c',
  UPDATE = 'u',
  DELETE = 'd',
}

export interface User {
  id: number;
  name: string;
  email: string;
  operation: Operation;
  destroy?: boolean;
}

interface ResourcePermissions {
  write: boolean;
  update: boolean;
  del: boolean;
}

export interface Resource {
  id: number;
  name: string;
  permissions: ResourcePermissions;
  operation?: Operation;
  destroy?: boolean;
}

// General interface
export interface GroupFormFields {
  id: string;
  name: string;
  blocked: boolean;
  description?: string;
  users: User[];
  resources: Resource[];
}

// Component Props
interface FormProps {
  formData: GroupFormFields;
  submitHandler: (values: GroupFormFields) => void;
}

const GroupFormSchema: Yup.ObjectSchema<GroupFormFields> = Yup.object<GroupFormFields>().shape({
  id: Yup.string(),
  name: Yup.string()
    .min(3)
    .max(50)
    .required(),
  blocked: Yup.boolean().required(),
  description: Yup.string().max(255),
});

// Group Form Component
const GroupForm: React.FC<FormProps> = ({ formData, submitHandler }: FormProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showResourcePopup, setShowResourcePopup] = useState(false);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Show/Hide User Popup
  const toggleUserPopup = () => {
    setShowUserPopup(!showUserPopup);
  };

  const userComparator = (user1: User, user2: User): number => {
    if (user1.name.toLocaleLowerCase() < user2.name.toLocaleLowerCase()) {
      return -1;
    }

    if (user1.name.toLocaleLowerCase() > user2.name.toLocaleLowerCase()) {
      return 1;
    }

    return 0;
  };

  /**
   * Insert a selected user (from popup) into the form User's list
   * @param user - Selected User from popup
   * @param users - Actual list of users
   * @param push - Formik ArrayHelper function
   */
  const addUserToGroup = async (user: User, users: User[], push: (obj: object) => void) => {
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) {
      const newUser = user;
      newUser.operation = Operation.CREATE;
      push(user);
    }
  };

  // Show/Hide User Popup
  const toggleResourcePopup = () => {
    setShowResourcePopup(!showResourcePopup);
  };

  /**
   * Insert a selected resource (from popup) into the Resource's form list
   * @param newUser - Selected Resource from popup
   * @param users - Actual list of resources
   * @param push - Formik ArrayHelper function
   */
  const addResourceToGroup = async (resource: Resource, resources: Resource[], push: (obj: object) => void) => {
    const index = resources.findIndex(r => r.id === resource.id);
    if (index === -1) {
      const newResource = resource;
      newResource.permissions = { write: false, update: false, del: false };
      newResource.operation = Operation.CREATE;
      push(newResource);
    }
  };

  /**
   * Generic method to change the resource permission according to the switch button clicked.
   * @param perm - Identifier of wich permission needs to be changed
   * @param index - Resource index
   * @param resource - Resource to be updated
   * @param replace - Arrayhelpers.replace function
   */
  const changeResourcePermission = async (perm: Permission, index: number, resource: Resource, replace: Function) => {
    const changedResource = resource;

    switch (perm) {
      case Permission.WRITE:
        changedResource.permissions[perm] = !changedResource.permissions.write;
        break;
      case Permission.UPDATE:
        changedResource.permissions.update = !changedResource.permissions.update;
        break;
      case Permission.DELETE:
        changedResource.permissions.del = !changedResource.permissions.del;
        break;
      default:
        throw new Error(`Permission not identified.`);
    }

    replace(index, changedResource);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formData }}
      validationSchema={GroupFormSchema}
      onSubmit={values => {
        submitHandler(values);
      }}
    >
      {({ values }) => (
        <>
          <Form id="mainForm">
            <Row form>
              <Field id="id" type="hidden" name="id" value={values.id} component={CustomInputForm} />
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Field id="name" type="text" name="name" component={CustomInputForm} />
                </FormGroup>
              </Col>
              <Col md={6} className="d-flex align-items-center">
                <FormGroup check>
                  <Field id="blocked" type="checkbox" name="blocked" component={CustomInputForm} />
                  <Label for="blocked">Blocked</Label>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Field
                    id="description"
                    type="textarea"
                    name="description"
                    className="textarea-noresize"
                    rows="3"
                    component={CustomInputForm}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      toggle('1');
                    }}
                  >
                    Users
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      toggle('2');
                    }}
                  >
                    Persmissions
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <FieldArray
                    name="users"
                    render={arrayHelpers => (
                      <Row>
                        {showUserPopup ? (
                          <UserPopup
                            onCloseHandler={toggleUserPopup}
                            onPickDataHandler={(user: object) => {
                              addUserToGroup(user as User, values.users, arrayHelpers.push);
                              setShowUserPopup(!showUserPopup);
                            }}
                          />
                        ) : null}
                        <Col sm="12">
                          <div className="d-flex justify-content-end">
                            <div>
                              <Button color="primary" size="sm" onClick={toggleUserPopup}>
                                Add
                              </Button>
                            </div>
                          </div>
                          <Table responsive hover size="sm" className="mt-3">
                            <thead>
                              <tr>
                                <th>
                                  <FontAwesomeIcon icon={faTrash} />
                                </th>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.users?.length === 0
                                ? null
                                : values.users
                                    .sort((a, b) => userComparator(a, b))
                                    .map((user, index) => (
                                      <tr className={user.destroy ? 'table-danger' : ''} key={`usr-${index + 1}`}>
                                        <td>
                                          <Field
                                            type="checkbox"
                                            name={user.destroy}
                                            checked={values.users[index].destroy}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              arrayHelpers.replace(index, {
                                                ...values.users[index],
                                                destroy: e.target.checked,
                                              });
                                            }}
                                            component={CustomInputForm}
                                            style={{ marginLeft: 0 }}
                                          />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                      </tr>
                                    ))}
                            </tbody>
                          </Table>
                          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                        </Col>
                      </Row>
                    )}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <FieldArray
                    name="resources"
                    render={arrayHelpers => (
                      <Row>
                        {showResourcePopup ? (
                          <ResourcePopup
                            onCloseHandler={toggleResourcePopup}
                            onPickDataHandler={(resource: object) => {
                              addResourceToGroup(resource as Resource, values.resources, arrayHelpers.push);
                              toggleResourcePopup();
                            }}
                          />
                        ) : null}

                        <Col sm="12">
                          <div className="d-flex justify-content-end">
                            <div>
                              <Button color="primary" size="sm" onClick={toggleResourcePopup}>
                                Add
                              </Button>
                            </div>
                          </div>
                          <Table responsive hover size="sm" className="mt-3">
                            <thead>
                              <tr>
                                <th>
                                  <FontAwesomeIcon icon={faTrash} />
                                </th>
                                <th>Resource</th>
                                <th>Create</th>
                                <th>Update</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.resources.length === 0
                                ? null
                                : values.resources.map((resource: Resource, index: number) => (
                                    <tr className={resource.destroy ? 'table-danger' : ''} key={`index-${index + 1}`}>
                                      <td>
                                        <Field
                                          type="checkbox"
                                          checked={values.resources[index].destroy}
                                          name={resource.destroy}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            arrayHelpers.replace(index, {
                                              ...values.resources[index],
                                              destroy: e.target.checked,
                                            });
                                          }}
                                          component={CustomInputForm}
                                          style={{ marginLeft: 0 }}
                                        />
                                      </td>
                                      <td>{resource.name}</td>
                                      <td>
                                        <AppSwitch
                                          className="mx-1"
                                          variant="pill"
                                          color="success"
                                          label
                                          checked={resource.permissions.write}
                                          onClick={() =>
                                            changeResourcePermission(
                                              Permission.WRITE,
                                              index,
                                              resource,
                                              arrayHelpers.replace,
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <AppSwitch
                                          className="mx-1"
                                          variant="pill"
                                          color="primary"
                                          label
                                          checked={resource.permissions.update}
                                          onClick={() =>
                                            changeResourcePermission(
                                              Permission.UPDATE,
                                              index,
                                              resource,
                                              arrayHelpers.replace,
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <AppSwitch
                                          className="mx-1"
                                          variant="pill"
                                          color="danger"
                                          label
                                          checked={resource.permissions.del}
                                          onClick={() =>
                                            changeResourcePermission(
                                              Permission.DELETE,
                                              index,
                                              resource,
                                              arrayHelpers.replace,
                                            )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </Table>
                          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                        </Col>
                      </Row>
                    )}
                  />
                </TabPane>
              </TabContent>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default GroupForm;
