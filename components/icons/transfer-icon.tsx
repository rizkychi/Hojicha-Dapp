export function TransferIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} bounce`}
    >
      <path d="M17 3L21 7L17 11" />
      <path d="M21 7H13" />
      <path d="M7 21L3 17L7 13" />
      <path d="M3 17H11" />
    </svg>
  )
}
