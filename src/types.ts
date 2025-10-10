export type Length<T extends readonly unknown[]> = T['length'];

export type Flatten<
    T,
    Acc extends readonly unknown[] = readonly []
> = T extends readonly [
    infer A extends readonly unknown[],
    ...infer B extends readonly unknown[]
]
    ? Flatten<B, readonly [...Acc, ...A]>
    : Acc;

export type Enumerate<
    N extends number,
    Acc extends readonly number[] = readonly []
> = Acc['length'] extends N ? Acc : Enumerate<N, readonly [...Acc, number]>;

export type Map<
    Arr extends readonly unknown[],
    Ty,
    Mapped extends readonly unknown[] = readonly []
> = Mapped['length'] extends Arr['length']
    ? Mapped
    : Map<Arr, Ty, readonly [...Mapped, Ty]>;

export type Sub<A extends number, B extends number> = Enumerate<A> extends [
    ...Enumerate<B>,
    ...infer Rest
]
    ? Rest extends number[]
        ? Rest['length']
        : never
    : never;

export type Tuple<Ty, N extends number> = Map<Enumerate<N>, Ty>;
