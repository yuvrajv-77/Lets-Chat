import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'

function ProtectedRoutes() {
    // const {authUser, setAuthUser} = useContext(AuthContext);
    // console.log(authUser);
    const userinfo = JSON.parse(localStorage.getItem('userLocalData'))

    if (!userinfo){
        return <Navigate to='/' />
    }
  return (
    <Outlet/>
  )
}

export default ProtectedRoutes