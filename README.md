# 🎬 Movie Discovery App

This project is a React-based web application designed to provide users with an engaging movie browsing experience. It leverages Redux for state management, React Router for navigation, and Firebase for authentication. Users can browse movies, search for specific titles, manage a watchlist, and enjoy personalized recommendations. The application integrates with the Google Gemini API for enhanced search capabilities and persists user data across sessions.

## 🚀 Key Features

- **User Authentication:** Secure sign-up and sign-in functionality using Firebase.
- **Movie Browsing:** Browse a wide selection of movies across various categories (Now Playing, Popular, Top Rated, Upcoming).
- **GPT-Powered Search:** Utilize the Google Gemini API for intelligent movie suggestions.
- **Watchlist Management:** Add and remove movies from a personal watchlist.
- **Persistent State:** Redux Persist ensures user data and preferences are saved across sessions.
- **Dynamic Routing:** React Router provides seamless navigation between different sections of the application.
- **Responsive Design:** The application is designed to be responsive and accessible on various devices.
- **Language Configuration:** Allows users to change the language setting of the application.

## 🛠️ Tech Stack

- **Frontend:**
    - React: JavaScript library for building user interfaces
    - React Router: For handling navigation
    - Redux: For state management
    - Redux Persist: For persisting the Redux store
    - Tailwind CSS: For styling
    - react-icons: For icons
- **Backend:**
    - Firebase: For authentication
    - Google Gemini API: For AI-powered search
- **State Management:**
    - Redux Toolkit: For simplified Redux development
- **Build Tools:**
    - Vite: For fast development builds
- **API Integration:**
    - The Movie Database (TMDb) API: For fetching movie data

## 📦 Getting Started / Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase project set up with authentication enabled
- Google Gemini API key

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/GeekNoob04/cinception
    cd <project_directory>
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Configure environment variables:

    - Create a `.env` file in the root directory.
    - Add the following environment variables, replacing the placeholders with your actual values:

    ```
    VITE_FIREBASE_API_KEY=<your_firebase_api_key>
    VITE_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
    VITE_FIREBASE_PROJECT_ID=<your_firebase_project_id>
    VITE_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
    VITE_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
    VITE_FIREBASE_APP_ID=<your_firebase_app_id>
    VITE_GEMINI_KEY=<your_gemini_api_key>
    ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 📂 Project Structure

```
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Body.jsx
│   │   ├── Browse.jsx
│   │   ├── ErrorPage.jsx
│   │   ├── Footer.jsx
│   │   ├── GptMovieSuggestions.jsx
│   │   ├── GptSearch.jsx
│   │   ├── GptSearchBar.jsx
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── MainContainer.jsx
│   │   ├── SecondaryContainer.jsx
│   │   └── Watchlist.jsx
│   ├── hooks/
│   │   └── useMovieTrailer.jsx
│   ├── utils/
│   │   ├── Validate.jsx
│   │   ├── appStore.jsx
│   │   ├── configSlice.jsx
│   │   ├── constant.jsx
│   │   ├── favoritesSlice.jsx
│   │   ├── firebase.jsx
│   │   ├── gemini.jsx
│   │   ├── gptSlice.jsx
│   │   ├── moviesSlice.jsx
│   │   └── userSlice.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 📸 Screenshots

<img width="1439" height="790" alt="Screenshot 2025-08-03 at 11 04 20 AM" src="https://github.com/user-attachments/assets/0d3d96cb-e72e-4058-8d20-a85b714504d5" />

<img width="1419" height="781" alt="Screenshot 2025-08-03 at 11 05 18 AM" src="https://github.com/user-attachments/assets/bd3d3bf6-d2a1-473a-9890-6c5363d94de6" />

<img width="1426" height="779" alt="Screenshot 2025-08-03 at 11 08 20 AM" src="https://github.com/user-attachments/assets/1de45679-d5d5-4152-9446-bb8c795a5db6" />


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [harshitbudhraja0@gmail.com](mailto:harshitbudhraja0@gmail.com).

## 💖 Thanks

Thank you for checking out this project! I hope you find it useful and enjoyable. Your feedback and contributions are highly appreciated.

This README.md file is generated by [readme.ai](https://readme-generator-phi.vercel.app/).
