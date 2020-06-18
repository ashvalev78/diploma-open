import React from "react";
import styled from "styled-components";

import * as colors from "../../../../common/constants/colors";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: ${({isMain}) => isMain ? '80px' : '190px'};
  background-color: 'white';
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70px;
  width: 100%;
  /* margin-bottom: 5px; */
  cursor: pointer;
  font-size: 16px;
  color: ${colors.main};
  font-weight: 600;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  background-color: 'white';
  ${({isSelected}) =>
    (isSelected ? `color: white; background-color: ${colors.main}` : '')
  };

  &:hover {
    background-color: ${colors.main};
    color: white;
  }
`;

export default ({ items, clickAction, selectedItem, isMain, isActive}) => {
  return (
    <Wrapper isMain={isMain}>
      {items?.map((item, id) => {
        return (
          <Item
            onClick={() => clickAction(item)}
            key={id}
            isMain={isMain}
            isSelected={selectedItem?.tag === item?.tag}
            isActive={isActive}
          >
            {item?.icon}
            {item.name}
          </Item>
        );
      })}
    </Wrapper>
  );
};
