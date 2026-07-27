interface ContactInfoCardsProps {
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: string;
}

export default function ContactInfoCards({ alamat, telepon, email, jamOperasional }: ContactInfoCardsProps) {
  const jamOperasionalHtml = jamOperasional.replace(/&lt;br&gt;/g, "<br>");

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Alamat */}
      <div className="card-animate glass-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 sm:gap-5 group" style={{ animationDelay: "0.1s" }}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
          <i className="fa-solid fa-location-dot text-xl sm:text-2xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg mb-1">Alamat</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{alamat}</p>
        </div>
      </div>

      {/* Telepon */}
      <div className="card-animate glass-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 sm:gap-5 group" style={{ animationDelay: "0.2s" }}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
          <i className="fa-solid fa-phone text-xl sm:text-2xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg mb-1">Telepon</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{telepon}</p>
        </div>
      </div>

      {/* Email */}
      <div className="card-animate glass-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 sm:gap-5 group" style={{ animationDelay: "0.3s" }}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
          <i className="fa-solid fa-envelope text-xl sm:text-2xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg mb-1">Email</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{email}</p>
        </div>
      </div>

      {/* Jam Operasional */}
      <div className="card-animate glass-card p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 sm:gap-5 group" style={{ animationDelay: "0.4s" }}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
          <i className="fa-solid fa-clock text-xl sm:text-2xl" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg mb-1">Jam Operasional</h3>
          <p
            className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: jamOperasionalHtml }}
          />
        </div>
      </div>

    </div>
  );
}