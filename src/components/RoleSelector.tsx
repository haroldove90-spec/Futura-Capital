import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  Scale,
  CreditCard,
  UserCheck,
  Download,
  Database,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  onOpenInstall: () => void;
  onOpenDataModal: () => void;
}

interface RoleCardItem {
  id: UserRole;
  title: string;
  icon: React.ElementType;
}

const ROLES_LIST: RoleCardItem[] = [
  {
    id: 'superadmin',
    title: 'Superadministrador / Dirección General',
    icon: ShieldCheck,
  },
  {
    id: 'commercial_manager',
    title: 'Gerente Comercial / Director de Ventas',
    icon: TrendingUp,
  },
  {
    id: 'advisor',
    title: 'Asesor Inmobiliario / Vendedor',
    icon: MapPin,
  },
  {
    id: 'legal_control',
    title: 'Mesa de Control y Legal (Due Diligence / Operaciones)',
    icon: Scale,
  },
  {
    id: 'collections',
    title: 'Administración, Cobranza y Cuentas por Cobrar',
    icon: CreditCard,
  },
  {
    id: 'investor',
    title: 'Inversionista / Cliente (Portal Web o App de Clientes)',
    icon: UserCheck,
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  onOpenInstall,
  onOpenDataModal,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between p-4 sm:p-6 md:p-10 select-none">
      {/* Sin header. Solo logo sin encapsular */}
      <div className="flex flex-col items-center justify-center pt-4 md:pt-8 pb-6">
        <img
          src="https://appdesignproyectos.com/futuralogo.png"
          alt="Futura"
          className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio */}
      <div className="w-full max-w-6xl mx-auto my-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {ROLES_LIST.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className="group relative flex flex-col items-center justify-center text-center p-5 sm:p-6 md:p-8 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#FD363D] hover:-translate-y-1 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {/* Ícono de rol */}
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-800 border border-gray-100 group-hover:bg-[#FD363D] group-hover:text-white transition-all duration-200 mb-4 shadow-xs">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                {/* Solo nombre del rol - Sin descripciones */}
                <span className="font-bold text-xs sm:text-sm md:text-base text-gray-900 group-hover:text-[#FD363D] transition-colors leading-snug line-clamp-3">
                  {role.title}
                </span>

                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[11px] font-semibold text-[#FD363D]">
                  <span>Acceder</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pie sutil con acciones directas de instalación PWA y base de datos */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 pb-2 text-xs text-gray-500">
        <button
          onClick={onOpenInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#FD363D] hover:text-[#FD363D] transition shadow-xs"
        >
          <Download className="h-3.5 w-3.5 text-[#FD363D]" />
          <span>Instalar Invernadero Futura</span>
        </button>

        <button
          onClick={onOpenDataModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 hover:text-gray-800 transition shadow-xs"
        >
          <Database className="h-3.5 w-3.5 text-gray-500" />
          <span>Configurar Supabase / Borrar Demos</span>
        </button>
      </div>
    </div>
  );
};
