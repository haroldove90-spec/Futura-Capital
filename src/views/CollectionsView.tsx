import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckSquare,
  BellRing,
  AlertOctagon,
  PieChart,
  DollarSign,
  CheckCircle2,
  Receipt,
  Download,
  Send,
  MessageCircle,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { PaymentScheduleItem, PaymentTransaction, Lot } from '../types';
import { storageService } from '../services/storageService';

interface CollectionsViewProps {
  currentTab: string;
  schedule: PaymentScheduleItem[];
  transactions: PaymentTransaction[];
  lots: Lot[];
  onDataChanged: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  currentTab,
  schedule,
  transactions,
  lots,
  onDataChanged,
}) => {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Conciliar pago
  const handleConciliatePayment = (txId: string) => {
    const updated = transactions.map((t) =>
      t.id === txId ? { ...t, status: 'Conciliado' as const } : t
    );
    storageService.saveTransactions(updated);
    onDataChanged();
  };

  // Enviar recordatorio WhatsApp
  const handleSendReminder = (client: string, concept: string, amount: number) => {
    setAlertSuccess(`Recordatorio preventivo enviado exitosamente por WhatsApp a ${client}`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Tablas de Amortización y Cronogramas */}
      {currentTab === 'schedules' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Tablas de Amortización y Cronogramas
              </h1>
              <p className="text-xs text-gray-500">
                Control y calendario de pagos mensuales pactados por cliente y lote
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">No. Pago / Concepto</th>
                  <th className="py-3 px-3">Fecha Vencimiento</th>
                  <th className="py-3 px-3">Monto Capital</th>
                  <th className="py-3 px-3">Moratorio / Recargo</th>
                  <th className="py-3 px-3">Estatus</th>
                  <th className="py-3 px-3 text-right">Recibo Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      {item.concept}
                      <p className="text-[10px] font-normal text-gray-400">Contrato: {item.contractId}</p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-800">
                      {item.dueDate}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-gray-900">
                      ${item.amount.toLocaleString('es-MX')} MXN
                    </td>
                    <td className="py-3.5 px-3 font-bold text-rose-600">
                      {item.penaltyFee > 0 ? `$${item.penaltyFee.toLocaleString('es-MX')}` : '$0.00'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Pagado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Por Validar'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {item.receiptFolio ? (
                        <button
                          onClick={() => alert(`Generando recibo oficial folio ${item.receiptFolio}`)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[11px] font-bold"
                        >
                          {item.receiptFolio}
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Pendiente de cobro</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TAB: Conciliación Bancaria y Validación de Pagos */}
      {currentTab === 'conciliation' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Conciliación Bancaria y Recibos Oficiales
            </h1>
            <p className="text-xs text-gray-500">
              Validación de depósitos bancarios, cotejo de comprobantes y dispersión contable
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">Folio y Cliente</th>
                  <th className="py-3 px-3">Lote y Proyecto</th>
                  <th className="py-3 px-3">Monto Recibido</th>
                  <th className="py-3 px-3">Método y Referencia</th>
                  <th className="py-3 px-3">Estatus Contable</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900">{tx.clientName}</p>
                      <p className="text-[10px] font-mono text-gray-400">{tx.receiptFolio}</p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-800">
                      {tx.lotCode}
                      <p className="text-[10px] text-gray-400">{tx.developmentName}</p>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-emerald-700 text-sm">
                      ${tx.amount.toLocaleString('es-MX')} MXN
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {tx.paymentMethod}
                      <p className="text-[10px] font-mono text-gray-400">{tx.bankReference}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          tx.status === 'Conciliado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {tx.status !== 'Conciliado' ? (
                        <button
                          onClick={() => handleConciliatePayment(tx.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
                        >
                          Conciliar
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Imprimiendo recibo fiscal oficial folio: ${tx.receiptFolio}`)}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-[11px] font-semibold"
                        >
                          Ver Recibo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: Alertas y Cobranza Preventiva */}
      {currentTab === 'alerts' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Alertas y Cobranza Preventiva
            </h1>
            <p className="text-xs text-gray-500">
              Notificaciones automáticas por correo y WhatsApp recordatorios de pago próximo a vencer o saldo vencido
            </p>
          </div>

          {alertSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {alertSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <BellRing className="h-4 w-4 text-[#FD363D]" />
                Recordatorio a 5 Días del Vencimiento
              </h3>
              <p className="text-xs text-gray-500">
                Se envía plantilla de cortesía con cuenta CLABE y botón de confirmación de transferencia.
              </p>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                "Estimado inversionista, le recordamos que su mensualidad del lote M01-L03 vence el próximo 15 de noviembre..."
              </div>
              <button
                onClick={() => handleSendReminder('Dra. Carmen Villarreal', 'Mensualidad 1', 10718.75)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD363D] text-white py-2 text-xs font-bold shadow-xs hover:bg-[#e0262d] transition"
              >
                <Send className="h-3.5 w-3.5" />
                Disparar Lote de Avisos Preventivos
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-amber-600" />
                Aviso de Saldo Vencido con Interés Moratorio
              </h3>
              <p className="text-xs text-gray-500">
                Dispara llamada automatizada y notificación oficial en caso de retraso mayor a 5 días hábiles.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                "Aviso de Cartera: Su pago presenta retraso según la cláusula quinta del contrato. Favor de regularizar para evitar penalización acumulada."
              </div>
              <button
                onClick={() => handleSendReminder('Cliente en Mora', 'Aviso Vencimiento', 21944)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 text-white py-2 text-xs font-bold shadow-xs hover:bg-amber-700 transition"
              >
                <BellRing className="h-3.5 w-3.5" />
                Enviar Notificación de Regularización
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Penalizaciones y Moratorios */}
      {currentTab === 'penalties' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Cálculo de Penalizaciones e Intereses Moratorios
            </h1>
            <p className="text-xs text-gray-500">
              Ajuste automático de saldos en caso de retrasos según términos del contrato de promesa
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs max-w-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-gray-900">Regla Contractual de Moratorios</h3>
            <p className="text-gray-600 leading-relaxed">
              De acuerdo a la promesa de compraventa tipo Futura, los pagos no cubiertos en la fecha límite causan un interés moratorio del <strong>2.0% mensual</strong> sobre saldos insolutos, calculado de forma diaria después del período de gracia de 3 días naturales.
            </p>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Tasa Moratoria Mensual:</span>
                <span className="font-bold text-gray-900">2.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Días de Gracia sin Penalización:</span>
                <span className="font-bold text-gray-900">3 días naturales</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Causal de Recisión:</span>
                <span className="font-bold text-rose-600">3 mensualidades consecutivas impagas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: Reporte de Cartera Vencida */}
      {currentTab === 'delinquency' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Reporte de Cartera Vencida y Riesgo
              </h1>
              <p className="text-xs text-gray-500">
                Reportes por cliente, asesor y desarrollo para mitigar riesgos de recisión
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Cartera Total Vigente</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">$46,800,000 MXN</p>
              <p className="text-[11px] text-gray-500 mt-1">99.2% de cumplimiento puntual</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Saldo en Mora (1-30 días)</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">$245,000 MXN</p>
              <p className="text-[11px] text-gray-500 mt-1">2 clientes en seguimiento preventivo</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-400">Riesgo de Recisión (+90 días)</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">$0.00 MXN</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">0 contratos en causal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
