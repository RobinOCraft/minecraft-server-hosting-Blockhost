import { Server, Shield, Zap, HardDrive, Cpu, Globe, Clock, Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "../contexts/LanguageContext";

export function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Zap,
      title: t('features.instant.title'),
      description: t('features.instant.desc')
    },
    {
      icon: Shield,
      title: t('features.ddos.title'),
      description: t('features.ddos.desc')
    },
    {
      icon: HardDrive,
      title: t('features.backups.title'),
      description: t('features.backups.desc')
    },
    {
      icon: Cpu,
      title: t('features.performance.title'),
      description: t('features.performance.desc')
    },
    {
      icon: Globe,
      title: 'St. Gallen, Switzerland',
      description: 'Premium server location in Switzerland with lowest latency'
    },
    {
      icon: Clock,
      title: '99.9% Uptime',
      description: 'Industry-leading uptime SLA with redundant infrastructure'
    },
    {
      icon: Server,
      title: 'Mod Support',
      description: 'Full support for Forge, Fabric, Spigot, Paper, and more'
    },
    {
      icon: Headphones,
      title: t('features.support.title'),
      description: t('features.support.desc')
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-green-500" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}