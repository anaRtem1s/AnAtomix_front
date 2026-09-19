import { useState, useEffect } from 'react';

export default function FeedArticles({ onNav, activeCategoryId, activeFeedSourceId }) {
  const [feedArticles, setFeedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // STATE TO TRACK THE ACTIVE OPENED ARTICLE

  const [selectedArticle, setSelectedArticle] = useState(null);

  // FETCH ALL FEED ARTICLES FROM THE ENDPOINT

  const handleLoadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("YOU MUST BE LOGGED IN TO SEE ARTICLES!");

      const response = await fetch('http://localhost:8081/api/feed_articles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong fetching articles, sorry');

      setFeedArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadArticles();
  }, []);


  // PRIMES THE LIST TO ONLY DISPLAY ARTICLES FROM YOUR ACTIVE SUBSCRIPTIONS

  let displayedArticles = feedArticles.filter(article => {
    const source = article.feed_source || article.feedSource;

    //  EXTRACT SUBSCRIPTION DATA FROM THE FIRST ENTRY OF THE RELATION ARRAY

    const subscription = source && source.subscriptions ? source.subscriptions[0] : null;

    // IF THE LOOSE JOIN CONTAINS YOUR SUBSCRIPTION DATA, ACCOUNT FOLLOWS THIS FEED SOURCE

    return source && subscription;
  });

  //  FILTER CONDITION A: CORRECTLY SCANS DOWN THE SEQUELIZE JOIN TREE TO FIND CATEGORIES

  if (activeCategoryId) {

    displayedArticles = displayedArticles.filter(article => {

      const source = article.feed_source || article.feedSource;

      // EXTRACT SUBSCRIPTION DATA FROM THE FIRST ENTRY OF THE RELATION ARRAY

      const subscription = source && source.subscriptions ? source.subscriptions[0] : null;

      if (source && subscription) {

        // SAFELY MATCH THE DIRECT OBJECT COMPONENT FIELD
        
        return subscription.category_id === activeCategoryId;
      }
      return false;
    });
  }

  //  FILTER CONDITION B: SCAN DATA ROWS MATCHING INDIVIDUAL WEBSITE LOGS

  if (activeFeedSourceId) {
    displayedArticles = displayedArticles.filter(article => article.feed_source_id === activeFeedSourceId);
  }

  // CONDITIONAL RENDERING THE SINGLE ARTICLE VIEW SAFELY WITHOUT DANGEROUS MARKUP

  if (selectedArticle) {
    return (
      <div>

        <button onClick={() => setSelectedArticle(null)}>
          ⬅ Back to feeds
        </button>

        <h2>{selectedArticle.title}</h2>

        <p>
          <small>
            {selectedArticle.author && <span>By {selectedArticle.author} | </span>}
            Published: {selectedArticle.published_at ? new Date(selectedArticle.published_at).toLocaleString() : 'Unknown Date'}
          </small>
        </p>

        {/*  SAFELY RENDERING PURE PLAINTEXT SUMMARY FIELD INSIDE A STANDARD PARAGRAPH TAG */}
        <p>
          {selectedArticle.summary || "No description overview available for this article."}
        </p>

        <p>
          <a href={selectedArticle.link} target="_blank" rel="noreferrer">
            Read full original article context on website 🔗
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Feed articles</h2>

      <p>Latest articles</p>

      {loading && <p>🔄 Fetching articles..</p>}

      {error && <p>💔 {error}</p>}

      <ul>
        {displayedArticles.map((feedArticle) => {
          const feedSource = feedArticle.feed_source || feedArticle.feedSource;

          return (
            <li key={feedArticle.id}>
              <div>
                {feedSource && (
                  <p>
                    From: <a href={feedSource.site_url} target="_blank" rel="noreferrer"><strong>{feedSource.title}</strong></a>
                  </p>
                )}

                <h3>
                  {/* CLICKING SWITCHES STATE TO DISPLAY SINGLE CONTENT VIEW OVERVIEW PANEL */}
                  <button onClick={() => setSelectedArticle(feedArticle)}>
                    {feedArticle.title}
                  </button>
                </h3>

                <small>{feedArticle.author && <span>By {feedArticle.author} | </span>}
                  Published: {feedArticle.published_at ? new Date(feedArticle.published_at).toLocaleString() : 'Unknown Date'}
                </small>

                {feedArticle.summary && (
                  <p>
                    {feedArticle.summary}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {displayedArticles.length === 0 && !loading && !error && (
        <p>No articles loaded yet inside the database, sry.</p>
      )}
    </div>
  );
}
