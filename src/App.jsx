import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  Clock,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

const API_CONFIGS = {
  SUCCESS: {
    name: 'Normal Endpoint (Users API)',
    url: 'https://jsonplaceholder.typicode.com/users',
    shouldFail: false,
  },
  ERROR_404: {
    name: 'Simulated 404 (Not Found)',
    url: 'https://jsonplaceholder.typicode.com/nonexistent_resource_endpoint',
    shouldFail: true,
  },
  NETWORK_FAIL: {
    name: 'Simulated Network Failure',
    url: 'https://invalid-subdomain-that-does-not-exist.typicode.com/users',
    shouldFail: true,
  },
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState('SUCCESS');
  const [simulateDelay, setSimulateDelay] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ latency: null, timestamp: null, status: null });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = useCallback(async (endpointKey = selectedEndpoint) => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    const config = API_CONFIGS[endpointKey];

    try {
      // Optional artificial delay to clearly observe loading states and skeletons
      if (simulateDelay) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const response = await fetch(config.url, {
        headers: { 'Accept': 'application/json' },
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText || 'Failed to fetch resource'}`);
      }

      const result = await response.json();
      setData(result);
      setStats({
        latency: elapsed,
        timestamp: new Date().toLocaleTimeString(),
        status: response.status,
      });
      setError(null);
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setError({
        message: err.message || 'Unknown network error occurred while connecting to the API.',
        url: config.url,
        endpointKey,
        time: new Date().toLocaleTimeString(),
        latency: elapsed,
      });
      setData([]);
      setStats({
        latency: elapsed,
        timestamp: new Date().toLocaleTimeString(),
        status: 'Error',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedEndpoint, simulateDelay]);

  // Initial fetch
  useEffect(() => {
    fetchData('SUCCESS');
  }, [fetchData]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.company?.name?.toLowerCase().includes(query) ||
        user.address?.city?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const handleEndpointChange = (key) => {
    setSelectedEndpoint(key);
    fetchData(key);
  };

  const handleRetry = () => {
    fetchData(selectedEndpoint);
  };

  const handleResetToSuccess = () => {
    setSelectedEndpoint('SUCCESS');
    fetchData('SUCCESS');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Banner / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">API State Explorer</h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Single Screen React
                  </span>
                </div>
                <p className="text-xs text-slate-500">Live API handling with loading, error & success states</p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="font-medium text-slate-500">Status:</span>
                {loading ? (
                  <span className="flex items-center text-amber-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-1.5 inline-block"></span>
                    Fetching...
                  </span>
                ) : error ? (
                  <span className="flex items-center text-rose-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 inline-block"></span>
                    Failed ({error.latency}ms)
                  </span>
                ) : (
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
                    200 OK ({stats.latency}ms)
                  </span>
                )}
              </div>

              <button
                onClick={handleRetry}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Refresh API Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Loading...' : 'Refetch'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Interactive Controls & Scenario Bar */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Test API State Scenarios</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch between healthy endpoint and simulated error endpoints to observe reactive UI changes.
              </p>
            </div>

            {/* Delay toggle */}
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <label htmlFor="delay-toggle" className="text-xs text-slate-600 font-medium cursor-pointer flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulate Network Delay (800ms)</span>
              </label>
              <input
                id="delay-toggle"
                type="checkbox"
                checked={simulateDelay}
                onChange={(e) => setSimulateDelay(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Scenario Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <button
              onClick={() => handleEndpointChange('SUCCESS')}
              disabled={loading && selectedEndpoint === 'SUCCESS'}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'SUCCESS' && !error
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${selectedEndpoint === 'SUCCESS' && !error ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Success Scenario</div>
                  <div className="text-[11px] text-slate-500">200 OK • 10 Users</div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selectedEndpoint === 'SUCCESS' && !error ? 'bg-emerald-200/70 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                Healthy
              </span>
            </button>

            <button
              onClick={() => handleEndpointChange('ERROR_404')}
              disabled={loading && selectedEndpoint === 'ERROR_404'}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'ERROR_404'
                  ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${selectedEndpoint === 'ERROR_404' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Trigger 404 Error</div>
                  <div className="text-[11px] text-slate-500">Missing resource endpoint</div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selectedEndpoint === 'ERROR_404' ? 'bg-rose-200/70 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
                HTTP 404
              </span>
            </button>

            <button
              onClick={() => handleEndpointChange('NETWORK_FAIL')}
              disabled={loading && selectedEndpoint === 'NETWORK_FAIL'}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'NETWORK_FAIL'
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${selectedEndpoint === 'NETWORK_FAIL' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Trigger Network Fail</div>
                  <div className="text-[11px] text-slate-500">DNS / host unreachable</div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selectedEndpoint === 'NETWORK_FAIL' ? 'bg-amber-200/70 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                DNS Fail
              </span>
            </button>
          </div>
        </section>

        {/* Dynamic State Display: ERROR STATE */}
        {error && !loading && (
          <section className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-rose-900 tracking-tight">API Request Failed</h2>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-rose-200 text-rose-800">
                    Failed at {error.time}
                  </span>
                </div>

                <p className="text-sm text-rose-700 leading-relaxed font-medium">
                  {error.message}
                </p>

                <div className="bg-white/90 rounded-xl p-3.5 border border-rose-200 text-xs font-mono text-slate-700 space-y-1">
                  <div className="flex items-center text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-700 mr-2">Target URL:</span>
                    <span className="truncate">{error.url}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-700 mr-2">Response Time:</span>
                    <span>{error.latency} ms</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Request</span>
                  </button>

                  <button
                    onClick={handleResetToSuccess}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reset to Healthy Endpoint</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stats & Search Toolbar (Visible when not in full error or when data is ready) */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800">Users Directory</h2>
            {!loading && !error && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/80 text-slate-700">
                {filteredUsers.length} of {data.length} records
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading || !!error}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 text-slate-800 disabled:opacity-50 disabled:bg-slate-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* Dynamic State Display: LOADING STATE (Skeleton Cards) */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-medium">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Contacting endpoint and retrieving JSON payload...</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-600/80">Connecting...</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic State Display: SUCCESS DATA STATE */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((user) => {
              const initials = user.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'U';

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono">@{user.username}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        ID #{user.id}
                      </span>
                    </div>

                    {/* Meta information */}
                    <div className="space-y-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{user.company?.name || 'Independent'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-indigo-600 truncate transition-colors"
                        >
                          {user.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user.address?.city}, {user.address?.zipcode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{user.website}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-medium border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic State Display: EMPTY FILTER STATE */}
        {!loading && !error && filteredUsers.length === 0 && data.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any user matching your search for <span className="font-semibold text-slate-700">"{searchQuery}"</span>.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear Search Query
            </button>
          </div>
        )}

        {/* Architecture & State Summary Footer Bar */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-800">State Architecture:</span>
              <span className="hidden sm:inline">React useState & useCallback + Tailwind CSS (Light Mode)</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Success (200 OK)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Loading (Skeleton)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Error Handling & Retry</span>
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 font-mono">@{selectedUser.username} • ID #{selectedUser.id}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-b border-slate-100 py-4">
              <div>
                <span className="font-semibold text-slate-700 block">Company:</span>
                <span>{selectedUser.company?.name} — "{selectedUser.company?.catchPhrase}"</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">Address:</span>
                <span>{selectedUser.address?.suite}, {selectedUser.address?.street}, {selectedUser.address?.city} ({selectedUser.address?.zipcode})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="font-semibold text-slate-700 block">Email:</span>
                  <a href={`mailto:${selectedUser.email}`} className="text-indigo-600 hover:underline">{selectedUser.email}</a>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Website:</span>
                  <a href={`https://${selectedUser.website}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{selectedUser.website}</a>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
