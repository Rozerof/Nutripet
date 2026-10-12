type Props = { size?: number; mood?: 'hello' | 'cheer' }

export default function Mascot({ size = 112, mood = 'hello' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Tu mascota"
    >
      <ellipse cx="60" cy="110" rx="28" ry="6" fill="#12332f" opacity=".1" />
      <path
        d="M60 14C86 14 104 36 104 64C104 92 86 106 60 106C34 106 16 92 16 64C16 36 34 14 60 14Z"
        fill="#f6b93b"
      />
      <path d="M60 16C58 6 68 0 78 4C76 14 68 18 60 16Z" fill="#2f9e6b" />
      <circle cx="46" cy="58" r="5" fill="#12332f" />
      <circle cx="74" cy="58" r="5" fill="#12332f" />
      <circle cx="38" cy="70" r="6" fill="#f08a5d" opacity=".45" />
      <circle cx="82" cy="70" r="6" fill="#f08a5d" opacity=".45" />
      {mood === 'cheer' ? (
        <path d="M46 70Q60 90 74 70Z" fill="#12332f" />
      ) : (
        <path
          d="M48 71Q60 81 72 71"
          fill="none"
          stroke="#12332f"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}