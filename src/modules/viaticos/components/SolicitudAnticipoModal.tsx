import { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { api } from '../../../core/api/api';

interface SolicitudAnticipoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tickId?: number;
    onSuccess?: () => void;
    onDataSubmit?: (data: AnticipoFormData) => void;
    initialData?: AnticipoFormData;
}

interface AnticipoFormData {
    destino: string;
    detalle_destino: string;
    proposito_viaje: string;
    ciudades_visitar: string;
    fecha_inicio_viaje: string;
    fecha_fin_viaje: string;
    plazo_legalizacion_dias: number;
    valor_solicitado: number;
    valor_en_letras: string;
}

interface SolicitudAnticipoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tickId?: number;
    onSuccess?: () => void;
    onDataSubmit?: (data: AnticipoFormData) => void;
    initialData?: AnticipoFormData;
}

const DESTINO_OPTIONS = [
    { value: 'gastos_viaje', label: 'Gastos de viaje' },
    { value: 'gastos_infraestructura', label: 'Gastos de infraestructura' },
    { value: 'gastos_mercadeo', label: 'Gastos de mercadeo' },
    { value: 'gastos_cierre', label: 'Gastos de cierre' },
    { value: 'gastos_reuniones', label: 'Gastos de reuniones' },
    { value: 'gastos_refrigerios', label: 'Gastos de refrigerios' },
    { value: 'gastos_combustible', label: 'Gastos de combustible' },
    { value: 'otros', label: 'Otros' },
];

export function SolicitudAnticipoModal({ open, onOpenChange, tickId, onSuccess, onDataSubmit, initialData }: SolicitudAnticipoModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AnticipoFormData>(initialData || {
        destino: 'gastos_viaje',
        detalle_destino: '',
        proposito_viaje: '',
        ciudades_visitar: '',
        fecha_inicio_viaje: '',
        fecha_fin_viaje: '',
        plazo_legalizacion_dias: 5,
        valor_solicitado: 0,
        valor_en_letras: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.fecha_inicio_viaje || !formData.fecha_fin_viaje) {
            alert('Por favor selecciona las fechas de inicio y fin del viaje');
            return;
        }

        if (formData.valor_solicitado <= 0) {
            alert('Por favor ingresa el valor solicitado');
            return;
        }

        // If onDataSubmit is provided, just return data without API call (form-only mode)
        if (onDataSubmit) {
            console.log('SolicitudAnticipoModal: Submitting form data', formData);
            // Save to localStorage for persistence
            localStorage.setItem('anticipoData', JSON.stringify(formData));
            onDataSubmit(formData);
            onOpenChange(false);
            return;
        }

        // Otherwise, make API call (standalone mode)
        setLoading(true);
        try {
            await api.post('/viaticos', {
                tick_id: tickId,
                tipo_anticipo: 'con_anticipo',
                destino: formData.destino,
                detalle_destino: formData.detalle_destino,
                proposito_viaje: formData.proposito_viaje,
                ciudades_visitar: formData.ciudades_visitar,
                fecha_inicio_viaje: formData.fecha_inicio_viaje,
                fecha_fin_viaje: formData.fecha_fin_viaje,
                plazo_legalizacion_dias: formData.plazo_legalizacion_dias,
                valor_solicitado: formData.valor_solicitado,
                valor_en_letras: formData.valor_en_letras,
            });
            
            onSuccess?.();
            onOpenChange(false);
        } catch (error) {
            console.error('Error creating anticipo:', error);
            alert('Error al guardar los datos del anticipo');
        } finally {
            setLoading(false);
        }
    };

    const numberToWords = (num: number): string => {
        const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
        
        if (num === 0) return 'cero';
        
        let words = '';
        const millones = Math.floor(num / 1000000);
        const miles = Math.floor((num % 1000000) / 1000);
        const resto = num % 1000;
        
        if (millones > 0) {
            words += (millones === 1 ? 'un millón' : numberToWords(millones) + ' millones');
        }
        
        if (miles > 0) {
            words += (words ? ' ' : '') + (miles === 1 ? 'mil' : numberToWords(miles) + ' mil');
        }
        
        if (resto > 0) {
            if (resto < 10) {
                words += (words ? ' ' : '') + unidades[resto];
            } else if (resto < 20) {
                words += (words ? ' ' : '') + especiales[resto - 10];
            } else if (resto < 100) {
                const dec = Math.floor(resto / 10);
                const uni = resto % 10;
                words += (words ? ' ' : '') + decenas[dec] + (uni > 0 ? ' y ' + unidades[uni] : '');
            } else {
                const cent = Math.floor(resto / 100);
                const dec = Math.floor((resto % 100) / 10);
                const uni = resto % 10;
                words += (words ? ' ' : '') + centenas[cent] + (dec > 0 ? ' ' + decenas[dec] : '') + (uni > 0 ? ' y ' + unidades[uni] : '');
            }
        }
        
        return words + ' pesos';
    };

    const handleValorChange = (valor: number) => {
        setFormData({
            ...formData,
            valor_solicitado: valor,
            valor_en_letras: numberToWords(valor)
        });
    };

    return (
        <Modal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            title="Datos del Anticipo"
            className="max-w-2xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destino del anticipo *
                        </label>
                        <Select
                            value={formData.destino}
                            onChange={(value) => setFormData({ ...formData, destino: value as string })}
                            options={DESTINO_OPTIONS}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Detalle del destino
                        </label>
                        <Input
                            value={formData.detalle_destino}
                            onChange={(e) => setFormData({ ...formData, detalle_destino: e.target.value })}
                            placeholder="Detalle adicional del destino"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Propósito del viaje
                        </label>
                        <Input
                            value={formData.proposito_viaje}
                            onChange={(e) => setFormData({ ...formData, proposito_viaje: e.target.value })}
                            placeholder="Ej: Corrías, Visita clientes, etc."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudades a visitar
                        </label>
                        <Input
                            value={formData.ciudades_visitar}
                            onChange={(e) => setFormData({ ...formData, ciudades_visitar: e.target.value })}
                            placeholder="Ej: Popayán, Almaguer, Leiva"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha inicio *
                            </label>
                            <Input
                                type="date"
                                value={formData.fecha_inicio_viaje}
                                onChange={(e) => setFormData({ ...formData, fecha_inicio_viaje: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha fin *
                            </label>
                            <Input
                                type="date"
                                value={formData.fecha_fin_viaje}
                                onChange={(e) => setFormData({ ...formData, fecha_fin_viaje: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor solicitado *
                            </label>
                            <Input
                                type="number"
                                value={formData.valor_solicitado}
                                onChange={(e) => handleValorChange(Number(e.target.value))}
                                placeholder="0"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Días para legalizar
                            </label>
                            <Input
                                type="number"
                                value={formData.plazo_legalizacion_dias}
                                onChange={(e) => setFormData({ ...formData, plazo_legalizacion_dias: Number(e.target.value) })}
                                min={1}
                                max={30}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor en letras
                        </label>
                        <Input
                            value={formData.valor_en_letras}
                            onChange={(e) => setFormData({ ...formData, valor_en_letras: e.target.value })}
                            placeholder="Se autocompleta al escribir el valor"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button variant="brand" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar y Continuar'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
