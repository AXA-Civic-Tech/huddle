import { useState, useEffect, useRef } from "react";
import UserLink from "../UserLink";
import FormField from "./FormField";
import Button from "../Button";
import ImageContainer from "./ImageContainer";

/**
 * Component for editing or creating events/issues.
 * Handles form state management, validation, and submission.
 *
 * @param {Object} event - The event/issue data object (empty for new events)
 * @param {string} username - Username of the event creator
 * @param {Object} currentUser - Currently logged in user data
 * @param {Function} onSave - Callback for form submission with form data
 * @param {Function} onCancel - Callback for canceling the edit operation
 * @returns {JSX.Element} Form component for event data
 */

export default function EventForm({
  event = {},
  username,
  currentUser,
  onSave,
  onCancel,
  onClose,
  dialogRef,
  setIsWidgetOpen,
}) {
  /**
   * Initialize form state with event data or defaults
   * This tracks all editable fields for the event/issue
   */
  const [formData, setFormData] = useState(() => {
    const safeEvent = event || {};
    return {
      is_issue: safeEvent.is_issue !== undefined ? safeEvent.is_issue : true,
      title: safeEvent.title || "",
      address: safeEvent.address || "",
      borough: safeEvent.borough || "",
      zipcode: safeEvent.zipcode || "",
      status: safeEvent.status !== undefined ? safeEvent.status : true,
      email: safeEvent.email || "",
      phone: safeEvent.phone || "",
      description: safeEvent.description || "",
      images: Array.isArray(safeEvent.images) ? safeEvent.images : [],
    };
  });

  /**
   * Reset form data when event prop changes
   * Ensures form reflects the current event being edited
   */
  useEffect(() => {
    if (!event) return;

    setFormData({
      is_issue: event.is_issue !== undefined ? event.is_issue : true,
      title: event.title || "",
      address: event.address || "",
      borough: event.borough || "",
      zipcode: event.zipcode || "",
      status: event.status !== undefined ? safeEvent.status : true,
      email: event.email || "",
      phone: event.phone || "",
      description: event.description || "",
      images: Array.isArray(event.images)
        ? event.images
        : event.images
        ? [event.images]
        : [],
    });
  }, [event]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  /**
   * Change handler for form fields
   * Updates form state with the new value
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name === "address" && typeof value === "object") {
    //   // Update multiple fields when address is selected
    //   setFormData((prev) => ({
    //     ...prev,
    //     address: value.formatted_address,
    //     lat_location: value.lat,
    //     long_location: value.lng,
    //     borough: value.borough,
    //     zipcode: value.zipcode,
    //   }));
    // } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // }
  };

  /**
   * Handler for zipcode field
   * Ensures zipcode only contains numbers and limits to 5 digits
   */
  const handleZipcodeChange = (e) => {
    // Only allow numbers and limit to 5 digits for basic ZIP
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
    setFormData((prev) => ({ ...prev, zipcode: value }));
  };

  /**
   * Form submission handler
   * Prevents default form behavior and calls parent's onSave with form data
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const modalRef = useRef(null);

  const handleUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dwrpyq7tq",
        uploadPreset: "huddle events images",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const uploadedUrl = result.info.secure_url; // ✅ define uploadedUrl here

          setFormData((prevFormData) => ({
            ...prevFormData,
            images: [
              ...(Array.isArray(prevFormData.images)
                ? prevFormData.images
                : []),
              uploadedUrl,
            ],
          }));
        }

        if (result.event === "close") {
          // Reopen modal after widget is closed
          if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
          }
          setIsWidgetOpen(false);
          if (modalRef.current) {
            modalRef.current.classList.remove("modal-hidden");
          }
        }
      }
    );

    // Close modal before opening widget
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }

    setIsWidgetOpen(true);
    widget.open();
  };

  /**
   * Render creator information based on whether this is a new post or an edit
   * - For existing posts: Shows original creator
   * - For new posts: Shows current user as future creator
   */
  const renderCreatedBy = () => {
    if (!event?.id && currentUser) {
      // For new posts, show the current user as the creator
      return (
        <p className="created-by">
          <strong>Created by:</strong>{" "}
          <UserLink
            userId={currentUser.id}
            username={currentUser.username || username}
            onClose={onClose}
          >
            {currentUser.username || username}
          </UserLink>
        </p>
      );
    } else if (event?.id && event?.user_id) {
      //For existing post, show original creator
      return (
        <p className="created-by">
          <strong>Created by:</strong>{" "}
          <UserLink
            userId={event.user_id}
            username={username}
            onClose={onClose}
          >
            {username}
          </UserLink>
        </p>
      );
    }
    return null;
  };

  return (
    <>
      {/* Apply the same horizontal structure as in Modal.jsx */}
      <div className="modal-content" ref={modalRef}>
        {/* Image Container - left side */}
        <div className="event-images">
          {formData.images && formData.images.length > 0 ? (
            <>
              <div className="image-preview-list">
                {formData.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Uploaded preview ${index + 1}`}
                    className="event-image"
                  />
                ))}
              </div>
              <Button
                name="Change Image"
                type="button"
                onClick={handleUploadWidget}
                className="change-image-btn"
              />
            </>
          ) : (
            <div className="image-upload" onClick={handleUploadWidget}>
              <p>
                <strong>Upload Image</strong>
              </p>
              <p>
                Click here to upload an image for your{" "}
                {formData.is_issue ? "issue" : "event"}
              </p>
            </div>
          )}
        </div>

        {/* Content Container - right side */}
        <div className="event-content">
          <form className="edit-form" onSubmit={handleSubmit}>
            {renderCreatedBy()}

            <div className="edit-dropdown">
              <FormField
                name="is_issue"
                label="Issue/Event"
                type="select"
                value={formData.is_issue}
                onChange={handleChange}
                options={[
                  { value: true, label: "Issue" },
                  { value: false, label: "Event" },
                ]}
              />

              <FormField
                name="status"
                label="Status"
                type="select"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Closed" },
                ]}
              />
            </div>

            <FormField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title*"
              required
            />

            <FormField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address*"
              required
            />

            <div className="edit-dropdown">
              <FormField
                name="borough"
                label="Borough"
                type="select"
                value={formData.borough}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select a borough..." },
                  { value: "Manhattan", label: "Manhattan" },
                  { value: "Brooklyn", label: "Brooklyn" },
                  { value: "Queens", label: "Queens" },
                  { value: "The Bronx", label: "The Bronx" },
                  { value: "Staten Island", label: "Staten Island" },
                ]}
                required
              />

              <FormField
                name="zipcode"
                label="Zip Code"
                value={formData.zipcode}
                onChange={handleZipcodeChange}
                maxLength="5"
                placeholder="5-digit ZIP code"
                required
              />
            </div>

            <FormField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email (Optional)"
            />

            <FormField
              name="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (Optional)"
            />

            <FormField
              name="description"
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Description*"
              required
            />

            <div className="modal-actions">
              <Button name="Cancel" onClick={onCancel} type="button" />
              <Button name="Save" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
