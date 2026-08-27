import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { openOAuthPopup } from '../utils/oauth';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link2,
  Unlink,
  ExternalLink
} from 'lucide-react';

export const SocialConnectCard = ({ provider, isCompact = false }) => {
  const { user, socialLogin, notify, t, language } = useCV();
  
  // State: 'idle' | 'loading' | 'connected' | 'error'
  const isCurrentlyConnected = user && (user.provider === provider.toLowerCase());
  const [status, setStatus] = useState(isCurrentlyConnected ? 'connected' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isGoogle = provider === 'Google';
  const brandColor = isGoogle ? '#EA4335' : '#1877F2';
  const brandName = isGoogle ? 'Gmail / Google' : 'Facebook / Meta';

  // Handle Connect Click
  const handleConnect = () => {
    setStatus('loading');
    setErrorMessage('');

    openOAuthPopup({
      provider,
      onComplete: async (profile) => {
        const res = await socialLogin(provider, profile);
        if (res.success) {
          setStatus('connected');
          notify(
            language === 'km'
              ? `បានភ្ជាប់ជាមួយ ${brandName} ដោយជោគជ័យ!`
              : `Connected to ${brandName} successfully!`,
            'success'
          );
        } else {
          setStatus('error');
          setErrorMessage(res.error || 'Connection failed');
        }
      },
      onError: (err) => {
        setStatus('error');
        setErrorMessage(err || 'Failed to open login window');
      }
    });
  };

  // Handle Disconnect
  const handleDisconnect = async () => {
    setStatus('idle');
    notify(
      language === 'km'
        ? `បានផ្តាច់ការភ្ជាប់ ${brandName}`
        : `Disconnected from ${brandName}`,
      'info'
    );
  };

  if (isCompact) {
    // Compact Button Layout (For AuthModal)
    return (
      <div className="w-full">
        {status === 'loading' && (
          <button
            disabled
            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-slate-800 text-slate-300 border border-slate-700 shadow-sm animate-pulse"
          >
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>{language === 'km' ? `កំពុងភ្ជាប់ទៅ ${provider}...` : `Connecting to ${provider}...`}</span>
          </button>
        )}

        {status === 'connected' && (
          <div className="flex items-center justify-between p-2 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ {provider} Connected</span>
            </div>
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-[11px] text-slate-400 hover:text-red-400 underline font-medium"
            >
              Disconnect
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <button
              type="button"
              onClick={handleConnect}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm transition"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{language === 'km' ? '⚠ បរាជ័យ — សាកល្បងម្តងទៀត' : '⚠ Connection Failed — Try Again'}</span>
            </button>
            {errorMessage && (
              <p className="text-[10px] text-red-400/90 mt-1 text-center">{errorMessage}</p>
            )}
          </div>
        )}

        {status === 'idle' && (
          <button
            type="button"
            onClick={handleConnect}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition border ${
              isGoogle
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                : 'bg-[#1877F2] hover:bg-[#166fe5] text-white border-[#1877F2]'
            }`}
          >
            {isGoogle ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
            <span>{isGoogle ? 'Gmail / Google' : 'Facebook'}</span>
          </button>
        )}
      </div>
    );
  }

  // Full Feature Card Layout (For Settings / Profile modal)
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
            isGoogle ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2]'
          }`}>
            {isGoogle ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{brandName}</h4>
            <p className="text-[11px] text-slate-400">
              {status === 'connected'
                ? (language === 'km' ? 'គណនីបានភ្ជាប់រួចរាល់' : 'Account linked to your CVForge profile')
                : (language === 'km' ? 'ភ្ជាប់ដើម្បី Login ដោយមិនបាច់វាយ Password' : 'Connect for passwordless 1-click login')}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === 'connected' && (
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Connected</span>
            </span>
          )}
          {status === 'loading' && (
            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Connecting...</span>
            </span>
          )}
          {status === 'error' && (
            <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Error</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          OAuth 2.0 Secure Protocol
        </div>

        {status === 'connected' ? (
          <button
            type="button"
            onClick={handleDisconnect}
            className="px-3 py-1.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        ) : status === 'loading' ? (
          <button
            disabled
            className="px-3.5 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Connecting...</span>
          </button>
        ) : status === 'error' ? (
          <button
            type="button"
            onClick={handleConnect}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              isGoogle
                ? 'bg-white hover:bg-slate-100 text-slate-900'
                : 'bg-[#1877F2] hover:bg-[#166fe5] text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Connect {provider}</span>
          </button>
        )}
      </div>
    </div>
  );
};
