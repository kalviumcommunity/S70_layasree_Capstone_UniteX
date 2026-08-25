import React, { useEffect, useState } from "react";
import "../landing.css";
import {
  Compass, Calendar, BookOpen, Zap, Shield, Users, Star,
  ArrowRight, Sparkles, MapPin, ChevronDown, Play, Check,
  MessageSquare, BarChart2
} from "lucide-react";

// ── Relevant Unsplash image per topic (no API key, direct CDN URLs) ──
const IMGS = {
  hero:        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=85",  // festival crowd aerial
  conference:  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",   // conference hall
  festival:    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",   // festival lights
  concert:     "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",   // concert crowd
  wedding:     "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",   // wedding aisle
  birthday:    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",   // birthday celebration
  corporate:   "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",      // corporate team
  community:   "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",   // happy people crowd
  calendar:    "https://images.unsplash.com/photo-1506784365847-bbad939e9501?w=800&q=80",   // calendar/planner
  chat:        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",   // people at event with phones
  admin:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",      // analytics dashboard
  organizer:   "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",   // organizer at work
};

const LandingPage = ({ onEnter, onSignIn }) => {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setVisible((prev) => ({ ...prev, [entry.target.dataset.id]: true }));
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Data ──
  const features = [
    { icon: Compass,      gradient: "from-violet-600 to-purple-600",  title: "Discover Events",    desc: "Browse curated events by category, date, and location with powerful filters and real-time search.",        img: IMGS.conference },
    { icon: Calendar,     gradient: "from-indigo-600 to-blue-600",    title: "Smart Calendar",     desc: "Interactive event calendar with one-click Google Calendar sync to keep you organised.",                     img: IMGS.calendar   },
    { icon: BookOpen,     gradient: "from-emerald-600 to-teal-600",   title: "Private Bookings",   desc: "Custom private bookings for weddings, birthdays & corporate gatherings with full detail control.",          img: IMGS.wedding    },
    { icon: MessageSquare,gradient: "from-amber-500 to-orange-500",   title: "Live Chat Rooms",    desc: "Real-time Socket.IO chat for every event — coordinate with attendees and share updates instantly.",         img: IMGS.chat       },
    { icon: Users,        gradient: "from-pink-600 to-rose-600",      title: "Organizer Console",  desc: "Create events, track RSVPs, manage capacity and communicate with your audience from one dashboard.",        img: IMGS.organizer  },
    { icon: Shield,       gradient: "from-red-600 to-rose-700",       title: "Admin Control",      desc: "Role-based access control with a full admin panel for platform management, moderation, and analytics.",     img: IMGS.admin      },
  ];

  const eventCards = [
    { title: "Neon Beats 2025",       cat: "Festival",    date: "Aug 30", loc: "Mumbai Arena",    img: IMGS.festival,    badge: "badge-violet" },
    { title: "TechSummit India",      cat: "Conference",  date: "Sep 12", loc: "Bangalore",       img: IMGS.conference,  badge: "badge-indigo" },
    { title: "Royal Wedding Package", cat: "Wedding",     date: "Oct 05", loc: "Delhi NCR",       img: IMGS.wedding,     badge: "badge-pink"   },
    { title: "Birthday Gala Night",   cat: "Birthday",    date: "Sep 22", loc: "Hyderabad",       img: IMGS.birthday,    badge: "badge-amber"  },
    { title: "Annual Carnatic Night", cat: "Concert",     date: "Nov 01", loc: "Chennai",         img: IMGS.concert,     badge: "badge-teal"   },
    { title: "Startup Demo Day",      cat: "Corporate",   date: "Oct 18", loc: "Bangalore",       img: IMGS.corporate,   badge: "badge-blue"   },
  ];

  const showcaseRows = [
    {
      img: IMGS.conference,
      icon: Compass, gradient: "from-violet-600 to-purple-600",
      title: "Discover & Browse Events",
      desc: "Explore thousands of curated events filtered by category, date, and location. Our powerful search makes finding events effortless.",
      points: ["Smart category & location filters", "Real-time event search", "Rich event detail pages with RSVP"],
      reverse: false, id: "sh-0",
    },
    {
      img: IMGS.wedding,
      icon: BookOpen, gradient: "from-emerald-600 to-teal-600",
      title: "Private Bookings Made Easy",
      desc: "From intimate birthday parties to grand weddings and corporate galas — request and customise private bookings with full control.",
      points: ["Weddings, birthdays & corporate", "Detailed custom booking forms", "Direct organizer coordination"],
      reverse: true, id: "sh-1",
    },
    {
      img: IMGS.organizer,
      icon: Users, gradient: "from-pink-600 to-rose-600",
      title: "Built for Organizers",
      desc: "A powerful console lets you create events, track RSVPs, manage capacity, and communicate with your audience in real-time.",
      points: ["Event creation & management", "Live chat with attendees", "RSVP & capacity tracking"],
      reverse: false, id: "sh-2",
    },
  ];

  const galleryItems = [
    { src: IMGS.hero,       label: "Music Festivals",   span: "gallery-wide" },
    { src: IMGS.conference, label: "Conferences"                              },
    { src: IMGS.wedding,    label: "Weddings"                                 },
    { src: IMGS.concert,    label: "Concerts",          span: "gallery-wide" },
    { src: IMGS.birthday,   label: "Celebrations"                            },
  ];

  const stats = [
    { value: "10K+",  label: "Events Hosted"   },
    { value: "50K+",  label: "Happy Attendees"  },
    { value: "2K+",   label: "Organizers"       },
    { value: "99.9%", label: "Uptime"           },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Event Organizer",  avatar: "PS", color: "from-violet-500 to-purple-600", text: "UniteX transformed how I manage corporate events. The live chat and RSVP tracking made our annual conference seamless." },
    { name: "Rahul Mehta",  role: "Wedding Planner",  avatar: "RM", color: "from-pink-500 to-rose-600",     text: "The private booking system is incredible. Clients love how easy it is to customise their wedding details end-to-end."  },
    { name: "Anjali Nair",  role: "Festival Curator", avatar: "AN", color: "from-emerald-500 to-teal-600",  text: "Managing thousands of attendees for our music festival was a breeze. The calendar sync feature is a game-changer!"     },
  ];

  const fv = (id) => visible[id] ? "is-visible" : "";

  return (
    <div className="landing-root">
      {/* ── Animated orbs ── */}
      <div className="orbs-layer" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="orb orb-3" /><div className="orb orb-4" />
      </div>

      {/* ══ NAVBAR ══ */}
      <header className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="logo-icon"><span>U</span></div>
            <span className="logo-text">Unite<span className="logo-accent">X</span></span>
          </div>
          <nav className="nav-links">
            <a href="#events">Events</a>
            <a href="#features">Features</a>
            <a href="#gallery">Gallery</a>
            <a href="#testimonials">Reviews</a>
          </nav>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={onSignIn}>Sign In</button>
            <button className="btn-primary" onClick={onEnter}>Get Started <ArrowRight size={14} /></button>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="hero-bg-image">
          <img src={IMGS.hero} alt="Music festival" />
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-badge"><Sparkles size={13} /><span>Next-gen Event Management Platform</span></div>

        <h1 className="hero-title">
          Where Every Event<br />
          <span className="hero-gradient-text">Becomes Extraordinary</span>
        </h1>

        <p className="hero-subtitle">
          UniteX empowers organizers and attendees with seamless event discovery,
          private bookings, live chat, and powerful management tools — all in one place.
        </p>

        <div className="hero-cta">
          <button className="btn-hero-primary" onClick={onEnter}><Sparkles size={17} /> Explore Events</button>
          <button className="btn-hero-secondary" onClick={onSignIn}><Play size={15} /> Sign Up Free</button>
        </div>

        <div className="hero-pills">
          {["Conference", "Festival", "Wedding", "Corporate", "Concert", "Birthday"].map((cat) => (
            <span key={cat} className="hero-pill">{cat}</span>
          ))}
        </div>

        <a href="#events" className="scroll-indicator"><ChevronDown size={22} /></a>
      </section>

      {/* ══ LIVE EVENT CARDS ══ */}
      <section id="events" className="lp-section">
        <div className={`lp-section-header fade-up ${fv("ev-h")}`} data-id="ev-h">
          <div className="section-tag"><Compass size={13} /> Live Events</div>
          <h2>Explore What's <span className="hero-gradient-text">Happening Now</span></h2>
          <p>Thousands of events across India — discover, RSVP, and attend.</p>
        </div>

        <div className="event-cards-grid">
          {eventCards.map((ev, i) => (
            <div
              key={ev.title}
              className={`event-card fade-up ${fv(`ev-${i}`)}`}
              data-id={`ev-${i}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="event-card-img">
                <img src={ev.img} alt={ev.title} loading="lazy" />
                <div className="event-card-img-overlay" />
                <span className={`event-card-badge ${ev.badge}`}>{ev.cat}</span>
              </div>
              <div className="event-card-body">
                <h4>{ev.title}</h4>
                <div className="event-card-meta">
                  <span><Calendar size={12} /> {ev.date}</span>
                  <span><MapPin size={12} /> {ev.loc}</span>
                </div>
                <button className="event-card-cta" onClick={onEnter}>View Details →</button>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-center-btn">
          <button className="btn-hero-primary" onClick={onEnter}><Compass size={16} /> Browse All Events</button>
        </div>
      </section>

      {/* ══ FEATURE SHOWCASE ROWS ══ */}
      <section id="features" className="lp-section">
        <div className={`lp-section-header fade-up ${fv("feat-h")}`} data-id="feat-h">
          <div className="section-tag"><Zap size={13} /> Features</div>
          <h2>Everything You Need to <span className="hero-gradient-text">Run Amazing Events</span></h2>
          <p>A complete suite of tools built for modern event management.</p>
        </div>

        {showcaseRows.map((sh) => (
          <div
            key={sh.id}
            className={`showcase-row ${sh.reverse ? "showcase-row-reverse" : ""} fade-up ${fv(sh.id)}`}
            data-id={sh.id}
          >
            <div className="showcase-img-wrap">
              <img src={sh.img} alt={sh.title} className="showcase-img" loading="lazy" />
              <div className="showcase-img-glow" />
            </div>
            <div className="showcase-content">
              <div className={`showcase-icon-wrap bg-gradient-to-br ${sh.gradient}`}>
                <sh.icon size={22} color="white" />
              </div>
              <h3 className="showcase-title">{sh.title}</h3>
              <p className="showcase-desc">{sh.desc}</p>
              <ul className="showcase-points">
                {sh.points.map((pt) => (
                  <li key={pt}><Check size={14} className="check-icon" />{pt}</li>
                ))}
              </ul>
              <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={onEnter}>
                Get Started <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Feature grid cards */}
        <div className={`lp-section-header fade-up ${fv("feat-g-h")}`} data-id="feat-g-h" style={{ marginTop: "5rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>And Much <span className="hero-gradient-text">More...</span></h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card fade-up ${fv(`fc-${i}`)}`}
              data-id={`fc-${i}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="feature-card-img">
                <img src={f.img} alt={f.title} loading="lazy" />
                <div className="feature-card-img-overlay" />
              </div>
              <div className="feature-card-content">
                <div className={`fc-icon bg-gradient-to-br ${f.gradient}`}>
                  <f.icon size={20} color="white" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STATS (split layout with community photo) ══ */}
      <section id="stats" className="stats-section">
        <div className="stats-inner">
          <div className={`stats-split fade-up ${fv("stats-s")}`} data-id="stats-s">
            {/* Image column */}
            <div className="stats-img-col">
              <img src={IMGS.community} alt="Community of attendees" className="stats-img" loading="lazy" />
              <div className="stats-badge-card">
                <Star size={18} color="#fbbf24" fill="#fbbf24" />
                <div>
                  <div className="stats-badge-num">50K+ Happy Attendees</div>
                  <div className="stats-badge-sub">Across India</div>
                </div>
              </div>
            </div>
            {/* Text column */}
            <div className="stats-text-col">
              <div className="section-tag"><Star size={13} /> Our Impact</div>
              <h2 className="stats-heading">
                Trusted by Thousands<br />
                <span className="hero-gradient-text">Across India</span>
              </h2>
              <p className="stats-sub">
                From small birthday parties to massive festivals — UniteX powers events that create lasting memories.
              </p>
              <div className="stats-grid-2">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`stat-card fade-up ${fv(`st-${i}`)}`}
                    data-id={`st-${i}`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section id="gallery" className="lp-section">
        <div className={`lp-section-header fade-up ${fv("gal-h")}`} data-id="gal-h">
          <div className="section-tag"><Sparkles size={13} /> Gallery</div>
          <h2>Events that <span className="hero-gradient-text">Inspire</span></h2>
          <p>A glimpse of the extraordinary moments our platform helps create.</p>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((g, i) => (
            <div
              key={g.label}
              className={`gallery-item ${g.span || ""} fade-up ${fv(`gl-${i}`)}`}
              data-id={`gl-${i}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <img src={g.src} alt={g.label} loading="lazy" />
              <div className="gallery-overlay"><span>{g.label}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" className="lp-section">
        <div className={`lp-section-header fade-up ${fv("test-h")}`} data-id="test-h">
          <div className="section-tag"><Star size={13} /> Testimonials</div>
          <h2>What Our Community <span className="hero-gradient-text">Says About Us</span></h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card fade-up ${fv(`tst-${i}`)}`}
              data-id={`tst-${i}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="stars">{"★".repeat(5)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className={`author-avatar bg-gradient-to-br ${t.color}`}>{t.avatar}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="cta-section">
        <div className={`cta-inner fade-up ${fv("cta")}`} data-id="cta">
          <div className="cta-bg-img">
            <img src={IMGS.concert} alt="Concert crowd" loading="lazy" />
            <div className="cta-bg-overlay" />
          </div>
          <div className="cta-content">
            <div className="section-tag" style={{ justifyContent: "center" }}><Sparkles size={13} /> Get Started Today</div>
            <h2>Ready to Create <span className="hero-gradient-text">Unforgettable Events?</span></h2>
            <p>Join thousands of organizers and attendees on the UniteX platform today.</p>
            <div className="hero-cta" style={{ justifyContent: "center", marginTop: "2rem" }}>
              <button className="btn-hero-primary" onClick={onEnter}><Compass size={17} /> Browse Events</button>
              <button className="btn-hero-secondary" onClick={onSignIn}><Users size={15} /> Join as Organizer</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="nav-logo">
            <div className="logo-icon"><span>U</span></div>
            <span className="logo-text">Unite<span className="logo-accent">X</span></span>
          </div>
          <p className="footer-tagline">Where every event becomes extraordinary.</p>
          <p className="footer-copy">© 2025 UniteX. All rights reserved. Built with ❤️ for communities.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
