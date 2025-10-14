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
> = T extends any ? T & { [K in Exclude<AllKeys, keyof T>]?: never } : never;
