# SportifsEvents-NestJs

A NestJS-based backend application for managing sports events with authentication, user management, and event organization capabilities.

## 🚀 Features


- User Authentication (Sign up/Sign in)
- JWT-based Authorization
- User Management
- Sports Events Management
  - Create Events
  - Update Event Details
  - Delete Events
  - List Events
  - Event Registration
- MongoDB Integration
- Role-based Access Control

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **API Documentation:** Swagger/OpenAPI (to be implemented)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/HakiMohamed/SportifsEvents-NestJs.git
cd SportifsEvents-NestJs
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Run the application:

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## 📡 API Endpoints

### Authentication

#### Sign Up

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

#### Sign In

```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "roles": ["user"]
  },
  "access_token": "jwt_token"
}
```

### Events

#### Create Event

```http
POST /events
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Football Tournament",
  "description": "Annual football tournament",
  "date": "2024-04-01T10:00:00Z",
  "location": "Sports Complex",
  "sport": "Football",
  "maxParticipants": 20,
  "price": 50
}
```

#### List Events

```http
GET /events
```

#### Get Specific Event

```http
GET /events/{eventId}
```

#### Update Event

```http
PUT /events/{eventId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Updated Football Tournament",
  "description": "Updated description"
  // ... other fields
}
```

#### Delete Event

```http
DELETE /events/{eventId}
Authorization: Bearer {jwt_token}
```

#### Register for Event

```http
POST /events/{eventId}/register
Authorization: Bearer {jwt_token}
```

## 📂 Project Structure

```
src/
├── auth/           # Authentication module
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/          # Users module
│   ├── user.model.ts
│   └── users.module.ts
├── events/         # Events module
│   ├── events.controller.ts
│   ├── events.module.ts
│   ├── events.service.ts
│   ├── event.model.ts
│   └── dto/
│       ├── create-event.dto.ts
│       └── update-event.dto.ts
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Event Data Model

```typescript
interface Event {
  title: string;
  description: string;
  date: Date;
  location: string;
  sport: string;
  maxParticipants: number;
  organizer: User;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚧 Future Roadmap

- Implement comprehensive event search and filtering
- Add payment integration for event registration
- Develop admin dashboard for event management
- Implement real-time notifications for event updates
- Create participant management features
- Add geographical event recommendations
- Develop mobile app companion

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Your Name - Mohamed haki 

<<<<<<< HEAD
Project Link: [https://github.com/HakiMohamed/SportifsEvents-NestJs](https://github.com/HakiMohamed/SportifsEvents-NestJs)
=======
Project Link: [https://github.com/HakiMohamed/SportifsEvents-NestJs](https://github.com/HakiMohamed/SportifsEvents-NestJs)
>>>>>>> 1cdbf3d5ffaa55d6fe3e921088c012cc204543f0
