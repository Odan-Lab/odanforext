const form = document.getElementById('waitlist-form');
const message = document.getElementById('response-message');
const referralSection = document.getElementById('referral-section');
const referralLinkElem = document.getElementById('referral-link');
const copyButton = document.getElementById('copy-button');

const twitterShare = document.getElementById('twitter-share');
const whatsappShare = document.getElementById('whatsapp-share');
const telegramShare = document.getElementById('telegram-share');

const getRefFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const ref = getRefFromURL();

  try {
    const response = await fetch('https://wlsdd.onrender.com/api/join/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ref })
    });

    const data = await response.json();

    if (response.ok) {
      message.textContent = data.message || 'Successfully joined the waitlist!';
      const referralLink = `https://odanforext.xyz?ref=${encodeURIComponent(email)}`;
      referralLinkElem.textContent = referralLink;
      referralSection.style.display = 'block';

      copyButton.onclick = () => {
        navigator.clipboard.writeText(referralLink);
        copyButton.textContent = 'Copied!';
        setTimeout(() => { copyButton.textContent = 'Copy Referral Link'; }, 2000);
      };

      // Social share links
      const shareText = encodeURIComponent("Join the Odan waitlist and earn ODAN tokens! 🚀");
      const twitterURL = `https://twitter.com/intent/tweet?text=${shareText}&url=${referralLink}`;
      const whatsappURL = `https://api.whatsapp.com/send?text=${shareText}%20${referralLink}`;
      const telegramURL = `https://t.me/share/url?url=${referralLink}&text=${shareText}`;

      twitterShare.href = twitterURL;
      whatsappShare.href = whatsappURL;
      telegramShare.href = telegramURL;

    } else {
      message.textContent = data.detail || 'Something went wrong.';
    }
  } catch (error) {
    message.textContent = 'Network error. Please try again later.';
    console.error(error);
  }
});
