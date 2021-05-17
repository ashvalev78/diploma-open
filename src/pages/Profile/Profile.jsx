import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../../common/components/Header/Header";
import { Input, Button } from "@material-ui/core";
import { setCurrentProject, setProjects } from "../../store/actions";
import * as colors from "../../common/constants/colors";

// import ChildComponent from './components/ChildComponent.jsx';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const ProjectsContainer = styled.div`
  padding: 55px 25px;
  display: flex;
  flex-wrap: wrap;
`;

const ProjectBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 280px;
  margin-right: 80px;
  margin-bottom: 25px;
  color: white;
  font-size: 28px;
  font-weight: bold;
  background-color: ${colors.main};
  border-radius: 10px;
  cursor: pointer;
`;

const AddProjectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 190px;
  height: 75px;
  background-color: ${colors.main};
  color: white;
  margin-left: 25px;
  cursor: pointer;

  border-radius: 10px;
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

const Popup = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  ${({ isVisible }) => (isVisible ? "" : "display: none;")}
`;

const mapStateToProps = (state) => ({
  store: state,
});

export default connect(mapStateToProps)(({ dispatch, store }) => {
  let history = useHistory();
  const [popup, setPopup] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");

  // React.useEffect(() => {
  //   if (!store.accessToken) {
  //     history.push("/");
  //   } else {
  //     const body = JSON.stringify({
  //       accessToken: store.accessToken,
  //       username: store.username,
  //     });
  //     fetch("http://localhost:8080/api/user/getProjects", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json;charset=utf-8",
  //       },
  //       body,
  //     }).then(async (response) => {
  //       let data = await response.json();
  //       dispatch(setProjects("SET_PROJECTS", data.projects));
  //     });
  //   }
  // }, []);

  const setCurrentProject = (project) => {
    const body = JSON.stringify({
      accessToken: store.accessToken,
      username: store.username,
      projectId: project._id
    });
    fetch("http://localhost:8080/api/user/getProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body,
    }).then(async (response) => {
      let data = await response.json();
      console.log(data);
      dispatch(setCurrentProject("SET_CURRENT_PROJECT", data.project));
      history.push("/builder");
    });
  };

  const addProject = () => {
    const body = JSON.stringify({
      accessToken: store.accessToken,
      username: store.username,
      project: {
        name: projectName,
      },
    });
    fetch("http://localhost:8080/api/user/addProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body,
    }).then(async (response) => {
      let data = await response.json();
      console.log(data);
      dispatch(setProjects("SET_PROJECTS", data.projects));
      setProjectName("");
      setPopup(false);
    });
  };

  return (
    <Wrapper>
      <PopupWrapper isVisible={popup} onClick={() => setPopup(false)} />
      <Popup isVisible={popup}>
        <Input
          placeholder="Название проекта"
          type="text"
          style={{ marginBottom: "15px" }}
          value={projectName}
          onChange={(e) => setProjectName(e.currentTarget.value)}
        />
        <Button
          variant="contained"
          style={{
            backgroundColor: colors.main,
            color: "white",
            width: "100%",
          }}
          // onClick={addProject}
          onClick={() => setTimeout(() => history.push("/builder"), 300)}
        >
          Создать проект
        </Button>
      </Popup>
      <Header name="Профиль" />
      <ProjectsContainer>
        {store.projects.map((project, id) => {
          return (
            <ProjectBlock
              key={id}
              onClick={() => {
                setCurrentProject(project);
              }}
            >
              {project?.name}
            </ProjectBlock>
          );
        })}
        <ProjectBlock
          // onClick={() => {
          //   setCurrentProject(project);
          // }}
        >
          Проект тест
        </ProjectBlock>
      </ProjectsContainer>
      <AddProjectButton onClick={() => setPopup(true)}>
        Добавить проект
      </AddProjectButton>
    </Wrapper>
  );
});
