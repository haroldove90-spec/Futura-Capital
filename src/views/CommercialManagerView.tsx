import React, { useState } from 'react';
import {
  GitBranch,
  UserPlus,
  Clock,
  Award,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Send,
  MessageCircle,
  Filter,
  UserCheck,
  Building,
  Check,
} from 'lucide-react';
import {
  Lead,
  ReservationRequest,
  CommissionRecord,
  CommercialExceptionRequest,
  PipelineStage,
  Lot,
} from '../types';
import { storageService } from '../services/storageService';

interface CommercialManagerViewProps {
  currentTab: string;
  leads: Lead[];
  reservations: ReservationRequest[];
  commissions: CommissionRecord[];
  exceptions: CommercialExceptionRequest[];
  lots: Lot[];
  onDataChanged: () => void;
}

const PIPELINE_COLUMNS: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'primer_contacto', label: '1. Primer Contacto', color: '#6B7280' },
  { id: 'perfilamiento', label: '2. Perfilamiento', color: '#3B82F6' },
  { id: 'videollamada', label: '3. Asesoría / Zoom', color: '#8B5CF6' },
  { id: 'apartado', label: '4. Apartado Activo', color: '#F59E0B' },
  { id: 'firma_promesa', label: '5. Firma Promesa', color: '#EC4899' },
  { id: 'liquidacion', label: '6. Liquidación / Ganado', color: '#10B981' },
];

export const CommercialManagerView: React.FC<CommercialManagerViewProps> = ({
  currentTab,
  leads,
  reservations,
  commissions,
  exceptions,
  lots,
  onDataChanged,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('all');
  const [advisorFilter, setAdvisorFilter] = useState<string>('all');

  // Asignación de lead manual
  const handleAssignLead = (leadId: string, advisorName: string) => {
    const updated = leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            assignedAdvisorName: advisorName,
            assignedAdvisorId: advisorName.includes('Sofía') ? 'adv-01' : 'adv-02',
          }
        : l
    );
    storageService.saveLeads(updated);
    onDataChanged();
  };

  // Mover lead de etapa en el Pipeline
  const handleMoveLeadStage = (leadId: string, newStage: PipelineStage) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, status: newStage } : l
    );
    storageService.saveLeads(updated);
    onDataChanged();
  };

  // Aprobación o cancelación de apartado
  const handleApproveReservation = (reservationId: string) => {
    const updated = reservations.map((r) =>
      r.id === reservationId
        ? { ...r, status: 'Aprobado Activo' as const }
        : r
    );
    storageService.saveReservations(updated);

    // Actualizar también lote a apartado
    const res = reservations.find((r) => r.id === reservationId);
    if (res) {
      const updatedLots = lots.map((l) =>
        l.id === res.lotId ? { ...l, status: 'apartado' as const, buyerName: res.clientName } : l
      );
      storageService.saveLots(updatedLots);
    }

    onDataChanged();
  };

  const handleCancelReservation = (reservationId: string) => {
    const updated = reservations.map((r) =>
      r.id === reservationId
        ? { ...r, status: 'Cancelado' as const }
        : r
    );
    storageService.saveReservations(updated);

    const res = reservations.find((r) => r.id === reservationId);
    if (res) {
      const updatedLots = lots.map((l) =>
        l.id === res.lotId ? { ...l, status: 'disponible' as const, buyerName: undefined } : l
      );
      storageService.saveLots(updatedLots);
    }

    onDataChanged();
  };

  // Aprobación de excepción comercial
  const handleResolveException = (exceptionId: string, status: 'Aprobada' | 'Rechazada') => {
    const updated = exceptions.map((e) =>
      e.id === exceptionId ? { ...e, status } : e
    );
    storageService.saveExceptions(updated);
    onDataChanged();
  };

  // Liquidación de comisiones
  const handleLiquidateCommission = (commissionId: string) => {
    const updated = commissions.map((c) =>
      c.id === commissionId ? { ...c, status: 'Liquidado' as const } : c
    );
    storageService.saveCommissions(updated);
    onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Embudo de Ventas Unificado (Pipeline) */}
      {currentTab === 'pipeline' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Embudo de Ventas Unificado (Pipeline)
              </h1>
              <p className="text-xs text-gray-500">
                Supervisión del avance de prospectos desde el primer contacto hasta la liquidación de la unidad
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-xs">
                Total Prospectos: {leads.length}
              </span>
            </div>
          </div>

          {/* Tablero Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
            {PIPELINE_COLUMNS.map((col) => {
              const colLeads = leads.filter((l) => l.status === col.id);
              return (
                <div
                  key={col.id}
                  className="rounded-2xl bg-gray-50/90 border border-gray-200/90 p-3 min-h-[460px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-gray-200">
                    <span className="text-xs font-bold text-gray-900 truncate">
                      {col.label}
                    </span>
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: col.color }}
                    >
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                    {colLeads.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-gray-400 border border-dashed border-gray-200 rounded-xl my-4">
                        Sin prospectos en esta etapa
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3 rounded-xl bg-white border border-gray-200 shadow-xs hover:border-[#FD363D] hover:shadow-md transition cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                              {lead.source}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {lead.lastContactDate}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {lead.developmentInterested}
                          </p>

                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-gray-700 truncate max-w-[100px]">
                              {lead.assignedAdvisorName}
                            </span>
                            <span className="font-bold text-[#FD363D]">
                              {lead.investmentGoal}
                            </span>
                          </div>

                          {/* Acciones de cambio de etapa rápido */}
                          <div className="mt-2.5 pt-2 border-t border-dashed border-gray-100 flex items-center justify-between">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleMoveLeadStage(lead.id, e.target.value as PipelineStage)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none"
                            >
                              <option value="primer_contacto">1. Primer Contacto</option>
                              <option value="perfilamiento">2. Perfilamiento</option>
                              <option value="videollamada">3. Asesoría Zoom</option>
                              <option value="apartado">4. Apartado</option>
                              <option value="firma_promesa">5. Firma Promesa</option>
                              <option value="liquidacion">6. Liquidación</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TAB: Distribución Inteligente de Leads */}
      {currentTab === 'distribution' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Distribución Inteligente de Leads
            </h1>
            <p className="text-xs text-gray-500">
              Asignación automática o manual de prospectos entrantes (vía formulario web o WhatsApp) según carga o desempeño
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Cola de Prospectos Entrantes
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Algoritmo Round-Robin Activo
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-gray-900">{lead.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#FD363D]">
                          {lead.source}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {lead.budgetRange}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Interés: <span className="font-semibold text-gray-800">{lead.developmentInterested}</span> ({lead.lotInterested || 'Lote por definir'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-medium text-gray-500">Asesor:</span>
                      <select
                        value={lead.assignedAdvisorName}
                        onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                        className="rounded-xl border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:border-[#FD363D] outline-none"
                      >
                        <option value="Lic. Sofía Ramírez">Lic. Sofía Ramírez (Carga: 4)</option>
                        <option value="Carlos Méndez">Carlos Méndez (Carga: 3)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de Desempeño y Carga de Trabajo */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Carga y Desempeño del Equipo
              </h3>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-gray-900">Lic. Sofía Ramírez</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Top Closer (68% Cierre)
                  </span>
                </div>
                <p className="text-xs text-gray-500">4 Leads asignados activos</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#FD363D] h-2 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-gray-900">Carlos Méndez</h4>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Rápida Respuesta (4 min)
                  </span>
                </div>
                <p className="text-xs text-gray-500">3 Leads asignados activos</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                <strong>Regla Comercial Automática:</strong> Si un asesor no contacta a un lead en menos de 2 horas, el sistema reasigna el contacto automáticamente al siguiente asesor disponible.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: Gestión de Bloqueos y Apartados (48-72h) */}
      {currentTab === 'reservations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestión de Bloqueos y Apartados
              </h1>
              <p className="text-xs text-gray-500">
                Aprobación o cancelación de solicitudes de apartado temporal de lotes con tiempo de expiración (48 a 72 horas)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => {
              const isApproved = res.status === 'Aprobado Activo';
              const isPending = res.status === 'Pendiente de Aprobación';
              const isCancelled = res.status === 'Cancelado';

              return (
                <div
                  key={res.id}
                  className={`rounded-2xl border p-5 bg-white shadow-xs transition ${
                    isPending ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FD363D]">
                        Lote: {res.lotCode}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">
                        {res.developmentName}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">Cliente: {res.clientName}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 my-2">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Monto Apartado</p>
                      <p className="text-sm font-extrabold text-gray-900">
                        ${res.amount.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Asesor Solicitante</p>
                      <p className="font-semibold text-gray-800">{res.advisorName}</p>
                    </div>
                  </div>

                  {/* Cronómetro de expiración */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 my-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                      <Clock className="h-4 w-4 text-amber-600 animate-spin" />
                      <span>Cronómetro de Reserva:</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                      51h 24m restantes
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 italic mb-4">
                    Nota: "{res.commercialNotes}"
                  </p>

                  {/* Acciones de Gerencia */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    {isPending && (
                      <button
                        onClick={() => handleApproveReservation(res.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition shadow-xs"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Aprobar Apartado y Bloquear Lote
                      </button>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 text-xs font-bold transition"
                      >
                        <XCircle className="h-4 w-4" />
                        Liberar Lote / Cancelar Reserva
                      </button>
                    )}

                    <button
                      onClick={() =>
                        alert(
                          `Mostrando comprobante bancario de apartado de ${res.clientName} por $${res.amount.toLocaleString('es-MX')} MXN`
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                    >
                      Ver Voucher
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB: Aprobación de Excepciones Comerciales */}
      {currentTab === 'exceptions' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Aprobación de Excepciones Comerciales
            </h1>
            <p className="text-xs text-gray-500">
              Autorización de planes de pago especiales, ajustes de enganche o promociones temporales
            </p>
          </div>

          <div className="space-y-4">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      Lote: {exc.lotCode}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">
                      Cliente: {exc.clientName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        exc.status === 'Aprobada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exc.status === 'Rechazada'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exc.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1">
                    Solicitado por: <span className="font-semibold text-gray-800">{exc.advisorName}</span> ({exc.requestedAt})
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    <span className="bg-red-50 text-[#FD363D] px-2.5 py-1 rounded-lg font-bold">
                      Descuento: {exc.requestedDiscountPercent}%
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">
                      Plazo: {exc.specialFinancingMonths} MSI
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-bold">
                      Enganche Solicitado: {exc.downPaymentAdjustmentPercent}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 italic mt-2">
                    Motivo: "{exc.reason}"
                  </p>
                </div>

                {exc.status === 'Pendiente' ? (
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleResolveException(exc.id, 'Aprobada')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Autorizar
                    </button>
                    <button
                      onClick={() => handleResolveException(exc.id, 'Rechazada')}
                      className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 self-end md:self-center">
                    Resuelto ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: Control y Liquidación de Comisiones */}
      {currentTab === 'commissions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Control y Liquidación de Comisiones
              </h1>
              <p className="text-xs text-gray-500">
                Cálculo automatizado de comisiones para asesores internos y brokers externos contra enganches efectivamente cobrados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Total Pagado: $58,500 MXN
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">Asesor / Broker</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3">Lote y Proyecto</th>
                  <th className="py-3 px-3">Enganche Cobrado</th>
                  <th className="py-3 px-3">% Com.</th>
                  <th className="py-3 px-3">Monto Comisión</th>
                  <th className="py-3 px-3">Estatus</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      {comm.advisorName}
                      <p className="text-[10px] font-normal text-gray-400">Cliente: {comm.clientName}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          comm.type === 'Asesor Interno'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {comm.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-800">
                      {comm.lotCode}
                      <p className="text-[10px] text-gray-400">{comm.developmentName}</p>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      ${comm.downPaymentCollected.toLocaleString('es-MX')}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#FD363D]">{comm.commissionPercent}%</td>
                    <td className="py-3.5 px-3 font-extrabold text-emerald-700 text-sm">
                      ${comm.commissionAmount.toLocaleString('es-MX')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          comm.status === 'Liquidado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {comm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {comm.status !== 'Liquidado' ? (
                        <button
                          onClick={() => handleLiquidateCommission(comm.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#FD363D] hover:bg-[#e0262d] text-white text-[11px] font-bold transition shadow-xs"
                        >
                          Dispersar Pago
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">Pagado {comm.date}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
