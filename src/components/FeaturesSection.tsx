
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('features.vendorDiscovery'),
      description: t('features.vendorDescription')
    },
    {
      icon: Calendar,
      title: t('features.budgetPlanning'),
      description: t('features.budgetDescription')
    },
    {
      icon: User,
      title: t('features.guestManagement'),
      description: t('features.guestDescription')
    },
    {
      icon: Calendar,
      title: t('features.timelineSync'),
      description: t('features.timelineDescription')
    }
  ];

  return (
    <section id="features" className="py-20 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
            {t('features.title')}
            <span className="text-blush-400"> {t('features.titleAccent')}</span>
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-blush-200 hover:border-blush-300 bg-white hover:bg-gradient-to-br hover:from-blush-50 hover:to-sage-50"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blush-200 to-dustyRose-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-charcoal" />
                </div>
                <CardTitle className="text-xl font-semibold text-charcoal">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-charcoal/70 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
