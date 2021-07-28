import './App.css'
import Login from './Login';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Home from './Home'
import Room from './Room';


function App () {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/room/:id">
          <Room />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>


  );
}

export default App;
