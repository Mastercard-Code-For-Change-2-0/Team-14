import React, { useEffect, useState } from "react";
import event1 from "../../assets/event1.jpg";
import event2 from "../../assets/event2.jpg";
import event3 from "../../assets/event3.jpg";
import event4 from "../../assets/event4.jpg";

const EventShowcase = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Dummy data for now (replace with API call to /api/events)
    const dummyEvents = [
      {
        id: 1,
        name: "Hackathon",
        description:
          "A thrilling 24-hour coding marathon to build, innovate, and compete.",
        startDate: "2025-09-01",
        deadline: "2025-08-30",
        image: event1,
        registered: 0,
       
      },
      {
        id: 2,
        name: "AI Workshop",
        description:
          "Explore the fundamentals of artificial intelligence with hands-on projects.",
        startDate: "2025-09-05",
        deadline: "2025-09-02",
        image: event2,
        registered: 20,
       
      },
      {
        id: 3,
        name: "Frontend Masterclass",
        description:
          "Master modern web development with a deep dive into React and Tailwind CSS.",
        startDate: "2025-09-10",
        deadline: "2025-09-08",
        image: event4,
        registered: 5,
       
      },
      {
        id: 4,
        name: "Cloud Bootcamp",
        description:
          "Hands-on training for deploying and scaling apps in the cloud.",
        startDate: "2025-09-12",
        deadline: "2025-09-10",
        image: event3,
        registered: 10,
       
      },
    ];
    setEvents(dummyEvents);
  }, []);

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{event.name}</h2>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {event.description}
        </p>
        <p className="text-xs text-gray-500 mt-2 font-mono">
          <span className="font-semibold">Start:</span> {event.startDate} |{" "}
          <span className="font-semibold">Deadline:</span> {event.deadline}
        </p>

        <p className="text-sm text-blue-700 mt-2 font-semibold">
          Registered Students: {event.registered}
        </p>

      
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">
          All Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventShowcase;

