export default function SummaryCard({ title, subtitle, text, value = "N", iconSrc }) {
  return (
    <div className="relative rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden min-h-[130px]">
      {/* left accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#0A2A67] to-[#0A2A67]" />

      <div className="p-6 pl-7 flex items-start justify-between">
        {/* Left: Icon + text stacked */}
        <div className="flex flex-col items-start gap-2">
          {iconSrc ? (
            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <img src={iconSrc} alt={title} className="h-10 w-10" />
            </div>
          ) : null}

          <div>
            <div className="text-sm font-semibold text-gray-800">{title}</div>
            {(subtitle || text) && (
              <div className="text-xs text-gray-500">{subtitle || text}</div>
            )}
          </div>
        </div>

        {/* Right: Value */}
        <div className="text-lg font-bold text-gray-900 mt-1">{value}</div>
      </div>
    </div>
  );
}
