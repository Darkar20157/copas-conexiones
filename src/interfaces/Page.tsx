export interface Page<T> {
    page: number,
    limit: number,
    total: number,
    data: T[];
}