import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logoutHandler = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            dispatch(logout());
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if logout fails on server, clear local state
            dispatch(logout());
        } finally {
            setIsLoggingOut(false);
        }
    }
    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
            onClick={logoutHandler}
            disabled={isLoggingOut}
        >
            {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
  )
}

export default LogoutBtn