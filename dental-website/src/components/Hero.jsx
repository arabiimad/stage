import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '../assets/hero-dental-tool-3d.png';

const Hero = () => {
  const scrollToShop = () => {
    window.location.href = '/boutique';
  };

  return (
    <section id="hero" className="min-h-screen hero-gradient flex items-center pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                La technologie dentaire{' '}
                <span className="dental-blue">à portée de main</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Équipements de pointe et consommables médicaux pour les professionnels 
                de la santé bucco-dentaire. Qualité, innovation et service d'excellence.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <button
                onClick={scrollToShop}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Découvrir le catalogue</span>
                <ArrowRight size={20} />
              </button>
              
              <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Voir la démo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold dental-blue">500+</div>
                <div className="text-sm text-gray-600">Clients équipés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold dental-blue">15</div>
                <div className="text-sm text-gray-600">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold dental-blue">99%</div>
                <div className="text-sm text-gray-600">Satisfaction client</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - 3D Illustration */}
          <motion.div
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full transform scale-110 opacity-50"></div>
              
              {/* Main image */}
              <motion.img
                src={heroImage}
                alt="Outils dentaires 3D"
                className="relative z-10 w-full max-w-lg floating-animation"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-10 right-10 w-16 h-16 bg-blue-500 rounded-full opacity-20"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-12 h-12 bg-cyan-500 rounded-full opacity-20"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

