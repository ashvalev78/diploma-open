import React from 'react';
import styled from 'styled-components';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar } from '@material-ui/core';

import * as colors from '../../constants/colors';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: ${colors.main};
  color: white;
`;

const Name = styled.h1`
  font-size: 32px;
  margin: 0;
`;

export default ({name, initials}) => {
  return (
    <Wrapper>
      {/* <ExitToAppIcon /> */}
      <Name>{name || "Название проекта"}</Name>
      {/* <Avatar>{initials || ""}</Avatar> */}
    </Wrapper>
  );
}