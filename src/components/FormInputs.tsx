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

const FieldWrapper = ({ label, field, children }: any) => (
  <div className="grid grid-cols-[100px_1fr] items-start gap-4 py-2">
    <Label htmlFor={field.name} className="mt-3 text-right">
      {label}
    </Label>
    <div className="flex flex-col gap-1">
      {children}
      {field.state.meta.errors && (
        <span className="text-xs text-destructive">
          {field.state.meta.errors}
        </span>
      )}
    </div>
  </div>
);

export const TextField = ({ label, field, ...props }: any) => {
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

export const TextAreaField = ({ label, field, ...props }: any) => {
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
