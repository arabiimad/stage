import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, Clock } from 'lucide-react';
import heroImage from '../assets/hero-dental-tool-3d.png';
import { useSEO } from '../utils/seo';

const Hero = () => {
  // SEO for hero section
  useSEO({
    title: 'DentalTech Pro - Équipements dentaires professionnels de haute qualité',
    description: 'Découvrez notre gamme complète d\'équipements dentaires professionnels. Plus de 15 ans d\'expertise au service des professionnels de la santé bucco-dentaire.',
    canonical: 'https://dentaltech-pro.fr/',
    openGraph: {
      title: 'DentalTech Pro - Équipements dentaires professionnels',
      description: 'Découvrez notre gamme complète d\'équipements dentaires professionnels. Plus de 15 ans d\'expertise au service des professionnels de la santé bucco-dentaire.',
      url: 'https://dentaltech-pro.fr/',
      image: 'https://dentaltech-pro.fr/hero-dental-tool-3d.png',
      type: 'website'
    }
  });

  const stats = [
    { icon: Award, value: '15+', label: 'Années d\'expérience', color: 'text-blue-600' },
    { icon: Users, value: '500+', label: 'Clients satisfaits', color: 'text-turquoise-500' },
    { icon: Clock, value: '24/7', label: 'Support technique', color: 'text-blue-600' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <section 
      id="accueil" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-turquoise-600 overflow-hidden"
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <main id="main-content" className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Équipements dentaires
              <span className="block text-turquoise-300">de haute qualité</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
            >
              Votre partenaire de confiance pour l'équipement dentaire de haute qualité. 
              Innovation, expertise et service d'excellence depuis plus de 15 ans.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button
                onClick={() => scrollToSection('apropos')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('apropos'))}
                className="bg-turquoise-500 hover:bg-turquoise-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-turquoise-300 focus:ring-offset-2 focus:ring-offset-blue-900"
                aria-label="Découvrir nos services - Aller à la section À propos"
              >
                Découvrir nos services
                <ArrowRight className="w-5 h-5 inline ml-2" aria-hidden="true" />
              </button>
              
              <a
                href="/boutique"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 text-center"
                aria-label="Voir notre catalogue de produits"
              >
                Voir le catalogue
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-8"
              role="region"
              aria-label="Statistiques de l'entreprise"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`${stat.color} mb-2 flex justify-center`} aria-hidden="true">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1" aria-label={`${stat.value} ${stat.label}`}>
                    {stat.value}
                  </div>
                  <div className="text-blue-200 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Équipement dentaire moderne 3D - Unit dentaire premium avec technologie LED intégrée"
                className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
                loading="eager"
                width="600"
                height="600"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-20 h-20 bg-turquoise-400/20 rounded-full blur-xl"
              aria-hidden="true"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </main>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={() => scrollToSection('apropos')}
          onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('apropos'))}
          className="text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 rounded p-2"
          aria-label="Faire défiler vers la section suivante"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-current rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-current rounded-full mt-2"
            />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;

