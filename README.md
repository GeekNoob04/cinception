# 🧠 Movie App Project
This project is a comprehensive movie application built with React, utilizing Redux for state management, and Firebase for authentication. It features a watchlist, movie details, and a search function powered by GPT. The app is designed to be responsive and user-friendly.

## 🚀 Features
- **User Authentication**: Secure login and signup functionality using Firebase.
- **Movie Watchlist**: Users can add and remove movies from their personalized watchlist.
- **Movie Details**: Detailed information about each movie, including trailers and reviews.
- **GPT Search**: A search function powered by GPT technology for finding movies.
- **Responsive Design**: The app is fully responsive, ensuring a great user experience across all devices.

## 🛠️ Tech Stack
- **Frontend**: React, Redux, React Router
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux, Redux Persist
- **Search Functionality**: GPT (Gemini)
- **API**: TMDB API for movie data

## 📦 Installation
To get started with the project, follow these steps:
1. Clone the repository: `git clone https://github.com/your-repo/movie-app.git`
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm run dev` or `yarn dev`

## 💻 Usage
- Run `npm run dev` to start the development server.
- The app will be available at `http://localhost:3000`.
- Use `npm run build` to build the app for production.
- Use `npm run preview` to preview the production build.

## 📂 Project Structure
```markdown
.
├── public
│   ├── favicon.svg
│   ├── index.html
│   └── manifest.json
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── utils
│   │   ├── appStore.jsx
│   │   ├── configSlice.jsx
│   │   ├── favoritesSlice.jsx
│   │   ├── firebase.jsx
│   │   ├── gptSlice.jsx
│   │   ├── moviesSlice.jsx
│   │   └── userSlice.jsx
│   └── components
│       ├── Body.jsx
│       ├── Header.jsx
│       ├── MovieCard.jsx
│       ├── SearchBar.jsx
│       └── Watchlist.jsx
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
└── vite.config.js
```

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📬 Contact
Your Name - [@yourTwitter](https://twitter.com/yourTwitter) - [youremail@example.com](mailto:youremail@example.com)

## 💖 Thanks Message
Thanks for considering our project! This is written by [readme.ai](https://readme-generator-phi.vercel.app/).
