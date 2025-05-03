import Post from "../components/Post";

/**
 * Feed should display different Posts based on the area when zoomed in or out
 * Each post will receive event as a prop
 * Feed will show up on the side bar on top of the Map
 * Feed should have filtered Posts by city (most recent), borough (most recent), most recent Posts, and probably based on status
 * @returns
 */

export default function Feed({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <select className="sort">
        <option value="city">City</option>
        <option value="borough">Borough</option>
        <option value="recent">Most Urgent</option>
        <option value="status">Status</option>
      </select>

      <div className="feed">
        {events.map((event) => (
          <Post
            key={event.event_id}
            event={event}
            onSelect={setSelectedEvent}
          />
        ))}
      </div>
      {selectedEvent && (
        <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  );
}
