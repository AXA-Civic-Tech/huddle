import UserLink from "../UserLink";
import DisplayField from "./DisplayField";

export default function EventView({ event = {}, username }) {
  const renderCreatedBy = () => {
    if (event?.user_id) {
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
    <div className="event-view">
      {renderCreatedBy()}

      <DisplayField
        label="Issue/Event"
        value={
          event.is_issue === true || event.is_issue === "true"
            ? "Issue"
            : "Event"
        }
      />

      <DisplayField label="Title" value={event.title} />

      <DisplayField label="Address" value={event.address} />

      <DisplayField label="Borough" value={event.borough} />

      <DisplayField label="Zip Code" value={event.zipcode} />

      <DisplayField label="Status" value={event.status} />

      <DisplayField label="Email" value={event.email} />

      <DisplayField label="Phone" value={event.phone} />

      <DisplayField label="Description" value={event.description} />
    </div>
  );
}
