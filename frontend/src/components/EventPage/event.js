import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import event1 from "../../assets/event1.jpg";
import event2 from "../../assets/event2.jpg";
import event3 from "../../assets/event3.jpg";
import event4 from "../../assets/event4.jpg";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [registered, setRegistered] = useState([]);

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
      },
      {
        id: 2,
        name: "AI Workshop",
        description:
          "Explore the fundamentals of artificial intelligence with hands-on projects.",
        startDate: "2025-09-05",
        deadline: "2025-09-02",
        image: event2,
      },
      {
        id: 3,
        name: "Frontend Masterclass",
        description:
          "Master modern web development with a deep dive into React and Tailwind CSS.",
        startDate: "2025-09-10",
        deadline: "2025-09-08",
        image: event4,
      },
      {
        id: 4,
        name: "Cloud Bootcamp",
        description:
          "Hands-on training for deploying and scaling apps in the cloud.",
        startDate: "2025-09-12",
        deadline: "2025-09-10",
        image: event3,
      },
    ];
    setEvents(dummyEvents);
  }, []);

  const handleFavourite = (event) => {
    if (favourites.find((fav) => fav.id === event.id)) {
      toast.error("Already in favourites");
      return;
    }
    setFavourites([...favourites, event]);
    toast.success("Added to favourites");
  };

  const handleRemoveFavourite = (id) => {
    setFavourites(favourites.filter((fav) => fav.id !== id));
    toast.success("Removed from favourites");
  };

  const handleRegister = (event) => {
    if (registered.find((reg) => reg.id === event.id)) {
      toast.error("Already registered");
      return;
    }
    setRegistered([...registered, event]);
    toast.success("Registered successfully!");
  };

  const EventCard = ({ event, showActions = true, fromFavourites = false }) => (
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

        {showActions && (
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => handleFavourite(event)}
              className="text-red-500 text-xl transition-transform duration-200 hover:scale-110"
            >
              {favourites.find((fav) => fav.id === event.id) ? (
                <FaHeart className="fill-red-500" />
              ) : (
                <FaRegHeart />
              )}
            </button>

            <button
              onClick={() => handleRegister(event)}
              disabled={registered.find((reg) => reg.id === event.id)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                registered.find((reg) => reg.id === event.id)
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {registered.find((reg) => reg.id === event.id)
                ? "Registered"
                : "Register"}
            </button>
          </div>
        )}

        {fromFavourites && (
          <button
            onClick={() => handleRemoveFavourite(event.id)}
            className="mt-3 text-xs font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            Remove from favourites
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left: Our Events */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">
            Our Events
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Right: Registered & Favourites */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-purple-500 pb-2">
            Your Events
          </h1>

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Registered Events
          </h2>
          {registered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {registered.map((event) => (
                <EventCard key={event.id} event={event} showActions={false} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              You haven't registered for any events yet.
            </p>
          )}

          <hr className="my-6 border-t-2 border-gray-200" />

          <h2 className="text-xl font-bold text-gray-800 mb-3">Favourites</h2>
          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favourites.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  fromFavourites={true}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Your list of favourite events is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
