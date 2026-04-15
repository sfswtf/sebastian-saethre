import React from 'react';
import { ContactForm } from './ContactForm';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  title: string | null;
  content: string;
}

export function ContactPage() {
  const { language } = useLanguageStore();

  const title = language === 'no' ? 'Kontakt' : 'Contact';
  const description = language === 'no'
    ? 'Jeg vil gjerne høre fra deg - send meg en melding så tar jeg kontakt snarest'
    : "I'd love to hear from you - send me a message and I'll get back to you as soon as I can.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{language === 'no' ? 'Ta Kontakt' : 'Get in Touch'}</h2>
            <p className="text-lg text-neutral-700 mb-6">{description}</p>

            <div className="space-y-4 text-neutral-700">
              <p className="flex items-center justify-center gap-2">
                <Mail size={18} />
                <a href="mailto:sebastiansaethre@gmail.com" className="text-brand-600 hover:text-brand-700">sebastiansaethre@gmail.com</a>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone size={18} />
                <a href="tel:+4794493231" className="text-brand-600 hover:text-brand-700">+47 944 93 231</a>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Globe size={18} />
                <a href="https://www.sebastiansaethre.com" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">www.sebastiansaethre.com</a>
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
