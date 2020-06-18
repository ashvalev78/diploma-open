const reducers = (state = {
  currentProjectId: '',
  projects: [],
  accessToken: '',
  history: [],
}, action) => {
  switch(action.type) {
    case "SIGN_IN": {
      return {
        ...state,
        accessToken: action.accessToken,
        username: action.username
      };
    }
    case "SET_CURRENT_PROJECT": {
      return {
        ...state,
        currentProject: action.currentProject
      }
    }
    case "SET_PROJECTS": {
      return {
        ...state,
        projects: action.projects
      }
    }
    case "SET_HISTORY": {
      return {
        ...state,
        history: action.history
      }
    }
    default: {
      return state;
    }
  }
}

export default reducers;