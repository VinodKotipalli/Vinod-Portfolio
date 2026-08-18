import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  personalInfo as initialPersonalInfo,
  heroContent as initialHeroContent,
  aboutContent as initialAboutContent,
  skillsContent as initialSkillsContent,
  technicalSkills as initialTechnicalSkills,
  contentCreation as initialContentCreation,
  leadershipList as initialLeadershipList,
  internshipsList as initialInternshipsList,
  softSkillsList as initialSoftSkillsList,
  projects as initialProjects,
  certificates as initialCertificates,
  education as initialEducation,
  footerContent as initialFooterContent,
  socialLinks as initialSocialLinks,
  Project,
  CertificateItem,
  InternshipItem,
  LeadershipItemData,
  SoftSkillItem,
  ContentCategory,
} from '../data/portfolioData';

export interface PortfolioFullData {
  personalInfo: typeof initialPersonalInfo;
  heroContent: typeof initialHeroContent;
  aboutContent: typeof initialAboutContent;
  skillsContent: typeof initialSkillsContent;
  technicalSkills: typeof initialTechnicalSkills;
  contentCreation: typeof initialContentCreation;
  leadershipList: LeadershipItemData[];
  internshipsList: InternshipItem[];
  softSkillsList: SoftSkillItem[];
  projects: Project[];
  certificates: typeof initialCertificates;
  education: typeof initialEducation;
  footerContent: typeof initialFooterContent;
  socialLinks: typeof initialSocialLinks;
}

const defaultFullData: PortfolioFullData = {
  personalInfo: initialPersonalInfo,
  heroContent: initialHeroContent,
  aboutContent: initialAboutContent,
  skillsContent: initialSkillsContent,
  technicalSkills: initialTechnicalSkills,
  contentCreation: initialContentCreation,
  leadershipList: initialLeadershipList,
  internshipsList: initialInternshipsList,
  softSkillsList: initialSoftSkillsList,
  projects: initialProjects,
  certificates: initialCertificates,
  education: initialEducation,
  footerContent: initialFooterContent,
  socialLinks: initialSocialLinks,
};

const STORAGE_KEY = 'saivinod_portfolio_admin_data_v3';

interface PortfolioContextType {
  data: PortfolioFullData;

  // Personal & Hero
  updatePersonalInfo: (data: Partial<typeof initialPersonalInfo>) => void;
  updateHeroContent: (data: Partial<typeof initialHeroContent>) => void;
  updateAboutContent: (data: Partial<typeof initialAboutContent>) => void;
  updateSocialLinks: (data: Partial<typeof initialSocialLinks>) => void;

  // Projects CRUD
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  clearProjects: () => void;

  // Skills CRUD
  updateSkillCategoryTitle: (catIndex: number, newTitle: string) => void;
  addSkillCategory: (title: string) => void;
  deleteSkillCategory: (catIndex: number) => void;
  addSkill: (catIndex: number, skill: { name: string; level: number }) => void;
  updateSkill: (catIndex: number, skillIndex: number, skill: { name: string; level: number }) => void;
  deleteSkill: (catIndex: number, skillIndex: number) => void;
  clearSkills: () => void;

  // Experience / Internships CRUD
  addInternship: (item: InternshipItem) => void;
  updateInternship: (index: number, item: InternshipItem) => void;
  deleteInternship: (index: number) => void;
  clearInternships: () => void;

  // Certificates CRUD
  addCertificate: (item: CertificateItem) => void;
  updateCertificate: (index: number, item: CertificateItem) => void;
  deleteCertificate: (index: number) => void;
  clearCertificates: () => void;

  // Leadership CRUD
  addLeadership: (item: LeadershipItemData) => void;
  updateLeadership: (index: number, item: LeadershipItemData) => void;
  deleteLeadership: (index: number) => void;
  clearLeadership: () => void;

  // Content Creation CRUD
  addContentCategory: (item: ContentCategory) => void;
  updateContentCategory: (index: number, item: ContentCategory) => void;
  deleteContentCategory: (index: number) => void;
  clearContentCreation: () => void;

  // Soft Skills CRUD
  addSoftSkill: (item: SoftSkillItem) => void;
  updateSoftSkill: (index: number, item: SoftSkillItem) => void;
  deleteSoftSkill: (index: number) => void;
  clearSoftSkills: () => void;

  // Backup, Reset & Clear
  resetAllToDefault: () => void;
  resetSection: (section: keyof PortfolioFullData) => void;
  clearSection: (section: keyof PortfolioFullData) => void;
  importJSON: (jsonString: string) => boolean;
  exportJSON: () => string;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioFullData>(() => {
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

    // Debounced or direct sync to Firestore
    const docRef = doc(db, 'portfolio', 'main');
    setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true }).catch((err) => {
      console.warn('Firestore sync warning:', err);
    });
  }, [data]);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const docRef = doc(db, 'portfolio', 'main');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          if (remoteData) {
            const { updatedAt, ...cleanData } = remoteData;
            setData((prev) => ({ ...prev, ...cleanData }));
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'portfolio/main');
      }
    );
    return () => unsubscribe();
  }, []);

  // Updaters
  const updatePersonalInfo = (info: Partial<typeof initialPersonalInfo>) => {
    setData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...info } }));
  };

  const updateHeroContent = (hero: Partial<typeof initialHeroContent>) => {
    setData((prev) => ({ ...prev, heroContent: { ...prev.heroContent, ...hero } }));
  };

  const updateAboutContent = (about: Partial<typeof initialAboutContent>) => {
    setData((prev) => ({ ...prev, aboutContent: { ...prev.aboutContent, ...about } }));
  };

  const updateSocialLinks = (links: Partial<typeof initialSocialLinks>) => {
    setData((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, ...links } }));
  };

  // Projects CRUD
  const addProject = (proj: Omit<Project, 'id'>) => {
    const id = `proj_${Date.now()}`;
    const newProject: Project = { ...proj, id };
    setData((prev) => ({ ...prev, projects: [newProject, ...prev.projects] }));
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const clearProjects = () => {
    setData((prev) => ({ ...prev, projects: [] }));
  };

  // Skills CRUD
  const updateSkillCategoryTitle = (catIndex: number, newTitle: string) => {
    setData((prev) => {
      const categories = [...prev.technicalSkills.categories];
      if (categories[catIndex]) {
        categories[catIndex] = { ...categories[catIndex], title: newTitle };
      }
      return { ...prev, technicalSkills: { ...prev.technicalSkills, categories } };
    });
  };

  const addSkillCategory = (title: string) => {
    setData((prev) => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        categories: [...prev.technicalSkills.categories, { title, skills: [] }],
      },
    }));
  };

  const deleteSkillCategory = (catIndex: number) => {
    setData((prev) => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        categories: prev.technicalSkills.categories.filter((_, i) => i !== catIndex),
      },
    }));
  };

  const addSkill = (catIndex: number, skill: { name: string; level: number }) => {
    setData((prev) => {
      const categories = [...prev.technicalSkills.categories];
      if (categories[catIndex]) {
        categories[catIndex] = {
          ...categories[catIndex],
          skills: [...categories[catIndex].skills, skill],
        };
      }
      return { ...prev, technicalSkills: { ...prev.technicalSkills, categories } };
    });
  };

  const updateSkill = (catIndex: number, skillIndex: number, skill: { name: string; level: number }) => {
    setData((prev) => {
      const categories = [...prev.technicalSkills.categories];
      if (categories[catIndex] && categories[catIndex].skills[skillIndex]) {
        const skills = [...categories[catIndex].skills];
        skills[skillIndex] = skill;
        categories[catIndex] = { ...categories[catIndex], skills };
      }
      return { ...prev, technicalSkills: { ...prev.technicalSkills, categories } };
    });
  };

  const deleteSkill = (catIndex: number, skillIndex: number) => {
    setData((prev) => {
      const categories = [...prev.technicalSkills.categories];
      if (categories[catIndex]) {
        const skills = categories[catIndex].skills.filter((_, i) => i !== skillIndex);
        categories[catIndex] = { ...categories[catIndex], skills };
      }
      return { ...prev, technicalSkills: { ...prev.technicalSkills, categories } };
    });
  };

  const clearSkills = () => {
    setData((prev) => ({
      ...prev,
      technicalSkills: { categories: [] },
    }));
  };

  // Experience / Internships CRUD
  const addInternship = (item: InternshipItem) => {
    setData((prev) => ({ ...prev, internshipsList: [item, ...prev.internshipsList] }));
  };

  const updateInternship = (index: number, item: InternshipItem) => {
    setData((prev) => {
      const list = [...prev.internshipsList];
      list[index] = item;
      return { ...prev, internshipsList: list };
    });
  };

  const deleteInternship = (index: number) => {
    setData((prev) => ({
      ...prev,
      internshipsList: prev.internshipsList.filter((_, i) => i !== index),
    }));
  };

  const clearInternships = () => {
    setData((prev) => ({ ...prev, internshipsList: [] }));
  };

  // Certificates CRUD
  const addCertificate = (item: CertificateItem) => {
    setData((prev) => ({
      ...prev,
      certificates: {
        ...prev.certificates,
        featured: [item, ...prev.certificates.featured],
      },
    }));
  };

  const updateCertificate = (index: number, item: CertificateItem) => {
    setData((prev) => {
      const featured = [...prev.certificates.featured];
      featured[index] = item;
      return { ...prev, certificates: { ...prev.certificates, featured } };
    });
  };

  const deleteCertificate = (index: number) => {
    setData((prev) => ({
      ...prev,
      certificates: {
        ...prev.certificates,
        featured: prev.certificates.featured.filter((_, i) => i !== index),
      },
    }));
  };

  const clearCertificates = () => {
    setData((prev) => ({
      ...prev,
      certificates: { ...prev.certificates, featured: [] },
    }));
  };

  // Leadership CRUD
  const addLeadership = (item: LeadershipItemData) => {
    setData((prev) => ({ ...prev, leadershipList: [item, ...prev.leadershipList] }));
  };

  const updateLeadership = (index: number, item: LeadershipItemData) => {
    setData((prev) => {
      const list = [...prev.leadershipList];
      list[index] = item;
      return { ...prev, leadershipList: list };
    });
  };

  const deleteLeadership = (index: number) => {
    setData((prev) => ({
      ...prev,
      leadershipList: prev.leadershipList.filter((_, i) => i !== index),
    }));
  };

  const clearLeadership = () => {
    setData((prev) => ({ ...prev, leadershipList: [] }));
  };

  // Content Creation CRUD
  const addContentCategory = (item: ContentCategory) => {
    setData((prev) => ({
      ...prev,
      contentCreation: {
        ...prev.contentCreation,
        categories: [item, ...prev.contentCreation.categories],
      },
    }));
  };

  const updateContentCategory = (index: number, item: ContentCategory) => {
    setData((prev) => {
      const categories = [...prev.contentCreation.categories];
      categories[index] = item;
      return {
        ...prev,
        contentCreation: { ...prev.contentCreation, categories },
      };
    });
  };

  const deleteContentCategory = (index: number) => {
    setData((prev) => ({
      ...prev,
      contentCreation: {
        ...prev.contentCreation,
        categories: prev.contentCreation.categories.filter((_, i) => i !== index),
      },
    }));
  };

  const clearContentCreation = () => {
    setData((prev) => ({
      ...prev,
      contentCreation: { ...prev.contentCreation, categories: [] },
    }));
  };

  // Soft Skills CRUD
  const addSoftSkill = (item: SoftSkillItem) => {
    setData((prev) => ({ ...prev, softSkillsList: [item, ...prev.softSkillsList] }));
  };

  const updateSoftSkill = (index: number, item: SoftSkillItem) => {
    setData((prev) => {
      const list = [...prev.softSkillsList];
      list[index] = item;
      return { ...prev, softSkillsList: list };
    });
  };

  const deleteSoftSkill = (index: number) => {
    setData((prev) => ({
      ...prev,
      softSkillsList: prev.softSkillsList.filter((_, i) => i !== index),
    }));
  };

  const clearSoftSkills = () => {
    setData((prev) => ({ ...prev, softSkillsList: [] }));
  };

  // Resets & Clears
  const resetAllToDefault = () => {
    setData(defaultFullData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetSection = (section: keyof PortfolioFullData) => {
    setData((prev) => ({
      ...prev,
      [section]: defaultFullData[section],
    }));
  };

  const clearSection = (section: keyof PortfolioFullData) => {
    if (Array.isArray(defaultFullData[section])) {
      setData((prev) => ({ ...prev, [section]: [] }));
    } else if (section === 'technicalSkills') {
      clearSkills();
    } else if (section === 'certificates') {
      clearCertificates();
    } else if (section === 'contentCreation') {
      clearContentCreation();
    }
  };

  // Export / Import
  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        setData({ ...defaultFullData, ...parsed });
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updatePersonalInfo,
        updateHeroContent,
        updateAboutContent,
        updateSocialLinks,
        addProject,
        updateProject,
        deleteProject,
        clearProjects,
        updateSkillCategoryTitle,
        addSkillCategory,
        deleteSkillCategory,
        addSkill,
        updateSkill,
        deleteSkill,
        clearSkills,
        addInternship,
        updateInternship,
        deleteInternship,
        clearInternships,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        clearCertificates,
        addLeadership,
        updateLeadership,
        deleteLeadership,
        clearLeadership,
        addContentCategory,
        updateContentCategory,
        deleteContentCategory,
        clearContentCreation,
        addSoftSkill,
        updateSoftSkill,
        deleteSoftSkill,
        clearSoftSkills,
        resetAllToDefault,
        resetSection,
        clearSection,
        importJSON,
        exportJSON,
      }}
    >
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
