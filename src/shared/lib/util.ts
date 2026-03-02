export type Length<T extends readonly unknown[]> = T['length'];

export type Enumerate<
    N extends number,
    Acc extends readonly number[] = readonly [],
> = Acc['length'] extends N ? Acc : Enumerate<N, readonly [...Acc, number]>;

type Map<Arr extends readonly unknown[], Ty> =
    Arr extends readonly [infer _Head, ...infer Tail] ?
        readonly [Ty, ...Map<Tail, Ty>]
    : Arr extends readonly [] ? readonly []
    : readonly Ty[];

export type Tuple<Ty, N extends number> = Map<Enumerate<N>, Ty>;

export type ExactUnion<
    T,
    AllKeys extends PropertyKey = T extends unknown ? keyof T : never,
> =
    T extends unknown ? T & Partial<Record<Exclude<AllKeys, keyof T>, never>>
    :   never;

export type Add<A extends number, B extends number> = [
    ...Tuple<number, A>,
    ...Tuple<number, B>,
]['length'];

export type StructOfArrays<T> = {
    [K in keyof T]: readonly T[K][];
};

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

const notEmpty = <T>(arr: readonly T[]): arr is NonEmptyArray<T> =>
    arr.length > 0;

const throwError = (message: string): never => {
    throw new Error(message);
};

export const asNonEmpty = <T>(
    arr: readonly T[],
    name: string,
): NonEmptyArray<T> =>
    notEmpty(arr) ? arr : throwError(`Expected non-empty array ${name}`);

export const range = (start: number, end: number) =>
    Array.from({ length: end - start }, (_, idx) => idx + start);

export const map = <T extends readonly unknown[], U>(
    arr: T,
    fn: (_item: T[number], _idx: number) => U,
) => arr.map(fn) as unknown as Map<T, U>;

export const pad = (n: number) => String(n).padStart(2, '0');

export const sum = (arr: readonly number[]) =>
    arr.reduce((acc, x) => acc + x, 0);

export const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

export const isMobileDevice = () =>
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.matchMedia('(pointer: coarse)').matches;

export const getDocumentPosition = (element: HTMLElement) => {
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = element;

    while (current) {
        x += current.offsetLeft + current.clientLeft;
        y += current.offsetTop + current.clientTop;
        current = current.offsetParent as HTMLElement | null;
    }

    return { x, y, width: element.offsetWidth };
};

export const typedEntries = <T extends object>(obj: T) =>
    Object.entries(obj) as [keyof T, NonNullable<T[keyof T]>][];

export const typedFromEntries = <K extends PropertyKey, T>(
    obj: Iterable<readonly [K, T]>,
) => Object.fromEntries(obj) as Record<K, T>;

export const typedValues = <T extends object>(obj: T) =>
    Object.values(obj) as NonNullable<T[keyof T]>[];

export const typedKeys = <T extends object>(obj: T) =>
    Object.keys(obj) as (keyof T)[];
