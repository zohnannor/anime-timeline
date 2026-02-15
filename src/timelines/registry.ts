import { AOT_TIMELINE } from './aot';
import { BERSERK_TIMELINE } from './berserk';
import { CSM_TIMELINE } from './csm';
import { DEATHNOTE_TIMELINE } from './deathnote';
import { EVA_TIMELINE } from './eva';
import { FP_TIMELINE } from './fp';
import { FRIEREN_TIMELINE } from './frieren';
import { OPM_TIMELINE } from './opm';
import { AnimeTitle, Timeline } from './types';

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
