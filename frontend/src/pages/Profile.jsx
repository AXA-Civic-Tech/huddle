import SiteHeadingAndNav from "../components/SiteHeadingAndNav";

export default function Profile({ user, events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <SiteHeadingAndNav />

      <div className="profile-header">
        <h1>@{user.username}</h1>
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <h3>{user.email}</h3>
      </div>

      <div className="profile">
        {events.filter(
          (event) =>
            event.user_id === user.id && (
              <Post key={event.id} event={event} onSelect={setSelectedEvent} />
            )
        )}
        {selectedEvent && (
          <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </>
  );
}
