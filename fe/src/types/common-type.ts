export interface SuccessResponse {
  message: string;
}

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface DropdownItem {
  label: string;
  value: string | number;
  subValue?: string | number;
}
