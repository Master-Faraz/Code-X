/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { CalendarIcon, Eye, EyeOff } from 'lucide-react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp';

// Date Picker dependancy
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup } from './ui/radio-group';
import { Label } from './ui/label';


// TODO add fields like select when required 

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  SEARCH = 'search',
  OTP = 'otp',
  DATE_Picker = "datePicker",
  SELECT = "select",
  CHECKBOX = 'checkbox',
  RADIO = "radio",
  CHECKBOX_HIDDEN = "checkboxHidden"
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className={`flex rounded-md border hover:shadow-xl transition ease-in-out duration-400 `}>
          {props.iconSrc && <Image src={props.iconSrc} height={24} width={24} alt={props.iconAlt || 'icon'} className="ml-2" />}

          {!props.iconSrc && props.name === 'email' && (
            <div className="flex items-center justify-center ml-2 border-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path
                  d="M4 6L10 12M20 6L14 12M10 12L10.5858 12.5858C11.3668 13.3668 12.6332 13.3668 13.4142 12.5858L14 12M10 12L3.87868 18.1213M14 12L20.1213 18.1213M20.1213 18.1213C20.6642 17.5784 21 16.8284 21 16V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V16C3 16.8284 3.33579 17.5784 3.87868 18.1213M20.1213 18.1213C19.5784 18.6642 18.8284 19 18 19H6C5.17157 19 4.42157 18.6642 3.87868 18.1213"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {!props.iconSrc && props.name === 'username' && (
            <div className="flex items-center justify-center ml-2 border-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
                <path
                  d="M19 21C19 17.6863 16.3137 15 13 15H11C7.68629 15 5 17.6863 5 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          <FormControl>
            <Input
              placeholder={props.placeholder}
              value={field.value ?? ''}
              {...field}
              className="text-sm leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-none text-card-foreground placeholder:text-muted-foreground/70"
              id={props.name}
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SEARCH:
      return (
        <div className={`flex border-none rounded-tl-full rounded-bl-full`}>
          {props.iconSrc && (
            <div className=" flex flex-col items-center justify-center px-2">
              <Image src={props.iconSrc} height={24} width={24} alt={props.iconAlt || 'icon'} className="" />
            </div>
          )}

          <FormControl>
            <Input
              id={props.name}
              placeholder={props.placeholder}
              {...field}
              className="text-[14px] leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-none rounded-tl-full rounded-bl-full hover:bg-muted"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PASSWORD:
      return (
        <div className={`flex rounded-md border hover:shadow-xl transition ease-in-out duration-400 `}>
          {props.iconSrc && <Image src={props.iconSrc} height={24} width={24} alt={props.iconAlt || 'icon'} className="ml-2" />}

          {!props.iconSrc && (props.name === 'password' || props.name === 'confirmPassword') && (
            <div className="flex items-center justify-center ml-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z" />
              </svg>
            </div>
          )}

          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={showPassword ? 'text' : 'password'}
              className="text-[14px] leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-0 text-card-foreground placeholder:text-muted-foreground "
              id={props.name}
            />
          </FormControl>
          <button type="button" className=" px-1" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} className="text-muted-foreground hover:cursor-pointer" />
            ) : (
              <Eye size={20} className="text-muted-foreground hover:cursor-pointer" />
            )}
          </button>
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            id={props.name}
            placeholder={props.placeholder}
            {...field}
            value={field.value ?? ''}
            className="border-input focus-visible:ring-0 focus-visible:ring-offset-0 h-[100px] text-card-foreground placeholder:text-muted-foreground"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.OTP:
      return (
        <FormControl className='text-card-foreground '>
          <InputOTP maxLength={6} {...field} className="w-full">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
      );

    case FormFieldType.DATE_Picker:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              captionLayout="dropdown"

            />
          </PopoverContent>
        </Popover>
      )

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX_HIDDEN:
      return (
        <FormItem
          className={
            cn(
              "flex items-center justify-start p-3 rounded-lg border transition-all duration-150 cursor-pointer select-none",
              field.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted/50"
            )
          }
        >
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              className="hidden"
              id={props.name}
            />
          </FormControl>

          {/* Label or custom content */}
          <Label
            htmlFor={props.name}
            className="flex items-center gap-2 w-full cursor-pointer"
          >
            <span className="text-xl">{props.iconSrc}</span>
            <span className="text-sm font-medium">{props.label}</span>

          </Label>
        </FormItem >
      );


    case FormFieldType.RADIO:
      return (
        <FormControl>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
          >
            {props.children}
          </RadioGroup>
        </FormControl>
      );


    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, className } = props;

  if (props.fieldType === FormFieldType.CHECKBOX_HIDDEN) {
    return (
      <FormField
        control={control}
        name={name}

        render={({ field }) => (
          <RenderInput field={field} props={props} />
        )
        }
      />
    )
  }

  return (
    <FormField
      control={control}
      name={name}

      render={({ field }) => (
        < FormItem className={`${className}`}>
          {label && <FormLabel className="text-card-foreground">{label}</FormLabel>}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-destructive" />
        </FormItem>
      )
      }
    />
  );
};

export default CustomFormField;
