import React, { Component, SyntheticEvent } from 'react';
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
} from 'reactstrap';
// import PropTypes from 'prop-types';

import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler,
  // @ts-ignore
} from '@coreui/react';

import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';

// const propTypes = {
//   children: PropTypes.node,
// };

// const defaultProps = {};

interface HeaderProps {
  onLogout: (e: SyntheticEvent) => void;
}

class DefaultHeader extends Component<HeaderProps> {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{
            src: logo, width: 89, height: 25, alt: 'CoreUI Logo',
          }}
          minimized={{
            src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo',
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img
                src="../../assets/img/avatars/6.jpg"
                className="img-avatar"
                alt="admin@bootstrapmaster.com"
              />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>Account</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-bell-o" />
                {' '}
Updates
                <Badge color="info">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-envelope-o" />
                {' '}
Messages
                <Badge color="success">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-tasks" />
                {' '}
Tasks
                <Badge color="danger">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-comments" />
                {' '}
Comments
                <Badge color="warning">42</Badge>
              </DropdownItem>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user" />
                {' '}
Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-wrench" />
                {' '}
Settings
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-usd" />
                {' '}
Payments
                <Badge color="secondary">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-file" />
                {' '}
Projects
                <Badge color="primary">42</Badge>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-shield" />
                {' '}
Lock Account
              </DropdownItem>
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock" />
                {' '}
Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/* <AppAsideToggler className="d-lg-none" mobile /> */}
      </>
    );
  }
}

// DefaultHeader.propTypes = propTypes;
// DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
