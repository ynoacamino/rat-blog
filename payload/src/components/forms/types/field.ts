import type { SupportedFields } from '@/components/forms/lib/field';
import type { SelectOption } from '@/components/forms/types/select-option';
import { LucideProps } from 'lucide-react';

export type SupportFieldType =
  (typeof SupportedFields)[keyof typeof SupportedFields];

type BaseField<T extends string> = {
  name: T;
  label: string;
  icon?: React.ComponentType<LucideProps>;
  description?: string;
  placeholder?: string;
};

export type Field<T extends string> = BaseField<T> &
  (
    | {
        type: typeof SupportedFields.TEXT | typeof SupportedFields.TEXTAREA | typeof SupportedFields.PASSWORD;
      }
    | {
        type: typeof SupportedFields.SELECT;
        options: SelectOption[];
      }
    | {
        type: typeof SupportedFields.TOGGLE_GROUP;
        options: SelectOption[];
        columns: number;
      }
  );
