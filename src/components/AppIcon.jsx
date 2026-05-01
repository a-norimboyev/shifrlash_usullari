const ICONS = {
  brand: (
    <>
      <rect x='7' y='10' width='11' height='9' rx='2' />
      <path d='M10 10V7a4 4 0 0 1 8 0v3' />
      <circle cx='12.5' cy='14.5' r='1' fill='currentColor' stroke='none' />
    </>
  ),
  caesar: (
    <>
      <rect x='5' y='6' width='14' height='14' rx='3' />
      <path d='M9 11h2M9 15h2M13 11h2M13 15h2M17 8v10' />
    </>
  ),
  rsa: (
    <>
      <circle cx='9' cy='9' r='3' />
      <path d='m11.5 11.5 7 7M8 18l3-3M13 13l3-3' />
    </>
  ),
  a51: (
    <>
      <path d='M12 6v6M8.5 9.5 12 6l3.5 3.5' />
      <path d='M6.5 15.5a7 7 0 0 1 11 0M4 18.5a10 10 0 0 1 16 0' />
      <circle cx='12' cy='18' r='1.2' fill='currentColor' stroke='none' />
    </>
  ),
  vigenere: (
    <>
      <path d='M7 5.5h8l4 4V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2.5Z' />
      <path d='M15 5.5V10h4' />
      <path d='M8.5 13h7M8.5 16h5' />
    </>
  ),
  vernam: <path d='M13 4 7 13h4l-1 7 6-9h-4l1-7Z' />,
  input: (
    <>
      <rect x='5' y='6' width='14' height='12' rx='2' />
      <path d='m7 9 5 4 5-4' />
    </>
  ),
  output: (
    <>
      <rect x='5' y='6' width='14' height='12' rx='2' />
      <path d='M12 9v6M9.5 12.5 12 15l2.5-2.5' />
    </>
  ),
  key: (
    <>
      <circle cx='9' cy='12' r='3' />
      <path d='M12 12h7M16 12v2M18 12v2' />
    </>
  ),
  encrypt: (
    <>
      <rect x='6' y='10' width='12' height='10' rx='2' />
      <path d='M9 10V8a3 3 0 0 1 6 0v2' />
    </>
  ),
  decrypt: (
    <>
      <rect x='6' y='10' width='12' height='10' rx='2' />
      <path d='M15 10V8a3 3 0 0 0-6 0' />
    </>
  ),
  clear: (
    <>
      <path d='M8 8h8M10 8V6h4v2M9 8l.8 10h4.4L15 8' />
    </>
  ),
  info: (
    <>
      <circle cx='12' cy='12' r='8' />
      <path d='M12 11v4M12 8h.01' />
    </>
  ),
  calc: (
    <>
      <rect x='6' y='4.5' width='12' height='15' rx='2' />
      <path d='M9 8h6M9 12h2M13 12h2M9 16h2M13 16h2' />
    </>
  ),
  settings: (
    <>
      <circle cx='12' cy='12' r='2.5' />
      <path d='M12 5.5v2M12 16.5v2M18.5 12h-2M7.5 12h-2M16.6 7.4l-1.4 1.4M8.8 15.2l-1.4 1.4M16.6 16.6l-1.4-1.4M8.8 8.8 7.4 7.4' />
    </>
  ),
  random: (
    <>
      <path d='M7 7h3l7 10h2M17 7h2v2M7 17h3l2.5-3.5' />
    </>
  ),
  frame: (
    <>
      <rect x='6' y='5' width='12' height='14' rx='2' />
      <path d='M9 9h6M9 13h6M9 17h3' />
    </>
  ),
  copy: (
    <>
      <rect x='9' y='7' width='9' height='11' rx='2' />
      <rect x='6' y='10' width='9' height='10' rx='2' />
    </>
  ),
  check: <path d='M7 12.5 10 15.5 17 8.5' />,
  public: (
    <>
      <rect x='6' y='10' width='12' height='10' rx='2' />
      <path d='M15 10V8a3 3 0 0 0-6 0' />
    </>
  ),
  private: (
    <>
      <rect x='6' y='10' width='12' height='10' rx='2' />
      <path d='M9 10V8a3 3 0 0 1 6 0v2' />
    </>
  ),
  alphabet: (
    <>
      <path d='M8 18 12 6l4 12M9.4 14h5.2' />
    </>
  ),
}

export default function AppIcon({ name, className = '', title }) {
  return (
    <span className={`app-icon ${className}`.trim()} aria-hidden={title ? undefined : true} title={title}>
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.9' strokeLinecap='round' strokeLinejoin='round'>
        {ICONS[name] ?? ICONS.info}
      </svg>
    </span>
  )
}