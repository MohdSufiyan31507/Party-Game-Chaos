type ChaosWheelLogoProps = {
  size?: number;
  className?: string;
};

export function ChaosWheelLogo({ size = 24, className = "" }: ChaosWheelLogoProps) {
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
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="3.5" />
      <path d="M24 7v17L35.8 12.2A16.9 16.9 0 0 0 24 7Z" fill="rgb(var(--color-surge))" />
      <path d="M35.8 12.2 24 24h17A16.9 16.9 0 0 0 35.8 12.2Z" fill="rgb(var(--color-flare))" />
      <path d="M41 24H24l11.8 11.8A16.9 16.9 0 0 0 41 24Z" fill="rgb(var(--color-punch))" />
      <path d="M35.8 35.8 24 24v17A16.9 16.9 0 0 0 35.8 35.8Z" fill="rgb(var(--color-lime))" />
      <path d="M24 41V24L12.2 35.8A16.9 16.9 0 0 0 24 41Z" fill="rgb(var(--color-surge))" />
      <path d="M12.2 35.8 24 24H7A16.9 16.9 0 0 0 12.2 35.8Z" fill="rgb(var(--color-plasma))" />
      <path d="M7 24h17L12.2 12.2A16.9 16.9 0 0 0 7 24Z" fill="rgb(var(--color-punch))" />
      <path d="M12.2 12.2 24 24V7A16.9 16.9 0 0 0 12.2 12.2Z" fill="rgb(var(--color-flare))" />
      <circle cx="24" cy="24" r="5.2" fill="rgb(var(--color-ink))" stroke="currentColor" strokeWidth="2.8" />
      <path
        d="M37.5 5.5v6M34.5 8.5h6M9.5 37.5v5M7 40h5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
