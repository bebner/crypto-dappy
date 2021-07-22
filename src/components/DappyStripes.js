import React from 'react'

export default function Stripes({ stripes }) {
  if (stripes.length === 3) return (
    <g mask="url(#mask0)">
      {/* Stripe 1 */}
      <rect
        x="309.319"
        y="-350.467"
        width="148.78"
        height="1786.53"
        transform="rotate(25.3087 309.319 -350.467)"
        fill={stripes[0]}
      />
      {/* Stripe 2 */}
      <rect
        x="467.605"
        y="-345.085"
        width="161.656"
        height="1941.13"
        transform="rotate(25.3087 467.605 -345.085)"
        fill={stripes[1]}
      />
      {/* Stripe 3 */}
      <rect
        x="666.441"
        y="-387.71"
        width="179.817"
        height="2159.21"
        transform="rotate(25.3087 666.441 -387.71)"
        fill={stripes[2]}
      />
    </g>
  )

  if (stripes.length === 4) return (
    <g mask="url(#mask0)">
      {/* Stripe 1 */}
      <rect
        x="309.319"
        y="-350.467"
        width="148.78"
        height="1786.53"
        transform="rotate(25.3087 309.319 -350.467)"
        fill={stripes[0]}
      />
      {/* Stripe 2 */}
      <rect
        x="467.605"
        y="-345.085"
        width="161.656"
        height="1941.13"
        transform="rotate(25.3087 467.605 -345.085)"
        fill={stripes[1]}
      />
      {/* Stripe 3 */}
      <rect
        x="666.441"
        y="-387.71"
        width="179.817"
        height="2159.21"
        transform="rotate(25.3087 666.441 -387.71)"
        fill={stripes[2]}
      />
      {/* Stripe 4 */}
      <rect
        x="400.332"
        y="136.769"
        width="97.3483"
        height="1168.94"
        transform="rotate(25.3087 617.332 136.769)"
        fill={stripes[3]}
      />
    </g>
  )

  if (stripes.length === 5) return (
    <g mask="url(#mask0)">
      {/* Stripe 1 */}
      <rect
        x="177.809"
        y="-71.1125"
        width="97.0772"
        height="1165.69"
        transform="rotate(25.3087 177.809 -71.1125)"
        fill={stripes[0]}
      />
      {/* Stripe 2 */}
      <rect
        x="265.568"
        y="-29.6123"
        width="97.0772"
        height="1165.69"
        transform="rotate(25.3087 265.568 -29.6123)"
        fill={stripes[1]}
      />
      {/* Stripe 3 */}
      <rect
        x="353.327"
        y="11.8875"
        width="97.0772"
        height="1165.69"
        transform="rotate(25.3087 353.327 11.8875)"
        fill={stripes[2]}
      />
      {/* stripe 4 */}
      <rect
        x="441.086"
        y="53.3879"
        width="97.0772"
        height="1165.69"
        transform="rotate(25.3087 441.086 53.3879)"
        fill={stripes[3]}
      />
      {/* Stripe 5 */}
      <rect
        x="528.846"
        y="94.8882"
        width="97.0772"
        height="1165.69"
        transform="rotate(25.3087 528.846 94.8882)"
        fill={stripes[4]}
      />
    </g>
  )

  return null
}
