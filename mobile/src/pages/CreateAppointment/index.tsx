import React from 'react';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const CreateAppointment: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container></Container>
  )
};

export default CreateAppointment;
