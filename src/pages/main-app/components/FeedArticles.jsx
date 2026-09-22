import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function FeedArticles({ onNav, activeCategoryId, activeFeedSourceId, showOnlyFavorites }) {

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
      if (!token) throw new Error("🦝 You must be logged in to see the articles!");

      const response = await fetch('http://localhost:8081/api/feed_articles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '💥 Something went wrong fetching articles, sorry');

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

  // DISPATCH A POST ACTION TO SAVE AN INTERACTION ENTRY TO THE BACKEND DATABASE 

  const handleMarkAsRead = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8081/api/account_articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          article_id: articleId,
          is_favorite: false
        })
      });

      // SILENT RE-SYNC DATA STREAM 

      handleLoadArticles();
    } catch (err) {
      console.error("READ STATE STATUS CHANGING REJECTION: 💥 ", err.message);
    }
  };

  // SENDING DELETE ACTION TO REMOVE INTERACTION ROW ENTRY AND REVERT TO UNREAD STATUS

  const handleMarkAsUnread = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/account_articles/${articleId}/unread`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {

        // CLOSE PANEL AUTOMATICALLY UPON BACKEND DATA RESET

        setSelectedArticle(null);
        handleLoadArticles();
      }
    } catch (err) {
      console.error("UNREAD STATE STATUS CHANGING REJECTION: 💥 ", err.message);
    }
  };

  // SENDING PATCH METHOD TO TOGGLE FAVORITED STATUS (BOOLEAN)

  const handleToggleFavorite = async (articleId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/account_articles/${articleId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) { handleLoadArticles(); }
    } catch (err) {
      console.error("FAV BUTTON INTERACTION REJECTION: 💥", err.message);
    }
  };

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

  // FILTER CONDITION C: FAVORITES FILTER TO CHECK THE FIRST ITEM OF THE SEQUELIZE JUNCTION ARRAY

  if (showOnlyFavorites) {

    displayedArticles = displayedArticles.filter(article => {

      const hasInteractionLog = article.mm_account_articles && article.mm_account_articles.length > 0;
      if (hasInteractionLog) {
        const userInteraction = article.mm_account_articles[0];
        return userInteraction.is_favorite === true;
      }
      return false;
    });
  }

  // CONDITIONAL RENDERING THE SINGLE ARTICLE VIEW SAFELY WITHOUT DANGEROUS MARKUP

  if (selectedArticle) {

    // SCAN FRESH DATA FIELDS REGULARLY TO CAPTURE REAL-TIME STATE SAVES

    const freshArticleData = feedArticles.find(a => a.id === selectedArticle.id) || selectedArticle;
    const interactionLog = freshArticleData.mm_account_articles && freshArticleData.mm_account_articles[0];

    const isRead = !!interactionLog;
    const isFavorite = interactionLog ? interactionLog.is_favorite : false;

    return (

      <article aria-labelledby="active-article-title">

        {/* HORIZONTAL ACTION BAR ABOVE THE TITLE */}

        <div>
          <button onClick={() => setSelectedArticle(null)}>
            🢦 Back to feeds
          </button>

          {/* TOGGLE HEART BUTTON */}

          <button
            onClick={() => handleToggleFavorite(freshArticleData.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? '🧡' : '🤍'}
          </button>

          {/* DISPLAY MARK AS UNREAD ONLY IF RECORD REGISTERS READ STATE DATA INSIDE TRACKING TABLE */}

          {isRead && (
            <button onClick={() => handleMarkAsUnread(freshArticleData.id)}>
              ✉️ Mark as unread
            </button>
          )}
        </div>

        <h2 id="active-article-title">{freshArticleData.title}</h2>

        <p>
          <small>
            {freshArticleData.author && <span>By {freshArticleData.author} | </span>}
            Published: {freshArticleData.published_at ? new Date(freshArticleData.published_at).toLocaleString() : 'Unknown Date'}
          </small>
        </p>

        {/* SECURE RICH FORMATTING DISPLAY CONTAINER FULL CONTENT_HTML TEXT  */}
        <div
          className="article-rich-body"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(freshArticleData.content_html || freshArticleData.summary || "No content available.", {
              ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'img', 'ul', 'ol', 'li', 'h3', 'h4', 'br', 'iframe'],
              ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'width', 'height', 'frameborder']
            })
          }}
        />

        <p style={{ marginTop: '2rem' }}>
          <a href={freshArticleData.link} target="_blank" rel="noreferrer">
            Read full original article context on website
          </a>
        </p>
      </article>
    );
  }

  return (
    <div>
      <h2>Feed articles</h2>

      <p>Latest articles</p>

      {loading && <p> 💬 Fetching articles.!.</p>}

      {error && <p> 💔 {error}</p>}

      <ul>
        {displayedArticles.map((feedArticle) => {
          const feedSource = feedArticle.feed_source || feedArticle.feedSource;

          // EXTRACT THE ACCOUNT LOG RECORD ASSIGNED TO THIS RECORD ROW

          const interactionLog = feedArticle.mm_account_articles && feedArticle.mm_account_articles[0];

          // DERIVE COMPONENT DISPLAY STATE CONDITIONS

          const isRead = !!interactionLog;

          return (
            <li key={feedArticle.id}>
              <article aria-labelledby={`article-heading-${feedArticle.id}`}>
                {feedSource && (
                  <p>
                    From: <a href={feedSource.site_url} target="_blank" rel="noreferrer"><strong>{feedSource.title}</strong></a>
                  </p>
                )}

                <h3>

                  <span>{isRead ? '📖 ' : '✉️ '}</span>

                  {/* CLICKING SWITCHES STATE TO DISPLAY SINGLE CONTENT VIEW OVERVIEW PANEL */}

                  <button onClick={() => {
                    setSelectedArticle(feedArticle);

                    // EMIT BACKGROUND WRITER RECORD SAVE DEMANDS NATIVELY IF CURRENTLY UNREAD

                    if (!isRead) handleMarkAsRead(feedArticle.id);
                  }}>
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
              </article>
            </li>
          );
        })}
      </ul>

      {displayedArticles.length === 0 && !loading && !error && (
        <p>No articles in the DB for this category, sry!</p>
      )}
    </div>
  );
}