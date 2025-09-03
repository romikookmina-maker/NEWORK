import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StatCard = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="stats-card"
  >
    <div className="flex items-center justify-between mb-2">
      {icon}
      <TrendingUp className="h-4 w-4 text-green-500" />
    </div>
    <div className="stats-number">{value}</div>
    <div className="stats-label">{label}</div>
  </motion.div>
);

export default function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedServices: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (!user) return;

    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const professionalAppointments = allAppointments.filter(apt => apt.professionalId === user.id);
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const professionalReviews = allReviews.filter(review => review.professionalId === user.id);

    const completedAppointments = professionalAppointments.filter(apt => apt.status === 'completed');
    const avgRating = professionalReviews.length > 0
      ? professionalReviews.reduce((sum, review) => sum + review.rating, 0) / professionalReviews.length
      : 0;
    const totalEarnings = completedAppointments.length * (user?.hourlyRate || 0);

    setStats({
      totalAppointments: professionalAppointments.length,
      completedServices: completedAppointments.length,
      averageRating: avgRating,
      totalEarnings: totalEarnings
    });
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<Calendar className="h-8 w-8 text-blue-500" />}
        label="Citas Totales"
        value={stats.totalAppointments}
        delay={0.1}
      />
      <StatCard
        icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        label="Servicios Completados"
        value={stats.completedServices}
        delay={0.2}
      />
      <StatCard
        icon={<Star className="h-8 w-8 text-yellow-500" />}
        label="Calificación Promedio"
        value={stats.averageRating.toFixed(1)}
        delay={0.3}
      />
      <StatCard
        icon={<span className="text-3xl">💰</span>}
        label="Ingresos Estimados"
        value={`$${stats.totalEarnings.toLocaleString()}`}
        delay={0.4}
      />
    </div>
  );
}