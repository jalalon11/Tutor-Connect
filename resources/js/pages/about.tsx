import { Head, Link } from '@inertiajs/react';
import { GraduationCap, Target, Heart, Users, Globe, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VALUES = [
    {
        icon: Target,
        title: 'Excellence',
        description: 'We strive for the highest quality in education, ensuring every tutor meets our rigorous standards.',
    },
    {
        icon: Heart,
        title: 'Passion',
        description: 'Our tutors are passionate educators who genuinely care about student success.',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'We build meaningful connections between tutors and students worldwide.',
    },
    {
        icon: Globe,
        title: 'Accessibility',
        description: 'Quality education should be accessible to everyone, anywhere in the world.',
    },
];

const STATS = [
    { value: '100+', label: 'Expert Tutors' },
    { value: '2,000+', label: 'Happy Students' },
    { value: '50+', label: 'Subjects' },
    { value: '98%', label: 'Satisfaction Rate' },
];

export default function About() {
    return (
        <>
            <Head title="About Us - TutorConnect" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    TutorConnect
                                </span>
                            </Link>
                            <Link href="/">
                                <Button variant="outline">Back to Home</Button>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                About TutorConnect
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                                Empowering Education,{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Globally
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                We connect PRC-licensed Filipino teachers with students worldwide,
                                making quality education accessible and affordable for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {STATS.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                    Our Mission
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    Bridging the Gap in Education
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    TutorConnect was founded with a simple yet powerful vision: to provide
                                    high-quality, personalized education to students everywhere by connecting
                                    them with exceptional Filipino educators.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    The Philippines has a rich tradition of producing dedicated, English-proficient
                                    teachers. We bridge the gap between these talented educators and students
                                    seeking affordable, quality tutoring.
                                </p>
                                <ul className="space-y-3">
                                    {['All tutors are PRC-licensed', 'Rigorous verification process', 'Continuous quality assurance'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-none bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <Shield className="w-24 h-24 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verified Tutors</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Every tutor undergoes thorough verification</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="inline-block text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                Our Values
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                What Drives Us
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {VALUES.map((value, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-none p-6 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Join thousands of students already learning with our expert tutors.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/">
                                <Button size="lg" className="shadow-lg shadow-blue-500/25">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button size="lg" variant="outline">
                                    Become a Tutor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-none bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold">TutorConnect</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} TutorConnect. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
