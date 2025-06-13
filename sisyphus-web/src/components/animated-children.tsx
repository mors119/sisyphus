import { useSpring, animated } from '@react-spring/web';

export const AnimatedChildren = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  const style = useSpring({
    from: { opacity: 0, height: 0 },
    to: {
      opacity: isOpen ? 1 : 0,
      height: isOpen ? 'auto' : 0,
    },
    config: { tension: 250, friction: 30 },
  });

  return <animated.div style={style}>{children}</animated.div>;
};
