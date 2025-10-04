import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import type { Field } from '@/components/forms/types/field';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SupportedFields } from '@/components/forms/lib/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

function InferItem<
  FieldName extends string,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  ...props
}: Field<FieldName> & ControllerRenderProps<TFieldValues, TName>) {
  return (
    <FormItem>
      <FormLabel>
        {props.icon && <props.icon className="" size={16} />}
        {label}
      </FormLabel>
      <FormControl>
        {(() => {
          if (props.type === SupportedFields.SELECT) {
            return (
              <Select onValueChange={props.onChange} defaultValue={props.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {props.options.map(({ key, value, textValue }) => (
                    <SelectItem key={`select-${key}-${value}`} value={value}>
                      {textValue || value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          } else if (props.type === SupportedFields.TEXTAREA) {
            return <Textarea {...props} />;
          } else if (props.type === SupportedFields.TOGGLE_GROUP) {
            return (
              <ToggleGroup
                {...props}
                onValueChange={props.onChange}
                defaultValue={props.value}
                type="single"
                className={cn('grid w-full gap-x-4 gap-y-2', {
                  'grid-cols-1': props.columns === 1,
                  'grid-cols-2': props.columns === 2,
                  'grid-cols-3': props.columns === 3,
                  'grid-cols-4': props.columns === 4,
                  'grid-cols-5': props.columns === 5,
                })}
              >
                {props.options.map(({ key, value, textValue }) => (
                  <ToggleGroupItem
                    key={`toogle-group-${key}-${value}`}
                    value={value}
                    variant={'outline'}
                  >
                    {textValue || value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            );
          } else if (props.type === SupportedFields.PASSWORD) {
            return <Input  {...props} type="password" />;
          } else {
            // Default to text input for SupportedFields.TEXT
            return <Input {...props} />;
          }
        })()}
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

export { InferItem };
