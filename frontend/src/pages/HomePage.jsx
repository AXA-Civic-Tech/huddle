import { useEffect } from "react";
import Feed from "../components/Feed";
import Map from "../components/Map";

/**
 * HomePage component rendering the application's main landing page.
 * Displays a feed of events/issues alongside an interactive map.
 * Conditionally renders authentication overlays when needed.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.authOverlayOpen - Controls visibility of authentication overlay
 * @param {Function} props.closeAuthOverlay - Handler to close the authentication overlay
 * @returns {JSX.Element} HomePage component with Feed, Map, and conditional auth overlay
 */

export default function HomePage({
  authOverlayOpen,
  closeAuthOverlay,
  openAuthOverlay,
}) {
  // Close modal on Escape key press
  useEffect(() => {
    const onEscKey = (event) => {
      if (event.key === "Escape" && authOverlayOpen) {
        closeAuthOverlay();
      }
    };
    window.addEventListener("keydown", onEscKey);
    return () => window.removeEventListener("keydown", onEscKey);
  }, [authOverlayOpen, closeAuthOverlay]);

  return (
    <div className="homepage">
      <div className={`main-content ${authOverlayOpen ? "disabled-blur" : ""}`}>
        <Feed openAuthOverlay={openAuthOverlay} />
        <Map />
      </div>
    </div>
  );
}
