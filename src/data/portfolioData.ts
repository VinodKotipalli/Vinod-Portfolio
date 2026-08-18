// ============================================================
// portfolioData.ts — Accurate configuration for Saivinod Kotipalli
// Strictly aligned with the AWS Cloud Operations Engineer resume.
// ============================================================

export interface CertificateItem {
  name: string;
  code: string;
  issuer: string;
  year: string;
  icon: string;
  badgeUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
}

export interface AchievementItem {
  metric: string;
  title: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  university: string;
  location: string;
  duration: string;
  percentage: string;
}

export const personalInfo = {
  name: "Saivinod Kotipalli",
  firstName: "Saivinod",
  brandName: "Saivinod Kotipalli",
  title: "AWS Cloud Operations Engineer",
  location: "Srikakulam, Andhra Pradesh 532401",
  phone: "+91 8520899337",
  email: "saivinodkotipalli2003@gmail.com",
  emails: {
    primary: "saivinodkotipalli2003@gmail.com",
  },
  summary:
    "AWS Cloud Operations Engineer with 2+ years of experience designing, deploying, and maintaining cloud monitoring and infrastructure solutions on AWS. Skilled in Infrastructure as Code using Terraform, CI/CD automation with Jenkins, and implementing centralized monitoring platforms using Prometheus, Grafana, Node Exporter, and Alert manager. Experienced in monitoring AWS EC2 instances, Linux servers, and Docker containers, developing Grafana dashboards with PromQL, and configuring automated alerting through Slack and email notifications. Proficient in Linux administration, AWS services including EC2, IAM, and CloudWatch, and applying AWS Well-Architected Framework principles to improve reliability, security, performance, and operational excellence. Strong experience in technical documentation, incident response, and collaborating with cross-functional teams to enhance system availability and reduce Mean Time to Detect (MTTD).",
  resumeUrl: "/Saivinod_Kotipalli_Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/saivinodkotipalli",
  linkedin: "https://www.linkedin.com/in/saivinod-kotipalli-960aa61a0",
  instagram: "https://instagram.com/saivinod.kotipalli",
};

export const heroContent = {
  greeting: "Hi, I'm Saivinod Kotipalli",
  titleHighlight: "AWS Cloud Operations Engineer",
  subtitle:
    "AWS Cloud Operations Engineer with 2+ years of experience in AWS Cloud Infrastructure, Terraform IaC, Prometheus & Grafana Monitoring, Jenkins CI/CD, Docker & Kubernetes.",
  ctaPrimary: { text: "View Experience", href: "#experience" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:saivinodkotipalli2003@gmail.com?subject=Opportunity Inquiry – Saivinod Kotipalli&body=Hello Saivinod,%0D%0A%0D%0AI reviewed your AWS Cloud Operations Engineer profile and would like to discuss an opportunity.%0D%0A%0D%0ABest Regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Saivinod_Kotipalli_Resume.pdf" },
};

export const technicalSkillsCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: ["Python", "Java", "Bash", "Shell Scripting"],
  },
  {
    title: "Cloud Platforms (AWS – Compute & Storage)",
    skills: ["EC2", "S3", "Lambda", "RDS", "ECR", "EKS", "Auto Scaling", "SNS", "CloudWatch"],
  },
  {
    title: "AWS Networking",
    skills: [
      "VPC",
      "Subnets",
      "Route 53",
      "Elastic Load Balancing (ALB/NLB/CLB)",
      "NAT Gateway",
      "Internet Gateway",
      "VPC Peering",
      "CloudFront",
      "Direct Connect",
    ],
  },
  {
    title: "AWS Security",
    skills: [
      "IAM",
      "AWS KMS",
      "Secrets Manager",
      "Security Groups",
      "NACLs",
      "AWS WAF",
      "AWS Shield",
      "Guard Duty",
      "Security Hub",
      "ACM",
      "AWS Config",
      "CloudTrail",
    ],
  },
  {
    title: "Containerization & Orchestration",
    skills: ["Docker", "Kubernetes", "Amazon EKS", "Helm"],
  },
  {
    title: "Infrastructure as Code (IaC)",
    skills: ["Terraform", "AWS CloudFormation"],
  },
  {
    title: "Monitoring & Observability",
    skills: [
      "Amazon CloudWatch",
      "Prometheus",
      "Grafana",
      "Dynatrace",
      "Node Exporter",
      "Alert manager",
      "PromQL",
    ],
  },
  {
    title: "Configuration Management",
    skills: ["Ansible"],
  },
  {
    title: "Version Control & CI/CD",
    skills: ["Git", "GitHub", "GitLab", "Jenkins", "GitHub Actions", "AWS Code Pipeline"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "PostgreSQL"],
  },
  {
    title: "Operating Systems",
    skills: ["Linux", "Ubuntu", "Amazon Linux"],
  },
  {
    title: "Methodologies",
    skills: [
      "DevOps",
      "IaC",
      "GitOps",
      "CI/CD Automation",
      "SRE",
      "Cloud Security",
      "Disaster Recovery & Backup",
      "AWS Well-Architected Framework",
      "Technical Documentation & Runbooks",
    ],
  },
];

export const experienceData: ExperienceItem = {
  role: "AWS Cloud Operations Engineer",
  company: "Tata Consultancy Services (TCS)",
  location: "Hyderabad",
  duration: "June 2024 – June 2026",
  highlights: [
    "Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.",
    "Automated provisioning and configuration of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.",
    "Integrated Jenkins CI/CD pipelines with the monitoring stack to validate application health post-deployment, trigger automated alerts on failed builds, and accelerate release cycles from weekly to daily.",
    "Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics; configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules for continuous infrastructure and application monitoring.",
    "Developed interactive Grafana dashboards using PromQL queries to visualize infrastructure performance, server availability, application health, and resource utilization.",
    "Integrated Alertmanager with email and Slack notifications for automated alerting on CPU, memory, disk, and service downtime; tuned alert thresholds, grouping, and deduplication policies to reduce alert fatigue and improve incident response efficiency.",
    "Monitored AWS EC2 instances, Linux servers, and Docker containers to improve operational visibility and system reliability; performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues by analyzing Prometheus target status and logs.",
    "Applied AWS Well-Architected Framework best practices across the Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence pillars when designing and reviewing monitoring and cloud infrastructure solutions.",
    "Authored and maintained technical documentation, dashboard guides, operational runbooks, and standard operating procedures (SOPs) for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.",
    "Collaborated with DevOps, Cloud Operations, and application teams to implement monitoring standards and support production incident management through faster root cause analysis and reduced Mean Time to Detect (MTTD).",
  ],
};

export const keyAchievements: AchievementItem[] = [
  {
    metric: "Weekly → Daily",
    title: "Release Acceleration",
    description:
      "Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.",
  },
  {
    metric: "80% Reduction",
    title: "IaC Provisioning Speed",
    description:
      "Accelerated infrastructure delivery with reusable Infrastructure as Code (IaC) templates, reducing provisioning time by 80%.",
  },
  {
    metric: "0 Critical Issues",
    title: "Cloud Governance & Security",
    description:
      "Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access, resulting in zero critical security findings.",
  },
];

export const certificationsList: CertificateItem[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    code: "SAA-C03",
    issuer: "Amazon Web Services",
    year: "2026",
    icon: "☁️",
  },
  {
    name: "AWS Certified CloudOps Engineer – Associate",
    code: "SOA-C03",
    issuer: "Amazon Web Services",
    year: "2026",
    icon: "⚡",
  },
];

export const educationData: EducationItem = {
  degree: "B.Sc. Computer Science",
  institution: "Sri Aditya Degree College",
  university: "Ambedkar University",
  location: "Srikakulam, Andhra Pradesh",
  duration: "June 2020 – August 2023",
  percentage: "77.40%",
};

export const footerContent = {
  taglines: [
    "AWS Cloud Operations Engineer",
    "Terraform · Prometheus · Grafana · Jenkins · Docker · Kubernetes",
    "Reliable, Scalable & Secure Cloud Infrastructure",
  ],
  credential: "B.Sc. Computer Science · 77.40%",
  copyright: `© ${new Date().getFullYear()} Saivinod Kotipalli | AWS Cloud Operations Engineer`,
};

export const emailjsConfig = {
  serviceId: (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "service_default",
  templateId: (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "template_default",
  publicKey: (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "user_public_key",
};
