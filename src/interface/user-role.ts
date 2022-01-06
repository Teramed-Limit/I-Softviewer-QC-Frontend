export interface UserRole {
    roleName: string;
    description: string;
}

export interface RoleFunction {
    roleName: string;
    functionName: string;
    correspondElementId: string;
    description: string;
    checked: boolean;
}
