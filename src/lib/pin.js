// Hash a 4-digit PIN using SHA-256 so we never store it as plain text.
export async function hashPin(pin) {
  const enc = new TextEncoder().encode(pin);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// "Unlocked" is remembered per-tab (sessionStorage), per-account.
// Closing the tab / opening a new one will ask for the PIN again.
function key(uid) {
  return `chitchat_unlocked_${uid}`;
}

export function isSessionUnlocked(uid) {
  return sessionStorage.getItem(key(uid)) === "true";
}

export function markSessionUnlocked(uid) {
  sessionStorage.setItem(key(uid), "true");
}

export function clearSessionUnlock(uid) {
  sessionStorage.removeItem(key(uid));
}
