import React from "react";
import uuidv4 from "uuid";

export default (element, setTarget, setTargetId) => {
  const newElement = { ...element };
  let ref;
  switch (element.HTMLTag) {
    case "img": {
      let id = uuidv4();
      newElement.id = id;
      let ref = null;
      newElement.html = (
        <img
          src=""
          key={id}
          id={id}
          alt="userFile"
          ref={(r) => {
            ref = r;
            setTimeout(() => setTarget(r), 100);
            console.log(r);
          }}
          onClick={() => {
            setTarget(ref);
            setTargetId(id);
          }}
        />
      );
      openFileDialog(ref);
      break;
    }
    case "input": {
      let id = uuidv4();
      newElement.id = id;
      let ref = null;
      newElement.html = (
        <Input
          key={id}
          id={id}
          ref={(r) => {
            ref = r;
            setTarget(r);
          }}
          onClick={() => {
            setTarget(ref);
            setTargetId(id);
            ref.focus();
            console.log(ref);
          }}
        />
      );
      break;
    }
    case "div-square": {
      let id = uuidv4();
      newElement.id = id;
      let ref = null;
      newElement.html = (
        <Square
          key={id}
          id={id}
          ref={(r) => {
            ref = r;
            setTarget(r);
          }}
          onClick={() => {
            setTarget(ref);
            setTargetId(id);
            console.log(ref);
          }}
        />
      );
      break;
    }
    default:
      break;
  }
  setElementsTree([...elementsTree, newElement]);
}