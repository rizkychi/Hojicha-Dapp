export function FaucetIcon({ className }: { className?: string }) {
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
      <path d="M12 22a8 8 0 0 0 8-8" />
      <path d="M20 10V4a2 2 0 0 0-2-2h-2" />
      <path d="M20 10H8" />
      <path d="M14 14a2 2 0 1 0-4 0v4a2 2 0 1 0 4 0z" />
      <path d="M6 8h2" />
      <path d="M2 8h2" />
      <path d="M5 12v-2" />
      <path d="M5 6v-2" />
    </svg>
  )
}
