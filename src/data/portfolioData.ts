// ============================================================
// portfolioData.ts — Centralized configuration for Saivinod Kotipalli's Portfolio
// All external links, personal info, and content in one place.
// ============================================================

export interface ProjectLink {
  github?: string;
  demo?: string | null;
  frontendDemo?: string;
  backendApi?: string;
}

export interface Project {
  id: string;
  number: string;
  badge: string | null;
  title: string;
  description: string;
  techTags: string[];
  links: ProjectLink;
  isFlagship: boolean;
}

export interface CertificateItem {
  name: string;
  issuer: string;
  icon: string;
}

export interface InternshipItem {
  organization: string;
  role: string;
  duration: string;
  skills: string[];
  tech: string[];
}

export interface LeadershipItemData {
  title: string;
  description: string;
  role: string;
  badge: string;
}

export interface SoftSkillItem {
  name: string;
  icon: string;
  desc: string;
}

export interface ContentCategory {
  title: string;
  description: string;
  stats: string;
  icon: string;
}

export const personalInfo = {
  name: "Saivinod Kotipalli",
  firstName: "Saivinod",
  brandName: "Saivinod Kotipalli",
  title: "AWS DevOps Engineer",
  location: "India",
  phone: "+91 98765 43210",
  emails: {
    primary: "saivinodkotipalli2003@gmail.com",
    secondary: "saivinod.kotipalli@gmail.com",
  },
  summary:
    "Passionate AWS DevOps Engineer and Computer Science graduate specializing in AWS cloud infrastructure, CI/CD pipelines, Docker, Kubernetes, Terraform, and scalable backend architecture. Driven by automating deployments and building high-availability systems.",
  resumeUrl: "/Saivinod_Kotipalli_Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/saivinodkotipalli",
  linkedin: "https://www.linkedin.com/in/saivinod-kotipalli-960aa61a0",
  instagram: "https://instagram.com/saivinod.kotipalli",
};

export const heroContent = {
  greeting: "Hi, I'm Saivinod Kotipalli",
  titleHighlight: "AWS DevOps Engineer",
  subtitle:
    "I design, automate, and scale resilient cloud infrastructure using AWS, Docker, Kubernetes, Terraform, CI/CD pipelines, and modern DevOps practices.",
  ctaPrimary: { text: "View My Work", href: "#projects" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:saivinodkotipalli2003@gmail.com?subject=Hiring Inquiry – Portfolio&body=Hello Saivinod,%0D%0A%0D%0AI came across your portfolio and would like to discuss an opportunity with you.%0D%0A%0D%0ALooking forward to hearing from you.%0D%0ABest Regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Saivinod_Kotipalli_Resume.pdf" },
  heroVideoUrl: "/hero-video.mp4",
};

export const aboutContent = {
  heading: "Hello!",
  bio: `Hi, my name is <span class="text-black text-xl font-black mx-1 tracking-wide uppercase">Saivinod Kotipalli</span>, a passionate software engineer based in India, dedicated to crafting clean, functional, and highly scalable full-stack applications with intuitive visual design.`,
  techStack: ["React", "Node.js", "TypeScript", "Python", "Java", "Tailwind CSS"],
};

export const skillsContent = {
  badge: "My Process",
  heading: "Here's how I turn ideas into real-world applications",
  description:
    "I follow a structured, creative, and highly technical approach to turn ideas into robust full-stack applications.",
  cards: [
    {
      number: "01",
      title: "Research",
      text: "Understanding requirements, user journeys, and technical architecture to lay a solid foundation for the system.",
    },
    {
      number: "02",
      title: "Design",
      text: "Crafting modern, accessible user interfaces with clean responsive layouts, fluid micro-interactions, and pixel perfection.",
    },
    {
      number: "03",
      title: "Develop",
      text: "Building clean backend microservices and interactive frontend user interfaces using modern stacks and optimized algorithms.",
    },
    {
      number: "04",
      title: "Deploy",
      text: "Rigorous automated testing, CI/CD, performance optimizations, and cloud deployment with continuous monitoring.",
    },
  ],
  endText: "Ready to ship!",
};

export const technicalSkills = {
  categories: [
    {
      title: "Programming Languages",
      skills: [
        { name: "JavaScript / TypeScript", level: 92 },
        { name: "Python", level: 88 },
        { name: "Java", level: 85 },
        { name: "C++", level: 80 },
      ],
    },
    {
      title: "Frontend Engineering",
      skills: [
        { name: "React.js & Next.js", level: 94 },
        { name: "Tailwind CSS & Framer Motion", level: 95 },
        { name: "HTML5 & CSS3 / SCSS", level: 96 },
        { name: "State Management (Redux/Zustand)", level: 88 },
      ],
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js & Express", level: 90 },
        { name: "FastAPI / Django", level: 82 },
        { name: "Spring Boot", level: 80 },
        { name: "RESTful & GraphQL APIs", level: 90 },
      ],
    },
    {
      title: "Databases & Storage",
      skills: [
        { name: "MongoDB", level: 88 },
        { name: "PostgreSQL & MySQL", level: 86 },
        { name: "Redis Caching", level: 80 },
        { name: "Firebase / Firestore", level: 85 },
      ],
    },
    {
      title: "Tools & DevOps",
      skills: [
        { name: "Git & GitHub Workflow", level: 92 },
        { name: "Docker & Containerization", level: 82 },
        { name: "Postman & API Design", level: 90 },
        { name: "Vite / Webpack / Esbuild", level: 88 },
      ],
    },
  ],
};

export const contentCreation = {
  badge: "Creative & Visual Edits",
  heading: "Creative Direction & Cinematic Edits",
  description:
    "Beyond writing clean code, I craft visual stories, tech tutorials, and aesthetic video edits with high-impact color grading and sound design.",
  categories: [
    {
      title: "Cinematic Edits & Reels",
      description:
        "Visual stories crafted with cinematic lighting, premium color grading, and high-impact sound design.",
      stats: "50+ Edits Created",
      icon: "🎥",
    },
    {
      title: "Tech & Coding Tutorials",
      description:
        "Fast-paced web development tutorials and tech tips explaining complex concepts in clear, bite-sized reels.",
      stats: "100k+ Views",
      icon: "🧠",
    },
    {
      title: "Aesthetic Vlogs & Shorts",
      description:
        "Immersive travel vlogs and aesthetic edits capturing cultures, campus events, and visual rhythms.",
      stats: "Creative Portfolio",
      icon: "✈️",
    },
    {
      title: "3D Overlays & FX Edits",
      description:
        "Experimental motion design, 3D overlays, and trendsetting visual effects pushing creative bounds.",
      stats: "Personal Motion Projects",
      icon: "⚡",
    },
  ],
};

export const leadershipList: LeadershipItemData[] = [
  {
    title: "IEEE Student Branch Tech Coordinator",
    description:
      "Led digital content operations, coordinated technical workshops, and drove interactive student engagement for annual tech symposiums.",
    role: "Technical Coordinator",
    badge: "Volunteer",
  },
  {
    title: "Team Lead – National Level Hackathon",
    description:
      "Led a team of 4 software developers to build an AI-powered solution, winning top positions for architecture and execution.",
    role: "Team Lead",
    badge: "Leadership",
  },
  {
    title: "5-Day Innovation & Design Bootcamp",
    description:
      "Participated in an intensive Innovation, Design, and Entrepreneurship Bootcamp organized by Ministry of Education.",
    role: "Bootcamp Graduate",
    badge: "Innovation",
  },
  {
    title: "Tech Summit & Code Sprints Host",
    description:
      "Organized and hosted annual flagship hackathons, managing team registrations, mentoring participants, and coordinating judge evaluations.",
    role: "Hackathon Organizer",
    badge: "Co-Curricular",
  },
  {
    title: "Stage Anchoring & Public Speaking",
    description:
      "Anchored flagship technical summits, speaking in front of 500+ attendees and managing event execution seamlessly.",
    role: "Stage Anchor & Host",
    badge: "Public Speaking",
  },
];

export const internshipsList: InternshipItem[] = [
  {
    organization: "Netlink Technologies",
    role: "Full Stack & BI Tools Intern",
    duration: "June 2025 - August 2025",
    skills: ["Full Stack Development", "Business Intelligence", "Dashboard Design", "Data Modeling"],
    tech: ["React", "Node.js", "MySQL", "Lumenore", "Tailwind CSS"],
  },
  {
    organization: "Canva Design Studio",
    role: "Visual Content Creator & Designer",
    duration: "May 2024 - June 2024",
    skills: ["Visual Designing", "UI/UX Prototyping", "Branding & Assets", "Vector Graphics"],
    tech: ["Figma", "Canva Pro", "Adobe Suite", "Tailwind"],
  },
  {
    organization: "TechTips Media",
    role: "Web Development Intern",
    duration: "3 Months (Hybrid)",
    skills: ["Frontend Development", "Responsive Layouts", "API Integration", "Performance Audit"],
    tech: ["HTML5", "CSS3", "JavaScript", "React", "Bootstrap"],
  },
];

export const softSkillsList: SoftSkillItem[] = [
  { name: "Leadership", icon: "👑", desc: "Guiding teams, managing sprint goals, and driving project completion with a clear vision." },
  { name: "Public Speaking", icon: "🎤", desc: "Confident stage presence, anchoring summits, and delivering articulate technical talks." },
  { name: "Team Collaboration", icon: "🤝", desc: "Collaborating across cross-functional teams, building projects, and engineering code in sync." },
  { name: "Communication", icon: "💬", desc: "Clear, concise, and structured interactions in both technical and non-technical settings." },
  { name: "Problem Solving", icon: "🧩", desc: "Breaking down complex engineering challenges into clean, logical, modular components." },
  { name: "Adaptability", icon: "🌟", desc: "Fast learner adapting quickly to new stacks like Next.js, Docker, FastAPI, and AI integration." },
  { name: "Creativity", icon: "🎨", desc: "Blending aesthetic visual design with software architecture to craft engaging applications." },
  { name: "Time Management", icon: "⏰", desc: "Balancing engineering studies, project development, event organizing, and creative editing." },
];

export const projects: Project[] = [
  {
    id: "foodmesh",    number: "01",
    badge: "🚀 Flagship Project",
    title: "FoodMesh Enterprise SaaS",
    description:
      "FoodMesh — An enterprise-grade multi-tenant restaurant management and online ordering SaaS platform inspired by UrbanPiper. Enables multi-outlet management, real-time order tracking, menu customization, staff permissions, and analytics. Built with React, Next.js, Node.js, PostgreSQL, Redis, Docker, and Cloud infrastructure.",
    techTags: [
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Tailwind CSS",
      "AWS",
    ],
    links: {
      github: "https://github.com/saivinodkotipalli/FoodMesh-SaaS",
      demo: "https://foodmesh-demo.vercel.app",
    },
    isFlagship: true,
  },
  {
    id: "karigar",
    number: "02",
    badge: "⭐ Featured App",
    title: "Karigar — Service Finder Platform",
    description:
      "A full-stack web platform connecting skilled local artisans and service workers with customers. Features real-time location-based search, verified worker profiles, booking management, and integrated reviews.",
    techTags: ["React", "Node.js", "Express", "MongoDB", "REST API", "Tailwind CSS"],
    links: {
      github: "https://github.com/saivinodkotipalli/Karigar",
      frontendDemo: "https://karigar-frontend.onrender.com",
      backendApi: "https://karigar-backend.onrender.com",
    },
    isFlagship: false,
  },
  {
    id: "sentiment-analysis",
    number: "03",
    badge: "🤖 AI & Automation",
    title: "AI-Powered Feedback & Sentiment Analyzer",
    description:
      "An intelligent sentiment analysis application that processes feedback using AI models to classify customer sentiments into positive, negative, or neutral metrics with real-time dashboard visualizers and workflow automation.",
    techTags: ["React", "Node.js", "MongoDB", "n8n Automation", "AI Models", "Recharts"],
    links: {
      github: "https://github.com/saivinodkotipalli/AI-Sentiment-Analyzer",
      demo: "https://sentiment-ai-demo.vercel.app",
    },
    isFlagship: false,
  },
  {
    id: "devpulse",
    number: "04",
    badge: "⚡ Analytics Workspace",
    title: "DevPulse Developer Dashboard",
    description:
      "A real-time developer productivity workspace featuring repository statistics, task Kanban boards, code snippet vaults, and customizable widget panels with dark theme aesthetics.",
    techTags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Recharts"],
    links: {
      github: "https://github.com/saivinodkotipalli/DevPulse-Dashboard",
      demo: "https://devpulse-dashboard.vercel.app",
    },
    isFlagship: false,
  },
];

export const certificates = {
  featured: [
    {
      name: "Oracle Cloud Infrastructure 2025",
      issuer: "Oracle",
      icon: "☁️",
    },
    {
      name: "Programming in Java Certification",
      issuer: "NPTEL / IIT",
      icon: "☕",
    },
    {
      name: "Full Stack Web Development",
      issuer: "Coursera / Meta",
      icon: "⚙️",
    },
    {
      name: "Software Technology Job Simulation",
      issuer: "Deloitte",
      icon: "💼",
    },
    {
      name: "Career Edge – IT Primer",
      issuer: "TCS iON",
      icon: "🎓",
    },
    {
      name: "Fundamentals of Business Intelligence",
      issuer: "Lumenore Analytics",
      icon: "📊",
    },
  ],
  viewAllUrl:
    "https://drive.google.com/file/d/1ObdGWtVSx8SsfR4AcbCySSd9LFXcAs9f/view?usp=sharing",
};

export const education = {
  degree: "B.Tech – Computer Science & Engineering",
  institution: "KL University / Technical Institute",
  cgpa: "8.8",
  graduation: "2025",
  twelfth: "12th Board Science – 92%",
  tenth: "10th Board CBSE – 95%",
};

export const footerContent = {
  taglines: [
    "AWS DevOps & Cloud Engineering",
    "AWS · Docker · Kubernetes · Terraform · CI/CD",
    "Scalable Cloud & DevOps Solutions",
  ],
  credential: "B.Tech CSE · CGPA 8.8",
  copyright: `© ${new Date().getFullYear()} Saivinod Kotipalli | Built with React & Tailwind CSS`,
};

export const emailjsConfig = {
  serviceId: (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "service_default",
  templateId: (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "template_default",
  publicKey: (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "user_public_key",
};
