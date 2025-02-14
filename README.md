# React Native Chat Application

## Overview

This project is a **React Native application** featuring authentication, a mocked chat interface, file/image attachments in the chat, and user profile management. The app is designed to be well-structured, maintainable, and showcase expertise in React Native development.

## Features

### 1. Authentication (Mocked)

- Simple login screen with **email and password authentication**.
- Hardcoded credentials:
  - **Email:** `test@example.com`
  - **Password:** `password123`
- Securely stores login state.
- Redirects users to the **Chat Page** upon successful login.

### 2. Chat Page (Mocked)

- Interactive **chat interface** for sending and receiving messages.
- The chat is **fully mocked** without actual OpenAI API integration.
- Stores chat history in memory for the session.

#### File Upload & Sharing

- Users can **attach images or files** from their device in chat.
- Preview uploaded files before sending.
- Supports multiple file types with user feedback for unsupported formats.

#### Optional: Speech-to-Text

- **Speech-to-text functionality** for voice message input.
- Converts speech to text before sending.

### 3. Profile Page

- Displays **user details** (name, email, profile picture).
- Allows users to **edit their profile** with local storage for changes.

### 4. Navigation

- Implemented with **React Navigation**.
- Enables seamless switching between **Chat** and **Profile** pages.
- Includes a **navigation bar** for easy access.

## Setup Instructions

### Prerequisites

- Install **Node.js** and **npm** or **yarn**.
- Install **Expo CLI**.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run start
   ```
   Or use specific platform commands:
   ```sh
   npm run android   # For Android
   npm run ios       # For iOS
   npm run web       # For Web
   ```

## Evaluation Criteria

Submissions will be assessed based on:

- **Code Quality:** Clean, modular, maintainable structure.
- **User Experience:** Intuitive UI, smooth interactions.
- **Functionality:** Proper implementation of authentication, chat, and file upload.
- **Performance:** Efficient handling of chat and user interactions.
- **State Management:** Proper application state handling.
- **Bonus:** Speech-to-text functionality for improved usability.

## Submission Guidelines

- Upload your project to **GitHub or GitLab**.
- Include this **README** with setup instructions.
- Provide a **demo video** or **screenshots** showcasing the app.

---

### 🔥 Happy Coding! 🚀
