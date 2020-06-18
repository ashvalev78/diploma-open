export const signIn = (type, accessToken, username) => {
  return {
    type,
    accessToken,
    username
  };
};

export const setCurrentProject = (type, projectId) => {
  return {
    type,
    currentProjectId: projectId
  }
}

export const setProjects = (type, projects) => {
  return {
    type,
    projects
  }
}

export const setHistory = (type, history) => {
  return {
    type,
    history
  }
}