Problem Statement 1

# Skill Swap Platform

### Problem Statement
Develop a Skill Swap Platform — a mini application that enables users to list their skills and request others in return.

### Created by: Team Hexica
| Name              | Email                       | Role          |
| ----------------- | --------------------------- | ------------- |
| Ansh Somani       | anshsomani05@gmail.com      | Team Leader   |
| Ambuj Jaiswal     | ambujjais1@gmail.com        | Member        |
| Utkarsh Chauhan   | utkarshcha21@gmail.com      | Member        |
| Vanshika          | vanshikasinglakkr@gmail.com | Member        |

---

**Video Link:**

---

---

### **Live Website: [https://skill-swap-3y7n.onrender.com/](https://skill-swap-3y7n.onrender.com/)**

---

---

**Admin Email: admin@skillswap.com**

**Admin Password: supersecretpassword**

---

## Screenshots

| Login Page                               | Sign Up                     |
| ---------------------------------------- | ---------------------------------------- |
| ![Login Page](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(15).png) | ![Sign Up](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(18).png) |
| **Swap Request Page** | **Dashboard** |
| ![Swap Request](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(13).png) | ![Dashboard](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(14).png) |
| **Swap Monitoring (Admin)** | **Admin Dashboard** |
| ![Swap Monitoring](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(17).png) |![Admin Dashboard](https://raw.githubusercontent.com/AnshSomani/Skill_Swap/main/images/Screenshot%20(16).png)|

---

## Key Features

### User-Facing Features
-   **Dynamic User Profiles:** Create and manage profiles with a name, location, and a profile picture that defaults to the user's first initial.
-   **Skill Marketplace:** Clearly list skills you can offer and skills you want to learn.
-   **Multi-Skill Swapping:** Propose swaps by offering one or more of your skills in exchange for one or more of another user's skills.
-   **Browse & Discover:** A clean, paginated homepage to browse other users on the platform.
-   **Search & Filter:** Easily find users by skill name or availability.
-   **Secure Authentication:** Robust login and registration system using JWT for secure sessions.
-   **Request Management:** A dedicated page to track the status of all your incoming and outgoing swap requests (Pending, Accepted, Rejected, Completed).
-   **Rating System:** After a swap is accepted, users can complete it and provide a star rating and feedback.

### Admin Features
-   **Dedicated Admin Account:** Secure login for administrators via environment variables.
-   **Admin Dashboard:** A central hub for platform management, accessible only to admins.
-   **User Management:** View all registered users, see their status (Active/Banned), and ban or unban them.
-   **Content Moderation:** Edit user profiles to remove inappropriate skill descriptions.
-   **User Deletion:** Permanently delete users from the platform.
-   **Swap Monitoring:** View a log of all swap requests that have occurred on the platform.

---

## Tech Stack

| Category      | Technology                                       |
| ------------- | ------------------------------------------------ |
| **Frontend** | React (Vite), Tailwind CSS, Axios                |
| **Backend** | Node.js, Express.js                              |
| **Database** | MongoDB (Mongoose)                               |
| **Auth** | JSON Web Tokens (JWT), bcryptjs                  |
| **Deployment**| Render                                           |

---
