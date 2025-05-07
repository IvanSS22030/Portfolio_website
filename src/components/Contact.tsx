import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Contact: React.FC = () => {
  const { theme } = useTheme();

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
                  <p className="text-gray-600">+1 (123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Email</h4>
                  <p className="text-gray-600">contact@ivanjoel.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Location</h4>
                  <p className="text-gray-600">New York, NY, USA</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Message"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
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
                  <p className="text-amber-200">+1 (123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-amber-500 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-amber-400 font-serif">Spectral Mail</h4>
                  <p className="text-amber-200">contact@ivanjoel.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-amber-400 font-serif">Mortal Dwelling</h4>
                  <p className="text-amber-200">New York, NY, USA</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-6 bg-gray-900 p-6 rounded-lg border border-amber-900">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                  placeholder="Inscribe your true name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Ethereal Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                  placeholder="Where spectral messages may reach you"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-amber-400 mb-1 font-serif">Your Incantation</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-amber-900 rounded-md focus:ring-amber-500 focus:border-amber-500 text-amber-200"
                  placeholder="Speak your purpose"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-amber-800 text-amber-100 rounded-md border border-amber-700 hover:bg-amber-900 transition-colors duration-300 font-serif"
              >
                Cast Summoning Spell
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalContact : personalContact;
};

export default Contact;