// useRef allows to keep values between renders => store a mutable value which does not cause a re-render when updated

import { useRef, useState, useEffect } from "react";

// RESIZABLE 

export default function LeftBar({ onNav }) {

  const ref = useRef(null);

  const startResize = (e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId); // Locks the mouse to the handle

    const startX = e.clientX;
    const startWidth = ref.current.offsetWidth;

    const onMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      ref.current.style.width = `${Math.max(200, newWidth)}px`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      <aside ref={ref} className="leftbar">

        <div className="leftbar-container">

          {/* DISPLAY ALL ARTICLES BUTTON */}

          <button onClick={() => onNav('reader')} className="btn-all-feeds">
           🧁 All feeds
          </button>
        
          {/* FEED SOURCES CATALOGUE BUTTON */}

          <button onClick={() => onNav('feed-sources')} className="btn-feed-sources-catalogue">
            🍒 Feed sources catalogue
          </button>

          {/* SUBSCRIPTIONS BUTTON */}

          <button onClick={() => onNav('subscriptions')} className="btn-subscriptions">
            🍡 Subscriptions
          </button>

          {/* VERTICAL RESIZE LINE */}

          <div className="resize-handle" onPointerDown={startResize}></div>
        </div>
      </aside>
    </>
  );
}
