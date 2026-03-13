import { db } from "../firebase";
import { collection, doc, getDocs, query, where, addDoc, onSnapshot, setDoc } from "firebase/firestore";

export async function getOrCreateChat(trainerId: string, userId: string) {
  const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find(d => {
    const data = d.data();
    return data.participants && data.participants.includes(trainerId);
  });
  
  if (existingChat) {
    return { id: existingChat.id, ...existingChat.data() };
  }
  
  const newChatRef = await addDoc(collection(db, "chats"), {
    participants: [userId, trainerId],
    createdAt: new Date().toISOString(),
    lastMessage: "",
    updatedAt: new Date().toISOString()
  });
  
  return { id: newChatRef.id, participants: [userId, trainerId] };
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    text,
    timestamp: new Date().toISOString(),
    read: false
  });
  
  await setDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export function subscribeToMessages(chatId: string, callback: (messages: any[]) => void) {
  const q = query(collection(db, "chats", chatId, "messages"));
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // sorting by timestamp
    callback(msgs.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
  });
}

export async function getChatsForUser(uid: string) {
  const q = query(collection(db, "chats"), where("participants", "array-contains", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function markMessagesRead(chatId: string, uid: string) {
  // Skeleton implemented for demo
}
