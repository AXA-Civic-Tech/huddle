import UserLink from "../UserLink";
import DisplayField from "./DisplayField";

/**
 * Read-only component for displaying event/issue details.
 * Renders all event fields in a user-friendly format including title, creator info,
 * type, status, address information, contact details, and description.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.event={}] - The event/issue data object to display
 * @param {string} props.event.title - Title of the event/issue
 * @param {boolean|string} props.event.is_issue - Whether this is an issue (true) or event (false)
 * @param {boolean|string} props.event.status - Whether the event/issue is active (true) or closed (false)
 * @param {string} props.event.address - Physical address for the event/issue
 * @param {string} props.event.borough - NYC borough where the event/issue is located
 * @param {string} props.event.zipcode - ZIP code for the event/issue location
 * @param {string} [props.event.email] - Contact email address if available
 * @param {string} [props.event.phone] - Contact phone number if available
 * @param {string} props.event.description - Detailed description of the event/issue
 * @param {string} props.event.user_id - ID of the user who created this event/issue
 * @param {string} props.username - Username of the event creator
 * @param {Function} props.onClose - Callback function to close the parent modal/dialog
 * @returns {JSX.Element} View component showing formatted event details
 */
export default function EventView({ event = {}, username, onClose }) {
  /**
   * Renders the "Created by" information with user link if available
   * Links to the creator's profile using UserLink component
   *
   * @function
   * @returns {JSX.Element|null} User information element or null if not available
   */
  const renderCreatedBy = () => {
    if (event?.user_id) {
      // For existing post, show original creator
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

      <DisplayField
        label="Status"
        value={
          event.status === true || event.status === "true" ? "Active" : "Closed"
        }
      />

      <DisplayField
        label="Address"
        value={[event.address, event.borough, "NY", event.zipcode]}
      />

      {event.email && <DisplayField label="Email" value={event.email} />}
      {event.phone && <DisplayField label="Phone" value={event.phone} />}

      <div className="description-section">
        <h3>Description:</h3>
        <p className="description-text">{event.description}</p>
      </div>
    </div>
  );
}
