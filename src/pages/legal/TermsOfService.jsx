import React from "react";

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsOfService = () => (
  <div className="min-h-screen bg-gray-50 py-20 px-6">
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-400 text-sm">Last updated: March 2026</p>
        <p className="text-gray-600 mt-4">
          By using KnowledgeAdda, you agree to these terms. Please read them
          carefully before using our platform.
        </p>
      </div>

      <div className="space-y-10">
        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or using KnowledgeAdda, you agree to be bound
            by these Terms of Service and our Privacy Policy. If you do not
            agree, please do not use our platform.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be at least 13 years old to use KnowledgeAdda</li>
            <li>Users under 18 must have parental consent</li>
            <li>
              You must provide accurate and complete registration information
            </li>
            <li>One person may not maintain more than one account</li>
          </ul>
        </Section>

        <Section title="3. Account Responsibilities">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              You are responsible for maintaining the security of your account
            </li>
            <li>Do not share your login credentials with others</li>
            <li>Notify us immediately of any unauthorized account access</li>
            <li>You are responsible for all activity under your account</li>
          </ul>
        </Section>

        <Section title="4. Subscription & Payments">
          <ul className="list-disc pl-5 space-y-1">
            <li>Subscriptions are billed as per the selected plan</li>
            <li>All payments are processed securely via Razorpay</li>
            <li>
              Subscriptions auto-renew unless cancelled before renewal date
            </li>
            <li>
              Refunds are available within 7 days of purchase if no content has
              been accessed
            </li>
            <li>We reserve the right to change pricing with 30 days notice</li>
          </ul>
        </Section>

        <Section title="5. Content & Intellectual Property">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              All course content is owned by KnowledgeAdda or its instructors
            </li>
            <li>You may not download, copy, or redistribute our content</li>
            <li>You may not use our content for commercial purposes</li>
            <li>
              Screen recording or unauthorized capture of content is prohibited
            </li>
          </ul>
        </Section>

        <Section title="6. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your account or subscription with others</li>
            <li>Attempt to hack, disrupt, or reverse-engineer the platform</li>
            <li>Post or transmit any harmful, offensive, or illegal content</li>
            <li>Use automated tools to scrape or access our platform</li>
            <li>Impersonate any person or entity</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </Section>

        <Section title="7. Account Termination">
          <p>
            We reserve the right to suspend or terminate your account at any
            time if you violate these terms. You may also delete your account at
            any time from your profile settings. Upon termination, your access
            to paid content will cease immediately.
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            KnowledgeAdda is provided "as is" without warranties of any kind. We
            do not guarantee that the platform will be error-free or
            uninterrupted. We are not responsible for any loss of data or
            learning outcomes.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, KnowledgeAdda shall not be
            liable for any indirect, incidental, or consequential damages
            arising from your use of the platform.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These terms are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts in India.
          </p>
        </Section>

        <Section title="11. Changes to Terms">
          <p>
            We may update these terms at any time. Continued use of
            KnowledgeAdda after changes constitutes acceptance of the updated
            terms. We will notify you of significant changes via email.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            For any questions about these terms, contact us at{" "}
            <a
              href="mailto:legal@knowledgeadda.com"
              className="text-blue-600 hover:underline"
            >
              legal@knowledgeadda.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  </div>
);

export default TermsOfService;
