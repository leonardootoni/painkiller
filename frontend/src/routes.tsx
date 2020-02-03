import React, { LazyExoticComponent } from "react";

const Home = React.lazy(() => import("./views/Home"));
const GroupSearch = React.lazy(() => import("./views/Groups/Search"));
const Group = React.lazy(() => import("./views/Groups/Edit"));
const UserSearch = React.lazy(() => import("./views/Users/Search"));
const User = React.lazy(() => import("./views/Users/Edit"));

// const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
// const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/Base/Cards/Cards'));

export interface AppRoutes {
  path: string;
  exact?: boolean;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LazyExoticComponent<any>;
}

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes: AppRoutes[] = [
  { path: "/", exact: true, name: "Home", component: Home },
  { path: "/dashboard", exact: true, name: "Dashboard", component: Home },
  {
    path: "/groups",
    exact: true,
    name: "Group Search",
    component: GroupSearch
  },
  { path: "/groups/:id", exact: true, name: "Group", component: Group },
  { path: "/users", exact: true, name: "User Search", component: UserSearch },
  { path: "/users/:id", exact: true, name: "User", component: User }
  // { path: '/base/cards', name: 'Cards', component: Cards },
];

export default routes;
