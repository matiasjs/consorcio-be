export declare class PaginationDto {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
