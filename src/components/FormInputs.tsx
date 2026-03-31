import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface FieldWrapperProps {
  label: string;
  field: any;
  children: React.ReactNode;
}

const FieldWrapper = ({ label, field, children }: FieldWrapperProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start gap-2 sm:gap-4 py-2">
    <Label htmlFor={field.name} className="mt-3 text-right">
      {label}
    </Label>
    <div className="flex flex-col gap-1">
      {children}
      {field.state.meta.errors.length > 0 && (
        <span className="text-[0.8rem] font-medium text-destructive">
          {field.state.meta.errors.join(', ')}
        </span>
      )}
    </div>
  </div>
);

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  field: any;
}

export const TextField = ({ label, field, ...props }: TextFieldProps) => {
  if (!field) {
    console.error(`TextField "${label}" with no field.`);
    return null;
  }
  return (
    <FieldWrapper label={label} field={field}>
      <Input
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </FieldWrapper>
  );
};

interface TextAreaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  field: any;
}

export const TextAreaField = ({ label, field, ...props }: TextAreaProps) => {
  if (!field) {
    console.error(`TextAreaField "${label}" with no field.`);
    return null;
  }
  return (
    <FieldWrapper label={label} field={field}>
      <Textarea
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </FieldWrapper>
  );
};

interface MapOption {
  value: string;
  label: string;
  color: string;
}

interface GenericSelectProps {
  label: string;
  field: any;
  options: Record<string, MapOption> | MapOption[];
  placeholder?: string;
}

export const BaseSelectField = ({
  label,
  field,
  options,
  placeholder,
}: GenericSelectProps) => {
  if (!field) {
    console.error(`SelectField "${label}" with no field.`);
    return null;
  }

  const optionsArray = Array.isArray(options)
    ? options
    : Object.values(options);

  return (
    <FieldWrapper label={label} field={field}>
      <Select
        value={field.state.value}
        onValueChange={(val) => field.handleChange(val)}
      >
        <SelectTrigger id={field.name} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {optionsArray.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${option.color}`} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
};

export const SubmitButton = ({ children, form }: any) => {
  if (!form) return null;

  return (
    <form.Subscribe
      selector={(state: any) => [state.canSubmit, state.isSubmitting]}
    >
      {([canSubmit, isSubmitting]: [boolean, boolean]) => (
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="relative"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Sending...' : children}
        </Button>
      )}
    </form.Subscribe>
  );
};
