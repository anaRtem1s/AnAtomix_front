// FORMS USE IN REACT

import { useForm } from "react-hook-form"

export default function LoginForm({ onSuccess }) {

    // setError (erreurs backend) 

    const { register, handleSubmit, setError, formState: { errors }, reset } = useForm({

        defaultValues: {
            username: '',
            email: '',
            password: ''
        },

        // Errors appear as user types

        mode: 'onChange'
    });

    // FRONTEND CHECK: NEEDS EITHER USERNAME OR EMAIL (NOT BOTH REQUIRED)

    const validateLoginField = (value, context) => {
        const { email, username } = context.values;
        if (!email && !username) {
            return "Provide an email or a username to log in";
        }
        return true;
    };


    const sendLogin = async (data) => {


        // CALLING EXPRESS WEB API

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            // IF BACKEND REFUSES (= WRONG CREDENTIALS)

            if (!response.ok) {
                setError("password", { message: 'Wrong username, email or password. Go again.' });
                return;
            }

            const result = await response.json();

            // SENT BY EXPRESS (JWT) => SESSION

            localStorage.setItem("token", result.token);

            localStorage.setItem("account", JSON.stringify(result.account));

            //! NOTIFYING App.jsx to update State & Switch Screen => This passes the user data up so the Header can show the Logout button.

            if (onSuccess) {
                onSuccess(result.account, result.token);
            }

            // CLEANING FORM FIELDS

            reset();


        } catch (error) {

            // SERVER UNREACHABLE --> USER NOTIFIED - ERROR

            setError("password", { message: '💥 Server is unreachable sorry, try again later 🦝' });

        }
    }

    return (
        <div>
            <h2 id="login-form">Login</h2>
            <form
                onSubmit={handleSubmit(sendLogin)}
                className="form-layout-container"
            >
                <fieldset>
                    <legend id="login-heading">Log in to your account (username or email):</legend>

                    {/* USERNAME - OPTIONAL IF EMAIL */}

                    <div className="form-row-container">
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username" type="text"
                            aria-describedby={errors.username ? "login-username-error" : undefined}
                            {...register('username', {
                                validate: (value, form) => {
                                    if (!value && !form.email) {
                                        return 'Provide an email or a username';
                                    }
                                    return true;
                                }
                            })}
                        />
                        {errors.username && <span id="login-username-error" className="alert-message" role="alert">{errors.username.message}</span>}
                    </div>

                    {/* EMAIL - OPTIONAL IF USERNAME */}

                    <div className="form-row-container">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email" type="email"
                            aria-describedby={errors.email ? "login-email-error" : undefined}
                            {...register('email',
                                {
                                    pattern:
                                    {
                                        value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                                        message: 'Invalid email format'
                                    },
                                    validate: (value, form) => {
                                        if (!value && !form.username) {
                                            return 'Provide an email or a username';
                                        }
                                        return true;
                                    }
                                })}
                        />
                        {errors.email && <span id="login-email-error" className="alert-message" role="alert">{errors.email.message}</span>}
                    </div>

                    {/* PASSWORD - REQUIRED */}

                    <div className="form-row-container">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password" type="password"
                            aria-describedby={errors.password ? "login-password-error" : undefined}
                            {...register('password',
                                {
                                    required:
                                    {
                                        value: true,
                                        message: 'Required field'
                                    }
                                })}
                        />
                        {errors.password && <span id="login-password-error" className="alert-message" role="alert">{errors.password.message}</span>}
                    </div>

                    {/* SUBMIT LOGIN FORM */}

                    <div className="form-row-container">
                        <button type="submit" className="auth-btn">
                            Login
                        </button>
                    </div>
                </fieldset>

            </form>
        </div>
    )
}
