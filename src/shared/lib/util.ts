export type Length<T extends readonly unknown[]> = T['length'];

export type Enumerate<
    N extends number,
    Acc extends readonly number[] = readonly [],
> = Acc['length'] extends N ? Acc : Enumerate<N, readonly [...Acc, number]>;

export type Map<
    Arr extends readonly unknown[],
    Ty,
    Acc extends readonly unknown[] = readonly [],
> =
    Acc['length'] extends Arr['length'] ? Acc
    :   Map<Arr, Ty, readonly [...Acc, Ty]>;

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

export const range = (start: number, end: number) =>
    Array.from({ length: end - start }, (_, idx) => idx + start);

export const map = <T extends readonly unknown[], U>(
    arr: T,
    fn: (_item: T[number], _itx: number) => U,
) => arr.map(fn) as T[number] extends U ? T : Map<T, U>;

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
