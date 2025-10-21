import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';

interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
}

export const Link: React.FC<CustomLinkProps> = ({ children, to, ...props }) => {
  const { setIsNavigating } = useNavigation();

  const handleClick = () => {
    setIsNavigating(true);
  };

  return (
    <RouterLink to={to} onClick={handleClick} {...props}>
      {children}
    </RouterLink>
  );
};

