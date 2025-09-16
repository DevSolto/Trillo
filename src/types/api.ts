// Shared API DTOs and helpers

export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl: string;
}

export interface Association {
  id: string;
  name: string;
  cnpj: string;
  status: boolean;
}

export type TaskStatus = 'open' | 'inProgress' | 'finished' | 'canceled';
export type TaskPriority = 'low' | 'medium' | 'high';

// Shape returned by backend for tasks in listings
export interface TaskApi {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  dueDate?: string | null;
  creator?: {
    id: string;
    name?: string;
    email?: string;
    role?: UserRole;
  } | null;
  association?: {
    id: string;
    name?: string;
    cnpj?: string;
    status?: boolean;
  } | null;
  team?:
    | { id: string; name?: string; email?: string; role?: UserRole }[]
    | null;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

// Specific responses
export interface UsersResponse extends Paginated<User> {}
export interface AssociationsResponse extends Paginated<Association> {}

// Commands
export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
}
export type UpdateUserDto = Partial<CreateUserDto>;

export interface CreateAssociationDto {
  name: string;
  cnpj: string;
  status?: boolean;
}
export type UpdateAssociationDto = Partial<CreateAssociationDto>;
