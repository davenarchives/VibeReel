/**
 * HeroBanner.jsx — Sliding Spotlight Carousel
 * ─────────────────────────────────────────────────────────────
 * All slides are laid out in a horizontal track.
 * Navigation moves the track with CSS transform: translateX,
 * giving a smooth, blink-free slide animation.
 *
 * • receives movies[] array (up to 5 from Dashboard)
 * • useState(activeIndex) tracks current slide
 * • useEffect auto-advances every 6 s with clearInterval cleanup
 * • Dot clicks and arrow clicks jump to any slide
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const INTERVAL_MS = 6000;

const HeroBanner = ({ movies = [] }) => {
    const navigate = useNavigate();
    const total = Math.min(movies.length, 5);
    const timerRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    /* ── Go to slide, reset auto-advance timer ── */
    const goTo = useCallback((idx) => {
        setActiveIndex(idx);
        // Reset interval so it counts from the moment user clicks
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % total);
        }, INTERVAL_MS);
    }, [total]);

    /* ── Auto-advance on mount ── */
    useEffect(() => {
        if (total < 2) return;
        timerRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % total);
        }, INTERVAL_MS);
        return () => clearInterval(timerRef.current);
    }, [total]);

    /* ── Keyboard accessibility ── */
    const handleKey = (e) => {
        if (e.key === 'ArrowRight') goTo((activeIndex + 1) % total);
        if (e.key === 'ArrowLeft') goTo((activeIndex - 1 + total) % total);
    };

    // ── Skeleton while TMDB data loads ─────────────────────────
    if (!total) {
        return (
            <div className="hero-skeleton">
                <div className="hero-skeleton-inner" />
            </div>
        );
    }

    return (
        <section
            className="hero"
            aria-label="Featured Movie Spotlight"
            onKeyDown={handleKey}
            tabIndex={-1}
        >
            {/*
        ── SLIDE TRACK ──────────────────────────────────────────
        All backdrop images in a flex row.
        transform: translateX(−activeIndex × 100%) slides them.
        transition makes it smooth — no opacity swap, no blink.
      */}
            <div
                className="hero-track"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                aria-live="off"
            >
                {movies.slice(0, 5).map((movie, i) => (
                    <div key={movie.id} className="hero-slide" aria-hidden={i !== activeIndex}>
                        {movie.backdrop_path && (
                            <div
                                className="hero-bg"
                                style={{
                                    backgroundImage: `url(${TMDB_BACKDROP_BASE}${movie.backdrop_path})`,
                                }}
                            />
                        )}
                        {/* Per-slide gradient overlays */}
                        <div className="hero-grad-left" />
                        <div className="hero-grad-bottom" />
                        <div className="hero-grad-top" />
                    </div>
                ))}
            </div>

            {/*
        ── CONTENT LAYER ─────────────────────────────────────────
        Lives above the track, always visible.
        Transitions the text with a subtle translateY + opacity
        whenever activeIndex changes.
      */}
            <div className="hero-content" key={activeIndex}>
                {/* Eyebrow */}
                <p className="hero-eyebrow">
                    🎬 Spotlight&nbsp;
                    <span className="hero-eyebrow__num">#{activeIndex + 1}</span>
                </p>

                {/* Title */}
                <h1 className="hero-title">{movies[activeIndex].title}</h1>

                {/* Meta badge row */}
                <div className="hero-meta">
                    {movies[activeIndex].release_date && (
                        <span className="hero-meta__year">
                            {movies[activeIndex].release_date.substring(0, 4)}
                        </span>
                    )}
                    <span className="hero-meta__sep">·</span>
                    {movies[activeIndex].vote_average > 0 && (
                        <span className="hero-meta__rating">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                            {Number(movies[activeIndex].vote_average).toFixed(1)}
                        </span>
                    )}
                    <span className="hero-meta__hd">HD</span>
                </div>

                {/* Synopsis */}
                {movies[activeIndex].overview && (
                    <p className="hero-overview">
                        {movies[activeIndex].overview.length > 180
                            ? movies[activeIndex].overview.substring(0, 180) + '…'
                            : movies[activeIndex].overview}
                    </p>
                )}

                {/* CTA buttons */}
                <div className="hero-actions">
                    <button
                        className="hero-btn-primary"
                        onClick={() => navigate(`/watch/${movies[activeIndex].id}`)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                        Watch Now
                    </button>

                    <button
                        className="hero-btn-secondary"
                        onClick={() => navigate(`/watch/${movies[activeIndex].id}`)}
                    >
                        Details
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Left / Right arrow buttons ── */}
            {total > 1 && (
                <>
                    <button
                        className="hero-arrow hero-arrow--left"
                        onClick={() => goTo((activeIndex - 1 + total) % total)}
                        aria-label="Previous spotlight"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        className="hero-arrow hero-arrow--right"
                        onClick={() => goTo((activeIndex + 1) % total)}
                        aria-label="Next spotlight"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* ── Dot indicators — centered bottom ── */}
            <div className="hero-dots-bar" role="tablist" aria-label="Spotlight slides">
                {Array.from({ length: total }).map((_, i) => (
                    <button
                        key={i}
                        role="tab"
                        aria-selected={i === activeIndex}
                        aria-label={`Spotlight slide ${i + 1}: ${movies[i]?.title}`}
                        className={`hero-dot ${i === activeIndex ? 'active' : ''}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

        </section>
    );
};

export default HeroBanner;
