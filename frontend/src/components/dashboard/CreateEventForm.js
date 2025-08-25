import React, { useState } from "react";
import { FiCalendar, FiMapPin, FiTag, FiX, FiPlus, FiFileText, FiGlobe } from "react-icons/fi";

// Professional Admin Dashboard: Create Event Form
export default function CreateEventForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    duration: "",
    mode: "", // ✅ new field
    eventCode: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});

  // Helpers
  const addTag = (raw) => {
    const cleaned = raw.trim().replace(/,+$/, "");
    if (!cleaned) return;
    const pieces = cleaned.split(",").map((t) => t.trim()).filter(Boolean);
    const next = Array.from(new Set([...tags, ...pieces]));
    setTags(next);
    setTagInput("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Event name is required";
    if (!form.description.trim())
      e.description = "Please add a short description";
    if (!form.date) e.date = "Pick a date";
    if (!form.time) e.time = "Pick a time";
    if (!form.mode) e.mode = "Please select Online or Offline";
    if (!form.location.trim())
      e.location =
        form.mode === "Online"
          ? "Meeting link is required"
          : "Location is required";
    if (!form.duration) e.duration = "Duration is required";
    if (!form.eventCode.trim()) e.eventCode = "Unique Event Code is required"; // ✅ validation

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      tags,
      datetime: form.date && form.time ? new Date(`${form.date}T${form.time}`) : null,
      id: Date.now(),
    };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log("Event created:", payload);
      alert("Event created! Check console for payload.");
    }
    setForm({
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
      duration: "",
      mode: "",
      eventCode: "",
    });
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
      duration: "",
      mode: "",
      eventCode: "",
    });
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] -mt-4 p-6 sm:p-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-300 to-indigo-300 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.10),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          Create New Event
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to publish a new event.
        </p>
      </header>

      {/* Card */}
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Event Code ✅ */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Unique Event Code
                </label>
                <input
                  type="text"
                  name="eventCode"
                  value={form.eventCode}
                  onChange={handleChange}
                  placeholder="e.g., EVT2025"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.eventCode && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.eventCode}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Monthly Tech Meetup"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What is this event about? Who should attend?"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-rose-600">{errors.date}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-rose-600">{errors.time}</p>
                )}
              </div>

              {/* Mode (Online / Offline) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mode
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="Online"
                      checked={form.mode === "Online"}
                      onChange={handleChange}
                    />
                    Online
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="Offline"
                      checked={form.mode === "Offline"}
                      onChange={handleChange}
                    />
                    Offline
                  </label>
                </div>
                {errors.mode && (
                  <p className="mt-1 text-sm text-rose-600">{errors.mode}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  min="0.5"
                  step="0.5"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {form.mode === "Online" ? "Meeting Link" : "Location"}
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder={
                    form.mode === "Online"
                      ? "e.g., Zoom/Google Meet link"
                      : "e.g., Pune, India"
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 rounded-xl border border-gray-300 px-3 py-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                    >
                      {t}
                      <button type="button" onClick={() => removeTag(t)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      tags.length ? "Add more…" : "Type and press Enter"
                    }
                    className="flex-1 min-w-[10ch] border-0 bg-transparent py-1.5 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="rounded bg-gray-100 px-2 text-sm"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={clearForm}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {(form.name ||
          form.description ||
          tags.length ||
          form.date ||
          form.time ||
          form.location ||
          //   form.mode) && (
          form.mode ||
          form.eventCode) && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Live Preview
            </h3>
            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <p>
                <span className="font-medium">Name:</span> {form.name || "—"}
              </p>
              <p>
                <span className="font-medium">When:</span> {form.date || "—"}{" "}
                {form.time || ""}
              </p>
              <p>
                <span className="font-medium">Mode:</span> {form.mode || "—"}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {form.duration ? form.duration + " hours" : "—"}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Description:</span>{" "}
                {form.description || "—"}
              </p>
              <p>
                <span className="font-medium">
                  {form.mode === "Online" ? "Meeting Link:" : "Location:"}
                </span>{" "}
                {form.location || "—"}
              </p>
              <p className="sm:col-span-2 flex flex-wrap gap-2">
                <span className="font-medium">Tags:</span>
                {tags.length
                  ? tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-700"
                      >
                        {t}
                      </span>
                    ))
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

