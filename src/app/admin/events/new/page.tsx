import EventForm from "../EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-lavender-50">New Event</h1>
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
