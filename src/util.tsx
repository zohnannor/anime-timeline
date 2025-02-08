export const range = (start: number, end = 0) =>
    [...Array(end - start).keys()].map(i => i + start);

const defaultTag = <TValues extends unknown[]>(
    parts: TemplateStringsArray,
    ...values: TValues
) =>
    parts
        .flatMap((part, i) =>
            i < values.length ? [part, String(values[i])] : [part]
        )
        .join('');

export const path = (parts: TemplateStringsArray, ...values: any[]) =>
    `./csm/${defaultTag(parts, ...values)}`;

export const pad = (n: number) => String(n).padStart(2, '0');
