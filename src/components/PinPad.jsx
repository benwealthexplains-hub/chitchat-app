import { useEffect, useState } from "react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function PinPad({ length = 4, onComplete, shakeTrigger }) {
  const [value, setValue] = useState("");
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!shakeTrigger) return;
    setShaking(true);
    const clearValue = setTimeout(() => setValue(""), 250);
    const stopShake = setTimeout(() => setShaking(false), 450);
    return () => {
      clearTimeout(clearValue);
      clearTimeout(stopShake);
    };
  }, [shakeTrigger]);

  function press(key) {
    if (key === "back") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (key === "" || value.length >= length) return;

    const next = value + key;
    setValue(next);
    if (next.length === length) {
      onComplete(next);
    }
  }

  return (
    <div className="pinpad">
      <div className={`pin-dots ${shaking ? "pin-error" : ""}`}>
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < value.length ? "filled" : ""}`} />
        ))}
      </div>

      <div className="pin-keys">
        {KEYS.map((k, i) =>
          k === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              className={`pin-key ${k === "back" ? "pin-key-back" : ""}`}
              onClick={() => press(k)}
            >
              {k === "back" ? "⌫" : k}
            </button>
          )
        )}
      </div>
    </div>
  );
}
