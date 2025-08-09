import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';
import ConfirmModal from '../ConfirmModal';
import { useToast } from '../../hooks/useToast';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleLogoutClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            dispatch(logout());
            showSuccess("You have been successfully logged out!");
            // Redirect to login page after successful logout
            setTimeout(() => {
                navigate('/login');
            }, 1000); // Small delay to show the success message
        } catch (error) {
            console.error("Logout failed:", error);
            showError("Logout failed, but you have been signed out locally.");
            // Even if logout fails on server, clear local state and redirect
            dispatch(logout());
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } finally {
            setIsLoggingOut(false);
            setShowConfirmModal(false);
        }
    };

    const handleCancelLogout = () => {
        setShowConfirmModal(false);
    };
    return (
        <>
            <button
                className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
            >
                {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout?\n\nYou will be redirected to the login page and will need to sign in again to access your account."
                confirmText="Yes, Logout"
                cancelText="Cancel"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                isLoading={isLoggingOut}
            />
        </>
  )
}

export default LogoutBtn