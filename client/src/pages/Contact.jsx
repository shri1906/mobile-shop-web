import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-white dark:bg-navy min-h-screen">
      {/* Hero */}
      <section className="page-hero">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="section-badge">Get in Touch</span>

          <h1 className="font-display font-bold text-5xl text-slate-900 dark:text-white mt-4">
            Contact Us
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
            Have a question or need help with your device? Visit our shop or
            contact us using the information below.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-light p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Shop Address
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400">
                    123 Tech Street,
                    <br />
                    Dehradun, Uttarakhand
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <FaPhoneAlt className="text-green-600 text-2xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Phone
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <FaEnvelope className="text-red-600 text-2xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Email
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400">
                    support@techfixpro.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                  <FaClock className="text-yellow-600 text-2xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Working Hours
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400">
                    Monday – Saturday
                    <br />
                    9:00 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-light p-8">
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">
                Connect With Us
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Follow us on social media for repair tips, offers and latest
                updates.
              </p>

              <div className="flex gap-5">
                <a
                  href="#"
                  className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center hover:scale-110 transition"
                >
                  <FaFacebookF className="text-blue-600 text-2xl" />
                </a>

                <a
                  href="#"
                  className="w-14 h-14 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center hover:scale-110 transition"
                >
                  <FaInstagram className="text-pink-600 text-2xl" />
                </a>

                <a
                  href="#"
                  className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center hover:scale-110 transition"
                >
                  <FaWhatsapp className="text-green-600 text-2xl" />
                </a>
              </div>

              <div className="mt-10 p-6 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Need Immediate Help?
                </h3>

                <p className="text-slate-500 dark:text-slate-400">
                  Call us directly during business hours for instant assistance
                  regarding your mobile repair.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
