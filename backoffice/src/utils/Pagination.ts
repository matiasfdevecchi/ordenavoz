export type PaginationProps = {
  page: number;
  pageSize: number;
}

export class Pagination {
  readonly page: number;
  readonly pageSize: number;

  private static INITIAL_PAGE = 0;

  constructor({ page, pageSize }: PaginationProps) {
    this.page = page;
    this.pageSize = pageSize;
  }

  static default(): Pagination {
    return new Pagination({ page: this.INITIAL_PAGE, pageSize: 10 });
  }

  toObject(): PaginationProps {
    return {
      page: this.page,
      pageSize: this.pageSize,
    };
  }

  withPage(page: number): Pagination {
    return new Pagination({ page, pageSize: this.pageSize });
  }

  withPageSize(pageSize: number): Pagination {
    return new Pagination({ page: this.page, pageSize });
  }

  resetPage(): Pagination {
    return new Pagination({ page: Pagination.INITIAL_PAGE, pageSize: this.pageSize });
  }
}
