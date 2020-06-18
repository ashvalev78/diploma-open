import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import { Provider } from "react-redux";
import { createStore } from "redux";

import reducers from "./store/reducers";

import Authorization from './pages/Authorization/Auth';
import Builder from './pages/Builder/Builder';
import Profile from './pages/Profile/Profile';

const store = createStore(reducers);

function App() {
  return (
    <Provider store={store}>
      <Router forceRefresh={false}>
        <Switch>
          <Route path="/authorization" exact>
            <Authorization />
          </Route>
          <Route path="/" exact>
            <Builder />
          </Route>
          <Route path="/profile" exact>
            <Profile />
          </Route>
          {/* <Route path="*">
            <ErrorPage />
          </Route> */}
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
