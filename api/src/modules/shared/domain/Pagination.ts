export type PaginationProps = {
  page: number;
  pageSize: number;
}

export class Pagination {
  readonly page: number;
  readonly pageSize: number;

  constructor({ page, pageSize }: PaginationProps) {
    this.page = page;
    this.pageSize = pageSize;
  }

  static default({ page = 0, pageSize = 10 }: { page: number | undefined; pageSize: number | undefined; }): Pagination {
    return new Pagination({ page, pageSize });
  }

  skip(): number | undefined {
    if (this.pageSize === -1) return undefined;
    return (this.page) * this.pageSize;
  }

  take(): number | undefined {
    if (this.pageSize === -1) return undefined;
    return this.pageSize;
  }
}
