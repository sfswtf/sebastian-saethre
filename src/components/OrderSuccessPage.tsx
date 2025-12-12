import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { CheckCircle, Mail, Home } from 'lucide-react';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh] flex items-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center w-full">
          <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
          <h1 className="text-4xl font-bold mb-4 text-neutral-900">
            Tusen takk for din bestilling!
          </h1>
          {orderNumber && (
            <p className="text-xl text-neutral-700 mb-4 font-mono">
              Ordrenummer: {orderNumber}
            </p>
          )}
          <p className="text-xl text-neutral-600 mb-8">
            Du vil motta deg en e-post med ordreinformasjon.
          </p>
          <div className="flex items-center justify-center gap-2 text-neutral-500 mb-8">
            <Mail size={20} />
            <span>Sjekk din innboks for bekreftelse</span>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-semibold inline-flex items-center gap-2"
            >
              Fortsett shopping
            </Link>
            <Link
              to="/"
              className="bg-neutral-200 text-neutral-800 px-8 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Home size={20} />
              <span>Tilbake til hjem</span>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}




