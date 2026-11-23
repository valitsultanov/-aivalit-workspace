import React from 'react';
import {Composition} from 'remotion';
import {Reel, SECONDS} from './Reel';

export const Root: React.FC = () => (
  <>
    <Composition id="XToken" component={Reel} durationInFrames={Math.round(SECONDS * 30)} fps={30} width={1080} height={1920} />
    <Composition id="XToken60" component={Reel} durationInFrames={Math.round(SECONDS * 60)} fps={60} width={1080} height={1920} />
  </>
);
