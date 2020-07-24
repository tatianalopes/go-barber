import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...othersProps }) => (
  <Container type="button" {...othersProps}>
    {children}
  </Container>
);

export default Button;
