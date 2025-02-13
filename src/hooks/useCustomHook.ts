import { useState, useEffect } from "react";

export const useCustomHook = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    setData("Hello from custom hook!");
  }, []);

  return data;
};
