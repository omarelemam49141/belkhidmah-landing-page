'use client'

import { LandingNavbar } from '@/components/landing/landing-navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { ServicesSection } from '@/components/landing/services-section'
import { ScreensSection } from '@/components/landing/screens-section'
import { DownloadSection } from '@/components/landing/download-section'
import { ContactSection } from '@/components/landing/contact-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { SmoothScroll } from '@/components/motion/smooth-scroll'

export function LandingPage () {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-warm-orange-500 selection:text-white">
        <LandingNavbar />
        <main className="bg-slate-50">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ScreensSection />
          <DownloadSection />
          <ContactSection />
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
