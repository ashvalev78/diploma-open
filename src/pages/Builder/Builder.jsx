import React from "react";
import styled from "styled-components";
import Moveable from "react-moveable";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";

import ColorLensIcon from "@material-ui/icons/ColorLens";
import TitleIcon from "@material-ui/icons/Title";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import PhotoIcon from '@material-ui/icons/Photo';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import { BlockPicker } from "react-color";
import html2canvas from "html2canvas";

import * as colors from "../../common/constants/colors";

import ElementsSidebar from "./components/LeftSidebar/ElementsSidebar";
import MainSidebar from "./components/LeftSidebar/MainSidebar";
import TopSidebar from "./components/TopSidebar/TopSidebar";
import Header from "../../common/components/Header/Header";

import { setHistory } from "../../store/actions";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100vh;
`;

const BuilderContainer = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
`;

const Workspace = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
`;

const WorkArea = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid ${colors.secondary};
`;

const WorkAreaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const MainPart = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
`;

const ImgPopup = styled.img`
  display: flex;
  position: fixed;
  z-index: 10000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${({ isVisible }) => (isVisible ? "" : "display: none;")}
`;

const PopupWrapper = styled.div`
  background-color: gray;
  position: fixed;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  ${({ isVisible }) => (isVisible ? "" : "display: none;")}
`;

const iconSizes = {
  width: '48px',
  height: '48px'
};

const CATEGORIES = [
  { tag: "image", icon: <PhotoIcon style={iconSizes} />},
  { tag: "text", icon: <TextFieldsIcon style={iconSizes} /> },
  { tag: "figure", icon: <ViewModuleIcon style={iconSizes} /> },
  { tag: "showImg",icon: <PhotoCameraIcon style={iconSizes} /> },
  { tag: "save", icon: <SaveIcon style={iconSizes} /> },
];

const OPTIONS = {
  image: [
    {
      name: "Загрузить изображение",
      HTMLTag: "img",
    },
  ],
  text: [
    {
      name: "Вставить текст",
      HTMLTag: "input",
    },
  ],
  figure: [
    {
      name: "Квадрат",
      HTMLTag: "div-square",
    },
    {
      name: "Круг",
      HTMLTag: "div-circle",
    },
  ],
};

const Square = styled.div`
  width: 50px;
  height: 50px;
  top: 0;
  left: 0;
  border: 1px solid black;
  position: absolute;
`;

const Input = styled.textarea`
  width: 50px;
  height: 20px;
  top: 0;
  left: 0;
  border: none;
  position: absolute;
  outline: none;
  resize: none;
  overflow: hidden;
  background-color: inherit;
`;

const Circle = styled(Square)`
  border-radius: 50%;
`;

// const Image = styled.div`
//   width: 50px;
//   height: 50px;
//   position: absolute;
// `;

const EDITING_OPTIONS = {
  resizable: {
    resizable: true,
    scalable: false,
    warpable: false,
  },
  scalable: {
    resizable: false,
    scalable: true,
    warpable: false,
  },
  warpable: {
    resizable: false,
    scalable: false,
    warpable: true,
  },
};

const FontSizePicker = styled.div`
  padding: 10px;
  border-radius: 5px;
`;

const FontSizeInput = styled.input`
  border: 1px solid ${colors.main};
  border-radius: 5px;
  width: 100%;
  height: 25px;
  padding: 5px 3px;
`;

const mapStateToProps = state => ({
  store: state,
})

export default connect(mapStateToProps)(({dispatch, store}) => {
  const [workAreaRef, setWorkAreaRef] = React.useState(null);
  const [target, setTarget] = React.useState(null);
  const [targetId, setTargetId] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState(CATEGORIES[0]);
  const [selectedTopbarOption, setSelectedTopbarOption] = React.useState(null);
  const [elementsTree, setTree] = React.useState([]);
  const [selectedEditingOption, setSelectedEditingOption] = React.useState(
    EDITING_OPTIONS.resizable
  );
  const [isPopupVisible, setPopupVisibility] = React.useState(false);
  const [isImgPopupVisible, setImgPopupVisibility] = React.useState(false);
  const [imgPopupSrc, setImgPopupSrc] = React.useState("");
  let fileInput = null;
  const [currentZIndex, setCurrentZIndex] = React.useState(1000);
  const [currentHistoryIndex, setCurrentHistoryIndex] = React.useState(0);

  const setElementsTree = (tree, setHisto = false) => {
    localStorage.setItem("ElementsTree", JSON.stringify(tree));
    if (setHisto) {
      if (store.history.length > currentHistoryIndex) {
        dispatch(setHistory("SET_HISTORY", [...store.history.slice(0, currentHistoryIndex + 1), JSON.parse(JSON.stringify(elementsTree))]));
        setCurrentHistoryIndex(currentHistoryIndex + 1);
      } else {
        dispatch(setHistory("SET_HISTORY", [...store.history, JSON.parse(JSON.stringify(elementsTree))]));
        setCurrentHistoryIndex(store.history.length + 1);
      }
    }
    setTree(tree);
  };

  const TOP_SIDEBAR_OPTIONS = [
    {
      name: "Цвет",
      icon: (
        <ColorLensIcon style={{ color: colors.icons, marginRight: "10px" }} />
      ),
      additionalBlock: (
        <BlockPicker
          onChangeComplete={(color) => {
            if (target) {
              target.style.color = color.hex;
            }
          }}
        />
      ),
    },
    {
      name: "Шрифт",
      icon: <TitleIcon style={{ color: colors.icons, marginRight: "10px" }} />,
      additionalBlock: (
        <FontSizePicker>
          <FontSizeInput onChange={(e) => {
            if (target) {
              target.style.fontSize = `${e.currentTarget.value}px`;
            }
          }} />
        </FontSizePicker>
      )
    },
    {
      name: "Заливка",
      icon: (
        <FormatColorFillIcon
          style={{ color: colors.icons, marginRight: "10px" }}
        />
      ),
      additionalBlock: (
        <BlockPicker
          onChangeComplete={(color) => {
            if (target) {
              target.style.backgroundColor = color.hex;
            }
          }}
        />
      ),
    },
    {
      name: "Изменение перспективы",
      icon: (
        <ZoomOutMapIcon style={{ color: colors.icons, marginRight: "10px" }} />
      ),
    },
    {
      name: "Изменение размера",
      icon: (
        <AspectRatioIcon style={{ color: colors.icons, marginRight: "10px" }} />
      ),
    },
  ];

  React.useEffect(() => {
    let tree = JSON.parse(localStorage.getItem("ElementsTree"));
    console.log(tree);
    if (tree) {
      setTree(tree);
    }
  }, []);

  const openFileDialog = (callback) => {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;
        callback(content);
      };
    };
    fileInput.click();
  };

  const deleteElement = (el) => {
    if (el) {
      const newTree = elementsTree.filter(e => e.id !== el.id);
      setTarget(null);
      setElementsTree(newTree, true);
    }
  }

  const handleCreateElement = (element) => {
    const newElement = { ...element };
    switch (element.HTMLTag) {
      case "img": {
        openFileDialog((src) => {
          let id = uuidv4();
          newElement.id = id;
          newElement.matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
          ];
          let ref = null;
          newElement.src = src;
          newElement.html = (
            <img
              src={src}
              key={id}
              id={id}
              // style={{backgroundImage: src}}
              alt="userFile"
              style={{zIndex: currentZIndex}}
              ref={r => {
                ref = r;
                setTimeout(() => setTarget(r), 100);
              }}
              onClick={() => {
                setTarget(ref);
                setTargetId(id);
              }}
            />
          );
          setElementsTree([...elementsTree, newElement], true);
        });
        break;
      }
      case "input": {
        let id = uuidv4();
        newElement.id = id;
        newElement.matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ];
        let ref = null;
        newElement.html = (
          <Input
            key={id}
            id={id}
            ref={(r) => {
              ref = r;
              setTarget(r);
            }}
            style={{zIndex: currentZIndex}}
            onClick={() => {
              setTarget(ref);
              setTargetId(id);
              ref.focus();
            }}
          />
        );
        setElementsTree([...elementsTree, newElement], true);
        break;
      }
      case "div-square": {
        let id = uuidv4();
        newElement.id = id;
        newElement.matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ];
        let ref = null;
        newElement.html = (
          <Square
            key={id}
            id={id}
            ref={(r) => {
              ref = r;
              setTarget(r);
            }}
            style={{zIndex: currentZIndex}}
            onClick={() => {
              setTarget(ref);
              setTargetId(id);
            }}
          />
        );
        setElementsTree([...elementsTree, newElement], true);
        break;
      }
      case "div-circle": {
        let id = uuidv4();
        newElement.id = id;
        newElement.matrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ];
        let ref = null;
        newElement.html = (
          <Circle
            key={id}
            id={id}
            ref={(r) => {
              ref = r;
              setTarget(r);
            }}
            style={{zIndex: currentZIndex}}
            onClick={() => {
              setTarget(ref);
              setTargetId(id);
            }}
          />
        );
        setElementsTree([...elementsTree, newElement], true);
        break;
      }
      default:
        break;
    }
    setCurrentZIndex(currentZIndex + 1);
  };

  const handleOptionClick = (option) => {
    switch (option.tag) {
      case "save": {
        break;
      }
      case "showImg": {
        setTarget(null);
        setTimeout(
          () =>
            html2canvas(workAreaRef).then((canvas) => {
              setImgPopupSrc(canvas.toDataURL("image/png"));
              setPopupVisibility(true);
              setImgPopupVisibility(true);
            }),
          100
        );
        break;
      }
      default: {
        setSelectedOption(option);
        break;
      }
    }
  };

  const addStyleToElementInTree = (target) => {
    if (target) {
      const newTree = [...elementsTree];
      newTree.forEach((el) => {
        if (el.id === targetId) {
          el.style = getElementStyles(target);
          el.value = target.value;
          // el.matrix = target.matrix;
        }
      });
      setElementsTree(newTree, true);
    }
  };

  const getElementStyles = (el) => {
    if (el) {
      const stylesObject = {
        width: el.style.width,
        height: el.style.height,
        transform: el.style.transform,
        backgroundColor: el.style.backgroundColor,
        color: el.style.color,
        fontSize: el.style.fontSize,
        zIndex: el.style.zIndex,
      };

      return stylesObject;
    }
  };

  const handleTopbarOptions = (element) => {
    if (element) {
      setSelectedTopbarOption(
        element.name === selectedTopbarOption ? null : element.name
      );
      if (element.name === 'Изменение размера') {
        changeMode('resizable');
      }
      if (element.name === 'Изменение перспективы') {
        changeMode('warpable');
      }
    }
  };

  const layerClick = (direction) => {
    if (target) {
      switch(direction) {
        case "up": {
          target.style.zIndex = +target.style.zIndex + 1;
          break;
        }
        case "down": {
          target.style.zIndex = +target.style.zIndex - 1;
          break;
        }
        default: break;
      }
    }
  }

  const changeMode = (mode) => {
    switch(mode) {
      case 'resizable': {
        setSelectedEditingOption(EDITING_OPTIONS.resizable);
        break;
      }
      case 'warpable': {
        setSelectedEditingOption(EDITING_OPTIONS.warpable);
        break;
      }
      default: break;
    }
  }

  const undoClick = () => {
    if (currentHistoryIndex - 1 >= 0) {
      setTarget(null);
      setElementsTree(store.history[currentHistoryIndex - 1], false);
      // console.log(store.history);
      // console.log(store.history[currentHistoryIndex - 1]);
      // console.log(currentHistoryIndex - 1);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }

  const redoClick = () => {
    if (currentHistoryIndex + 1 < store.history.length) {
      setTarget(null);
      setElementsTree(store.history[currentHistoryIndex + 1], false);
      // console.log(store.history);
      // console.log(store.history[currentHistoryIndex + 1]);
      // console.log(currentHistoryIndex + 1);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  }

  // let matrix = [
  //   1, 0, 0, 0,
  //   0, 1, 0, 0,
  //   0, 0, 1, 0,
  //   0, 0, 0, 1,
  // ];


  return (
    <Container>
      <PopupWrapper
        isVisible={isPopupVisible}
        onClick={() => {
          setImgPopupVisibility(false);
          setPopupVisibility(false);
        }}
      ></PopupWrapper>
      <ImgPopup
        src={imgPopupSrc}
        isVisible={isImgPopupVisible}
        alt="imgPopup"
      ></ImgPopup>
      <Header name="Новый проект1"></Header>
      <BuilderContainer>
        <TopSidebar
          items={TOP_SIDEBAR_OPTIONS}
          clickAction={handleTopbarOptions}
          selectedTopbarOption={selectedTopbarOption}
          layerClick={layerClick}
          undoClick={undoClick}
          redoClick={redoClick}
          changeMode={changeMode}
          deleteClick={() => deleteElement(target)}
        />
        <MainPart>
          <MainSidebar
            items={CATEGORIES}
            clickAction={handleOptionClick}
            selectedItem={selectedOption}
            isMain={true}
          />
          {selectedOption && (
            <ElementsSidebar
              items={OPTIONS[selectedOption.tag]}
              clickAction={handleCreateElement}
              isMain={false}
            />
          )}
          <Workspace>
            <input
              type="file"
              name="name"
              style={{ display: "none" }}
              ref={(ref) => (fileInput = ref)}
            />
            <WorkAreaWrapper>
              <WorkArea ref={(ref) => setWorkAreaRef(ref)}>
                <Moveable
                  target={target}
                  container={workAreaRef}
                  origin={true}
                  /* Resize event edges */
                  edge={false}
                  /* draggable */
                  draggable={true}
                  throttleDrag={0}
                  onDrag={({
                    target,
                    beforeDelta,
                    beforeDist,
                    left,
                    top,
                    right,
                    bottom,
                    delta,
                    dist,
                    transform,
                    clientX,
                    clientY,
                  }) => {
                    target.style.transform = transform;
                  }}
                  onDragEnd={({ target, isDrag, clientX, clientY }) => {
                    addStyleToElementInTree(target);
                  }}
                  /* When resize or scale, keeps a ratio of the width, height. */
                  keepRatio={false}
                  /* resizable*/
                  /* Only one of resizable, scalable, warpable can be used. */
                  resizable={selectedEditingOption.resizable}
                  throttleResize={0}
                  onResizeStart={({ target, clientX, clientY }) => {
                  }}
                  onResize={({
                    target,
                    width,
                    height,
                    dist,
                    delta,
                    direction,
                    clientX,
                    clientY,
                  }) => {
                    delta[0] && (target.style.width = `${width}px`);
                    delta[1] && (target.style.height = `${height}px`);
                  }}
                  onResizeEnd={({ target, isDrag, clientX, clientY }) => {
                    addStyleToElementInTree(target);
                  }}
                  /* scalable */
                  /* Only one of resizable, scalable, warpable can be used. */
                  scalable={selectedEditingOption.scalable}
                  throttleScale={0}
                  onScale={({
                    target,
                    scale,
                    dist,
                    delta,
                    transform,
                    clientX,
                    clientY,
                  }) => {
                    target.style.transform = transform;
                  }}
                  onScaleEnd={({ target, isDrag, clientX, clientY }) => {
                    addStyleToElementInTree(target);
                  }}
                  /* rotatable */
                  rotatable={true}
                  throttleRotate={0}
                  onRotate={({
                    target,
                    delta,
                    dist,
                    transform,
                    clientX,
                    clientY,
                  }) => {
                    target.style.transform = transform;
                  }}
                  onRotateEnd={({ target, isDrag, clientX, clientY }) => {
                    addStyleToElementInTree(target);
                  }}
                  /* warpable */
                  /* Only one of resizable, scalable, warpable can be used. */
                  /*
                this.matrix = [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ]
                */
                  warpable={selectedEditingOption.warpable}
                  onWarp={({
                    target,
                    clientX,
                    clientY,
                    delta,
                    dist,
                    multiply,
                    transform,
                  }) => {
                    // target.style.transform = transform;
                    const el = elementsTree.find(e => e.id === target.id);
                    let matrix = el.matrix;
                    matrix = multiply(matrix, delta);
                    // const rotate = target.style.transform;
                    // const translate = target.style.transform;
                    // console.log(rotate);
                    el.matrix = matrix;
                    target.style.transform = `matrix3d(${matrix.join(
                      ","
                    )})`;
                  }}
                  onWarpEnd={({ target, isDrag, clientX, clientY }) => {
                    addStyleToElementInTree(target);
                    console.log('yes');
                  }}
                  // Enabling pinchable lets you use events that
                  // can be used in draggable, resizable, scalable, and rotateable.
                  pinchable={true}
                  onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
                    // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
                    addStyleToElementInTree(target);
                  }}
                />
                {elementsTree.map((element) => {
                  switch (element.HTMLTag) {
                    case "img": {
                      let id = element.id;
                      let ref = null;
                      return (
                        <img
                          src={element?.src}
                          key={id}
                          id={id}
                          alt="userFile"
                          ref={(r) => {
                            ref = r;
                          }}
                          onClick={() => {
                            setTarget(ref);
                            setTargetId(id);
                          }}
                          style={element.style}
                        />
                      );
                    }
                    case "input": {
                      let id = element.id;
                      let ref = null;
                      return (
                        <Input
                          key={id}
                          id={id}
                          ref={(r) => {
                            ref = r;
                          }}
                          defaultValue={element.value}
                          onClick={() => {
                            setTarget(ref);
                            setTargetId(id);
                            ref.focus();
                          }}
                          style={element.style}
                        />
                      );
                    }
                    case "div-square": {
                      let id = element.id;
                      let ref = null;
                      return (
                        <Square
                          key={id}
                          id={id}
                          ref={(r) => {
                            ref = r;
                          }}
                          onClick={() => {
                            setTarget(ref);
                            setTargetId(id);
                          }}
                          style={element.style}
                        />
                      );
                    }
                    case "div-circle": {
                      let id = element.id;
                      let ref = null;
                      return (
                        <Circle
                          key={id}
                          id={id}
                          ref={(r) => {
                            ref = r;
                          }}
                          onClick={() => {
                            setTarget(ref);
                            setTargetId(id);
                          }}
                          style={element.style}
                        />
                      );
                    }
                    default:
                      break;
                  }
                  // return React.createElement(element.html.type, element.html.props);
                })}
                {/* <TestBlock ref={(ref) => setTarget(ref)}></TestBlock> */}
              </WorkArea>
            </WorkAreaWrapper>
          </Workspace>
        </MainPart>
      </BuilderContainer>
    </Container>
  );
});