import React, {createContext, useState, useContext} from 'react';

const SelectedProjectContext = createContext({
    project: undefined,
    members: {},
    setProject: () => {},
    setMembers: () => {}
});

const SelectedProjectProvider = ({children}) => {

    const [project, setProject] = useState(undefined);
    const [members, setMembers] = useState({});

    return <SelectedProjectContext.Provider value={{project, members, setProject, setMembers}}>
        {children}
    </SelectedProjectContext.Provider>
}

export {
    SelectedProjectContext,
    SelectedProjectProvider
}