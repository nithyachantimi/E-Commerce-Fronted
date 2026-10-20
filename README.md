# E-Commerce Frontend — React + Vite Authentication System

A modern, responsive e-commerce authentication interface built with **React 19**, **Vite 8**, **Material UI (MUI) 9**, and **React Router 7** using pure JavaScript.

---

## Features & Implemented Pages (7 of 7)

1. **Registration** (`/register`) — Full name, email, international phone number with searchable country selector, password with strength meter, and confirmation.
2. **Login** (`/login`) — Identifier (email or international phone number) and password. Redirects to `/home` upon authentication.
3. **Welcome Home** (`/home`) — Protected route displaying user details, welcome greeting, theme toggle, link to change password, and sign out button.
4. **Forgot Password** (`/forgot-password`) — Recovery initiation with support for email or international phone with country selector.
5. **OTP Verification** (`/verify-otp`) — 6-digit verification code with a 60-second resend cooldown timer and guidance.
6. **Reset Password** (`/reset-password`) — Secure password reset using single-use recovery authorization.
7. **Change Password** (`/change-password`) — Authenticated password update requiring current password, new password, and confirmation.

The phone field uses `react-international-phone` for country-aware formatting and `libphonenumber-js/max` for browser-side number validation. Recovery authorization is held in React memory for the reset flow and is cleared on success or when leaving that screen; it is not placed in the URL or persistent browser storage. Unsafe API requests initialize and send the CSRF cookie/header through Axios.

### Design System & Theme Support
- **Light Theme**: Modern clean white/slate palette (`#2563EB` primary, `#F8FAFC` background).
- **Dark Theme**: High-contrast dark palette (`#3B82F6` primary, `#0F172A` background).
- **Theme Toggle**: Accessible switch in the header and home page with automatic persistence.

---

## Local Setup & Running on Windows

### 1. Install Dependencies
```powershell
Set-Location "C:\Users\u\Downloads\E Commerce\E-Commerce-Frontend"
npm.cmd install
```

### 2. Configure Environment
Ensure `.env` exists with the backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```powershell
.\start-frontend.ps1
# Or run directly:
npm.cmd run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Build for Production
```powershell
npm.cmd run build
```

---

## Architecture & Project Context
See [`docs/workspace/PROJECT_CONTEXT.md`](docs/workspace/PROJECT_CONTEXT.md) for full architecture, API specifications, and database details.
