import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ContextFunction } from '../Context/Context';

const VerifyEmailPage = () => {
    const [message, setMessage] = useState("Verifying your email...");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { loginUser, fetchUserData } = useContext(ContextFunction);

    useEffect(() => {
        let isMounted = true;

        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                if(isMounted) {
                    setMessage("Verification failed: No token found in the URL.");
                    setIsLoading(false);
                }
                toast.error("Verification failed: Token not found.", { theme: 'colored' });
                return;
            }

            try {
                // ** Using REACT_APP_BACKEND_URL from your .env file **
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-email-post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('Authorization', data.authToken);
                    await fetchUserData(data.authToken);
                    
                    if(isMounted) {
                        setMessage("Your email has been successfully verified! Redirecting...");
                    }

                } else {
                    const errorMessage = data.message || 'An unknown error occurred.';
                    if(isMounted) {
                        setMessage(`Verification failed: ${errorMessage}`);
                    }
                    toast.error(`Verification failed: ${errorMessage}`, { theme: 'colored' });
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                console.error("Verification error:", error);
                if(isMounted) {
                    setMessage("Network error. Please try again later.");
                }
                toast.error("Network error during verification.", { theme: 'colored' });
                setTimeout(() => navigate('/login'), 3000);
            } finally {
                if(isMounted) {
                    setIsLoading(false);
                }
            }
        };

        verifyEmail();
        
        return () => {
            isMounted = false;
        };
    }, [searchParams, navigate, fetchUserData]);

    useEffect(() => {
        if (!isLoading && loginUser && loginUser._id) {
            toast.success("Login successful! Welcome to ARISTAYA.", { theme: 'colored' });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    }, [isLoading, loginUser, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4 text-yellow-500">
                    Email Verification
                </h1>
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-12 w-12 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-300 font-semibold text-lg">{message}</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a moment. Thank you for your patience.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                       <p className="mt-4 text-lg font-semibold text-gray-400">Verification Complete. You will be redirected shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
