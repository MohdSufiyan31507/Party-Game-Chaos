type ChaosCardLogoProps = {
  size?: number;
  className?: string;
};

export function ChaosCardLogo({ size = 24, className = "" }: ChaosCardLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="11"
        y="9"
        width="25"
        height="32"
        rx="5"
        fill="rgb(var(--color-panel) / 0.16)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="17"
        y="6"
        width="25"
        height="32"
        rx="5"
        fill="rgb(var(--color-surge) / 0.18)"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(9 17 6)"
      />
      <path
        d="M27 14.5 29.8 21l6.7 2.8-6.7 2.8L27 33l-2.8-6.4-6.7-2.8 6.7-2.8L27 14.5Z"
        fill="rgb(var(--color-flare))"
        stroke="rgb(var(--color-flare))"
        strokeLinejoin="round"
      />
      <path
        d="M13 9.5v4M11 11.5h4M39 33v5M36.5 35.5h5"
        stroke="rgb(var(--color-punch))"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 35h9"
        stroke="rgb(var(--color-lime))"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
