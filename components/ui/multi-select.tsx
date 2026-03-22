'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const safeOptions = Array.isArray(options) ? options : [];

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return safeOptions;
    const query = searchQuery.toLowerCase();
    return safeOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [safeOptions, searchQuery]);

  const handleSelect = (currentValue: string) => {
    if (disabled) return;
    const newValue = value.includes(currentValue)
      ? value.filter((item) => item !== currentValue)
      : [...value, currentValue];
    onChange(newValue);
  };

  const handleRemove = (itemToRemove: string) => {
    if (disabled) return;
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const selectedLabels = value.map((val) => {
    const option = safeOptions.find((opt) => opt.value === val);
    return option?.label || val;
  });

  return (
    <Popover open={open} onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between min-h-10 h-auto', className)}
        >
          <div className='flex flex-wrap gap-1 flex-1 overflow-hidden'>
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='text-xs truncate max-w-full'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) handleRemove(value[index]);
                  }}
                >
                  <span className='truncate'>{label}</span>
                  {!disabled && <X className='ml-1 h-3 w-3 flex-shrink-0' />}
                </Badge>
              ))
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Search by name...'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
