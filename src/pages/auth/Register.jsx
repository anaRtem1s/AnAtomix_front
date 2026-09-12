// Cette librairie nous donnes accès à une nouvelle hook useForm() qui nous donne accès à plusieurs propriétés et méthodes
//? - 1) register('nomChamp')
// Permet d'enregistrer un champs pour obtenir sa valeur au submit
//? - 2) handleSubmit(callbackSuccess, callbackFail)
// Méthode qui fait déjà le preventDefault et qui récupère toutes les données du formulaire pour les mettre dans un objet. Elle prend en premier paramètre la fonction à exécuter en cas de formulaire valide et en deuxième, la fonction à exécuter en cas de formulaire invalide
//? - 3) On peut rajouter au register, des validateurs (validators)
// Ca se rajoute en 2ème paramètre du register sous forme d'objet 
// register('nomChamp', { /* validateurs */ })
//? - 4) Afficher les erreurs grâce à formState
// On récupère de formState un objet errors qui contient les éventuelles erreurs du formulaire

import { useForm } from "react-hook-form"

export default function RegisterForm({ onSuccess }) {

    const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

    const passwordErrorMessage = `Your password must contain: 1. Min 8 characters 2. One uppercase letter, 3. One lowercase letter, 4. One digit 5. One special character  [${specialChars}]`;

    // — setError (erreurs backend)

    const { register, handleSubmit, setError, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        //  Pour définir comment la détection d'erreurs se fait. Par défaut c'est onSubmit donc il faudra soumettre le formulaire au moins une première fois pour voir nos messages d'erreur. Si on met onChange les messages vont se déclencher chaque fois qu'on modifie le champ.
        mode: 'onChange'
    });

    // watch surveille la valeur live du champ password

    const passwordValue = watch('password');

    const sendRegistration = async (data) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },

                // on n'envoie que les 3 champs qui existent dans ta table accounts 
                // creationdate / role / is_active sont remplis par la DB 

                body: JSON.stringify({
                    username: data.username, //!TRANSFORMING STRINGS INTO JSON voir si pas redondant ailleurs
                    email: data.email,
                    password: data.password
                })
            });
            // si le backend refuse (doublon username/email uniques ==> erreur Zod du backend, tout ce qu'il renvoie en erreur)

            if (!response.ok) {

                const error = await response.json();

                // setError pose l'erreur du backend SUR LE BON CHAMP —
                // elle s'affiche dans TES {errors.xxx && <span>} existants,
                // sans toucher à une seule ligne de ton JSX
                if (error.field === 'username') {
                    setError("username", { message: 'This username is already taken' });
                } else if (error.field === 'email') {
                    setError("email", { message: 'This email is already registered' });
                } else {
                    setError("confirmPassword", { message: error.message || 'Registration failed' });
                }
                return; // on ne signale PAS le succès si ça a échoué
            }

            reset(); // useForm RESET OF THE FORM

            onSuccess(); // ROUTING : App.jsx redirects to Login page / screen

        } catch (error) {

            // IF SERVER PROBLEM => MESSAGE USER

            setError("confirmPassword", { message: 'Server unreachable sorry, please try again later 🐾' });
        }
    }

    return (
        <div>
            <h1 className="register-form">Register</h1>

            <div>
                <form onSubmit={handleSubmit(sendRegistration)}>

                    {/* REGISTER FORM DATA */}

                    <div>
                        <h3>Please fill in these fields to create an account:</h3>

                        {/* UNIQUE USERNAME*/}

                        <div>
                            <label htmlFor="register-username">Username</label>
                            <input
                                id="register-username" type="text"
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
                            {errors.username && <span>{errors.username.message}</span>}
                        </div>


                        {/* UNIQUE EMAIL*/}

                        <div>
                            <label htmlFor="register-email">Email</label>
                            <input
                                id="register-email" type="email"

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
                            {errors.email && <span>{errors.email.message}</span>}
                        </div>

                        {/* PASSWORD */}

                        <div>
                            <label htmlFor="register-password">Password</label>
                            <input
                                id="register-password" type="password"
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

                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                                            message: passwordErrorMessage
                                        }
                                    })}
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>

                        {/* CONFIRM PASSWORD  */}

                        <div>
                            <label htmlFor="register-confirm-password">Confirm password</label>
                            <input
                                id="register-confirm-password" type="password"
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
                            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                        </div>
                    </div>

                    {/* SUBMIT REGISTER FORM */}

                    <div>
                        <button className="btn">Register</button>
                    </div>

                </form>
            </div >
        </div >
    )
}