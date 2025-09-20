/* ================================
   CHLAVM – Site Script (merged)
   - Transparent nav over hero; white on scroll
   - Overlay (hamburger) menu
   - Timeline reveal on scroll (IO)
   - Carousel (prev/next + swipe)
   - Team modal lightbox (guarded)
   - Minimal AOS-like reveal (no external lib)
   ================================ */

// ===== Nav transparency + shadow on scroll =====
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const setChrome = () => {
    const y = Math.min(window.scrollY || 0, 240);
    nav.classList.toggle('scrolled', y > 8);
  };

  window.addEventListener('scroll', setChrome, { passive: true });
  setChrome();
})();

// ===== Overlay menu (hamburger) =====
(() => {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('menuOverlay');
  const close = document.getElementById('menuClose');
  if (!btn || !menu) return;

  const open = () => {
    menu.hidden = false;
    menu.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const hide = () => {
    menu.hidden = true;
    menu.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  if (close) close.addEventListener('click', hide);
  menu.addEventListener('click', e => { if (e.target === menu) hide(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) hide(); });
})();

// ===== Reveal timeline events on scroll =====
(() => {
  const items = document.querySelectorAll('.timeline-event');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  items.forEach(el => io.observe(el));
})();

// ===== Carousel (simple, accessible) =====
(() => {
  const carousel = document.getElementById('carousel');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  if (!carousel || !prev || !next) return;

  let index = 0;
  const total = carousel.children.length;

  const go = dir => {
    index = (index + dir + total) % total;
    const width = carousel.getBoundingClientRect().width;
    carousel.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  // Swipe support
  let startX = 0;
  carousel.addEventListener('pointerdown', e => { startX = e.clientX; });
  carousel.addEventListener('pointerup', e => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
})();

// ===== TEAM MODAL LIGHTBOX SYSTEM =====
// (Keep this object if you use team cards; safe to leave in global scope)
const teamBios = {
  "elvira-sanchez-de-malicki": {
    name: "Elvira Sanchez De Malicki",
    role: "President, Executive Director",
    img: "assets/team/elvira-sanchez-de-malicki.jpg",
    bio: `Elvira is the visionary leader behind the Canadian Hispanic–Latin American Virtual Museum. With decades of experience in community advocacy and cultural preservation, she serves as President and Executive Director, guiding the organization’s mission and growth.`
  },
  "rosario-gomez": {
    name: "Dr. Rosario Gomez",
    role: "Treasurer",
    img: "assets/team/rosario-gomez.jpg",
    bio: `Dr. Gomez oversees financial stewardship for the organization and brings a background in academia and nonprofit management to the board.`
  },
  "monique-forster": {
    name: "Monique Forster",
    role: "Director CHC, History, Statistics",
    img: "assets/team/monique-forster.jpg",
    bio: `Monique leads the history and statistics division, championing research into Hispanic and Latin American communities in Canada.`
  },
  "eldy-ampuero": {
    name: "Eldy Ampuero",
    role: "Secretary-General",
    img: "assets/team/eldy-ampuero.jpg",
    bio: `Eldy manages communications and ensures the smooth operation of the board’s strategic initiatives as Secretary-General.`
  },
  "carlos-paz-soldan": {
    name: "Carlos Paz Soldan",
    role: "Chief Technology Officer",
    img: "assets/team/carlos-paz-soldan.jpg",
    bio: `Carlos oversees all tech at the museum, with a background in systems engineering and a passion for digital storytelling and interactive platforms. He leads development and ensures technical excellence across all museum digital projects.`
  },
  "keram-malicki-sanchez": {
    name: "Keram Malicki Sanchez",
    role: "Lead Experience Designer",
    img: "assets/team/keram-malicki-sanchez.jpg",
    bio: `Keram brings years of multimedia, digital media, and VR expertise to create engaging, immersive visitor experiences for CHLAVM. He has worked on award-winning interactive productions and is a thought leader in XR storytelling.`
  },
  "oswaldo-quiroz": {
    name: "Oswaldo Quiroz",
    role: "Media Director",
    img: "assets/team/oswaldo-quiroz.jpg",
    bio: `Oswaldo directs the museum’s media and communications strategy, overseeing all content production, video, and digital partnerships. He ensures a consistent and impactful narrative across platforms.`
  },
  "silvia-alfaro": {
    name: "Silvia Alfaro",
    role: "Curator of Authors and Books",
    img: "assets/team/silvia-alfaro.jpg",
    bio: `Silvia is a passionate bibliophile dedicated to curating literature and written works from across the Hispanic and Latin American communities. She highlights diverse authors, their stories, and literary traditions within the museum’s digital archive.`
  },
  "zulima-wesso": {
    name: "Zulima Wesso",
    role: "Children's Content Curator",
    img: "assets/team/zulima-wesso.jpg",
    bio: `Zulima develops and selects content designed to inspire and educate young visitors, from storytelling to interactive experiences. Her expertise ensures that younger audiences see themselves reflected in the museum’s collections.`
  },
  "marcela-aranda": {
    name: "Marcela Aranda",
    role: "Folklore Curator",
    img: "assets/team/marcela-aranda.jpg",
    bio: `Marcela is a recognized expert in folklore and traditional arts. She researches and presents folk stories, rituals, and cultural practices, helping preserve and celebrate the intangible heritage of Latin America in Canada.`
  },
  "giovanni-ruiz": {
    name: "Giovanni Ruiz",
    role: "Curator of Musical Instruments",
    img: "assets/team/giovanni-ruiz.jpg",
    bio: `Giovanni is responsible for collecting, cataloguing, and sharing the vibrant history of musical instruments across Hispanic and Latin American cultures. He brings music to life through virtual exhibitions and educational programming.`
  },
  "carla-cassanova": {
    name: "Carla Cassanova",
    role: "Music Curator",
    img: "assets/team/carla-cassanova.jpg",
    bio: `Carla curates the museum’s collection of music, from folk traditions to contemporary genres. She works with musicians and cultural organizations to highlight the soundscape of Hispanic and Latin American life in Canada.`
  },
  "jorge-filmus": {
    name: "Dr. Jorge Filmus",
    role: "Science Curator",
    img: "assets/team/jorge-filmus.jpg",
    bio: `Dr. Filmus brings scientific rigor to the museum, curating content at the intersection of science, discovery, and the Hispanic/Latin American experience. He aims to showcase scientific contributions and promote STEM engagement.`
  },
  "carlos-aranha": {
    name: "Carlos Aranha",
    role: "Art Works Curator",
    img: "assets/team/carlos-aranha.jpg",
    bio: `Carlos leads the museum’s visual arts programming, selecting works by Latin American and Hispanic artists in Canada. His curatorial vision ensures a vibrant, ever-evolving collection of paintings, sculpture, and multimedia art.`
  },
  "mishelle-wehbe": {
    name: "Mishelle Wehbe",
    role: "Director Outreach, Communications",
    img: "assets/team/mishelle-wehbe.jpg",
    bio: `Mishelle directs outreach and communications for the museum’s academic partnerships. She builds bridges with educational institutions, leads community engagement projects, and helps ensure the museum’s work reaches a wide audience in both English and Spanish.`
  },
  "angie-lopez": {
    name: "Angie Lopez",
    role: "Program Liaison",
    img: "assets/team/angie-lopez.jpg",
    bio: `Angie is the vital connector between the museum and its educational partners. As Program Liaison, she coordinates joint projects, supports academic programming, and facilitates student and faculty participation in the museum’s initiatives.`
  },
  "adriana-estrada": {
    name: "Adriana Estrada",
    role: "Administrative and Project Coordinator",
    img: "assets/team/adriana-estrada.jpg",
    bio: `Adriana is responsible for organizing and supporting academic projects, workshops, and special events. Her project management skills help keep complex programs on track and ensure a smooth experience for participants.`
  },
  "youssef-wehbe": {
    name: "Youssef Wehbe",
    role: "Program and Multimedia Specialist",
    img: "assets/team/youssef-wehbe.jpg",
    bio: `Youssef develops and delivers innovative multimedia content for the museum’s academic and educational initiatives. He brings technical know-how and a creative touch to digital projects, helping make learning dynamic and accessible.`
  },
  "fatima-witt": {
    name: "Fatima Witt",
    role: "Communications",
    img: "assets/team/fatima-witt.jpg",
    bio: `Fátima brings international communications experience to the museum, with professional roots in Ecuador, Brazil, the US, and Canada. She is multilingual and active in community engagement, helping the museum connect with audiences in several languages.`
  },
  "lody-campana": {
    name: "Lody Campaña",
    role: "Financial Consultant",
    img: "assets/team/lody-campana.jpg",
    bio: `Lody supports the museum’s financial operations, offering guidance on budgeting, reporting, and compliance. Her consulting ensures resources are managed responsibly and transparently for all programs and initiatives.`
  },
  "francisco-berrio": {
    name: "Francisco Berrio",
    role: "Project Manager",
    img: "assets/team/francisco-berrio.jpg",
    bio: `Francisco coordinates key projects and operational logistics for the museum. He works across teams to support events, partnerships, and day-to-day operations, ensuring that everything runs smoothly.`
  },
  "marek-malicki": {
    name: "Marek S. Malicki",
    role: "Legal Counsel",
    img: "assets/team/marek-malicki.jpg",
    bio: `Marek is the museum’s legal advisor, providing counsel on governance, policy, and regulatory matters. His legal expertise helps protect the interests and integrity of the museum and its community.`
  },
  "alfredo-tinajero": {
    name: "Dr. Alfredo Tinajero",
    role: "Research and Development",
    img: "assets/team/alfredo-tinajero.jpg",
    bio: `Dr. Tinajero leads research and development for the museum, working on new programs, evaluation, and knowledge mobilization. He brings a deep academic background and passion for innovation in community-based work.`
  },
  "daniela-casares": {
    name: "Daniela Casares",
    role: "Marketing Student",
    img: "assets/team/daniela-casares.jpg",
    bio: `Daniela supports the museum as a marketing student, contributing new ideas and fresh perspectives. She assists with social media, promotions, and community outreach, helping to keep the museum’s messaging relevant and lively.`
  },
};

/*// ===== Team modal (guarded) =====
(() => {
  const cards = document.querySelectorAll('.team-card');
  const modal = document.getElementById('teamModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModal');

  if (!cards.length || !modal || !modalOverlay || !modalContent || !closeModalBtn) return;

  function openTeamModal(id) {
    const member = teamBios[id];
    if (!member) return;
    modalContent.innerHTML = `
      <h2>${member.name}</h2>
      <em>${member.role}</em>
      <div class="team-modal-profile">
        <img src="${member.img}" alt="${member.name}">
        <div class="team-modal-bio">${member.bio}</div>
      </div>
    `;
    modal.hidden = false;
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function closeTeamModal() {
    modal.hidden = true;
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    const id = card.getAttribute('data-member');
    card.addEventListener('click', () => openTeamModal(id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTeamModal(id);
      }
    });
  });
  closeModalBtn.addEventListener('click', closeTeamModal);
  modalOverlay.addEventListener('click', closeTeamModal);
  window.addEventListener('keydown', (e) => { if (!modal.hidden && e.key === 'Escape') closeTeamModal(); });
})();*/

// ===== Minimal AOS-like reveal for [data-aos] ===== *TRANSITION LIKE THE HOME PAGE
/*(() => {
  const nodes = Array.from(document.querySelectorAll('[data-aos]'));
  if (!nodes.length) return;

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(n => n.classList.add('aos-animate'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach(n => io.observe(n));
})();*/

// Minimal AOS-like reveal (with optional delay) - *TRANSITION DIFFERENT FROM HOMEPAGE
(function () {
  const nodes = Array.from(document.querySelectorAll('[data-aos]'));

  // Apply per-element delay if provided
  nodes.forEach(n => {
    const d = parseInt(n.dataset.aosDelay || '0', 10);
    if (!isNaN(d) && d > 0) n.style.transitionDelay = d + 'ms';
  });

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(n => n.classList.add('aos-animate'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach(n => io.observe(n));
})();