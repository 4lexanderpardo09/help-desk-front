import { api } from '../../../core/api/api';
import type { Profile, CreateProfileDto, UpdateProfileDto } from '../interfaces/Profile';

interface ProfilesResponse {
    data: Profile[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface GetProfilesParams {
    page?: number;
    limit?: number;
    search?: string;
    estado?: number | 'all';
}

class ProfileService {
    async getProfiles(params: GetProfilesParams): Promise<ProfilesResponse> {
        const { page = 1, limit = 10, search, estado } = params;

        const queryParams: Record<string, any> = {
            page,
            limit
        };

        if (search) {
            queryParams['filter[nombre]'] = search;
        }

        if (estado !== 'all' && estado !== undefined) {
            queryParams['filter[estado]'] = estado;
        }

        const { data } = await api.get<ProfilesResponse>('/profiles', { params: queryParams });
        return data;
    }

    async getProfile(id: number): Promise<Profile> {
        const { data } = await api.get<Profile>(`/profiles/${id}`);
        return data;
    }

    async createProfile(data: CreateProfileDto): Promise<Profile> {
        const { data: response } = await api.post<Profile>('/profiles', data);
        return response;
    }

    async updateProfile(id: number, data: UpdateProfileDto): Promise<Profile> {
        const { data: response } = await api.put<Profile>(`/profiles/${id}`, data);
        return response;
    }

    async deleteProfile(id: number): Promise<void> {
        await api.delete(`/profiles/${id}`);
    }
}

export const profileService = new ProfileService();
