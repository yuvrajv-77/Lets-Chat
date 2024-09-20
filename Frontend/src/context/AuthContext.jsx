import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

function AuthContextProvider({children}){
    const [authUser,setAuthUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState();
    const [ fetch, setFetch ] = useState('1');
    
    useEffect (() => {
        const userinfo = JSON.parse(localStorage.getItem('userLocalData'))
        setAuthUser(userinfo);
    },[])
    console.log("In Context:- ",authUser);
    return(
        <AuthContext.Provider value={{authUser, setAuthUser,selectedChat, setSelectedChat, fetch, setFetch }}>
            {children}
        </AuthContext.Provider>
    )
}

export {  AuthContextProvider };