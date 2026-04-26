export interface User {
  id: number;
  email: string;
}

export interface UsersResponse {
  users: User[];
}
