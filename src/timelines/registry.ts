import { typedKeyTuple } from '@shared/lib/util';
import { AOT_TIMELINE } from '@timelines/aot';
import { BERSERK_TIMELINE } from '@timelines/berserk';
import { CSM_TIMELINE } from '@timelines/csm';
import { DEATHNOTE_TIMELINE } from '@timelines/deathnote';
import { EVA_TIMELINE } from '@timelines/eva';
import { FP_TIMELINE } from '@timelines/fp';
import { FRIEREN_TIMELINE } from '@timelines/frieren';
import { HXH_TIMELINE } from '@timelines/hxh';
import { JOJO_TIMELINE } from '@timelines/jojo';
import { JR_TIMELINE } from '@timelines/jr';
import { OPM_TIMELINE } from '@timelines/opm';
import resolveTimeline from '@timelines/resolved';

export const TIMELINE = resolveTimeline({
    csm: CSM_TIMELINE,
    berserk: BERSERK_TIMELINE,
    fp: FP_TIMELINE,
    frieren: FRIEREN_TIMELINE,
    eva: EVA_TIMELINE,
    aot: AOT_TIMELINE,
    opm: OPM_TIMELINE,
    deathnote: DEATHNOTE_TIMELINE,
    jr: JR_TIMELINE,
    hxh: HXH_TIMELINE,
    jojo: JOJO_TIMELINE,
});

export const TITLES = typedKeyTuple(TIMELINE);
