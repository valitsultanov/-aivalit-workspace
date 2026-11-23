import React from 'react';
import {Composition} from 'remotion';
import {Reel, SECONDS} from './Reel';

const N = Math.round(SECONDS * 30);
export const Root: React.FC = () => (
  <>
    <Composition id="XToken" component={Reel} durationInFrames={N} fps={30} width={1080} height={1920} defaultProps={{lang: 'ru' as const}} />
    <Composition id="XTokenEN" component={Reel} durationInFrames={N} fps={30} width={1080} height={1920} defaultProps={{lang: 'en' as const}} />
    <Composition id="XTokenEN60" component={Reel} durationInFrames={N * 2} fps={60} width={1080} height={1920} defaultProps={{lang: 'en' as const}} />
    <Composition id="XTokenLegoEN" component={Reel} durationInFrames={N} fps={30} width={1080} height={1920} defaultProps={{lang: 'en' as const, look: 'lego' as const}} />
    <Composition id="XTokenLego" component={Reel} durationInFrames={N} fps={30} width={1080} height={1920} defaultProps={{lang: 'ru' as const, look: 'lego' as const}} />
  </>
);
