import {
  Await,
  defer,
  json,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";

import EventItem from "../components/EventItem";
import { Suspense } from "react";
import EventsList from "../components/EventsList";
import { getAuthToken } from "../util/auth";

const EventDetailPage = () => {
  const { event, events } = useRouteLoaderData("event-detail");
  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvent) => <EventsList events={loadedEvent} />}
        </Await>
      </Suspense>
    </>
  );
};

export default EventDetailPage;

async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event." },
      { status: 500 }
    );
  } else {
    const resDate = await response.json();
    return resDate.event;
  }
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

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

export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({ event: await loadEvent(id), events: loadEvents() });
}

export async function action({ request, params }) {
  const eventId = params.eventId;

  const token = getAuthToken();

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    throw json(
      { message: "Could not delete selected event." },
      { status: 500 }
    );
  }
  return redirect("/events");
}
