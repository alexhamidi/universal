import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Subscription',
    price: '$9.99',
    description: 'For users who want to use Panoptica as a service',
    features: [
      'Access to basic AI features',
      'Screen sharing undetectability',
      'Works with major platforms',
      'Basic support',
    ],
    buttonText: 'Upgrade to Subscription',
  },
  {
    name: 'Purchase',
    price: '$19.99',
    description: 'For users who want to use Panoptica with their own API Key',
    features: [
      'Everything in Basic',
      'Advanced AI capabilities',
      'Priority support',
      'Custom prompts',
      'Multiple languages',
    ],
    buttonText: 'Purchase Panoptica ',
    isPopular: false,
  },

];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent py-2 w">
            Simple Pricing
          </h2>
          <p className="text-lg leading-8 text-[#999999]">
            Choose the plan that works best for you
          </p>
        </div>

        <div className="flex flex-row justify-center gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (

            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 w-[380px] flex flex-col ${
                tier.isPopular
                  ? 'border-2 border-blue-500 bg-neutral-900/40'
                  : 'border border-neutral-700/40 bg-neutral-900/20'
              }`}
            >

              <div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-x-2">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-neutral-400">{tier.name === 'Subscription' ? '/month' : ''}</span>
                  </div>
                  <p className="mt-4 text-neutral-400">{tier.description}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-neutral-300">
                      <svg
                        className="h-5 w-5 flex-none text-zinc-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <button
                  className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm cursor-pointer ${
                   'bg-neutral-800 text-white hover:bg-neutral-700'
                  } transition-colors duration-200`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
