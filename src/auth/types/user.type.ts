import { RoleEnum } from "./role.enum";

export interface UserResponseDto {
  email: string;
  role: RoleEnum;
  id: number;
}
