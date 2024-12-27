export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormField = keyof ContactFormData;

export const SUBJECT_OPTIONS = [
  { value: 'colaborar', label: 'Quiero colaborar' },
  { value: 'sugerir', label: 'Tengo una sugerencia' },
  { value: 'otro', label: 'Otro' }
] as const;