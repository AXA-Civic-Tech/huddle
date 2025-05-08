import Button from "./Button";

/**
 * @params event, onSelect
 * Renders exisitng issues/events on Feed
 *
 * Styling: Hover Effect for indication that it's clickable
 * @returns
 */

export default function Post({ event, onSelect }) {
  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  return (
    <div className="post" onClick={handleClick}>
      {/* <img src={event.image.src} alt={event.image.alt} /> */}

      <h2 className="title">{event.title}</h2>

      {/* <p className="status">Status: {event.status}</p> */}

      <Button name="View More" onClick={handleClick} />

      {/* <div className="comments">{event.comments[0]}</div> */}
    </div>
  );
}
