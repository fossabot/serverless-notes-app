import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { element } from "prop-types";

import createStore from "./state";
import { getCurrentUser } from "./util";
import { setValidUser } from "./state/actions/auth-actions";

const store = createStore();
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  window.__APP_STORE__ = store; // eslint-disable-line
}

class Root extends React.Component {
  static propTypes = {
    children: element,
  }

  componentWillMount = async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      store.dispatch(setValidUser(currentUser));
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          {this.props.children}
        </Router>
      </Provider>
    );
  }
}

export default (Component, props = {}) => {
  render(
    <Root>
      <Component {...props} />
    </Root>,
    document.getElementById("root"),
  );
};
