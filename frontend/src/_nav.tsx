export interface NavItem {
  name: string;
  url: string;
  icon: string;
  children?: NavItem[];
}

export interface AppNav {
  items: NavItem[];
}

const navigation: AppNav = {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "icon-speedometer"
    },
    {
      name: "Security",
      url: "",
      icon: "fa fa-shield",
      children: [
        {
          name: "Users",
          url: "/users",
          icon: "fa fa-users"
        },
        {
          name: "Group Permissions",
          url: "/groups",
          icon: "fa fa-lock"
        }
      ]
    }
  ]
};
export default navigation;
