import React from 'react';
import {
  BarChart3,
  Layers,
  Users,
  Settings2,
  FileCheck,
  GitBranch,
  UserPlus,
  Clock,
  Award,
  DollarSign,
  Map,
  Calculator,
  MessageSquare,
  BookmarkCheck,
  Share2,
  FileText,
  FileSignature,
  FolderLock,
  Stamp,
  CalendarCheck,
  CheckSquare,
  BellRing,
  AlertOctagon,
  PieChart,
  Home,
  Receipt,
  UploadCloud,
  HardHat,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Download,
} from 'lucide-react';
import { UserRole } from '../types';

export interface ModuleItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

export const ROLE_MODULES: Record<UserRole, ModuleItem[]> = {
  superadmin: [
    { id: 'analytics', label: 'Dashboard Ejecutivo y Métricas', shortLabel: 'Dashboard', icon: BarChart3 },
    { id: 'developments', label: 'Gestión de Desarrollos y Lotes', shortLabel: 'Desarrollos', icon: Layers },
    { id: 'users', label: 'Usuarios, Permisos y Descuentos', shortLabel: 'Usuarios', icon: Users },
    { id: 'policies', label: 'Reglas Comerciales y Comisiones', shortLabel: 'Reglas', icon: Settings2 },
    { id: 'diligence', label: 'Auditoría F.U.T.U.R.A. (Due Diligence)', shortLabel: 'Auditoría', icon: FileCheck },
  ],
  commercial_manager: [
    { id: 'pipeline', label: 'Embudo de Ventas (Pipeline)', shortLabel: 'Pipeline', icon: GitBranch },
    { id: 'distribution', label: 'Distribución Inteligente de Leads', shortLabel: 'Leads', icon: UserPlus },
    { id: 'reservations', label: 'Bloqueos y Apartados (48-72h)', shortLabel: 'Apartados', icon: Clock },
    { id: 'exceptions', label: 'Excepciones Comerciales', shortLabel: 'Excepciones', icon: Award },
    { id: 'commissions', label: 'Control y Liquidación de Comisiones', shortLabel: 'Comisiones', icon: DollarSign },
  ],
  advisor: [
    { id: 'masterplan', label: 'Master Plan Interactivo', shortLabel: 'Master Plan', icon: Map },
    { id: 'simulator', label: 'Simulador Financiero y PDF', shortLabel: 'Cotizador', icon: Calculator },
    { id: 'crm', label: 'CRM de Seguimiento a Inversionistas', shortLabel: 'CRM', icon: MessageSquare },
    { id: 'express_reserve', label: 'Apartado Express de Lote', shortLabel: 'Apartar', icon: BookmarkCheck },
    { id: 'whatsapp', label: 'Integración WhatsApp y Folletos', shortLabel: 'WhatsApp', icon: Share2 },
  ],
  legal_control: [
    { id: 'kyc', label: 'Expediente Digital del Cliente (PLD)', shortLabel: 'KYC / PLD', icon: FileText },
    { id: 'contracts', label: 'Generador de Promesas de Compraventa', shortLabel: 'Promesas', icon: FileSignature },
    { id: 'esign', label: 'Firma Digital (Nom-151 / DocuSign)', shortLabel: 'Firma Digital', icon: Stamp },
    { id: 'vault', label: 'Bóveda Documental del Desarrollo', shortLabel: 'Bóveda Legal', icon: FolderLock },
    { id: 'notary', label: 'Seguimiento a Escrituración Notarial', shortLabel: 'Escrituración', icon: FileCheck },
  ],
  collections: [
    { id: 'schedules', label: 'Tablas de Amortización y Pagos', shortLabel: 'Amortización', icon: CalendarCheck },
    { id: 'conciliation', label: 'Conciliación Bancaria y Recibos', shortLabel: 'Conciliación', icon: CheckSquare },
    { id: 'alerts', label: 'Cobranza Preventiva (WhatsApp/Email)', shortLabel: 'Alertas', icon: BellRing },
    { id: 'penalties', label: 'Penalizaciones y Moratorios', shortLabel: 'Intereses', icon: AlertOctagon },
    { id: 'delinquency', label: 'Reporte de Cartera Vencida', shortLabel: 'Cartera Vencida', icon: PieChart },
  ],
  investor: [
    { id: 'my_lots', label: 'Mis Lotes y Contratos', shortLabel: 'Mis Lotes', icon: Home },
    { id: 'account_status', label: 'Estado de Cuenta en Línea', shortLabel: 'Estado Cuenta', icon: Receipt },
    { id: 'upload_payment', label: 'Subir Comprobante de Pago', shortLabel: 'Pagar', icon: UploadCloud },
    { id: 'progress', label: 'Avance de Obra en Vivo (Fotos/Videos)', shortLabel: 'Avance Obra', icon: HardHat },
    { id: 'legal_docs', label: 'Certeza Jurídica y Recibos', shortLabel: 'Documentos', icon: Shield },
  ],
};

interface SidebarProps {
  activeRole: UserRole;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenWorkflow: () => void;
  onOpenInstall: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenWorkflow,
  onOpenInstall,
  onLogout,
}) => {
  const modules = ROLE_MODULES[activeRole] || [];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Botón de colapsar / expandir */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-2">
            Módulos del Rol
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expandir panel lateral' : 'Colapsar panel lateral'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Lista de Módulos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = currentTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectTab(m.id)}
              title={m.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#FD363D] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {!isCollapsed && <span className="truncate text-left">{m.label}</span>}
            </button>
          );
        })}

        {/* Acceso directo al Flujo Completo */}
        <div className="pt-4 mt-2 border-t border-gray-100">
          <button
            onClick={onOpenWorkflow}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#FD363D] bg-red-50 hover:bg-red-100 transition ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Ver Flujo Operativo Completo F.U.T.U.R.A."
          >
            <Layers className="h-4 w-4 shrink-0 text-[#FD363D]" />
            {!isCollapsed && <span className="truncate">Flujo Fases (1-6)</span>}
          </button>
        </div>
      </div>

      {/* Pie del menú lateral */}
      <div className="p-3 border-t border-gray-100 space-y-1.5">
        <button
          onClick={onOpenInstall}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Instalar Invernadero Futura"
        >
          <Download className="h-4 w-4 text-[#FD363D] shrink-0" />
          {!isCollapsed && <span>Instalar App PWA</span>}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Cambiar de Rol / Salir"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
