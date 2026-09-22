import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AccountSettings({ account, onNav }) {

  // ERRORS HANDLING

  const [profileStatus, setProfileStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);

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

  // UPDATE USERNAME || EMAIL

  const updateUsernameOrEmail = async (data) => {

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

        // BACKEND ERRORS

        const backendMsg = (error.message || "").toLowerCase();
        if (backendMsg.includes("username")) setProfileError("username", { message: error.message });
        else if (backendMsg.includes("email")) setProfileError("email", { message: error.message });
        else setProfileError("root", { message: error.message });
        return;
      }

      setProfileStatus({ type: "success", message: "Account info updated successfully!" });
      resetProfile({ username: data.username, email: data.email });
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

      setPasswordStatus({ type: "success", message: "Password updated successfully!" });
      resetPassword();
    } catch (error) {
      setPasswordError("root", {
        message: "Server unreachable sorry, please try again later 🐾",
      });
    }
  };


  // DELETE ACCOUNT 

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("WARNING: Are you sure you want to delete your account forever? 💣");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/accounts/${account.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Could not delete account.");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("account");
      window.location.reload();
    } catch (error) {
      alert("Server unreachable sorry, please try again later 🐾");
    }
  };

  return (
    <div className="centerpage-container">

      {/* <== BACK TO FEEDS BTN */}

      <button
        onClick={() => onNav("reader")}
        title="Back to feeds dashboard list view"
      >
        🢦 Back to Feeds
      </button>

      <h2>Account Settings</h2>

      {/* ERROR ANCHORS */}

      {profileErrors.root && (
        <span className="alert-message" role="alert">{profileErrors.root.message}</span>
      )}
      {passwordErrors.root && (
        <span className="alert-message" role="alert">{passwordErrors.root.message}</span>
      )}

      {/* ERROR ALERTS TO USER */}

      {profileStatus && (
        <span className={profileStatus.type === "success" ? "success-message" : "alert-message"} role="alert">
          {profileStatus.message}
        </span>
      )}
      {passwordStatus && (
        <span className={passwordStatus.type === "success" ? "success-message" : "alert-message"} role="alert">
          {passwordStatus.message}
        </span>
      )}

      {/* FORM 1: MODIFY ACCOUNT INFO */}

      <form autoComplete="off" onSubmit={handleProfileSubmit(updateUsernameOrEmail)}>

        <fieldset>
          <legend>Change your username / email: </legend>

          <div className="form-row-container">
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

          <div className="form-row-container">
            <label htmlFor="email-update">New email: </label>
            <input
              id="email-update"
              type="email"
              aria-describedby={profileErrors.email ? "email-error-desc" : undefined}
              {...registerProfile("email", {
                pattern: {
                  value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                  message: "Invalid email. Go again.",
                },
              })}
            />
            {profileErrors.email && (
              <span id="email-error-desc" className="alert-message" role="alert">{profileErrors.email.message}</span>
            )}
          </div>

          <div className="form-row-container">
            <button type="submit">Save changes</button>
          </div>
        </fieldset>
      </form>

      {/* FORM 2: CHANGE PASSWORD */}

      <form onSubmit={handlePasswordSubmit(updatePassword)}>

        <fieldset>
          <legend>Change your password: </legend>

          <div className="form-row-container">
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
                  value: /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: "Must include uppercase, lowercase, digit, and special character",
                },
              })}
            />
            {passwordErrors.newPassword && (
              <span id="password-error-desc" className="alert-message" role="alert">{passwordErrors.newPassword.message}</span>
            )}
          </div>

          <div className="form-row-container">
            <button type="submit">Change password [!remember it please 🦝]</button>
          </div>
        </fieldset>
      </form>

      <section aria-labelledby="account-status-admin">

        <h3 id="account-status-admin">Account Status</h3>

        {/* DEACTIVATE ACCOUNT = ADMIN ONLY */}
        <div className="form-row-container">
          <button
            type="button"
            className="btn-disabled"
            disabled
            aria-disabled="true"
          >
            Deactivate account [Admin only=if you annoy me]
          </button>
        </div>

        {/* DELETE ACCOUNT FOREVER */}

        <div className="form-row-container">
          <button
            type="button"
            className="btn-danger"
            onClick={handleDeleteAccount}
          >
            Delete account 💣 [irreversible]
          </button>
        </div>
      </section>
    </div>
  );
}
