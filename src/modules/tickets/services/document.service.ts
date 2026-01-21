import { api } from '../../../core/api/api';

export const documentService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async uploadToTicket(ticketId: number, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/documents/ticket/${ticketId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
