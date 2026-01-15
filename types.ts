
export enum UserRole {
  ADMIN = 'ADMIN',
  CLASS_TEACHER = 'CLASS_TEACHER',
  SUBJECT_TEACHER = 'SUBJECT_TEACHER',
  BURSAR = 'BURSAR',
  PARENT = 'PARENT',
  NONE = 'NONE'
}

export interface Student {
  id: string;
  name: string;
  admNo: string;
  gender: 'Male' | 'Female';
  dob: string;
  grade: string;
  stream: string;
  parentName: string;
  parentPhone: string;
  residence: string;
  photo?: string;
  feeBalance: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admNo: string;
  grade: string;
  term: string;
  year: number;
  items: { description: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Unpaid' | 'Partial' | 'Paid';
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'M-Pesa' | 'Bank' | 'Cash';
  reference: string;
}

export interface Grade {
  studentId: string;
  subject: string;
  marks: number;
  term: string;
  year: number;
  remarks: string;
}

export interface MessageTemplate {
  id: string;
  type: 'CLOSURE' | 'OPENING' | 'FEE_REMINDER' | 'PAYMENT_CONFIRMATION';
  content: string;
}
