import React from "react";
import styled from "styled-components";

import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from '@material-ui/icons/Delete';

import * as colors from "../../../../common/constants/colors";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: ${colors.gray};
  box-shadow: 0 0 10px ${colors.main};
`;

const LeftBlockWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 190px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 35px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background-color: ${colors.third};
  border-radius: 5px;
  margin-left: 10px;

  &:hover {
    background-color: ${colors.main}
  }
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const AdditionalBlockWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  display: ${({selectedTopbarOption, name}) => (selectedTopbarOption === name ? "block" : "none")};
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
`;

export default ({ items, clickAction, selectedTopbarOption, layerClick, undoClick, redoClick, changeMode, deleteClick}) => {
  return (
    <Wrapper>
      <LeftBlockWrapper>
        <UndoIcon onClick={undoClick} style={{cursor: 'pointer', color: colors.icons}}/>
        <RedoIcon onClick={redoClick} style={{cursor: 'pointer', color: colors.icons}}/>
        <ExpandMoreIcon onClick={() => layerClick("down")} style={{cursor: 'pointer', color: colors.icons}}/>
        <ExpandLessIcon onClick={() => layerClick("up")} style={{cursor: 'pointer', color: colors.icons}}/>
        <DeleteIcon onClick={deleteClick} style={{cursor: 'pointer', color: colors.icons}}/>
      </LeftBlockWrapper>
      {items?.map((item, id) => {
        return (
          <Item key={id}>
            <ItemContent onClick={() => clickAction(item)}>
              {item?.icon}
              <span>{item.name}</span>
            </ItemContent>
            <AdditionalBlockWrapper name={item.name} selectedTopbarOption={selectedTopbarOption}>
              {item?.additionalBlock}
            </AdditionalBlockWrapper>
          </Item>
        );
      })}
    </Wrapper>
  );
};
