import { z } from "zod";

const auStandardPhone = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

export const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .refine((val) => auStandardPhone.test(val.replace(/\s/g, "")), {
      message: "Please enter a valid Australian phone number",
    }),
  service: z.string().min(1, "Please select a service"),
  practitioner: z.string().optional().default(""),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  message: z.string().max(1000, "Message is too long").optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().max(20, "Phone number is too long").optional().default(""),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters").max(2000, "Message is too long"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  shortDescription: z.string().trim().min(10).max(220),
  description: z.string().trim().min(20).max(4000),
  duration: z.string().trim().max(60).optional().default(""),
  price: z.string().trim().max(60).optional().default(""),
  image: z.string().trim().max(300).optional().default(""),
  isActive: z.boolean().default(true),
});

export const practitionerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  specialization: z.string().trim().min(2).max(160),
  experience: z.string().trim().max(120).optional().default(""),
  bio: z.string().trim().min(20).max(4000),
  shortBio: z.string().trim().min(10).max(300),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  patientName: z.string().trim().min(2).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().trim().min(10).max(1000),
  isPublished: z.boolean().default(true),
});

export const clinicSettingsSchema = z.object({
  clinicName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(30),
  email: z.string().trim().email(),
  address: z.string().trim().max(200),
  suburb: z.string().trim().max(100),
  state: z.string().trim().max(10),
  postcode: z.string().trim().max(10),
  googleMapsUrl: z.string().trim().max(500).optional().default(""),
  instagram: z.string().trim().max(300).optional().default(""),
  facebook: z.string().trim().max(300).optional().default(""),
  emergencyMessage: z.string().trim().max(300).optional().default(""),
});
