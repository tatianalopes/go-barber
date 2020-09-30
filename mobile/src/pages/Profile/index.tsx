import React from 'react';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';

const Profile: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container></Container>
  )
};

export default Profile;
