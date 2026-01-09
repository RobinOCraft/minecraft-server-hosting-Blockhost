import { Users, Server, Zap, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function Stats() {
  const { t } = useLanguage();
  const [totalServers, setTotalServers] = useState(0);
  const [activePlayers, setActivePlayers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = () => {
    try {
      // Get all registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      // Count total servers from all users
      let serverCount = 0;
      let playerCount = 0;
      
      registeredUsers.forEach((user: any) => {
        const userServersKey = `${user.email}_servers`;
        const servers = JSON.parse(localStorage.getItem(userServersKey) || '[]');
        serverCount += servers.length;
        
        // Count players from running servers
        servers.forEach((server: any) => {
          if (server.status === 'running') {
            playerCount += server.currentPlayers || 0;
          }
        });
      });

      setTotalServers(serverCount);
      setActivePlayers(playerCount);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      value: isLoading ? "..." : activePlayers > 0 ? `${activePlayers.toLocaleString()}` : "0",
      label: t('stats.customers')
    },
    {
      icon: Server,
      value: isLoading ? "..." : totalServers > 0 ? `${totalServers.toLocaleString()}` : "0",
      label: t('stats.servers')
    },
    {
      icon: Zap,
      value: "99.9%",
      label: t('stats.uptime')
    },
    {
      icon: Clock,
      value: "<60s",
      label: t('stats.support')
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900/20 to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-4xl text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}