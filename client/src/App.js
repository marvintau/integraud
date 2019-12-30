import React, { useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import RoleBasedRoute from './comps/RoleBasedRoute';
import Login from './comps/Login';
import Logout from './comps/Logout'
import Home from './comps/Home';
import Navbar from './comps/Navbar';
import UserManagement from './comps/UserManagement';
import ProjectManagement from './comps/ProjectManagement';
import ProjectPage from './comps/ProjectPage';
import ConfirmationManagement from './comps/ConfirmationManagement';

import {AuthProvider} from './context/auth';
import {ProjectProvider} from './context/projects';
import {SelectedProjectProvider} from './context/selectedProject';

function App() {

  useEffect(() => {
    const listener = ev => {
      ev.preventDefault()
      ev.stopPropagation();
      let message = '确定离开吗？';
      (ev || window.event).returnValue = message;
      return message
    };
    window.addEventListener('beforeunload', listener);
    return () => {
        window.removeEventListener('beforeunload', listener)
    }
  }, []);

  return <div className="App">
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home}/>
            <RoleBasedRoute path="/logout" component={Logout}/>
            <RoleBasedRoute path="/login" component={Login}/>
            <RoleBasedRoute path="/register" component={Login}/>
            <RoleBasedRoute path="/user-management" component={UserManagement} roles={['supreme', 'governer']}/>
            <RoleBasedRoute path="/project-management" component={ProjectManagement} roles={['supreme', 'governer', 'manager', 'normal']}/>
            <RoleBasedRoute path="/project/:projectName" component={ProjectPage} roles={['supreme', 'governer', 'manager', 'normal']}/>
            <RoleBasedRoute path="/confirmations/:projectName" component={ConfirmationManagement} roles={['supreme', 'governer', 'manager', 'normal']}/>
          </Switch>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  </div>
}

export default App;
