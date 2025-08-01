document.addEventListener('DOMContentLoaded', function() {
  fetchStats();
  const form = document.getElementById('waitlist-form');
  const message = document.getElementById('response-message');
  const referralSection = document.getElementById('referral-section');
  const referralLinkElem = document.getElementById('referral-link');
  const copyButton = document.getElementById('copy-button');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mainNav = document.getElementById('main-nav');
  // Refresh stats every 5 minutes
  setInterval(fetchStats, 300000);

  // Mobile menu toggle
  mobileMenuButton.addEventListener('click', function() {
    mainNav.classList.toggle('active');
    mobileMenuButton.innerHTML = mainNav.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove('active');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });


  async function fetchStats() {
    try {
      const response = await fetch('https://wlsdd.onrender.com/api/stats/');
      const data = await response.json();
      
      if (response.ok) {
        updateStatsDisplay(data);
        updateCountdown(data.time_remaining);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback values
      updateStatsDisplay({
        is_waitlist_active: true,
        waitlist_members: 5000,
        total_rewards: 250000,
        total_invites: 12000
      });
    }
  }

  function updateStatsDisplay(data) {
    if (data.is_waitlist_active) {
      // Waitlist stats
      animateValue('stat-1', 0, data.waitlist_members, 2000);
      animateValue('stat-2', 0, data.total_rewards, 2000);
      animateValue('stat-3', 0, data.total_invites, 2000);
      
      document.querySelector('#stat-1-label').textContent = 'Waitlist Members';
      document.querySelector('#stat-2-label').textContent = 'ODAN Rewards';
      document.querySelector('#stat-3-label').textContent = 'Total Invites';
    } else {
      // Post-waitlist stats
      animateValue('stat-1', 0, data.total_members, 2000);
      animateValue('stat-2', 0, data.countries, 2000);
      animateValue('stat-3', 0, data.properties, 2000);
      
      document.querySelector('#stat-1-label').textContent = 'Total Members';
      document.querySelector('#stat-2-label').textContent = 'Countries';
      document.querySelector('#stat-3-label').textContent = 'Properties';
    }
  }

  function updateCountdown(seconds) {
    if (!seconds || seconds <= 0) return;
    
    const countdownElement = document.getElementById('waitlist-countdown');
    if (!countdownElement) return;

    function update() {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      countdownElement.innerHTML = `
        Waitlist ends in: 
        ${days}d ${hours}h ${mins}m ${secs}s
      `;
      
      if (seconds <= 0) {
        clearInterval(timer);
        fetchStats(); // Refresh stats when countdown ends
      }
      seconds--;
    }
    
    update();
    const timer = setInterval(update, 1000);
  }

  // Animate stats counter
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Handle decimal values for rewards
      if (id === 'total-rewards') {
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
      } else {
        obj.innerHTML = Math.floor(progress * (end - start) + start);
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Start counters when section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue('total-members', 0, 5000, 2000);
        animateValue('countries', 0, 50, 1500);
        animateValue('properties', 0, 10, 2500);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

  observer.observe(document.querySelector('.hero_section'));

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const ref = getRefFromURL();

    // Simple email validation
    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    showMessage('Processing your request...', 'info');

    try {
      //API call
      const response = await fetch('https://wlsdd.onrender.com/api/join/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ref })
      });

      const data = await response.json();


      if (response.ok) {
        showMessage(data.message || 'Successfully joined the waitlist! No spam. Unsubscribe anytime.', 'success');
        const referralLink = `https://odanforext.xyz?ref=${encodeURIComponent(email)}`;
        referralLinkElem.textContent = referralLink;
        referralSection.style.display = 'block';

        copyButton.onclick = () => {
          navigator.clipboard.writeText(referralLink);
          copyButton.textContent = 'Copied!';
          copyButton.classList.add('copied');
          setTimeout(() => {
            copyButton.textContent = 'Copy Referral Link';
            copyButton.classList.remove('copied');
           }, 2000);
        };

        // Social share links
        const shareText = encodeURIComponent("Join the Odan waitlist and earn ODAN tokens! 🚀 Real estate investment on blockchain.");
        const twitterURL = `https://twitter.com/intent/tweet?text=${shareText}&url=${referralLink}`;
        const whatsappURL = `https://api.whatsapp.com/send?text=${shareText}%20${referralLink}`;
        const telegramURL = `https://t.me/share/url?url=${referralLink}&text=${shareText}`;
        const linkedinURL = `https://www.linkedin.com/shareArticle?mini=true&url=${referralLink}&title=${encodeURIComponent("Odan Waitlist")}&summary=${shareText}`;

        document.getElementById('twitter-share').href = twitterURL;
        document.getElementById('whatsapp-share').href = whatsappURL;
        document.getElementById('telegram-share').href = telegramURL;
        document.getElementById('linkedin-share').href = linkedinURL;

      } else {
      // Handle API errors
        if (data && data.email && Array.isArray(data.email) && data.email.length > 0) {
          showMessage(data.email[0], 'error');  // e.g., "This email is already registered."
        } else if (data.detail) {
          showMessage(data.detail, 'error');    // e.g., general API error message
        } else {
          showMessage('Something went wrong. Please try again later.', 'error');
        }
      }
    } catch (error) {
      // Handle network errors
      showMessage('Network error. Please try again later.', 'error');
      console.error(error);
    }
    
  });

  // Helper functions
  function getRefFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = '';
    message.classList.add(type);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});