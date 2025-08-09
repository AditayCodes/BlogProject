import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm} from "react-hook-form"
import { useToast } from '../hooks/useToast'

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showSuccess } = useToast();
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (formData) => {
        setError("")
        setLoading(true)

        try {
            const userData = await authService.login({
                email: formData.email,
                password: formData.password
            })

            if (userData) {
                dispatch(authLogin({userData}));
                showSuccess("Welcome back! You have been successfully logged in.");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setError("Login failed. Please check your credentials and try again.")
            }
        } catch (error) {
            console.error("Login error:", error);

            // Handle specific Appwrite error messages
            let errorMessage = "Login failed. Please try again.";

            if (error.message) {
                if (error.message.includes("Invalid credentials")) {
                    errorMessage = "Invalid email or password. Please check your credentials.";
                } else if (error.message.includes("user_invalid")) {
                    errorMessage = "Invalid email or password. Please check your credentials.";
                } else if (error.message.includes("user_blocked")) {
                    errorMessage = "Your account has been blocked. Please contact support.";
                } else if (error.message.includes("user_not_found")) {
                    errorMessage = "No account found with this email address.";
                } else if (error.message.includes("password_mismatch")) {
                    errorMessage = "Incorrect password. Please try again.";
                } else if (error.message.includes("too_many_requests")) {
                    errorMessage = "Too many login attempts. Please wait a moment and try again.";
                } else {
                    errorMessage = error.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div
            className='flex items-center justify-center w-full min-h-screen py-8'
        >
            <div className={`mx-auto w-full max-w-md sm:max-w-lg bg-white rounded-xl 
                p-6 sm:p-10 border border-gray-200 shadow-lg`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login