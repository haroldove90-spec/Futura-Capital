import React, { useState } from 'react';
import {
  Map,
  Calculator,
  MessageSquare,
  BookmarkCheck,
  Share2,
  FileText,
  DollarSign,
  Send,
  Phone,
  Compass,
  CheckCircle2,
  Clock,
  Printer,
  X,
  UploadCloud,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { Lot, FinancialQuote, Lead, Development, ReservationRequest } from '../types';
import { storageService } from '../services/storageService';

interface AdvisorViewProps {
  currentTab: string;
  lots: Lot[];
  leads: Lead[];
  developments: Development[];
  quotes: FinancialQuote[];
  reservations: ReservationRequest[];
  onDataChanged: () => void;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  currentTab,
  lots,
  leads,
  developments,
  quotes,
  reservations,
  onDataChanged,
}) => {
  // Master plan selection
  const [selectedLot, setSelectedLot] = useState<Lot | null>(lots[0] || null);
  const [selectedDevId, setSelectedDevId] = useState<string>(developments[0]?.id || 'dev-1');
  const [lotStatusFilter, setLotStatusFilter] = useState<string>('all');

  // Simulador financiero
  const [simClientName, setSimClientName] = useState('Lic. Carlos Martínez');
  const [simClientPhone, setSimClientPhone] = useState('+52 55 1234 5678');
  const [simLotId, setSimLotId] = useState<string>(lots[0]?.id || '');
  const [simDownPaymentPct, setSimDownPaymentPct] = useState<number>(20);
  const [simFinancingMonths, setSimFinancingMonths] = useState<number>(48);
  const [simBalloonPct, setSimBalloonPct] = useState<number>(10); // Saldo contra entrega
  const [showQuotePdfModal, setShowQuotePdfModal] = useState<boolean>(false);
  const [generatedQuote, setGeneratedQuote] = useState<FinancialQuote | null>(null);

  // Apartado Express Modal
  const [showExpressModal, setShowExpressModal] = useState<boolean>(false);
  const [expressLot, setExpressLot] = useState<Lot | null>(null);
  const [expressClientName, setExpressClientName] = useState('');
  const [expressClientPhone, setExpressClientPhone] = useState('');
  const [expressAmount, setExpressAmount] = useState<number>(50000);
  const [expressNotes, setExpressNotes] = useState('');

  // CRM Note Modal
  const [crmNoteLead, setCrmNoteLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Lotes filtrados por desarrollo y estatus
  const currentDev = developments.find((d) => d.id === selectedDevId) || developments[0];
  const filteredLots = lots
    .filter((l) => l.developmentId === selectedDevId)
    .filter((l) => (lotStatusFilter === 'all' ? true : l.status === lotStatusFilter));

  // Lote seleccionado en simulador
  const simulatorLot = lots.find((l) => l.id === simLotId) || lots[0];
  const simTotalPrice = simulatorLot ? simulatorLot.totalPrice : 850000;
  const simDownPaymentAmount = Math.round((simTotalPrice * simDownPaymentPct) / 100);
  const simBalloonAmount = Math.round((simTotalPrice * simBalloonPct) / 100);
  const simFinancedAmount = simTotalPrice - simDownPaymentAmount - simBalloonAmount;
  const simMonthlyPayment =
    simFinancingMonths > 0 ? Number((simFinancedAmount / simFinancingMonths).toFixed(2)) : 0;

  // Manejo de cotización
  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorLot) return;

    const newQuote: FinancialQuote = {
      id: `quo-${Date.now()}`,
      clientName: simClientName,
      clientPhone: simClientPhone,
      lotId: simulatorLot.id,
      lotCode: `${simulatorLot.block}-${simulatorLot.number}`,
      developmentName: currentDev?.name || 'Residencial Futura Norte',
      surfaceM2: simulatorLot.surfaceM2,
      pricePerM2: simulatorLot.pricePerM2,
      totalPrice: simulatorLot.totalPrice,
      downPaymentPercent: simDownPaymentPct,
      downPaymentAmount: simDownPaymentAmount,
      financingMonths: simFinancingMonths,
      monthlyPayment: simMonthlyPayment,
      finalPaymentAmount: simBalloonAmount,
      advisorName: 'Lic. Sofía Ramírez',
      createdAt: new Date().toISOString(),
    };

    setGeneratedQuote(newQuote);
    storageService.saveQuotes([newQuote, ...quotes]);
    setShowQuotePdfModal(true);
    onDataChanged();
  };

  // Manejo de apartado express
  const handleOpenExpressReserve = (lot: Lot) => {
    setExpressLot(lot);
    setExpressClientName('');
    setExpressClientPhone('');
    setExpressAmount(lot.totalPrice > 1500000 ? 100000 : 50000);
    setExpressNotes('');
    setShowExpressModal(true);
  };

  const handleSubmitExpressReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expressLot || !expressClientName.trim()) return;

    const newReservation: ReservationRequest = {
      id: `res-${Date.now()}`,
      lotId: expressLot.id,
      lotCode: `${expressLot.block}-${expressLot.number}`,
      developmentName: currentDev?.name || 'Residencial Futura Norte',
      clientName: expressClientName,
      clientPhone: expressClientPhone || '+52 55 0000 0000',
      advisorName: 'Lic. Sofía Ramírez',
      amount: expressAmount,
      voucherUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      requestDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      status: 'Aprobado Activo',
      commercialNotes: expressNotes || 'Apartado express con comprobante bancario validado.',
    };

    const updatedLots = lots.map((l) =>
      l.id === expressLot.id
        ? {
            ...l,
            status: 'apartado' as const,
            buyerName: expressClientName,
            reservedAt: new Date().toISOString(),
            reservedUntil: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
            reservedByAdvisor: 'Lic. Sofía Ramírez',
          }
        : l
    );

    storageService.saveLots(updatedLots);
    storageService.saveReservations([newReservation, ...reservations]);
    setShowExpressModal(false);
    onDataChanged();
  };

  // Guardar nota CRM
  const handleSaveCrmNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmNoteLead || !newNoteText.trim()) return;

    const updatedLeads = leads.map((l) =>
      l.id === crmNoteLead.id
        ? { ...l, notesCount: l.notesCount + 1, lastContactDate: 'Hace unos momentos' }
        : l
    );
    storageService.saveLeads(updatedLeads);
    setCrmNoteLead(null);
    setNewNoteText('');
    onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Master Plan Interactivo de Disponibilidad */}
      {currentTab === 'masterplan' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Master Plan Interactivo de Disponibilidad
              </h1>
              <p className="text-xs text-gray-500">
                Visualización en tiempo real del estatus de lotes (Disponible, Apartado, Vendido, Bloqueado)
              </p>
            </div>

            {/* Selector de desarrollo */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDevId}
                onChange={(e) => setSelectedDevId(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-800 focus:border-[#FD363D] outline-none shadow-xs"
              >
                {developments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros de estado y leyenda */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 mr-1">Filtrar:</span>
              <button
                onClick={() => setLotStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  lotStatusFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({lots.filter((l) => l.developmentId === selectedDevId).length})
              </button>
              <button
                onClick={() => setLotStatusFilter('disponible')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  lotStatusFilter === 'disponible'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Disponibles
              </button>
              <button
                onClick={() => setLotStatusFilter('apartado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  lotStatusFilter === 'apartado'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Apartados
              </button>
              <button
                onClick={() => setLotStatusFilter('vendido')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  lotStatusFilter === 'vendido'
                    ? 'bg-[#FD363D] text-white'
                    : 'bg-red-50 text-[#FD363D] hover:bg-red-100'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-[#FD363D]" />
                Vendidos
              </button>
              <button
                onClick={() => setLotStatusFilter('bloqueado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  lotStatusFilter === 'bloqueado'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                Bloqueados
              </button>
            </div>

            <div className="text-xs text-gray-400 italic">
              Haz clic en cualquier lote para ver ficha técnica y cotizar
            </div>
          </div>

          {/* Cuadrícula interactiva de Lotes tipo Master Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-900">
                  {currentDev?.name} — Plano de Manzanas y Lotes
                </h3>
                <span className="text-[11px] font-semibold text-gray-500">
                  {filteredLots.length} lotes mostrados
                </span>
              </div>

              {/* Grid visual de lotes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 min-h-[380px]">
                {filteredLots.map((lot) => {
                  const isSelected = selectedLot?.id === lot.id;
                  let bgBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  let statusColor = 'text-emerald-700';

                  if (lot.status === 'apartado') {
                    bgBadge = 'bg-amber-100 text-amber-900 border-amber-300';
                    statusColor = 'text-amber-800';
                  } else if (lot.status === 'vendido') {
                    bgBadge = 'bg-red-100 text-[#FD363D] border-red-200';
                    statusColor = 'text-[#FD363D]';
                  } else if (lot.status === 'bloqueado') {
                    bgBadge = 'bg-gray-200 text-gray-700 border-gray-300';
                    statusColor = 'text-gray-600';
                  }

                  return (
                    <button
                      key={lot.id}
                      onClick={() => setSelectedLot(lot)}
                      className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-[#FD363D] ring-2 ring-red-100 bg-white shadow-md -translate-y-0.5'
                          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-gray-900">
                          {lot.block}-{lot.number}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${bgBadge}`}
                        >
                          {lot.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500">
                        {lot.surfaceM2} m² • {lot.orientation}
                      </p>
                      <p className="text-xs font-extrabold text-gray-900 mt-2">
                        ${(lot.totalPrice / 1000).toFixed(0)}k MXN
                      </p>

                      {lot.buyerName && (
                        <p className="text-[9px] text-gray-400 truncate mt-1">
                          {lot.buyerName}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ficha Técnica del Lote Seleccionado */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              {selectedLot ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FD363D]">
                        Ficha Técnica Oficial
                      </span>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Lote {selectedLot.block}-{selectedLot.number}
                      </h3>
                      <p className="text-xs text-gray-500">{currentDev?.name}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        selectedLot.status === 'disponible'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedLot.status === 'apartado'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedLot.status === 'vendido'
                          ? 'bg-red-100 text-[#FD363D]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedLot.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Superficie Total:</span>
                      <span className="font-bold text-gray-900">{selectedLot.surfaceM2} m²</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Precio por m²:</span>
                      <span className="font-bold text-gray-900">
                        ${selectedLot.pricePerM2.toLocaleString('es-MX')} MXN
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Valor Total de Lista:</span>
                      <span className="font-extrabold text-[#FD363D] text-sm">
                        ${selectedLot.totalPrice.toLocaleString('es-MX')} MXN
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Orientación:</span>
                      <span className="font-bold text-gray-900">{selectedLot.orientation}</span>
                    </div>

                    <div className="pt-2">
                      <p className="font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 text-gray-400" />
                        Colindancias Legales:
                      </p>
                      <div className="bg-gray-50 rounded-xl p-2.5 space-y-1 text-[11px] text-gray-600">
                        <p><strong>Norte:</strong> {selectedLot.boundaries.north}</p>
                        <p><strong>Sur:</strong> {selectedLot.boundaries.south}</p>
                        <p><strong>Este:</strong> {selectedLot.boundaries.east}</p>
                        <p><strong>Oeste:</strong> {selectedLot.boundaries.west}</p>
                      </div>
                    </div>

                    {selectedLot.status === 'apartado' && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mt-2">
                        <p className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          Apartado Temporal (Timer 72h)
                        </p>
                        <p className="text-[11px] text-amber-700 mt-1">
                          Inversionista: {selectedLot.buyerName || 'Por definir'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Selecciona un lote del plano</p>
              )}

              {/* Botones de acción inmediata */}
              {selectedLot && (
                <div className="pt-4 border-t border-gray-100 space-y-2 mt-4">
                  {selectedLot.status === 'disponible' && (
                    <button
                      onClick={() => handleOpenExpressReserve(selectedLot)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-2.5 text-xs font-bold transition shadow-xs"
                    >
                      <BookmarkCheck className="h-4 w-4" />
                      Apartado Express de Este Lote
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSimLotId(selectedLot.id);
                      const win = window;
                      alert(
                        `Lote ${selectedLot.block}-${selectedLot.number} cargado al Simulador Financiero. Ve a la pestaña Cotizador para calcular y descargar el PDF membretado.`
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 py-2.5 text-xs font-semibold transition"
                  >
                    <Calculator className="h-4 w-4 text-[#FD363D]" />
                    Cargar al Cotizador Financiero
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Simulador Financiero de Cotizaciones y PDF Membretado */}
      {currentTab === 'simulator' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Simulador Financiero de Cotizaciones
              </h1>
              <p className="text-xs text-gray-500">
                Generador de planes de pago inmediatos con envío en un clic (enganche, 12 a 60 MSI, saldo contra entrega y PDF membretado)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de parámetros */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs lg:col-span-1">
              <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#FD363D]" />
                Parámetros de la Cotización
              </h3>

              <form onSubmit={handleGenerateQuote} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    required
                    value={simClientName}
                    onChange={(e) => setSimClientName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    required
                    value={simClientPhone}
                    onChange={(e) => setSimClientPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Seleccionar Lote</label>
                  <select
                    value={simLotId}
                    onChange={(e) => setSimLotId(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:border-[#FD363D] outline-none"
                  >
                    {lots.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.block}-{l.number} ({l.surfaceM2} m² - ${l.totalPrice.toLocaleString('es-MX')}) [{l.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Enganche Inicial:</span>
                    <span className="text-[#FD363D]">{simDownPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={simDownPaymentPct}
                    onChange={(e) => setSimDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-[#FD363D]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>10% Mínimo</span>
                    <span>30% Sugerido</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plazo de Financiamiento (MSI)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[12, 24, 48, 60].map((months) => (
                      <button
                        type="button"
                        key={months}
                        onClick={() => setSimFinancingMonths(months)}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          simFinancingMonths === months
                            ? 'bg-[#FD363D] text-white border-[#FD363D]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {months} MSI
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Saldo contra entrega (%):</span>
                    <span className="text-gray-900">{simBalloonPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="5"
                    value={simBalloonPct}
                    onChange={(e) => setSimBalloonPct(Number(e.target.value))}
                    className="w-full accent-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-3 text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generar Cotización y PDF Membretado
                </button>
              </form>
            </div>

            {/* Vista Previa en Vivo Membretada */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                {/* Membrete Oficial Futura */}
                <div className="flex items-start justify-between pb-4 border-b border-gray-200 mb-4">
                  <div>
                    <img
                      src="https://appdesignproyectos.com/futuralogo.png"
                      alt="Futura"
                      className="h-10 w-auto object-contain mb-1"
                    />
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Cotización Financiera Oficial
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    <p className="font-bold text-gray-900">Folio: COT-{Date.now().toString().slice(-6)}</p>
                    <p>Fecha: {new Date().toLocaleDateString('es-MX')}</p>
                    <p className="text-emerald-600 font-semibold">Tasa: 0% Meses sin Intereses</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Cliente</p>
                      <p className="font-bold text-gray-900">{simClientName || 'Por definir'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Lote y Manzana</p>
                      <p className="font-bold text-gray-900">
                        {simulatorLot ? `${simulatorLot.block}-${simulatorLot.number}` : 'M01-L01'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Superficie</p>
                      <p className="font-bold text-gray-900">{simulatorLot?.surfaceM2 || 350} m²</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Precio Total</p>
                      <p className="font-extrabold text-[#FD363D]">
                        ${simTotalPrice.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desglose Financiero */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs">
                    <span className="font-bold text-gray-800">
                      Enganche Inicial ({simDownPaymentPct}%):
                    </span>
                    <span className="font-extrabold text-[#FD363D] text-sm">
                      ${simDownPaymentAmount.toLocaleString('es-MX')} MXN
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <div>
                      <span className="font-bold text-gray-800">
                        {simFinancingMonths} Mensualidades sin Intereses:
                      </span>
                      <p className="text-[11px] text-gray-500">Monto fijo mensual</p>
                    </div>
                    <span className="font-extrabold text-gray-900 text-sm">
                      ${simMonthlyPayment.toLocaleString('es-MX')} MXN / mes
                    </span>
                  </div>

                  {simBalloonAmount > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <span className="font-bold text-gray-800">
                        Saldo contra Entrega / Escrituración ({simBalloonPct}%):
                      </span>
                      <span className="font-bold text-gray-900">
                        ${simBalloonAmount.toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800">
                  ✓ Incluye certeza registral F.U.T.U.R.A., escrituración garantizada y acceso inmediato a club de amenidades.
                </div>
              </div>

              {/* Botones de Compartir */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 mt-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*Cotización Futura*\nHola ${simClientName}, te comparto el plan para el lote ${simulatorLot?.block}-${simulatorLot?.number}:\n• Precio total: $${simTotalPrice.toLocaleString('es-MX')} MXN\n• Enganche (${simDownPaymentPct}%): $${simDownPaymentAmount.toLocaleString('es-MX')}\n• ${simFinancingMonths} mensualidades fijas de: $${simMonthlyPayment.toLocaleString('es-MX')}\n• Certeza jurídica garantizada.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition shadow-xs"
                >
                  <Share2 className="h-4 w-4" />
                  Enviar por WhatsApp
                </a>

                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-semibold transition"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir / Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: CRM de Seguimiento al Inversionista */}
      {currentTab === 'crm' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                CRM de Seguimiento al Inversionista
              </h1>
              <p className="text-xs text-gray-500">
                Historial de interacciones, objetivos de inversión (Plusvalía, Patrimonio, Renta) y recordatorios de llamada
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{lead.name}</h3>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#FD363D]">
                      {lead.investmentGoal}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs py-3 border-y border-gray-100 my-2">
                    <p className="text-gray-600">
                      <strong>Proyecto de Interés:</strong> {lead.developmentInterested}
                    </p>
                    <p className="text-gray-600">
                      <strong>Presupuesto:</strong> {lead.budgetRange}
                    </p>
                    <p className="text-gray-600">
                      <strong>Estatus en Pipeline:</strong> <span className="capitalize">{lead.status.replace('_', ' ')}</span>
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      Último contacto: {lead.lastContactDate} ({lead.notesCount} notas guardadas)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hola ${lead.name}, te saluda Lic. Sofía Ramírez de Futura respecto a tu interés en ${lead.developmentInterested}. ¿Tienes disponibilidad para una videollamada de 10 minutos hoy?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition shadow-xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setCrmNoteLead(lead);
                      setNewNoteText('');
                    }}
                    className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition"
                  >
                    + Nota
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: Gestión de Apartados Express */}
      {currentTab === 'express_reserve' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Gestión de Apartados Express
            </h1>
            <p className="text-xs text-gray-500">
              Solicitud de apartado digital de lote subiendo comprobante de pago para reservar la unidad en el sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lots
              .filter((l) => l.status === 'disponible')
              .slice(0, 6)
              .map((lot) => (
                <div
                  key={lot.id}
                  className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#FD363D]">
                      Disponible
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">
                      Lote {lot.block}-{lot.number}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {lot.surfaceM2} m² • ${lot.totalPrice.toLocaleString('es-MX')} MXN
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenExpressReserve(lot)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white text-xs font-bold transition shadow-xs"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    Apartar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. TAB: Integración Directa con WhatsApp */}
      {currentTab === 'whatsapp' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Integración Directa con WhatsApp y Folletos
            </h1>
            <p className="text-xs text-gray-500">
              Envío de fichas técnicas, folletos, estados de cuenta y mensajes plantilla desde la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900">
                Plantillas Oficiales de Venta
              </h3>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <p className="font-bold text-xs text-gray-800">1. Saludo y Envío de Master Plan</p>
                <p className="text-xs text-gray-600 italic">
                  "Hola [Nombre], te comparto la ficha técnica y disponibilidad actual de Residencial Futura Norte con planes de 48 meses sin intereses..."
                </p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Hola, te comparto la ficha técnica de Residencial Futura Norte: lotes desde 300 m² con amenidades premium y 48 MSI.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <Share2 className="h-3.5 w-3.5" /> Enviar Plantilla
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <p className="font-bold text-xs text-gray-800">2. Confirmación de Apartado Exitoso</p>
                <p className="text-xs text-gray-600 italic">
                  "¡Felicidades [Nombre]! Tu apartado para el lote ha sido registrado con éxito. Tienes 72 horas para complementar tu documentación legal..."
                </p>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    '¡Felicidades! Tu apartado de lote en Futura ha sido registrado con éxito. Nuestro equipo legal se pondrá en contacto para tu expediente KYC.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <Share2 className="h-3.5 w-3.5" /> Enviar Plantilla
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900">
                Folletos Digitales Descargables
              </h3>

              <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">Brochure Residencial Futura Norte</h4>
                  <p className="text-[11px] text-gray-500">PDF de 14 páginas con amenidades y master plan</p>
                </div>
                <button
                  onClick={() => alert('Descargando Brochure Oficial Residencial Futura Norte')}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  Descargar
                </button>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">Folleto Valle Futura Eco-Living</h4>
                  <p className="text-[11px] text-gray-500">Filosofía sustentable, cenote y huertos</p>
                </div>
                <button
                  onClick={() => alert('Descargando Folleto Valle Futura Eco-Living')}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Apartado Express */}
      {showExpressModal && expressLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 my-8">
            <button
              onClick={() => setShowExpressModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">
              Apartado Digital Express
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Lote {expressLot.block}-{expressLot.number} ({expressLot.surfaceM2} m²) — ${expressLot.totalPrice.toLocaleString('es-MX')} MXN
            </p>

            <form onSubmit={handleSubmitExpressReserve} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre Completo del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Dra. Claudia Santana"
                  value={expressClientName}
                  onChange={(e) => setExpressClientName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="+52 999 123 4567"
                  value={expressClientPhone}
                  onChange={(e) => setExpressClientPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Monto de Reserva (MXN)</label>
                <input
                  type="number"
                  value={expressAmount}
                  onChange={(e) => setExpressAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Comprobante de Pago Bancario</label>
                <div className="p-3 rounded-xl border border-dashed border-gray-300 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <UploadCloud className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-gray-600">
                    Comprobante SPEI Adjuntado ✓
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notas Comerciales</label>
                <textarea
                  rows={2}
                  value={expressNotes}
                  onChange={(e) => setExpressNotes(e.target.value)}
                  placeholder="ej. Transferencia BBVA confirmada por el cliente"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowExpressModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 font-semibold text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-2.5 font-bold transition shadow-xs"
                >
                  Bloquear Lote (72h)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Nota CRM */}
      {crmNoteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Nueva Nota para {crmNoteLead.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Registra llamada, objeción o preferencia del inversionista
            </p>

            <form onSubmit={handleSaveCrmNote} className="space-y-3 text-xs">
              <textarea
                required
                rows={3}
                placeholder="ej. Cliente solicita simulación a 60 meses sin intereses y video del avance de la alberca..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-xs focus:border-[#FD363D] outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCrmNoteLead(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-2 text-gray-700 font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FD363D] text-white py-2 font-bold shadow-xs"
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
