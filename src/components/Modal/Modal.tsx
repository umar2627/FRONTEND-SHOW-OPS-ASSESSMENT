import React, { useEffect } from "react";
import { Box, Button } from "@radix-ui/themes";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  event: object;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onEdit, event }) => {
  if (!isOpen) return null;

  return (
    <Box className="EventModalWrapper">
      <Box className="EventModal">
        <h1>
          {event.eventName} ,
          {event?.selectedDate
            ? new Date(event?.selectedDate).toDateString()
            : ""}
        </h1>
        <Button onClick={onEdit.bind(null, event)}>Edit event</Button>
        <Image
          onClick={onClose.bind(null, event.id)}
          src="./images/cross-2.svg"
          alt="Event"
          width={200}
          height={200}
        />
      </Box>
    </Box>
  );
};

export default Modal;
