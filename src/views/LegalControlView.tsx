import React, { useState } from 'react';
import {
  FileText,
  FileSignature,
  Stamp,
  FolderLock,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  AlertTriangle,
  UserCheck,
  Send,
  Printer,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { ClientKYC, PurchaseContract, LegalVaultDoc, Lot } from '../types';
import { storageService } from '../services/storageService';

interface LegalControlViewProps {
  currentTab: string;
  kycList: ClientKYC[];
  contracts: PurchaseContract[];
  legalDocs: LegalVaultDoc[];
  lots: Lot[];
  onDataChanged: () => void;
}

export const LegalControlView: React.FC<LegalControlViewProps> = ({
  currentTab,
  kycList,
  contracts,
  legalDocs,
  lots,
  onDataChanged,
}) => {
  const [selectedKyc, setSelectedKyc] = useState<ClientKYC | null>(null);
  const [showContractGenerator, setShowContractGenerator] = useState<boolean>(false);
  const [contractClient, setContractClient] = useState('Ing. Alejandro Morales');
  const [contractLot, setContractLot] = useState('M01-L02');
  const [contractProvider, setContractProvider] = useState<'Nom-151' | 'DocuSign' | 'Mifiel'>('Nom-151');
  const [previewContract, setPreviewContract] = useState<PurchaseContract | null>(null);

  // Validar documento en KYC
  const handleValidateDoc = (kycId: string, docKey: 'ine' | 'rfc' | 'domicilio' | 'beneficiarios') => {
    const updated = kycList.map((k) => {
      if (k.id !== kycId) return k;
      if (docKey === 'ine') return { ...k, ineStatus: 'Validado' as const };
      if (docKey === 'rfc') return { ...k, rfcStatus: 'Validado' as const };
      if (docKey === 'domicilio') return { ...k, proofOfAddressStatus: 'Validado' as const };
      return { ...k, beneficiariesStatus: 'Validado' as const };
    });
    storageService.saveKYC(updated);
    onDataChanged();
  };

  // Generar contrato automático
  const handleGenerateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLot = lots.find((l) => `${l.block}-${l.number}` === contractLot) || lots[0];

    const newContract: PurchaseContract = {
      id: `ctr-${Date.now()}`,
      folio: `FUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: contractClient,
      lotCode: contractLot,
      developmentName: 'Residencial Futura Norte',
      totalPrice: targetLot ? targetLot.totalPrice : 784000,
      amortizationTableApproved: true,
      signatureStatus: 'Enviado para Firma',
      provider: contractProvider,
      signedDate: undefined,
      notaryProgress: 'Expediente remitido a plataforma de firma digital biométrica',
    };

    storageService.saveContracts([newContract, ...contracts]);
    setPreviewContract(newContract);
    setShowContractGenerator(false);
    onDataChanged();
  };

  // Simular firma digital completada
  const handleSimulateSigned = (contractId: string) => {
    const updated = contracts.map((c) =>
      c.id === contractId
        ? {
            ...c,
            signatureStatus: 'Firmado' as const,
            signedDate: new Date().toISOString().split('T')[0],
            notaryProgress: 'Contrato firmado con validez jurídica NOM-151 y sello digital',
          }
        : c
    );
    storageService.saveContracts(updated);
    onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* 1. TAB: Expediente Digital del Cliente (KYC / PLD) */}
      {currentTab === 'kyc' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Expediente Digital del Cliente (KYC / PLD)
              </h1>
              <p className="text-xs text-gray-500">
                Validación de identificación oficial, RFC/SAT, comprobante de domicilio y beneficiarios para cumplimiento normativo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900">
                Expedientes en Dictaminación
              </h3>

              <div className="divide-y divide-gray-100">
                {kycList.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 hover:bg-gray-50/60 px-3 rounded-xl transition cursor-pointer"
                    onClick={() => setSelectedKyc(item)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                          {item.clientName}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            Riesgo PLD: {item.pldRiskLevel}
                          </span>
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          RFC: {item.rfc} • {item.development} ({item.lotPurchased})
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleValidateDoc(item.id, 'ine');
                            handleValidateDoc(item.id, 'rfc');
                            handleValidateDoc(item.id, 'domicilio');
                            handleValidateDoc(item.id, 'beneficiarios');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
                        >
                          Aprobar Expediente Completo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">INE / Pasaporte</span>
                        <span className={`font-bold ${item.ineStatus === 'Validado' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.ineStatus} ✓
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Constancia SAT</span>
                        <span className={`font-bold ${item.rfcStatus === 'Validado' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.rfcStatus} ✓
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Comprobante Domicilio</span>
                        <span className={`font-bold ${item.proofOfAddressStatus === 'Validado' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.proofOfAddressStatus}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-[11px]">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Beneficiarios PLD</span>
                        <span className={`font-bold ${item.beneficiariesStatus === 'Validado' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.beneficiariesStatus} ✓
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FD363D]" />
                Normativa PLD Ley Antilavado
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                De conformidad con la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita (LFPIORPI), la comercialización de bienes inmuebles requiere expediente de identificación previo a la firma del contrato.
              </p>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                <p className="font-bold text-gray-800">Umbral de Aviso UIF:</p>
                <p className="text-gray-600">
                  Operaciones mayores a 8,025 UMA requieren reporte oficial ante el SAT.
                </p>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-gray-700">
                  <span>Estatus Futura:</span>
                  <span className="text-emerald-700 font-bold">100% Cumplimiento</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Generador de Promesas de Compraventa */}
      {currentTab === 'contracts' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Generador de Promesas de Compraventa
              </h1>
              <p className="text-xs text-gray-500">
                Creación automatizada del contrato de promesa de compraventa con datos del comprador, lote y tabla oficial
              </p>
            </div>

            <button
              onClick={() => setShowContractGenerator(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white text-xs font-bold transition shadow-xs self-start"
            >
              <FileSignature className="h-4 w-4" />
              Generar Nuevo Contrato
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3">Folio Contrato</th>
                  <th className="py-3 px-3">Inversionista</th>
                  <th className="py-3 px-3">Lote y Proyecto</th>
                  <th className="py-3 px-3">Valor Total</th>
                  <th className="py-3 px-3">Firma Digital</th>
                  <th className="py-3 px-3">Estatus</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((ctr) => (
                  <tr key={ctr.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                      {ctr.folio}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-800">
                      {ctr.clientName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-gray-900">{ctr.lotCode}</span>
                      <p className="text-[10px] text-gray-400">{ctr.developmentName}</p>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-[#FD363D]">
                      ${ctr.totalPrice.toLocaleString('es-MX')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {ctr.provider}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          ctr.signatureStatus === 'Firmado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ctr.signatureStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {ctr.signatureStatus !== 'Firmado' ? (
                        <button
                          onClick={() => handleSimulateSigned(ctr.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
                        >
                          Validar Firma
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold">Firmado ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: Firma Electrónica (Nom-151 / DocuSign / Mifiel) */}
      {currentTab === 'esign' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Integración de Firma Electrónica Certificada
            </h1>
            <p className="text-xs text-gray-500">
              Integración con plataformas de firma digital (Nom-151 / DocuSign / Mifiel) para clientes foráneos y extranjeros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#FD363D] font-bold">
                151
              </div>
              <h3 className="font-bold text-sm text-gray-900">NOM-151 Oficial México</h3>
              <p className="text-xs text-gray-500">
                Constancia de conservación de mensajes de datos emitida por Prestador de Servicios de Certificación (PSC) avalado por la Secretaría de Economía.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Activo y Operativo
              </span>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                DS
              </div>
              <h3 className="font-bold text-sm text-gray-900">DocuSign Global</h3>
              <p className="text-xs text-gray-500">
                Firma remota para clientes en Estados Unidos, Canadá y Europa con verificación de pasaporte internacional.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Activo y Operativo
              </span>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold">
                MF
              </div>
              <h3 className="font-bold text-sm text-gray-900">Mifiel e.firma (SAT)</h3>
              <p className="text-xs text-gray-500">
                Firma avanzada mediante Certificado Digital FIEL del SAT con presunción de autoría y no repudio.
              </p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Activo y Operativo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Bóveda Documental del Desarrollo */}
      {currentTab === 'vault' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Bóveda Documental del Desarrollo
            </h1>
            <p className="text-xs text-gray-500">
              Gestión de carpetas legales por lote (escritura predio madre, permisos municipales, régimen condominal y liberación)
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3">
            {legalDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-[#FD363D] flex items-center justify-between transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <FolderLock className="h-5 w-5 text-[#FD363D]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{doc.title}</h4>
                    <p className="text-[11px] text-gray-400">
                      Categoría: {doc.category} • Fecha de Alta: {doc.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Liberado ✓
                  </span>
                  <button
                    onClick={() => alert(`Descargando documento de la bóveda: ${doc.title}`)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: Seguimiento a Escrituración Notarial */}
      {currentTab === 'notary' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Seguimiento a Escrituración Notarial
            </h1>
            <p className="text-xs text-gray-500">
              Bitácora de trámites notariales una vez liquidado el lote y emitida la carta de no adeudo
            </p>
          </div>

          <div className="space-y-4">
            {contracts
              .filter((c) => c.signatureStatus === 'Firmado')
              .map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#FD363D]">
                        Lote {c.lotCode} — {c.developmentName}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900">
                        Inversionista: {c.clientName}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start">
                      En Proceso Notarial
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                    <strong>Estatus Notarial:</strong> {c.notaryProgress}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>Notaría Asignada: Notaría Pública No. 22 de Mérida</span>
                    <button
                      onClick={() => alert(`Generando ficha de seguimiento notarial para ${c.clientName}`)}
                      className="text-[#FD363D] font-bold hover:underline"
                    >
                      Actualizar Bitácora Notarial
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal Generador de Contrato */}
      {showContractGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <button
              onClick={() => setShowContractGenerator(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-1">
              Generar Promesa de Compraventa
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Fusiona automáticamente datos del comprador, especificaciones técnicas y tabla de pagos
            </p>

            <form onSubmit={handleGenerateContract} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Comprador</label>
                <input
                  type="text"
                  required
                  value={contractClient}
                  onChange={(e) => setContractClient(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Lote y Manzana</label>
                <input
                  type="text"
                  required
                  value={contractLot}
                  onChange={(e) => setContractLot(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#FD363D] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Plataforma de Firma Digital</label>
                <select
                  value={contractProvider}
                  onChange={(e) => setContractProvider(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs bg-white font-semibold focus:border-[#FD363D] outline-none"
                >
                  <option value="Nom-151">NOM-151 (Constancia PSC Oficial)</option>
                  <option value="DocuSign">DocuSign (Extranjeros / Internacional)</option>
                  <option value="Mifiel">Mifiel (e.firma SAT México)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-1">
                <p>✓ Cláusula de penalización por mora del 2% pactada</p>
                <p>✓ Incorporación de plano georreferenciado Insejupy</p>
                <p>✓ Entrega de posesión programada con urbanización al 100%</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowContractGenerator(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 font-semibold text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FD363D] text-white py-2.5 font-bold shadow-xs hover:bg-[#e0262d] transition"
                >
                  Emitir y Enviar a Firma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
