'use client';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'textarea' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
}

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  options = [],
  rows = 4
}: FormFieldProps) {
  const baseClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={baseClassName}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClassName}
        >
          <option value="">Selecciona una opción</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClassName}
        />
      )}
    </div>
  );
}