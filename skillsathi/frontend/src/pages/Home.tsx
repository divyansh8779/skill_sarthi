import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-shell">
      <div className="home-orbit home-orbit-one" />
      <div className="home-orbit home-orbit-two" />

      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Your next chapter starts here</div>
          <h1>Turn your <em>potential</em> into a plan.</h1>
          <p className="hero-description">
            A friendly, voice-first guide for discovering skills, finding opportunities,
            and building a career that feels like yours.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#conversation">Start a conversation <span>-&gt;</span></a>
            <Link className="secondary-action" to="/schemes">Explore schemes <span>↗</span></Link>
          </div>
          <div className="trust-row">
            <div className="avatar-stack" aria-hidden="true"><span>AS</span><span>RK</span><span>PM</span><span>+</span></div>
            <span>Made for curious minds everywhere</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="SkillSathi guidance preview">
          <div className="visual-glow" />
          <div className="compass-card">
            <div className="compass-topline"><span>YOUR DIRECTION</span><span className="live-mark"><i /> LIVE</span></div>
            <div className="compass-ring"><div className="compass-needle">✦</div><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span></div>
            <div className="compass-caption"><strong>Find your north.</strong><span>One thoughtful question at a time.</span></div>
          </div>
          <div className="floating-note note-top"><span className="note-icon">✦</span><div><strong>Skills unlocked</strong><small>Curiosity is a superpower</small></div></div>
          <div className="floating-note note-bottom"><span className="note-icon note-icon-warm">↗</span><div><strong>Opportunities</strong><small>Picked for your journey</small></div></div>
        </div>
      </section>

      <section className="home-lower" id="conversation">
        <div className="section-intro">
          <span className="section-kicker">THE SATHI DESK</span>
          <h2>Let’s make your<br /><span>next move clearer.</span></h2>
          <p>Tell us what you’re curious about. You can type or simply use your voice.</p>
          <div className="feature-list"><span><b>01</b> Discover your strengths</span><span><b>02</b> Find a path that fits</span><span><b>03</b> Take the first step</span></div>
        </div>
        <div className="chat-frame">
          <div className="chat-frame-header"><div className="sathi-avatar">S</div><div><strong>Sathi is listening</strong><span>Usually replies in a few seconds</span></div><span className="online-dot" /></div>
          <div className="chat-content"><ChatWidget /></div>
        </div>
      </section>
    </div>
  );
}
