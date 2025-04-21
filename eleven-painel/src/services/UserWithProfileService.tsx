import {api} from '@/lib/api';

export interface Address {
    id: number;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    uf: string;
}

export interface UserWithProfile {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    userProfileId: number;
    cpf: string;
    birthDate: string;
    phone: string;
    motherName: string;
    fatherName: string;
    addresses: Address[];
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export class UserWithProfileService {
    static async getAllUsersWithProfiles(page: number, size: number, p0: string): Promise<PaginatedResponse<UserWithProfile>> {
        const {data} = await api.get<PaginatedResponse<UserWithProfile>>('/users-with-profiles', {
            params: {page, size},
        });
        return data;
    }
}