"use client";

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [usageBasedPricing, setUsageBasedPricing] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* Simple Header */}

      <div className="border-b border-white/[0.1] bg-black/50 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Panoptica"
              width={30}
              height={30}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold">Panoptica</span>
          </Link>
          <div className="flex items-center gap-4">
            <User className="w-5 h-5 text-neutral-300" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-400 mb-12">You can manage your account, billing, and team settings here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-neutral-900/20 backdrop-blur-xl border border-neutral-700/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Name</label>
                <div className="text-white">{user.user_metadata?.full_name}</div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Email</label>
                <div className="text-white">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-neutral-900/20 backdrop-blur-xl border border-neutral-700/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Account</h2>
              <span className="px-2 py-1 text-xs font-medium bg-neutral-800 text-neutral-300 rounded-full">Pro</span>
            </div>
            <div className="space-y-4">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                MANAGE SUBSCRIPTION
              </button>
              <div className="text-sm">
                <button
                  className="text-neutral-400 hover:text-neutral-300 transition-colors"
                  onClick={() => {}}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="bg-neutral-900/20 backdrop-blur-xl border border-neutral-700/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Usage</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-neutral-400 mb-4">Fast requests will refresh in 16 days</div>

                {/* Premium Models Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Premium models</span>
                    <span>500 / 500</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-full rounded-full"></div>
                  </div>
                  <div className="text-xs text-neutral-400">
                    You've hit your limit of 500 fast requests
                  </div>
                </div>

                {/* GPT-4 Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>gpt-4o-mini or cursor-small</span>
                    <span>0 / No Limit</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-0 rounded-full"></div>
                  </div>
                  <div className="text-xs text-neutral-400">
                    You've used 0 fast requests of this model. You have no monthly quota.
                  </div>
                </div>
              </div>

              {/* Usage Based Pricing Notice */}
              <div className="bg-[#423A24] rounded-lg p-4 flex items-start gap-3">
                <div className="shrink-0 mt-1">⚡️</div>
                <div className="text-sm">
                  Usage-based pricing allows you to pay for extra fast requests beyond your plan limits.{' '}
                  <a href="#" className="text-[#FFB224] hover:underline">Learn more</a>
                </div>
              </div>

              {/* Settings Toggle */}
              <div>
                <h3 className="text-lg font-medium mb-4">Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable usage-based pricing</div>
                  </div>
                  <button
                    onClick={() => setUsageBasedPricing(!usageBasedPricing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${usageBasedPricing ? 'bg-green-500' : 'bg-neutral-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${usageBasedPricing ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-neutral-900/20 backdrop-blur-xl border border-neutral-700/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Active Sessions</h2>
            <div className="space-y-4">
              {[
                { id: 1, created: '19 days ago' },
                { id: 2, created: '15 days ago' },
                { id: 3, created: 'about 1 month ago' }
              ].map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Desktop App Session</div>
                      <div className="text-xs text-neutral-500">Created {session.created}</div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 text-xs font-medium text-neutral-400 hover:text-neutral-300 transition-colors"
                  >
                    REVOKE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
