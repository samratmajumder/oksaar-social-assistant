# Social Media Assistant

A web application that automates social media management across X, LinkedIn, and personal blogs using LLMs (Large Language Models).

## Features

- **Content Generation**: Automatically generate unique posts based on user interests and preferences.
- **Multi-Platform Support**: Publish to X (Twitter), LinkedIn, and prepare content for blog posts.
- **Interaction Management**: Monitor and respond to comments with a human-like delay.
- **User Customization**: Set preferred topics, tone, purpose, and scheduling.
- **Approval Workflow**: Review and approve content before it's published.

## Technology Stack

### Frontend
- React.js
- Material UI
- Axios for API calls
- React Router for navigation

### Backend
- Python with Flask
- JWT-based authentication
- MongoDB for data storage
- OpenAI-compatible API integration

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8 or higher
- MongoDB
- API keys for social media platforms and LLM services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/social-assistant.git
   cd social-assistant
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   cp .env.example .env  # Edit this file with your API keys and settings
   ```

4. Start the MongoDB service on your machine.

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python run.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
social-assistant/
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context for state management
│   │   ├── pages/             # Page components
│   │   └── App.js             # Main application component
│   └── package.json           # Frontend dependencies
│
├── backend/                   # Flask backend
│   ├── app/
│   │   ├── routes/            # API endpoints
│   │   ├── models.py          # Database models
│   │   ├── services/          # Business logic and external API integration
│   │   └── __init__.py        # Flask app initialization
│   ├── run.py                 # App entry point
│   └── requirements.txt       # Backend dependencies
│
└── README.md                  # Project documentation
```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Create a new user account
  - `POST /api/auth/login` - Authenticate a user

- **Profile Management**
  - `GET /api/profile` - Get user profile
  - `PUT /api/profile` - Update user profile

- **Posts**
  - `GET /api/posts` - Get user posts
  - `GET /api/posts/{post_id}` - Get specific post
  - `POST /api/posts/generate` - Generate a new post
  - `PUT /api/posts/{post_id}/approve` - Approve a post for publishing
  - `PUT /api/posts/{post_id}/reject` - Reject a post

- **Interactions**
  - `GET /api/interactions` - Get post interactions
  - `GET /api/interactions/stats` - Get interaction statistics

## License

This project is licensed under the MIT License.