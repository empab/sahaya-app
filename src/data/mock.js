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
  { id: 115, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'MCB & Main Switch Repair', icon: Zap, price: 349, skill: 'Electrical', desc: 'Single/three-phase MCB replacement and main breaker fix.', bookings: '0' },
  { id: 116, category: 'Quick Repairs & Fixes', subCategory: 'Electrical', name: 'Inverter & Battery Wiring Setup', icon: Zap, price: 599, skill: 'Electrical', desc: 'Inverter installation, battery connection, and load setup.', bookings: '0' },

  { id: 105, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Tap Leak Repair', icon: Wrench, price: 199, skill: 'Plumbing', desc: 'Tap washer replacement, thread sealing, and nozzle fix.', bookings: '0' },
  { id: 106, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Pipe Line Works', icon: Wrench, price: 399, skill: 'Plumbing', desc: 'CPVC/PVC pipe joining, line extension, and valve fitting.', bookings: '0' },
  { id: 107, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Drain Unblocking', icon: Wrench, price: 449, skill: 'Plumbing', desc: 'Kitchen sink and bathroom drainage unclogging.', bookings: '0' },
  { id: 108, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Flush Tank Repair', icon: Wrench, price: 349, skill: 'Plumbing', desc: 'Syphon kit replacement, inlet valve repair, and leak fix.', bookings: '0' },
  { id: 117, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Water Tank Valve Repair & Leak Fix', icon: Wrench, price: 399, skill: 'Plumbing', desc: 'Overhead tank ball valve replacement and pipe leak sealing.', bookings: '0' },
  { id: 118, category: 'Quick Repairs & Fixes', subCategory: 'Plumbing', name: 'Shower & Bathroom Fitting', icon: Wrench, price: 299, skill: 'Plumbing', desc: 'Shower head, mixer tap, and health faucet installation.', bookings: '0' },

  { id: 109, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Lock Repair & Replacement', icon: Hammer, price: 299, skill: 'Carpentry', desc: 'Main door lock, latch, and mortise handle fitting.', bookings: '0' },
  { id: 110, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Hinges & Door Repair', icon: Hammer, price: 349, skill: 'Carpentry', desc: 'Door alignment, hydraulic hinge fixing, and planed doors.', bookings: '0' },
  { id: 111, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Furniture Assembly', icon: Hammer, price: 499, skill: 'Carpentry', desc: 'Bed, table, wardrobe assembly and woodwork fixing.', bookings: '0' },
  { id: 119, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Modular Kitchen Hinge & Drawer Fix', icon: Hammer, price: 399, skill: 'Carpentry', desc: 'Soft-close hinge adjustment and drawer channel replacement.', bookings: '0' },
  { id: 120, category: 'Quick Repairs & Fixes', subCategory: 'Carpentry', name: 'Wooden Door Resizing & Planing', icon: Hammer, price: 349, skill: 'Carpentry', desc: 'Door trimming, jam clearing, and smooth closing fix.', bookings: '0' },

  { id: 112, category: 'Quick Repairs & Fixes', subCategory: 'Glass & Window', name: 'Glass & Window Works', icon: Hammer, price: 549, skill: 'Glass Works', desc: 'Window pane replacement, toughened glass, and mirror fitting.', bookings: '0' },
  { id: 121, category: 'Quick Repairs & Fixes', subCategory: 'Glass & Window', name: 'Window Glass Replacement', icon: Hammer, price: 499, skill: 'Glass Works', desc: 'Broken window pane replacement, toughened & frosted glass.', bookings: '0' },
  { id: 122, category: 'Quick Repairs & Fixes', subCategory: 'Glass & Window', name: 'Mirror Fitting & Wall Mount', icon: Hammer, price: 349, skill: 'Glass Works', desc: 'Bathroom & dressing mirror wall mounting and framing fix.', bookings: '0' },
  { id: 123, category: 'Quick Repairs & Fixes', subCategory: 'Glass & Window', name: 'Sliding Glass Door Repair', icon: Hammer, price: 599, skill: 'Glass Works', desc: 'Sliding door roller replacement, track alignment & lock fix.', bookings: '0' },

  { id: 113, category: 'Quick Repairs & Fixes', subCategory: 'Welding Services', name: 'Arc Welding Services', icon: Hammer, price: 599, skill: 'Welding', desc: 'On-site gate, grill, and metal structural welding.', bookings: '0' },
  { id: 124, category: 'Quick Repairs & Fixes', subCategory: 'Welding Services', name: 'Gate & Fence Repair', icon: Hammer, price: 499, skill: 'Welding', desc: 'Iron gate hinge welding, latch repair, and fence reinforcement.', bookings: '0' },
  { id: 125, category: 'Quick Repairs & Fixes', subCategory: 'Welding Services', name: 'Grill & Balcony Welding', icon: Hammer, price: 549, skill: 'Welding', desc: 'Safety grill customization, broken weld fix & rust protection.', bookings: '0' },
  { id: 126, category: 'Quick Repairs & Fixes', subCategory: 'Welding Services', name: 'Metal Structure Fabrication', icon: Hammer, price: 799, skill: 'Welding', desc: 'Custom steel frame, shed welding & structural metal work.', bookings: '0' },

  { id: 114, category: 'Quick Repairs & Fixes', subCategory: 'Ring Well Works', name: 'Ring Well Works & Cleaning', icon: Hammer, price: 799, skill: 'Well Works', desc: 'Traditional Kerala ring well cleaning and maintenance.', bookings: '0' },
  { id: 127, category: 'Quick Repairs & Fixes', subCategory: 'Ring Well Works', name: 'Ring Well De-silting & Mud Removal', icon: Hammer, price: 1199, skill: 'Well Works', desc: 'Deep mud extraction, bottom silt removal & fresh water flow.', bookings: '0' },
  { id: 128, category: 'Quick Repairs & Fixes', subCategory: 'Ring Well Works', name: 'Well Netting & Safety Cover', icon: Hammer, price: 699, skill: 'Well Works', desc: 'Stainless steel / mesh safety net installation to prevent debris.', bookings: '0' },
  { id: 129, category: 'Quick Repairs & Fixes', subCategory: 'Ring Well Works', name: 'Ring Well Chlorination & Disinfection', icon: Hammer, price: 499, skill: 'Well Works', desc: 'Water testing, bleaching powder treatment & purification.', bookings: '0' },

  // 2. Appliance Care & Repairs
  { id: 201, category: 'Appliance Care & Repairs', subCategory: 'Cooling & AC', name: 'AC Jet Service & Wash', icon: Wind, price: 599, skill: 'Appliance Repair', desc: 'High-pressure jet pump filter wash and coil cleaning.', bookings: '0' },
  { id: 202, category: 'Appliance Care & Repairs', subCategory: 'Cooling & AC', name: 'AC Gas Refilling', icon: Wind, price: 1499, skill: 'Appliance Repair', desc: 'R32 / R410 refrigerant gas charging and leak testing.', bookings: '0' },
  { id: 203, category: 'Appliance Care & Repairs', subCategory: 'Cooling & AC', name: 'Fridge Repair (All Brands)', icon: Snowflake, price: 449, skill: 'Appliance Repair', desc: 'Thermostat, compressor relay, and cooling troubleshooting.', bookings: '0' },
  { id: 204, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'RO Water Purifier Service', icon: Droplet, price: 399, skill: 'Appliance Repair', desc: 'Filter replacement, membrane check, and TDS tuning.', bookings: '0' },
  { id: 205, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'Gas Stove & Chimney Service', icon: Package, price: 349, skill: 'Appliance Repair', desc: 'Burner cleaning, auto-ignition repair, and chimney ducting.', bookings: '0' },
  { id: 206, category: 'Appliance Care & Repairs', subCategory: 'Kitchen Appliances', name: 'Microwave & OTG Repair', icon: Package, price: 349, skill: 'Appliance Repair', desc: 'Magnetron replacement, turntable fix, and heating issue.', bookings: '0' },
  { id: 207, category: 'Appliance Care & Repairs', subCategory: 'Laundry & Home', name: 'Washing Machine Repair', icon: Droplet, price: 499, skill: 'Appliance Repair', desc: 'Front-load and top-load drum, motor, and PCB repair.', bookings: '0' },
  { id: 208, category: 'Appliance Care & Repairs', subCategory: 'Laundry & Home', name: 'Water Heater / Geyser Repair', icon: Droplet, price: 399, skill: 'Appliance Repair', desc: 'Heating element replacement, thermostat, and safety valve.', bookings: '0' },
  { id: 209, category: 'Appliance Care & Repairs', subCategory: 'TV & Electronics', name: 'LED TV Repair & Wall Mount', icon: Tv, price: 499, skill: 'Appliance Repair', desc: 'Display panel, backlight, motherboard, and bracket installation.', bookings: '0' },
  { id: 210, category: 'Appliance Care & Repairs', subCategory: 'Computer & Laptop', name: 'Computer & Laptop Service', icon: Tv, price: 499, skill: 'Computer Repair', desc: 'OS formatting, RAM/SSD upgrade, keyboard and screen fix.', bookings: '0' },

  // 3. Cleaning & Pest Control
  { id: 301, category: 'Cleaning & Pest Control', subCategory: 'Bathroom Cleaning', name: 'Bathroom Deep Cleaning', icon: Sparkles, price: 499, skill: 'House Cleaning', desc: 'Tile de-scaling, hard water stain removal, and sanitization.', bookings: '0' },
  { id: 302, category: 'Cleaning & Pest Control', subCategory: 'Kitchen Cleaning', name: 'Kitchen Deep Cleaning', icon: Sparkles, price: 699, skill: 'House Cleaning', desc: 'Oil stain degreasing, cabinet wiping, and sink scrubbing.', bookings: '0' },
  { id: 303, category: 'Cleaning & Pest Control', subCategory: 'Sofa & Upholstery', name: 'Sofa & Upholstery Cleaning', icon: Sparkles, price: 799, skill: 'House Cleaning', desc: 'Vacuuming, injection-extraction shampoo wash for 5-seater.', bookings: '0' },
  { id: 304, category: 'Cleaning & Pest Control', subCategory: 'Utility Cleaning', name: 'Water Tank Cleaning', icon: Sparkles, price: 599, skill: 'Tank Cleaning', desc: 'Sludge removal, high-pressure washing, and UV disinfection.', bookings: '0' },
  { id: 305, category: 'Cleaning & Pest Control', subCategory: 'Utility Cleaning', name: 'Solar Panel Washing', icon: Sparkles, price: 599, skill: 'Solar Cleaning', desc: 'Dust & grime removal to restore peak solar power output.', bookings: '0' },
  { id: 306, category: 'Cleaning & Pest Control', subCategory: 'Pest Control', name: 'Pest Control Spray (Cockroach/Termite)', icon: Sparkles, price: 899, skill: 'Pest Control', desc: 'Odourless herbalgel and chemical spray with 6-month warranty.', bookings: '0' },

  // 4. Health & Medical Care
  { id: 401, category: 'Health & Medical Care', subCategory: 'Nursing & Injection', name: 'Certified Nurse & Injection Care', icon: Stethoscope, price: 299, skill: 'Nursing', desc: 'Dressing, IV fluid setup, catheter, and vital monitoring.', bookings: '0' },
  { id: 402, category: 'Health & Medical Care', subCategory: 'Homeo & Ayurveda', name: 'Homeo & Ayurveda Therapy', icon: Stethoscope, price: 399, skill: 'Ayurveda', desc: 'Traditional Kerala consultation and therapeutic massage.', bookings: '0' },
  { id: 403, category: 'Health & Medical Care', subCategory: 'Doctor Visit', name: 'Doctor Home Visit', icon: Stethoscope, price: 799, skill: 'Doctor', desc: 'General physician home consultation and prescription.', bookings: '0' },
  { id: 404, category: 'Health & Medical Care', subCategory: 'Emergency Ambulance', name: 'Emergency Ambulance Request', icon: Stethoscope, price: 999, skill: 'Ambulance', desc: '24/7 basic & ICU transport ambulance dispatch.', bookings: '0' },

  // 5. Auto & Vehicle Care
  { id: 501, category: 'Auto & Vehicle Care', subCategory: 'Emergency Breakdown', name: 'Towing & Recovery Van', icon: Car, price: 999, skill: 'Towing', desc: 'Flatbed towing and breakdown recovery for cars & bikes.', bookings: '0' },
  { id: 502, category: 'Auto & Vehicle Care', subCategory: 'Emergency Breakdown', name: 'Tyre Puncture Repair (On-Site)', icon: Car, price: 249, skill: 'Mechanic', desc: 'Tubeless puncture plug and air refill at your location.', bookings: '0' },
  { id: 503, category: 'Auto & Vehicle Care', subCategory: 'Emergency Breakdown', name: 'Battery Jumpstart Service', icon: Car, price: 299, skill: 'Mechanic', desc: 'Instant heavy cable battery jumpstart and alternator check.', bookings: '0' },
  { id: 504, category: 'Auto & Vehicle Care', subCategory: 'Car Wash & Detailing', name: 'Foam Car Wash & Detailing', icon: Car, price: 499, skill: 'Car Wash', desc: 'Exterior foam wash, interior vacuuming, and dashboard polish.', bookings: '0' },
  { id: 505, category: 'Auto & Vehicle Care', subCategory: 'Personal Driver', name: 'On-Demand Personal Driver', icon: Car, price: 499, skill: 'Driver', desc: 'Experienced verified drivers for manual & automatic vehicles.', bookings: '0' },

  // 6. Professional & Business Services
  { id: 601, category: 'Professional & Business Services', subCategory: 'Documentation', name: 'Digital Signature (DSC) Creation', icon: Briefcase, price: 499, skill: 'Documentation', desc: 'Class 3 USB token digital signature for tenders and GST.', bookings: '0' },
  { id: 602, category: 'Professional & Business Services', subCategory: 'Financial & Legal', name: 'Chartered Accountant Consultation', icon: Briefcase, price: 999, skill: 'Accounting', desc: 'ITR filing, GST registration, audit, and tax planning.', bookings: '0' },
  { id: 603, category: 'Professional & Business Services', subCategory: 'IT & Digital', name: 'Website Design & Software', icon: Briefcase, price: 2499, skill: 'IT Services', desc: 'Responsive web development, ecommerce, and custom software.', bookings: '0' },
  { id: 604, category: 'Professional & Business Services', subCategory: 'Security & CCTV', name: 'CCTV Installation & Setup', icon: Briefcase, price: 1499, skill: 'CCTV Installation', desc: '4-channel IP camera installation, DVR and mobile viewing.', bookings: '0' },

  // 7. Tutors & Consultancies
  { id: 701, category: 'Tutors & Consultancies', subCategory: 'Home Tutors', name: 'Home Tutors (School & College)', icon: GraduationCap, price: 499, skill: 'Tutor', desc: 'Experienced tutors for Maths, Science, English & State/CBSE.', bookings: '0' },
  { id: 702, category: 'Tutors & Consultancies', subCategory: 'Job & Education Consultancy', name: 'Job & Education Consultancy', icon: GraduationCap, price: 599, skill: 'Consultant', desc: 'Overseas education guidance, resume writing, and job placement.', bookings: '0' },

  // 8. Pet & Animal Care
  { id: 801, category: 'Pet & Animal Care', subCategory: 'Veterinary Checkup', name: 'Vet Doctor Visit & Vaccination', icon: Dog, price: 499, skill: 'Veterinary', desc: 'At-home pet health checkup, anti-rabies, and deworming.', bookings: '0' },
  { id: 802, category: 'Pet & Animal Care', subCategory: 'Pet Grooming & Spa', name: 'Pet Grooming & Spa Wash', icon: Dog, price: 599, skill: 'Pet Grooming', desc: 'Nail clipping, ear cleaning, fur trimming, and medicated bath.', bookings: '0' },

  // 9. Food & Daily Supplies
  { id: 901, category: 'Food & Daily Supplies', subCategory: 'Event Catering & Sadya', name: 'Event Catering & Sadya Booking', icon: Utensils, price: 1999, skill: 'Catering', desc: 'Traditional Kerala Sadya, non-veg catering for functions.', bookings: '0' },
  { id: 902, category: 'Food & Daily Supplies', subCategory: 'Fresh Dairy & Meat', name: 'Fresh Farm Dairy & Meat Supply', icon: Utensils, price: 199, skill: 'Daily Supply', desc: 'Fresh milk, organic eggs, chicken and mutton doorstep delivery.', bookings: '0' },

  // 10. Construction & Home Makeover
  { id: 1001, category: 'Construction & Home Makeover', subCategory: 'Interior & Exterior Painting', name: 'Interior & Exterior Painting', icon: Paintbrush, price: 999, skill: 'Home Painting', desc: 'Asian Paints, Berger wall putty, weather-proof coating.', bookings: '0' },
  { id: 1002, category: 'Construction & Home Makeover', subCategory: 'Masonry & Tile Fitting', name: 'Masonry & Tile Fitting', icon: Hammer, price: 899, skill: 'Masonry', desc: 'Granite, vitrified tile laying, compound wall masonry.', bookings: '0' },
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
