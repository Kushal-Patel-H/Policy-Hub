export default function RegisterModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Register</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500"
            placeholder="Full name"
          />
          <input
            type="email"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-indigo-500"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
