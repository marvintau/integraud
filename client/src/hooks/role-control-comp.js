import {useState, useEffect} from 'react';
import {useLogin} from './user';

export function roleControlComp (component, allowedRoles){
  const {getUser} = useLogin();

  let {user, role} = getUser();
}