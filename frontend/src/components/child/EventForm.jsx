import { useState, useEffect } from "react";
import UserLink from "../UserLink";
import FormField from "./FormField";
import Button from "./Button";

export default function EventForm({
  event = {},
  username,
  currentUser,
  onSave,
  onCancel,
}) {
  // Form fields
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

  // Reset form values when event changes
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleZipcodeChange = (e) => {
    // Only allow numbers and limit to 5 digits for basic ZIP
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderCreatedBy = () => {
    if (currentUser) {
      // For new posts, show the current user as the creator
      return (
        <p>
          Created by:{" "}
          <UserLink userId={currentUser.id} username={username}>
            {username}
          </UserLink>
        </p>
      );
    } else if (event?.id && event?.user_id) {
      //For existing post, show original creator
      return (
        <p>
          Created by:{" "}
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
