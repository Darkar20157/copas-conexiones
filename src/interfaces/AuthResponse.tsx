export interface AuthResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        name: string;
        phone: string;
        age: number;
        description: string;
    };
}