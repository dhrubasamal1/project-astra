import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Mountain,
  Layers,
  Droplets,
  CloudRain,
  Zap,
  Trees,
  Building2,
  TrendingUp,
  Satellite,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type NavPageId =
  | 'overview'
  | 'site_selection'
  | 'terrain'
  | 'soil'
  | 'water'
  | 'climate'
  | 'energy'
  | 'vegetation'
  | 'city_designer'
  | 'simulation'
  | 'isro_hub'
  | 'reports'
  | 'assistant';

interface AppSidebarProps {
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activePage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      group: 'Core Planning',
      items: [
        { id: 'overview' as NavPageId, label: 'Overview', icon: LayoutDashboard },
        { id: 'site_selection' as NavPageId, label: 'Site Selection', icon: MapPin, badge: 'GIS' },
        { id: 'city_designer' as NavPageId, label: 'AI City Designer', icon: Building2, highlight: true, badge: 'AI' },
        { id: 'simulation' as NavPageId, label: 'Future Simulation', icon: TrendingUp, badge: '2050' },
      ],
    },
    {
      group: 'Intelligence Modules',
      items: [
        { id: 'terrain' as NavPageId, label: 'Terrain & Geology', icon: Mountain },
        { id: 'soil' as NavPageId, label: 'Soil Intelligence', icon: Layers },
        { id: 'water' as NavPageId, label: 'Water Intelligence', icon: Droplets },
        { id: 'climate' as NavPageId, label: 'Climate & Disaster', icon: CloudRain },
        { id: 'energy' as NavPageId, label: 'Renewable Energy', icon: Zap },
        { id: 'vegetation' as NavPageId, label: 'Vegetation (NDVI)', icon: Trees },
      ],
    },
    {
      group: 'Space & Dossiers',
      items: [
        { id: 'isro_hub' as NavPageId, label: 'ISRO Space Data Hub', icon: Satellite, badge: '4-Portal' },
        { id: 'reports' as NavPageId, label: 'Reports & Export', icon: FileText },
      ],
    },
  ];

  return (
    <aside
      className={`no-print h-full bg-[#07111F] border-r border-white/[0.08] flex flex-col justify-between shrink-0 transition-all duration-300 z-20 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top: Nav list */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-mono font-bold text-[#94A3B8]/70 uppercase tracking-wider">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isHighlight = item.highlight;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#17283A] text-[#22D3EE] font-semibold border border-[#22D3EE]/30 shadow-sm'
                      : isHighlight
                      ? 'text-[#F1F5F9] hover:bg-[#111F30] border border-[#22D3EE]/20'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-[#22D3EE]'
                          : isHighlight
                          ? 'text-[#22D3EE]'
                          : 'text-[#94A3B8] group-hover:text-[#F1F5F9]'
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded ${
                        item.badge === 'AI'
                          ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                          : item.badge === '4-Portal'
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                          : 'bg-[#17283A] text-[#94A3B8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#22D3EE]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Sidebar collapse button & status */}
      <div className="p-2 border-t border-white/[0.08] bg-[#07111F]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111F30] text-xs transition-all"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#22D3EE]" />
          ) : (
            <div className="flex items-center space-x-2 w-full justify-between px-2">
              <span className="text-[11px] font-mono text-[#94A3B8]">Collapse Sidebar</span>
              <ChevronLeft className="w-4 h-4 text-[#94A3B8]" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
