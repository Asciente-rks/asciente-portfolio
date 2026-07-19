/* ============================================================
   PROJECT FILE — safe to edit, no coding knowledge needed.

   WHAT YOU CAN CHANGE HERE:
   - Any text between quotes ("...") — titles, descriptions, captions.
   - `status`: "live", "in-dev", or "archived".
   - `gallery`: add/remove lines. `src` is the image path inside
     src/assets/, `caption` is the label shown under it.
   - `tech`: the short chips shown on the project card (max 5 shown).
   - `techGroups`: the "Stack used" section on the project page.
   - `cost.rows`: the free-tier cost table.

   RULES: keep the commas and quotes exactly as they are.
   After editing, commit the change — the site rebuilds itself.
   ============================================================ */
import type { Project } from "./types";

export const h100Ecolodge: Project = {
  slug: "h100-ecolodge",
  title: "H100 Ecolodge",
  status: "archived",
  tagline: "A commercial booking engine for an ecolodge — built under zero-cost infrastructure constraints as the client requested. Delivered as a school capstone.",
  summary: "Spring Boot + Spring Data JPA backend with MySQL on Aiven, vanilla HTML/CSS/JS on the customer-facing storefront, and a full admin panel for bookings, rooms, halls, catering, payments, and analytics. No live deployment — handed off to the client.",
  tech: [
    "Java 17",
    "Spring Boot",
    "Spring Data JPA",
    "Spring Security",
    "MySQL",
    "Aiven",
    "HTML",
    "CSS",
    "JavaScript",
    "Maven",
  ],
  techGroups: [
    {
      label: "Backend",
      items: [
        "Java 17",
        "Spring Boot 3",
        "Spring MVC",
        "Spring Data JPA",
        "Hibernate",
        "Spring Security (session-based)",
        "Maven",
      ],
    },
    {
      label: "Database",
      items: ["MySQL", "Aiven (free tier)"],
    },
    {
      label: "Frontend (storefront)",
      items: ["HTML5", "CSS3", "Vanilla JavaScript", "Bootstrap-style layouts"],
    },
    {
      label: "Frontend (admin)",
      items: ["HTML5", "CSS3", "Vanilla JavaScript", "Charting library for analytics"],
    },
    {
      label: "Hosting",
      items: ["Java host (Render / Railway)", "Aiven (DB)"],
    },
  ],
  sourceUrl: "https://github.com/Ecolodge-STI/EcoWeb",
  cinematicUrl: "/cinematics/h100-ecolodge",
  cinematicCaption: "An 8-scene walkthrough of H100 Ecolodge — a real Philippine hospitality booking engine built as a school capstone. Storefront, catalog, booking flow, admin operations, audit trail. Click anywhere or press → / Space to advance.",
  thumbnail: "H100/ADMIN_Login.png",
  gallery: [
    {
      src: "H100/ADMIN_Login.png",
      caption: "Admin login",
    },
    {
      src: "H100/CXUI_Homepage.png",
      caption: "Customer homepage",
    },
    {
      src: "H100/CXUI_Hompage2.png",
      caption: "Customer homepage — secondary view",
    },
    {
      src: "H100/CXUI_Halls.png",
      caption: "Function halls catalog",
    },
    {
      src: "H100/CXUI_Rooms.png",
      caption: "Rooms catalog",
    },
    {
      src: "H100/CXUI_Catering.png",
      caption: "Catering catalog",
    },
    {
      src: "H100/CXUI_BranchSelection.png",
      caption: "Branch selection",
    },
    {
      src: "H100/CXUI_Bookings.png",
      caption: "Customer bookings",
    },
    {
      src: "H100/CXUI_Bookings2.png",
      caption: "Customer bookings — detail view",
    },
    {
      src: "H100/ADMIN_Dashboard.png",
      caption: "Admin dashboard",
    },
    {
      src: "H100/ADMIN_Dashboard2.png",
      caption: "Admin dashboard — analytics",
    },
    {
      src: "H100/ADMIN_Booking.png",
      caption: "Admin bookings",
    },
    {
      src: "H100/ADMIN_Booking2.png",
      caption: "Admin bookings — detail",
    },
    {
      src: "H100/ADMIN_ManageRooms.png",
      caption: "Manage rooms",
    },
    {
      src: "H100/ADMIN_ManageRooms2.png",
      caption: "Manage rooms — detail",
    },
    {
      src: "H100/ADMIN_Payments.png",
      caption: "Payments",
    },
    {
      src: "H100/ADMIN_Payments2.png",
      caption: "Payments — ledger",
    },
    {
      src: "H100/ADMIN_PaymentLogs.png",
      caption: "Payment logs",
    },
    {
      src: "H100/ADMIN_ReservationLogs.png",
      caption: "Reservation logs",
    },
    {
      src: "H100/ADMIN_SystemLogs.png",
      caption: "System logs",
    },
    {
      src: "H100/ADMIN_DataAnalytics.png",
      caption: "Data analytics",
    },
    {
      src: "H100/ADMIN_ManageUsers.png",
      caption: "Manage users",
    },
    {
      src: "H100/ADMIN_ManageUsers2.png",
      caption: "Manage users — detail",
    },
    {
      src: "H100/ADMIN_EmployeeManagement.png",
      caption: "Employee management",
    },
    {
      src: "H100/ADMIN_Content.png",
      caption: "Content management",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "Java host (Render / Railway)",
        freeTier: "free-tier with sleep behavior",
        weUse: "within free tier",
        headroom: "within limits",
      },
      {
        service: "MySQL (Aiven)",
        freeTier: "Free DB tier",
        weUse: "<100 MB",
        headroom: "95%+",
      },
      {
        service: "Static frontend hosting",
        freeTier: "unlimited bandwidth on most providers",
        weUse: "<1 GB/mo",
        headroom: "99%",
      },
    ],
  },
};
