/**
 * MapLegend Component
 *
 * A simple legend UI that explains the meaning of different map marker icons.
 * It displays icon images with corresponding labels for:
 * - Event (default/active event marker)
 * - Issue (reported issue marker)
 * - Closed (closed event marker)
 *
 * This component is meant to be used as a visual guide for interpreting markers
 * on a Google Map instance.
 *
 * @returns {JSX.Element} A legend explaining map marker types.
 */

export default function MapLegend() {
  return (
    <div>
      <div className="legend-row">
        <img src="/event-marker2.png" alt="Event" />
        <span>Event</span>
      </div>
      <div className="legend-row">
        <img src="/issue-marker.png" alt="Issue" />
        <span>Issue</span>
      </div>
      <div className="legend-row">
        <img src="/closed-marker.png" alt="Closed" />
        <span>Closed</span>
      </div>
    </div>
  );
}
