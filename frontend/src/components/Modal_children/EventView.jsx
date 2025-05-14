import UserLink from "../UserLink";
import DisplayField from "./DisplayField";

/**
 * Read-only component for displaying event/issue details.
 * Renders all event fields in a user-friendly format.
 *
 * @param {Object} event - The event/issue data object to display
 * @param {string} username - Username of the event creator
 * @returns {JSX.Element} View component showing event details
 */

export default function EventView({ event = {}, username, onClose }) {
  /**
   * Render the "Created by" information if available
   * Links to the creator's profile using UserLink component
   */
  const renderCreatedBy = () => {
    if (event?.user_id) {
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
    <div className="event-view">
      <h2 className="event-title">{event.title || "Untitled Event"}</h2>

      {renderCreatedBy()}

      <DisplayField
        label="Type"
        value={
          event.is_issue === true || event.is_issue === "true"
            ? "Issue"
            : "Event"
        }
      />

      <DisplayField label="Status" value={event.status} />

      <div className="location-details">
        <DisplayField label="Address" value={event.address} />
        <DisplayField label="Borough" value={event.borough} />
        <DisplayField label="Zip Code" value={event.zipcode} />
      </div>

      <div className="contact-info">
        {event.email && <DisplayField label="Email" value={event.email} />}
        {event.phone && <DisplayField label="Phone" value={event.phone} />}
      </div>

      <div className="description-section">
        <h3>Description</h3>
        <p className="description-text">{event.description}</p>
      </div>
    </div>
  );
}
