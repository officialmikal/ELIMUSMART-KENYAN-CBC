
import { Student, UserRole, MessageTemplate } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Kevin Otieno',
    admNo: '1023',
    gender: 'Male',
    dob: '2012-05-14',
    grade: 'Grade 6',
    stream: 'A',
    parentName: 'James Otieno',
    parentPhone: '+254712345678',
    residence: 'Nairobi West',
    feeBalance: 12500
  },
  {
    id: '2',
    name: 'Sarah Mwangi',
    admNo: '1045',
    gender: 'Female',
    dob: '2013-02-21',
    grade: 'Grade 5',
    stream: 'B',
    parentName: 'Mary Mwangi',
    parentPhone: '+254722334455',
    residence: 'Syokimau',
    feeBalance: 0
  },
  {
    id: '3',
    name: 'Brian Kipkorir',
    admNo: '1102',
    gender: 'Male',
    dob: '2011-09-30',
    grade: 'Grade 7 (JSS)',
    stream: 'Red',
    parentName: 'Kipkorir Langat',
    parentPhone: '+254700112233',
    residence: 'Langata',
    feeBalance: 4500
  }
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 't1',
    type: 'CLOSURE',
    content: 'Dear Parent/Guardian, [School Name] will close on [Date] due to [Reason]. Kindly ensure your child arrives safely. Regards, Admin.'
  },
  {
    id: 't2',
    type: 'OPENING',
    content: 'Dear Parent/Guardian, [School Name] will reopen on [Date] for Term [X]. Kindly ensure fees are cleared. Thank you.'
  },
  {
    id: 't3',
    type: 'FEE_REMINDER',
    content: 'Dear Parent/Guardian, [Student Name] (ADM: [ADM]) has an outstanding fee balance of KES [Amount]. Please clear via M-Pesa. Accounts Office.'
  },
  {
    id: 't4',
    type: 'PAYMENT_CONFIRMATION',
    content: 'Payment Received. KES [Amount] for [Student Name]. New Balance: KES [Balance]. [School Name] Accounts.'
  }
];

export const GRADES = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7 (JSS)', 'Grade 8 (JSS)', 'Grade 9 (JSS)'];
export const SUBJECTS = ['Mathematics', 'English', 'Kiswahili', 'Science & Tech', 'Social Studies', 'CRE/IRE', 'Pre-Technical', 'Creative Arts'];
