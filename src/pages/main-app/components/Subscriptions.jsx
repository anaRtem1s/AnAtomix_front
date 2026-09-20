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
      alert(` Error: ${err.message}`);
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
      alert(` Error: ${err.message}`);
    }
  };

  return (
    <div className="cpage-container">
      <button
        onClick={() => onNav("reader")}
        title="Back to feeds dashboard list view"
      >
        🢦 Back to Feeds
      </button>

      <h2>My Subscriptions</h2>

      {loading && <p role="status">Loading subscriptions list data...</p>}
      {error && <p role="alert"> {error}</p>}

      <ul>
        {subscriptions.map((subscription) => {
          const feedSource = subscription.feed_source || subscription.feedSource;
          if (!feedSource) return null;

          return (

            <li key={subscription.id}>
              <article aria-labelledby={`sub-heading-${subscription.id}`}>

                <div className="list-ctnr">

                  <strong id={`sub-heading-${subscription.id}`}>
                    <svg
                      className="rss-icon"
                      xmlns="http://w3.org"
                      viewBox="0 0 333333 333333"
                      shape-rendering="geometricPrecision"
                      text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      aria-hidden="true"
                    >
                      <path d="M166667 0c46023 0 87690 18655 117851 48816s48816 71828 48816 117851-18655 87690-48816 117851-71828 48816-117851 48816-87690-18655-117851-48816S0 212690 0 166667 18655 78977 48816 48816 120644 0 166667 0zm-50267 202221c-11193 0-20290 9126-20290 20250 0 11180 9096 20211 20290 20211 11228 0 20318-9032 20318-20211 0-11124-9087-20250-20318-20250zm-20270-59981v29214c19024 0 36901 7440 50367 20917 13452 13438 20880 31402 20880 50500h29339c0-55480-45142-100622-100586-100622v-9zm37-51776v29219c67839 0 123046 55264 123046 123179l29299 3c0-84011-68354-152398-152342-152398l-3-3zm177128-30425c-27287-27287-64987-44165-106628-44165-41642 0-79341 16878-106628 44165s-44165 64987-44165 106628c0 41642 16878 79341 44165 106628s64987 44165 106628 44165c41642 0 79341-16878 106628-44165s44165-64987 44165-106628c0-41642-16878-79341-44165-106628z" fill="#f26522" fill-rule="nonzero" />
                    </svg>
                    {feedSource.title}
                  </strong> ({feedSource.feed_type})

                  <small>URL: <a href={feedSource.feed_url} target="_blank" rel="noreferrer" title="Open raw source XML context link">{feedSource.feed_url}</a></small>
                  
                </div>

                {/* DROP DOWN SELECTOR ASSIGNS OR UPDATES CATEGORY RELATIONSHIPS NATIVELY */}

                <fieldset>
                  <legend>Category Selection Matrix</legend>

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
                </fieldset>

                <button
                  onClick={() => handleUnsubscribe(subscription.id)}

                >
                  ⤫ Unsubscribe
                </button>
              </article>
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
