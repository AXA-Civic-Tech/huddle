import { useState, useEffect } from "react";
import UserLink from "../UserLink";
import Button from "../Button";
import FormField from "./FormField";
import AddressForm from "./AddressForm";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    is_issue: event.is_issue !== undefined ? event.is_issue : true,
    title: event.title || "",
    address: event.address || "",
    borough: event.borough || "Manhattan",
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
      is_issue: event.is_issue !== undefined ? event.is_issue : true,
      title: event.title || "",
      address: event.address || "",
      borough: event.borough || "Manhattan",
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
   * Handler for when a place is selected from Google Places
   * Updates multiple form fields with place data
   */
  const handlePlaceSelected = (placeData) => {
    setFormData((prev) => ({
      ...prev,
      address: placeData.formatted_address,
      borough: placeData.components.borough || prev.borough,
      zipcode: placeData.components.zipcode || prev.zipcode,
      lat: placeData.lat,
      lng: placeData.lng,
    }));
  };

  // /**
  //  * Handle address selection from Google Places Autocomplete
  //  * Maps address components to form fields
  //  */
  // const handleAddressSelect = (address) => {
  //   // Update form with address components
  //   setFormData((prev) => ({
  //     ...prev,
  //     address: address.street_address || prev.address,
  //     zipcode: address.postal_code || prev.zipcode,

  //     // If the state is NY, attempt to set the borough based on city
  //     // This is specific to NYC addresses
  //     borough:
  //       address.state === "NY"
  //         ? mapCityToBorough(address.city) || prev.borough
  //         : prev.borough,
  //   }));
  // };

  /**
   * Maps NYC area cities/neighborhoods to specific boroughs
   * This is a helper function for handleAddressSelect
   */
  // const mapCityToBorough = (city) => {
  //   if (!city) return null;

  //   // Normalize city name for comparison
  //   const cityName = city.toLowerCase();

  //   // Simple mapping of some common city names to boroughs
  //   if (cityName === "brooklyn") return "Brooklyn";
  //   if (cityName === "new york" || cityName === "manhattan") return "Manhattan";
  //   if (cityName === "queens") return "Queens";
  //   if (cityName === "bronx" || cityName === "the bronx") return "The Bronx";
  //   if (cityName === "staten island") return "Staten Island";

  //   return null;
  // };

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

  /**
   * Render creator information based on whether this is a new post or an edit
   * - For existing posts: Shows original creator
   * - For new posts: Shows current user as future creator
   */
  const renderCreatedBy = () => {
    if (!event?.id && currentUser) {
      // For new posts, show the current user as the creator
      return (
        <p>
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
        <p>
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
    <form className="edit-form" onSubmit={handleSubmit}>
      {renderCreatedBy()}

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
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div className="field">
        <label htmlFor="address">
          <strong>Address:</strong>
        </label>
        <AddressForm
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onPlaceSelected={handlePlaceSelected}
          apiKey={apiKey}
          placeholder="Start typing an address..."
          required
        />
      </div>

      {/* <FormField
        name="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <FormField
        name="borough"
        label="Borough"
        type="select"
        value={formData.borough}
        onChange={handleChange}
        options={[
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
      /> */}

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
