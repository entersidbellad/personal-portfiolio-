import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const experiences = [
    {
        id: 'duracell',
        year: '2025',
        company: 'The Duracell Company',
        role: 'Product Strategy Consultant',
        subtitle: 'New Product R&D and Strategy Experience',
        details: [
            'Confidential',
            'Working on a new product R&D by identifying pain points through user interviews, new tech available, human groups and value creation.',
            'Developing a strategy for new market entry and identifying financial benefit.'
        ]
    },
    {
        id: 'newcoin',
        year: '2025',
        company: 'NewCoin (Antler x Startery)',
        role: 'Founder & PM',
        subtitle: 'Startup Experience',
        details: [
            'My first Startup Project that got me into interested in PM & Marketing.',
            'Vision was to have a cross platform financial app for immigrants to enable them to connect their bank accounts from their home country and the US in one place to track finances and have a dedicated personal finance hub, with thorough education on US finances and a Financial Advisor.',
            "Didn't get a good Product Market Fit - Pivoted to just an educational platform which I distributed along my incoming students batch for use."
        ]
    },
    {
        id: 'hatch',
        year: '2024 – 2025',
        company: 'Hatch',
        role: 'Jr. Process Engineer',
        subtitle: 'Engineering Consulting Experience',
        details: [
            'Learned and worked in Iron, Steel & Aluminum production.',
            'Gained extensive experience in Project Management and lifecycles.',
            'Got good with Excel & theoretical chemical engineering.'
        ]
    },
    {
        id: 'holcim',
        year: '2022',
        company: 'Holcim',
        role: 'Process Engineer',
        subtitle: 'Cement Experience',
        details: [
            'Learned and worked in cement production.',
            'Worked on Sustainable fuels for Kilns (Plastics and Tires).',
            'Hands on work - Got dirty.'
        ]
    },
    {
        id: 'carmeuse',
        year: '2021',
        company: 'Carmeuse',
        role: 'Process Engineer',
        subtitle: 'Limestone Experience',
        details: [
            'Worked in limestone processing and quality control.',
            'Worked on my first CAPEX Project on installing a heat exchanger in a Kiln.',
            'Pulled underground electric wire for about 80m to charge an auto water sampler and built a shed - super hands on and had fun!'
        ]
    }
];

const projects = [
    {
        id: 't7x',
        name: 't7-x (in progress)',
        description: 'AI intelligence layer for ERP systems in the EV/Automotive space.',
        links: [
            { label: 'Website', url: 'https://t7-x.com/' }
        ],
        details: [
            'Vision was to have an intelligence layer over ERP systems that would do predictive analytics at speed to help predict supply and demand in the EV space.',
            'We developed a pilot with SAP where we pull data from SAP and use that data to convert into actionable insights.'
        ]
    },
    {
        id: 'falantir',
        name: 'Falantir',
        description: 'AI agents for physical world CCTV monitoring and security.',
        links: [
            { label: 'DevPost', url: 'https://devpost.com/software/falantir' }
        ],
        details: []
    },
    {
        id: 'newcoin-project',
        name: 'NewCoin',
        description: 'Cross-platform financial app for immigrants.',
        links: [
            { label: 'Showcase Video', url: 'https://www.loom.com/share/da6d5d1114e1416fb9301109353144c7?sid=56a49714-7e8f-48f4-9e39-036e33ba7c3b' },
            { label: 'Pivot App', url: 'https://v0-finance-educational-app.vercel.app/' }
        ],
        details: []
    },
    {
        id: 'rekurix',
        name: 'Rekurix',
        description: 'HR platform for software role recruitment and resume validation.',
        links: [
            { label: 'Website', url: 'https://rekurix.com/' }
        ],
        details: [
            'Rekurix was a platform designed to help HR professionals reduce upstream costs and time in recruiting for software roles.',
            'The goal was to build a platform that would validate candidates\' resumes, GitHub projects, and LinkedIn profiles to provide a holistic score, helping recruiters identify the best candidates for specific roles.',
            'I built the website only!'
        ]
    },
    {
        id: 'n8n',
        name: 'n8n AI Automations',
        description: 'Various AI automation projects using n8n workflows.',
        links: [
            { label: 'Autonomous PM Researcher', url: 'https://www.linkedin.com/posts/siddharthbellad_ai-automation-n8n-activity-7339577341989318656-fg5Z/' },
            { label: 'First RAG Workflow', url: 'https://www.linkedin.com/posts/siddharthbellad_ai-automation-electricvehicles-activity-7340826337240121344-ZtpG/' },
            { label: 'Personal Fitness Coach', url: 'https://www.linkedin.com/posts/siddharthbellad_ai-n8n-strava-activity-7345669454376185857-85gr/' }
        ],
        details: [
            'Automating AI news aggregation from specific sources.',
            'Built my first RAG workflow for EV/energy storage data.',
            'An automated workflow that analyzes my health data and delivers personalized recovery recommendations.'
        ]
    },
    {
        id: 'strategy-cases',
        name: 'Strategy Case Studies',
        description: 'Strategic analysis and business case work.',
        links: [
            { label: 'Chewy Study', url: 'https://drive.google.com/file/d/1Uj6LK1DNw_Cnjro-ZYkiZOrtjL3fAYJN/view?usp=sharing' },
            { label: 'Figure AI Study', url: 'https://drive.google.com/file/d/16vfvYC8gCQaDAHsPJNVx-zi0y_aTUFLX/view?usp=sharing' },
            { label: 'Intel Study', url: 'https://drive.google.com/file/d/1_oVsr1mnT9-gUcyCnLfM0a1I2mjUFe1W/view?usp=sharing' },
            { label: 'Netflix', url: 'https://drive.google.com/file/d/1A9XbAPf3d5Rj28S5tczwTmR1Og0CA3Df/view?usp=sharing' }
        ],
        details: []
    },
    {
        id: 'marketing-cases',
        name: 'Marketing Case Studies',
        description: 'Marketing strategy and campaign work.',
        links: [
            { label: '21 Seeds', url: 'https://drive.google.com/file/d/18YEI2ZbpPbwIieTkTwSX8_Up10vbTSZn/view?usp=sharing' },
            { label: '24 HR Fitness', url: 'https://drive.google.com/file/d/1ke5L7wk2dM1LbBE_anQmjzRY6l36Bggd/view?usp=sharing' },
            { label: 'Amperity', url: 'https://drive.google.com/file/d/19pVTv3LyqnKYgVrfrvaE0ldztCQx4bog/view?usp=sharing' },
            { label: 'Mountain Man Brewing', url: 'https://drive.google.com/file/d/1eMZv4gajfMtxrshu6VQty8_iYqY4LQ23/view?usp=sharing' },
            { label: 'Rent the Runway', url: 'https://drive.google.com/file/d/1hILTVI1nLUc8LXDRZPqnxl81rvbLmEhF/view?usp=sharing' }
        ],
        details: []
    }
];

function ExperienceItem({ exp }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-current/10 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left py-3 flex items-center justify-between group cursor-pointer"
            >
                <p className="text-sm font-mono">
                    <span className="opacity-50">{exp.year}</span> / <span className="font-semibold">{exp.company}</span> / {exp.role}
                </p>
                <span className={`text-xs font-mono opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="pl-4 border-l-2 border-current/20 ml-2">
                    <p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-3">{exp.subtitle}</p>
                    <ul className="space-y-2">
                        {exp.details.map((detail, idx) => (
                            <li key={idx} className="text-sm font-mono opacity-80 leading-relaxed">
                                • {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ProjectItem({ project }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-current/10 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left py-3 flex items-center justify-between group cursor-pointer"
            >
                <div>
                    <p className="text-sm font-mono font-semibold">{project.name}</p>
                    <p className="text-sm font-mono opacity-70 mt-1">{project.description}</p>
                </div>
                <span className={`text-xs font-mono opacity-50 transition-transform duration-200 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
                <div className="pl-4 border-l-2 border-current/20 ml-2">
                    {/* Links */}
                    <div className="flex flex-col gap-2 mb-3">
                        {project.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono uppercase tracking-widest opacity-70 hover:opacity-100 underline transition-opacity"
                            >
                                {link.label} ↗
                            </a>
                        ))}
                    </div>
                    {/* Details */}
                    {project.details.length > 0 && (
                        <ul className="space-y-2">
                            {project.details.map((detail, idx) => (
                                <li key={idx} className="text-sm font-mono opacity-80 leading-relaxed">
                                    • {detail}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Content() {
    const location = useLocation();

    // Smooth scroll to hash on navigation
    useEffect(() => {
        if (location.hash) {
            // Small delay to ensure the page has rendered
            setTimeout(() => {
                const element = document.querySelector(location.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location.hash]);

    return (
        <div className="max-w-2xl mx-auto py-8 md:py-16 px-3 md:px-4">
            {/* Back Link */}
            <Link
                to="/"
                className="inline-block mb-8 md:mb-16 text-[10px] md:text-xs font-mono uppercase tracking-widest hover:line-through transition-all duration-150"
            >
                ← Back
            </Link>

            {/* About */}
            <section id="about" className="mb-12 md:mb-20">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 opacity-50 underline underline-offset-4 decoration-1">About</h2>

                {/* Intro Text */}
                <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose mb-6 md:mb-8">
                    I am a super curious person who loves building and experimenting at the intersection of AI and product. I also have a solid handle on the marketing and business side because I love seeing the whole picture of how a product thrives. I can jump in and do a bit of everything, but I am at my best when I'm taking a concept from an idea to a reality.
                </p>

            </section>

            {/* Education */}
            <section id="education" className="mb-12 md:mb-20">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 opacity-50 underline underline-offset-4 decoration-1">Education</h2>
                <div className="space-y-2 md:space-y-3">
                    <p className="text-xs md:text-sm font-mono">
                        <span className="font-semibold">Duke University</span> / MS Engineering Management
                    </p>
                    <p className="text-xs md:text-sm font-mono">
                        <span className="font-semibold">Penn State</span> / BS Chemical Engineering
                    </p>
                </div>
            </section>

            {/* Experience */}
            <section id="experience" className="mb-12 md:mb-20">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 opacity-50 underline underline-offset-4 decoration-1">Experience</h2>
                <div>
                    {experiences.map((exp) => (
                        <ExperienceItem key={exp.id} exp={exp} />
                    ))}
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="mb-12 md:mb-20">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 opacity-50 underline underline-offset-4 decoration-1">Projects</h2>
                <div>
                    {projects.map((project) => (
                        <ProjectItem key={project.id} project={project} />
                    ))}
                </div>
            </section>

            {/* Miscellaneous */}
            <section id="miscellaneous">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-widest mb-4 md:mb-6 opacity-50 underline underline-offset-4 decoration-1">Miscellaneous</h2>

                <div className="space-y-4 md:space-y-6">
                    <div>
                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-50 mb-1.5 md:mb-2">Interests</p>
                        <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Gym</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Running (strava: Sid Bellad)</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Poker</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Trading options</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Collectibles (Pokémon, watches, comics, antiques and sneakers)</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-50 mb-1.5 md:mb-2">Active Roles</p>
                        <div className="space-y-0.5 md:space-y-1">
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">President @ Duke Vibe Coding Club</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Adobe Student Ambassador</p>
                            <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">Perplexity Campus Partner</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-50 mb-1.5 md:mb-2">Press</p>
                        <p className="text-xs md:text-sm font-mono leading-relaxed md:leading-loose">
                            <a
                                href="https://www.centredaily.com/news/local/article247855285.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition-opacity"
                            >
                                ESG Initiative (Centre Daily Times) ↗
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
