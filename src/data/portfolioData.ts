// ============================================================
// portfolioData.ts — Accurate configuration for Saivinod Kotipalli
// Strictly aligned with the AWS Cloud Operations Engineer resume.
// ============================================================

export interface CertificateItem {
  name: string;
  code: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  year: string;
  icon: string;
  skills?: string[];
  description?: string;
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

export interface ProjectItem {
  title: string;
  subtitle?: string;
  category: string;
  technologies: string[];
  description: string;
  highlights: string[];
  architectureLayers?: {
    tier: string;
    description: string;
  }[];
}

export const personalInfo = {
  name: "Saivinod Kotipalli",
  firstName: "Saivinod",
  brandName: "Saivinod Kotipalli",
  title: "AWS Cloud Operations Engineer | Site Reliability & DevOps",
  location: "Srikakulam, Andhra Pradesh 532401",
  phone: "+91 8520899337",
  phoneRaw: "8520899337",
  whatsappUrl: "https://wa.me/918520899337",
  email: "saivinodkotipalli2003@gmail.com",
  emails: {
    primary: "saivinodkotipalli2003@gmail.com",
  },
  summary:
    "AWS Cloud Operations Engineer with 2+ years of experience across cloud monitoring, infrastructure automation, and site reliability engineering (SRE) on AWS. Skilled in Infrastructure as Code (Terraform, AWS CloudFormation), CI/CD automation (Jenkins, GitHub Actions, AWS CodePipeline), and centralized observability using Prometheus, Grafana, Node Exporter, and Alertmanager. Experienced monitoring EC2 instances, Linux servers, Docker containers, and Kubernetes/EKS workloads; building Grafana dashboards with PromQL; and automating Slack and email alerting to reduce Mean Time to Detect (MTTD). Proficient in Linux administration, AWS core services (EC2, IAM, VPC, CloudWatch), and applying the AWS Well-Architected Framework to improve reliability, security, performance, and cost optimization. Strong track record in technical documentation, incident response, and cross-functional collaboration.",
  resumeUrl: "/Saivinod_Kotipalli_Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/VinodKotipalli",
  linkedin: "https://www.linkedin.com/in/saivinod-kotipalli-960aa61a0",
  instagram: "https://instagram.com/saivinod.kotipalli",
  whatsapp: "https://wa.me/918520899337",
};

export const heroContent = {
  greeting: "Hi, I'm Saivinod Kotipalli",
  titleHighlight: "AWS Cloud Operations Engineer",
  subtitle:
    "AWS Cloud Operations Engineer with 2+ years of experience across cloud monitoring, infrastructure automation, and site reliability engineering (SRE) on AWS.",
  ctaPrimary: { text: "View Experience", href: "#experience" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:saivinodkotipalli2003@gmail.com?subject=Opportunity Inquiry – Saivinod Kotipalli&body=Hello Saivinod,%0D%0A%0D%0AI reviewed your AWS Cloud Operations Engineer profile and would like to discuss an opportunity.%0D%0A%0D%0ABest Regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Saivinod_Kotipalli_Resume.pdf" },
};

export const technicalSkillsCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Python", "Java", "Bash", "Shell Scripting"],
  },
  {
    title: "AWS Compute & Storage",
    skills: ["EC2", "S3", "Lambda", "RDS", "ECR", "EKS", "Auto Scaling", "SNS", "CloudWatch"],
  },
  {
    title: "AWS Networking",
    skills: [
      "VPC",
      "Subnets",
      "Route 53",
      "ALB/NLB/CLB",
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
      "KMS",
      "Secrets Manager",
      "Security Groups",
      "NACLs",
      "WAF",
      "Shield",
      "GuardDuty",
      "Security Hub",
      "ACM",
      "AWS Config",
      "CloudTrail",
    ],
  },
  {
    title: "Containers & Orchestration",
    skills: ["Docker", "Kubernetes", "Amazon EKS", "Helm"],
  },
  {
    title: "Infrastructure as Code",
    skills: ["Terraform", "AWS CloudFormation", "Ansible"],
  },
  {
    title: "Monitoring & Observability",
    skills: [
      "CloudWatch",
      "Prometheus",
      "Grafana",
      "Dynatrace",
      "Node Exporter",
      "Alertmanager",
      "PromQL",
    ],
  },
  {
    title: "CI/CD & Version Control",
    skills: ["Git", "GitHub", "GitLab", "Jenkins", "GitHub Actions", "AWS CodePipeline"],
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
  duration: "June 2024 – Present",
  highlights: [
    "Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.",
    "Automated provisioning of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.",
    "Integrated Jenkins CI/CD pipelines with the monitoring stack to validate post-deployment application health and trigger automated alerts on failed builds, accelerating release cycles from weekly to daily.",
    "Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics; configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules.",
    "Developed interactive Grafana dashboards using PromQL to visualize infrastructure performance, server availability, application health, and resource utilization.",
    "Integrated Alertmanager with email and Slack for automated alerting on CPU, memory, disk, and service downtime; tuned thresholds, grouping, and deduplication to reduce alert fatigue and improve incident response.",
    "Monitored AWS EC2 instances, Linux servers, and Docker containers to improve operational visibility and reliability; performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues.",
    "Applied AWS Well-Architected Framework best practices across Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence pillars in monitoring and infrastructure design.",
    "Authored technical documentation, dashboard guides, operational runbooks, and SOPs for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.",
    "Collaborated with DevOps, Cloud Operations, and application teams to implement monitoring standards and support incident management through faster root cause analysis and reduced MTTD.",
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
      "Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access — resulting in zero critical security findings.",
  },
];

export const certificationsList: CertificateItem[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    code: "SAA-C03",
    issuer: "Amazon Web Services",
    issueDate: "2026",
    year: "2026",
    icon: "☁️",
    skills: ["AWS Well-Architected Framework", "VPC & High Availability", "Security & Resilience", "Cost Optimization"],
    description:
      "Validates expertise in designing secure, high-performing, resilient, and cost-optimized architectures on Amazon Web Services.",
  },
  {
    name: "AWS Certified CloudOps Engineer – Associate",
    code: "SOA-C03",
    issuer: "Amazon Web Services",
    issueDate: "2026",
    year: "2026",
    icon: "⚙️",
    skills: ["Cloud Operations & Monitoring", "Systems Administration & Patching", "Reliability & Business Continuity", "Automated Remediation"],
    description:
      "Validates technical expertise in deploying, managing, monitoring, and operating scalable, highly available systems and workloads on AWS.",
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

export const projectsList: ProjectItem[] = [
  {
    title: "01 — AWS Multi-Tier Infrastructure with Terraform",
    subtitle: "Enterprise 3-Tier Cloud Architecture & Automated Infrastructure as Code",
    category: "Cloud Infrastructure & IaC",
    technologies: [
      "Terraform",
      "AWS",
      "VPC",
      "EC2",
      "Application Load Balancer",
      "Amazon RDS",
      "Auto Scaling",
      "IAM",
      "Security Groups",
      "Linux",
    ],
    description:
      "Designed and automated a scalable, highly available three-tier cloud infrastructure on AWS using reusable Terraform modules. The architecture isolates presentation, application logic, and persistence layers across multiple Availability Zones with dedicated public/private subnets, automated load balancing, Auto Scaling, and centralized security controls.",
    highlights: [
      "Automated complete AWS infrastructure provisioning using modular, reusable Terraform configurations.",
      "Configured custom VPC architecture with public subnets, private application subnets, database subnets, Internet Gateways, and NAT Gateways across multiple AZs.",
      "Implemented Application Load Balancers (ALBs) with health check target groups, SSL/TLS termination, and path-based routing rules.",
      "Deployed Launch Templates and Auto Scaling Groups (ASG) ensuring elastic scaling and self-healing compute capacity.",
      "Configured Multi-AZ Amazon RDS PostgreSQL database tier with automated snapshots, KMS encryption at rest, and automated failover.",
      "Enforced least-privilege IAM policies, security group ingress/egress isolation, and secure Bastion host access.",
    ],
  },
  {
    title: "02 — Amazon EKS Kubernetes Deployment Platform",
    subtitle: "Production Container Orchestration, Microservices & Elastic Pod Autoscaling",
    category: "Containerization & Orchestration",
    technologies: [
      "Amazon EKS",
      "Kubernetes",
      "Docker",
      "Helm",
      "Amazon ECR",
      "HPA",
      "IRSA",
      "CoreDNS",
      "Linux",
    ],
    description:
      "Architected and deployed a resilient Kubernetes container platform on Amazon EKS for running microservices workloads. Containerized applications with Docker, packaged deployment manifests into Helm charts, and configured autoscaling policies with secure IAM Roles for Service Accounts (IRSA).",
    highlights: [
      "Provisioned Amazon EKS control plane and managed EC2 worker node groups using infrastructure-as-code.",
      "Containerized backend and frontend microservices using multi-stage Docker builds optimized for minimal image footprint.",
      "Created standardized Helm charts managing Kubernetes Deployments, Services, ConfigMaps, Secrets, and Ingress resources.",
      "Configured Horizontal Pod Autoscaler (HPA) to dynamically scale pods based on CPU and memory utilization thresholds.",
      "Configured Kubernetes liveness and readiness health probes enabling self-healing and zero-downtime rolling updates.",
      "Implemented IAM Roles for Service Accounts (IRSA) granting fine-grained AWS permissions directly to Kubernetes pods.",
    ],
  },
  {
    title: "03 — GitHub Actions CI/CD Automation",
    subtitle: "End-to-End Automated Build, Security Scan & GitOps Deployment Pipeline",
    category: "CI/CD & DevOps Automation",
    technologies: [
      "GitHub Actions",
      "Docker",
      "Amazon ECR",
      "Helm",
      "Trivy",
      "GitOps",
      "Bash",
      "AWS CLI",
    ],
    description:
      "Engineered an automated end-to-end continuous integration and continuous deployment (CI/CD) pipeline using GitHub Actions. The pipeline automates code validation, container security scans, artifact publishing to Amazon ECR, and automated deployments to Kubernetes clusters with rollback safeguards.",
    highlights: [
      "Constructed multi-stage GitHub Actions workflows triggered on pull requests and branch merges.",
      "Integrated automated code linting, unit testing, and static container image vulnerability scanning with Trivy.",
      "Automated Docker container builds, semantic version tagging, and secure publishing to Amazon Elastic Container Registry (ECR).",
      "Automated zero-downtime Helm upgrades and rolling releases on target Kubernetes environments upon merge.",
      "Configured automated deployment verification and post-deployment health check validation with automated rollback triggers.",
      "Secured pipeline credentials using GitHub Encrypted Secrets, OpenID Connect (OIDC), and least-privilege IAM roles.",
    ],
  },
  {
    title: "04 — Terraform Remote State & Multi-Environment Automation",
    subtitle: "Enterprise State Management, S3 Locking, KMS Encryption & Environment Workspaces",
    category: "Infrastructure as Code (IaC)",
    technologies: [
      "Terraform",
      "Amazon S3",
      "DynamoDB",
      "AWS KMS",
      "Terraform Workspaces",
      "IAM",
      "Bash",
    ],
    description:
      "Implemented a secure, centralized remote state management architecture for Terraform with state locking and multi-environment isolation (Dev, Staging, Production). Prevented concurrent execution conflicts and enforced cryptographic security for infrastructure state files.",
    highlights: [
      "Configured Amazon S3 remote state backend with versioning, server-side encryption via AWS KMS, and public access blocks.",
      "Implemented DynamoDB state locking table preventing simultaneous state modifications and race conditions during team deployments.",
      "Structured multi-environment parameterization using Terraform Workspaces and environment-specific `.tfvars` variable files.",
      "Built standardized, modular infrastructure components with strict input type constraints and validation rules.",
      "Automated `terraform fmt`, `terraform validate`, and drift detection checks within automated workflow steps.",
      "Enforced strict IAM bucket policies ensuring only authorized automation roles and administrators can access state objects.",
    ],
  },
  {
    title: "05 — AWS Observability with Prometheus & Grafana",
    subtitle: "Real-Time Telemetry, Cluster Health Dashboards & Alertmanager Notification System",
    category: "Monitoring & Observability",
    technologies: [
      "Prometheus",
      "Grafana",
      "Amazon CloudWatch",
      "Alertmanager",
      "Node Exporter",
      "kube-state-metrics",
      "PromQL",
      "Slack Webhooks",
    ],
    description:
      "Deployed a full-stack observability and monitoring platform on AWS using Prometheus, Grafana, and Alertmanager. Provided deep visibility into Kubernetes workloads, node resource saturation, application request rates, latency distributions, and automated operational alerts.",
    highlights: [
      "Deployed Prometheus server, kube-state-metrics, and Node Exporters to collect cluster and infrastructure telemetry.",
      "Designed dynamic Grafana dashboards visualizing CPU/Memory utilization, pod restart frequencies, network throughput, and response latency.",
      "Constructed custom PromQL alerting rules tracking SLA breaches, elevated error rates, and resource bottlenecks.",
      "Configured Alertmanager dispatch routing to send prioritized notification alerts to Slack channels and incident responder emails.",
      "Integrated Amazon CloudWatch Logs and CloudWatch Alarms for comprehensive AWS managed service monitoring.",
      "Significantly improved system observability, reducing Mean Time to Detect (MTTD) and Mean Time to Resolve (MTTR).",
    ],
  },
];

export const footerContent = {
  futureQuotes: [
    {
      heading: "Architecting Tomorrow",
      caption: "The best way to predict the future is to engineer it with precision and resilience.",
    },
    {
      heading: "Limitless Scalability",
      caption: "Driven by curiosity, building high-availability cloud platforms for the next generation.",
    },
    {
      heading: "Continuous Evolution",
      caption: "Always learning, automating, and deploying solutions that empower tomorrow.",
    },
  ],
  taglines: [
    "Architecting the Cloud of Tomorrow",
    "Turning bold visions into resilient, automated systems.",
    "Engineered for scale · Built for the future",
  ],
  credential: "The future belongs to those who build with purpose.",
  copyright: `© ${new Date().getFullYear()} Saivinod Kotipalli | AWS Cloud Operations Engineer`,
};

export const emailjsConfig = {
  serviceId: (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "service_default",
  templateId: (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "template_default",
  publicKey: (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "user_public_key",
};
