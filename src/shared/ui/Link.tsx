export const Link: React.FC<React.ComponentPropsWithoutRef<'a'>> = ({
    href,
    children,
    style,
    className,
}) => (
    <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        draggable={false}
        style={style}
        className={className}
    >
        {children}
    </a>
);
