"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tablesalt AI</h3>
            <p className="text-gray-400 text-sm">
              AI-powered restaurant intelligence platform helping restaurants boost revenue and optimize operations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="hover:text-white transition-colors">
                  Marketing Hub
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Menu Intelligence
                </Link>
              </li>
              <li>
                <Link href="/customer-intelligence" className="hover:text-white transition-colors">
                  Customer Intelligence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/billing" className="hover:text-white transition-colors">
                  Billing
                </Link>
              </li>
              <li>
                <Link href="/data-export" className="hover:text-white transition-colors">
                  Data Export
                </Link>
              </li>
              <li>
                <a href="mailto:support@tablesalt.ai" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:help@tablesalt.ai" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("cookie-consent")
                    window.location.reload()
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tablesalt AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
