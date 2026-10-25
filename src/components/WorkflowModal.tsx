import React from 'react';
import {
  FileCheck2,
  Users,
  Clock,
  FileSignature,
  DollarSign,
  Building,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../types';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePhase: (targetRole: UserRole, targetTab: string) => void;
}

interface WorkflowPhase {
  number: number;
  title: string;
  subtitle: string;
  responsible: string;
  roleId: UserRole;
  targetTab: string;
  icon: React.ElementType;
  items: string[];
  color: string;
}

const PHASES: WorkflowPhase[] = [
  {
    number: 1,
    title: 'Fase 1: Alta, Validación Legal e Inventario',
    subtitle: 'Curaduría y carga del desarrollo + Certeza Jurídica F.U.T.U.R.A.',
    responsible: 'Superadministrador / Mesa de Control y Legal',
    roleId: 'superadmin',
    targetTab: 'developments',
    icon: FileCheck2,
    color: '#FD363D',
    items: [
      'Registro de nuevo proyecto (ubicación, amenidades, etapas y precios/m²)',
      'Validación de certeza jurídica (MIA, FUA, escrituras predio matriz)',
      'Carga de Master Plan interactivo con m², colindancias y estado Disponible',
    ],
  },
  {
    number: 2,
    title: 'Fase 2: Captación, Perfilamiento y Cotización',
    subtitle: 'Distribución omnicanal + Simulación financiera inmediata',
    responsible: 'Gerente Comercial / Asesor Inmobiliario',
    roleId: 'advisor',
    targetTab: 'crm',
    icon: Users,
    color: '#2563EB',
    items: [
      'Entrada y asignación de prospectos (WhatsApp, formularios y brokers)',
      'Perfilamiento de objetivos (Plusvalía, Patrimonio, Renta Vacacional)',
      'Cotizador financiero en segundos (enganche, 12-60 MSI y PDF membretado)',
    ],
  },
  {
    number: 3,
    title: 'Fase 3: Apartado y Bloqueo Temporal del Lote',
    subtitle: 'Reserva digital con comprobante + Timer de expiración 48-72h',
    responsible: 'Asesor Inmobiliario / Gerente Comercial',
    roleId: 'commercial_manager',
    targetTab: 'reservations',
    icon: Clock,
    color: '#F59E0B',
    items: [
      'Carga de comprobante de apartado express por el asesor',
      'Aprobación inmediata por Gerencia Comercial',
      'Cambio a estatus Apartado con cronómetro para evitar duplicidad',
    ],
  },
  {
    number: 4,
    title: 'Fase 4: Expediente, Contrato y Firma Digital',
    subtitle: 'Validación KYC/PLD + Generación de promesa y e.firma',
    responsible: 'Mesa de Control y Legal / Cliente',
    roleId: 'legal_control',
    targetTab: 'contracts',
    icon: FileSignature,
    color: '#8B5CF6',
    items: [
      'Carga y dictaminación de INE, RFC, comprobante y beneficiarios PLD',
      'Generación automatizada de promesa de compraventa con amortización',
      'Firma electrónica digital (Nom-151 / DocuSign / Mifiel)',
    ],
  },
  {
    number: 5,
    title: 'Fase 5: Cobranza, Conciliación y Comisiones',
    subtitle: 'Cobro de enganche, conciliación bancaria y dispersión',
    responsible: 'Administración, Cobranza / Gerente Comercial',
    roleId: 'collections',
    targetTab: 'conciliation',
    icon: DollarSign,
    color: '#10B981',
    items: [
      'Validación de pago total del enganche y activación de mensualidades',
      'Dispersión y cálculo automático de comisiones a asesores y brokers',
      'Cobranza recurrente preventiva por WhatsApp y emisión de recibos',
    ],
  },
  {
    number: 6,
    title: 'Fase 6: Postventa, Avance de Obra y Escrituración',
    subtitle: 'Portal de autoservicio + Finiquito y trámites notariales',
    responsible: 'Inversionista / Mesa de Control y Legal',
    roleId: 'investor',
    targetTab: 'progress',
    icon: Building,
    color: '#000000',
    items: [
      'Seguimiento por el portal del cliente (pagos, fotos y videos de obra)',
      'Emisión de carta finiquito / no adeudo al liquidar',
      'Coordinación notarial del expediente y escrituración final',
    ],
  },
];

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  onNavigatePhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <img
            src="https://appdesignproyectos.com/futuralogo.png"
            alt="Futura Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="h-5 w-px bg-gray-200" />
          <h2 className="text-xl font-bold text-gray-900">
            Flujo de Trabajo Operativo de Punta a Punta
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Estructura integral que conecta cada fase de comercialización y postventa de lotes Futura con sus roles responsables.
        </p>

        <div className="space-y-4">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.number}
                className="group rounded-2xl border border-gray-200 hover:border-[#FD363D] p-4 md:p-5 bg-white hover:bg-red-50/20 transition-all duration-200 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs font-bold text-sm"
                      style={{ backgroundColor: phase.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Paso 0{phase.number}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {phase.responsible}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5 group-hover:text-[#FD363D] transition-colors">
                        {phase.title}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {phase.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigatePhase(phase.roleId, phase.targetTab);
                      onClose();
                    }}
                    className="self-end md:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-[#FD363D] text-white text-xs font-semibold transition active:scale-95 shrink-0"
                  >
                    <span>Ir a esta Fase</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {phase.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#FD363D] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            F.U.T.U.R.A.: Certeza Jurídica, Automatización Financiera y Experiencia Postventa
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-xs font-semibold transition"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
