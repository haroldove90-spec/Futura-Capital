/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Lot, Development, Lead, ReservationRequest, FinancialQuote, ClientKYC, LegalVaultDoc, PurchaseContract, PaymentScheduleItem, PaymentTransaction, ConstructionProgress, CommissionRecord, CommercialExceptionRequest } from './types';
import { storageService } from './services/storageService';
import { SplashScreen } from './components/SplashScreen';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, ROLE_MODULES } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DataManagementModal } from './components/DataManagementModal';
import { WorkflowModal } from './components/WorkflowModal';

// Vistas por Rol
import { SuperadminView } from './views/SuperadminView';
import { CommercialManagerView } from './views/CommercialManagerView';
import { AdvisorView } from './views/AdvisorView';
import { LegalControlView } from './views/LegalControlView';
import { CollectionsView } from './views/CollectionsView';
import { ClientPortalView } from './views/ClientPortalView';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modales
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState<boolean>(false);

  // Datos globales del sistema
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reservations, setReservations] = useState<ReservationRequest[]>([]);
  const [quotes, setQuotes] = useState<FinancialQuote[]>([]);
  const [kycList, setKycList] = useState<ClientKYC[]>([]);
  const [legalDocs, setLegalDocs] = useState<LegalVaultDoc[]>([]);
  const [contracts, setContracts] = useState<PurchaseContract[]>([]);
  const [schedule, setSchedule] = useState<PaymentScheduleItem[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [progressList, setProgressList] = useState<ConstructionProgress[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [exceptions, setExceptions] = useState<CommercialExceptionRequest[]>([]);

  // Cargar datos desde storageService
  const loadAllData = useCallback(() => {
    setDevelopments(storageService.getDevelopments());
    setLots(storageService.getLots());
    setLeads(storageService.getLeads());
    setReservations(storageService.getReservations());
    setQuotes(storageService.getQuotes());
    setKycList(storageService.getKYC());
    setLegalDocs(storageService.getLegalDocs());
    setContracts(storageService.getContracts());
    setSchedule(storageService.getPaymentSchedule());
    setTransactions(storageService.getTransactions());
    setProgressList(storageService.getProgress());
    setCommissions(storageService.getCommissions());
    setExceptions(storageService.getExceptions());
  }, []);

  useEffect(() => {
    loadAllData();

    const handleDataUpdate = () => {
      loadAllData();
    };

    window.addEventListener('futura:data-updated', handleDataUpdate);
    return () => {
      window.removeEventListener('futura:data-updated', handleDataUpdate);
    };
  }, [loadAllData]);

  // Al seleccionar un rol, inicializar su tab por defecto
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    const defaultTab = ROLE_MODULES[role]?.[0]?.id || 'analytics';
    setCurrentTab(defaultTab);
  };

  const handleLogout = () => {
    setActiveRole(null);
  };

  const handleNavigatePhase = (targetRole: UserRole, targetTab: string) => {
    setActiveRole(targetRole);
    setCurrentTab(targetTab);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col antialiased selection:bg-[#FD363D] selection:text-white">
      {/* Splash inicial */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Pantalla 1: Acceso por Roles en Inicio (sin header, cuadrícula 2 col móvil / 4 col escritorio) */}
      {!activeRole ? (
        <RoleSelector
          onSelectRole={handleSelectRole}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenDataModal={() => setIsDataModalOpen(true)}
        />
      ) : (
        /* Pantalla 2: Interfaz unificada del Dashboard */
        <div className="min-h-screen flex flex-col">
          {/* Cabecera Institucional Unificada */}
          <Header
            activeRole={activeRole}
            onSelectRole={handleSelectRole}
            onLogout={handleLogout}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onOpenDataModal={() => setIsDataModalOpen(true)}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onToggleWorkflow={() => setIsWorkflowModalOpen(true)}
          />

          {/* Cuerpo principal con Sidebar en escritorio */}
          <div className="flex-1 flex w-full">
            <Sidebar
              activeRole={activeRole}
              currentTab={currentTab}
              onSelectTab={(tabId) => setCurrentTab(tabId)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              onOpenInstall={() => setIsInstallModalOpen(true)}
              onLogout={handleLogout}
            />

            {/* Área de trabajo maximizada (sin pestañas horizontales duplicadas) */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full overflow-x-hidden">
              {activeRole === 'superadmin' && (
                <SuperadminView
                  currentTab={currentTab}
                  developments={developments}
                  lots={lots}
                  legalDocs={legalDocs}
                  onDataChanged={loadAllData}
                />
              )}

              {activeRole === 'commercial_manager' && (
                <CommercialManagerView
                  currentTab={currentTab}
                  leads={leads}
                  reservations={reservations}
                  commissions={commissions}
                  exceptions={exceptions}
                  lots={lots}
                  onDataChanged={loadAllData}
                />
              )}

              {activeRole === 'advisor' && (
                <AdvisorView
                  currentTab={currentTab}
                  lots={lots}
                  leads={leads}
                  developments={developments}
                  quotes={quotes}
                  reservations={reservations}
                  onDataChanged={loadAllData}
                />
              )}

              {activeRole === 'legal_control' && (
                <LegalControlView
                  currentTab={currentTab}
                  kycList={kycList}
                  contracts={contracts}
                  legalDocs={legalDocs}
                  lots={lots}
                  onDataChanged={loadAllData}
                />
              )}

              {activeRole === 'collections' && (
                <CollectionsView
                  currentTab={currentTab}
                  schedule={schedule}
                  transactions={transactions}
                  lots={lots}
                  onDataChanged={loadAllData}
                />
              )}

              {activeRole === 'investor' && (
                <ClientPortalView
                  currentTab={currentTab}
                  progressList={progressList}
                  legalDocs={legalDocs}
                  schedule={schedule}
                  lots={lots}
                  onDataChanged={loadAllData}
                />
              )}
            </main>
          </div>

          {/* Navegación Móvil y Tablet (Bottom Bar) */}
          <BottomBar
            activeRole={activeRole}
            currentTab={currentTab}
            onSelectTab={(tabId) => setCurrentTab(tabId)}
          />
        </div>
      )}

      {/* Modal Instalación PWA */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Modal Gestión de Datos y Supabase */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataChanged={loadAllData}
      />

      {/* Modal Flujo Operativo Completo */}
      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onNavigatePhase={handleNavigatePhase}
      />
    </div>
  );
}
