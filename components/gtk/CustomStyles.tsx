import React from 'react';

export default function CustomStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --glass-bg: rgba(255,255,255,.96);
        --glass-border: rgba(255,255,255,.2);
      }
      .dark { --glass-bg: rgba(30,41,59,.96); --glass-border: rgba(255,255,255,.08); }

      .glass-card { background:var(--glass-bg); backdrop-filter:blur(12px); border:1px solid var(--glass-border); }
      @media(max-width:640px){ .glass-card { backdrop-filter:blur(8px); } }

      /* Animasi Muncul Pertama Kali */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .card-animate { 
        animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      /* Efek Hover Kedalaman (Deep Hover Effect) */
      .card-deep-hover {
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
                    box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1), 
                    border-color 0.4s ease;
        will-change: transform, box-shadow;
      }
      .card-deep-hover:hover {
        transform: translateY(-10px) scale(1.025);
        /* Kombinasi bayangan luar yang dalam & glow halus */
        box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.12), 
                    0 15px 30px -10px rgba(0, 0, 0, 0.08),
                    0 0 20px 2px rgba(37, 99, 235, 0.06);
        border-color: rgba(37, 99, 235, 0.3) !important;
      }
      .dark .card-deep-hover:hover {
        box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.45), 
                    0 15px 30px -10px rgba(0, 0, 0, 0.3),
                    0 0 20px 2px rgba(6, 182, 212, 0.1);
        border-color: rgba(6, 182, 212, 0.3) !important;
      }
      @media(hover:none){
        .card-deep-hover:active {
          transform: scale(0.98);
        }
      }

      @keyframes blob {
        0%,100%{transform:translate(0,0) scale(1);}
        33%{transform:translate(30px,-50px) scale(1.1);}
        66%{transform:translate(-20px,20px) scale(.9);}
      }
      .animate-blob { animation:blob 7s infinite; }
      .animation-delay-2000 { animation-delay:2s; }
      .animation-delay-4000 { animation-delay:4s; }

      @keyframes float-slow {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(1deg); }
      }
      .float-icon {
        animation: float-slow 30s ease-in-out infinite !important;
        opacity: 0.08;
        position: absolute;
        font-size: 200px;
        line-height: 1;
        pointer-events: none;
        will-change: transform;
      }
      .float-icon-1 { top: 20px; left: 20px; }
      .float-icon-2 { bottom: 20px; right: 20px; animation-delay: -15s !important; }
      @media(max-width:640px){.float-icon{font-size:120px;}}

      .ks-ring{background:conic-gradient(from 180deg,#2563eb,#06b6d4,#6366f1,#2563eb);padding:3px;border-radius:9999px;}

      .avatar-local{
        width:100%;height:100%;border-radius:9999px;
        display:flex;align-items:center;justify-content:center;
        font-weight:900;font-size:1.1rem;color:white;
        background:linear-gradient(135deg,var(--av-from),var(--av-to));
        user-select:none;
      }

      .berkas-item{
        display:flex;align-items:center;gap:10px;
        padding:9px 12px;border-radius:10px;
        background:white;border:1px solid #e2e8f0;
        text-decoration:none;transition:all .2s;
      }
      .dark .berkas-item{background:#334155;border-color:#475569;}
      .berkas-item:hover{background:#eff6ff;border-color:#bfdbfe;transform:translateX(2px);}
      .dark .berkas-item:hover{background:#1e3a5f;border-color:#3b82f6;}
    ` }} />
  );
}