export interface ApiResponse<T = any> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        details?: string;
        timestamp: string;
    };
}
