import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
export function ThemeToggle({ theme, onToggle }) {
    return (_jsx(Button, { onClick: onToggle, variant: "outline", size: "sm", className: "w-9 h-9 p-0", title: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`, children: theme === 'light' ? (_jsx(Moon, { className: "w-4 h-4" })) : (_jsx(Sun, { className: "w-4 h-4" })) }));
}
