import React, { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import { TVAutomationDeck } from './components/tv/TVAutomationDeck.jsx';
import { DawnEngine } from './components/audio/DawnEngine.jsx';
import { ModuleRenderer } from './components/modules/ModuleRenderer.jsx';
import { useModuleManager } from './hooks/useModuleManager.js';

function App() {
  const [activeView, setActiveView] = useState('split');
  const { activeModules } = useModuleManager();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DashboardLayout
        activeView={activeView}
        setActiveView={setActiveView}
        tvPanel={<TVAutomationDeck />}
        audioPanel={<DawnEngine />}
      />

      {/* Floating D9Enigma Modules */}
      {activeModules.map(([instanceId, instance]) => (
        <ModuleRenderer key={instanceId} instance={instance} />
      ))}
    </div>
  );
}

export default App;
