// Cette librairie nous donnes accès à une nouvelle hook useForm() qui nous donne accès à plusieurs propriétés et méthodes
//? - 1) register('nomChamp')
// Permet d'enregistrer un champ pour obtenir sa valeur au submit
//? - 2) handleSubmit(callbackSuccess, callbackFail)
// Méthode qui fait déjà le prevent Default et qui récupère toutes les données du formulaire pour les mettre dans un objet. Elle prend en premier paramètre la fonction à exécuter en cas de formulaire valide et en deuxième, la fonction à exécuter en cas de formulaire invalide
//? - 3) On peut rajouter au register, des validateurs (validators)
// Ca se rajoute en 2ème paramètre du register sous forme d'objet 
// register('nomChamp', { /* validateurs */ })
//? - 4) Afficher les erreurs grâce à formState
// On récupère de formState un objet errors qui contient les éventuelles erreurs du formulaire

import { useForm } from "react-hook-form"

export default function RegisterForm({ onSuccess }) {

    const specialChars = '!"#\$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

    const passwordErrorMessage = `Your password must contain: 1. Min 8 characters 2. One uppercase letter, 3. One lowercase letter, 4. One digit 5. One special character  [${specialChars}]`;

    // ?— setError (backend errors)

    const { register, handleSubmit, setError, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        // ! Pour définir comment la détection d'erreurs se fait. Par défaut c'est onSubmit donc il faudra soumettre le formulaire au moins une première fois pour voir nos messages d'erreur. Si on met onChange les messages vont se déclencher chaque fois qu'on modifie le champ.
        mode: 'onChange'
    });

    //? watch surveille la valeur live du champ "password" (pour qu'il puisse confirmer ce password)

    const passwordValue = watch('password');

    const sendRegistration = async (data) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                //? on n'envoie que les 3 champs qui existent dans ta table accounts 
                //? creationdate / role / is_active sont remplis par la DB 

                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password
                })
            });
            //? si le backend refuse (doublon username/email uniques ==> erreur Zod du backend, tout ce qu'il renvoie en erreur)

            if (!response.ok) {

                const error = await response.json();

                //? setError pose l'erreur du backend SUR LE BON CHAMP —

                if (error.field === 'username') {
                    setError("username", { message: 'This username is already taken' });
                } else if (error.field === 'email') {
                    setError("email", { message: 'This email is already registered' });
                } else {
                    setError("confirmPassword", { message: error.message || 'Registration failed' });
                }
                return; //? on ne signale PAS le succès si ça a échoué
            }

            reset(); // RESET OF FORM FIELDS

            onSuccess(); //! ROUTING : App.jsx redirects to Login page / screen

        } catch (error) {

            // IF SERVER PROBLEM => MESSAGE USER

            setError("confirmPassword", { message: 'Server unreachable sorry, please try again later 🐾' });
        }
    }

    return (
        <div>
            <h1 id="register-form">Register</h1>
            <form
                onSubmit={handleSubmit(sendRegistration)}
                className="form-layout-container"
            >
                <fieldset>
                    <legend id="register-heading">Fill in these fields to create an account:</legend>

                    {/* UNIQUE USERNAME*/}

                    <div className="form-row-container">
                        <label htmlFor="register-username">Username</label>
                        <input
                            id="register-username"
                            type="text"
                            aria-describedby={errors.username ? "register-username-error" : undefined}
                            {...register('username',
                                {
                                    required:
                                    {
                                        value: true,
                                        message: 'Required field'
                                    },
                                    maxLength:
                                    {
                                        value: 50,
                                        message: 'This username is too long, sorry'
                                    }
                                })}
                        />
                        {errors.username && (
                            <span id="register-username-error" className="alert-message" role="alert">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    {/* UNIQUE EMAIL*/}

                    <div className="form-row-container">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            aria-describedby={errors.email ? "register-email-error" : undefined}
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
                                        message: 'Invalid email format. Go again!'
                                    }
                                }
                            )}
                        />
                        {errors.email && (
                            <span id="register-email-error" className="alert-message" role="alert">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* PASSWORD */}

                    <div className="form-row-container">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            aria-describedby={errors.password ? "register-password-error" : undefined}
                            {...register('password',
                                {
                                    required:
                                    {
                                        value: true,
                                        message: 'Required field'
                                    },
                                    pattern:
                                    {
                                        // PSSWD PATTERN REGEX CHECK (WILL BE TRULY VERIFIED BY ZOD IN THE BACKEND):
                                        // - 8 <= CHAR + MAJ + MIN + DIGIT + SPECIAL CHAR
                                        value: /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                                        message: passwordErrorMessage
                                    }
                                })}
                        />
                        {errors.password && (
                            <span id="register-password-error" className="alert-message" role="alert">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD  */}

                    <div className="form-row-container">
                        <label htmlFor="register-confirm-password">Confirm password</label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
                            {...register('confirmPassword',
                                {
                                    required:
                                    {
                                        value: true,
                                        message: 'Required field'
                                    },
                                    validate: (value) =>
                                        // on compare à la main avec le passwordValue de watch plus haut
                                        value === passwordValue ||
                                        'Passwords do not match. Go again!'
                                })}
                        />
                        {errors.confirmPassword && (
                            <span id="register-confirm-password-error" className="alert-message" role="alert">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    {/* SUBMIT REGISTER FORM */}

                    <div className="form-row-container">
                        <button type="submit" className="auth-btn">
                            Register
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
