import React, { PureComponent } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import './App.scss';

import { AppAuthContextProvider } from './assets/store/auth/AuthContext';
import { PrivateRoute } from './assets/components/Routes/PrivateRoute';

const loading = (): React.ReactElement => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login/Login'));
const Logout = React.lazy(() => import('./views/Pages/Logout'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500/Page500'));

class App extends PureComponent<{}, {}> {
  render() {
    return (
      <AppAuthContextProvider>
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" render={props => <Login />} />
              <Route exact path="/logout" render={props => <Logout />} />
              <Route exact path="/register" render={props => <Register props />} />
              <Route exact path="/404" render={props => <Page404 props />} />
              <Route exact path="/500" render={props => <Page500 props />} />
              <PrivateRoute path="/" component={DefaultLayout} />
            </Switch>
          </React.Suspense>
        </HashRouter>
      </AppAuthContextProvider>
    );
  }
}

export default App;
