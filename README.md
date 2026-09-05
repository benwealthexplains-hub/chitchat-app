# ChitChat — Testing Version (v1)

Yeh tumhari ChitChat app ka working code hai — Email/Password login, real-time
1-on-1 messaging, Firebase (Firestore) ke sath connected.

## Kya Included Hai (Is Version Me)

- Signup / Login (email + password)
- Chats list (real-time)
- New Chat (koi bhi registered user select karo)
- 1-on-1 messaging (real-time, Firestore se)
- Profile / Settings screen (logout)

## Abhi Included Nahi Hai (Baad Me)

- Photos/media bhejna (Storage ke liye Blaze plan/card chahiye — jab ready ho tab add karenge)
- Groups
- Voice/Video calls
- Status/Stories

---

## Step 1 — Apne Computer Pe Chalao (Local Testing)

Zaroorat: [Node.js](https://nodejs.org) installed hona chahiye (LTS version).

```bash
npm install
npm run dev
```

Terminal me ek link dikhega jaisa `http://localhost:5173` — usay browser me kholo.

---

## Step 2 — Firestore Security Rules Lagao (Zaroori — Ek Dafa Ka Kaam)

Abhi tumhara Firestore "test mode" me hai jo 30 din baad expire ho jata hai aur
sab ko sab data padhne/likhne deta hai. Iski jagah proper rules lagane hain:

1. Firebase Console kholo → apna project (`chitchat-app`) → left sidebar me **Firestore Database**
2. Upar **"Rules"** tab pe click karo
3. Wahan jo bhi likha hai usay **poora delete** karo
4. Is project ke andar `firestore.rules` file khol kar uska poora content **copy** karo
5. Firebase console ke rules box me **paste** karo
6. **"Publish"** button click karo

Bas — ab sirf logged-in users, aur sirf chat ke members hi apna data dekh/likh sakenge.

---

## Step 3 — Vercel Pe Deploy Karo (Taake Link Sabko Bhej Sako)

### Option A: GitHub Ke Through (Recommended)

1. Is poore folder ko GitHub pe ek naye repository me upload karo
   (GitHub website pe "New Repository" → phir "uploading an existing file" wala option use kar sakte ho, ya `git push` command se)
2. [vercel.com](https://vercel.com) pe jao → GitHub se login karo
3. **"Add New Project"** → apna GitHub repo select karo
4. Vercel khud detect kar lega ke yeh Vite/React project hai — kuch change mat karo
5. **"Deploy"** click karo
6. 1-2 minute me ek live link mil jayega (jaisa `chitchat-app.vercel.app`)

### Option B: Vercel CLI Se (Agar Terminal Comfortable Ho)

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 4 — Testing Shuru Karo

1. Apna live link (Vercel wala) apne 2-3 test users ko bhejo
2. Har koi **Sign Up** kare apni email/password se
3. Kisi bhi user ke "New Chat" (+ button) me jaake doosre registered user ko select karo
4. Real-time messages bhejo — dono taraf turant aana chahiye

Agar koi bug aaye ya kuch samajh na aaye, mujhe bata dena — is chat me hi
wapas aa jana, main file(s) update kar dunga.

---

## Project Structure (Reference Ke Liye)

```
src/
├── firebase.js              # Firebase config + init
├── context/
│   └── AuthContext.jsx      # Login/signup/logout state
├── lib/
│   ├── chat.js              # Firestore chat/message functions
│   └── format.js            # Helper functions (initials, time)
├── components/
│   ├── BottomNav.jsx        # Bottom navigation (Chats/Profile)
│   └── ProtectedRoute.jsx   # Redirects to login if not authenticated
└── pages/
    ├── Login.jsx
    ├── Signup.jsx
    ├── ChatsList.jsx
    ├── NewChat.jsx
    ├── ChatRoom.jsx
    └── Profile.jsx
```
