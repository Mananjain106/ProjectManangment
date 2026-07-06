export const UserRolesEnum = {
    ADMIN   : "admin",
    USER    : "user",  
    project_admin: "project_admin",
}
export const AvaliableUserRoles = Object.values(UserRolesEnum);

export const UserStatusEnum = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
}  
export const AvaliableUserStatus = Object.values(UserStatusEnum);