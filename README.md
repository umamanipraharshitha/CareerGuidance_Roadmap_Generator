
# Career Guidance Roadmap Generator

A web-based application that helps students and professionals generate **personalized career roadmaps** based on their skills, interests, and goals.  
This project aims to guide users toward the right learning path with curated resources.

---

## 🚀 Features
- 🔍 **Personalized Road Map Generator** – Users provide their field of interest and can get peronalized roadmap 
- 🌐 **User-Friendly Interface** – Simple and interactive design.
- ☁️ **Cloud Integration** – Stores data securely using Firebase.
- ⚡ **Fast & Lightweight** – Built for quick access to guidance.
- **Deployed at https://csp-2-207.onrender.com** 
---

## 🛠️ Tech Stack
- **Frontend:** React Js 
- **Backend:** Node.js, Express.js  
- **Database & Auth:** Firebase
- ** AI **: Gemini API integration
- ** Charts** : React-flow , Chart JS
- **Version Control:** Git & GitHub

---

## 📂 Project Structure
```

CareerGuidance_Roadmap_Generator/
├── backend/               # Server-side code
│   ├── index.js           # Entry point for backend
│   ├── routes/            # API routes
│   └── serviceAccountKey.json (ignored in git)
├── frontend/              # HTML, CSS, JS files
├── .gitignore             # Files to ignore in Git
├── package.json           # Node.js dependencies
└── README.md              # Project documentation

````

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/umamanipraharshitha/CareerGuidance_Roadmap_Generator.git
   cd CareerGuidance_Roadmap_Generator
````

2. **Install dependencies**

   ```bash
   cd backend
   npm install && npm install dotenv

   cd frontend
   npm install
   ```

3. **Configure Firebase**

   * Add your Firebase credentials in a file named `serviceAccountKey.json` inside the `backend` folder.
   * This file is **ignored by Git** for security reasons.

4. **Run the project**

   ```bash
   cd backend
   node index.js
   cd frontend
   npm start
   ```

   Open your browser and go to:

   ```
   http://localhost:5000
   http://localhost:3000
   ```

