import { useState, useEffect, useRef } from "react";
import UserLink from "../UserLink";
import FormField from "./FormField";
import Button from "../Button";
import ImageContainer from "./ImageContainer";

/**
 * Component for editing or creating events/issues.
 * Handles form state management, validation, image uploading, and submission.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.event={}] - The event/issue data object (empty for new events)
 * @param {string} props.username - Username of the event creator
 * @param {Object} props.currentUser - Currently logged in user data
 * @param {Function} props.onSave - Callback for form submission with form data
 * @param {Function} props.onCancel - Callback for canceling the edit operation
 * @param {Function} props.onClose - Callback to close the parent modal/dialog
 * @param {Object} props.dialogRef - React ref to the parent dialog element
 * @param {Function} props.setIsWidgetOpen - Function to set the state of the upload widget
 * @returns {JSX.Element} Form component for event/issue data
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
   *
   * @state
   * @type {Object}
   * @property {boolean} is_issue - Whether this is an issue (true) or event (false)
   * @property {boolean} status - Whether the event/issue is active (true) or closed (false)
   * @property {string} title - Title of the event/issue
   * @property {string} address - Physical address for the event/issue
   * @property {string} borough - NYC borough where the event/issue is located
   * @property {string} zipcode - ZIP code for the event/issue location
   * @property {string} email - Contact email address
   * @property {string} phone - Contact phone number
   * @property {string} description - Detailed description of the event/issue
   * @property {Array<string>} images - Array of image URLs for the event/issue
   */
  const [formData, setFormData] = useState(() => {
    const safeEvent = event || {};
    return {
      is_issue: safeEvent.is_issue !== undefined ? safeEvent.is_issue : true,
      status: safeEvent.status !== undefined ? safeEvent.status : true,
      title: safeEvent.title || "",
      address: safeEvent.address || "",
      borough: safeEvent.borough || "",
      zipcode: safeEvent.zipcode || "",
      email: safeEvent.email || "",
      phone: safeEvent.phone || "",
      description: safeEvent.description || "",
      images: Array.isArray(safeEvent.images) ? safeEvent.images : [],
    };
  });

  /**
   * Reference to the modal content div
   * Used to show/hide modal when image widget is open
   *
   * @type {React.RefObject}
   */
  const modalRef = useRef(null);

  /**
   * Effect to reset form data when event prop changes
   * Ensures form reflects the current event being edited
   *
   * @effect
   * @dependsOn {event}
   */
  useEffect(() => {
    if (!event) return;

    setFormData({
      is_issue: event.is_issue !== undefined ? event.is_issue : true,
      title: event.title || "",
      address: event.address || "",
      borough: event.borough || "",
      zipcode: event.zipcode || "",
      status: event.status !== undefined ? event.status : true,
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

  /**
   * Effect to load the Cloudinary upload widget script
   * Adds the script to the document body on mount and removes it on unmount
   *
   * @effect
   * @dependsOn {[]} - Runs only on component mount
   */
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
   *
   * @function
   * @param {Event} e - DOM event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handler for zipcode field
   * Ensures zipcode only contains numbers and limits to 5 digits
   *
   * @function
   * @param {Event} e - DOM event object
   */
  const handleZipcodeChange = (e) => {
    // Only allow numbers and limit to 5 digits for basic ZIP
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
    setFormData((prev) => ({ ...prev, zipcode: value }));
  };

  /**
   * Form submission handler
   * Prevents default form behavior and calls parent's onSave with form data
   *
   * @function
   * @param {Event} e - DOM form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  /**
   * Opens the Cloudinary upload widget for image selection
   * Manages dialog state before and after widget interaction
   * Updates the form data with newly uploaded image URLs
   *
   * @function
   */
  const handleUploadWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dwrpyq7tq",
        uploadPreset: "huddle events images",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const uploadedUrl = result.info.secure_url;

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
   * Renders creator information based on whether this is a new post or an edit
   * - For new posts: Shows current user as future creator
   * - For existing posts: Shows original creator
   *
   * @function
   * @returns {JSX.Element|null} UserLink component showing creator information or null
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
      <div className="modal-content" ref={modalRef}>
        {/* Image Container - left side */}
        <div className="event-images">
          {formData.images && formData.images.length > 0 ? (
            <>
              <div className="event-images">
                <ImageContainer
                  images={formData.images}
                  altText={formData.title || "Event"}
                  fallbackImage="https://placehold.co/600x400?text=Image+Not+Available"
                />
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
              onChange={(e) => {
                if (e.target.value.length <= 50) handleChange(e);
              }}
              placeholder="Title*"
              required
              maxLength={50}
            />

            <p
              style={{
                fontSize: "0.95em",
                color: formData.title.length === 50 ? "red" : "#666",
                marginTop: "-8px",
                marginBottom: "8px",
              }}
            >
              {formData.title.length}/50 characters
            </p>

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
              label="Description:"
              type="textarea"
              value={formData.description}
              onChange={(e) => {
                if (e.target.value.length <= 250) handleChange(e);
              }}
              rows="4"
              placeholder="Description*"
              required
              maxLength={250}
              style={{
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />

            <p
              style={{
                fontSize: "0.95em",
                color: formData.description.length === 250 ? "red" : "#666",
                marginTop: "-8px",
                marginBottom: "8px",
              }}
            >
              {formData.description.length}/250 characters
            </p>

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
