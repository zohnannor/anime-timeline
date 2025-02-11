export type Length<T extends readonly unknown[]> = T['length'];

export type Flatten<T, Acc extends unknown[] = []> = T extends readonly [
    infer A extends readonly unknown[],
    ...infer B extends readonly unknown[]
]
    ? Flatten<B, [...Acc, ...A]>
    : Acc;

export type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc['length'] extends N ? Acc : Enumerate<N, [...Acc, number]>;

export type Map<
    Arr extends readonly unknown[],
    Ty,
    Mapped extends readonly unknown[] = []
> = Mapped['length'] extends Arr['length']
    ? Mapped
    : Map<Arr, Ty, [...Mapped, Ty]>;

export type Sub<A extends number, B extends number> = Enumerate<A> extends [
    ...Enumerate<B>,
    ...infer Rest
]
    ? Rest extends number[]
        ? Rest['length']
        : never
    : never;
