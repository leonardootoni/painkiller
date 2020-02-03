import React from 'react';

const AUTH_KEY = 'auth_cms';

export interface UserPermissions {
  resource: string;
  write: boolean;
  update: boolean;
  del: boolean;
}

export interface UserAuthData {
  user: {
    id: number;
    name: string;
    email: string;
    permissions: UserPermissions[];
  };
  token: string;
}

export interface UserAuthState {
  loginData?: UserAuthData;
  isAuthenticated: () => boolean;
  signup: (user: UserAuthData) => void;
  logout: () => void;
  getResoucePermissions: (resource: string) => Promise<UserPermissions | null>;
}

interface AuthContextProps {
  children: React.ReactNode;
}

// Used by Axios service class
export const getBearerToken = (): string | null => {
  const auth = sessionStorage.getItem(AUTH_KEY);
  if (auth) {
    const userData: UserAuthData = JSON.parse(atob(auth));
    return userData.token;
  }

  return null;
};

export const AuthContext = React.createContext<UserAuthState | null>(null);

export class AppAuthContextProvider extends React.Component<AuthContextProps, UserAuthState> {
  constructor(props: Readonly<AuthContextProps>) {
    super(props);
    const defaultValue: UserAuthState = {
      loginData: undefined,
      isAuthenticated: this.isAuthenticated,
      signup: this.signup,
      logout: this.logout,
      getResoucePermissions: this.getResoucePermissions,
    };

    const userSession = this.loadDataFromSession();
    if (userSession) {
      defaultValue.loginData = userSession;
    }

    this.state = { ...defaultValue };
  }

  isAuthenticated = () => {
    const { loginData } = this.state;
    return !!loginData;
  };

  signup = (user: UserAuthData) => {
    const signupState = { ...this.state };
    signupState.loginData = user;
    this.setState({ ...signupState });
    this.saveDataToSession(user);
  };

  logout = () => {
    const logoutState = { ...this.state };
    delete logoutState.loginData;
    this.setState(newState => ({
      ...newState,
      loginData: undefined,
    }));

    this.setState({ ...logoutState });
    sessionStorage.removeItem(AUTH_KEY);
  };

  // Returns all the User's permissionns for a given URL. It will return null otherwise.
  getResoucePermissions = async (resource: string): Promise<UserPermissions | null> => {
    const { loginData } = this.state;
    if (loginData) {
      let baseResource = resource;
      if (baseResource.lastIndexOf('/') > 0) {
        // It ignores everything after second /. Eg: /users/5, considers only /users
        baseResource = `${resource.substring(0, resource.indexOf(`/`, 1))}`;
      }

      const {
        user: { permissions },
      } = loginData;

      // Get User Permission from State for a given URL
      const userPermissions = permissions.find(p => p.resource === baseResource);
      if (userPermissions) {
        return userPermissions;
      }
    }

    // No permissions found
    return null;
  };

  saveDataToSession = (user: UserAuthData) => {
    const stringfiedUser = JSON.stringify(user);
    const encodedUser = window.btoa(stringfiedUser);
    sessionStorage.setItem(AUTH_KEY, encodedUser);
  };

  // Load user session data if exists, otherwise, returns undefined
  loadDataFromSession = () => {
    const encodedUser = sessionStorage.getItem(AUTH_KEY);
    if (encodedUser) {
      try {
        const stringfiedUser = window.atob(encodedUser);
        const user = JSON.parse(stringfiedUser) as UserAuthData;
        return user;
      } catch (error) {
        // invalid session key. Logout user immediately
        this.logout();
      }
    }

    return undefined;
  };

  render() {
    const { children } = this.props;
    return <AuthContext.Provider value={{ ...this.state }}>{children}</AuthContext.Provider>;
  }
}

export const AppAuthContextConsumer = AuthContext.Consumer;
