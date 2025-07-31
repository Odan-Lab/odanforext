document.addEventListener('DOMContentLoaded', function() {
  // Check for referral ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');
  
  // If referral parameter exists, set a cookie
  if (refParam) {
    document.cookie = `referral_id=${refParam}; max-age=604800; path=/; samesite=lax`;
    
    // Clean URL after setting cookie (optional)
    if (history.replaceState) {
      const cleanUrl = window.location.pathname;
      history.replaceState({}, document.title, cleanUrl);
    }
  }

  // Form submission
  const waitlistForm = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email');
  const responseMessage = document.getElementById('response-message');
  const referralSection = document.getElementById('referral-section');
  const referralLink = document.getElementById('referral-link');
  const copyButton = document.getElementById('copy-button');
  const waitlistMembers = document.getElementById('waitlist-members');

  // Initially hide referral section
  referralSection.style.display = 'none';

  // Load waitlist stats
  fetchWaitlistStats();

  waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
      showMessage('Please enter your email', 'error');
      return;
    }

    try {
      // Get referral ID from cookie if exists
      const referralId = getCookie('referral_id');
      
      const response = await fetch('/join-waitlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        emailInput.value = '';
        
        // Show referral section with user's unique link
        referralLink.textContent = `${window.location.origin}?ref=${data.referral_id}`;
        referralSection.style.display = 'block';
        
        // Update social share links
        setupShareLinks(data.referral_id);
        
        // Refresh waitlist stats
        fetchWaitlistStats();
        
        // Clear referral cookie after successful signup
        document.cookie = 'referral_id=; max-age=0; path=/';
      } else {
        showMessage(data.detail || 'Error joining waitlist', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
      console.error('Error:', error);
    }
  });

  // Copy referral link
  copyButton.addEventListener('click', function() {
    const link = referralLink.textContent;
    navigator.clipboard.writeText(link)
      .then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  });

  // Helper functions
  function showMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = type;
    setTimeout(() => {
      responseMessage.textContent = '';
      responseMessage.className = '';
    }, 5000);
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setupShareLinks(referralId) {
    const shareUrl = encodeURIComponent(`${window.location.origin}?ref=${referralId}`);
    const shareText = encodeURIComponent("Join Odan's waitlist for tokenized real estate opportunities on the OdanChain network!");
    
    document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
    document.getElementById('whatsapp-share').href = `https://wa.me/?text=${shareText}%20${shareUrl}`;
    document.getElementById('telegram-share').href = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
    document.getElementById('linkedin-share').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  }

  async function fetchWaitlistStats() {
    try {
      const response = await fetch('/waitlist-stats/');
      const data = await response.json();
      
      if (response.ok) {
        waitlistMembers.textContent = data.total_users.toLocaleString();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }
});