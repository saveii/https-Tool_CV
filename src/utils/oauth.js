// Direct OAuth Popup Manager for Facebook & Google

export const openOAuthPopup = ({ provider, onComplete, onError }) => {
  const width = provider === 'Google' ? 480 : 440;
  const height = provider === 'Google' ? 560 : 580;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const redirectUri = encodeURIComponent(`${window.location.origin}/oauth-callback.html`);
  let authUrl = '';

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

  if (provider === 'Google') {
    if (googleClientId && googleClientId !== 'sample') {
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile&prompt=select_account`;
    } else {
      authUrl = `${window.location.origin}/google-login.html`;
    }
  } else {
    if (facebookAppId && facebookAppId !== 'sample') {
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=token`;
    } else {
      authUrl = `${window.location.origin}/facebook-login.html`;
    }
  }

  // Open the Facebook/Google OAuth popup window
  const popup = window.open(
    authUrl,
    `${provider} Login`,
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    if (onError) onError('Popup was blocked by browser. Please allow popups for this site.');
    return;
  }

  // Listen for message from popup callback
  const messageHandler = async (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
      window.removeEventListener('message', messageHandler);

      const profile = event.data.profile || {
        name: `${provider} User`,
        email: `${provider.toLowerCase()}_user_${Date.now().toString().slice(-4)}@${provider.toLowerCase()}.com`,
        phone: `+855${Math.floor(10000000 + Math.random() * 90000000)}`,
        avatar: provider === 'Google'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        providerId: `${provider.toLowerCase()}_${Date.now()}`
      };

      if (onComplete) onComplete(profile);
    }
  };

  window.addEventListener('message', messageHandler);
};
