"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    kelompok: "",
    is_testi: "0",
    rating: 5,
    pesan: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // API Integrasi simpan pesan di sini nanti
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi loading

      setSuccess(true);
      setFormData({
        nama: "",
        email: "",
        subjek: "",
        kelompok: "",
        is_testi: "0",
        rating: 5,
        pesan: "",
      });
    } catch {
      setError("Pesan gagal dikirim. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-animate glass-card p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <i className="fa-regular fa-paper-plane" />
        </div>
        Tinggalkan Pesan
      </h3>
      
      {success && (
        <div className="mb-6 p-4 sm:p-5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-start sm:items-center gap-3 border border-green-200 dark:border-green-800/50 transition-all duration-500">
          <i className="fa-solid fa-circle-check text-xl mt-0.5 sm:mt-0" /> 
          <div className="text-sm sm:text-base">
            <span className="font-bold block sm:inline">Berhasil!</span> Pesan Anda telah kami terima dan akan segera diproses.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 sm:p-5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/50 flex items-start sm:items-center gap-3 transition-all duration-500">
          <i className="fa-solid fa-circle-exclamation text-xl mt-0.5 sm:mt-0" />
          <div className="text-sm sm:text-base">{error}</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              placeholder="Cth: Budi Santoso"
              required
              autoComplete="name"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm placeholder-gray-400 text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Email Aktif</label>
            <input
              type="email"
              name="email"
              placeholder="Cth: budi@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm placeholder-gray-400 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Subjek</label>
          <input
            type="text"
            name="subjek"
            placeholder="Perihal pesan Anda"
            required
            value={formData.subjek}
            onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm placeholder-gray-400 text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Kelas Anak</label>
            <select
              name="kelompok"
              value={formData.kelompok}
              onChange={(e) => setFormData({ ...formData, kelompok: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-base"
            >
              <option value="">-- Pilih Kelas --</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
              <option value="4">Kelas 4</option>
              <option value="5">Kelas 5</option>
              <option value="6">Kelas 6</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Kirim Sebagai</label>
            <select
              name="is_testi"
              value={formData.is_testi}
              onChange={(e) => setFormData({ ...formData, is_testi: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-base"
            >
              <option value="0">Pesan biasa</option>
              <option value="1">💬 Saya ingin berbagi testimoni</option>
            </select>
          </div>
        </div>

        {formData.is_testi === "1" && (
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rating Kepuasan</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-3xl transition-colors ${
                    star <= formData.rating ? "text-amber-400" : "text-gray-300"
                  }`}
                  aria-label={`Beri rating ${star} bintang`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Pesan</label>
          <textarea
            name="pesan"
            rows={5}
            placeholder="Tuliskan pertanyaan atau masukan Anda di sini..."
            required
            value={formData.pesan}
            onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-sm placeholder-gray-400 text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <span>Mengirim...</span>
              <i className="fa-solid fa-spinner animate-spin" />
            </>
          ) : (
            <>
              <span>Kirim Pesan Sekarang</span>
              <i className="fa-solid fa-paper-plane text-sm" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}