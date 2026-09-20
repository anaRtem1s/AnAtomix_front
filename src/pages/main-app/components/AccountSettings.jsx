import { useForm } from "react-hook-form";

export default function AccountSettings({ account, onNav }) {

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setError: setProfileError,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      //? CHECK WHY APPEARS  (BROWSER forms settings?)
      username: account.username || "",
      email: account.email || "",
    },
    // ANNOYING THE USER :)
    mode: "onChange",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    defaultValues: {
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
          setProfileError("username", { message: error.message });
        else if (error.field === "email")
          setProfileError("email", { message: error.message });
        else setProfileError("root", { message: error.message });
        return;
      }

      alert("Account info updated!");
      resetProfile();
    } catch (error) {
      setProfileError("root", { message: 'Server unreachable sorry, please try again later 🐾' });
    }
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
        setPasswordError("root", { message: error.message });
        return;
      }

      alert("Password updated! ");
      resetPassword();
    } catch (error) {
      setPasswordError("root", {
        message: "Server unreachable sorry, please try again later 🐾",
      });
    }
  };

  return (
    <div className="cpage-container">

      {/* <== BACK TO FEEDS BTN */}
      <button 
        onClick={() => onNav("reader")}
        title="Back to feeds dashboard list view"
      >
        🢦 Back to Feeds
      </button>

      <h1>Account Settings</h1>

      {profileErrors.root && (
        <span className="alert-message" role="alert">{profileErrors.root.message}</span>
      )}
      {passwordErrors.root && (
        <span className="alert-message" role="alert">{passwordErrors.root.message}</span>
      )}

      {/* FORM 1: MODIFY ACCOUNT INFO */}
      <form autoComplete="off" onSubmit={handleProfileSubmit(updateProfile)}>
    
        <fieldset>
          <legend>Change your username / email: </legend>

          <div>
            <label htmlFor="username-update"> New username: </label>
            <input
              id="username-update" 
              type="text"
              aria-describedby={profileErrors.username ? "username-error-desc" : undefined}
              {...registerProfile("username", {
                maxLength: {
                  value: 50,
                  message: "This username is too long (max 50 characters), sorry",
                },
              })}
            />
            {profileErrors.username && (
              <span id="username-error-desc" className="alert-message" role="alert">{profileErrors.username.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="email-update">New email: </label>
            <input
              id="email-update" 
              type="email"
              aria-describedby={profileErrors.email ? "email-error-desc" : undefined}
              {...registerProfile("email", {
                pattern: {
                  value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+\$/,
                  message: "Invalid email. Go again.",
                },
              })}
            />
            {profileErrors.email && (
              <span id="email-error-desc" className="alert-message" role="alert">{profileErrors.email.message}</span>
            )}
          </div>

          <button type="submit">Save changes</button>
        </fieldset>
      </form>

      {/* FORM 2: CHANGE PASSWORD */}
      <form onSubmit={handlePasswordSubmit(updatePassword)}>

        <fieldset>
          <legend>Change your password: </legend>

          <div>
            <label htmlFor="password-update">New password: </label>
            <input
              id="password-update"
              type="password"
              aria-describedby={passwordErrors.newPassword ? "password-error-desc" : undefined}
              {...registerPassword("newPassword", {
                minLength: { 
                  value: 8, 
                  message: "Password must contain minimum 8 characters" 
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}\$/,
                  message: "Must include uppercase, lowercase, digit, and special character",
                },
              })}
            />
            {passwordErrors.newPassword && (
              <span id="password-error-desc" className="alert-message" role="alert">{passwordErrors.newPassword.message}</span>
            )}
          </div>

          <button type="submit">Change password [ and remember it please :) ]</button>
        </fieldset>
      </form> 

      <section aria-labelledby="admin-actions-heading">
        <h2 id="admin-actions-heading">Administrative Controls</h2>

        {/* DEACTIVATE ACCOUNT = ADMIN ONLY */}
        
        <button 
          className="btn-disabled"
          disabled
          aria-disabled="true"
        >
          Deactivate account ⚠️ (Admin only [= if you're annoying me]) 
        </button>

        {/* //! TO TEST */}

        {/* DELETE ACCOUNT */}
      
        <button className="btn-danger">
          Delete Account 💣 (This is irreversible).
        </button>
      </section>
    </div>
  );
}
