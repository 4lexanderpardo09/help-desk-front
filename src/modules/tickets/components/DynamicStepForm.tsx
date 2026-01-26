import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../shared/components/Input';
import type { TemplateField } from '../interfaces/Ticket';

interface DynamicStepFormProps {
    fields: TemplateField[]; // Schema
    onChange: (values: { campoId: number; valor: string }[]) => void;
}

export const DynamicStepForm: React.FC<DynamicStepFormProps> = ({ fields, onChange }) => {
    const { control, watch, formState: { errors } } = useForm();
    const allValues = watch();

    // Propagate changes up to parent
    useEffect(() => {
        if (!fields || fields.length === 0) return;

        const formattedValues = Object.entries(allValues).map(([key, value]) => {
            // key is "field_123" -> extract 123
            const fieldId = parseInt(key.replace('field_', ''), 10);
            return {
                campoId: fieldId,
                valor: String(value || '') // Ensure string
            };
        }).filter(v => v.valor !== '');

        onChange(formattedValues);
    }, [allValues, fields, onChange]);

    if (!fields || fields.length === 0) return null;

    return (
        <div className="space-y-4 p-4 border border-gray-100 rounded-lg bg-slate-50/50 mb-4 transition-all">
            <h4 className="font-semibold text-sm text-[#121617] mb-2 uppercase tracking-wide">Información del Paso</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                    const fieldName = `field_${field.id}`;

                    return (
                        <div key={field.id} className={field.tipo === 'textarea' ? 'col-span-2' : ''}>
                            <Controller
                                name={fieldName}
                                control={control}
                                rules={{ required: field.required ? 'Este campo es obligatorio' : false }}
                                render={({ field: { onChange, value } }) => {
                                    if (field.tipo === 'textarea') {
                                        return (
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={fieldName} className="text-[#121617] text-sm font-semibold">
                                                    {field.nombre} {field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                <textarea
                                                    id={fieldName}
                                                    className="form-textarea block w-full rounded-lg border border-gray-200 bg-slate-50 p-3 text-base text-[#121617] placeholder:text-gray-400 focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal min-h-[100px] transition-all hover:bg-slate-100"
                                                    value={value || ''}
                                                    onChange={onChange}
                                                    placeholder={field.nombre}
                                                />
                                            </div>
                                        );
                                    }
                                    if (field.tipo === 'date') {
                                        return <Input
                                            type="date"
                                            label={`${field.nombre} ${field.required ? '*' : ''}`}
                                            id={fieldName}
                                            value={value || ''}
                                            onChange={onChange}
                                        />;
                                    }
                                    // Default text
                                    return <Input
                                        type="text"
                                        label={`${field.nombre} ${field.required ? '*' : ''}`}
                                        id={fieldName}
                                        value={value || ''}
                                        onChange={onChange}
                                        placeholder={field.nombre}
                                    />;
                                }}
                            />
                            {errors[fieldName] && (
                                <span className="text-xs text-red-500 mt-1 block">Este campo es requerido</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
