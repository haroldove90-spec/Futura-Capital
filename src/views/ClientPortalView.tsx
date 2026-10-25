import React, { useState } from 'react';
import {
  Home,
  Receipt,
  UploadCloud,
  HardHat,
  Shield,
  Download,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import { ConstructionProgress, LegalVaultDoc, PaymentScheduleItem, Lot } from '../types';
import { storageService } from '../services/storageService';

interface ClientPortalViewProps {
  currentTab: string;
  progressList: ConstructionProgress[];
  legalDocs: LegalVaultDoc[];
  schedule: PaymentScheduleItem[];
  lots: Lot[];
  onDataChanged: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  currentTab,
  progressList,
  legalDocs,
  schedule,
  lots,
  onDataChanged,
}) => {
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);
  const [uploadConcept, setUploadConcept] = useState('Mensualidad 2');
  const [uploadAmount, setUploadAmount] = useState(10718.75);

  const clientLots = lots.filter((l) => l.buyerName?.includes('Carmen') || l.id === 'lot-103');
  const mySchedule = schedule.filter((s) => s.contractId === 'ctr-01');

  const totalPaid = mySchedule
    .filter((s) => s.status === 'Pagado')
    .reduce((acc, s) => acc + s.amount, 0);
  const totalPending = mySchedule
    .filter((s) => s.status !== 'Pagado')
    .reduce((acc, s) => acc + s.amount, 0);

  const handleUploadVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherSuccess(
      `Comprobante de pago para "${uploadConcept}" por $${uploadAmount.toLocaleString('es-MX')} MXN recibido exitosamente. El área de contabilidad conciliará tu pago en menos de 24 horas hábiles.`
    );
    setTimeout(() => setVoucherSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Mis Lotes Adquiridos y Contratos */}
      {currentTab === 'my_lots' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Mis Lotes y Contratos
              </h1>
              <p className="text-xs text-gray-500">
                Bienvenido a tu portal de inversionista Futura. Consulta tus unidades residenciales y contratos firmados.
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start">
              Inversionista Verificado ✓
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
              <div className="relative h-44 w-full bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Residencial Futura Norte"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#FD363D] text-white text-xs font-extrabold shadow-xs">
                  Lote M01-L03
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-bold">
                  Contrato Firmado (NOM-151)
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Residencial Futura Norte</h3>
                    <p className="text-xs text-gray-500">Km 14.5 Carretera Mérida-Progreso</p>
                  </div>
                  <span className="text-xs font-extrabold text-[#FD363D]">
                    $735,000 MXN
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center text-xs">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Superficie</p>
                    <p className="font-extrabold text-gray-900">300 m²</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Orientación</p>
                    <p className="font-extrabold text-gray-900">Norte</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Plazo</p>
                    <p className="font-extrabold text-gray-900">48 MSI</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Folio: FUT-2026-0041</span>
                  <button
                    onClick={() => alert('Descargando copia certificada del Contrato con sello NOM-151')}
                    className="flex items-center gap-1.5 font-bold text-[#FD363D] hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Descargar Contrato PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#FD363D]" />
                  Resumen de tu Inversión
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Plusvalía proyectada y certezas del desarrollo.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between">
                    <span className="text-gray-600">Plusvalía Anual Estimada:</span>
                    <span className="font-extrabold text-emerald-700">+18% Anual</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between">
                    <span className="text-gray-600">Fecha de Entrega de Urbanización:</span>
                    <span className="font-bold text-gray-900">Diciembre 2027</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex justify-between">
                    <span className="text-gray-600">Escrituración:</span>
                    <span className="font-bold text-gray-900">Inmediata al finiquito</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4 text-xs text-gray-500">
                Tu asesor asignado: <strong>Lic. Sofía Ramírez</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Estado de Cuenta en Línea */}
      {currentTab === 'account_status' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Estado de Cuenta en Línea
            </h1>
            <p className="text-xs text-gray-500">
              Historial de pagos acreditados, saldo pendiente y fechas oficiales de vencimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Liquidado a la Fecha</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                ${totalPaid.toLocaleString('es-MX')} MXN
              </p>
              <p className="text-[11px] text-gray-500 mt-1">Enganche inicial acreditado</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Saldo Pendiente a Pagar</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">
                ${(735000 - totalPaid).toLocaleString('es-MX')} MXN
              </p>
              <p className="text-[11px] text-gray-500 mt-1">En 48 mensualidades sin intereses</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Próximo Vencimiento</p>
              <p className="text-2xl font-extrabold text-[#FD363D] mt-1">15 Nov 2026</p>
              <p className="text-[11px] text-gray-500 mt-1">Monto: $10,718.75 MXN</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs overflow-x-auto">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Cronograma de Mensualidades</h3>
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Vencimiento</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3">Estatus</th>
                  <th className="py-2.5 px-3 text-right">Recibo Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mySchedule.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-3 font-bold text-gray-900">{s.concept}</td>
                    <td className="py-3 px-3 text-gray-700">{s.dueDate}</td>
                    <td className="py-3 px-3 font-extrabold text-gray-900">
                      ${s.amount.toLocaleString('es-MX')} MXN
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.status === 'Pagado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {s.receiptFolio ? (
                        <button
                          onClick={() => alert(`Descargando recibo oficial ${s.receiptFolio}`)}
                          className="text-[#FD363D] font-bold hover:underline"
                        >
                          Descargar {s.receiptFolio}
                        </button>
                      ) : (
                        <span className="text-gray-400">Por liquidar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: Carga de Comprobantes de Pago */}
      {currentTab === 'upload_payment' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Subir Comprobante de Pago Bancario
            </h1>
            <p className="text-xs text-gray-500">
              Envío directo de comprobante de transferencia SPEI para acreditación inmediata por el área contable
            </p>
          </div>

          <div className="max-w-xl mx-auto rounded-2xl bg-white border border-gray-200 p-6 shadow-xs">
            {voucherSuccess && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{voucherSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadVoucher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Concepto a Pagar</label>
                <select
                  value={uploadConcept}
                  onChange={(e) => setUploadConcept(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold focus:border-[#FD363D] outline-none"
                >
                  <option value="Mensualidad 1 de 48 MSI">Mensualidad 1 ($10,718.75 MXN)</option>
                  <option value="Mensualidad 2 de 48 MSI">Mensualidad 2 ($10,718.75 MXN)</option>
                  <option value="Abono a Capital">Abono directo a Capital</option>
                  <option value="Finiquito Total">Finiquito Total del Lote</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Monto Pagado (MXN)</label>
                <input
                  type="number"
                  value={uploadAmount}
                  onChange={(e) => setUploadAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-bold focus:border-[#FD363D] outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <p className="font-bold text-gray-800 mb-1">Datos para Transferencia SPEI:</p>
                <p className="text-gray-600 text-[11px]">Banco: BBVA Bancomer</p>
                <p className="text-gray-600 text-[11px]">Beneficiario: Invernadero Futura S.A.P.I. de C.V.</p>
                <p className="text-gray-900 font-mono font-bold text-xs mt-1">
                  CLABE: 012 914 00123456789 0
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Comprobante de Transferencia / Voucher</label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center hover:bg-gray-100 transition cursor-pointer">
                  <UploadCloud className="h-8 w-8 text-[#FD363D] mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-xs">
                    Haz clic para seleccionar tu PDF o foto de la transferencia
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Formatos soportados: JPG, PNG o PDF (hasta 10MB)</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-3 text-xs font-bold transition shadow-xs"
              >
                Enviar Comprobante para Conciliación
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. TAB: Avance de Obra en Vivo (Fotos/Videos) */}
      {currentTab === 'progress' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Avance de Obra y Urbanización en Vivo
            </h1>
            <p className="text-xs text-gray-500">
              Galería periódica, bitácora fotográfica y estado de urbanización de amenidades de tu desarrollo
            </p>
          </div>

          <div className="space-y-6">
            {progressList.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs"
              >
                <div className="relative h-64 md:h-80 w-full bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#FD363D] text-white text-xs font-black shadow-md">
                    {item.percentage}% de Urbanización General
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/75 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Bitácora del {item.date}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-xs text-gray-800 mb-2">Hitos de Infraestructura:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {item.milestones.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-xs ${
                            m.completed ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${m.completed ? 'text-emerald-600' : 'text-gray-300'}`}
                          />
                          <span>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: Repositorio de Certeza Jurídica y Recibos */}
      {currentTab === 'legal_docs' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Repositorio de Certeza Jurídica
            </h1>
            <p className="text-xs text-gray-500">
              Descarga expedientes legales del desarrollo, manifestación de impacto ambiental y licencias de construcción
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs divide-y divide-gray-100">
            {legalDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{doc.title}</h4>
                  <p className="text-[11px] text-gray-500">
                    Categoría: {doc.category} • Verificado por: {doc.verifiedBy}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Descargando copia de certeza jurídica: ${doc.title}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#FD363D] hover:text-[#FD363D] text-xs font-semibold transition self-start sm:self-center"
                >
                  <Download className="h-3.5 w-3.5 text-[#FD363D]" />
                  Descargar Documento
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
