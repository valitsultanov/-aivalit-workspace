import React from 'react';
import {Composition} from 'remotion';
import {Sketch} from './Sketch';
export const Root: React.FC = () => (
  <>
    <Composition id="CoachSketch" component={Sketch} durationInFrames={90} fps={30} width={1080} height={1920} />
  </>
);
