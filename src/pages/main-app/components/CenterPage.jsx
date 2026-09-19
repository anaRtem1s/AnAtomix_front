// IMPORTING FEED ARTICLES LIST 

import { useState, useEffect } from 'react';
import FeedArticles from './FeedArticles.jsx';

export default function CenterPage({ account, onNav }) {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

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
            onClick={() => setActiveCategoryId(null)}
            className={activeCategoryId === null ? "active-filter" : ""}
          >
            All Feeds
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={activeCategoryId === category.id ? "active-filter" : ""}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* FORWARD FILTER ID TO THE ARTICLES COMPONENT */}
        <FeedArticles onNav={onNav} activeCategoryId={activeCategoryId} />
      </div>
    </>
  );
}