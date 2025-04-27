## 🧩 API Documentation

All endpoints require a valid `Authorization` header.

### 🔐 Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

### 📥 `GET /api/users`

**Description:** Get list of users (optionally filtered by search).

**Query Params:**

- `search` (optional): Filters users by first name, last name, or email.

**Response:**

```json
{
  "data": {
    "users": [ /* array of User objects */ ]
  },
  "message": "success"
}
```

---

### 📥 `GET /api/users/:id`

**Description:** Get a specific user by ID.

**Response:**

```json
{
  "data": {
    "user": { /* user object */ }
  },
  "message": "success"
}
```

---

### 📤 `POST /api/users`

**Description:** Create a new user.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",      // optional
  "email": "john@example.com",
  "status": "active",     // must be one of UserStatus
  "dateOfBirth": "1990-01-01"
}
```

**Response:**

```json
{
  "data": {
    "user": { /* created user object */ }
  },
  "message": "User created successfully"
}
```

---

### ✏️ `PUT /api/users/:id`

**Description:** Update a user.

**Request Body:** Same as `POST /api/users`

**Response:**

```json
{
  "data": {
    "user": { /* updated user object */ }
  },
  "message": "User updated successfully"
}
```

---

### ❌ `DELETE /api/users/:id`

**Description:** Delete a user.

**Response:**

```json
{
  "data": {},
  "message": "User deleted successfully"
}
```

---

### 📦 Error Responses

- `401 Unauthorized` → if token is missing/invalid.
- `404 Not Found` → if user is not found.
- `400 Unprocessable Entity` → if input is invalid.
- `500 Server Error` → on unexpected failure.
