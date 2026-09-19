import { useForm } from "react-hook-form";

export default function AccountSettings({ account, onNav }) {

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      //! CHECK WHY SOMETIMES APPEAR SOMETIMES NOT (firefox forms settings?)
      username: account.username || "",
      email: account.email || "",
      newPassword: "",
    },
    // ANNOYING THE USER :)
    mode: "onChange",
  });

  // Update USERNAME || EMAIL

  const updateProfile = async (data) => {
    // Check if any field was actually modified
    
    const hasChanges =

      data.username !== account.username || data.email !== account.email;

    if (!hasChanges) {

      alert("No changes made.");

      return;
    }

    try {
      const response = await fetch(`/api/accounts/${account.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username: data.username, email: data.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.field === "username")
          setError("username", { message: error.message });
        else if (error.field === "email")
          setError("email", { message: error.message });
        else setError("root", { message: error.message });
        return;
      }

      alert("Account info updated!");

      reset();

    } catch (error) {

      setError("root", { message: 'Server unreachable sorry, please try again later 🐾' });
    };
  };
    // UPDATE PSSWD

    const updatePassword = async (data) => {
      if (!data.newPassword) return;

      try {
        const response = await fetch(`/api/accounts/${account.id}/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newPassword: data.newPassword,
          }),
        });

        if (!response.ok) {
          const error = await response.json();

          setError("root", { message: error.message });

          return;
        }

        alert("Password updated! ");

        reset();

      } catch (error) {

        setError("confirmPassword", {

          message: "Server unreachable sorry, please try again later 🐾",

        });
      }
    };
  

    return (
      <div>

        {/* <== BACK TO FEEDS BTN */}

        <button onClick={() => onNav("reader")}>← Back to Feeds</button>

        <h1>Account Settings</h1>

        {errors.root && (
          <span style={{ color: "red" }}>{errors.root.message}</span>
        )}

        {/* FORM 1: MODIFY ACCOUNT INFO */}

        <form autoComplete="off" onSubmit={handleSubmit(updateProfile)}>
          <h2>Change your username / email: </h2>

          <div>
            <label htmlFor="username-update"> New username: </label>
            <input
              id="username-update" type="text"
              
              {...register("username", {

                maxLength: 
                {
                  value: 50,
                  message: "This username is too long (max 50 characters), sorry",
                },
              })}
            />
            {errors.username && (
              <span style={{ color: "red" }}>{errors.username.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="email-update">New email: </label>
            <input
              id="email-update" type="email"

              {...register(

                "email",
                {
                  pattern: 
                  {
                    value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                    message: "Invalid email. Go again.",
                  },
                },
              )}
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email.message}</span>
            )}
          </div>

          <button type="submit">Save changes</button>
        </form>

      
        {/* FORM 2: CHANGE PASSWORD */}

        <form onSubmit={handleSubmit(updatePassword)}>

          <h2>Change your password: </h2>

          <div>
            <label htmlFor="password-update">New password: </label>
            <input
              id="password-update"
              type="password"
              {...register("newPassword", 
                {
                minLength: 
                { 
                  value: 8, 
                  message: "Password must contain minimum 8 characters" 
                },
                pattern: 
                {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: "Must include uppercase, lowercase, digit, and special character",
                },
              })}
            />
            {errors.newPassword && (
              <span style={{ color: "red" }}>{errors.newPassword.message}</span>
            )}
          </div>


          <button type="submit">Change password [ and remember it please :) ]</button>
        </form> 
      


        {/* DEACTIVATE ACCOUNT = ADMIN ONLY */}

        <button style={{ background: "#ccc", cursor: "not-allowed" }} disabled>
          Deactivate account ⚠️ (Admin only [= if you're annoying me]) </button>

          {/* //! TO TEST */}

        {/* DELETE ACCOUNT */}

        <button style={{ background: "pink" }}>Delete Account ❌ This is irreversible. </button>
      </div>
    );
}