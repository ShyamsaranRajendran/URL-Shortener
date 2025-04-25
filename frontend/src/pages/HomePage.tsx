import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Zap } from 'lucide-react';
import URLShortener from '../components/URLShortener';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Shorten, Share, Track
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Create shorter links, QR codes, and link-in-bio pages.
              <br /> 
              Track what's working, and what's not. All in one place.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <URLShortener />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Shorty?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              More than just a link shortener. A powerful set of tools to help you grow and protect your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <motion.div 
              className="card card-hover text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized infrastructure ensures your links load quickly, providing a seamless experience for your users.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="card card-hover text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Track clicks, geography, devices, and referrers to understand your audience and optimize your campaigns.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="card card-hover text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security and 99.99% uptime ensure your links are always safe and accessible.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take control of your links?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers, content creators, and businesses who use Shorty to optimize their link strategy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 flex items-center">
              Sign up for free
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/pricing" className="btn bg-transparent border border-white text-white hover:bg-white/10">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;