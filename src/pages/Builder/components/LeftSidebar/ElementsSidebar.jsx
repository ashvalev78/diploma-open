import React from "react";
import styled from "styled-components";

import * as colors from "../../../../common/constants/colors";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 190px;
  background-color: ${colors.main};
  border-right: 1px solid black;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  color: white;
  font-weight: 600;
  border-bottom: 1px solid black;
  border-left: 1px solid black;

  &:hover {
    background-color: ${colors.third};
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
