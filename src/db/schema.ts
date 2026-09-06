import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("etudiant"), // 'super_admin' | 'admin' | 'agent' | 'financier' | 'etudiant'
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const formations = pgTable("formations", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  price: integer("price").notNull(), // FCFA
  registrationFee: integer("registration_fee").notNull(), // FCFA
  installmentsCount: integer("installments_count").notNull().default(3),
  campus: text("campus").notNull(),
  mode: text("mode").notNull().default("Présentiel & Hybride"),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  competencies: text("competencies").notNull(), // JSON string array
  tools: text("tools").notNull(), // JSON string array
  modules: text("modules").notNull(), // JSON string array of { moduleNumber, title, description, duration }
  jobs: text("jobs").notNull(), // JSON string array
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").references(() => formations.id).notNull(),
  name: text("name").notNull(),
  campus: text("campus").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull().default("ouverte"), // 'ouverte' | 'en_cours' | 'cloturee'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentNumber: text("student_number").notNull().unique(), // e.g. FC-2025-0142
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  gender: text("gender").notNull().default("M"),
  birthDate: text("birth_date"),
  birthPlace: text("birth_place"),
  nationality: text("nationality").default("Béninoise"),
  residenceCountry: text("residence_country").default("Bénin"),
  city: text("city").default("Cotonou"),
  address: text("address"),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  previousDiploma: text("previous_diploma"),
  studyLevel: text("study_level"),
  previousSchool: text("previous_school"),
  studyField: text("study_field"),
  previousExperience: text("previous_experience"),
  guardianName: text("guardian_name"),
  guardianRelation: text("guardian_relation"),
  guardianPhone: text("guardian_phone"),
  guardianEmail: text("guardian_email"),
  formationId: integer("formation_id").references(() => formations.id).notNull(),
  promotionId: integer("promotion_id").references(() => promotions.id),
  status: text("status").notNull().default("preinscrit"), // 'preinscrit' | 'en_attente' | 'inscrit' | 'actif' | 'termine' | 'suspendu' | 'alumni'
  totalAmount: integer("total_amount").notNull().default(0),
  paidAmount: integer("paid_amount").notNull().default(0),
  remainingAmount: integer("remaining_amount").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentSchedules = pgTable("payment_schedules", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  title: text("title").notNull(), // e.g. 'Frais d\'inscription', 'Mensualité 1'
  amount: integer("amount").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("en_attente"), // 'paye' | 'en_attente' | 'en_retard'
  paidAt: text("paid_at"),
  transactionRef: text("transaction_ref"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  receiptNumber: text("receipt_number").notNull().unique(), // REC-2025-XXXX
  studentId: integer("student_id").references(() => students.id).notNull(),
  scheduleId: integer("schedule_id").references(() => paymentSchedules.id),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'MTN Mobile Money' | 'Moov Money' | 'Carte Bancaire' | 'Caisse / Espèces' | 'Virement'
  transactionRef: text("transaction_ref").notNull(),
  status: text("status").notNull().default("valide"), // 'valide' | 'en_attente' | 'rejete'
  notes: text("notes"),
  recordedBy: text("recorded_by").notNull().default("Plateforme en ligne"),
  paidAt: text("paid_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  receiptNumber: text("receipt_number").notNull().unique(),
  paymentId: integer("payment_id").references(() => payments.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  verificationCode: text("verification_code").notNull().unique(),
  qrData: text("qr_data").notNull(),
  issuedAt: text("issued_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // 'payment' | 'admission' | 'event' | 'document' | 'info'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentProjects = pgTable("student_projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  formationTitle: text("formation_title").notNull(),
  technologies: text("technologies").notNull(), // JSON string array
  teamMembers: text("team_members").notNull(), // JSON string array of { name, role, avatar }
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  isFeatured: boolean("is_featured").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companyOffers = pgTable("company_offers", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  offerType: text("offer_type").notNull(), // 'stage' | 'emploi' | 'alternance' | 'freelance'
  title: text("title").notNull(),
  location: text("location").notNull().default("Cotonou / Hybride"),
  description: text("description").notNull(),
  skillsRequired: text("skills_required").notNull(),
  deadline: text("deadline"),
  status: text("status").notNull().default("en_attente"), // 'en_attente' | 'publie' | 'archive'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnershipRequests = pgTable("partnership_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  partnershipType: text("partnership_type").notNull(), // 'Stage & Recrutement prioritaire' | 'Coaching' | 'Certification' | 'Autre'
  message: text("message"),
  status: text("status").notNull().default("nouveau"), // 'nouveau' | 'contacte' | 'cloture'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  attendeesCount: integer("attendees_count").default(0),
});

export const blogArticles = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  author: text("author").notNull().default("Équipe Pédagogique FuturCraft"),
  readTime: text("read_time").notNull().default("5 min de lecture"),
  category: text("category").notNull(),
  publishedAt: text("published_at").notNull(),
});
