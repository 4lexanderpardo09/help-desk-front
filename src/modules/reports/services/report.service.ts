import { api } from "../../../core/api/api";

class ReportService {
    async exportPerformance(): Promise<void> {
        await this.downloadFile('/tickets/export/performance', `Reporte_Desempeno_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    async exportComments(): Promise<void> {
        await this.downloadFile('/tickets/export/comments', `Reporte_Comentarios_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    async exportFlowUsage(): Promise<void> {
        await this.downloadFile('/workflows/reporte/uso/export', `Reporte_Flujos_En_Uso_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    private async downloadFile(url: string, filename: string): Promise<void> {
        const response = await api.get(url, { responseType: 'blob' });
        const mimeType = response.headers['content-type'] || 'application/octet-stream';
        const blob = new Blob([response.data], { type: mimeType });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    }
}

export const reportService = new ReportService();
