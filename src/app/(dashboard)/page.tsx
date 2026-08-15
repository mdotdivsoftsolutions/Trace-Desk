'use client';

import React from 'react';
import { useDashboardMetrics, useProjects } from '@/hooks';
import { ProjectType } from '@/types';
import { WelcomeBanner } from '@/components/modules/dashboard/WelcomeBanner';
import { KpiGrid } from '@/components/modules/dashboard/KpiGrid';
import { ActiveProjectsList } from '@/components/modules/dashboard/ActiveProjectsList';
import { UrgentDeadlinesWidget } from '@/components/modules/dashboard/UrgentDeadlinesWidget';
import { UnbilledMilestonesWidget } from '@/components/modules/dashboard/UnbilledMilestonesWidget';

export default function DashboardPage() {
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({ limit: 10 });

  const activeProjects = (projectsData?.items || []).filter((p: ProjectType) =>
    ['discovery', 'in_progress', 'review'].includes(p.status)
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <WelcomeBanner />
      <KpiGrid metrics={metrics} isLoading={isMetricsLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActiveProjectsList projects={activeProjects} isLoading={isProjectsLoading} />
        <div className="space-y-6">
          <UrgentDeadlinesWidget metrics={metrics} isLoading={isMetricsLoading} />
          <UnbilledMilestonesWidget metrics={metrics} isLoading={isMetricsLoading} />
        </div>
      </div>
    </div>
  );
}
