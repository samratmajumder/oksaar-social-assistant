Below is a detailed **Software Design Document** for your online app, an intelligent social assistant that automates social media management across X, LinkedIn, and a personal blog. This document is structured to provide clear, step-by-step instructions and a comprehensive architecture overview, enabling a team of human developers and coding LLMs to build the application without ambiguity.

---

# Software Design Document: Intelligent Social Assistant

## 1. Introduction

### 1.1 Purpose
This document outlines the design of an online, password-authenticated application that acts as an intelligent social assistant. The assistant leverages Large Language Models (LLMs) via OpenAI-compatible APIs to automate the creation, management, and interaction of social media posts across X, LinkedIn, and a personal blog. The system aims to streamline social media engagement while ensuring cost efficiency and personalization.

### 1.2 Scope
The application will:
- Allow users to initialize their preferences and interests.
- Generate unique social media posts based on web searches and user criteria.
- Manage post approval and automatic posting to X and LinkedIn.
- Monitor and respond to post replies with a human-like delay.
- Provide a REST API for system management.
- Support up to a dozen concurrent users with efficient LLM usage.

### 1.3 Audience
This document targets software developers and architects, including human developers and coding LLMs. It assumes basic knowledge of web development, REST APIs, and LLM integration.

---

## 2. System Overview

### 2.1 Architecture
The system uses a **microservices architecture** for modularity and ease of development. Key components include:

- **User Interface (UI):** A web-based interface for user interaction.
- **Backend Services:**
  - **Authentication Service:** Manages user login and security.
  - **Profile Service:** Stores user preferences and settings.
  - **Content Generation Service:** Generates posts using LLMs and web searches.
  - **Post Management Service:** Handles post storage, approval, and scheduling.
  - **Interaction Service:** Monitors replies and generates responses.
  - **API Gateway:** Exposes a unified REST API.
- **Database:** Stores user data, posts, and interactions.
- **External APIs:**
  - X API for posting and monitoring.
  - LinkedIn API for posting and monitoring.
  - OpenAI-compatible APIs for LLMs (primary for posts, secondary for replies).
  - Web search API (e.g., Google Search API) for topic discovery.

**Diagram (Conceptual):**
```
[User] --> [UI] --> [API Gateway] --> [Backend Services]
                                    --> [Database]
                                    --> [External APIs]
```

### 2.2 Technology Stack
- **Frontend:** React.js (responsive UI).
- **Backend:** Node.js with Express.js (lightweight and flexible).
- **Database:** MongoDB (schema flexibility for evolving features).
- **APIs:** RESTful design with JSON payloads.
- **Authentication:** JWT (JSON Web Tokens) for secure access.
- **LLMs:** OpenAI-compatible APIs (primary and secondary models).
- **Deployment:** Docker for containerization (optional Kubernetes for future scaling).

---

## 3. Functional Requirements

### 3.1 User Initialization
- **Profile Setup:**
  - Users create a profile with:
    - List of topics of interest (e.g., "AI, sustainability, tech trends").
    - Optional URLs of interesting articles.
    - Purpose (e.g., "promote my expertise"), tone (e.g., "professional"), and search criteria (e.g., "recent news").
  - Accessible via UI and REST API.

### 3.2 Content Generation
- **Topic Discovery:**
  - System uses web search APIs to find relevant topics based on user interests.
- **Post Generation:**
  - Primary LLM API generates posts in three formats:
    - **Micro:** ≤280 characters for X.
    - **Short:** ≤700 characters for LinkedIn.
    - **Long:** Detailed content for blog.
  - Ensures uniqueness by checking against the last 100 posts.
  - Includes a suitable image (sourced or generated).
- **Scheduling:**
  - Users specify times (e.g., "9 AM daily") for lookup and generation.

### 3.3 Post Management
- **Tracking:**
  - Stores the last 100 posts to avoid repetition.
- **Approval Workflow:**
  - Posts are saved as "Pending" for user review.
  - Users approve or reject via UI or API.

### 3.4 Posting
- **Automatic Posting:**
  - Approved posts are posted to X and LinkedIn via APIs.
- **Manual Posting:**
  - Blog posts are provided as text for manual copy-paste.

### 3.5 Interaction
- **Monitoring:**
  - Tracks replies to posts on X and LinkedIn.
- **Response Generation:**
  - Uses a secondary (cheaper/free) LLM API for short, friendly responses.
  - Adds a random delay (1-5 minutes) to mimic human behavior.

### 3.6 REST API
- Provides endpoints for:
  - Viewing post status.
  - Approving/rejecting posts.
  - Generating new posts.
  - Secured with JWT.

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Supports up to 12 concurrent users with acceptable response times (e.g., <2 seconds for UI actions).

### 4.2 Scalability
- Initial design focuses on small-scale use; microservices allow future scaling.

### 4.3 Security
- Password-based authentication with JWT.
- Encrypt sensitive data (e.g., API keys).

### 4.4 Cost Efficiency
- Optimize LLM usage:
  - Primary LLM for post generation (less frequent, higher quality).
  - Secondary LLM for replies (frequent, cheaper/free).
- Cache search results to reduce API calls.

### 4.5 Personalization
- Customizable system prompts to reflect user tone and style.

---

## 5. Data Model

### 5.1 User Profile
```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "password": "hashed string",
  "topics": ["string"],
  "articleUrls": ["string"],
  "purpose": "string",
  "tone": "string",
  "searchCriteria": "string",
  "schedule": "string" // e.g., "09:00 daily"
}
```

### 5.2 Post
```json
{
  "postId": "string",
  "userId": "string",
  "content": {
    "micro": "string",
    "short": "string",
    "long": "string"
  },
  "imageUrl": "string",
  "status": "Pending | Approved | Rejected | Posted",
  "platform": "X | LinkedIn | Blog",
  "createdAt": "timestamp",
  "postedAt": "timestamp"
}
```

### 5.3 Interaction
```json
{
  "interactionId": "string",
  "postId": "string",
  "replyContent": "string",
  "response": "string",
  "respondedAt": "timestamp"
}
```

---

## 6. System Workflow

### 6.1 Initialization
1. User registers and logs in via UI.
2. User sets up profile with topics, purpose, tone, and schedule.

### 6.2 Content Generation
1. At scheduled times, the Content Generation Service:
   - Queries web search APIs for topics.
   - Uses primary LLM to generate posts (micro, short, long).
   - Checks last 100 posts for uniqueness.
   - Adds an image.
2. Post is saved as "Pending."

### 6.3 Post Approval
1. User views pending posts.
2. Approves or rejects each post.

### 6.4 Posting
1. Approved posts are:
   - Posted to X and LinkedIn via APIs.
   - Provided as text for blog (manual posting).

### 6.5 Interaction
1. Interaction Service monitors replies.
2. Generates response using secondary LLM.
3. Posts response after random delay.

---

## 7. LLM Integration

### 7.1 Primary LLM API (Post Generation)
- **Purpose:** High-quality post content.
- **Prompt Template:**
  ```
  You are an intelligent social assistant for [User's Name]. Your purpose is to [Purpose]. Write in a [Tone] tone. Generate a social media post about [Topic] in three formats: micro (≤280 chars), short (≤700 chars), and long (detailed). Ensure it’s unique and engaging.
  ```
- **Usage:** Triggered per scheduled generation.

### 7.2 Secondary LLM API (Replies)
- **Purpose:** Cost-effective, frequent responses.
- **Prompt Template:**
  ```
  You are [User's Name], replying to a comment on your post. Keep it short, friendly, and in a [Tone] tone, as if casually chatting with a friend. Reply to: [Reply Content].
  ```
- **Usage:** Triggered per reply detected.

---

## 8. API Design

### 8.1 Authentication
- **`POST /auth/register`**  
  - Input: `{ "username": "string", "email": "string", "password": "string" }`
  - Output: `{ "userId": "string", "token": "JWT" }`
- **`POST /auth/login`**  
  - Input: `{ "email": "string", "password": "string" }`
  - Output: `{ "token": "JWT" }`

### 8.2 Profile Management
- **`GET /profile`**  
  - Output: User profile data.
- **`PUT /profile`**  
  - Input: Updated profile fields.
  - Output: `{ "message": "Profile updated" }`

### 8.3 Post Management
- **`GET /posts`**  
  - Query Params: `status`, `platform`.
  - Output: List of posts.
- **`GET /posts/{postId}`**  
  - Output: Post details.
- **`POST /posts/generate`**  
  - Output: `{ "postId": "string" }`
- **`PUT /posts/{postId}/approve`**  
  - Output: `{ "message": "Post approved" }`
- **`PUT /posts/{postId}/reject`**  
  - Output: `{ "message": "Post rejected" }`

### 8.4 Interaction
- **`GET /interactions`**  
  - Output: List of interactions.

---

## 9. User Interface

### 9.1 Dashboard
- Displays recent posts, pending approvals, and interactions.

### 9.2 Profile Settings
- Form to edit topics, purpose, tone, and schedule.

### 9.3 Post Management
- Table of posts with preview, status, and action buttons.

### 9.4 Interaction View
- List of replies and responses.

---

## 10. Implementation Steps

### 10.1 Phase 1: Core Setup
1. **Authentication Service:** Implement login/register with JWT.
2. **Profile Service:** Build profile creation and updates.
3. **Content Generation Service:** Integrate web search and primary LLM.
4. **Post Management Service:** Create post storage and approval logic.

### 10.2 Phase 2: Posting and Interaction
1. Integrate X and LinkedIn APIs for posting.
2. Build Interaction Service with secondary LLM and delay logic.

### 10.3 Phase 3: UI and API
1. Develop React.js frontend.
2. Set up API Gateway with all endpoints.

### 10.4 Phase 4: Testing and Deployment
1. Test all components (unit and integration).
2. Deploy using Docker.

---

## 11. Cost Optimization
- **LLM Usage:**  
  - Primary LLM for posts (less frequent).
  - Secondary LLM (free/cheaper) for replies (frequent).
- **Caching:** Store search results for reuse.
- **Scheduling:** Limit generation frequency.

---

## 12. Personalization
- Users customize prompts via profile settings.
- Prompts stored and injected with user-specific attributes (e.g., name, tone).

---

## 13. Security
- **Authentication:** JWT with encrypted passwords.
- **Data:** Encrypt API keys and credentials in config files.

---

This document provides a complete blueprint for your intelligent social assistant app. Developers can follow the outlined steps, architecture, and specifications to build a functional, cost-efficient, and personalized system tailored to your needs.
