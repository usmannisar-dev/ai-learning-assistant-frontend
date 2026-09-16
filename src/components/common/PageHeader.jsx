const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
