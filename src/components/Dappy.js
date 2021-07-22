import React from 'react'

import { generateEyeColor, generateStripeColors } from '../utils/dappies.utils';
import Body from './DappyBody';
import Eyes from './DappyEyes';
import Stripes from './DappyStripes';

export default function Dappy({ dna = "FF5A9D.FFE922.60C5E5.0" }) {
  return (
    <svg className="wiggling" width="130" height="130" viewBox="0 0 530 530" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <Body outline="white" />
      <Stripes stripes={generateStripeColors(dna)} />
      <Eyes
        color={generateEyeColor(dna)}
        reflection="white"
        outline="white"
      />
    </svg>
  )
}
