/**
 * HeroBanner.jsx
 * ─────────────────────────────────────────────
 * Full-width hero spotlight section — inspired by
 * Yorumi's "Spotlight" and Mercy's featured banner.
 *
 * Props:
 *   movie  {object}  – TMDB movie object to feature
 * ─────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

const HeroBanner = ({ movie }) => {
    const navigate = useNavigate();
    const [trailerHovered, setTrailerHovered] = useState(false);

    if (!movie) {
        // Skeleton placeholder while loading
        return (
            <div className="hero-skeleton">
                <div className="hero-skeleton-inner" />
            </div>
        );
    }

    const {
        id,
        title,
        overview,
        backdrop_path,
        poster_path,
        release_date,
        vote_average,
        genre_ids = [],
    } = movie;

    const backdropUrl = backdrop_path
        ? `${TMDB_BACKDROP_BASE}${backdrop_path}`
        : null;

    const year = release_date ? release_date.substring(0, 4) : '';

    return (
        <section className="hero" aria-label="Featured Movie">
            {/* ── Background image ── */}
            {backdropUrl && (
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                />
            )}

            {/* ── Gradient overlays ── */}
            <div className="hero-grad-left" />
            <div className="hero-grad-bottom" />
            <div className="hero-grad-top" />

            {/* ── Content ── */}
            <div className="hero-content">

                {/* Eyebrow label */}
                <p className="hero-eyebrow">🎬 Spotlight</p>

                {/* Title */}
                <h1 className="hero-title">{title}</h1>

                {/* Meta row */}
                <div className="hero-meta">
                    {year && <span>{year}</span>}
                    {vote_average > 0 && (
                        <span className="hero-rating">
                            ⭐ {Number(vote_average).toFixed(1)}
                        </span>
                    )}
                    <span className="hero-hd-badge">HD</span>
                </div>

                {/* Synopsis */}
                {overview && (
                    <p className="hero-overview">
                        {overview.length > 200 ? overview.substring(0, 200) + '…' : overview}
                    </p>
                )}

                {/* CTA buttons */}
                <div className="hero-actions">
                    <button
                        className="hero-btn-primary"
                        onClick={() => navigate(`/watch/${id}`)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                        Watch Now
                    </button>

                    <button
                        className="hero-btn-secondary"
                        onMouseEnter={() => setTrailerHovered(true)}
                        onMouseLeave={() => setTrailerHovered(false)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Details
                    </button>
                </div>

                {/* Dot indicators */}
                <div className="hero-dots" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map(i => (
                        <span key={i} className={`hero-dot ${i === 0 ? 'active' : ''}`} />
                    ))}
                </div>
            </div>

            {/* ── Floating poster (desktop only) ── */}
            {poster_path && (
                <div className="hero-poster-wrap">
                    <img
                        src={`${TMDB_POSTER_BASE}${poster_path}`}
                        alt={title}
                        className="hero-poster"
                    />
                </div>
            )}
        </section>
    );
};

export default HeroBanner;
