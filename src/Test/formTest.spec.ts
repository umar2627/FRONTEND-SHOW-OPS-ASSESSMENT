import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; 

describe("EventForm Component", () => {
  it("renders the form with initial state", () => {
    render(<EventForm/>);

    expect(screen.getByLabelText(/Event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Video/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Banner image/i)).toBeInTheDocument();
  });

  it("displays an error when submitting an empty form", async () => {
    render(<EventForm />);

    fireEvent.click(screen.getByText(/Create event/i));

    await waitFor(() => {
      expect(screen.getByText(/Missing Event Name/i)).toBeInTheDocument();
      expect(screen.getByText(/, Description/i)).toBeInTheDocument();
    });
  });

  it("allows uploading and previewing an image", async () => {
    render(<EventForm />);

    const fileInput = screen.getByLabelText(/Banner image/i).querySelector("input[type='file']")!;
    const file = new File(["(⌐□_□)"], "banner.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText(/banner.png/i)).toBeInTheDocument();
    });
  });

  it("removes the uploaded image", async () => {
    render(<EventForm />);

    const fileInput = screen.getByLabelText(/Banner image/i).querySelector("input[type='file']")!;
    const file = new File(["(⌐□_□)"], "banner.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText(/banner.png/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /trash/i }));

    await waitFor(() => {
      expect(screen.queryByAltText(/banner.png/i)).not.toBeInTheDocument();
    });
  });

  it("resets the form when cancel button is clicked", async () => {
    render(<EventForm />);

    fireEvent.change(screen.getByLabelText(/Event name/i), { target: { value: "Test Event" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "This is a test event description." } });

    fireEvent.click(screen.getByText(/Cancel/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Event name/i)).toHaveValue("");
      expect(screen.getByLabelText(/Description/i)).toHaveValue("");
    });
  });
});
