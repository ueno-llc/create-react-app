import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  [key: string]: any;
}

export const Link = ({ children, to, ...props }: LinkProps) => (
  <RouterLink to={to} {...props}>
    {children}
  </RouterLink>
);
