/**
 * Password and Password Confirmation are optionals, being required only for create a new User.
 * User Password will be updated only through a changePassword procedure.
 */
export interface UserData {
  id?: number;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  blocked: boolean;
}
/**
 * Interface used to query an User by id
 */
export interface UserQuery {
  id: number;
}

/**
 * Interface used to fetch Users by parameters, always eforcing pagination.
 */
export interface UserQueryData {
  id?: number;
  name?: string;
  email?: string;
  limit: number;
  offset: number;
}

/**
 * Used by Authorization service to store security data into cache
 */
export type Permission = {
  idUser: number;
  resource: string;
  groupId: number;
  write: boolean;
  update: boolean;
  del: boolean; // Field set as del due to issues with redis
};

/**
 * Interface used by the Login process to wrap all user permissions.
 */
export type ResourcePermission = {
  resource: string;
  write: boolean;
  update: boolean;
  del: boolean; // Field set as del due to issues with redis
};
