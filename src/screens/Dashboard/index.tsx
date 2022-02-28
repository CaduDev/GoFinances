import React from 'react';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
} from './styles';

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>        
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/54035838?v=4' }}/>
            <User>
              <UserGreeting></UserGreeting>
              <UserName>Carlos Eduardo</UserName>
            </User>
          </UserInfo>
          <Icon name="power"/>
        </UserWrapper>
      </Header>
    </Container>
  )
}