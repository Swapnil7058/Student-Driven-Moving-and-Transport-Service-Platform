import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  Mail,
  MapPin,
  MoveRight,
  Phone,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import Logo from "/VANMAN-Logo.png";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/auth", label: "Login / Sign Up" },
];

const serviceLinks = [
  "Local Moving",
  "Long Distance Moving",
  "Packing Support",
  "Special Item Handling",
];

const highlights = [
  {
    icon: Users,
    title: "Student-Driven Team",
    description: "Helping students earn while building reliable moving support.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Workflow",
    description: "Structured registration, quote management, and job tracking.",
  },
  {
    icon: Truck,
    title: "Organized Operations",
    description: "From booking to completion, every step stays visible and managed.",
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-200">
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.18),rgba(15,23,42,0.95))]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">
              Student-Driven Moving Startup
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Moving support built to help customers relocate smoothly and help
              students manage daily and academic expenses.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              Van Man connects customer bookings, admin operations, and student
              work opportunities in one organized workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-orange-600"
            >
              Start Your Booking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/students/register"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-orange-300 hover:bg-white/5"
            >
              Join As Student
              <BriefcaseBusiness className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <img
              src={Logo}
              alt="Van Man logo"
              className="h-24 w-auto object-contain"
            />
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              A student-led moving and transport platform created to deliver
              trustworthy relocation support while creating structured earning
              opportunities for students.
            </p>

            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-500/15 p-2 text-orange-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <div className="mt-4 h-1 w-16 rounded-full bg-orange-500" />
            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center text-sm text-slate-300 transition hover:text-orange-300"
                  >
                    <MoveRight className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Services</h3>
            <div className="mt-4 h-1 w-16 rounded-full bg-orange-500" />
            <ul className="mt-6 space-y-3">
              {serviceLinks.map((service) => (
                <li
                  key={service}
                  className="inline-flex items-center text-sm text-slate-300"
                >
                  <Truck className="mr-2 h-4 w-4 text-orange-300" />
                  {service}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Why This Startup
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                We built this model so students can earn through organized
                moving jobs and better support tuition, study materials, travel,
                and daily expenses.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Contact</h3>
            <div className="mt-4 h-1 w-16 rounded-full bg-orange-500" />

            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-orange-300" />
                <span>
                  Student Innovation Hub
                  <br />
                  Main City Road, Pune, Maharashtra
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-300" />
                <a href="tel:+9101550010904" className="transition hover:text-white">
                  0155 xx109xx4
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-300" />
                <a
                  href="mailto:support@vanman.example"
                  className="transition hover:text-white"
                >
                  support@vanman.example
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-orange-300" />
                <span>Mon - Sat, 8:00 AM to 8:00 PM</span>
              </p>
            </div>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center text-sm font-semibold text-orange-300 transition hover:text-orange-200"
            >
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Van Man Packers & Movers. Student-driven service platform.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/services" className="transition hover:text-orange-300">
              Services
            </Link>
            <Link to="/contact" className="transition hover:text-orange-300">
              Support
            </Link>
            <Link to="/auth" className="transition hover:text-orange-300">
              Customer Access
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
