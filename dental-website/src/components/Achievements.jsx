import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Achievements = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const achievements = [
    {
      id: 1,
      title: 'Cabinet Dr. Martin - Paris',
      category: 'Équipement complet',
      image: '/api/placeholder/400/300',
      description: 'Installation complète d\'un cabinet dentaire moderne avec équipements de dernière génération.',
      testimonial: 'DentalTech Pro a transformé notre pratique. Les équipements sont exceptionnels et le service client irréprochable.',
      author: 'Dr. Sophie Martin',
      rating: 5,
      results: ['Productivité +40%', 'Satisfaction patients +95%', 'ROI en 18 mois']
    },
    {
      id: 2,
      title: 'Laboratoire ProthèsePlus - Lyon',
      category: 'Technologie CAD/CAM',
      image: '/api/placeholder/400/300',
      description: 'Modernisation complète du laboratoire avec technologies CAD/CAM et impression 3D.',
      testimonial: 'La précision des équipements nous permet de livrer des prothèses d\'une qualité exceptionnelle.',
      author: 'Marc Dubois, Prothésiste',
      rating: 5,
      results: ['Précision +60%', 'Délais réduits de 50%', 'Qualité optimale']
    },
    {
      id: 3,
      title: 'Clinique DentaireExpert - Marseille',
      category: 'Chirurgie implantaire',
      image: '/api/placeholder/400/300',
      description: 'Équipement spécialisé pour la chirurgie implantaire avec guidage numérique.',
      testimonial: 'Les outils de planification et de guidage ont révolutionné nos interventions chirurgicales.',
      author: 'Dr. Pierre Rousseau',
      rating: 5,
      results: ['Succès implants 98%', 'Temps opératoire -30%', 'Confort patient optimal']
    },
    {
      id: 4,
      title: 'Centre Orthodontie Moderne - Toulouse',
      category: 'Orthodontie digitale',
      image: '/api/placeholder/400/300',
      description: 'Transition vers l\'orthodontie digitale avec scanners intra-oraux et aligneurs.',
      testimonial: 'Nos patients apprécient le confort et la précision des traitements digitaux.',
      author: 'Dr. Marie Lefevre',
      rating: 5,
      results: ['Confort patient +80%', 'Précision maximale', 'Suivi optimisé']
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  return (
    <section id="achievements" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos <span className="dental-blue">Réalisations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment nous avons accompagné nos clients dans leur transformation 
            et leur montée en excellence.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {achievements.map((achievement) => (
                <div key={achievement.id} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-12">
                    {/* Image */}
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-2xl">
                        <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <Star className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-gray-600 font-medium">{achievement.category}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {achievement.category}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>

                      {/* Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {achievement.results.map((result, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-sm font-medium text-gray-900">{result}</div>
                          </div>
                        ))}
                      </div>

                      {/* Testimonial */}
                      <div className="bg-blue-50 p-6 rounded-lg relative">
                        <Quote className="absolute top-4 left-4 w-6 h-6 text-blue-400" />
                        <blockquote className="text-gray-700 italic mb-4 pl-8">
                          "{achievement.testimonial}"
                        </blockquote>
                        <div className="flex items-center justify-between pl-8">
                          <div>
                            <div className="font-semibold text-gray-900">{achievement.author}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(achievement.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {achievements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à transformer votre pratique ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines de professionnels qui nous font confiance 
            pour équiper leur cabinet avec les meilleures technologies.
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg">
            Demander un devis gratuit
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;

