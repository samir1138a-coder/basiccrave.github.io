// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburger.classList.toggle('toggle');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle');
    }
  });
});

// Sticky Navbar & Active Link
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Sticky Nav
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active Link State
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(li => {
    li.classList.remove('active');
    if (li.getAttribute('href') === `#${current}`) {
      li.classList.add('active');
    }
  });
});

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const elementVisible = 100;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// Number Counter Animation (IntersectionObserver + rAF)
const counters = document.querySelectorAll('.counter');

function animateValue(el, start, end, duration = 3000) {
  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(start + (end - start) * progress);
    el.innerText = value;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.innerText = end;
    }
  }
  requestAnimationFrame(step);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        animateValue(el, 0, target, 1500);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
} else {
  // Fallback: trigger counters on load/scroll if IntersectionObserver isn't supported
  const triggerCounters = () => {
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      animateValue(el, 0, target, 1500);
    });
  };
  window.addEventListener('load', triggerCounters);
  window.addEventListener('scroll', triggerCounters);
}

// Close mobile menu on link click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle');
    }
  });
});

// Dynamic Marquee Generator
const initMarquee = async () => {
  const marqueeContent = document.getElementById('marquee-content');
  if (!marqueeContent) return;

  let imageIndex = 1;
  const validImages = [];
  const maxToTry = 50; // Safeguard so it doesn't loop forever

  // Function to promise wrapper around image loading
  const checkImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // Iterate to find all valid images
  while (imageIndex <= maxToTry) {
    const src = `asset/garments/garment-${imageIndex}.jpeg`;
    const exists = await checkImage(src);
    
    if (exists) {
      validImages.push(src);
      imageIndex++;
    } else {
      break; // Stop at first missing image (assuming sequential naming)
    }
  }

  // Fallback in case no images are found (e.g. testing locally without server/cors allowing checks)
  // or if they are named differently
  if (validImages.length === 0) {
    console.log("No images found incrementally. Please make sure they are named garment-1.jpeg, garment-2.jpeg, etc.");
    return;
  }

  // Create an HTML string for the images
  const createImgHtml = (src, index) => `<img src="${src}" alt="Garment ${index}" class="glass-card">`;
  
  // Combine all images into a single group
  const imgGroupHtml = validImages.map((src, idx) => createImgHtml(src, idx + 1)).join('');

  // Duplicate the group twice inside the marquee for a seamless infinite scroll effect
  marqueeContent.innerHTML = imgGroupHtml + imgGroupHtml;
};

// Initialize marquee when DOM is ready
document.addEventListener('DOMContentLoaded', initMarquee);
