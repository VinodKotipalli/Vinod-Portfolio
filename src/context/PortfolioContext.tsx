import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  personalInfo as initialPersonalInfo,
  heroContent as initialHeroContent,
  technicalSkillsCategories as initialSkillsCategories,
  experienceData as initialExperienceData,
  keyAchievements as initialKeyAchievements,
  certificationsList as initialCertificationsList,
  educationData as initialEducationData,
  footerContent as initialFooterContent,
  socialLinks as initialSocialLinks,
  SkillCategory,
  ExperienceItem,
  AchievementItem,
  CertificateItem,
  EducationItem,
} from '../data/portfolioData';

export interface PortfolioFullData {
  personalInfo: typeof initialPersonalInfo;
  heroContent: typeof initialHeroContent;
  technicalSkills: SkillCategory[];
  experience: ExperienceItem;
  achievements: AchievementItem[];
  certificates: CertificateItem[];
  education: EducationItem;
  footerContent: typeof initialFooterContent;
  socialLinks: typeof initialSocialLinks;
}

const defaultFullData: PortfolioFullData = {
  personalInfo: initialPersonalInfo,
  heroContent: initialHeroContent,
  technicalSkills: initialSkillsCategories,
  experience: initialExperienceData,
  achievements: initialKeyAchievements,
  certificates: initialCertificationsList,
  education: initialEducationData,
  footerContent: initialFooterContent,
  socialLinks: initialSocialLinks,
};

const STORAGE_KEY = 'saivinod_portfolio_data_v6';

interface PortfolioContextType {
  data: PortfolioFullData;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data] = useState<PortfolioFullData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultFullData, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage', e);
    }
    return defaultFullData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data to localStorage', e);
    }
  }, [data]);

  return (
    <PortfolioContext.Provider value={{ data }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
