import { useState, useEffect } from "react";
import Feed from "../components/Feed";
import Map from "../components/Map";
import LoginSignUpPage from "./LoginSignUpPage";

export default function HomePage({
  authOverlayOpen,
  authMode,
  closeAuthOverlay,
}) {
  // Close modal on Escape key press
  useEffect(() => {
    function onEscKey(event) {
      if (event.key === "Escape" && authOverlayOpen) {
        closeAuthOverlay();
      }
    }
    window.addEventListener("keydown", onEscKey);
    return () => window.removeEventListener("keydown", onEscKey);
  }, [authOverlayOpen, closeAuthOverlay]);

  return (
    <div className="homepage">
      <div className={`main-content ${authOverlayOpen ? "disabled-blur" : ""}`}>
        <Feed />
        <Map />
      </div>

      {authOverlayOpen && (
        <div
          className="glassmorphic-overlay"
          onClick={closeAuthOverlay}
          aria-modal="true"
          role="dialog"
        >
          <LoginSignUpPage initialForm={authMode} onClose={closeAuthOverlay} />
        </div>
      )}
    </div>
  );
}
