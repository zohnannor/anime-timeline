import React from 'react';

export const Link: React.FC<React.ComponentPropsWithoutRef<'a'>> = ({
    href,
    children,
    ...rest
}) => (
    <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        draggable={false}
        {...rest}
    >
        {children}
    </a>
);
