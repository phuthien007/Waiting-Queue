export class PaginateDto<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };

  constructor(data: T[], page: number, size: number, total: number) {
    this.data = data;
    this.pagination = {
      page,
      size,
      total,
    };
  }
}
