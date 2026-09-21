// IMPORTING FEED ARTICLES LIST 

import { useState, useEffect } from 'react';
import FeedArticles from './FeedArticles.jsx';

export default function CenterPage({ account, onNav }) {

  // DISPLAY FILTERS

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // LOADING CATEGORIES TO GENERATE FILTER BUTTONS

  useEffect(() => {
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
        if (response.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error("💔 ERROR LOADING FILTER BUTTONS:", err.message);
      }
    };
    handleLoadCategories();
  }, []);

  return (
    <>
      <div className="centerpage-container">

        <h2>Feeds filters</h2>

        {/* HORIZONTAL FILTER BAR */}

        <div className="feeds-filter-bar">
          <button
            onClick={() => {
              setActiveCategoryId(null);

              // TURNING ON ALL FEEDS EXPLICITLY CLEARS FAVORITES 

              setShowOnlyFavorites(false);
            }}
            className={activeCategoryId === null && !showOnlyFavorites ? "active-filter" : ""}>
            All Feeds
          </button>

          {/* FAVORITES / LOVED ARTICLES FILTER */}

          <button
            onClick={() => {

              // Clears categories to avoid collision states

              setActiveCategoryId(null);
              setShowOnlyFavorites(true);
            }}
            className={showOnlyFavorites ? "active-filter" : ""}>
            🧡 Loved articles
          </button>

          {/* CATEGORIES FILTER */}

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {

                setActiveCategoryId(category.id);

                // TURNING ON A CATEGORY CLEARS FAVORITES STATE

                setShowOnlyFavorites(false);
              }}
              className={activeCategoryId === category.id ? "active-filter" : ""}>
              {category.title}
            </button>
          ))}
        </div>

        {/* FORWARD FILTER ID TO THE ARTICLES COMPONENT */}

        <FeedArticles onNav={onNav}
          activeCategoryId={activeCategoryId}
          showOnlyFavorites={showOnlyFavorites}
        />
      </div>
    </>
  );
}