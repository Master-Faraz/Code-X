/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  SEARCH = 'search'
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6L10 12M20 6L14 12M10 12L10.5858 12.5858C11.3668 13.3668 12.6332 13.3668 13.4142 12.5858L14 12M10 12L3.87868 18.1213M14 12L20.1213 18.1213M20.1213 18.1213C20.6642 17.5784 21 16.8284 21 16V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V16C3 16.8284 3.33579 17.5784 3.87868 18.1213M20.1213 18.1213C19.5784 18.6642 18.8284 19 18 19H6C5.17157 19 4.42157 18.6642 3.87868 18.1213"
                  stroke="#666666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="text-sm leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 text-[#3d3d3d] border-none"
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
              placeholder={props.placeholder}
              {...field}
              className="text-[14px] leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0  border-none  rounded-tl-full rounded-bl-full hover:bg-slate-300"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PASSWORD:
      return (
        <div className={`flex rounded-md border hover:shadow-xl transition ease-in-out  duration-400`}>
          {props.iconSrc && <Image src={props.iconSrc} height={24} width={24} alt={props.iconAlt || 'icon'} className="ml-2" />}

          {!props.iconSrc && props.name === 'password' && (
            <div className="flex items-center justify-center ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666">
                <path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z" />
              </svg>
            </div>
          )}

          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={showPassword ? 'text' : 'password'}
              className="text-[14px] leading-[18px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-0 text-[#3d3d3d] "
            />
          </FormControl>
          <button type="button" className=" px-1" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} className="text-[#919090] hover:cursor-pointer" />
            ) : (
              <Eye size={20} className="text-[#666666] hover:cursor-pointer" />
            )}
          </button>
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className=" placeholder:text-[#3d3d3d] border-dark-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-[100px] text-white"
            disabled={props.disabled}
          />
        </FormControl>
      );

    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, className } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          {label && <FormLabel className="text-[16px] leading-[18px] font-bold text-[#3d3d3d] ">{label}</FormLabel>}
          <RenderInput field={field} props={props} />

          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
