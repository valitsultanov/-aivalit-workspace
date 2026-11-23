import React from 'react';
import {Composition} from 'remotion';
import {Sketch} from './Sketch';
import {ClayPump, CLAY_TOTAL} from './ClayPump';
export const Root: React.FC = () => (
  <>
    <Composition id="CoachSketch" component={Sketch} durationInFrames={90} fps={30} width={1080} height={1920} />
    <Composition id="ClayPump" component={ClayPump} durationInFrames={Math.round(CLAY_TOTAL * 30)} fps={30} width={1080} height={1920} defaultProps={{lang: 'ru' as const}} />
    <Composition id="ClayPumpEN" component={ClayPump} durationInFrames={Math.round(CLAY_TOTAL * 30)} fps={30} width={1080} height={1920} defaultProps={{lang: 'en' as const}} />
  </>
);
