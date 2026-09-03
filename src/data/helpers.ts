import { Helper } from '../types';

export const helpers: Helper[] = [
  {
    id: 'h1', name: 'Lakshmi Devi', nameHi: 'लक्ष्मी देवी', age: 42, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Experienced all-rounder maid with a knack for managing large households.', bioHi: 'बड़े घरों के प्रबंधन में निपुण अनुभवी ऑल-राउंडर मेड।',
    experience: 12, languages: ['Hindi', 'English'], skills: ['Cleaning', 'Cooking', 'Laundry'],
    rating: 4.8, reviewCount: 145, hourlyRate: 200, monthlySalary: 12000,
    workPreference: ['hourly', 'part-time', 'full-time'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s1', 's2', 's3', 's8']
  },
  {
    id: 'h2', name: 'Ramesh Kumar', nameHi: 'रमेश कुमार', age: 35, gender: 'male',
    photo: '/placeholder-avatar.jpg',
    bio: 'Professional cook specializing in North Indian and Chinese cuisines.', bioHi: 'उत्तर भारतीय और चीनी व्यंजनों में विशेषज्ञ पेशेवर रसोइया।',
    experience: 8, languages: ['Hindi'], skills: ['Cooking', 'Menu Planning', 'Grocery Shopping'],
    rating: 4.9, reviewCount: 89, hourlyRate: 300, monthlySalary: 18000,
    workPreference: ['full-time', 'live-in'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s1', 's10']
  },
  {
    id: 'h3', name: 'Sunita Sharma', nameHi: 'सुनीता शर्मा', age: 28, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Caring babysitter with early childhood education background.', bioHi: 'प्रारंभिक बचपन की शिक्षा पृष्ठभूमि के साथ देखभाल करने वाली बेबीसिटर।',
    experience: 4, languages: ['Hindi', 'English', 'Marathi'], skills: ['Childcare', 'First Aid', 'Tutoring'],
    rating: 4.7, reviewCount: 56, hourlyRate: 250, monthlySalary: 15000,
    workPreference: ['hourly', 'part-time'], availability: 'busy',
    verified: true, policeVerified: false, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s4']
  },
  {
    id: 'h4', name: 'Kamala Rao', nameHi: 'कमला राव', age: 50, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Specialized in elderly care with immense patience and medical basics.', bioHi: 'अत्यधिक धैर्य और बुनियादी चिकित्सा ज्ञान के साथ बुजुर्गों की देखभाल में विशेषज्ञ।',
    experience: 15, languages: ['Telugu', 'Hindi', 'English'], skills: ['Elderly Care', 'Medication Management', 'Mobility Assistance'],
    rating: 4.9, reviewCount: 210, hourlyRate: 350, monthlySalary: 22000,
    workPreference: ['full-time', 'live-in'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s5', 's9']
  },
  {
    id: 'h5', name: 'Suresh Patil', nameHi: 'सुरेश पाटिल', age: 30, gender: 'male',
    photo: '/placeholder-avatar.jpg',
    bio: 'Expert in deep cleaning and home maintenance.', bioHi: 'डीप क्लीनिंग और घर के रखरखाव में विशेषज्ञ।',
    experience: 6, languages: ['Marathi', 'Hindi'], skills: ['Deep Cleaning', 'Organizing'],
    rating: 4.5, reviewCount: 112, hourlyRate: 250, monthlySalary: 14000,
    workPreference: ['hourly'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s2', 's6']
  },
  {
    id: 'h6', name: 'Pooja Singh', nameHi: 'पूजा सिंह', age: 25, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Quick and efficient with cleaning and utensils.', bioHi: 'सफाई और बर्तन धोने में तेज और कुशल।',
    experience: 3, languages: ['Hindi'], skills: ['Cleaning', 'Utensil Washing', 'Laundry'],
    rating: 4.3, reviewCount: 45, hourlyRate: 150, monthlySalary: 9000,
    workPreference: ['hourly', 'part-time'], availability: 'available',
    verified: true, policeVerified: false, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s2', 's3', 's7']
  },
  {
    id: 'h7', name: 'Anita Desai', nameHi: 'अनीता देसाई', age: 38, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Reliable maid with excellent cooking skills.', bioHi: 'उत्कृष्ट खाना पकाने के कौशल के साथ विश्वसनीय मेड।',
    experience: 10, languages: ['Gujarati', 'Hindi'], skills: ['Cooking', 'Cleaning'],
    rating: 4.8, reviewCount: 178, hourlyRate: 220, monthlySalary: 13000,
    workPreference: ['part-time', 'full-time'], availability: 'on-leave',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s1', 's2', 's8']
  },
  {
    id: 'h8', name: 'Manish Tiwari', nameHi: 'मनीष तिवारी', age: 45, gender: 'male',
    photo: '/placeholder-avatar.jpg',
    bio: 'Professional chef for events and daily cooking.', bioHi: 'कार्यक्रमों और दैनिक खाना पकाने के लिए पेशेवर शेफ।',
    experience: 20, languages: ['Hindi', 'English'], skills: ['Multi-cuisine Cooking', 'Baking'],
    rating: 5.0, reviewCount: 320, hourlyRate: 500, monthlySalary: 30000,
    workPreference: ['hourly', 'full-time'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s1', 's10']
  },
  {
    id: 'h9', name: 'Rekha Mishra', nameHi: 'रेखा मिश्रा', age: 33, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Dedicated to elderly care and companionship.', bioHi: 'बुजुर्गों की देखभाल और साथ देने के लिए समर्पित।',
    experience: 7, languages: ['Hindi', 'Bhojpuri'], skills: ['Elderly Care', 'Cooking'],
    rating: 4.6, reviewCount: 95, hourlyRate: 200, monthlySalary: 16000,
    workPreference: ['live-in'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s5', 's9']
  },
  {
    id: 'h10', name: 'Sarita Jha', nameHi: 'सरिता झा', age: 29, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Expert in baby massage and infant care.', bioHi: 'बेबी मसाज और शिशु देखभाल में विशेषज्ञ।',
    experience: 5, languages: ['Hindi'], skills: ['Infant Care', 'Baby Massage'],
    rating: 4.9, reviewCount: 134, hourlyRate: 300, monthlySalary: 18000,
    workPreference: ['part-time'], availability: 'available',
    verified: true, policeVerified: false, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s4']
  },
  {
    id: 'h11', name: 'Vijay Yadav', nameHi: 'विजय यादव', age: 27, gender: 'male',
    photo: '/placeholder-avatar.jpg',
    bio: 'Hardworking cleaner for deep cleaning tasks.', bioHi: 'डीप क्लीनिंग कार्यों के लिए मेहनती क्लीनर।',
    experience: 4, languages: ['Hindi'], skills: ['Deep Cleaning', 'Sanitization'],
    rating: 4.4, reviewCount: 67, hourlyRate: 200, monthlySalary: 12000,
    workPreference: ['hourly'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s6']
  },
  {
    id: 'h12', name: 'Bhavna Patel', nameHi: 'भावना पटेल', age: 36, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Fast and reliable laundry and ironing expert.', bioHi: 'तेज और विश्वसनीय कपड़े धोने और इस्त्री करने की विशेषज्ञ।',
    experience: 9, languages: ['Gujarati', 'Hindi'], skills: ['Ironing', 'Laundry'],
    rating: 4.7, reviewCount: 156, hourlyRate: 180, monthlySalary: 11000,
    workPreference: ['hourly', 'part-time'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s7']
  },
  {
    id: 'h13', name: 'Gita Rani', nameHi: 'गीता रानी', age: 55, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'Experienced nanny, loves kids like her own.', bioHi: 'अनुभवी आया, बच्चों को अपनों की तरह प्यार करती है।',
    experience: 25, languages: ['Hindi', 'Punjabi'], skills: ['Childcare', 'Cooking'],
    rating: 5.0, reviewCount: 412, hourlyRate: 400, monthlySalary: 25000,
    workPreference: ['full-time'], availability: 'busy',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s4', 's8']
  },
  {
    id: 'h14', name: 'Amit Chhetri', nameHi: 'अमित छेत्री', age: 24, gender: 'male',
    photo: '/placeholder-avatar.jpg',
    bio: 'Energetic and polite, great for daily cleaning.', bioHi: 'ऊर्जावान और विनम्र, दैनिक सफाई के लिए बढ़िया।',
    experience: 2, languages: ['Hindi', 'Nepali'], skills: ['Cleaning', 'Utensil Washing'],
    rating: 4.2, reviewCount: 34, hourlyRate: 150, monthlySalary: 10000,
    workPreference: ['hourly'], availability: 'available',
    verified: true, policeVerified: false, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s2', 's3']
  },
  {
    id: 'h15', name: 'Kavita Das', nameHi: 'कविता दास', age: 31, gender: 'female',
    photo: '/placeholder-avatar.jpg',
    bio: 'All-rounder maid with a pleasant personality.', bioHi: 'सुखद व्यक्तित्व वाली ऑल-राउंडर मेड।',
    experience: 6, languages: ['Bengali', 'Hindi'], skills: ['Cleaning', 'Cooking', 'Elderly Care'],
    rating: 4.6, reviewCount: 88, hourlyRate: 200, monthlySalary: 14000,
    workPreference: ['live-in'], availability: 'available',
    verified: true, policeVerified: true, aadhaarVerified: true, vaccinated: true,
    city: 'Bhilai', area: 'Risali Sector', serviceIds: ['s8', 's9', 's5']
  }
];
