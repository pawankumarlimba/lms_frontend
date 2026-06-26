export interface IApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
