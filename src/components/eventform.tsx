"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import datepickerStyle from "../styles/datePicker.module.css";
import { Box, Button } from "@radix-ui/themes";
import Image from "next/image";
import SelectZone from "./SelectZone";
import Modal from "./Modal/Modal";
import { useGlobalState } from "../context/GlobalState";

const EventForm = () => {
  const [events, setEvents] = useState([]);
  const [isEdit, setIsEdit] = useState(0);
  const [eventName, setEventName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeZone, setTimeZone] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");
  const [formError, setFormError] = useState<object | null>({
    eventName: "",
    description: "",
    videoLink: "",
    timeZone: "",
    startTime: null,
    endTime: null,
    selectedDate: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [state] = useGlobalState();
  const { mode } = state;

  useEffect(() => {
    const eventData = JSON.parse(localStorage.getItem("eventData") || "[]");

    if (eventData.length > 0) {
      setEvents(eventData);
      setIsModalOpen(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    if (formError?.description?.trim()) {
      hasErrors = true;
      newErrors.description = "Description should be more than 15 characters";
    }
    if (formError?.videoLink?.trim()) {
      hasErrors = true;
      newErrors.videoLink = "videoLink";
    }

    if (!eventName.trim()) {
      newErrors.eventName = "Name";
      hasErrors = true;
    }
    if (!timeZone.trim()) {
      newErrors.timeZone = "TimeZone";
      hasErrors = true;
    }
    if (!startTime) {
      newErrors.startTime = "startTime";
      hasErrors = true;
    }
    if (!endTime) {
      newErrors.endTime = "endTime";
      hasErrors = true;
    }
    if (!selectedDate) {
      newErrors.selectedDate = "selectedDate";
      hasErrors = true;
    }
    setFormError(newErrors);

    if (!hasErrors) {
      const eventData = {
        id: Math.random() * 9999,
        eventName,
        selectedDate,
        timeZone,
        startTime,
        endTime,
        description,
        videoLink,
        imagePreview,
      };
      if (isEdit) {
        delete eventData.id;
        setEvents((prev) => {
          const updatedArray = prev.map((event) =>
            event.id === isEdit ? { ...event, ...eventData } : event
          );
          localStorage.setItem("eventData", JSON.stringify(updatedArray));
          setIsEdit(0);
          return updatedArray;
        });
      } else {
        setEvents((prev) => {
          localStorage.setItem(
            "eventData",
            JSON.stringify([eventData, ...prev])
          );
          return [eventData, ...prev];
        });
      }

      setIsModalOpen(true);
      setEventName("");
      setDescription("");
      setSelectedDate(null);
      setTimeZone("");
      setStartTime(null);
      setEndTime(null);
      setVideoLink("");
      setBannerImage(null);
      setImagePreview(null);
    }
  };

  const handleEdit = (event) => {
    setEventName(event.eventName || "");
    setSelectedDate(event.selectedDate ? new Date(event.selectedDate) : null);
    setTimeZone(event.timeZone || "");
    setStartTime(event.startTime ? new Date(event.startTime) : null);
    setEndTime(event.endTime ? new Date(event.endTime) : null);
    setDescription(event.description || "");
    setVideoLink(event.videoLink || "");
    setIsEdit(event.id || 0);
    setImagePreview(event.imagePreview || null);
  };

  const handleClose = (id) => {
    setEvents((prev) => {
      const returnedArray = prev.filter((event) => event.id !== id);
      localStorage.setItem("eventData", JSON.stringify(returnedArray));
      setEventName("");
      setDescription("");
      setSelectedDate(null);
      setTimeZone("");
      setStartTime(null);
      setEndTime(null);
      setVideoLink("");
      setBannerImage(null);
      setImagePreview(null);
      return returnedArray;
    });
  };
  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    return date.getTime() > today.getTime();
  };

  const handleDateChange = (date: Date | null) => {
    if (!date || !isFutureDate(date)) {
      setSelectedDate(date);
      if (!date) {
        setFormError((prev) => ({
          ...prev,
          selectedDate: "selectedDate",
        }));
      } else {
        setFormError((prev) => ({ ...prev, selectedDate: null }));
      }
    }
  };

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVideoLink(value);

    if (value.length > 0 && !value.startsWith("https://")) {
      setFormError((prev) => ({
        ...prev,
        videoLink: "Link always should be in https form",
      }));
    } else {
      setFormError((prev) => ({ ...prev, videoLink: "" }));
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    setDescription(value);

    if (value.length > 0 && value.length < 15) {
      setFormError((prev) => ({
        ...prev,
        description: "Description should be more than 15 characters",
      }));
    } else {
      setFormError((prev) => ({ ...prev, description: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload an image.");
        return;
      }

      setBannerImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBannerImage(null);
    setImagePreview(null);
  };

  return (
    <Box className="event-form">
      <Box className="main-event-show--wrapper">
        {events.length > 0 &&
          events?.map((event) => {
            return (
              <Modal
                key={event?.id}
                isOpen={isModalOpen}
                onClose={handleClose}
                onEdit={handleEdit}
                event={event}
              />
            );
          })}
      </Box>
      {(formError?.eventName ||
        formError?.selectedDate ||
        formError?.timeZone ||
        formError?.startTime ||
        formError?.endTime ||
        formError?.description ||
        formError.videoLink) && (
        <Box className="form-error">
          <img src="./images/info-icon.svg" alt="" />
          <h1>
            Missing Event {formError.eventName && formError.eventName}
            {formError.selectedDate && `, ${formError.selectedDate}`}
            {formError.timeZone && `, ${formError.timeZone}`}
            {formError.startTime && `, ${formError.startTime}`}
            {formError.endTime && `, ${formError.endTime}`}
            {formError.videoLink && `, ${formError.videoLink}`}
            {formError.description && `, ${formError.description}`}
          </h1>
        </Box>
      )}
      <Box className="create-event">
        <h1>Create an event</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore
        </p>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box className="event-name">
          <label htmlFor="eventName">Event name</label>
          <input
            id="eventName"
            placeholder="Your event name"
            value={eventName}
            onChange={(e) => {
              setEventName(e.target.value);
              if (e.target.value.length > 0 && e.target.value.length < 3) {
                setFormError((prev) => ({
                  ...prev,
                  eventName: "Name",
                }));
              } else {
                setFormError((prev) => ({ ...prev, eventName: "" }));
              }
            }}
            className={formError.eventName && "event-error"}
          />
        </Box>
        <Box className="date-time">
          <label htmlFor="dateTime">Date & time</label>
          <Box>
            <Box>
              <Image
                src="./images/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select date(s)..."
                dateFormat="MMMM d, yyyy"
                maxDate={new Date()}
                className={`${datepickerStyle.datePickerInput} ${formError?.selectedDate && "event-error"}`}
              />
              <Image
                src="./images/chevron-down.svg"
                alt="chevron-down"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Box>
            <Box>
              <Image
                src="./images/globe.svg"
                alt="globe"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
              <SelectZone
                timeZone={timeZone}
                setTimeZone={setTimeZone}
                formErrorTimeZone={formError?.timeZone}
                setFormError={setFormError}
              />
              <Image
                src="./images/chevron-down.svg"
                alt="chevron-down"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Box>
            <Box>
              <Image
                src="./images/clock.svg"
                alt="calendar"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
              <DatePicker
                selected={startTime}
                onChange={(time) => {
                  setStartTime(time);
                  if (!time) {
                    setFormError((prev) => ({
                      ...prev,
                      startTime: "startTime",
                    }));
                  } else {
                    setFormError((prev) => ({ ...prev, startTime: "" }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Start Time"
                dateFormat="HH:mm"
                placeholderText="Select Start Time"
                className={`${datepickerStyle.datePickerInput} ${formError?.startTime && "event-error"}`}
              />
              <Image
                src="./images/chevron-down.svg"
                alt="chevron-down"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Box>
            <Box>
              <Image
                src="./images/clock.svg"
                alt="calendar"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
              <DatePicker
                selected={endTime}
                onChange={(time) => {
                  setEndTime(time);
                  if (!time) {
                    setFormError((prev) => ({
                      ...prev,
                      endTime: "endTime",
                    }));
                  } else {
                    setFormError((prev) => ({ ...prev, endTime: "" }));
                  }
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="End Time"
                dateFormat="HH:mm"
                placeholderText="Select End Time"
                className={`${datepickerStyle.datePickerInput} ${formError?.endTime && "event-error"}`}
              />
              <Image
                src="./images/chevron-down.svg"
                alt="chevron-down"
                width={18}
                height={18}
                style={{
                  filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box className="description">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Add event description..."
            value={description}
            onChange={handleDescriptionChange}
            className={formError.description && "event-error"}
          ></textarea>
        </Box>
        <Box className="video">
          <label htmlFor="videoLink">Video</label>
          <Box>
            <Image
              src="./images/link-2.svg"
              alt=""
              width={18}
              height={18}
              style={{
                filter: mode === "dark" ? "invert(100%)" : "invert(0%)",
              }}
            />
            <input
              id="videoLink"
              type="text"
              placeholder="Add video link..."
              value={videoLink}
              onChange={handleVideoLinkChange}
              className={formError.videoLink && "event-error"}
            />
          </Box>
        </Box>
        <Box className="banner-image">
          <label htmlFor="bannerImage">Banner image</label>
          <Box>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("fileInput").click();
                }}
              >
                Click to upload
              </a>
              or drag and drop SVG, PNG, JPG or GIF (recommended size
              1024x1024px)
            </p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Box>
        </Box>
        {imagePreview && (
          <Box className="PreviewImage">
            <Image src={imagePreview} alt="" width={120} height={120} />
            <Box className="ImageContent">
              <Button onClick={handleRemoveImage}>
                <Image src="./images/trash.svg" width={16} height={16} alt="" />
              </Button>
              <h1>{bannerImage?.name}</h1>
              <h3>{(bannerImage?.size / (1024 * 1024)).toFixed(2)} MB</h3>
            </Box>
          </Box>
        )}
        <Box className="form-button">
          <button type="submit" className="submit">
            {isEdit ? "Update event" : "Create event"}
          </button>
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEventName("");
              setDescription("");
              setSelectedDate(null);
              setTimeZone("");
              setStartTime(null);
              setEndTime(null);
              setVideoLink("");
              setBannerImage(null);
              setImagePreview(null);
            }}
          >
            Cancel
          </button>
        </Box>
      </form>
    </Box>
  );
};
export default EventForm;
