import React from 'react';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const CreatedAppointment: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container></Container>
  )
};

export default CreatedAppointment;
