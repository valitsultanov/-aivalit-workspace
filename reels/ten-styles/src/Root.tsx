import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reel, REEL_SECONDS} from './Reel';
import {Scene} from './scene/Scene';
import {BASE_STYLE, STYLES} from './scene/styles';

const OneStyle: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const st = i < 0 ? BASE_STYLE : STYLES[i];
  return <AbsoluteFill><Scene t={f / fps} frame={f} st={st} /></AbsoluteFill>;
};

export const Root: React.FC = () => (
  <>
    <Composition id="Explainer" component={Reel} durationInFrames={Math.round(REEL_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{captions: true}} />
    <Composition id="Explainer60" component={Reel} durationInFrames={Math.round(REEL_SECONDS * 60)} fps={60} width={1080} height={1920} defaultProps={{captions: true}} />
    {/* one 3 s clip per style, as in the prompts */}
    <Composition id="Style" component={OneStyle} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{i: 0}} />
  </>
);
