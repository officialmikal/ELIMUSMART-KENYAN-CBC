
import { Student, UserRole, MessageTemplate, Subject } from './types';

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

export const INITIAL_SUBJECTS: Subject[] = [
  // CBC Primary
  { id: '1', name: 'Mathematics', category: 'CBC' },
  { id: '2', name: 'English', category: 'CBC' },
  { id: '3', name: 'Kiswahili', category: 'CBC' },
  { id: '4', name: 'Science & Technology', category: 'CBC' },
  { id: '5', name: 'Agriculture & Nutrition', category: 'CBC' },
  { id: '6', name: 'Social Studies', category: 'CBC' },
  { id: '7', name: 'Creative Arts & Sports', category: 'CBC' },
  { id: '8', name: 'Religious Education', category: 'CBC' },
  // JSS
  { id: '9', name: 'Integrated Science', category: 'JSS' },
  { id: '10', name: 'Pre-Technical Studies', category: 'JSS' },
  { id: '11', name: 'Health Education', category: 'JSS' },
  { id: '12', name: 'Business Studies', category: 'JSS' },
  { id: '13', name: 'Life Skills Education', category: 'JSS' },
  { id: '14', name: 'Computer Science', category: 'JSS' },
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 't1',
    type: 'CLOSURE',
    content: 'Dear Parent, [School Name] will close on [Date]. Please clear fees. Regards.'
  },
  {
    id: 't3',
    type: 'FEE_REMINDER',
    content: 'Dear Parent, [Student Name] (ADM: [ADM]) has a balance of KES [Amount]. Please pay via M-Pesa.'
  }
];

export const GRADES = [
  'PP1', 
  'PP2', 
  'Grade 1', 
  'Grade 2', 
  'Grade 3', 
  'Grade 4', 
  'Grade 5', 
  'Grade 6', 
  'Grade 7 (JSS)', 
  'Grade 8 (JSS)', 
  'Grade 9 (JSS)'
];

export const YEARS = Array.from({ length: 50 }, (_, i) => 2001 + i);
