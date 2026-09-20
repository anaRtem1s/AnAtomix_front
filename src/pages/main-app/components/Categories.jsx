import React, { useState, useEffect } from 'react';

export default function Categories({ onNav }) {

  // Setup our state variables for the data, loading state, and errors
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CREATING NEW CATEGORY STATE

  const [newCategoryTitleInput, setNewCategoryTitleInput] = useState("");

  // STATE TO TRACK WHICH CATEGORY ROW UNIQUE ID IS ACTIVE FOR THE INLINE EDITING MODE

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryTitleInput, setEditingCategoryTitleInput] = useState("");

  // CONNECTS TO THE BACKEND ENDPOINT TO FETCH DATABASE ROWS

  const handleLoadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the token stored during login
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error("You must be logged in to see categories!");
      }

      // Send the request to your Express server port 8081
      const response = await fetch('http://localhost:8081/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Sends your JWT token to your backend auth middleware
        }
      });

      const data = await response.json();

      // If the backend returned an error status (like 401 or 500), stop here
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Save the database array directly into our React state
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. This automatically runs our fetch function once the component mounts onto the screen
  useEffect(() => {
    handleLoadCategories();
  }, []);

  // CREATE A CATEGORY FOR THIS ACCOUNT

  const handleCreateCategory = async (eventObject) => {
    eventObject.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newCategoryTitleInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not create category, sorry');
      }

      setNewCategoryTitleInput("");
      handleLoadCategories();

    } catch (err) {
      setError(err.message);
    }
  };

  // DELETES A CATEGORY BY ID FOR THIS ACCOUNT

  const handleDeleteCategory = async (categoryId) => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete category');
      }

      handleLoadCategories();

    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATES AN EXISTING CATEGORY TITLE 

  const handleUpdateCategory = async (categoryId) => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingCategoryTitleInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not update category title, sorry');
      }

      // CLOSE EDIT MODE FOR ROW AND FORCE INTERFACE SYNCHRONIZATION

      setEditingCategoryId(null);
      setEditingCategoryTitleInput("");
      handleLoadCategories();

    } catch (err) {
      setError(err.message);
    }
  };

  //! UNLOCKS THE INLINE EDIT MODE CONTAINER CONTROLS FOR A SELECTION

  const handleStartEditRow = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryTitleInput(category.title);
  };


  return (
    <div>
      <button onClick={() => onNav("reader")}>🢦 Back to Feeds</button>

      <h2>Categories</h2>

      {/* CREATE SUBMISSION FORM PANEL GROUP */}
      
      <form onSubmit={handleCreateCategory}>
        <h3>Create a new category:</h3>
        <label htmlFor="new-category-input">Category name:</label>
        <input
          id="new-category-input"
          type="text"
          placeholder="Ex.: Van Life"
          value={newCategoryTitleInput}
          onChange={(eventElement) => setNewCategoryTitleInput(eventElement.target.value)}
          required
        />
        <button type="submit">Add Category</button>
      </form>

      {loading && <p>🔄 Fetching data from database...</p>}
      {error && <p>💔 {error}</p>}

      <ul style={{ marginTop: '20px' }}>
        {categories.map((category) => (
          <li key={category.id} style={{ margin: '15px 0', fontSize: '18px' }}>

            {/* CONDITIONAL COMPONENT CHECK SWITCHES BETWEEN NORMAL VIEW OR INLINE EDIT FORM */}
            {editingCategoryId === category.id ? (
              <div>
                <input
                  type="text"
                  value={editingCategoryTitleInput}
                  onChange={(eventElement) => setEditingCategoryTitleInput(eventElement.target.value)}
                  required
                />
                <button onClick={() => handleUpdateCategory(category.id)}>Save</button>
                <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                💭 <strong>{category.title}</strong>

                {/* INTERACTIVE COMPONENT ROW UTILITIES BUTTON ACTIONS */}

                <button onClick={() => handleStartEditRow(category)}>
                  ❤️ Edit
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  💣 Delete
                </button>
              </div>
            )}

          </li>
        ))}
      </ul>

      {categories.length === 0 && !loading && !error && (
        <p>You don't have any categories yet!</p>
      )}
    </div>
  );
}
