import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, Shield, Clock, Globe, Star, Users, BookOpen, Video, CreditCard, Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedSection } from '@/components/animations';
import FeatureMarquee from '@/components/feature-marquee';
import PreRegistrationDialog from '@/components/pre-registration-dialog';
import SplashScreen from '@/components/splash-screen';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';
import type { SharedData } from '@/types';



export default function Welcome() {
    const { auth, flash } = usePage<SharedData>().props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    // Auto-open dialog 5 seconds AFTER splash screen is gone
    useEffect(() => {
        if (showSplash) return;

        const timer = setTimeout(() => {
            if (!auth.user) {
                setDialogOpen(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [auth.user, showSplash]);

    return (
        <>
            <Head title="TutorConnect - Quality Education, Globally Delivered">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    TutorConnect
                                </span>
                            </div>

                            {/* Nav Links - Desktop */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors animated-underline">
                                    Features
                                </a>
                                <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors animated-underline">
                                    How It Works
                                </a>
                                <a href="/about" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors animated-underline">
                                    About
                                </a>
                            </div>

                            {/* Auth Buttons & Mobile Menu */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        <Button variant="default">Dashboard</Button>
                                    </Link>
                                ) : (
                                    <>
                                        {/* Pre-Register button - hidden on mobile, shown on sm+ */}
                                        <Button
                                            variant="default"
                                            onClick={() => setDialogOpen(true)}
                                            className="hidden sm:flex shadow-lg shadow-blue-500/25"
                                        >
                                            Pre-Register
                                        </Button>
                                        <Link href={login()} className="hidden sm:block">
                                            <Button variant="ghost">Log in</Button>
                                        </Link>
                                    </>
                                )}

                                {/* Mobile Menu Button */}
                                <button
                                    className="md:hidden p-2 rounded-none text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Dropdown */}
                        {mobileMenuOpen && (
                            <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-800/50 animate-fade-in">
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="#features"
                                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-none transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Features
                                    </a>
                                    <a
                                        href="#how-it-works"
                                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-none transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        How It Works
                                    </a>
                                    <a
                                        href="/about"
                                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-none transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        About
                                    </a>
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href={login()}
                                                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-none transition-colors"
                                            >
                                                Log in
                                            </Link>
                                            {/* Prominent Pre-Register Button in Mobile Menu */}
                                            <div className="px-4 pt-2">
                                                <Button
                                                    variant="default"
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        setDialogOpen(true);
                                                    }}
                                                    className="w-full py-6 text-base font-semibold shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                                                >
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    Pre-Register Now
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="rounded-none bg-green-50 border border-green-200 p-4 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
                            <p className="font-medium">✓ {flash.success}</p>
                        </div>
                    </div>
                )}

                <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    {/* Subtle background decorations */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Semi-circular arc decoration */}
                        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 border-2 border-blue-200/30 dark:border-blue-800/20 rounded-none" />
                        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/4 border border-blue-100/40 dark:border-blue-800/15 rounded-none" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left: Content */}
                            <div className="text-center lg:text-left order-2 lg:order-1">
                                <AnimatedSection animation="fade-in-up" delay={0}>
                                    <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                        Online Tutoring
                                    </span>
                                </AnimatedSection>

                                <AnimatedSection animation="fade-in-up" delay={100}>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 dark:text-white leading-[1.1] mb-6">
                                        Learn From{' '}
                                        <span className="block text-gray-900 dark:text-white">Expert Filipino</span>
                                        <span className="block animate-gradient-text">Teachers</span>
                                    </h1>
                                </AnimatedSection>

                                <AnimatedSection animation="fade-in-up" delay={200}>
                                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                                        Connect with verified, PRC-licensed teachers from the
                                        <span className="text-blue-600 dark:text-blue-400 font-medium"> Philippines</span>.
                                        Affordable, high-quality online tutoring for K-12 students.
                                    </p>
                                </AnimatedSection>

                                {/* Search-style Subject Selector */}
                                <AnimatedSection animation="fade-in-up" delay={300}>
                                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-6">
                                        <div className="flex-1 relative">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <BookOpen className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="What subject do you need help with?"
                                                className="w-full pl-12 pr-4 py-4 rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                            />
                                        </div>
                                        <Button
                                            size="lg"
                                            className="px-8 py-4 text-base font-semibold shadow-lg shadow-blue-500/25 whitespace-nowrap"
                                            onClick={() => setDialogOpen(true)}
                                        >
                                            Find Tutor
                                        </Button>
                                    </div>
                                </AnimatedSection>

                                {/* Popular Subjects Tags */}
                                <AnimatedSection animation="fade-in-up" delay={400}>
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
                                        {['Math', 'Science', 'English', 'Filipino'].map((subject) => (
                                            <button
                                                key={subject}
                                                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 decoration-gray-300 dark:decoration-gray-600 hover:decoration-blue-500 transition-colors"
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                </AnimatedSection>
                            </div>

                            {/* Right: Hero Image with Floating Badges */}
                            <div className="relative order-1 lg:order-2">
                                <AnimatedSection animation="scale-in" delay={200} className="relative">
                                    {/* Main Image Container */}
                                    <div className="relative mx-auto max-w-md lg:max-w-none">
                                        {/* Circular glow behind image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-none blur-3xl scale-75" />

                                        {/* Hero Image */}
                                        <img
                                            src="/images/hero-tutoring.png"
                                            alt="Student learning online with Filipino tutor"
                                            className="relative w-full h-auto rounded-none"
                                        />

                                        {/* Floating Stat Badges */}
                                        {/* Top Right Badge */}
                                        <div className="absolute -top-2 -right-2 sm:top-4 sm:right-0 lg:-right-8 animate-float">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-none shadow-lg shadow-blue-500/30 text-sm font-semibold whitespace-nowrap">
                                                100+ PRC Teachers
                                            </div>
                                        </div>

                                        {/* Middle Right Badge */}
                                        <div className="absolute top-1/3 -right-4 sm:right-0 lg:-right-12 animate-float" style={{ animationDelay: '0.5s' }}>
                                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-none shadow-lg shadow-emerald-500/30 text-sm font-semibold whitespace-nowrap">
                                                98% Success Rate
                                            </div>
                                        </div>

                                        {/* Left Badge */}
                                        <div className="absolute top-1/2 -left-4 sm:left-0 lg:-left-8 animate-float" style={{ animationDelay: '1s' }}>
                                            <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-4 py-2 rounded-none shadow-lg shadow-violet-500/30 text-sm font-semibold whitespace-nowrap">
                                                <Users className="w-4 h-4 inline mr-1" />
                                                500+ Students
                                            </div>
                                        </div>

                                        {/* Bottom Badge */}
                                        <div className="absolute -bottom-2 left-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
                                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-none shadow-lg shadow-amber-500/30 text-sm font-semibold whitespace-nowrap">
                                                <Star className="w-4 h-4 inline mr-1" />
                                                4.9 Avg Rating
                                            </div>
                                        </div>

                                        {/* Small decorative dots */}
                                        <div className="absolute top-8 left-8 w-3 h-3 bg-blue-500 rounded-none animate-pulse" />
                                        <div className="absolute bottom-12 right-12 w-2 h-2 bg-emerald-500 rounded-none animate-pulse" style={{ animationDelay: '0.5s' }} />
                                        <div className="absolute top-1/2 left-4 w-2 h-2 bg-violet-500 rounded-none animate-pulse" style={{ animationDelay: '1s' }} />
                                    </div>
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features Section */}
                <section id="features" className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection animation="fade-in-up" className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Why Choose <span className="animate-gradient-text">TutorConnect</span>?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                A complete platform connecting qualified Filipino teachers with students worldwide.
                            </p>
                        </AnimatedSection>
                    </div>

                    {/* Full-width marquee */}
                    <FeatureMarquee
                        features={[
                            {
                                icon: <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Verified Teachers",
                                description: "All teachers are PRC-licensed and thoroughly verified for your peace of mind."
                            },
                            {
                                icon: <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Live Video Sessions",
                                description: "Interactive one-on-one video calls with screen sharing and whiteboard."
                            },
                            {
                                icon: <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Flexible Scheduling",
                                description: "Book sessions that fit your schedule across different time zones."
                            },
                            {
                                icon: <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Secure Payments",
                                description: "Safe and secure payment processing via SquareUP with transparent pricing."
                            },
                            {
                                icon: <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Multiple Subjects",
                                description: "Math, Science, English, Filipino, and more. Find the right teacher."
                            },
                            {
                                icon: <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                                title: "Global Access",
                                description: "Learn from anywhere in the world. All you need is an internet connection."
                            },
                        ]}
                    />
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection animation="fade-in-up" className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                How It <span className="animate-gradient-text">Works</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Get started in three simple steps
                            </p>
                        </AnimatedSection>

                        {/* Steps with Images */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            <AnimatedSection animation="slide-in-left" className="order-2 lg:order-1">
                                <img
                                    src="/images/teacher-teaching.png"
                                    alt="Teacher conducting online lesson"
                                    className="w-full max-w-md mx-auto rounded-none shadow-xl hover-lift transition-all duration-300"
                                />
                            </AnimatedSection>
                            <div className="order-1 lg:order-2 space-y-8">
                                <AnimatedSection animation="fade-in-up" delay={0}>
                                    <div className="flex gap-4 group">
                                        <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Browse Teachers</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Search and filter teachers by subject, availability, rating, and price.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection animation="fade-in-up" delay={150}>
                                    <div className="flex gap-4 group">
                                        <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Book a Session</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Choose a time slot that works for you and confirm your booking.
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection animation="fade-in-up" delay={300}>
                                    <div className="flex gap-4 group">
                                        <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start Learning</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Join the video call at your scheduled time and enjoy your lesson!
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </div>

                        {/* Student Image Section */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <AnimatedSection animation="fade-in-up" className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    Personalized <span className="animate-gradient-text">Learning Experience</span>
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Every student learns differently. Our teachers adapt their teaching style to match
                                    your child's needs, ensuring effective and engaging sessions.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <div className="w-5 h-5 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        One-on-one attention
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <div className="w-5 h-5 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        Progress tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <div className="w-5 h-5 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        Interactive lessons
                                    </li>
                                </ul>
                            </AnimatedSection>
                            <AnimatedSection animation="slide-in-right">
                                <img
                                    src="/images/student-learning.png"
                                    alt="Student engaged in online learning"
                                    className="w-full max-w-md mx-auto rounded-none shadow-xl hover-lift transition-all duration-300"
                                />
                            </AnimatedSection>
                        </div>

                        <AnimatedSection animation="scale-in" className="text-center mt-16">
                            <Button
                                size="lg"
                                className="text-lg px-10 py-6 shadow-lg shadow-blue-500/25 animate-pulse-glow btn-press"
                                onClick={() => setDialogOpen(true)}
                            >
                                Join as a Teacher Today
                            </Button>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Footer */}
                <footer id="about" className="py-16 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-12">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold">TutorConnect</span>
                                </div>
                                <p className="text-gray-400 max-w-md">
                                    Connecting PRC-licensed teachers from the Philippines with
                                    students worldwide. Quality education, globally delivered.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Platform</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                                    <li><span className="text-gray-500">Pricing (Coming Soon)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                            © {new Date().getFullYear()} TutorConnect. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>

            {/* Pre-Registration Dialog */}
            <PreRegistrationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    );
}
