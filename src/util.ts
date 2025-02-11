import { Enumerate, Map, Sub } from './types';

export const range = <Start extends number, End extends number>(
    start: Start,
    end: End
) =>
    Array.from({ length: end - start }, (_, k) => k + start) as Enumerate<
        Sub<End, Start>
    >;

export const map = <T extends readonly unknown[], U>(
    arr: T,
    fn: (item: T[number], index: number) => U
) => arr.map(fn) as T[number] extends U ? T : Map<T, U>;

export const path = <T extends string>(path: T): `./csm/${T}` =>
    `./csm/${path}`;

export const pad = (n: number) => String(n).padStart(2, '0');

export const sum = <T extends readonly number[]>(arr: T) =>
    arr.reduce((a, b) => a + b, 0);

export const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
};
