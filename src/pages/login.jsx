import { useState, useEffect } from 'react';
import { Shield, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { verifyAuth } from "../middlewares/auth";

export default function Login({ isDark }) {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau lors de la connexion");
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark
        ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]'
        : 'bg-gradient-to-br from-[#f4f4f4] via-[#e8e8f5] to-[#f4f4f4]'
      }`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-600' : 'bg-purple-400'
          }`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'
          }`} style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12 mt-20">
          <div className="inline-block mb-6">
            <div className="relative">
              <h1 className={`relative text-5xl md:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Connexion
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto">
          <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
              ? 'bg-black/40 border border-white/10'
              : 'bg-white/60 border border-gray-200/50'
            } shadow-2xl`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

            <div className={`px-8 py-6 border-b ${isDark
                ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10'
                : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'
              }`}>
              <div className="flex items-center justify-center gap-3">
                <LogIn className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Se connecter
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${isDark
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50'
                      }`}
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Mot de passe
                  </label>
                  <a
                    href="#"
                    className={`text-sm font-semibold transition-colors ${isDark
                        ? 'text-purple-400 hover:text-purple-300'
                        : 'text-purple-600 hover:text-purple-700'
                      }`}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${isDark
                        ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-2 transition-colors cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className={`text-sm cursor-pointer ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isDark
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white'
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white'
                  }`}
              >
                Se connecter
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 ${isDark ? 'bg-black/40 text-gray-400' : 'bg-white/60 text-gray-600'
                    }`}>
                    OU
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Vous n'avez pas de compte ?{' '}
                  <Link
                    href="register"
                    className={`font-semibold transition-colors ${isDark
                        ? 'text-purple-400 hover:text-purple-300'
                        : 'text-purple-600 hover:text-purple-700'
                      }`}
                  >
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className={`mt-8 p-6 rounded-2xl backdrop-blur-xl ${isDark
              ? 'bg-black/30 border border-white/10'
              : 'bg-white/40 border border-gray-200/50'
            }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Accès sécurisé
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Authentification sécurisée
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Protection des données
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Connexion rapide et fiable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = verifyAuth(req, res);

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session: null },
  };
}