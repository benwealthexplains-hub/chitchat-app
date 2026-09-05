import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// Deterministic chat id so two people always land in the same 1-1 chat
export function getChatId(uidA, uidB) {
  return [uidA, uidB].sort().join("_");
}

export async function getAllUsers(excludeUid) {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs
    .map((d) => d.data())
    .filter((u) => u.uid !== excludeUid);
}

export async function findUserByEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email.trim().toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data();
}

export async function createOrGetChat(currentUser, otherUser) {
  const chatId = getChatId(currentUser.uid, otherUser.uid);
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      members: [currentUser.uid, otherUser.uid],
      memberInfo: {
        [currentUser.uid]: { name: currentUser.name, email: currentUser.email },
        [otherUser.uid]: { name: otherUser.name, email: otherUser.email },
      },
      lastMessage: "",
      lastSender: "",
      updatedAt: serverTimestamp(),
    });
  }
  return chatId;
}

export function subscribeToUserChats(uid, callback) {
  const q = query(
    collection(db, "chats"),
    where("members", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const chats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(chats);
  });
}

export function subscribeToMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(messages);
  });
}

export async function sendMessage(chatId, senderId, text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: trimmed,
    lastSender: senderId,
    updatedAt: serverTimestamp(),
  });
}
