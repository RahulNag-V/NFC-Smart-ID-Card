export type ProjectCategory =
  | 'Full-Stack Development · Event Management'
  | 'Web Development · Education'
  | 'Cybersecurity · Machine Learning'
  | 'Artificial Intelligence · Medical Imaging'
  | 'Web Development · Developer Tools'
  | 'Web Development · Travel & Booking'
  | 'Hardware & Cloud · Systems Architecture';

export type FilterCategory =
  | 'All'
  | 'Full-Stack'
  | 'AI / ML'
  | 'Cybersecurity'
  | 'Web Apps';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  filterCategories: FilterCategory[];
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  badgeColor: string;
  gradient: 'vintage' | 'kraft' | 'orange' | 'gray' | 'purple' | 'green';
  visualType: 'scanner' | 'apex' | 'netsentinel' | 'brain' | 'omniqr' | 'trails' | 'nfc';
  featured?: boolean;
}

export const allProjects: Project[] = [
  {
    id: 'admitto-scanner',
    title: 'ADMITTO Scanner',
    category: 'Full-Stack Development · Event Management',
    filterCategories: ['Full-Stack', 'Web Apps'],
    description:
      'A smart event management and attendance tracking system that uses QR codes and barcodes to validate tickets, manage check-ins, and support offline synchronization.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Express', 'Vitest'],
    githubUrl: 'https://github.com/RahulNag-V/ADMITTO.Scanner',
    liveUrl: 'https://rahulnag-v.github.io/ADMITTO.Scanner/',
    badgeColor: '#10B981',
    gradient: 'green',
    visualType: 'scanner',
    featured: true,
  },
  {
    id: 'brain-tumor-segmentation',
    title: 'Adaptive Self-Distillation 3D Segmentation',
    category: 'Artificial Intelligence · Medical Imaging',
    filterCategories: ['AI / ML'],
    description:
      'A deep learning research framework using 3D UNETR Vision Transformers and online self-distillation to investigate highly effective brain tumor segmentation from multi-modal MRI scans on the BraTS benchmark.',
    technologies: ['Python', 'PyTorch', 'MONAI', '3D UNETR', 'NiBabel', 'CUDA', 'Vision Transformers'],
    githubUrl: 'https://github.com/RahulNag-V/Adaptive-Self-Distillation-3D-Brain-Tumor-Segmentation',
    badgeColor: '#7c3aed',
    gradient: 'purple',
    visualType: 'brain',
    featured: true,
  },
  {
    id: 'netsentinel',
    title: 'NetSentinel',
    category: 'Cybersecurity · Machine Learning',
    filterCategories: ['Cybersecurity', 'AI / ML'],
    description:
      'A network traffic analysis system that combines an Isolation Forest machine learning anomaly model with strict security rule engines to parse raw PCAP files and detect suspicious network threats.',
    technologies: ['Python', 'FastAPI', 'scikit-learn', 'Scapy', 'SQLite', 'React', 'Tailwind CSS', 'Recharts'],
    githubUrl: 'https://github.com/RahulNag-V/NetSentinel',
    badgeColor: '#b91c1c',
    gradient: 'vintage',
    visualType: 'netsentinel',
    featured: true,
  },
  {
    id: 'omniqr-studio',
    title: 'OmniQR Studio',
    category: 'Web Development · Developer Tools',
    filterCategories: ['Web Apps'],
    description:
      'A minimal, high-performance QR code generator built with Burgundy Elegance styling, enabling users to generate and customize QR codes across URLs, media, files, Wi-Fi, and vCard 3.0 contacts.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API', 'QRCode Engine', 'vCard 3.0', 'Firebase Hosting'],
    githubUrl: 'https://github.com/RahulNag-V/QR-Code-Generator',
    liveUrl: 'https://omniqr-studio.web.app/',
    badgeColor: '#991b1b',
    gradient: 'vintage',
    visualType: 'omniqr',
  },
  {
    id: 'apex-challenge-engine',
    title: 'APEX Challenge Engine',
    category: 'Web Development · Education',
    filterCategories: ['Web Apps'],
    description:
      'An interactive browser-based aptitude challenge platform designed with combo multipliers, timed question rounds, SVG diagrams, and real-time score tracking to train problem-solving skills.',
    technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Web Audio API', 'Canvas Effects', 'LocalStorage'],
    githubUrl: 'https://github.com/RahulNag-V/APEX--AptitudeChallengeEngine.github.io',
    liveUrl: 'https://rahulnag-v.github.io/APEX--AptitudeChallengeEngine.github.io/',
    badgeColor: '#704a29',
    gradient: 'kraft',
    visualType: 'apex',
  },
  {
    id: 'smart-nfc-systems',
    title: 'Smart NFC Identity Gateway',
    category: 'Hardware & Cloud · Systems Architecture',
    filterCategories: ['Full-Stack', 'Web Apps'],
    description:
      'Programmable contactless NFC smart cards and dynamic cloud routing gateway delivering tactile physical-to-digital profile sharing without rewriting physical tags.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Firebase Hosting', 'NFC Hardware'],
    githubUrl: 'https://github.com/RahulNag-V',
    liveUrl: 'https://rahulnagv-24cs051.web.app',
    badgeColor: '#a67c52',
    gradient: 'kraft',
    visualType: 'nfc',
  },
  {
    id: 'infinitetrails',
    title: 'Infinite Trails',
    category: 'Web Development · Travel & Booking',
    filterCategories: ['Web Apps'],
    description:
      'An interactive travel exploration and tour booking platform built for Codecircuit Hackathon 2025, featuring destination curation, custom itineraries, and passenger booking scheduling.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'Hackathon 2025'],
    githubUrl: 'https://github.com/RahulNag-V/InfiniteTrails-travelling-Web',
    liveUrl: 'https://rahulnag-v.github.io/InfiniteTrails-travelling-Web/',
    badgeColor: '#10B981',
    gradient: 'green',
    visualType: 'trails',
  },
];
