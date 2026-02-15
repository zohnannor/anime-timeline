import { AOT_TIMELINE } from '@timelines/aot';
import { BERSERK_TIMELINE } from '@timelines/berserk';
import { CSM_TIMELINE } from '@timelines/csm';
import { DEATHNOTE_TIMELINE } from '@timelines/deathnote';
import { EVA_TIMELINE } from '@timelines/eva';
import { FP_TIMELINE } from '@timelines/fp';
import { FRIEREN_TIMELINE } from '@timelines/frieren';
import { OPM_TIMELINE } from '@timelines/opm';
import { AnimeTitle, Timeline } from '@timelines/types';

export const TITLES = [
    'csm',
    'berserk',
    'fp',
    'frieren',
    'eva',
    'aot',
    'opm',
    'deathnote',
] as const;

export const TIMELINE: Record<AnimeTitle, Timeline> = {
    csm: CSM_TIMELINE,
    berserk: BERSERK_TIMELINE,
    fp: FP_TIMELINE,
    frieren: FRIEREN_TIMELINE,
    eva: EVA_TIMELINE,
    aot: AOT_TIMELINE,
    opm: OPM_TIMELINE,
    deathnote: DEATHNOTE_TIMELINE,
};
