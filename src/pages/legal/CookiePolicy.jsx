import React, { useEffect } from "react";

// Helper component for sections
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

// Helper component for the cookie table
const CookieTable = ({ cookies }) => (
  <div className="overflow-x-auto mt-3">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">
            Cookie
          </th>
          <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">
            Purpose
          </th>
          <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">
            Duration
          </th>
        </tr>
      </thead>
      <tbody>
        {cookies.map((c, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-3 border border-gray-200 font-mono text-xs">
              {c.name}
            </td>
            <td className="p-3 border border-gray-200">{c.purpose}</td>
            <td className="p-3 border border-gray-200">{c.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CookiePolicy = () => {
  // Ensure the page starts at the top when opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-sm">Last updated: March 2026</p>
          <p className="text-gray-600 mt-4">
            This policy explains how KnowledgeAdda uses cookies and similar
            technologies to provide, improve, and secure our platform.
          </p>
        </div>

        <div className="space-y-10">
          <Section title="1. What Are Cookies">
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help the website remember your preferences and
              actions over time, so you don't have to re-enter information every
              time you visit.
            </p>
          </Section>

          <Section title="2. Cookies We Use">
            <p className="font-semibold text-gray-700">Essential Cookies</p>
            <p>
              These are required for the platform to function. They cannot be
              disabled.
            </p>
            <CookieTable
              cookies={[
                {
                  name: "accessToken",
                  purpose: "Keeps you logged in during your session",
                  duration: "15 minutes",
                },
                {
                  name: "refreshToken",
                  purpose: "Used to refresh your login session automatically",
                  duration: "7 days",
                },
                {
                  name: "auth_session",
                  purpose: "Manages your authenticated session",
                  duration: "Session",
                },
              ]}
            />

            <p className="font-semibold text-gray-700 mt-6">
              Preference Cookies
            </p>
            <p>These remember your settings and preferences.</p>
            <CookieTable
              cookies={[
                {
                  name: "activeTab",
                  purpose: "Remembers your last active tab on profile page",
                  duration: "Session",
                },
                {
                  name: "theme",
                  purpose: "Stores your display preferences",
                  duration: "1 year",
                },
              ]}
            />

            <p className="font-semibold text-gray-700 mt-6">
              Analytics Cookies
            </p>
            <p>
              These help us understand how users interact with our platform so
              we can improve it.
            </p>
            <CookieTable
              cookies={[
                {
                  name: "_ga",
                  purpose: "Google Analytics — tracks page visits and usage",
                  duration: "2 years",
                },
                {
                  name: "_gid",
                  purpose: "Google Analytics — distinguishes users",
                  duration: "24 hours",
                },
              ]}
            />
          </Section>

          <Section title="3. Third Party Cookies">
            <p>Some third-party services we use may set their own cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Razorpay</strong> — for secure payment processing
              </li>
              <li>
                <strong>Google Analytics</strong> — for usage analytics
              </li>
              <li>
                <strong>Cloudinary</strong> — for media delivery
              </li>
            </ul>
            <p>
              These third parties have their own privacy policies governing
              their use of cookies.
            </p>
          </Section>

          <Section title="4. How to Control Cookies">
            <p>You can control cookies in the following ways:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Browser settings</strong> — Most browsers allow you to
                block or delete cookies via settings
              </li>
              <li>
                <strong>Opt out of analytics</strong> — Use{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics Opt-out
                </a>
              </li>
            </ul>
            <p className="mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
              ⚠️ Disabling essential cookies will prevent you from logging in
              and using KnowledgeAdda properly.
            </p>
          </Section>

          <Section title="5. Cookie Consent">
            <p>
              By continuing to use KnowledgeAdda, you consent to our use of
              cookies as described in this policy.
            </p>
          </Section>

          <Section title="7. Contact Us">
            <p>
              For any questions about our cookie usage, contact us at{" "}
              <a
                href="mailto:privacy@knowledgeadda.com"
                className="text-blue-600 hover:underline"
              >
                privacy@knowledgeadda.com
              </a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
