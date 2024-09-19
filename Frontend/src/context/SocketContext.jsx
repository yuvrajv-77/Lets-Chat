import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

function SocketContextProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useContext(AuthContext);

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:6001", {
                query: {
                    userId: authUser._id,
                    username: authUser.name
                }
            });
            socket.emit('setup', authUser._id);
            // setSocket(newSocket);
            socket.on("connect", () => {
                setSocket(socket);
            });

            socket.on('onlineUsers',(users) => {
                setOnlineUsers(users);
                console.log("online users ", users);
                
            })
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketContextProvider;