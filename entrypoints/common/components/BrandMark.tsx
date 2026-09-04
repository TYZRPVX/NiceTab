import type { SVGProps } from 'react';

type BrandMarkProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  label?: string;
};

/** A theme-aware NiceTab mark for extension UI. */
export default function BrandMark({ label = 'NiceTab', ...props }: BrandMarkProps) {
  return (
    <svg
      aria-label={label}
      fill="none"
      role="img"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(-1.4 -1.4) scale(1.1)">
        <path
          d="M6.25 11.25V6.5C6.25 5.80964 6.80964 5.25 7.5 5.25H11.7C12.1483 5.25 12.5639 5.49059 12.7875 5.87969L14.0125 8.01094C14.2361 8.40003 14.6517 8.64063 15.1 8.64063H20.5C21.1904 8.64063 21.75 9.20027 21.75 9.89063V11.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
        <path
          d="M3.5 11.25H7.15844C7.5566 11.25 7.93102 11.4402 8.16641 11.7618L9.49609 13.5788C9.73148 13.9005 10.1059 14.0906 10.5041 14.0906H17.4959C17.8941 14.0906 18.2685 13.9005 18.5039 13.5788L19.8336 11.7618C20.069 11.4402 20.4434 11.25 20.8416 11.25H24.5V20.5C24.5 21.8807 23.3807 23 22 23H6C4.61929 23 3.5 21.8807 3.5 20.5V11.25Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
        <path d="M11 18.25H17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
      </g>
    </svg>
  );
}
