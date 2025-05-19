import { useState } from "react";

export default function ImageContainer({
  images,
  fallbackImage = "https://placehold.co/600x400?text=Image+Not+Available",
  altText = "Event",
}) {
  // Add state for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = fallbackImage;
    e.target.alt = "Image not available";
  };

  // Normalize images to array
  const imageArray = Array.isArray(images)
    ? images
    : typeof images === "string" && images.trim() !== ""
    ? [images]
    : [];

  if (imageArray.length === 0) {
    return <div className="event-image">No image available</div>;
  }

  // Add navigation handlers
  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageArray.length - 1 : prev - 1
    );
  };

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

        {/* Always show arrow buttons, but disable themif only one image */}
        <button
          className={`carousel-button prev${imageArray.length === 1 ? ' disabled' : ''}`}
          onClick={handlePrevious}
          disabled={imageArray.length === 1}
        >
          ❮
        </button>
        <button
          className={`carousel-button next${imageArray.length === 1 ? ' disabled' : ''}`}
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
