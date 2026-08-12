'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface InputProps extends Omit<HTMLMotionProps<'input'>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, id, className = '', value, onChange, placeholder, ...props }, ref) => {
        const inputId = id || React.useId();
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(Boolean(value));

        React.useEffect(() => {
            setHasValue(Boolean(value));
        }, [value]);

        const isFloating = isFocused || hasValue || Boolean(placeholder);

        return (
            <div className="w-full flex flex-col gap-1.5">
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-3.5 text-slate-400 pointer-events-none z-10">
                            {icon}
                        </div>
                    )}

                    <motion.input
                        ref={ref}
                        id={inputId}
                        value={value}
                        onChange={(e) => {
                            setHasValue(Boolean(e.target.value));
                            if (onChange) onChange(e);
                        }}
                        onFocus={(e) => {
                            setIsFocused(true);
                            if (props.onFocus) props.onFocus(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            if (props.onBlur) props.onBlur(e);
                        }}
                        animate={
                            error
                                ? {
                                      x: [0, -6, 6, -4, 4, 0],
                                      transition: { duration: 0.4 },
                                  }
                                : {}
                        }
                        placeholder={label ? undefined : placeholder}
                        className={`w-full bg-slate-900/80 border text-slate-100 rounded-lg text-sm transition-all outline-none duration-200 ${
                            icon ? 'pl-10' : 'pl-3.5'
                        } pr-3.5 ${
                            label ? 'pt-6 pb-2' : 'py-3'
                        } ${
                            error
                                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-slate-800 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700'
                        } ${className}`}
                        {...props}
                    />

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={`absolute pointer-events-none transition-all duration-200 text-xs font-medium ${
                                icon ? 'left-10' : 'left-3.5'
                            } ${
                                isFloating
                                    ? 'top-2 text-[10px] text-cyan-400 font-semibold'
                                    : 'top-3.5 text-slate-400 text-sm'
                            } ${error ? 'text-rose-400' : ''}`}
                        >
                            {label}
                        </label>
                    )}
                </div>

                {error ? (
                    <span className="text-xs text-rose-400 font-medium px-1">{error}</span>
                ) : helperText ? (
                    <span className="text-xs text-slate-400 px-1">{helperText}</span>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
