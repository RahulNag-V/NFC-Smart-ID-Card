import studentPhoto from '../assets/student-photo.png';

export interface StudentProfile {
  fullName: string;
  usn: string;
  studentId: string;
  branch: string;
  department: string;
  section: string;
  semester: string;
  academicYear: string;
  enrollmentStatus: 'ACTIVE' | 'GRADUATED' | 'ON LEAVE';
  degree: string;
  curriculum: string;
  photoUrl: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  issueDate: string;
  validThru: string;
  college: {
    name: string;
    code: string;
    tagline: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    affiliations: string;
    accreditation: string;
    website: string;
    phone: string;
    email: string;
  };
  verification: {
    status: 'VERIFIED & ACTIVE';
    verifiedBy: string;
    verificationCode: string;
    hash: string;
    verificationUrl: string;
    lastVerified: string;
  };
}

export const defaultStudentData: StudentProfile = {
  fullName: 'Rahul Nag V',
  usn: '1BH24CS051',
  studentId: '1BH24CS051',
  branch: 'Computer Science and Engineering (CSE)',
  department: 'Computer Science and Engineering (CSE)',
  section: 'A',
  semester: 'V Semester (Pursuing)',
  academicYear: '2024–2028',
  enrollmentStatus: 'ACTIVE',
  degree: 'Bachelor of Engineering (B.E.)',
  curriculum: 'Choice Based Credit System (CBCS Scheme)',
  photoUrl: studentPhoto,
  bloodGroup: 'O+',
  dateOfBirth: '01 August 2006',
  gender: 'Male',
  phone: '+91 98446 16699',
  email: 'rahulnagv.dev@gmail.com',
  currentAddress: 'Campus Residence, Phase-2, Outer Ring Road, Bengaluru, Karnataka - 560064',
  permanentAddress: 'No. 1127, Masidikere, B. Kanaboor, Narasimharajapura, Chikkamagaluru, Karnataka - 577112, India',
  issueDate: '01 Oct 2024',
  validThru: '31 Sep 2028',
  college: {
    name: 'BANGALORE TECHNOLOGICAL INSTITUTE',
    code: 'BTI-051',
    tagline: 'Commitment to Organised Totality • Engineering Excellence',
    address: 'Off Sarjapur Road, Kodathi, near Wipro Corporate Office, Dinne, Chikkanayakanahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560035',
    affiliations: 'Affiliated to Visvesvaraya Technological University (VTU)',
    accreditation: 'Approved by AICTE • Recognized by Govt. of Karnataka',
    website: 'https://rahulnagv-24cs051.web.app',
    phone: '+91 80 2844 1950 / 1951',
    email: 'registrar@bti.ac.in',
  },
  verification: {
    status: 'VERIFIED & ACTIVE',
    verifiedBy: 'Office of the Registrar & Academic Council',
    verificationCode: 'VRF-24CS051-99A7',
    hash: '0x7e8b91c1...24cs051',
    verificationUrl: 'https://rahulnagv-24cs051.web.app/#verify',
    lastVerified: 'Academic Year 2024-2028 Validated',
  },
};

// Helper privacy masking functions
export function maskPhone(phone: string, isVisible: boolean): string {
  if (isVisible) return phone;
  const parts = phone.split(' ');
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} •••••`;
  }
  return phone.slice(0, 6) + ' •••••';
}

export function maskEmail(email: string, isVisible: boolean): string {
  if (isVisible) return email;
  const [user, domain] = email.split('@');
  if (!user || !domain) return '••••••••@••••.com';
  const maskedUser = user.length > 2 ? `${user[0]}••••••${user[user.length - 1]}` : '••••';
  return `${maskedUser}@${domain}`;
}

export function maskAddress(address: string, isVisible: boolean): string {
  if (isVisible) return address;
  const segments = address.split(',');
  if (segments.length > 2) {
    return `${segments[segments.length - 2].trim()}, ${segments[segments.length - 1].trim()} (Full address protected)`;
  }
  return 'Bengaluru, Karnataka (Full address protected by privacy toggle)';
}

export function maskBloodGroup(blood: string, isVisible: boolean): string {
  if (isVisible) return blood;
  return '•• (Protected)';
}
