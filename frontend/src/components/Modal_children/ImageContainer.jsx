import { useState } from "react";

/**
 * A carousel component for displaying one or multiple images with navigation controls.
 * Features include:
 * - Previous/next navigation buttons
 * - Dot indicators for multiple images
 * - Fallback handling for failed images
 * - Support for both array and string image inputs
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<string>|string} props.images - Array of image URLs or a single image URL string
 * @param {string} [props.fallbackImage="https://placehold.co/600x400?text=Image+Not+Available"] - URL to use when an image fails to load
 * @param {string} [props.altText="Event"] - Base text for image alt attributes
 * @returns {JSX.Element} Image carousel component
 */
export default function ImageContainer({
  images,
  fallbackImage = "https://placehold.co/600x400?text=Image+Not+Available",
  altText = "Event",
}) {
  /**
   * State for tracking the currently displayed image index
   *
   * @state
   * @type {number}
   */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Handles image loading errors by replacing with fallback image
   *
   * @function
   * @param {Event} e - DOM error event from img element
   */
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = fallbackImage;
    e.target.alt = "Image not available";
  };

  /**
   * Normalizes the images prop into a consistent array format
   * Handles different input types (array, string, empty) and converts to array
   *
   * @type {Array<string>}
   */
  const imageArray = Array.isArray(images)
    ? images
    : typeof images === "string" && images.trim() !== ""
    ? [images]
    : [];

  // Early return if no images available
  if (imageArray.length === 0) {
    return <div className="event-image">No image available</div>;
  }

  /**
   * Navigates to the previous image in the carousel
   * Cycles back to the last image when at the beginning
   *
   * @function
   * @param {Event} e - DOM click event
   */
  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageArray.length - 1 : prev - 1
    );
  };

  /**
   * Navigates to the next image in the carousel
   * Cycles back to the first image when at the end
   *
   * @function
   * @param {Event} e - DOM click event
   */
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === imageArray.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel-image">
        <img
          src={imageArray[currentImageIndex]}
          alt={`${altText} ${currentImageIndex + 1}`}
          className="event-image"
          onError={handleImageError}
        />

        {/* Always show arrow buttons, but disable them if only one image */}
        <button
          className={`carousel-button prev${
            imageArray.length === 1 ? " disabled" : ""
          }`}
          onClick={handlePrevious}
          disabled={imageArray.length === 1}
        >
          ❮
        </button>
        <button
          className={`carousel-button next${
            imageArray.length === 1 ? " disabled" : ""
          }`}
          onClick={handleNext}
          disabled={imageArray.length === 1}
        >
          ❯
        </button>
      </div>

      {/* Only show dots if more than one image */}
      {imageArray.length > 1 && (
        <div className="carousel-dots">
          {imageArray.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${
                index === currentImageIndex ? "active" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
