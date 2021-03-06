import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import RoleBasedRoute from './comps/RoleBasedRoute';
import Login from './comps/login';
import Logout from './comps/Logout'
import Home from './comps/Home';
import Navbar from './comps/Navbar';
import UserManagement from './comps/UserManagement';
import ProjectManagement from './comps/ProjectManagement';
import ProjectPage from './comps/ProjectPage';
import ConfirmationManagement from './comps/ConfirmationManagement';

import ConfirmationMobile from './comps/ConfirmationMobile';

import {AuthProvider} from './context/auth';
import {ProjectProvider} from './context/projects';
import {SelectedProjectProvider} from './context/selectedProject';
import {ConfirmationProvider} from './context/confirmation';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {  

  return <div>
    <AuthProvider>
      <ProjectProvider>
        <SelectedProjectProvider>
          <ConfirmationProvider>
          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home}/>
              <RoleBasedRoute path="/logout" component={Logout}/>
              <RoleBasedRoute path="/login" component={Login}/>
              <RoleBasedRoute path="/register" component={Login}/>
              <RoleBasedRoute path="/user-management" component={UserManagement} roles={['supreme', 'governer']}/>
              <RoleBasedRoute path="/project-management" component={ProjectManagement} roles={['supreme', 'governer', 'manager', 'normal']}/>
              <RoleBasedRoute path="/project" component={ProjectPage} roles={['supreme', 'governer', 'manager', 'normal']}/>
              <RoleBasedRoute path="/confirmation-management" component={ConfirmationManagement} roles={['supreme', 'governer', 'manager', 'normal']}/>
              <RoleBasedRoute path='/confirmation-mobile' component={ConfirmationMobile} />
            </Switch>
          </Router>
          </ConfirmationProvider>
        </SelectedProjectProvider>
      </ProjectProvider>
    </AuthProvider>
  </div>
}

export default App;