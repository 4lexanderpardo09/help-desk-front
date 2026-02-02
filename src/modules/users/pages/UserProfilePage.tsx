import React from 'react';
import { ProfileSignatureUpload } from '../components/ProfileSignatureUpload';
import { useAuth } from '../../auth/context/useAuth';

const UserProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Mi Perfil
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Administra tu información personal y preferencias. {user?.nombre || ''}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information (ReadOnly for now or editable later) */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">
                        Información Personal
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
                            <div className="mt-1 text-sm text-gray-900">{user?.nombre} {user?.apellido}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Correo Electrónico</label>
                            <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Rol</label>
                            <div className="mt-1 text-sm text-gray-900">{user?.role?.nombre || 'Sin rol'}</div>
                        </div>
                    </div>
                </div>

                {/* Signature Upload */}
                <ProfileSignatureUpload />
            </div>
        </div>
    );
};

export default UserProfilePage;
