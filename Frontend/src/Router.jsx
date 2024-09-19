import { createBrowserRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

import Layout from "./app/Layout";
import ProtectedRoutes from "./Protected Routes";

const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<Register/>,
        },
        {
            path:"login",
            element:<Login/>,
        },
        {
           element:<ProtectedRoutes/>,
           children:[
            {
                path:"/app",
                element:<Layout/>,
            },
           ]
        },
    ]
)

export default router;