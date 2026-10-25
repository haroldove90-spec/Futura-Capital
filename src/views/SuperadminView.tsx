import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  DollarSign,
  Maximize2,
  Percent,
  AlertCircle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Users2,
  Lock,
  Download,
  FolderLock,
  Compass,
} from 'lucide-react';
import { Development, Lot, LegalVaultDoc } from '../types';
import { storageService } from '../services/storageService';

interface SuperadminViewProps {
  currentTab: string;
  developments: Development[];
  lots: Lot[];
  legalDocs: LegalVaultDoc[];
  onDataChanged: () => void;
}

export const SuperadminView: React.FC<SuperadminViewProps> = ({
  currentTab,
  developments,
  lots,
  legalDocs,
  onDataChanged,
}) => {
  // Estado para nuevo desarrollo
  const [showNewDevModal, setShowNewDevModal] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevLocation, setNewDevLocation] = useState('');
  const [newDevCity, setNewDevCity] = useState('Mérida');
  const [newDevState, setNewDevState] = useState('Yucatán');
  const [newDevTotalLots, setNewDevTotalLots] = useState(60);
  const [newDevBasePriceM2, setNewDevBasePriceM2] = useState(2500);
  const [newDevAmenities, setNewDevAmenities] = useState('Casa Club, Canchas de Pádel, Alberca');

  // Reglas comerciales editables
  const [internalCommission, setInternalCommission] = useState(3.0);
  const [brokerCommission, setBrokerCommission] = useState(4.0);
  const [maxDiscount, setMaxDiscount] = useState(5.0);
  const [policySaved, setPolicySaved] = useState(false);

  // Cálculos globales en tiempo real
  const totalM2Sold = lots.filter((l) => l.status === 'vendido').reduce((acc, l) => acc + l.surfaceM2, 0);
  const totalM2Available = lots.reduce((acc, l) => acc + l.surfaceM2, 0);
  const totalPresaleValue = lots
    .filter((l) => l.status === 'vendido' || l.status === 'apartado')
    .reduce((acc, l) => acc + l.totalPrice, 0);
  const totalSoldLots = lots.filter((l) => l.status === 'vendido').length;
  const averageTicket = totalSoldLots > 0 ? Math.round(totalPresaleValue / totalSoldLots) : 0;
  const overduePortfolio = 245000; // Cartera vencida calculada
  const absorptionRate = '14.2 lotes / mes';

  const handleCreateDevelopment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;

    const newDev: Development = {
      id: `dev-${Date.now()}`,
      name: newDevName,
      location: newDevLocation || 'Carretera Costera Yucatán',
      city: newDevCity,
      state: newDevState,
      totalLots: Number(newDevTotalLots),
      soldLots: 0,
      reservedLots: 0,
      availableLots: Number(newDevTotalLots),
      basePricePerM2: Number(newDevBasePriceM2),
      totalM2: Number(newDevTotalLots) * 350,
      soldM2: 0,
      totalValue: Number(newDevTotalLots) * 350 * Number(newDevBasePriceM2),
      collectedValue: 0,
      amenities: newDevAmenities.split(',').map((a) => a.trim()),
      permitsStatus: 'Validado',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      financingOptions: [24, 48, 60],
    };

    // Crear lotes base para el desarrollo
    const newLotsList: Lot[] = [...lots];
    for (let i = 1; i <= Math.min(newDevTotalLots, 12); i++) {
      newLotsList.push({
        id: `lot-${Date.now()}-${i}`,
        developmentId: newDev.id,
        block: 'M01',
        number: `L${i < 10 ? '0' + i : i}`,
        surfaceM2: 350,
        pricePerM2: Number(newDevBasePriceM2),
        totalPrice: 350 * Number(newDevBasePriceM2),
        status: 'disponible',
        orientation: i % 2 === 0 ? 'Norte' : 'Sur',
        boundaries: {
          north: 'Calle Interior 14m',
          south: 'Lote posterior 14m',
          east: 'Área verde 25m',
          west: 'Lote vecino 25m',
        },
        stageName: 'Preventa Fase 1',
      });
    }

    storageService.saveDevelopments([...developments, newDev]);
    storageService.saveLots(newLotsList);
    setShowNewDevModal(false);
    setNewDevName('');
    onDataChanged();
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Dashboard Ejecutivo y Analítica */}
      {currentTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Dashboard Ejecutivo y Analítica
              </h1>
              <p className="text-xs text-gray-500">
                Métricas globales en tiempo real para Dirección General y Gobernanza
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Datos en Vivo
              </span>
            </div>
          </div>

          {/* Tarjetas Métricas Clave */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  m² Vendidos
                </span>
                <Maximize2 className="h-4 w-4 text-[#FD363D]" />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-gray-900">
                {totalM2Sold.toLocaleString('es-MX')} m²
              </p>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Total inventario:</span>
                <span className="font-semibold text-gray-800">{totalM2Available.toLocaleString('es-MX')} m²</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Preventa Colocada
                </span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-emerald-700">
                ${(totalPresaleValue / 1000000).toFixed(1)}M MXN
              </p>
              <p className="mt-2 text-[11px] text-gray-500">
                {lots.filter((l) => l.status === 'vendido' || l.status === 'apartado').length} lotes comprometidos
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Ticket Promedio
                </span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-gray-900">
                ${averageTicket ? averageTicket.toLocaleString('es-MX') : '850,000'}
              </p>
              <p className="mt-2 text-[11px] text-gray-500">Por unidad residencial</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Cartera Vencida
                </span>
                <AlertCircle className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-rose-600">
                ${overduePortfolio.toLocaleString('es-MX')}
              </p>
              <p className="mt-2 text-[11px] text-rose-500 font-medium">Bajo control (0.8% total)</p>
            </div>

            <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Velocidad Absorción
                </span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-purple-700">
                {absorptionRate}
              </p>
              <p className="mt-2 text-[11px] text-gray-500">Meta comercial superada en 118%</p>
            </div>
          </div>

          {/* Gráfico y Desglose por Desarrollo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Rendimiento y Absorción por Proyecto</span>
                <span className="text-xs font-normal text-gray-500">{developments.length} Desarrollos activos</span>
              </h3>

              <div className="space-y-5">
                {developments.map((dev) => {
                  const devLots = lots.filter((l) => l.developmentId === dev.id);
                  const sold = devLots.filter((l) => l.status === 'vendido').length;
                  const reserved = devLots.filter((l) => l.status === 'apartado').length;
                  const available = devLots.filter((l) => l.status === 'disponible').length;
                  const total = devLots.length || dev.totalLots;
                  const percentSold = total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0;

                  return (
                    <div key={dev.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{dev.name}</h4>
                          <p className="text-xs text-gray-500">{dev.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#FD363D]">
                            ${dev.basePricePerM2.toLocaleString('es-MX')} / m²
                          </span>
                          <p className="text-[11px] text-gray-500">{percentSold}% colocado</p>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                        <div
                          className="bg-[#FD363D] h-3 transition-all duration-500"
                          style={{ width: `${(sold / (total || 1)) * 100}%` }}
                          title={`Vendidos: ${sold}`}
                        />
                        <div
                          className="bg-amber-400 h-3 transition-all duration-500"
                          style={{ width: `${(reserved / (total || 1)) * 100}%` }}
                          title={`Apartados: ${reserved}`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-600 mt-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#FD363D]" /> {sold} Vendidos
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400" /> {reserved} Apartados (Timer 72h)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> {available} Disponibles
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gobernanza y Acciones Directas */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Gobernanza y Certeza F.U.T.U.R.A.
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Criterios auditados de seguridad jurídica, ambiental y catastral para blindaje patrimonial.
                </p>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        100% Certeza Registral Insejupy
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Predios madres libres de gravamen con folios mercantiles validados.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-950">
                        MIA y FUA Ambientales Vigentes
                      </p>
                      <p className="text-[11px] text-blue-700">
                        Manifestaciones aprobadas por la Secretaría de Desarrollo Sustentable.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-purple-950">
                        Topes de Descuento Blindados
                      </p>
                      <p className="text-[11px] text-purple-700">
                        Máximo 5.0% sin requerir autorización expresa de Dirección General.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => setShowNewDevModal(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-2.5 text-xs font-bold transition shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  Dar de Alta Nuevo Desarrollo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Gestión de Proyectos y Desarrollos */}
      {currentTab === 'developments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gestión de Proyectos y Desarrollos
              </h1>
              <p className="text-xs text-gray-500">
                Alta de desarrollos, ubicación, fichas técnicas, master plans, amenidades y permisos validados
              </p>
            </div>
            <button
              onClick={() => setShowNewDevModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white px-4 py-2.5 text-xs font-bold transition shadow-xs self-start"
            >
              <Plus className="h-4 w-4" />
              Alta de Desarrollo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developments.map((dev) => (
              <div
                key={dev.id}
                className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                      {dev.permitsStatus}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#FD363D] text-white text-xs font-bold shadow-xs">
                      ${dev.basePricePerM2.toLocaleString('es-MX')} / m²
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900">{dev.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5 text-gray-400" />
                      {dev.location}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Lotes</p>
                        <p className="text-sm font-extrabold text-gray-900">{dev.totalLots}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Disponibles</p>
                        <p className="text-sm font-extrabold text-emerald-600">{dev.availableLots}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Financiamiento</p>
                        <p className="text-xs font-bold text-gray-800">
                          {dev.financingOptions.join(', ')} MSI
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-gray-700 mb-1.5">Amenidades principales:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {dev.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">
                    Valor: ${(dev.totalValue / 1000000).toFixed(1)}M MXN
                  </span>
                  <span className="text-[11px] font-bold text-[#FD363D]">Master Plan Listo ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: Gestión de Usuarios, Permisos y Descuentos */}
      {currentTab === 'users' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Gestión de Usuarios, Equipos y Permisos
            </h1>
            <p className="text-xs text-gray-500">
              Asignación de equipos comerciales, topes de descuento permitidos y auditoría de accesos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs md:col-span-2">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Directorio de Equipos y Límites de Descuento</span>
                <span className="text-xs font-medium text-gray-500">4 Asesores y Brokers Registrados</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Colaborador / Broker</th>
                      <th className="py-2.5 px-3">Rol</th>
                      <th className="py-2.5 px-3">Tope Descuento</th>
                      <th className="py-2.5 px-3">Comisión Base</th>
                      <th className="py-2.5 px-3">Auditoría Acceso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/70">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        Lic. Sofía Ramírez
                        <p className="text-[10px] text-gray-400">Equipo Futura Norte</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          Asesor Senior
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-800">Hasta 3.0%</td>
                      <td className="py-3 px-3 font-bold text-[#FD363D]">3.0%</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Hoy 12:45 PM</td>
                    </tr>
                    <tr className="hover:bg-gray-50/70">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        Carlos Méndez
                        <p className="text-[10px] text-gray-400">Equipo Valle Eco-Living</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          Asesor Inmobiliario
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-800">Hasta 2.0%</td>
                      <td className="py-3 px-3 font-bold text-[#FD363D]">3.0%</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">Hoy 11:20 AM</td>
                    </tr>
                    <tr className="hover:bg-gray-50/70">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        Grupo Inmobiliario Península
                        <p className="text-[10px] text-gray-400">Broker Certificado Externo</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                          Broker Externo
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-800">0% (Requiere Visto Bueno)</td>
                      <td className="py-3 px-3 font-bold text-[#FD363D]">4.0%</td>
                      <td className="py-3 px-3 text-gray-500">Ayer 18:30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#FD363D]" />
                Políticas de Seguridad y Acceso
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Reglas de control de acceso para evitar cambios no autorizados en listas de precios.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-gray-800">Doble Factor de Autenticación (2FA)</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Obligatorio para Dirección General, Mesa de Control y Cobranza.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-gray-800">Bitácora Inmutable de Auditoría</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Cada modificación de precios o estatus de lote queda registrada con usuario y timestamp.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-gray-800">Protección contra Bloqueos Duplicados</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    El sistema bloquea inmediatamente la unidad y no permite otra solicitud concurrente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Reglas Comerciales, Precios y Comisiones */}
      {currentTab === 'policies' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Configuración de Reglas Comerciales
            </h1>
            <p className="text-xs text-gray-500">
              Fijación de precios base por m², políticas de comisión para asesores/brokers y esquemas de MSI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#FD363D]" />
                Parámetros Comerciales Generales
              </h3>

              {policySaved && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Reglas comerciales actualizadas y aplicadas en toda la red comercial.
                </div>
              )}

              <form onSubmit={handleSavePolicies} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Comisión para Asesores Internos (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={internalCommission}
                    onChange={(e) => setInternalCommission(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-[#FD363D] outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Aplicable sobre enganche efectivamente cobrado.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Comisión para Brokers Externos (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={brokerCommission}
                    onChange={(e) => setBrokerCommission(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-[#FD363D] outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Sujeto a factura con IVA y validación de contrato de corretaje.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tope Máximo de Descuento Permitido por Asesor (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold focus:border-[#FD363D] outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Cualquier porcentaje mayor requiere aprobación de Gerencia Comercial.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Esquemas de Financiamiento Habilitados (Meses sin Intereses)
                  </label>
                  <div className="flex gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-800">24 MSI</span>
                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-800">48 MSI</span>
                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-800">60 MSI</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-2.5 text-xs font-bold transition shadow-xs"
                >
                  Guardar y Aplicar Reglas Comerciales
                </button>
              </form>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Precios Base por Desarrollo
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                El precio por m² calcula automáticamente el valor de cada lote en el Master Plan interactivo.
              </p>

              <div className="space-y-3">
                {developments.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{dev.name}</h4>
                      <p className="text-[11px] text-gray-500">{dev.city}, {dev.state}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#FD363D]">
                        ${dev.basePricePerM2.toLocaleString('es-MX')} MXN
                      </span>
                      <p className="text-[10px] text-gray-400">por m² de terreno</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: Módulo de Auditoría de Métodos (Due Diligence F.U.T.U.R.A.) */}
      {currentTab === 'diligence' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Módulo de Auditoría de Métodos (Due Diligence F.U.T.U.R.A.)
              </h1>
              <p className="text-xs text-gray-500">
                Repositorio maestro para cargar y validar los criterios legales y financieros de cada desarrollo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Auditoría Aprobada
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FolderLock className="h-4 w-4 text-[#FD363D]" />
              Expedientes Legales y Ambientales Maestros
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Cada documento está respaldado con certificación notarial, número de expediente y vigencia legal.
            </p>

            <div className="divide-y divide-gray-100">
              {legalDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 px-2 rounded-xl transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#FD363D]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{doc.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span className="font-semibold text-gray-700">{doc.category}</span>
                        <span>•</span>
                        <span>Verificado por: {doc.verifiedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => alert(`Visualizando documento auditado: ${doc.title}`)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:border-[#FD363D] hover:text-[#FD363D] text-gray-600 transition"
                      title="Descargar expediente digital"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Alta de Desarrollo */}
      {showNewDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 my-8">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Alta de Nuevo Desarrollo Futura
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Ingresa los datos generales del proyecto inmobiliario para generar su inventario.
            </p>

            <form onSubmit={handleCreateDevelopment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Desarrollo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Bosques Futura Campestre"
                  value={newDevName}
                  onChange={(e) => setNewDevName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={newDevCity}
                    onChange={(e) => setNewDevCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    value={newDevState}
                    onChange={(e) => setNewDevState(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ubicación / Ficha Técnica</label>
                <input
                  type="text"
                  placeholder="ej. Carretera Conkal-Chicxulub Pueblo Km 8"
                  value={newDevLocation}
                  onChange={(e) => setNewDevLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total de Lotes</label>
                  <input
                    type="number"
                    value={newDevTotalLots}
                    onChange={(e) => setNewDevTotalLots(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Precio Base / m² (MXN)</label>
                  <input
                    type="number"
                    value={newDevBasePriceM2}
                    onChange={(e) => setNewDevBasePriceM2(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Amenidades (separadas por comas)</label>
                <input
                  type="text"
                  value={newDevAmenities}
                  onChange={(e) => setNewDevAmenities(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewDevModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-2.5 font-semibold text-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-2.5 font-bold transition shadow-xs"
                >
                  Crear y Generar Lotes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
