import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Wrench, ChefHat, Zap, Paintbrush, Car, Home, Scissors, Camera, Music, Filter } from 'lucide-react';
import Header from '@/components/Header';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'plomero', name: 'Plomería', icon: Wrench, color: 'from-blue-500 to-blue-600' },
  { id: 'chef', name: 'Chef Personal', icon: ChefHat, color: 'from-orange-500 to-red-500' },
  { id: 'electricista', name: 'Electricista', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'pintor', name: 'Pintura', icon: Paintbrush, color: 'from-purple-500 to-pink-500' },
  { id: 'mecanico', name: 'Mecánico', icon: Car, color: 'from-gray-600 to-gray-700' },
  { id: 'limpieza', name: 'Limpieza', icon: Home, color: 'from-green-500 to-teal-500' },
  { id: 'peluquero', name: 'Peluquería', icon: Scissors, color: 'from-pink-500 to-rose-500' },
  { id: 'fotografo', name: 'Fotografía', icon: Camera, color: 'from-indigo-500 to-purple-500' }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    setProfessionals(savedProfessionals);
    setFilteredProfessionals(savedProfessionals);
  }, []);

  useEffect(() => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(professional =>
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(professional =>
        professional.profession.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, selectedCategory, professionals]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Nework - Encuentra Profesionales de Confianza</title>
        <meta name="description" content="Descubre y conecta con profesionales verificados en tu área. Plomeros, electricistas, chefs, y más servicios de calidad." />
        <meta property="og:title" content="Nework - Encuentra Profesionales de Confianza" />
        <meta property="og:description" content="La plataforma líder para encontrar profesionales de servicios verificados y de confianza." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="hero-section hero-pattern py-20">
        <div className="floating-elements" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encuentra el <span className="text-yellow-300">Profesional Perfecto</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Conecta con profesionales verificados y de confianza para todos tus servicios
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="search-bar flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar servicios... (ej: plomero, chef, electricista)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-0 bg-white/90 backdrop-blur-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" size="lg" className="btn-primary px-8">
                  Buscar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Explora por Categoría</h2>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>

          {showFilters && (selectedCategory || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 glass-effect rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Filtros activos:</span>
                  {selectedCategory && (
                    <span className="filter-chip active">
                      {categories.find(cat => cat.id === selectedCategory)?.name}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="filter-chip active">
                      "{searchTerm}"
                    </span>
                  )}
                </div>
                <Button variant="ghost" onClick={clearFilters} className="text-blue-600">
                  Limpiar filtros
                </Button>
              </div>
            </motion.div>
          )}

          <div className="service-category-grid">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`category-card ${selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professionals Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">
              {selectedCategory 
                ? `Profesionales en ${categories.find(cat => cat.id === selectedCategory)?.name}`
                : searchTerm 
                ? `Resultados para "${searchTerm}"`
                : 'Profesionales Destacados'
              }
            </h2>
            <span className="text-gray-600">
              {filteredProfessionals.length} profesional{filteredProfessionals.length !== 1 ? 'es' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProfessionals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-state-icon">
                <Search className="w-16 h-16" />
              </div>
              <h3 className="empty-state-title">No se encontraron profesionales</h3>
              <p className="empty-state-description">
                {searchTerm || selectedCategory 
                  ? 'Intenta con otros términos de búsqueda o explora diferentes categorías'
                  : 'No hay profesionales disponibles en este momento'
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <Button onClick={clearFilters} className="mt-4">
                  Ver todos los profesionales
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="professional-grid">
              {filteredProfessionals.map((professional, index) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mt-20 py-16 hero-section hero-pattern rounded-2xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              Confían en Nework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="stats-number text-white">500+</div>
                <div className="stats-label text-white/80">Profesionales Verificados</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="stats-number text-white">10,000+</div>
                <div className="stats-label text-white/80">Servicios Completados</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="stats-number text-white">4.8★</div>
                <div className="stats-label text-white/80">Calificación Promedio</div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}