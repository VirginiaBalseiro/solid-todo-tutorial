import React from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import AddTodo from "./components/AddTodo";
import "./App.css";

const authOptions = {
  clientName: "Solid Todo App",
};

function App() {
  const { session } = useSession();
  return (
    <div className="app-container">
      {session.info.isLoggedIn ? (
        <CombinedDataProvider
          datasetUrl={session.info.webId}
          thingUrl={session.info.webId}
        >
          <div className="message logged-in">
            <span>You are logged in as: </span>
            <Text
              properties={[
                "http://xmlns.com/foaf/0.1/name",
                "http://www.w3.org/2006/vcard/ns#fn",
              ]}
            />
            <LogoutButton />
          </div>
          <section>
            <AddTodo />
          </section>
        </CombinedDataProvider>
      ) : (
        <div className="message">
          <span>You are not logged in. </span>
          <LoginButton
            oidcIssuer="https://broker.pod.inrupt.com/"
            redirectUrl={window.location.href}
            authOptions={authOptions}
          />
        </div>
      )}
    </div>
  );
}

export default App;
