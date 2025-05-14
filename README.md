
# tutor-client
## 🛠️ Technologies Used

- **react**
- **TypeScript**
- **next js**
- **tailwnd css**
- **Multer**
- **react dom**
- **shadcn**
- **daisyui**
- **magic ui**
- **zod**

 ## Fronted Setup
1.Install All dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
3.Set up environment variables in a .env.local file:
```bash
CLOUDINARY_CLOUD_NAME=dhobkuiqj 
CLOUDINARY_API_KEY=342361686225584
CLOUDINARY_API_SECRET=K4AhK_3bvJSMKNsRfCJrGrvgTIo
NEXT_PUBLIC_BASE_URL=https://tutorlink-server-side.vercel.app/api/v1
```
3.Start the build your code:
``` bash
npm run build
```
4.Start the development Frontend:
``bash
npm run dev
```
# 🎓 TutorLink — Find & Connect with the Best Tutors

TutorLink is a modern, full-stack tutoring platform that helps students discover tutors, book sessions, and manage their learning journey. It empowers tutors to create professional profiles, set availability, and manage bookings with ease. Built with the MERN stack and optimized for performance, security, and user experience.

## 🚀 Live Demo

- **Frontend:** [https://job-placement-tutorlink-client.vercel.app)
- **Backend API:** [https://job-placement-tutorlink-server.vercel.app)

---

- **Home Page**
  - Hero section with search functionality
  - Platform highlights (secure payments, verified profiles)
  - Testimonials & CTAs

- **Browse Tutors**
  - Filter by subject, price, author, and title
  -Search by subject, price, author, and title
  - Display tutor cards with profile snapshot

- **Tutor Profile**
  - Tutor bio, subjects, pricing, and ratings
  - Availability calendar with booking option
  - Student reviews

- **About Us**
  - Platform mission, vision, and team
  - Success stories

- **FAQ**
  - Common platform-related queries categorized by topics

- **News/Blog**
  - Dynamic content via open-source blog/news API
  - Educational tips, industry news, and platform updates
  - Search functionality for articles

---

#### 👨‍🎓 Student Dashboard
- Update profile
- View past bookings and payment history
- View past bookings request history

#### 👩‍🏫 Tutor Dashboard
- Manage profile and subjects
- Set available time slots
- View bookings and earnings

#### 💳 Checkout Page
- Secure SSLCommerz
- Dynamic price calculation based on selected hours
- Auto-update tutor earnings after successful transaction

---
## ⚙️ Tech Stack

### Frontend
- **Framework:** Next.js  (SEO-optimized with SSR/SSG)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### Backend
- **Server:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt

### Payment Integration
- **Gateways:** SSLCommerz

### Deployment
- **Frontend:** Vercel
- **Backend:** Render or Vercel
- **Database:** MongoDB Atlas

---
## 🛡️ Authentication & Role Management

- Role-based access control for `student` and `tutor`
- JWT token stored securely for protected routes
- Middleware for protected API access

---

## 🧪 Key Functional Modules

- **User Auth:** Registration, login, role-based dashboards
- **Tutor Management:** Profile creation, subject assignment, availability setup
- **Booking System:** Create, update, cancel, view bookings
- **Review System:** Submit ratings/comments, calculate average
- **Payment Gateway:** End-to-end integration with SSLCommerz/Stripe/PayPal

---
