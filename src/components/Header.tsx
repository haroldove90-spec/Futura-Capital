import React, { useState } from 'react';
import {
  LogOut,
  Download,
  Database,
  ChevronDown,
  Menu,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Scale,
  CreditCard,
  UserCheck,
  Layers,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
  onOpenInstall: () => void;
  onOpenDataModal: () => void;
  onToggleSidebar?: () => void;
  onToggleWorkflow?: () => void;
}

const ROLE_DETAILS: Record<
  UserRole,
  { name: string; short: string; icon: React.ElementType }
> = {
  superadmin: {
    name: 'Superadministrador / Dirección General',
    short: 'Dirección General',
    icon: ShieldCheck,
  },
  commercial_manager: {
    name: 'Gerente Comercial / Ventas',
    short: 'Gerencia Comercial',
    icon: TrendingUp,
  },
  advisor: {
    name: 'Asesor Inmobiliario / Vendedor',
    short: 'Asesor Inmobiliario',
    icon: MapPin,
  },
  legal_control: {
    name: 'Mesa de Control y Legal',
    short: 'Mesa Legal',
    icon: Scale,
  },
  collections: {
    name: 'Cobranza y Cuentas por Cobrar',
    short: 'Cobranza',
    icon: CreditCard,
  },
  investor: {
    name: 'Inversionista / Portal Cliente',
    short: 'Portal Cliente',
    icon: UserCheck,
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onSelectRole,
  onLogout,
  onOpenInstall,
  onOpenDataModal,
  onToggleSidebar,
  onToggleWorkflow,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const currentRole = ROLE_DETAILS[activeRole];
  const CurrentIcon = currentRole.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Izquierda: Menú móvil y Logo institucional */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition"
              aria-label="Alternar menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRoleDropdownOpen(false)}>
            <img
              src="https://appdesignproyectos.com/futuralogo.png"
              alt="Futura Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Centro / Acceso rápido al Flujo de Trabajo */}
        {onToggleWorkflow && (
          <button
            onClick={onToggleWorkflow}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-[#FD363D] transition shadow-xs"
          >
            <Layers className="h-3.5 w-3.5 text-[#FD363D]" />
            <span>Flujo Operativo F.U.T.U.R.A. (Fases 1 - 6)</span>
          </button>
        )}

        {/* Derecha: Identificación del rol activo, Botón Instalar, Botón Datos y Salir */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Selector desplegable de rol activo */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/80 hover:bg-gray-100 transition text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FD363D] text-white shrink-0 shadow-xs">
                <CurrentIcon className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">
                  Rol Activo
                </p>
                <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[150px] md:max-w-[200px]">
                  {currentRole.short}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-2 z-40 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Cambiar de Rol Operativo
                    </p>
                  </div>
                  {(Object.keys(ROLE_DETAILS) as UserRole[]).map((r) => {
                    const item = ROLE_DETAILS[r];
                    const ItemIcon = item.icon;
                    const isActive = r === activeRole;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          onSelectRole(r);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                          isActive
                            ? 'bg-red-50 text-[#FD363D]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ItemIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#FD363D]' : 'text-gray-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Botón de instalación rápida PWA */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white text-xs font-semibold shadow-xs transition active:scale-95"
            title="Instalar Invernadero Futura en tu dispositivo"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Instalar App</span>
            <span className="md:hidden">Instalar</span>
          </button>

          {/* Botón borrar datos de muestra / Supabase */}
          <button
            onClick={onOpenDataModal}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-gray-700 transition flex items-center gap-1.5 text-xs font-medium"
            title="Borrar datos de muestra / Configurar Supabase"
          >
            <Database className="h-4 w-4 text-[#FD363D]" />
            <span className="hidden xl:inline">Datos / Supabase</span>
          </button>

          {/* Botón cerrar sesión */}
          <button
            onClick={onLogout}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition flex items-center gap-1.5 text-xs font-medium"
            title="Cerrar sesión y volver al selector de roles"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
