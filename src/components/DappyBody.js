import React from 'react'

export default function DappyBody({ outline }) {
  return (
    <>
      {/* Body outline */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M530 270.828C530 124.577 411.357 6.01685 265.003 6.01685C118.643 6.01685 0 124.577 0 270.828V409.23C0 474.092 53.1101 527.165 118.023 527.165H411.983C476.89 527.165 530 474.092 530 409.23V270.828Z"
        fill={outline}
      />
      {/* Mask */}
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="39"
        y="55"
        width="455"
        height="446">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M493.04 282.859C493.04 242.218 481.083 84.4307 328.083 60.5287C192.129 39.2851 79.4516 82.0429 50.768 218.31C22.0783 354.577 48.3742 481.28 148.782 493.238C249.196 505.189 277.88 500.407 383.069 495.625C488.258 490.844 493.04 323.499 493.04 282.859Z"
          fill="#FF5A9D"
        />
      </mask>
    </>
  )
}
