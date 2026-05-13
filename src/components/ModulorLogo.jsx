export default function ModulorLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
      <path d="M5 6h10.5L10.25 26H5V6z" fill="white"/>
      <path d="M16.5 6H27v20h-5.25L16.5 6z" fill="white"/>
    </svg>
  )
}
