import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Network, Brain, Lock, Globe, Zap, Laptop } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 py-32 mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              AI-Powered People Intelligence
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl">
              Visualize and analyze professional networks with AI-powered insights. Discover connections,
              understand relationships, and make informed decisions.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </Link>
              <Link
                href="/docs"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
              Everything you need to understand your network
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Network className="h-6 w-6" />}
              title="Network Visualization"
              description="Interactive graph visualization of connections and relationships"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI-Powered Insights"
              description="Get intelligent recommendations and relationship analysis"
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Secure & Private"
              description="Enterprise-grade security with end-to-end encryption"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Cross-Platform"
              description="Access from web, mobile, or desktop applications"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Real-time Updates"
              description="Stay updated with live notifications and changes"
            />
            <FeatureCard
              icon={<Laptop className="h-6 w-6" />}
              title="API Access"
              description="Integrate with your existing tools and workflows"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of professionals using Shambu to understand and leverage their networks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
            >
              Sign up for free
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-white"
            >
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Social</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="https://twitter.com/shambuai">Twitter</Link></li>
                <li><Link href="https://github.com/shambuai">GitHub</Link></li>
                <li><Link href="https://linkedin.com/company/shambuai">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Shambu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
} 