import { useState, useEffect } from 'react';

export default function Subscriptions({ onNav }) {

  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH ALL SUBSCRIPTIONS FOR THE LOGGED IN ACCOUNT

  const handleLoadSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong fetching subscriptions, sorry');
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // LOAD THE USER'S OWN CATEGORIES

  const handleLoadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong fetching categories, ');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // SCREEN LOADING

  const handleLoadScreenData = async () => {
    setLoading(true);
    setError(null);
    await handleLoadSubscriptions();
    await handleLoadCategories();
    setLoading(false);
  };

  useEffect(() => {
    handleLoadScreenData();
  }, []);

  // REMOVE AN ACTIVE SUBSCRIPTION 

  const handleUnsubscribe = async (subscriptionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unsubscribe failed, ');
      handleLoadScreenData();
    } catch (err) {
      alert(` 💔 Error: ${err.message}`);
    }
  };

  // SEND PATCH REQUEST TO THE BACKEND UPDATING THE ASSIGNED CATEGORY_ID

  const handleCategorySelectionChange = async (subscriptionId, valueString) => {
    try {
      const token = localStorage.getItem('token');
      
      // IF VALUE IS EMPTY STRING SEND NULL TO SPECIFY UNASSIGNED

      const categoryIdValue = valueString === "" ? null : Number(valueString);

      const response = await fetch(`http://localhost:8081/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: categoryIdValue
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update folder context, ');

      // REFRESH DATA TO RE-SYNC NESTED VALUES NATIVELY

      handleLoadSubscriptions();
    } catch (err) {
      alert(` 💔 Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>My Subscriptions</h2>

      <button onClick={() => onNav("reader")}>← Back to Feeds</button>

      {loading && <p role="status">Loading subscriptions list data...</p>}
      {error && <p role="alert"> 💔 {error}</p>}

      <ul>
        {subscriptions.map((subscription) => {
          const feedSource = subscription.feed_source || subscription.feedSource;
          if (!feedSource) return null;

          return (
            <li key={subscription.id}>
              <div>
                🚀 <strong>{feedSource.title}</strong> ({feedSource.feed_type})
                <br />
                <small>URL: {feedSource.feed_url}</small>
              </div>

              {/* DROP DOWN SELECTOR ASSIGNS OR UPDATES CATEGORY RELATIONSHIPS NATIVELY */}
              <div>
                <label htmlFor={`category-assign-${subscription.id}`}>Assign a category:</label>
                <select
                  id={`category-assign-${subscription.id}`}
                  value={subscription.category_id || ""}
                  onChange={(eventElement) => handleCategorySelectionChange(subscription.id, eventElement.target.value)}
                >
                  <option value=""> || None || </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={() => handleUnsubscribe(subscription.id)}>
                ❌ Unsubscribe
              </button>
            </li>
          );
        })}
      </ul>

      {subscriptions.length === 0 && !loading && !error && (
        <p>You have not subscribed to any feeds yet.</p>
      )}
    </div>
  );
}
