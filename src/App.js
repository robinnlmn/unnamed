import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./unnamed/Home"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>

          <Route path="/chat/:id">
            
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;