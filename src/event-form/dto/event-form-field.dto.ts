export class EventFormFieldDto {
    label: string;
    type: 'text' | 'checkbox' | 'radio' | 'textarea' | 'email' | 'number';
    required?: boolean;
    options?: string[];
  }
  