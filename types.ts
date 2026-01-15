
export enum UserRole {
  ADMIN = 'ADMIN',
  CLASS_TEACHER = 'CLASS_TEACHER',
  SUBJECT_TEACHER = 'SUBJECT_TEACHER',
  BURSAR = 'BURSAR',
  PARENT = 'PARENT',
  NONE = 'NONE'
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
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

export interface Subject {
  id: string;
  name: string;
  category: 'CBC' | 'JSS' | '8-4-4' | 'Other';
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
  receiptNo: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: 'M-Pesa' | 'Cash' | 'Bank';
  reference: string;
  date: string;
}

export interface MessageTemplate {
  id: string;
  type: 'CLOSURE' | 'OPENING' | 'FEE_REMINDER' | 'PAYMENT_CONFIRMATION';
  content: string;
}
