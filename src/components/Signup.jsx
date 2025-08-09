import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import {Button, Input, Logo} from './index'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import { useToast } from '../hooks/useToast'

function Signup() {
    const navigate = useNavigate()
    const { showSuccess } = useToast();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("")
        setLoading(true)

        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const currentUser = await authService.getCurrentUser()
                if(currentUser) {
                    dispatch(login({userData: currentUser}));
                    showSuccess("Account created successfully! Welcome to the blog!");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                } else {
                    setError("Account created but failed to log in. Please try logging in manually.")
                }
            } else {
                setError("Failed to create account. Please try again.")
            }
        } catch (error) {
            console.error("Signup error:", error);

            // Handle specific Appwrite error messages
            let errorMessage = "Failed to create account. Please try again.";

            if (error.message) {
                if (error.message.includes("user_already_exists")) {
                    errorMessage = "An account with this email already exists. Please try logging in.";
                } else if (error.message.includes("password_too_short")) {
                    errorMessage = "Password is too short. Please use at least 8 characters.";
                } else if (error.message.includes("password_too_long")) {
                    errorMessage = "Password is too long. Please use fewer than 256 characters.";
                } else if (error.message.includes("user_email_invalid")) {
                    errorMessage = "Please enter a valid email address.";
                } else if (error.message.includes("user_password_mismatch")) {
                    errorMessage = "Password confirmation does not match.";
                } else if (error.message.includes("too_many_requests")) {
                    errorMessage = "Too many signup attempts. Please wait a moment and try again.";
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
        <div className="flex items-center justify-center w-full min-h-screen py-8">
            <div className={`mx-auto w-full max-w-md sm:max-w-lg bg-white 
                rounded-xl p-6 sm:p-10 border border-gray-200 shadow-lg`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
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
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                     </div>
                </form>
            </div>
        </div>
    )
}

export default Signup