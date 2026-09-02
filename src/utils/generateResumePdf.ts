import { jsPDF } from 'jspdf';

export function createResumePdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const marginX = 36;
  const pageWidth = 612;
  const contentWidth = pageWidth - marginX * 2; // 540 pt
  let y = 36;

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 25, 35);
  doc.text('SAIVINOD KOTIPALLI', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Title
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 50, 65);
  doc.text('AWS Cloud Operations Engineer | Site Reliability & DevOps', pageWidth / 2, y, { align: 'center' });
  y += 13;

  // Contact Info
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 75, 85);
  doc.text(
    'Srikakulam, Andhra Pradesh 532401 | +91 8520899337 | saivinodkotipalli2003@gmail.com',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 14;

  const drawSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), marginX, y);
    y += 2.5;
    doc.setDrawColor(20, 25, 35);
    doc.setLineWidth(0.75);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 9.5;
  };

  // 1. PROFESSIONAL SUMMARY
  drawSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);
  const summaryText =
    'AWS Cloud Operations Engineer with 2+ years of experience across cloud monitoring, infrastructure automation, and site reliability engineering (SRE) on AWS. Skilled in Infrastructure as Code (Terraform, AWS CloudFormation), CI/CD automation (Jenkins, GitHub Actions, AWS CodePipeline), and centralized observability using Prometheus, Grafana, Node Exporter, and Alertmanager. Experienced monitoring EC2 instances, Linux servers, Docker containers, and Kubernetes/EKS workloads; building Grafana dashboards with PromQL; and automating Slack and email alerting to reduce Mean Time to Detect (MTTD). Proficient in Linux administration, AWS core services (EC2, IAM, VPC, CloudWatch), and applying the AWS Well-Architected Framework to improve reliability, security, performance, and cost optimization. Strong track record in technical documentation, incident response, and cross-functional collaboration.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, marginX, y, { lineHeightFactor: 1.14 });
  y += summaryLines.length * 9.5 + 5;

  // 2. TECHNICAL SKILLS
  drawSectionHeader('Technical Skills');
  const skillsList = [
    { cat: 'Languages', val: 'Python, Java, Bash, Shell Scripting' },
    { cat: 'AWS Compute & Storage', val: 'EC2, S3, Lambda, RDS, ECR, EKS, Auto Scaling, SNS, CloudWatch' },
    { cat: 'AWS Networking', val: 'VPC, Subnets, Route 53, ALB/NLB/CLB, NAT Gateway, Internet Gateway, VPC Peering, CloudFront, Direct Connect' },
    { cat: 'AWS Security', val: 'IAM, KMS, Secrets Manager, Security Groups, NACLs, WAF, Shield, GuardDuty, Security Hub, ACM, AWS Config, CloudTrail' },
    { cat: 'Containers & Orchestration', val: 'Docker, Kubernetes, Amazon EKS, Helm' },
    { cat: 'Infrastructure as Code', val: 'Terraform, AWS CloudFormation, Ansible' },
    { cat: 'Monitoring & Observability', val: 'CloudWatch, Prometheus, Grafana, Dynatrace, Node Exporter, Alertmanager, PromQL' },
    { cat: 'CI/CD & Version Control', val: 'Git, GitHub, GitLab, Jenkins, GitHub Actions, AWS CodePipeline' },
    { cat: 'Databases', val: 'MySQL, PostgreSQL' },
    { cat: 'Operating Systems', val: 'Linux, Ubuntu, Amazon Linux' },
    { cat: 'Methodologies', val: 'DevOps, IaC, GitOps, CI/CD Automation, SRE, Cloud Security, Disaster Recovery & Backup, AWS Well-Architected Framework, Technical Documentation & Runbooks' },
  ];

  skillsList.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(20, 25, 35);
    const prefix = `${s.cat}: `;
    const prefixWidth = doc.getTextWidth(prefix);
    
    // Render first line with bold prefix
    doc.text(prefix, marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    
    // Render text with word wrap
    const valLines = doc.splitTextToSize(s.val, contentWidth - prefixWidth);
    doc.text(valLines[0], marginX + prefixWidth, y);
    
    if (valLines.length > 1) {
      for (let i = 1; i < valLines.length; i++) {
        y += 9.2;
        doc.text(valLines[i], marginX + 12, y);
      }
    }
    y += 9.3;
  });
  y += 3.5;

  // 3. PROFESSIONAL EXPERIENCE
  drawSectionHeader('Professional Experience');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(15, 23, 42);
  doc.text('AWS Cloud Operations Engineer — Tata Consultancy Services (TCS), Hyderabad', marginX, y);
  y += 9.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(60, 70, 85);
  doc.text('June 2024 – Present', marginX, y);
  y += 9.5;

  const expBullets = [
    'Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.',
    'Automated provisioning of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.',
    'Integrated Jenkins CI/CD pipelines with the monitoring stack to validate post-deployment application health and trigger automated alerts on failed builds, accelerating release cycles from weekly to daily.',
    'Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics; configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules.',
    'Developed interactive Grafana dashboards using PromQL to visualize infrastructure performance, server availability, application health, and resource utilization.',
    'Integrated Alertmanager with email and Slack for automated alerting on CPU, memory, disk, and service downtime; tuned thresholds, grouping, and deduplication to reduce alert fatigue and improve incident response.',
    'Monitored AWS EC2 instances, Linux servers, and Docker containers to improve operational visibility and reliability; performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues.',
    'Applied AWS Well-Architected Framework best practices across Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence pillars in monitoring and infrastructure design.',
    'Authored technical documentation, dashboard guides, operational runbooks, and SOPs for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.',
    'Collaborated with DevOps, Cloud Operations, and application teams to implement monitoring standards and support incident management through faster root cause analysis and reduced MTTD.'
  ];

  expBullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(30, 41, 59);
    doc.text('•', marginX + 2, y);
    const lines = doc.splitTextToSize(bullet, contentWidth - 14);
    doc.text(lines, marginX + 10, y, { lineHeightFactor: 1.12 });
    y += lines.length * 8.8 + 1.4;
  });
  y += 2.5;

  // 4. KEY ACHIEVEMENTS
  drawSectionHeader('Key Achievements');
  const achievements = [
    'Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.',
    'Accelerated infrastructure delivery with reusable Infrastructure as Code (IaC) templates, reducing provisioning time by 80%.',
    'Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access — resulting in zero critical security findings.'
  ];

  achievements.forEach((ach) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(30, 41, 59);
    doc.text('•', marginX + 2, y);
    const lines = doc.splitTextToSize(ach, contentWidth - 14);
    doc.text(lines, marginX + 10, y, { lineHeightFactor: 1.12 });
    y += lines.length * 8.8 + 1.4;
  });
  y += 2.5;

  // 5. CERTIFICATIONS
  drawSectionHeader('Certifications');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(30, 41, 59);
  doc.text('AWS Certified Solutions Architect – Associate (SAA-C03), Amazon Web Services, 2026', marginX, y);
  y += 9.2;
  doc.text('AWS Certified CloudOps Engineer – Associate (SOA-C03), Amazon Web Services, 2026', marginX, y);
  y += 10.5;

  // 6. EDUCATION
  drawSectionHeader('Education');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(20, 25, 35);
  const degTitle = 'B.Sc. Computer Science';
  doc.text(degTitle, marginX, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 55, 72);
  doc.text(
    ' — Sri Aditya Degree College, Ambedkar University, Srikakulam, Andhra Pradesh',
    marginX + doc.getTextWidth(degTitle),
    y
  );
  y += 9.2;
  doc.text('June 2020 – August 2023 | Percentage: 77.40%', marginX, y);

  return doc;
}

export function downloadResumePdf(filename = 'Saivinod_Kotipalli_Resume.pdf') {
  const doc = createResumePdfDoc();
  doc.save(filename);
}
