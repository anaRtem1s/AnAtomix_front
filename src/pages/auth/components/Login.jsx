// FORMS USE IN REACT

import { useForm } from "react-hook-form"

export default function LoginForm({ onSuccess }) {

    // setError (erreurs backend) ajouté

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

            //!! setTimeout(() => window.location.href = '/', 100); // Force reload to trigger fresh auth check


        } catch (error) {

            // SERVER UNREACHABLE --> USER NOTIFIED - ERROR

            setError("password", { message: 'Server is unreachable sorry, try again later 🦝' });

        }
    }

    return (
        <div>
            <h1 className="login-form">Login</h1>

            <div>
                <form onSubmit={handleSubmit(sendLogin)}>

                    <div>
                        <h3>Log in to your account (username OR email):</h3>

                        {/* USERNAME - OPTIONAL IF EMAIL */}

                        <div>
                            <label htmlFor="login-username">Username</label>
                            <input
                                id="login-username" type="text"

                                {...register('username', {

                                    validate: (value, form) => {

                                        if (!value && !form.email) {

                                            return 'Provide an email or a username';
                                        }

                                        return true;
                                    }
                                })}
                            />

                            {/*  TO DUMP */}

                            {/* //      {
                            //             required:
                            //             {
                            //                 value: true,
                            //                 message: 'Required field'
                            //             }
                            //         })}
                            // /> */}

                            {errors.username && <span>{errors.username.message}</span>}
                        </div>

                        {/* EMAIL - OPTIONAL IF USERNAME */}

                        <div>
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email" type="email"
                                {...register('email',
                                    {
                                        //! TO DUMP

                                        // required:
                                        // {
                                        //     value: true,
                                        //     message: 'Required field'
                                        // },
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

                            {errors.email && <span>{errors.email.message}</span>}
                        </div>
                    </div>

                    {/* PASSWORD - REQUIRED */}

                    <div>
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password" type="password"
                            {...register('password',
                                {
                                    required:
                                    {
                                        value: true,
                                        message: 'Required field'
                                    }
                                })}
                        />
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>

                    {/* SUBMIT LOGIN FORM */}

                    <div>
                        <button className="btn">Login</button>
                    </div>

                </form>

            </div >

        </div >
    )
}


