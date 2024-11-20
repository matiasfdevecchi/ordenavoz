import { PaginationProps } from "./Pagination";

export type PaginationResult = PaginationProps & {
  total: number;
}

export type EntriesResult<T> = {
  entries: T[];
  pagination: PaginationResult;
};
