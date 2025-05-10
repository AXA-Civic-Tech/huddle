import { useState, useEffect } from "react";
import UserLink from "../UserLink";
import FormField from "./FormField";
import Button from "./Button";

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
}) {
  /**
   * Initialize form state with event data or defaults
   * This tracks all editable fields for the event/issue
   */
  const [formData, setFormData] = useState({
    is_issue: event.is_issue || true,
    title: event.title || "",
    address: event.address || "",
    borough: event.borough || "",
    zipcode: event.zipcode || "",
    status: event.status || "Open",
    email: event.email || "",
    phone: event.phone || "",
    description: event.description || "",
  });

  /**
   * Reset form data when event prop changes
   * Ensures form reflects the current event being edited
   */
  useEffect(() => {
    setFormData({
      is_issue: event.is_issue,
      title: event.title || "",
      address: event.address || "",
      borough: event.borough || "",
      zipcode: event.zipcode || "",
      status: event.status || "Open",
      email: event.email || "",
      phone: event.phone || "",
      description: event.description || "",
    });
  }, [event]);

  /**
   * Change handler for form fields
   * Updates form state with the new value
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
   */
  const handleZipcodeChange = (e) => {
    // Only allow numbers and limit to 5 digits for basic ZIP
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Form submission handler
   * Prevents default form behavior and calls parent's onSave with form data
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  /**
   * Render creator information based on whether this is a new post or an edit
   * - For existing posts: Shows original creator
   * - For new posts: Shows current user as future creator
   */
  const renderCreatedBy = () => {
    if (currentUser) {
      // For new posts, show the current user as the creator
      return (
        <p>
          <strong>Created by:</strong>{" "}
          <UserLink
            userId={currentUser.id}
            username={username}
            onNavigate={onClose}
          >
            {username}
          </UserLink>
        </p>
      );
    } else if (event?.id && event?.user_id) {
      //For existing post, show original creator
      return (
        <p>
          <strong>Created by:</strong>{" "}
          <UserLink userId={event.user_id} username={username}>
            {username}
          </UserLink>
        </p>
      );
    }
    return null;
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      {renderCreatedBy()}

      <FormField
        name="is_issue"
        label="Issue/Event"
        type="select"
        value={formData.is_issue}
        onChange={handleChange}
        option={[
          { value: true, label: "Issue" },
          { value: false, label: "Event" },
        ]}
      />

      <FormField
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <FormField
        name="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <FormField
        name="borough"
        label="Borough"
        value={formData.borough}
        onChange={handleChange}
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

      <FormField
        name="status"
        label="Status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "Active", label: "Active" },
          { value: "Closed", label: "Closed" },
        ]}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      <FormField
        name="phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />

      <FormField
        name="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        required
      />

      <div className="modal-actions">
        <Button name="Cancel" onClick={onCancel} type="button" />
        <Button name="Save Changes" type="submit" />
      </div>
    </form>
  );
}
