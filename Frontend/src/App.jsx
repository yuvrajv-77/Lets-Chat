import router from "./Router"
import Layout from './app/Layout'
import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import SocketContextProvider from "./context/SocketContext"


function App() {


  return (
    <>
      <AuthContextProvider>
        <SocketContextProvider>
          <RouterProvider router={router} />
        </SocketContextProvider>
      </AuthContextProvider>

    </>
  )
}

export default App
