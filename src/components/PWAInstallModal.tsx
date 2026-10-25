import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://appdesignproyectos.com/futuraicono.png"
            alt="Futura Ícono"
            className="h-16 w-16 rounded-2xl shadow-md border border-gray-100 object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-[#000000]">Invernadero Futura</h3>
            <p className="text-xs font-semibold text-[#FD363D] uppercase tracking-wider">
              Plataforma Inmobiliaria PWA
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Acceso rápido sin descargas de tiendas</p>
          </div>
        </div>

        {isInstalled || installSuccess ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center my-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-emerald-900 text-sm">¡Aplicación Lista e Instalada!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Futura ya se encuentra instalada en tu dispositivo. Puedes abrirla desde tu pantalla de inicio o menú de apps.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-4">
            <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
              <div className="flex items-center gap-2 font-medium text-xs text-gray-800 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FD363D] text-[10px] text-white font-bold">✓</span>
                Ventajas de instalar la App Futura:
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-6 list-disc">
                <li>Apertura en pantalla completa como aplicación nativa</li>
                <li>Acceso ultra rápido a cotizaciones y Master Plan offline</li>
                <li>Navegación fluida sin barra de direcciones del navegador</li>
              </ul>
            </div>

            {/* Android / Chromium / Desktop prompt */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD363D] hover:bg-[#e0262d] text-white py-3 px-4 font-semibold text-sm shadow-md shadow-red-200 transition active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                Instalar Invernadero Futura Ahora
              </button>
            )}

            {/* iOS Safari Guide */}
            {isIOS && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <div className="flex items-center gap-2 font-semibold text-blue-900 text-xs mb-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Instrucciones para iPhone / iPad (Safari):
                </div>
                <ol className="text-xs text-blue-800 space-y-2 pl-4 list-decimal">
                  <li>
                    Toca el botón <strong>Compartir</strong> <Share2 className="inline h-3.5 w-3.5 text-blue-700 mx-1" /> en la barra inferior de Safari.
                  </li>
                  <li>
                    Desliza hacia abajo y selecciona <strong>Agregar al inicio</strong> <PlusSquare className="inline h-3.5 w-3.5 text-blue-700 mx-1" />.
                  </li>
                  <li>
                    Pulsa <strong>Agregar</strong> en la esquina superior derecha.
                  </li>
                </ol>
              </div>
            )}

            {/* Desktop browser fallback if prompt not fired yet */}
            {!isInstallable && !isIOS && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2 font-semibold text-amber-900 text-xs mb-1">
                  <Monitor className="h-4 w-4 text-amber-600" />
                  Instalación en Navegadores de Computadora:
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Haz clic en el ícono de instalación <Download className="inline h-3.5 w-3.5 text-amber-700 mx-1" /> que aparece en la barra de direcciones superior de tu navegador (Chrome, Edge o Brave) o pulsa <strong>Instalar Futura</strong>.
                </p>
                <button
                  onClick={() => {
                    alert('Si tu navegador soporta instalación PWA, pulsa el ícono de pantalla o descarga en la barra de direcciones de tu navegador.');
                  }}
                  className="mt-3 w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white py-2 text-xs font-semibold transition"
                >
                  Verificar Soporte de Instalación
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
