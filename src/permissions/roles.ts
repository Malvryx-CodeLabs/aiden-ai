export enum Role {
  USER = "USER",
  GROUP_ADMIN = "GROUP_ADMIN",
  DEVELOPER = "DEVELOPER",
  OWNER = "OWNER",
}

export const ROLE_HIERARCHY: Role[] = [
  Role.USER,
  Role.GROUP_ADMIN,
  Role.DEVELOPER,
  Role.OWNER,
];

export function hasRole(
  current: Role,
  required: Role
): boolean {
  return (
    ROLE_HIERARCHY.indexOf(current) >=
    ROLE_HIERARCHY.indexOf(required)
  );
}

export function isOwner(role: Role): boolean {
  return role === Role.OWNER;
}

export function isDeveloper(role: Role): boolean {
  return (
    role === Role.DEVELOPER ||
    role === Role.OWNER
  );
}

export function isAdmin(role: Role): boolean {
  return (
    role === Role.GROUP_ADMIN ||
    role === Role.DEVELOPER ||
    role === Role.OWNER
  );
}
