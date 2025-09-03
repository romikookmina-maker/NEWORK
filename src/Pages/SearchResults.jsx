import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, MapPin, Star, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    location: '',
    minRating: 0,
    maxPrice: 1000,
    available: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedProfessionals = JSON.parse(localStorage.getItem('professionals') || '[]');
    setProfessionals(savedProfessionals);
  }, []);

  useEffect(() => {
    let filtered = professionals;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(professional =>
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(professional =>
        professional.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(professional => professional.rating >= filters.minRating);
    }

    // Price filter
    filtered = filtered.filter(professional => professional.hourlyRate <= filters.maxPrice);

    // Availability filter
    if (filters.available) {
      filtered = filtered.filter(professional => professional.available);
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, filters, professionals]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minRating: 0,
      maxPrice: 1000,
      available: false
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>{searchTerm ? `Resultados para "${searchTerm}"` : 'Buscar Profesionales'} - ServiMarket</title>
        <meta name="description" content={`Encuentra profesionales ${searchTerm ? `relacionados con ${searchTerm}` : 'verificados'} en ServiMarket`} />
        <meta property="og:title" content={`${searchTerm ? `Resultados para "${searchTerm}"` : 'Buscar Profesionales'} - ServiMarket`} />
        <meta property="og:description" content={`Descubre profesionales de calidad ${searchTerm ? `en ${searchTerm}` : 'en tu área'}`} />
      </Helmet>

      <Header showBackButton />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Buscar Profesionales'}
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar profesionales, servicios, ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg search-bar"
              />
            </div>
            <Button type="submit" size="lg" className="btn-primary">
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-effect rounded-xl p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Ciudad"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Calificación mínima</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                      className="form-input pl-10"
                    >
                      <option value={0}>Cualquiera</option>
                      <option value={3}>3+ estrellas</option>
                      <option value={4}>4+ estrellas</option>
                      <option value={4.5}>4.5+ estrellas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Precio máximo ($/hora)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Disponibilidad</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      type="button"
                      variant={filters.available ? 'default' : 'outline'}
                      onClick={() => handleFilterChange('available', !filters.available)}
                      className="flex-1"
                    >
                      Solo disponibles
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-600">
                  {filteredProfessionals.length} profesional{filteredProfessionals.length !== 1 ? 'es' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
                </span>
                <Button variant="ghost" onClick={clearFilters} className="text-blue-600">
                  Limpiar filtros
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProfessionals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search className="w-16 h-16" />
              </div>
              <h3 className="empty-state-title">No se encontraron profesionales</h3>
              <p className="empty-state-description">
                {searchTerm || Object.values(filters).some(f => f && f !== 0 && f !== 1000)
                  ? 'Intenta ajustar tus filtros de búsqueda o usar términos diferentes'
                  : 'No hay profesionales disponibles en este momento'
                }
              </p>
              <div className="flex space-x-4 mt-6">
                <Button onClick={clearFilters}>
                  Limpiar filtros
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Volver al inicio
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProfessionals.length} resultado{filteredProfessionals.length !== 1 ? 's' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
                </h2>
                
                <select
                  className="form-input w-auto"
                  onChange={(e) => {
                    const sortBy = e.target.value;
                    let sorted = [...filteredProfessionals];
                    
                    switch (sortBy) {
                      case 'rating':
                        sorted.sort((a, b) => b.rating - a.rating);
                        break;
                      case 'price-low':
                        sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
                        break;
                      case 'price-high':
                        sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
                        break;
                      case 'experience':
                        sorted.sort((a, b) => b.experience - a.experience);
                        break;
                      default:
                        break;
                    }
                    
                    setFilteredProfessionals(sorted);
                  }}
                >
                  <option value="">Ordenar por</option>
                  <option value="rating">Mejor calificados</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  <option value="experience">Más experiencia</option>
                </select>
              </div>

              <div className="professional-grid">
                {filteredProfessionals.map((professional, index) => (
                  <ProfessionalCard
                    key={professional.id}
                    professional={professional}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}