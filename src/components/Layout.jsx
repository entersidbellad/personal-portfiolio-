import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NeuralBackground from './NeuralBackground';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children, showSphere = true }) => {
    const location = useLocation();
    const { isDark } = useTheme();
    const [scrollOpacity, setScrollOpacity] = useState(1);
    const [showMobileNav, setShowMobileNav] = useState(true);

    // Fade out name header on scroll + hide mobile nav while scrolling mid-page
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Start fading at 50px, fully hidden by 150px
            const opacity = Math.max(0, 1 - scrollY / 100);
            setScrollOpacity(opacity);

            // Mobile nav: only show at very bottom of page (on content pages) or always on home
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const nearBottom = scrollY + clientHeight >= scrollHeight - 50;
            const isHome = location.pathname === '/';
            setShowMobileNav(isHome || nearBottom);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to set initial state
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const navItems = [
        { name: 'About', path: '/content#about' },
        { name: 'Edu', path: '/content#education' },
        { name: 'Exp', path: '/content#experience' },
        { name: 'Projects', path: '/content#projects' },
    ];
    const navItemsFull = [
        { name: 'About', path: '/content#about' },
        { name: 'Education', path: '/content#education' },
        { name: 'Experience', path: '/content#experience' },
        { name: 'Projects', path: '/content#projects' },
        { name: 'Miscellaneous', path: '/content#miscellaneous' },
    ];
    const socialLinks = [
        { name: 'X', url: 'https://x.com/BelzidkidZid' },
        { name: 'Mail', url: 'mailto:siddharthbellad@gmail.com' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/siddharthbellad/' },
        { name: 'GitHub', url: 'https://github.com/entersidbellad' },
    ];

    // Check if we're on the home page to disable scrolling
    const isHomePage = location.pathname === '/';

    return (
        <div className={`min-h-screen relative w-full ${isHomePage ? 'h-screen overflow-hidden' : 'overflow-x-hidden'}`}>
            {/* Three.js Neural Network Background (conditional) */}
            {showSphere && <NeuralBackground />}

            {/* Top-Left: Naval Quote (hidden on mobile) */}
            <div className="fixed top-8 left-8 z-50 max-w-xs hidden md:block">
                <p className="text-[10px] leading-relaxed tracking-wide font-mono">
                    "You make your own luck if you stay at it long enough."
                    <br />
                    <span className="opacity-60">— Naval</span>
                </p>
            </div>

            {/* Top: Name and Tagline */}
            <div
                className="fixed top-4 left-4 right-4 md:top-8 md:right-8 md:left-auto z-50 md:text-right transition-opacity duration-300"
                style={{ opacity: scrollOpacity }}
            >
                <Link to="/">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none hover:opacity-70 transition-opacity">
                        Siddharth Bellad
                    </h1>
                </Link>
                <p className="text-[10px] md:text-xs font-mono mt-1 md:mt-2 uppercase tracking-widest opacity-70">
                    Curious. Gritty. Builder
                </p>
                <div className="mt-3 md:mt-6 flex flex-row md:flex-col md:items-end gap-3 md:gap-1">
                    <a
                        href="https://drive.google.com/file/d/1DPrjGnst-cO0QykC0vPv1NyqAXJjDwLF/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-xs font-mono uppercase tracking-widest hover:line-through transition-all duration-150"
                    >
                        Resume ↗
                    </a>
                    <a
                        href="https://www.loom.com/share/5a871de8cf864067bfafa9fc0e8dba76"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-xs font-mono uppercase tracking-widest hover:line-through transition-all duration-150"
                    >
                        Intro ↗
                    </a>
                </div>
            </div>

            {/* Mid-Left: Vertical Navigation (hidden on mobile) */}
            <nav className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:block">
                <ul className="flex flex-col gap-6 text-xs font-mono tracking-widest uppercase">
                    {navItemsFull.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className="hover:line-through transition-all duration-150"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Navigation - compact single row */}
            <nav
                className={`fixed bottom-6 left-0 right-0 z-30 md:hidden px-4 py-1 transition-opacity duration-300 ${showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <ul className="flex justify-center gap-5 text-[10px] font-mono tracking-widest uppercase">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className="hover:line-through"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom-Left: Theme Toggle (desktop only) */}
            <div className="fixed bottom-8 left-8 z-50 hidden md:block">
                <ThemeToggle />
            </div>

            {/* Bottom-Center: Social Links - only show at bottom */}
            <div
                className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden sm:block transition-opacity duration-300 ${showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <ul className="flex gap-6 text-[10px] font-mono uppercase tracking-widest">
                    {socialLinks.map((link) => {
                        const isMailto = link.url.startsWith('mailto:');
                        return (
                            <li key={link.name}>
                                <a
                                    href={link.url}
                                    {...(!isMailto && { target: '_blank', rel: 'noopener noreferrer' })}
                                    className="hover:line-through transition-all duration-150"
                                >
                                    {link.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile Bottom: Theme Toggle + Copyright */}
            <div
                className={`fixed bottom-2 left-4 right-4 z-50 flex justify-between items-center md:hidden transition-opacity duration-300 ${showMobileNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <ThemeToggle />
                <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">
                    ©2026
                </span>
            </div>

            {/* Bottom-Right: Copyright (desktop only) */}
            <div className="fixed bottom-8 right-8 z-50 text-[10px] font-mono uppercase tracking-widest hidden md:block">
                &copy;2026 Siddharth Bellad
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 w-full min-h-screen pt-20 md:pt-48 px-3 md:pl-48 md:pr-16 pb-16 md:pb-32 pointer-events-none">
                <div className="pointer-events-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
