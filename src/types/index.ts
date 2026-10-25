export type UserRole =
  | 'superadmin'
  | 'commercial_manager'
  | 'advisor'
  | 'legal_control'
  | 'collections'
  | 'investor';

export interface RoleConfig {
  id: UserRole;
  name: string;
  shortName: string;
  badge: string;
  color: string;
  iconName: string;
}

export type LotStatus = 'disponible' | 'apartado' | 'vendido' | 'bloqueado';

export interface Lot {
  id: string;
  developmentId: string;
  block: string; // Manzana
  number: string; // Lote número
  surfaceM2: number;
  pricePerM2: number;
  totalPrice: number;
  status: LotStatus;
  orientation: 'Norte' | 'Sur' | 'Este' | 'Oeste';
  boundaries: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  buyerId?: string;
  buyerName?: string;
  reservedAt?: string;
  reservedUntil?: string; // Expiration timer 48-72h
  reservedByAdvisor?: string;
  assignedAdvisorId?: string;
  stageName?: string;
}

export interface Development {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  totalLots: number;
  soldLots: number;
  reservedLots: number;
  availableLots: number;
  basePricePerM2: number;
  totalM2: number;
  soldM2: number;
  totalValue: number;
  collectedValue: number;
  amenities: string[];
  permitsStatus: 'Validado' | 'En Trámite' | 'Auditado';
  image: string;
  masterPlanUrl?: string;
  financingOptions: number[]; // e.g. [24, 48, 60]
}

export type PipelineStage =
  | 'primer_contacto'
  | 'perfilamiento'
  | 'videollamada'
  | 'apartado'
  | 'firma_promesa'
  | 'liquidacion';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'WhatsApp' | 'Formulario Web' | 'Campaña Meta' | 'Referido' | 'Broker';
  status: PipelineStage;
  investmentGoal: 'Plusvalía' | 'Patrimonio Familiar' | 'Renta Vacacional / Retiro';
  assignedAdvisorId: string;
  assignedAdvisorName: string;
  budgetRange: string;
  notesCount: number;
  lastContactDate: string;
  developmentInterested: string;
  lotInterested?: string;
  createdAt: string;
}

export interface ReservationRequest {
  id: string;
  lotId: string;
  lotCode: string;
  developmentName: string;
  clientName: string;
  clientPhone: string;
  advisorName: string;
  amount: number;
  voucherUrl?: string;
  requestDate: string;
  expiresAt: string; // ISO string for 48-72h countdown
  status: 'Pendiente de Aprobación' | 'Aprobado Activo' | 'Expirado' | 'Cancelado';
  commercialNotes?: string;
}

export interface FinancialQuote {
  id: string;
  clientName: string;
  clientPhone: string;
  lotId: string;
  lotCode: string;
  developmentName: string;
  surfaceM2: number;
  pricePerM2: number;
  totalPrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  financingMonths: number;
  monthlyPayment: number;
  finalPaymentAmount: number; // Saldo contra entrega
  advisorName: string;
  createdAt: string;
}

export interface ClientKYC {
  id: string;
  clientId: string;
  clientName: string;
  rfc: string;
  email: string;
  phone: string;
  ineStatus: 'Validado' | 'En Revisión' | 'Pendiente';
  rfcStatus: 'Validado' | 'En Revisión' | 'Pendiente';
  proofOfAddressStatus: 'Validado' | 'En Revisión' | 'Pendiente';
  beneficiariesStatus: 'Validado' | 'En Revisión' | 'Pendiente';
  pldRiskLevel: 'Bajo' | 'Medio' | 'Alto';
  lotPurchased: string;
  development: string;
  updatedAt: string;
}

export interface LegalVaultDoc {
  id: string;
  developmentId: string;
  title: string;
  category: 'Certeza Registral' | 'Escritura Predio Madre' | 'Permiso Municipal' | 'MIA / FUA Ambiental' | 'Régimen Condominio';
  fileUrl: string;
  uploadDate: string;
  status: 'Aprobado' | 'En Revisión' | 'Actualizado';
  verifiedBy: string;
}

export interface PurchaseContract {
  id: string;
  folio: string;
  clientName: string;
  lotCode: string;
  developmentName: string;
  totalPrice: number;
  amortizationTableApproved: boolean;
  signatureStatus: 'Borrador' | 'Enviado para Firma' | 'Firmado' | 'Escrituración Iniciada';
  provider: 'Nom-151' | 'DocuSign' | 'Mifiel';
  signedDate?: string;
  notaryProgress?: string;
}

export interface PaymentScheduleItem {
  id: string;
  contractId: string;
  paymentNumber: number;
  totalPayments: number;
  concept: string; // "Enganche", "Mensualidad 1", etc.
  dueDate: string;
  amount: number;
  penaltyFee: number;
  status: 'Pagado' | 'Pendiente' | 'Vencido' | 'Por Validar';
  paidDate?: string;
  voucherUrl?: string;
  receiptFolio?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptFolio: string;
  clientName: string;
  lotCode: string;
  developmentName: string;
  amount: number;
  date: string;
  paymentMethod: 'Transferencia SPEI' | 'Depósito Bancario' | 'Tarjeta';
  status: 'Conciliado' | 'Pendiente de Conciliar' | 'Rechazado';
  voucherImg?: string;
  bankReference: string;
}

export interface CommercialPolicy {
  id: string;
  developmentId: string;
  basePricePerM2: number;
  internalAdvisorCommissionPercent: number; // e.g. 3%
  externalBrokerCommissionPercent: number; // e.g. 4%
  maxDiscountAuthorized: number; // e.g. 5%
  financingPlans: number[]; // [24, 48, 60]
}

export interface ConstructionProgress {
  id: string;
  developmentId: string;
  date: string;
  percentage: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  milestones: { name: string; completed: boolean }[];
}

export interface CommissionRecord {
  id: string;
  advisorName: string;
  type: 'Asesor Interno' | 'Broker Externo';
  lotCode: string;
  developmentName: string;
  clientName: string;
  downPaymentCollected: number;
  commissionPercent: number;
  commissionAmount: number;
  status: 'Por Aprobar' | 'Aprobado Listo' | 'Liquidado';
  date: string;
}

export interface CommercialExceptionRequest {
  id: string;
  advisorName: string;
  clientName: string;
  lotCode: string;
  requestedDiscountPercent: number;
  specialFinancingMonths: number;
  downPaymentAdjustmentPercent: number;
  reason: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
  requestedAt: string;
}

export interface SystemSettings {
  useSampleData: boolean;
  neverShowSampleDataAgain: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isSupabaseConfigured: boolean;
  lastPurgedAt?: string;
}
