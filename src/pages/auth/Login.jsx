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
            //! Express sent by Express(JWT) —>  SESSION
            //! Ta garde RequireAuth le lit, le bouton Logout le supprime

            localStorage.setItem("token", result.token);

            localStorage.setItem("user", JSON.stringify(result.user));

            reset();

            onSuccess(); // REDIRECTION MANAGED BY APP + afficher    alert(`Welcome back ${data.username}! Logging you in to this wonderful RSS | Atom Feeds Aggregator`);
            


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
                        <h3>Log in to your account:</h3>

                        {/* USERNAME */}
                        <div>
                            <label htmlFor="login-username">Username</label>
                            <input
                                id="login-username" type="text"
                                {...register('username',
                                    {
                                        required:
                                        {
                                            value: true,
                                            message: 'Required field'
                                        }
                                    })}
                            />
                            {errors.username && <span>{errors.username.message}</span>}
                        </div>

                        {/* EMAIL */}

                        <div>
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email" type="email"
                                {...register('email',
                                    {
                                        required:
                                        {
                                            value: true,
                                            message: 'Required field'
                                        },
                                        pattern:
                                        {
                                            value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                                            message: 'Invalid email format'
                                        }
                                    })}
                            />
                            {errors.email && <span>{errors.email.message}</span>}
                        </div>
                    </div>

                    {/* PASSWORD */}

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


