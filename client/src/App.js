import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

import './App.css';

import Home from './components/Home';
import Player from './components/Player';
import Footer from './components/Footer';
import Header from './components/Header';
import Optionscreator from './components/Optionscreator';
import Savedvideos from './components/Savedvideos';
import Savedresult from './components/Savedresult';

function App() {
  return (
    <Router>
      <Header />
      <div className="row pagecontainer">
        <div className="col-2 ">
          <ul className="list-group">
            <Optionscreator
              classname="fa fa-home"
              linkto="/"
              field="Home"
            />
            <Optionscreator
              classname="fa fa-folder"
              linkto="/sf"
              field="Saved Videos"
            />
            <Optionscreator
              classname="fa fa-file-code-o"
              linkto="/sr"
              field="Saved Result"
            />

          </ul>
        </div>
        <div className="col-10">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/sf" component={Savedvideos}></Route>
            <Route exact path="/sr" component={Savedresult}></Route>
            <Route path="/player/:id/:id1" component={Player}></Route>
          </Switch>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

