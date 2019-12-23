import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

import UserManagement from './comps/user-management';
import Login from './comps/login';

// export const ControlledRoute = ({ component: Component, roles, ...rest }) => (
//   <Route {...rest} render={props => {
//     const currentUser = authenticationService.currentUserValue;
//     if (!currentUser) {
//       return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//     }

//     if (roles && roles.indexOf(currentUser.role) === -1) {
//       return <Redirect to={{ pathname: '/'}} />
//     }

//     return <Component {...props} />
//   }} />
// )

function Home(){
  return <>
    <div>Yo, welcome home.</div>
    <Link to="/login">Why don't you login?</Link>
  </>
}


function App() {



  return <div className="App">
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Login}/>
        <Route path="/user-management" component={UserManagement}/>
      </Switch>
    </Router>
  </div>
}

export default App;
