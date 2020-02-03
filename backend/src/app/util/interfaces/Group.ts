export enum GroupUserOperation {
  Create = 'c',
  Delete = 'd',
}

export enum GroupResourceOperation {
  Create = 'c',
  Update = 'u',
  Delete = 'd',
}
export interface GroupUserData {
  id: number;
  name?: string;
  email?: string;
  operation?: string;
}

export interface GroupResourcePermissionsData {
  write: boolean;
  update: boolean;
  del: boolean;
}

export interface GroupResourceData {
  id: number;
  name?: string;
  permissions: GroupResourcePermissionsData;
  operation?: string;
}

export interface GroupData {
  id?: number;
  name: string;
  blocked?: boolean;
  description?: string;
  users?: GroupUserData[];
  resources?: GroupResourceData[];
}

/**
 * Interface to fetch groups
 */
export interface GroupQueryData {
  id?: number;
  name?: string;
  blocked?: boolean;
  limit: number;
  offset: number;
}
