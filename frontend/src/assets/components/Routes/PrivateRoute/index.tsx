/* eslint-disable react/jsx-props-no-spreading */

import React, { useContext } from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { AuthContext } from '../../../store/auth/AuthContext';

/**
 * Route Security Component - Only allow authenticate users to get access on application routes
 * if authenticated. Other all requests will be redirected to /login
 * @author Leonardo Otoni
 * @param param0
 */
export const PrivateRoute = ({ component, ...rest }: RouteProps) => {
  if (!component) {
    throw Error('component is undefined');
  }

  const auth = useContext(AuthContext);
  let isAuthenticated = false;
  if (auth) {
    isAuthenticated = auth.isAuthenticated();
  }

  const render = (props: RouteComponentProps<{}>): React.ReactNode => {
    if (isAuthenticated) {
      const Component = component; // JSX Elements have to be uppercase.
      return (
        <>
          <Component {...props} />
        </>
      );
    }
    return <Redirect to={{ pathname: '/login' }} />;
  };

  return <Route {...rest} render={render} />;
};
