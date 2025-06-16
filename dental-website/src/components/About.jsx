import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Heart } from 'lucide-react';

const About = () => {
  const timeline = [
    { year: '2010', event: 'Création de l\'entreprise', description: 'Début de notre aventure dans le matériel dentaire' },
    { year: '2015', event: 'Expansion nationale', description: 'Ouverture de nouveaux marchés en France' },
    { year: '2018', event: 'Innovation technologique', description: 'Partenariats avec les leaders mondiaux' },
    { year: '2020', event: 'Transformation digitale', description: 'Lancement de notre plateforme e-commerce' },
    { year: '2024', event: 'Excellence reconnue', description: 'Leader français du matériel dentaire' },
  ];

  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Technologies de pointe pour des soins d\'excellence'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Partenariat',
      description: 'Accompagnement personnalisé de nos clients'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Réactivité',
      description: 'Service client disponible et efficace'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passion',
      description: 'Engagement pour la santé bucco-dentaire'
    }
  ];

  const stats = [
    { number: '500+', label: 'Cabinets équipés' },
    { number: '15', label: 'Années d\'expérience' },
    { number: '99%', label: 'Satisfaction client' },
    { number: '24h', label: 'Délai de livraison' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
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
            À propos de <span className="dental-blue">DentalTech Pro</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Depuis plus de 15 ans, nous accompagnons les professionnels de la santé dentaire 
            avec des équipements de haute qualité et un service d\'excellence.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">Notre Histoire</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-2xl font-bold dental-blue mb-2">{item.year}</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.event}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold dental-blue mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">Nos Valeurs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="dental-turquoise mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

