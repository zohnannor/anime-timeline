export type Length<T extends readonly unknown[]> = T['length'];

export type Enumerate<
    N extends number,
    Acc extends readonly number[] = readonly []
> = Acc['length'] extends N ? Acc : Enumerate<N, readonly [...Acc, number]>;

export type Map<
    Arr extends readonly unknown[],
    Ty,
    Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Arr['length']
    ? Acc
    : Map<Arr, Ty, readonly [...Acc, Ty]>;

export type Tuple<Ty, N extends number> = Map<Enumerate<N>, Ty>;

export type ExactUnion<
    T,
    AllKeys extends keyof any = T extends any ? keyof T : never
> = T extends any
    ? T & {
          [K in Exclude<AllKeys, keyof T>]?: never;
      }
    : never;

export type Add<A extends number, B extends number> = [
    ...Tuple<number, A>,
    ...Tuple<number, B>
]['length'];

export const range = <Start extends number, End extends number>(
    start: Start,
    end: End
) => Array.from({ length: end - start }, (_, k) => k + start);

export const map = <T extends readonly unknown[], U>(
    arr: T,
    fn: (item: T[number], index: number) => U
) => arr.map(fn) as T[number] extends U ? T : Map<T, U>;

export const pad = (n: number) => String(n).padStart(2, '0');

export const sum = <T extends readonly number[]>(arr: T) =>
    arr.reduce((a, b) => a + b, 0);

export const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
};

export const isMobileDevice = () =>
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.matchMedia('(pointer: coarse)').matches;

export const getDocumentPosition = (element: HTMLElement) => {
    let x = 0;
    let y = 0;
    let current = element;

    while (current) {
        x += current.offsetLeft + current.clientLeft;
        y += current.offsetTop + current.clientTop;
        current = current.offsetParent as HTMLElement;
    }

    return { x, y, width: element.offsetWidth };
};
