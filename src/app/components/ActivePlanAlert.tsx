import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { AlertCircle, ArrowRight, Settings } from 'lucide-react';

interface ActivePlanAlertProps {
  onGoToDashboard: () => void;
}

export function ActivePlanAlert({ onGoToDashboard }: ActivePlanAlertProps) {
  const { t } = useLanguage();
  const { user } = useUser();

  if (!user?.hasActivePlan || !user?.currentPlan) {
    return null;
  }

  return (
    <div className="relative z-10 -mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <AlertCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('alert.hasActivePlan.title')}
                </h3>
                <p className="text-gray-300 mb-4">
                  {t('alert.hasActivePlan.description').replace('{plan}', user.currentPlan)}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onGoToDashboard}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t('alert.hasActivePlan.goToDashboard')}
                  </Button>
                  <Button
                    onClick={onGoToDashboard}
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-600/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('alert.hasActivePlan.managePlan')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
