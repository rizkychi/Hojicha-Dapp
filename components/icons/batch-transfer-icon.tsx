export function BatchTransferIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 18L12 22L16 18" />
      <path d="M12 2V22" />
      <path d="M2 8H22" />
      <path d="M2 14H22" />
    </svg>
  )
}
