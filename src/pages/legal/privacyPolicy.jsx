import React from "react";

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gray-50 py-20 px-6">
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026</p>
        <p className="text-gray-600 mt-4">
          At KnowledgeAdda, we take your privacy seriously. This policy explains
          what data we collect, how we use it, and your rights over it.
        </p>
      </div>

      <div className="space-y-10">
        <Section title="1. Information We Collect">
          <p>
            We collect the following information when you use KnowledgeAdda:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and email address when you register</li>
            <li>Payment information (processed securely via Razorpay)</li>
            <li>Profile details you choose to provide (phone, address)</li>
            <li>Usage data (courses accessed, quiz attempts, watch history)</li>
            <li>Device and browser information for security purposes</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and manage your account</li>
            <li>To process subscription payments</li>
            <li>To provide access to courses and quizzes</li>
            <li>To track your learning progress</li>
            <li>To send important account and service updates</li>
            <li>To improve our platform based on usage patterns</li>
          </ul>
        </Section>

        <Section title="3. Who We Share Your Data With">
          <p>We do not sell your personal data. We only share it with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Razorpay</strong> — for secure payment processing
            </li>
            <li>
              <strong>Cloudinary</strong> — for storing course content
            </li>
            <li>
              <strong>MongoDB Atlas</strong> — for database hosting
            </li>
            <li>Law enforcement when required by law</li>
          </ul>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain your personal data for as long as your account is active.
            If you delete your account, your data will be permanently removed
            within 30 days, except where retention is required by law.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:privacy@knowledgeadda.com"
              className="text-blue-600 hover:underline"
            >
              privacy@knowledgeadda.com
            </a>
          </p>
        </Section>

        <Section title="6. Security">
          <p>
            We use industry-standard security measures including HTTPS
            encryption, JWT authentication, and secure cookie handling to
            protect your data. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            KnowledgeAdda is not intended for children under 13. We do not
            knowingly collect personal data from children under 13. If you
            believe a child has provided us with their data, please contact us
            immediately.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this policy from time to time. We will notify you of
            significant changes via email or a notice on our platform. Continued
            use of KnowledgeAdda after changes constitutes acceptance of the
            updated policy.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <p>
            For any privacy-related questions, contact us at{" "}
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

export default PrivacyPolicy;
