import React, { Suspense, SyntheticEvent, Component } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
  // @ts-ignore
} from '@coreui/react';
// sidebar nav config
import navigation, { AppNav, NavItem } from '../../_nav';
// routes config
import routes, { AppRoutes } from '../../routes';

import { AuthContext, UserAuthState, UserPermissions } from '../../assets/store/auth/AuthContext';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));

const DefaultHeader = React.lazy(() =>
  import('./DefaultHeader').then(({ default: DefaultHeader }) => ({
    default: DefaultHeader,
  })),
);

interface DefaultLayoutState {
  userNavigation: AppNav;
  userRoutes: AppRoutes[];
}

class DefaultLayout extends Component<RouteComponentProps, DefaultLayoutState> {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  constructor(props: RouteComponentProps) {
    super(props);
    const menu: AppNav = {
      items: [{name: '', icon: '', url:''}]
    }

    DefaultLayout.contextType = AuthContext;
    this.state = {
      userNavigation: menu,
      userRoutes: [],
    };
  }

  signOut(e: SyntheticEvent) {
    e.preventDefault();
    (this.context as UserAuthState).logout();
    this.props.history.push('/login');
  }

  componentDidMount() {
    const userContext = this.context as UserAuthState;
    const { loginData } = userContext;
    let permissions: UserPermissions[] = [];
    if (loginData) {
      permissions = loginData.user.permissions;
    }

    this.filteredApplicationRoutes(permissions);
    this.filteredUserMenu(permissions);
  }

  /**
   *
   * Filtered Application Routes according to the Users Permissions
   * @param permissions User Security Permissions from State Context
   */
  private async filteredApplicationRoutes(permissions: UserPermissions[]) {

    const registredAppRoutes = new Map<string, AppRoutes>();
    routes.forEach(route => {
      registredAppRoutes.set(route.path, route);
    });

    const routesToBeLoaded: AppRoutes[] = [];

    //temporary url cache
    const allowedRoutesCache = new Set<string>();

    // always set a home page to a the user
    allowedRoutesCache.add('/dashboard');
    routesToBeLoaded.push(registredAppRoutes.get('/dashboard')!);

    // Performs the filter by "base" url ['/users', '/groups', ...]. URLs like /users/:id are considered like /users
    permissions.forEach(permission => {
      const { resource } = permission;

      registredAppRoutes.forEach((appRoute, key) => {
        if(key.startsWith(resource) && !allowedRoutesCache.has(key)){
          allowedRoutesCache.add(key);
          routesToBeLoaded.push(appRoute);
        }
      });

    });

    this.setState({ userRoutes: routesToBeLoaded });
  }

  /**
   * Filtered the Application Menu according to the User's permissions.
   * @param permissions User Security permissions
   */
  private async filteredUserMenu(permissions: UserPermissions[]) {
    const userRoutes = new Set(permissions.map(permission => permission.resource));
    // Filter items without children
    const filteredItemsMenu = navigation.items
      .filter(navItem => navItem.children === undefined)
      .filter(navItem => userRoutes.has(navItem.url));

    // Filter menus with children items
    const filteredSubMenus = navigation.items
      .filter(navItem => navItem.children !== undefined)
      .map(navItem => {
        // Only submenus matching user permissions
        let subMenuItems: NavItem[] = []
        if(navItem.children){
          subMenuItems = navItem.children.filter(subMenuItem => userRoutes.has(subMenuItem.url));
        }
        navItem.children = subMenuItems;
        return navItem;
      })
      // Eliminate all menus without at least one submenu item
      .filter(navItem => navItem.children && navItem.children.length > 0);

    const appFilteredMenus: AppNav = {
      items: [...filteredItemsMenu, ...filteredSubMenus],
    };

    this.setState({userNavigation: appFilteredMenus})
  }

  render() {
    const { userRoutes, userNavigation } = this.state;
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense fallback={this.loading()}>
              <AppSidebarNav navConfig={userNavigation} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {userRoutes.map((route, idx) =>
                    route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        render={props => <route.component {...props} />}
                      />
                    ) : null,
                  )}
                  {/* <Redirect from="/" to="/dashboard" /> */}
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
