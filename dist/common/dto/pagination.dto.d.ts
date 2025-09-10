export declare class PaginationDto {
    page?: number;
    limit?: number;
    sort?: string;
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
