# Apoint

Apoint is a web application built with Astro and Supabase that allows users to book appointments with their favorite service providers, such as hairdressers and nail salons. It also provides a platform for service providers to publish their services, attract new customers, and manage their appointments efficiently.

## Features

- **User Features:**

  - Browse and book appointments with various service providers.
  - View service details and availability.
  - Manage and cancel appointments.

- **Service Provider Features:**
  - Create and publish services.
  - Manage appointments and view customer details.
  - Receive notifications for new bookings and cancellations.

## Technologies Used

- **Frontend:** Astro
- **Backend:** Supabase (Database and Authentication)

## Installation

### **requirements**

1. **node 20+**
2. **pnpm**
3. **astro compatible IDE**
4. **docker desktop (for local supabase)**
5. **deno (for supabase functions)**

---

### **Follow these steps to set up the project locally:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/amirs18/astro-supabase-Apoint
   cd astro-supabase-Apoint
   ```

2. **install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Supabase**

   - _for local development only_

     ```bash
        pnpm dlx supabase start
        pnpm dlx supabase functions serve
     ```

- .env file

  ```env
  PUBLIC_SUPABASE_URL=your-supabase-url
  PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```
