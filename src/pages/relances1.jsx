import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, Calendar, Phone, FileText, Building2, AlertTriangle, Search, Filter, Download } from 'lucide-react';
import { verifyAuth } from "../middlewares/auth";

export default function Candidatures({ isDark, applications, setApplications }) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [formData, setFormData] = useState({
    entreprise: "",
    typeEmploi: "stage",
    etat: "rien",
    dateEnvoi: "",
    contact: "",
    notes: ""
  });
  const [filters, setFilters] = useState({
    entreprise: "",
    typeEmploi: "",
    etat: ""
  });

  const etats = ["rien", "envoyé", "relancé1", "relancé2", "accepté", "refusé", "en cours de traitement", "pas de réponse"];

  useEffect(() => {
    setApplications(
      applications.filter(a => {
        a.etat === "envoyé"
        &&
        new Date().toLocaleDateString('FR-fr') >= calculateRelanceDate(a.dateEnvoi, 7)
      })
    )
  }, [applications])

  const calculateRelanceDate = (dateEnvoi, days) => {
    if (!dateEnvoi) return "-";
    const date = new Date(dateEnvoi);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('fr-FR');
  };

  const getEtatColor = (etat) => {
    switch (etat) {
      case "accepté": return "text-green-400 bg-green-500/20";
      case "refusé": return "text-red-400 bg-red-500/20";
      case "en cours de traitement": return "text-blue-400 bg-blue-500/20";
      case "envoyé": return "text-purple-400 bg-purple-500/20";
      case "relancé1": return "text-yellow-400 bg-yellow-500/20";
      case "relancé2": return "text-orange-400 bg-orange-500/20";
      case "pas de réponse": return "text-gray-400 bg-gray-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const handleEdit = (id) => {
    const app = applications.find(a => a._id === id);
    setFormData(app);
    setIsEditing(id);
  };

  const handleAdd = async () => {
    if (!formData.entreprise || !formData.dateEnvoi) return;
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newApp = await response.json();
        setApplications([...applications, newApp]);
        setIsAdding(false);
        resetForm();
      } else {
        console.error("Erreur lors de l'ajout de la candidature");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/update?id=${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedApp = await response.json();
        setApplications(applications.map(app =>
          app._id === isEditing ? updatedApp : app
        ));
        setIsEditing(null);
        resetForm();
      } else {
        console.error("Erreur lors de la mise à jour de la candidature");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setApplications(applications.filter(app => app._id !== id));
      } else {
        console.error("Erreur lors de la suppression de la candidature");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleDownload = () => {

  }

  const resetForm = () => {
    setFormData({
      entreprise: "",
      typeEmploi: "stage",
      etat: "rien",
      dateEnvoi: "",
      contact: "",
      notes: ""
    });
  };

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredApplications = applications.filter(app => {
    return (
      (filters.entreprise === "" || app.entreprise.toLowerCase().includes(filters.entreprise.toLowerCase())) &&
      (filters.typeEmploi === "" || app.typeEmploi === filters.typeEmploi) &&
      (filters.etat === "" || app.etat === filters.etat)
    );
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
                  Suivi des Candidatures
                </span>
              </h1>
            </div>
          </div>
          <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            <Briefcase className="inline-block w-5 h-5 mr-2" />
            Gestion de vos stages et emplois
          </p>
        </div>

        {/* Filtre */}
        <div className="max-w-[1400px] mx-auto mb-8">
          <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
            ? 'bg-black/40 border border-white/10'
            : 'bg-white/60 border border-gray-200/50'
            } shadow-2xl p-6`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 -mt-6 -mx-6 mb-6"></div>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Filter className="inline w-5 h-5 mr-2" />
              Filtrer les candidatures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Entreprise
                </label>
                <input
                  type="text"
                  name="entreprise"
                  value={filters.entreprise}
                  onChange={handleFilterChange}
                  placeholder="Nom de l'entreprise"
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type d'emploi
                </label>
                <select
                  name="typeEmploi"
                  value={filters.typeEmploi}
                  onChange={handleFilterChange}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Tous</option>
                  <option value="stage">Stage</option>
                  <option value="emploi">Emploi</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  État
                </label>
                <select
                  name="etat"
                  value={filters.etat}
                  onChange={handleFilterChange}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">Tous</option>
                  {etats.map(etat => (
                    <option key={etat} value={etat}>{etat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {(isAdding || isEditing) && (
          <div className="max-w-[1400px] mx-auto mb-8">
            <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
              ? 'bg-black/40 border border-white/10'
              : 'bg-white/60 border border-gray-200/50'
              } shadow-2xl p-6`}>
              <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 -mt-6 -mx-6 mb-6"></div>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isAdding ? 'Nouvelle candidature' : 'Modifier la candidature'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type d'emploi
                  </label>
                  <select
                    value={formData.typeEmploi}
                    onChange={(e) => setFormData({ ...formData, typeEmploi: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="stage">Stage</option>
                    <option value="emploi">Emploi</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    État
                  </label>
                  <select
                    value={formData.etat}
                    onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    {etats.map(etat => (
                      <option key={etat} value={etat}>{etat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date d'envoi *
                  </label>
                  <input
                    type="date"
                    value={new Date(formData.dateEnvoi).toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, dateEnvoi: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800/50 text-white border-gray-700' : 'bg-white border-gray-300 text-gray-900'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={isAdding ? handleAdd : handleUpdate}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold flex items-center gap-2 transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  {isAdding ? 'Ajouter' : 'Mettre à jour'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                    resetForm();
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ${isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto">
          <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
            ? 'bg-black/40 border border-white/10'
            : 'bg-white/60 border border-gray-200/50'
            } shadow-2xl`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark
                  ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10 text-gray-300'
                  : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200 text-gray-700'
                  } border-b`}>
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                      <Building2 className="inline w-4 h-4 mr-2" />
                      Entreprise
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Type</th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">État</th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Date envoi
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Relance 1</th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">Relance 2</th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Contact
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                      <FileText className="inline w-4 h-4 mr-2" />
                      Notes
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApplications.map((app, index) => (
                    <tr
                      key={app._id}
                      className={`transition-all duration-500 ${isDark
                        ? 'hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-cyan-900/20'
                        : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50'
                        }`}
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <td className={`px-6 py-4 font-semibold flex gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {
                          (
                            app.etat === "envoyé" && new Date().toLocaleDateString('FR-fr') >= calculateRelanceDate(app.dateEnvoi, 7)
                            ||
                            app.etat === "relancé1" && new Date().toLocaleDateString('FR-fr') >= calculateRelanceDate(app.dateEnvoi, 14)
                          )
                          &&
                          <AlertTriangle size={24} className='text-amber-400' />
                        }
                        {app.entreprise}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${app.typeEmploi === 'stage'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                          {app.typeEmploi}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getEtatColor(app.etat)}`}>
                          {app.etat}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(app.dateEnvoi).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {calculateRelanceDate(app.dateEnvoi, 7)}
                      </td>
                      <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {calculateRelanceDate(app.dateEnvoi, 14)}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {app.contact}
                      </td>
                      <td className="px-6 py-4">
                        {app.notes && (
                          <div className="relative">
                            <button
                              onClick={() => toggleNotes(app._id)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${isDark
                                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            >
                              {expandedNotes[app._id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              Voir
                            </button>
                            {expandedNotes[app._id] && (
                              <div className={`absolute z-10 mt-2 p-3 rounded-lg shadow-xl bg-black min-w-[200px] max-w-[300px] ${isDark
                                ? 'bg-gray-900 border border-gray-700 text-gray-300'
                                : 'bg-white border border-gray-200 text-gray-700'
                                }`}>
                                {app.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(app._id)}
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-white/5">
              {filteredApplications.map((app, index) => (
                <div
                  key={app._id}
                  className={`p-6 transition-all duration-500 ${isDark
                    ? 'hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-cyan-900/20'
                    : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50'
                    }`}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {app.entreprise}
                        </h3>
                        <div className="flex gap-2 mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${app.typeEmploi === 'stage'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {app.typeEmploi}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getEtatColor(app.etat)}`}>
                            {app.etat}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(app._id)}
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Envoyé:</span> {new Date(app.dateEnvoi).toLocaleDateString('fr-FR')}
                      </div>
                      <div className={`pl-6 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Relance 1: {calculateRelanceDate(app.dateEnvoi, 7)} | Relance 2: {calculateRelanceDate(app.dateEnvoi, 14)}
                      </div>
                      {app.contact && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="font-semibold">Contact:</span> {app.contact}
                        </div>
                      )}
                      {app.notes && (
                        <div>
                          <button
                            onClick={() => toggleNotes(app._id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${isDark
                              ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                          >
                            <FileText className="w-3 h-3" />
                            {expandedNotes[app._id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Notes
                          </button>
                          {expandedNotes[app._id] && (
                            <div className={`mt-2 p-3 rounded-lg ${isDark
                              ? 'bg-gray-800/50 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                              }`}>
                              {app.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = verifyAuth(req, res);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { _id: user._id, nom: user.nom, prenom: user.prenom } },
  };
}