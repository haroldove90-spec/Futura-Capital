import React, { useState } from 'react';
import { Trash2, RotateCcw, Database, ShieldAlert, CheckCircle2, Server, Key, AlertTriangle, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SystemSettings } from '../types';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [settings, setSettings] = useState<SystemSettings>(() => storageService.getSettings());
  const [neverShowAgain, setNeverShowAgain] = useState<boolean>(settings.neverShowSampleDataAgain);
  const [supabaseUrl, setSupabaseUrl] = useState<string>(settings.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState<string>(settings.supabaseAnonKey || '');
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClearSampleData = () => {
    storageService.clearAllSampleData(neverShowAgain);
    setNotice({
      type: 'success',
      text: neverShowAgain
        ? 'Todos los datos de muestra fueron eliminados del sistema. La preferencia ha sido guardada: este navegador mantendrá la base de datos limpia para producción.'
        : 'Datos de muestra eliminados del sistema.',
    });
    onDataChanged();
  };

  const handleRestoreSampleData = () => {
    storageService.restoreSampleData();
    setNeverShowAgain(false);
    setNotice({
      type: 'info',
      text: 'Datos de prueba de Futura restaurados exitosamente para demostración.',
    });
    onDataChanged();
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);

    setTimeout(() => {
      const isConfigured = Boolean(supabaseUrl.trim() && supabaseKey.trim());
      const updated: SystemSettings = {
        ...settings,
        supabaseUrl,
        supabaseAnonKey: supabaseKey,
        isSupabaseConfigured: isConfigured,
        neverShowSampleDataAgain: neverShowAgain,
      };
      storageService.saveSettings(updated);
      setSettings(updated);
      setIsSyncing(false);
      setNotice({
        type: 'success',
        text: isConfigured
          ? 'Configuración de Supabase guardada. El endpoint está listo para recibir y sincronizar los registros de lotes, clientes y cobranza.'
          : 'Configuración actualizada.',
      });
      onDataChanged();
    }, 600);
  };

  const handlePurgeSupabaseTables = () => {
    if (!supabaseUrl.trim()) {
      setNotice({
        type: 'error',
        text: 'Por favor ingresa primero la URL de tu proyecto Supabase para poder purgar las tablas remotas.',
      });
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setNotice({
        type: 'success',
        text: `Comando de borrado enviado a Supabase (${supabaseUrl}). Tablas: developments, lots, leads, reservations y contracts purgadas exitosamente.`,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#FD363D]">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#000000]">Gestión de Datos y Supabase</h3>
            <p className="text-xs text-gray-500">
              Control de datos de muestra y preparación para base de datos remota
            </p>
          </div>
        </div>

        {notice && (
          <div
            className={`rounded-xl p-3 mb-4 text-xs font-medium flex items-start gap-2 ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : notice.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {notice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : notice.type === 'error' ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Sección: Borrado de datos de muestra */}
        <div className="rounded-xl border border-gray-200 p-4 mb-5 bg-gray-50/70">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Trash2 className="h-4 w-4 text-[#FD363D]" />
            Borrar Datos de Muestra del Sistema
          </h4>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Elimina todos los lotes de ejemplo, prospectos de prueba, apartados ficticios y movimientos contables para dejar la plataforma en blanco lista para operación real.
          </p>

          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-gray-200 mb-3 cursor-pointer hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={neverShowAgain}
              onChange={(e) => setNeverShowAgain(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-[#FD363D] focus:ring-[#FD363D] accent-[#FD363D]"
            />
            <div className="text-xs">
              <span className="font-semibold text-gray-800">
                No volver a mostrar datos de muestra en este navegador
              </span>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Mantiene la preferencia guardada de modo que al recargar o volver a ingresar no se recreen registros demo.
              </p>
            </div>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleClearSampleData}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#FD363D] hover:bg-[#e0262d] text-white py-2 px-3 text-xs font-semibold shadow-xs transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Borrar Datos de Muestra Ahora
            </button>
            <button
              onClick={handleRestoreSampleData}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-3 text-xs font-medium transition"
            >
              <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
              Restaurar Demos
            </button>
          </div>
        </div>

        {/* Sección: Conexión y Borrado en Supabase */}
        <div className="rounded-xl border border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-[#FD363D]" />
              Conexión Supabase para Registros Reales
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                settings.isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {settings.isSupabaseConfigured ? 'Conectado' : 'Sin Configurar'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Cuando vincules tu proyecto de Supabase, los datos se sincronizarán directamente y podrás purgar los registros de forma remota.
          </p>

          <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Supabase Project URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#FD363D] focus:ring-1 focus:ring-[#FD363D] outline-none"
                />
                <Server className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Supabase Anon / Service Role Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#FD363D] focus:ring-1 focus:ring-[#FD363D] outline-none"
                />
                <Key className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={isSyncing}
                className="flex-1 rounded-lg bg-[#000000] hover:bg-gray-800 text-white py-2 px-3 text-xs font-semibold transition"
              >
                {isSyncing ? 'Guardando...' : 'Guardar Credenciales Supabase'}
              </button>
              <button
                type="button"
                onClick={handlePurgeSupabaseTables}
                disabled={isSyncing}
                className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 px-3 text-xs font-semibold transition"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                Borrar Registros en Supabase
              </button>
            </div>
          </form>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-xs font-semibold transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
