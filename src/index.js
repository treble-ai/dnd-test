import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./assets/scripts/scripts.bundle.js";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { identifyUser } from "./utils/logrocket";

import CreateConversationContainer from "./views/Conversation/CreateConversationContainer";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import logger from "redux-logger";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";

import registerServiceWorker from "./registerServiceWorker";

const middleware = applyMiddleware(thunk, logger);
export const store = createStore(rootReducer, middleware);

const styles = {
  height: "100%",
  position: "absolute",
  overflow: "auto",
  width: "100%",
};

if (window.location.href.includes("onboarding")) {
  styles["background"] = "#121213";
}

function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log("registration", registration);
      }
    });
  }
}

unregister();

const me = JSON.parse(localStorage.getItem("me"));

if (me) {
  console.log("Identifying", me.user_id, me.name, me.email);
  window.Appcues.identify(me.user_id, {
    createdAt: new Date(),
    role: me.role,
    firstName: me.name,
    integrations: me.active_integrations,
    hubspotCompanyId: me.hubspot_company_id,
    onboarding_stage: me.onboarding_stage,
    whatsappProvider: me.whatsapp_provider,
    segment: me.segment,
    companyId: me.id,
    email: me.email,
  });
  identifyUser(me.user_id, me.name, me.email);
}

ReactDOM.render(
  <Provider store={store}>
    <div style={styles}>
      <Router>
        <Switch>
          <Route exact path="/" component={CreateConversationContainer} />
        </Switch>
      </Router>
      <ToastContainer />
    </div>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
