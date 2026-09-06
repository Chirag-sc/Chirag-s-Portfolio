export interface Credential {
  id: string;
  title: string;
  issuer: string;
  kind: 'Certification' | 'Job simulation';
  date?: string;
  image?: string;
  verificationUrl?: string;
}
export const portfolio = {
  name: 'Chirag S',
  role: 'Software Engineer',
  discipline: 'AI & Data Science',
  location: 'Mangalore, Karnataka, India',
  email: 'chiragsubhash269@gmail.com',
  resume: '/resume-chirag-s.pdf',
  github: 'https://github.com/Chirag-sc',
  linkedin: 'https://linkedin.com/in/chirag-s-150168356',
  intro: 'I build intelligent software. And keep looking up.',
  about:
    'I’m a software engineer and AI & Data Science graduate based in Mangalore, India. I build web and mobile applications, connect thoughtful interfaces to secure backends, and turn data into useful intelligence.',
  aboutMore:
    'From full stack platforms to physics-aware computer vision, I’m interested in products where software engineering and AI meet real-world problems.',
  projects: [
    {
      id: 'black-hole-ai',
      number: '01',
      title: 'BLACK HOLE AI',
      subtitle: 'Reading the universe, one image at a time.',
      category: 'COMPUTER VISION / ASTRONOMY',
      status: 'In development',
      description:
        'A physics-aware astronomy AI platform combining black hole image analysis, deterministic physics, and evidence-grounded AI.',
      tags: ['Python', 'NumPy', 'Pydantic', 'Computer Vision'],
      details: [
        {
          title: 'Measure before you infer.',
          text: 'CPU-first computer vision extracts centroid, radial profiles, ring geometry, asymmetry, and orientation.',
        },
        {
          title: 'Grounded in evidence.',
          text: 'Core CV schemas and utilities validated with 122 unit tests. Datasets include EHT GRMHD, M87*, and Sgr A*.',
        },
      ],
    },
    {
      id: 'acad-sync',
      number: '02',
      title: 'ACAD-SYNC',
      subtitle: 'One connected academic experience.',
      category: 'FULL STACK / EDUCATION',
      status: null,
      description:
        'An academic management platform bringing Students, Parents, and Teachers into connected, role-based workflows.',
      tags: ['MongoDB', 'Mongoose', 'JWT', 'Excel'],
      details: [
        {
          title: 'A shared foundation.',
          text: 'JWT authentication, attendance, courses, announcements, and uploads, backed by MongoDB/Mongoose and role-based access.',
        },
        {
          title: 'From spreadsheets to clarity.',
          text: 'Excel-based processing extracts student-specific academic records and generates personalized parent reports.',
        },
      ],
    },
  ],
  experience: {
    company: 'MINDMATRIX',
    role: 'Generative AI Intern',
    location: 'Bangalore',
    dates: 'March–May 2026',
    details: [
      'Developed and shipped Android application features using Kotlin and Jetpack Compose across a three-month internship.',
      'Integrated Google AI Studio and Generative AI tooling into intelligent application workflows.',
      'Connected Firebase Authentication, Firestore, and real-time database capabilities for secure, persistent, cloud-connected experiences.',
      'Contributed across feature development, AI integration, debugging, and deployment.',
    ],
  },
  skills: [
    {
      title: 'Languages',
      items: ['JavaScript', 'Python', 'SQL', 'C', 'Kotlin'],
    },
    { title: 'Frontend / Mobile', items: ['React.js', 'Jetpack Compose'] },
    {
      title: 'Backend / Databases',
      items: [
        'Node.js',
        'Express.js',
        'REST APIs',
        'MongoDB',
        'MySQL',
        'Firebase',
        'Firestore',
      ],
    },
    {
      title: 'AI / Data',
      items: [
        'TensorFlow',
        'NumPy',
        'Pydantic',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'Neural Networks',
        'RAG',
        'Generative AI',
      ],
    },
    {
      title: 'Tools',
      items: [
        'Git',
        'GitHub',
        'Docker',
        'Postman',
        'Google AI Studio',
        'VS Code',
        'Oracle',
      ],
    },
  ],
  education: {
    degree: 'B.E. in Artificial Intelligence & Data Science',
    school: 'Srinivas Institute of Technology',
    dates: 'September 2022–June 2026',
    score: 'CGPA 7.2',
  },
};
export const credentials: Credential[] = [
  {
    id: 'oracle-agentic',
    title: 'Agentic AI Foundations Associate',
    issuer: 'Oracle',
    kind: 'Certification',
  },
  {
    id: 'ibm-tensorflow',
    title: 'Deep Learning with TensorFlow',
    issuer: 'IBM',
    kind: 'Certification',
  },
  {
    id: 'jpmorgan-software',
    title: 'Software Engineering Job Simulation',
    issuer: 'JPMorgan Chase & Co.',
    kind: 'Job simulation',
  },
  {
    id: 'tata-genai',
    title: 'GenAI-Powered Data Analytics Simulation',
    issuer: 'Tata Group',
    kind: 'Job simulation',
  },
  {
    id: 'aws-architecture',
    title: 'Solutions Architecture Job Simulation',
    issuer: 'AWS',
    kind: 'Job simulation',
  },
];
