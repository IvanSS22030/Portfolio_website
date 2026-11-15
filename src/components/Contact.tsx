import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/*
 * Netlify Forms: index.html holds a hidden copy of this form so Netlify detects it when the
 * site is deployed. Netlify stores each message and emails it to Ivan.
 */
const FORM_NAME = 'contact';

type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<SendStatus>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const fields = [...new FormData(form)].map(([key, value]) => [key, String(value)]);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields).toString(),
      });
      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const professionalContact = (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Contact Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Get In Touch</h3>
            <p className="text-gray-600 mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Phone</h4>
                  <p className="text-gray-600">+1 (849) 276-2030</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Email</h4>
                  <p className="text-gray-600">ivanj_ss@hotmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Location</h4>
                  <p className="text-gray-600">Santo Domingo, Dominican Republic</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {status === 'sent' ? (
              <div
                role="status"
                className="flex flex-col items-center text-center gap-4 p-8 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle2 className="w-14 h-14 text-green-600" aria-hidden="true" />
                <h4 className="text-2xl font-semibold text-gray-800">Message sent!</h4>
                <p className="text-gray-600">Thanks for reaching out. I'll reply to your email soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                name={FORM_NAME}
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* `hidden` keeps both out of the space-y spacing */}
                <input type="hidden" name="form-name" value={FORM_NAME} hidden />
                {/* Honeypot: people never see it, spam bots fill it in and Netlify drops the message */}
                <p hidden>
                  <label>
                    Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
              
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Email"
                  />
                </div>
              
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Message"
                  ></textarea>
                </div>
              
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && (
                  <p role="alert" className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
                    Your message couldn't be sent. Please try again or email me at ivanj_ss@hotmail.com.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const personalContact = (
    <section id="contact" className="py-20 bg-black bg-opacity-90">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">Summon Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold text-amber-400 mb-6 font-serif">The Ritual of Contact</h3>
            <p className="text-amber-200 mb-8">
              Should you wish to summon me for quests of creation, mystical collaborations, or to join your legion of digital warriors, these arcane methods shall reach me.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-amber-500 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-amber-400 font-serif">Crystal Ball</h4>
                  <p className="text-amber-200">+1 (849) 276-2030</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-amber-500 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-amber-400 font-serif">Spectral Mail</h4>
                  <p className="text-amber-200">ivanj_ss@hotmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-amber-400 font-serif">Mortal Dwelling</h4>
                  <p className="text-amber-200">Santo Domingo, Dominican Republic</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {status === 'sent' ? (
              <div
                role="status"
                className="flex flex-col items-center text-center gap-4 bg-gray-900 p-8 rounded-lg border border-amber-700"
              >
                <CheckCircle2 className="w-14 h-14 text-amber-400" aria-hidden="true" />
                <h4 className="text-2xl font-semibold text-amber-400 font-serif">Your summoning has been heard</h4>
                <p className="text-amber-200">Your message has reached me. I shall answer soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2 border border-amber-700 text-amber-400 rounded-md hover:bg-amber-900 hover:bg-opacity-50 transition-colors duration-300 font-serif"
                >
                  Cast another spell
                </button>
              </div>
            ) : (
              <form
                name={FORM_NAME}
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6 bg-gray-900 p-6 rounded-lg border border-amber-900"
              >
                {/* `hidden` keeps both out of the space-y spacing */}
                <input type="hidden" name="form-name" value={FORM_NAME} hidden />
                {/* Honeypot: people never see it, spam bots fill it in and Netlify drops the message */}
                <p hidden>
                  <label>
                    Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                    placeholder="Inscribe your true name"
                  />
                </div>
              
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Ethereal Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                    placeholder="Where spectral messages may reach you"
                  />
                </div>
              
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Incantation</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                    placeholder="Speak your purpose"
                  ></textarea>
                </div>
              
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-6 py-3 bg-amber-800 text-amber-100 rounded-md border border-amber-700 hover:bg-amber-900 transition-colors duration-300 font-serif disabled:opacity-60 disabled:cursor-wait"
                >
                  {status === 'sending' ? 'Casting...' : 'Cast Summoning Spell'}
                </button>
                {status === 'error' && (
                  <p role="alert" className="p-4 rounded-md bg-red-950/50 border border-red-800 text-red-300 font-serif">
                    The spell failed. Try again, or send a raven to ivanj_ss@hotmail.com.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalContact : personalContact;
};

export default Contact;