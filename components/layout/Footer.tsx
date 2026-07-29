import React from "react";
import resumeData from "@/data/resume.json";

const Footer = () => {
   const { name, github, linkedin, email } = resumeData.personalInfo;

   return (
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 px-6 print:hidden bg-white dark:bg-black transition-colors">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">
               © {new Date().getFullYear()} {name}. Built with clean code.
            </div>

            <div className="flex gap-6">
               <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary text-sm transition-colors"
               >
                  GitHub
               </a>
               <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary text-sm transition-colors"
               >
                  LinkedIn
               </a>
               <a
                  href={`mailto:${email}`}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary text-sm transition-colors"
               >
                  Email
               </a>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
