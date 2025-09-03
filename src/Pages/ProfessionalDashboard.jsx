import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, Star, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/dashboard/DashboardStats';
import AppointmentsTab from '@/components/dashboard/AppointmentsTab';
import ReviewsTab from '@/components/dashboard/ReviewsTab';
import CalendarTab from '@/components/dashboard/CalendarTab';
import ProfileTab from '@/components/dashboard/ProfileTab';

export default function ProfessionalDashboard() {
  const { user } = useAuth();

  if (user?.type !== 'professional') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600">Esta página es solo para profesionales.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Panel Profesional - Nework</title>
        <meta name="description" content="Gestiona tu perfil profesional, citas y reseñas en Nework" />
        <meta property="og:title" content="Panel Profesional - Nework" />
        <meta property="og:description" content="Administra tu negocio y conecta con clientes en Nework" />
      </Helmet>

      <Header title="Panel Profesional" />

      <div className="container mx-auto px-4 py-8">
        <DashboardStats />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="appointments" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments"><Calendar className="w-4 h-4 mr-2" />Citas</TabsTrigger>
              <TabsTrigger value="reviews"><Star className="w-4 h-4 mr-2" />Reseñas</TabsTrigger>
              <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />Calendario</TabsTrigger>
              <TabsTrigger value="profile"><Settings className="w-4 h-4 mr-2" />Mi Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="mt-6">
              <AppointmentsTab />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsTab />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <CalendarTab />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <ProfileTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}