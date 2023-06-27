import { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

function EventPage() {
  const { events } = useLoaderData();
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventPage;

async function loadEvents() {
  const response = await fetch("https://advance-routing.onrender.com/events");

  if (!response.ok) {
    // throw new Response(
    //   JSON.stringify({ message: "Could not fetch events.", status: 500 })
    // );
    throw json({ message: "Could not fetch events." }, { status: 500 });
  } else {
    const resDate = await response.json();
    return resDate.events;
  }
}

export async function loader() {
  return defer({ events: loadEvents() });
}
