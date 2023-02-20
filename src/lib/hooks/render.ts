import { useState } from "react";

export function useRerender() {
  const [value, setValue] = useState<boolean>(false);

  function rerender() {
    setValue((value) => !value);
  }

  return [value, rerender] as const;
}
