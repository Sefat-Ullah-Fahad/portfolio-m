'use client';

/**
 * React Bits StarBorder — border glow only; children keep existing styles.
 */
const StarBorder = ({
  as: Component = 'button',
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="pointer-events-none absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div className={`relative z-[1] block w-full ${innerClassName}`}>{children}</div>
    </Component>
  );
};

export default StarBorder;
