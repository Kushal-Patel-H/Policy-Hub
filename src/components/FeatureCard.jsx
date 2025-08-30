export default function FeatureCard({ title, text, iconSrc }) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow hover:shadow-xl transition hover:-translate-y-1 border border-gray-100">
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
      <div className="mt-6 flex items-center justify-center">
        <img src={iconSrc} alt={title} className="h-16 w-16 object-contain group-hover:scale-105 transition" />
      </div>
    </div>
  );
}
