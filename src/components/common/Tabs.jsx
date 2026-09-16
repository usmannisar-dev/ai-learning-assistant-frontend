const Tabs = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <div className="relative overflow-x-auto border-b-2 border-slate-100">
        <nav className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`relative px-3 pb-4 text-sm font-semibold transition-all duration-200 md:px-6 ${
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>

                {isActive && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25" />

                    <div className="absolute inset-0 -z-10 rounded-t-xl bg-linear-to-b from-emerald-50/50 to-transparent" />
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="py-6">
        {tabs.map((tab) => {
          if (tab.name !== activeTab) {
            return null;
          }

          return (
            <div key={tab.name} className="animate-in fade-in duration-300">
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
