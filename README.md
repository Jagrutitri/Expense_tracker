# Expense Tracker

A full-stack MERN app to add, view, filter, and delete expenses, with category-wise totals.

## Tech Stack
- MongoDB
- Express.js
- React
- Node.js

## How It's Deployed

```mermaid
<img width="142" height="344" alt="Architecture1 drawio" src="https://github.com/user-attachments/assets/f9d1c067-4b48-40cf-a331-caa23b646588" />
   ![image](https://github.com/user-attachments/assets/xxxxxxx.png)
## What Happens When You Add an Expense

```mermaid
sequenceDiagram
    participant You
    participant App as React App
    participant Server
    participant DB as Database

    You->>App: Fill the form, hit Submit
    App->>Server: "Here's a new expense"
    Server->>Server: Checks if it's valid
    alt Looks good
        Server->>DB: Save it
        DB-->>Server: Saved!
        Server-->>App: "Done, here's the saved expense"
        App-->>You: Form clears, list updates
    else Something's wrong
        Server-->>App: "Nope, here's why"
        App-->>You: Shows an error message
    end
```

## Where Everything Lives

```mermaid
flowchart LR
    A["💻 Your Code<br/>(GitHub repo)"] --> B["🌐 Vercel or Netlify<br/>hosts the React app"]
    A --> C["🌐 Render or Railway<br/>hosts the Node server"]
    C --> D["☁️ MongoDB Atlas<br/>hosts the database"]

    style A fill:#f5f5f5
    style B fill:#e8f5e9
    style C fill:#fff3e0
    style D fill:#fce4ec
```

## Setup

1. Clone the repo
2. Run `npm install` in both `client/` and `server/`
3. Add a `.env` file in `server/` with your `MONGO_URI`
4. Run the server: `npm start` (inside `server/`)
5. Run the client: `npm run dev` (inside `client/`)
