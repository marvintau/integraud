import React, { useEffect} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';

import RoleBasedRoute from './hooks/role-based-route';
import Login from './comps/Login';
import Logout from './comps/Logout'
import Home from './comps/Home';
import Navbar from './comps/Navbar';
import UserManagement from './comps/UserManagement';
import ProjectManagement from './comps/ProjectManagement';

import {AuthProvider} from './hooks/auth';
import { ProjectProvider } from './hooks/projects';

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
            <RoleBasedRoute exact path="/" component={Home}/>
            <RoleBasedRoute path="/logout" component={Logout}/>
            <RoleBasedRoute path="/login" component={Login}/>
            <RoleBasedRoute path="/register" component={Login}/>
            <RoleBasedRoute path="/user-management" component={UserManagement} roles={['supreme', 'governer']}/>
            <RoleBasedRoute path="/project-management" component={ProjectManagement} roles={['supreme', 'governer']}/>
          </Switch>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  </div>
}

export default App;
