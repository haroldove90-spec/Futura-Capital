import {
  Development,
  Lot,
  Lead,
  ReservationRequest,
  FinancialQuote,
  ClientKYC,
  LegalVaultDoc,
  PurchaseContract,
  PaymentScheduleItem,
  PaymentTransaction,
  ConstructionProgress,
  CommissionRecord,
  CommercialExceptionRequest,
  SystemSettings,
} from '../types';
import {
  INITIAL_DEVELOPMENTS,
  INITIAL_LOTS,
  INITIAL_LEADS,
  INITIAL_RESERVATIONS,
  INITIAL_QUOTES,
  INITIAL_KYC,
  INITIAL_LEGAL_DOCS,
  INITIAL_CONTRACTS,
  INITIAL_PAYMENT_SCHEDULE,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_CONSTRUCTION_PROGRESS,
  INITIAL_COMMISSIONS,
  INITIAL_EXCEPTIONS,
} from '../data/mockData';

const SETTINGS_KEY = 'futura_system_settings_v1';
const DEVELOPMENTS_KEY = 'futura_developments_v1';
const LOTS_KEY = 'futura_lots_v1';
const LEADS_KEY = 'futura_leads_v1';
const RESERVATIONS_KEY = 'futura_reservations_v1';
const QUOTES_KEY = 'futura_quotes_v1';
const KYC_KEY = 'futura_kyc_v1';
const LEGAL_DOCS_KEY = 'futura_legal_docs_v1';
const CONTRACTS_KEY = 'futura_contracts_v1';
const PAYMENT_SCHEDULE_KEY = 'futura_payment_schedule_v1';
const TRANSACTIONS_KEY = 'futura_transactions_v1';
const PROGRESS_KEY = 'futura_progress_v1';
const COMMISSIONS_KEY = 'futura_commissions_v1';
const EXCEPTIONS_KEY = 'futura_exceptions_v1';

export const storageService = {
  getSettings(): SystemSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      useSampleData: true,
      neverShowSampleDataAgain: false,
      supabaseUrl: '',
      supabaseAnonKey: '',
      isSupabaseConfigured: false,
    };
  },

  saveSettings(settings: SystemSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('futura:settings-changed', { detail: settings }));
  },

  getDevelopments(): Development[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(DEVELOPMENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(DEVELOPMENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DEVELOPMENTS;
  },

  saveDevelopments(items: Development[]): void {
    localStorage.setItem(DEVELOPMENTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getLots(): Lot[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(LOTS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(LOTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LOTS;
  },

  saveLots(items: Lot[]): void {
    localStorage.setItem(LOTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getLeads(): Lead[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(LEADS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  },

  saveLeads(items: Lead[]): void {
    localStorage.setItem(LEADS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getReservations(): ReservationRequest[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(RESERVATIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_RESERVATIONS;
  },

  saveReservations(items: ReservationRequest[]): void {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getQuotes(): FinancialQuote[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(QUOTES_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(QUOTES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_QUOTES;
  },

  saveQuotes(items: FinancialQuote[]): void {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getKYC(): ClientKYC[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(KYC_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(KYC_KEY);
    return raw ? JSON.parse(raw) : INITIAL_KYC;
  },

  saveKYC(items: ClientKYC[]): void {
    localStorage.setItem(KYC_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getLegalDocs(): LegalVaultDoc[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(LEGAL_DOCS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(LEGAL_DOCS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LEGAL_DOCS;
  },

  saveLegalDocs(items: LegalVaultDoc[]): void {
    localStorage.setItem(LEGAL_DOCS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getContracts(): PurchaseContract[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(CONTRACTS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(CONTRACTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CONTRACTS;
  },

  saveContracts(items: PurchaseContract[]): void {
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getPaymentSchedule(): PaymentScheduleItem[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(PAYMENT_SCHEDULE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(PAYMENT_SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PAYMENT_SCHEDULE;
  },

  savePaymentSchedule(items: PaymentScheduleItem[]): void {
    localStorage.setItem(PAYMENT_SCHEDULE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getTransactions(): PaymentTransaction[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(TRANSACTIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PAYMENT_TRANSACTIONS;
  },

  saveTransactions(items: PaymentTransaction[]): void {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getProgress(): ConstructionProgress[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CONSTRUCTION_PROGRESS;
  },

  saveProgress(items: ConstructionProgress[]): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getCommissions(): CommissionRecord[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(COMMISSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(COMMISSIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_COMMISSIONS;
  },

  saveCommissions(items: CommissionRecord[]): void {
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  getExceptions(): CommercialExceptionRequest[] {
    const settings = this.getSettings();
    if (settings.neverShowSampleDataAgain && !settings.useSampleData) {
      const raw = localStorage.getItem(EXCEPTIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const raw = localStorage.getItem(EXCEPTIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_EXCEPTIONS;
  },

  saveExceptions(items: CommercialExceptionRequest[]): void {
    localStorage.setItem(EXCEPTIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  /**
   * Borra todos los datos de muestra del sistema.
   * Si neverShowAgain es true, guarda esa preferencia para que el navegador
   * permanezca en modo producción limpio y no vuelva a cargar datos de prueba.
   */
  clearAllSampleData(neverShowAgain = true): void {
    localStorage.removeItem(DEVELOPMENTS_KEY);
    localStorage.removeItem(LOTS_KEY);
    localStorage.removeItem(LEADS_KEY);
    localStorage.removeItem(RESERVATIONS_KEY);
    localStorage.removeItem(QUOTES_KEY);
    localStorage.removeItem(KYC_KEY);
    localStorage.removeItem(LEGAL_DOCS_KEY);
    localStorage.removeItem(CONTRACTS_KEY);
    localStorage.removeItem(PAYMENT_SCHEDULE_KEY);
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(COMMISSIONS_KEY);
    localStorage.removeItem(EXCEPTIONS_KEY);

    // Guardar colecciones vacías
    localStorage.setItem(DEVELOPMENTS_KEY, JSON.stringify([]));
    localStorage.setItem(LOTS_KEY, JSON.stringify([]));
    localStorage.setItem(LEADS_KEY, JSON.stringify([]));
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify([]));
    localStorage.setItem(QUOTES_KEY, JSON.stringify([]));
    localStorage.setItem(KYC_KEY, JSON.stringify([]));
    localStorage.setItem(LEGAL_DOCS_KEY, JSON.stringify([]));
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify([]));
    localStorage.setItem(PAYMENT_SCHEDULE_KEY, JSON.stringify([]));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([]));
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify([]));
    localStorage.setItem(EXCEPTIONS_KEY, JSON.stringify([]));

    const current = this.getSettings();
    this.saveSettings({
      ...current,
      useSampleData: false,
      neverShowSampleDataAgain: neverShowAgain,
      lastPurgedAt: new Date().toISOString(),
    });

    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },

  /**
   * Restaura datos de muestra iniciales para evaluación o pruebas del sistema
   */
  restoreSampleData(): void {
    localStorage.setItem(DEVELOPMENTS_KEY, JSON.stringify(INITIAL_DEVELOPMENTS));
    localStorage.setItem(LOTS_KEY, JSON.stringify(INITIAL_LOTS));
    localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(QUOTES_KEY, JSON.stringify(INITIAL_QUOTES));
    localStorage.setItem(KYC_KEY, JSON.stringify(INITIAL_KYC));
    localStorage.setItem(LEGAL_DOCS_KEY, JSON.stringify(INITIAL_LEGAL_DOCS));
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(PAYMENT_SCHEDULE_KEY, JSON.stringify(INITIAL_PAYMENT_SCHEDULE));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_PAYMENT_TRANSACTIONS));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(INITIAL_CONSTRUCTION_PROGRESS));
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(INITIAL_COMMISSIONS));
    localStorage.setItem(EXCEPTIONS_KEY, JSON.stringify(INITIAL_EXCEPTIONS));

    const current = this.getSettings();
    this.saveSettings({
      ...current,
      useSampleData: true,
      neverShowSampleDataAgain: false,
    });

    window.dispatchEvent(new CustomEvent('futura:data-updated'));
  },
};
