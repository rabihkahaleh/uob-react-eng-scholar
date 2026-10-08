import React from 'react';
import { Newspaper, Calendar, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

export default function NewsEventsSection({ onSelectNews, onSelectEvent }) {
  const newsItems = [
    {
      id: 'news-1',
      date: 'September 12, 2026',
      category: 'Grant Award',
      headline: 'FOE Researchers Secure CNRS-L Grant for Sustainable Concrete & Eco-Binder Innovation',
      summary: 'A team led by the Department of Civil Engineering was awarded research funding to develop low-carbon geopolymer concretes using local industrial byproduct materials.',
    },
    {
      id: 'news-2',
      date: 'August 28, 2026',
      category: 'Journal Publication',
      headline: 'Study on AI-Driven Optical Beamforming Published in IEEE Transactions on Communications',
      summary: 'Dr. Elias Nassar and co-authors published breakthroughs in neural network phase recovery for high-density 5G optical CDMA wireless links.',
    },
    {
      id: 'news-3',
      date: 'July 15, 2026',
      category: 'Research Milestone',
      headline: 'Faculty of Engineering Surpasses 1,300 Verified Scopus Publications',
      summary: 'Official repository audit highlights exponential growth in peer-reviewed outputs across Chemical, Mechanical, Civil, Computer, and Electrical engineering departments.',
    },
  ];

  const upcomingEvents = [
    {
      id: 'event-1',
      title: 'Annual Mediterranean Engineering Research Symposium 2026',
      date: 'October 15-16, 2026',
      time: '09:00 AM - 04:30 PM (EET)',
      location: 'Auditorium A, Zakhem Building / Hybrid',
      type: 'Academic Symposium',
    },
    {
      id: 'event-2',
      title: 'Workshop on FAIR Research Data Management & Open-Access Publishing',
      date: 'November 05, 2026',
      time: '02:00 PM - 05:00 PM (EET)',
      location: 'Computer Engineering Lab 302',
      type: 'Faculty Training',
    },
    {
      id: 'event-3',
      title: 'Industry Round-Table: Smart Grids and Renewable Energy Integration',
      date: 'December 02, 2026',
      time: '10:00 AM - 01:00 PM (EET)',
      location: 'Executive Conference Room, FOE',
      type: 'Industry Forum',
    },
  ];

  return (
    <section id="news-events" className="news-events-section">
      <div className="section-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Institutional Updates</span>
          <h2 className="section-title">Latest News & Events</h2>
          <p className="section-subtitle">
            Stay informed on recent grant awards, major publications, academic milestones, and upcoming research symposiums.
          </p>
        </div>

        <div className="news-events-grid">
          {/* News Column */}
          <div className="news-col">
            <div className="col-header">
              <h3 className="col-title">
                <Newspaper size={18} /> Research News
              </h3>
              <a href="#news" className="col-link" onClick={(e) => { e.preventDefault(); onSelectNews && onSelectNews(); }}>
                View All News <ArrowRight size={13} />
              </a>
            </div>

            <div className="news-list">
              {newsItems.map((item) => (
                <article key={item.id} className="news-card">
                  <div className="news-card-meta">
                    <span className="news-category">{item.category}</span>
                    <span className="news-date">{item.date}</span>
                  </div>
                  <h4 className="news-headline">{item.headline}</h4>
                  <p className="news-summary">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Events Column */}
          <div className="events-col">
            <div className="col-header">
              <h3 className="col-title">
                <Calendar size={18} /> Upcoming Events
              </h3>
              <a href="#events" className="col-link" onClick={(e) => { e.preventDefault(); onSelectEvent && onSelectEvent(); }}>
                View All Events <ArrowRight size={13} />
              </a>
            </div>

            <div className="events-list">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="event-card">
                  <div className="event-type-badge">{evt.type}</div>
                  <h4 className="event-title">{evt.title}</h4>

                  <div className="event-details">
                    <div className="event-detail-item">
                      <Calendar size={13} />
                      <span>{evt.date}</span>
                    </div>
                    <div className="event-detail-item">
                      <Clock size={13} />
                      <span>{evt.time}</span>
                    </div>
                    <div className="event-detail-item">
                      <MapPin size={13} />
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <div className="event-card-footer">
                    <button className="btn-event-register">
                      Register / Details <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
