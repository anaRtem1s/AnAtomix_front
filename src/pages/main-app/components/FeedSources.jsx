import { useState, useEffect } from 'react';

export default function FeedSources({ onNav }) {

  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  // TRACK INDIVIDUAL ERRORS PER EXPLICIT ROW ID KEY

  const [rowErrors, setRowErrors] = useState({});
  const [subscribedStatus, setSubscribedStatus] = useState({});

  const [feedUrlInput, setFeedUrlInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);


  // FETCH ALL GLOBAL FEEDS FROM THE CATALOGUE

  const handleLoadSources = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8081/api/feed_sources', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || ' 💥 Something went wrong fetching feed sources');

      setSources(data);
    } catch (err) {
      console.error("CATALOGUE SOURCES LOAD ERROR: 💥 ", err.message);
    }
  };

  // SCREEN LOADING

  const handleLoadScreenData = async () => {
    setLoading(true);
    setRowErrors({});
    await handleLoadSources();
    setLoading(false);
  };

  useEffect(() => {
    handleLoadScreenData();
  }, []);


  // SUBMIT A NEW FEED SOURCE TO CATALOGUE

  const handleAddFeedSource = async (eventObject) => {
    eventObject.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');

      const urlInstance = new URL(feedUrlInput);
      const generatedTitleString = urlInstance.hostname.replace('www.', '') + " Feed";
      const detectedFeedType = feedUrlInput.toLowerCase().includes('atom') ? 'atom' : 'rss';

      const response = await fetch('http://localhost:8081/api/feed_sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          feed_url: feedUrlInput,
          feed_type: detectedFeedType,
          title: generatedTitleString,
          descr: "",
          site_url: urlInstance.origin
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to add feed source, sorry');

      alert("Feed added to your subscriptions!");

      setFeedUrlInput("");
      handleLoadSources();

    } catch (err) {
      alert(`💥 ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };


  // CREATE A SUBSCRIPTION TO A FEED

  const handleSubscribe = async (feedSourceId) => {
    try {
      const token = localStorage.getItem('token');

      // CLEAR ANY RELEVANT ERROR ATTACHED TO THIS SPECIFIC ELEMENT KEY
      setRowErrors(prev => ({ ...prev, [feedSourceId]: null }));

      const response = await fetch('http://localhost:8081/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          feed_source_id: feedSourceId,
          category_id: null
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Subscription failed, sorry');

      setSubscribedStatus(prev => ({ ...prev, [feedSourceId]: true }));
    } catch (err) {

      // STORES THE BACKEND VALUE SPECIFICALLY LINKED TO THIS UNIQUE REJECTED ID KEY

      setRowErrors(prev => ({ ...prev, [feedSourceId]: err.message }));
    }
  };

  return (
    <div>
      <h2>Feed Sources Catalogue</h2>

      <button onClick={() => onNav("reader")}>← Back to Feeds</button>

      <form onSubmit={handleAddFeedSource}>
        <label htmlFor="add-feed-url-input">Add a new RSS or Atom feed URL link:</label>

        <input
          id="add-feed-url-input"
          type="url"
          placeholder="https://rss.com"
          value={feedUrlInput}
          onChange={(eventElement) => setFeedUrlInput(eventElement.target.value)}
          required
          disabled={formLoading}
        />
        <button type="submit" disabled={formLoading}>
          {formLoading ? 'Analyzing...' : 'Add feed source to catalogue'}
        </button>
      </form>

      {/* OPERATIONAL ALERTS OR FEEDBACK STATUS RENDERERS */}

      {loading && <p role="status">Fetching feeds database list...</p>}

      {/* GLOBAL CHANNELS FEED SOURCE MAP DISPLAY LIST */}
      
<div className="feed-sources-list-ctnr">
  
        <ul className='feed-sources-list'>
          {sources.map((source) => (
            <li key={source.id}>
              <div>
                <h3>📰 {source.title} ({source.feed_type})</h3>
                <p>URL: <a href={source.feed_url}>{source.feed_url}</a></p>
                {source.descr && <p>{source.descr}</p>}
              </div>
  
              <div>
                {subscribedStatus[source.id] ? (
                  <button onClick={() => onNav('subscriptions')} aria-label="Manage subscriptions">
                    ✔ Subscribed (Manage in Subscriptions)
                  </button>
                ) : (
                  <button onClick={() => handleSubscribe(source.id)} aria-label={`Subscribe to ${source.title}`}>
                    Subscribe
                  </button>
                )}
  
                {rowErrors[source.id] && (
                  <p role="alert"> 💥 {rowErrors[source.id]}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
  
        {sources.length === 0 && !loading && (
          <p>No RSS feeds added to this account yet.</p>
        )}
      </div>
</div>
  );
}