export interface PersonalInfo {
   name: string;
   role: string;
   bio: string;
   aboutMe: string;
   email: string;
   phone: string;
   location: string;
   linkedin: string;
   github: string;
   image: string;
}

export interface ExperienceItem {
   role: string;
   company: string;
   location: string;
   period: string;
   description: string[];
   technologies: string[];
}

export interface EducationItem {
   institution: string;
   degree: string;
   period: string;
   location: string;
}

export interface CertificateItem {
   title: string;
   organization: string;
   date: string;
   credentialId?: string;
   credentialUrl?: string;
   skills?: string[];
}


export interface ResumeData {
   personalInfo: PersonalInfo;
   experience: ExperienceItem[];
   education: EducationItem[];
   certificates: CertificateItem[];
   skills: SkillCategory[];
}

export interface EducationProps {
   items: EducationItem[];
}

export interface CertificatesProps {
   items: CertificateItem[];
}

export interface ExperienceProps {
   items: ExperienceItem[];
}


export interface SkillCategory {
   id: string;
   title: string;
   priority: number;
   variant: "primary" | "secondary";
   items: string[];
}

export interface SkillsProps {
   categories: SkillCategory[];
}
export interface AboutProps {
   content: string;
}

export interface ResumeHeroProps {
   name: string;
   role: string;
   bio: string;
   image: string;
   email: string;
   location: string;
}
