import * as React from "react"
import { User } from "lucide-react"

import { cn } from "@/lib/utils"
function InputName({ className, value, onChange, ...props }: React.ComponentProps<'input'>) {
    const [error, setError] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(Boolean(value));

    React.useEffect(() => {
        setHasValue(Boolean(value));
    }, [value]);

    const validateName = (name: string) => {
        if (!name) return setError('');
        setError(name.trim().length < 2 ? 'Por favor, insira um nome válido' : '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(Boolean(e.target.value));
        if (error) validateName(e.target.value);
        onChange?.(e);
    };

    return (
        <div className="w-full">
            <div className="relative">
                <label
                    className={cn(
                        'absolute left-4 text-muted-foreground transition-all pointer-events-none',
                        isFocused || hasValue ? '-top-7 text-xs px-1' : 'top-1/2 -translate-y-1/2 text-base'
                    )}
                >
                    Nome
                </label>

                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        validateName(e.target.value);
                        props.onBlur?.(e);
                    }}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    className={cn(
                        'w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white dark:bg-background',
                        error && 'border-destructive',
                        className
                    )}
                    aria-invalid={!!error}
                    {...props}
                />
            </div>

            {error && <p className="text-destructive text-xs mt-1.5 ml-0.5">{error}</p>}
        </div>
    );
}

export { InputName };
