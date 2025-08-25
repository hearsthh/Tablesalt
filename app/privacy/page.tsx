export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Account Information:</strong> When you create an account, we collect your name, email address,
                and restaurant information.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect information about how you use our platform, including menu data,
                customer insights, and marketing activities.
              </p>
              <p>
                <strong>Technical Data:</strong> We automatically collect IP addresses, browser information, and device
                identifiers for security and analytics purposes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our AI-powered restaurant management services</li>
                <li>Generate personalized insights and recommendations</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important updates and marketing communications (with your consent)</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who help us operate our platform (hosting, payment processing, analytics)</li>
                <li>Legal authorities when required by law or to protect our rights</li>
                <li>Business partners with your explicit consent</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement industry-standard security measures including encryption, secure data centers, and regular
                security audits to protect your information.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and download your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability to another service</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar technologies to improve your experience, analyze usage, and provide
                personalized content. You can manage cookie preferences through our cookie consent banner.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                For privacy-related questions or to exercise your rights, contact us at:
                <br />
                Email: privacy@tablesalt.ai
                <br />
                Address: [Your Business Address]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
