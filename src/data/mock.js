import {
  Zap, Snowflake, Sparkles, Stethoscope, Car, Briefcase, GraduationCap, Dog, Utensils, Hammer,
  Droplet, Wind, Tv, Package, Wrench, CarTaxiFront, Truck, Paintbrush, Trees, Scissors, Home,
  Shield, HeartPulse, Building, BookOpen, HardHat
} from 'lucide-react';

export const STATUS_META = {
  pending:     { label: 'Finding a provider',    color: 'var(--amber)' },
  assigned:    { label: 'Awaiting confirmation', color: 'var(--amber)' },
  confirmed:   { label: 'Confirmed',             color: 'var(--teal)' },
  in_progress: { label: 'In progress',           color: 'var(--coral)' },
  completed:   { label: 'Completed',             color: 'var(--green)' },
  cancelled:   { label: 'Cancelled',             color: '#94A099' },
};

export const CATEGORIES_TIER1 = [
  { id: 'cat-1',  name: 'Quick Repairs & Fixes',           icon: Zap,            emoji: '⚡', color: '#38138c', desc: 'Electrician, Plumber, Carpenter, Glass, Welding' },
  { id: 'cat-2',  name: 'Appliance Care & Repairs',        icon: Snowflake,      emoji: '❄️', color: '#006688', desc: 'AC, Fridge, Washing Machine, TV, Electronics' },
  { id: 'cat-3',  name: 'Cleaning & Pest Control',         icon: Sparkles,       emoji: '🧹', color: '#705d00', desc: 'Home Deep Clean, Bathroom, Tanks, Pest' },
  { id: 'cat-4',  name: 'Health & Medical Care',            icon: Stethoscope,    emoji: '🩺', color: '#ba1a1a', desc: 'Doctors, Nursing, Therapy, Ambulance' },
  { id: 'cat-5',  name: 'Auto & Vehicle Care',             icon: Car,            emoji: '🚗', color: '#004b65', desc: 'Breakdown, Wash, Mechanic, Drivers' },
  { id: 'cat-6',  name: 'Professional & Business Services',icon: Briefcase,      emoji: '💼', color: '#4f32a3', desc: 'Legal, Accounting, IT, Marketing' },
  { id: 'cat-7',  name: 'Tutors & Consultancies',          icon: GraduationCap,  emoji: '🎓', color: '#654aba', desc: 'Home Tutors, Job Consultancies, Education' },
  { id: 'cat-8',  name: 'Pet & Animal Care',               icon: Dog,            emoji: '🐾', color: '#c9a800', desc: 'Veterinary, Pet Grooming, Boarding' },
  { id: 'cat-9',  name: 'Food & Daily Supplies',           icon: Utensils,       emoji: '🥗', color: '#3f8f5f', desc: 'Catering, Dairy, Meat, Vegetables' },
  { id: 'cat-10', name: 'Construction & Home Makeover',    icon: Hammer,         emoji: '🛠️', color: '#e2583e', desc: 'Painting, Masonry, Interiors, Tiles' },
];

export const SERVICES = [
  // 1. Quick Repairs & Fixes
  { id: 101, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'Switchboard Fix & Repair', icon: Zap, price: 249, skill: 'Electrical', desc: 'Wiring, switch replacements and socket troubleshooting.', bookings: '0' },
  { id: 102, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'Fan Fitting & Repair', icon: Zap, price: 299, skill: 'Electrical', desc: 'Ceiling and exhaust fan installation and capacitor fix.', bookings: '0' },
  { id: 103, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'Light Fitting Installation', icon: Zap, price: 199, skill: 'Electrical', desc: 'LED tube light, chandelier, and decorative light setup.', bookings: '0' },
  { id: 104, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'Complete Wiring Inspection', icon: Zap, price: 499, skill: 'Electrical', desc: 'Full home electrical safety audit and MCB breaker check.', bookings: '0' },
  { id: 105, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Tap Leak Repair', icon: Wrench, price: 199, skill: 'Plumbing', desc: 'Tap washer replacement, thread sealing, and nozzle fix.', bookings: '0' },
  { id: 106, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Pipe Line Works', icon: Wrench, price: 399, skill: 'Plumbing', desc: 'CPVC/PVC pipe joining, line extension, and valve fitting.', bookings: '0' },
  { id: 107, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Drain Unblocking', icon: Wrench, price: 449, skill: 'Plumbing', desc: 'Kitchen sink and bathroom drainage unclogging.', bookings: '0' },
  { id: 108, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Flush Tank Repair', icon: Wrench, price: 349, skill: 'Plumbing', desc: 'Syphon kit replacement, inlet valve repair, and leak fix.', bookings: '0' },
  { id: 109, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Lock Repair & Replacement', icon: Hammer, price: 299, skill: 'Carpentry', desc: 'Main door lock, latch, and mortise handle fitting.', bookings: '0' },
  { id: 110, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Hinges & Door Repair', icon: Hammer, price: 349, skill: 'Carpentry', desc: 'Door alignment, hydraulic hinge fixing, and planed doors.', bookings: '0' },
  { id: 111, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Furniture Assembly', icon: Hammer, price: 499, skill: 'Carpentry', desc: 'Bed, table, wardrobe assembly and woodwork fixing.', bookings: '0' },
  { id: 112, category: 'Quick Repairs & Fixes', subCategory: 'Specialized', name: 'Glass & Window Works', icon: Hammer, price: 549, skill: 'Glass Works', desc: 'Window pane replacement, toughened glass, and mirror fitting.', bookings: '0' },

  // 2. Appliance Care & Repairs
  { id: 201, category: 'Appliance Care & Repairs', subCategory: 'Cooling', name: 'AC Jet Service & Wash', icon: Wind, price: 599, skill: 'Appliance Repair', desc: 'High-pressure jet pump filter wash and coil cleaning.', bookings: '0' },
  { id: 202, category: 'Appliance Care & Repairs', subCategory: 'Cooling', name: 'AC Gas Refilling', icon: Wind, price: 1499, skill: 'Appliance Repair', desc: 'R32 / R410 refrigerant gas charging and leak testing.', bookings: '0' },
  { id: 203, category: 'Appliance Care & Repairs', subCategory: 'Cooling', name: 'Fridge Repair (All Brands)', icon: Snowflake, price: 449, skill: 'Appliance Repair', desc: 'Thermostat, compressor relay, and cooling troubleshooting.', bookings: '0' },
  { id: 204, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'RO Water Purifier Service', icon: Droplet, price: 399, skill: 'Appliance Repair', desc: 'Filter replacement, membrane check, and TDS tuning.', bookings: '0' },
  { id: 205, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'Gas Stove & Chimney Service', icon: Package, price: 349, skill: 'Appliance Repair', desc: 'Burner cleaning, auto-ignition repair, and chimney ducting.', bookings: '0' },
  { id: 206, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'Microwave & OTG Repair', icon: Package, price: 349, skill: 'Appliance Repair', desc: 'Magnetron replacement, turntable fix, and heating issue.', bookings: '0' },
  { id: 207, category: 'Appliance Care & Repairs', subCategory: 'Laundry & Home', name: 'Washing Machine Repair', icon: Droplet, price: 499, skill: 'Appliance Repair', desc: 'Front-load and top-load drum, motor, and PCB repair.', bookings: '0' },
  { id: 208, category: 'Appliance Care & Repairs', subCategory: 'Laundry & Home', name: 'Water Heater / Geyser Repair', icon: Droplet, price: 399, skill: 'Appliance Repair', desc: 'Heating element replacement, thermostat, and safety valve.', bookings: '0' },
  { id: 209, category: 'Appliance Care & Repairs', subCategory: 'Entertainment & Electronics', name: 'LED TV Repair & Wall Mount', icon: Tv, price: 499, skill: 'Appliance Repair', desc: 'Display panel, backlight, motherboard, and bracket installation.', bookings: '0' },

  // 3. Cleaning & Pest Control
  { id: 301, category: 'Cleaning & Pest Control', subCategory: 'Full House & Spot', name: 'Bathroom Deep Cleaning', icon: Sparkles, price: 499, skill: 'House Cleaning', desc: 'Tile de-scaling, hard water stain removal, and sanitization.', bookings: '0' },
  { id: 302, category: 'Cleaning & Pest Control', subCategory: 'Full House & Spot', name: 'Kitchen Deep Cleaning', icon: Sparkles, price: 699, skill: 'House Cleaning', desc: 'Oil stain degreasing, cabinet wiping, and sink scrubbing.', bookings: '0' },
  { id: 303, category: 'Cleaning & Pest Control', subCategory: 'Full House & Spot', name: 'Sofa & Upholstery Cleaning', icon: Sparkles, price: 799, skill: 'House Cleaning', desc: 'Vacuuming, injection-extraction shampoo wash for 5-seater.', bookings: '0' },
  { id: 304, category: 'Cleaning & Pest Control', subCategory: 'Utility Cleaning', name: 'Water Tank Cleaning', icon: Sparkles, price: 599, skill: 'Tank Cleaning', desc: 'Sludge removal, high-pressure washing, and UV disinfection.', bookings: '0' },
  { id: 306, category: 'Cleaning & Pest Control', subCategory: 'Sanitizations', name: 'Pest Control Spray (Cockroach/Termite)', icon: Sparkles, price: 899, skill: 'Pest Control', desc: 'Odourless herbalgel and chemical spray with 6-month warranty.', bookings: '0' },

  // 4. Health & Medical Care
  { id: 401, category: 'Health & Medical Care', subCategory: 'At-Home Care', name: 'Certified Nurse & Injection Care', icon: Stethoscope, price: 299, skill: 'Nursing', desc: 'Dressing, IV fluid setup, catheter, and vital monitoring.', bookings: '0' },
  { id: 402, category: 'Health & Medical Care', subCategory: 'At-Home Care', name: 'Homeo & Ayurveda Therapy', icon: Stethoscope, price: 399, skill: 'Ayurveda', desc: 'Traditional Kerala consultation and therapeutic massage.', bookings: '0' },
  { id: 403, category: 'Health & Medical Care', subCategory: 'Consultations', name: 'Doctor Home Visit', icon: Stethoscope, price: 799, skill: 'Doctor', desc: 'General physician home consultation and prescription.', bookings: '0' },

  // 5. Auto & Vehicle Care
  { id: 501, category: 'Auto & Vehicle Care', subCategory: 'Emergency Breakdown', name: 'Towing & Recovery Van', icon: Car, price: 999, skill: 'Towing', desc: 'Flatbed towing and breakdown recovery for cars & bikes.', bookings: '0' },
  { id: 502, category: 'Auto & Vehicle Care', subCategory: 'Emergency Breakdown', name: 'Tyre Puncture Repair (On-Site)', icon: Car, price: 249, skill: 'Mechanic', desc: 'Tubeless puncture plug and air refill at your location.', bookings: '0' },
  { id: 504, category: 'Auto & Vehicle Care', subCategory: 'Routine Care', name: 'Foam Car Wash & Detailing', icon: Car, price: 499, skill: 'Car Wash', desc: 'Exterior foam wash, interior vacuuming, and dashboard polish.', bookings: '0' },
  { id: 505, category: 'Auto & Vehicle Care', subCategory: 'Transport', name: 'On-Demand Personal Driver', icon: Car, price: 499, skill: 'Driver', desc: 'Experienced verified drivers for manual & automatic vehicles.', bookings: '0' },

  // 6. Professional & Business Services
  { id: 601, category: 'Professional & Business Services', subCategory: 'Documentation', name: 'Digital Signature (DSC) Creation', icon: Briefcase, price: 499, skill: 'Documentation', desc: 'Class 3 USB token digital signature for tenders and GST.', bookings: '0' },
  { id: 602, category: 'Professional & Business Services', subCategory: 'Financial & Legal', name: 'Chartered Accountant Consultation', icon: Briefcase, price: 999, skill: 'Accounting', desc: 'ITR filing, GST registration, audit, and tax planning.', bookings: '0' },
  { id: 603, category: 'Professional & Business Services', subCategory: 'IT & Digital', name: 'Website Design & Software', icon: Briefcase, price: 2499, skill: 'IT Services', desc: 'Responsive web development, ecommerce, and custom software.', bookings: '0' },

  // 7. Tutors & Consultancies
  { id: 701, category: 'Tutors & Consultancies', subCategory: 'Education', name: 'Home Tutors (School & College)', icon: GraduationCap, price: 499, skill: 'Tutor', desc: 'Experienced tutors for Maths, Science, English & State/CBSE.', bookings: '0' },
  { id: 702, category: 'Tutors & Consultancies', subCategory: 'Education', name: 'Job & Education Consultancy', icon: GraduationCap, price: 599, skill: 'Consultant', desc: 'Overseas education guidance, resume writing, and job placement.', bookings: '0' },

  // 8. Pet & Animal Care
  { id: 801, category: 'Pet & Animal Care', subCategory: 'Veterinary', name: 'Vet Doctor Visit & Vaccination', icon: Dog, price: 499, skill: 'Veterinary', desc: 'At-home pet health checkup, anti-rabies, and deworming.', bookings: '0' },
  { id: 802, category: 'Pet & Animal Care', subCategory: 'Pet Services', name: 'Pet Grooming & Spa Wash', icon: Dog, price: 599, skill: 'Pet Grooming', desc: 'Nail clipping, ear cleaning, fur trimming, and medicated bath.', bookings: '0' },

  // 9. Food & Daily Supplies
  { id: 901, category: 'Food & Daily Supplies', subCategory: 'Catering', name: 'Event Catering & Sadya Booking', icon: Utensils, price: 1999, skill: 'Catering', desc: 'Traditional Kerala Sadya, non-veg catering for functions.', bookings: '0' },
  { id: 902, category: 'Food & Daily Supplies', subCategory: 'Daily Supplies', name: 'Fresh Farm Dairy & Meat Supply', icon: Utensils, price: 199, skill: 'Daily Supply', desc: 'Fresh milk, organic eggs, chicken and mutton doorstep delivery.', bookings: '0' },

  // 10. Construction & Home Makeover
  { id: 1001, category: 'Construction & Home Makeover', subCategory: 'Makeover', name: 'Interior & Exterior Painting', icon: Paintbrush, price: 999, skill: 'Home Painting', desc: 'Asian Paints, Berger wall putty, weather-proof coating.', bookings: '0' },
  { id: 1002, category: 'Construction & Home Makeover', subCategory: 'Construction', name: 'Masonry & Tile Fitting', icon: Hammer, price: 899, skill: 'Masonry', desc: 'Granite, vitrified tile laying, compound wall masonry.', bookings: '0' },
];

export const INITIAL_PROVIDERS = [
  { id: 'p1', name: 'Ramesh Kumar', skill: 'Electrical', phone: '+91 98765 11111', address: 'Mavoor Road, Calicut', email: 'ramesh@sahaya.in', aadhaar_number: '5544 3322 1100', price: 249, charge: 1500, rating: 4.8, jobs: 34, status: 'approved', is_available: true },
  { id: 'p2', name: 'Sujith V', skill: 'Appliance Repair', phone: '+91 98765 22222', address: 'Kondotty, Malappuram', email: 'sujith@sahaya.in', aadhaar_number: '6677 8899 0011', price: 599, charge: 2400, rating: 4.9, jobs: 48, status: 'approved', is_available: true },
  { id: 'p3', name: 'Muhammed Ali', skill: 'House Cleaning', phone: '+91 98765 33333', address: 'Pattambi, Palakkad', email: 'ali@sahaya.in', aadhaar_number: '1122 3344 5566', price: 499, charge: 1800, rating: 4.7, jobs: 29, status: 'approved', is_available: true },
];

export const INITIAL_USERS = [
  { id: 'u1', name: 'Ananya Sharma', phone: '+91 98950 12345', email: 'ananya@gmail.com', joined: '12 Jan 2026', lastLogin: 'Active', bookingsCount: 4 },
  { id: 'u2', name: 'Rahul Varma', phone: '+91 98950 67890', email: 'rahul.v@gmail.com', joined: '04 Feb 2026', lastLogin: 'Active', bookingsCount: 2 },
];

export const INITIAL_BOOKINGS = [
  { id: 'b101', serviceId: 101, serviceName: 'Switchboard Fix & Repair', customerName: 'Ananya Sharma', phone: '+91 98950 12345', address: 'Civil Station, Calicut', date: '2026-07-22', time: '10:00 AM', price: 249, status: 'completed', providerId: 'p1', createdAt: new Date().toISOString() },
  { id: 'b102', serviceId: 201, serviceName: 'AC Jet Service & Wash', customerName: 'Rahul Varma', phone: '+91 98950 67890', address: 'Mavoor Road, Calicut', date: '2026-07-22', time: '02:00 PM', price: 599, status: 'pending', providerId: null, createdAt: new Date().toISOString() },
];

export const INITIAL_MARKETPLACE_POSTINGS = [
  {
    id: 101,
    title: 'Second Hand Teakwood Sofa (3+2)',
    category: 'Local Sales',
    type: 'sale',
    price: 4500,
    description: 'Moving out sale! Solid teakwood frame, pristine washable cushions. Pick up near Central Park.',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    contact_phone: '+919876543210',
    location_name: 'Central Park Area, Calicut',
    lat: 11.1500,
    lng: 75.9730,
    created_at: new Date().toISOString(),
  },
];

export function serviceFor(booking, servicesList = SERVICES) {
  return servicesList.find(s => s.id === booking.serviceId || s.name === booking.serviceName) || servicesList[0];
}

export function providerFor(booking, providersList = INITIAL_PROVIDERS) {
  return providersList.find(p => p.id === booking.providerId);
}
