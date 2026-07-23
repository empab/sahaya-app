import { supabase } from './src/lib/supabase.js';

export const CATEGORIES_TIER1 = [
  { id: 'cat-1',  name: 'Quick Repairs & Fixes',           icon: 'electric_bolt',     iconName: 'bolt',               emoji: '⚡', color: '#38138c', desc: 'Electrician, Plumber, Carpenter, Glass, Welding' },
  { id: 'cat-2',  name: 'Appliance Care & Repairs',        icon: 'ac_unit',           iconName: 'ac_unit',            emoji: '❄️', color: '#006688', desc: 'AC, Fridge, Washing Machine, TV, Electronics' },
  { id: 'cat-3',  name: 'Cleaning & Pest Control',         icon: 'cleaning_services', iconName: 'cleaning_services', emoji: '🧹', color: '#705d00', desc: 'Home Deep Clean, Bathroom, Tanks, Pest' },
  { id: 'cat-4',  name: 'Health & Medical Care',            icon: 'medical_services',  iconName: 'medical_services',  emoji: '🩺', color: '#ba1a1a', desc: 'Doctors, Nursing, Therapy, Ambulance' },
  { id: 'cat-5',  name: 'Auto & Vehicle Care',             icon: 'directions_car',    iconName: 'directions_car',    emoji: '🚗', color: '#004b65', desc: 'Breakdown, Wash, Mechanic, Drivers' },
  { id: 'cat-6',  name: 'Professional & Business Services',icon: 'business_center',   iconName: 'business_center',   emoji: '💼', color: '#4f32a3', desc: 'Legal, Accounting, IT, Marketing' },
  { id: 'cat-7',  name: 'Tutors & Consultancies',          icon: 'school',            iconName: 'school',            emoji: '🎓', color: '#654aba', desc: 'Home Tutors, Job Consultancies, Education' },
  { id: 'cat-8',  name: 'Pet & Animal Care',               icon: 'pets',              iconName: 'pets',              emoji: '🐾', color: '#c9a800', desc: 'Veterinary, Pet Grooming, Boarding' },
  { id: 'cat-9',  name: 'Food & Daily Supplies',           icon: 'restaurant',        iconName: 'restaurant',        emoji: '🥗', color: '#3f8f5f', desc: 'Catering, Dairy, Meat, Vegetables' },
  { id: 'cat-10', name: 'Construction & Home Makeover',    icon: 'construction',      iconName: 'construction',      emoji: '🛠️', color: '#e2583e', desc: 'Painting, Masonry, Interiors, Tiles' },
];

export const NEW_SERVICES = [
  // 1. Quick Repairs & Fixes
  { id: 101, name: 'Switchboard Fix & Repair', icon: 'electric_bolt', price: 249, skill: 'Electrical', desc: 'Wiring, switch replacements and socket troubleshooting.', bookings: '42' },
  { id: 102, name: 'Fan Fitting & Repair', icon: 'electric_bolt', price: 299, skill: 'Electrical', desc: 'Ceiling and exhaust fan installation and capacitor fix.', bookings: '38' },
  { id: 103, name: 'Light Fitting Installation', icon: 'electric_bolt', price: 199, skill: 'Electrical', desc: 'LED tube light, chandelier, and decorative light setup.', bookings: '51' },
  { id: 104, name: 'Complete Wiring Inspection', icon: 'electric_bolt', price: 499, skill: 'Electrical', desc: 'Full home electrical safety audit and MCB breaker check.', bookings: '29' },
  { id: 105, name: 'Tap Leak Repair', icon: 'plumbing', price: 199, skill: 'Plumbing', desc: 'Tap washer replacement, thread sealing, and nozzle fix.', bookings: '64' },
  { id: 106, name: 'Pipe Line Works', icon: 'plumbing', price: 399, skill: 'Plumbing', desc: 'CPVC/PVC pipe joining, line extension, and valve fitting.', bookings: '47' },
  { id: 107, name: 'Drain Unblocking', icon: 'plumbing', price: 449, skill: 'Plumbing', desc: 'Kitchen sink and bathroom drainage unclogging.', bookings: '35' },
  { id: 108, name: 'Flush Tank Repair', icon: 'plumbing', price: 349, skill: 'Plumbing', desc: 'Syphon kit replacement, inlet valve repair, and leak fix.', bookings: '28' },
  { id: 109, name: 'Lock Repair & Replacement', icon: 'handyman', price: 299, skill: 'Carpentry', desc: 'Main door lock, latch, and mortise handle fitting.', bookings: '31' },
  { id: 110, name: 'Hinges & Door Repair', icon: 'handyman', price: 349, skill: 'Carpentry', desc: 'Door alignment, hydraulic hinge fixing, and planed doors.', bookings: '22' },
  { id: 111, name: 'Furniture Assembly', icon: 'handyman', price: 499, skill: 'Carpentry', desc: 'Bed, table, wardrobe assembly and woodwork fixing.', bookings: '40' },
  { id: 112, name: 'Glass & Window Works', icon: 'handyman', price: 549, skill: 'Glass Works', desc: 'Window pane replacement, toughened glass, and mirror fitting.', bookings: '19' },
  { id: 113, name: 'Arc Welding Services', icon: 'handyman', price: 599, skill: 'Welding', desc: 'On-site gate, grill, and metal structural welding.', bookings: '26' },
  { id: 114, name: 'Ring Well Works & Cleaning', icon: 'handyman', price: 999, skill: 'Well Work', desc: 'Traditional Kerala ring well cleaning and maintenance.', bookings: '15' },

  // 2. Appliance Care & Repairs
  { id: 201, name: 'AC Jet Service & Wash', icon: 'ac_unit', price: 599, skill: 'Appliance Repair', desc: 'High-pressure jet pump filter wash and coil cleaning.', bookings: '88' },
  { id: 202, name: 'AC Gas Refilling', icon: 'ac_unit', price: 1499, skill: 'Appliance Repair', desc: 'R32 / R410 refrigerant gas charging and leak testing.', bookings: '54' },
  { id: 203, name: 'Fridge Repair (All Brands)', icon: 'ac_unit', price: 449, skill: 'Appliance Repair', desc: 'Thermostat, compressor relay, and cooling troubleshooting.', bookings: '62' },
  { id: 204, name: 'RO Water Purifier Service', icon: 'water_drop', price: 399, skill: 'Appliance Repair', desc: 'Filter replacement, membrane check, and TDS tuning.', bookings: '45' },
  { id: 205, name: 'Gas Stove & Chimney Service', icon: 'kitchen', price: 349, skill: 'Appliance Repair', desc: 'Burner cleaning, auto-ignition repair, and chimney ducting.', bookings: '37' },
  { id: 206, name: 'Microwave & OTG Repair', icon: 'microwave', price: 349, skill: 'Appliance Repair', desc: 'Magnetron replacement, turntable fix, and heating issue.', bookings: '29' },
  { id: 207, name: 'Washing Machine Repair', icon: 'local_laundry_service', price: 499, skill: 'Appliance Repair', desc: 'Front-load and top-load drum, motor, and PCB repair.', bookings: '73' },
  { id: 208, name: 'Water Heater / Geyser Repair', icon: 'water_drop', price: 399, skill: 'Appliance Repair', desc: 'Heating element replacement, thermostat, and safety valve.', bookings: '33' },
  { id: 209, name: 'LED TV Repair & Wall Mount', icon: 'tv', price: 499, skill: 'Appliance Repair', desc: 'Display panel, backlight, motherboard, and bracket installation.', bookings: '56' },
  { id: 210, name: 'Computer & Laptop Service', icon: 'computer', price: 599, skill: 'IT & Computer', desc: 'OS formatting, RAM/SSD upgrade, keyboard and screen fix.', bookings: '41' },

  // 3. Cleaning & Pest Control
  { id: 301, name: 'Bathroom Deep Cleaning', icon: 'cleaning_services', price: 499, skill: 'House Cleaning', desc: 'Tile de-scaling, hard water stain removal, and sanitization.', bookings: '92' },
  { id: 302, name: 'Kitchen Deep Cleaning', icon: 'cleaning_services', price: 699, skill: 'House Cleaning', desc: 'Oil stain degreasing, cabinet wiping, and sink scrubbing.', bookings: '68' },
  { id: 303, name: 'Sofa & Upholstery Cleaning', icon: 'cleaning_services', price: 799, skill: 'House Cleaning', desc: 'Vacuuming, injection-extraction shampoo wash for 5-seater.', bookings: '52' },
  { id: 304, name: 'Water Tank Cleaning', icon: 'cleaning_services', price: 599, skill: 'Tank Cleaning', desc: 'Sludge removal, high-pressure washing, and UV disinfection.', bookings: '47' },
  { id: 305, name: 'Solar Panel Washing', icon: 'cleaning_services', price: 499, skill: 'Solar Cleaning', desc: 'Dust & grime removal to restore peak solar power output.', bookings: '24' },
  { id: 306, name: 'Pest Control Spray (Cockroach/Termite)', icon: 'sanitizer', price: 899, skill: 'Pest Control', desc: 'Odourless herbalgel and chemical spray with 6-month warranty.', bookings: '58' },

  // 4. Health & Medical Care
  { id: 401, name: 'Certified Nurse & Injection Care', icon: 'medical_services', price: 299, skill: 'Nursing', desc: 'Dressing, IV fluid setup, catheter, and vital monitoring.', bookings: '63' },
  { id: 402, name: 'Homeo & Ayurveda Therapy', icon: 'medical_services', price: 399, skill: 'Ayurveda', desc: 'Traditional Kerala consultation and therapeutic massage.', bookings: '37' },
  { id: 403, name: 'Doctor Home Visit', icon: 'medical_services', price: 799, skill: 'Doctor', desc: 'General physician home consultation and prescription.', bookings: '49' },
  { id: 404, name: 'Emergency Ambulance Request', icon: 'medical_services', price: 999, skill: 'Ambulance', desc: '24/7 basic & ICU transport ambulance dispatch.', bookings: '31' },

  // 5. Auto & Vehicle Care
  { id: 501, name: 'Towing & Recovery Van', icon: 'directions_car', price: 999, skill: 'Towing', desc: 'Flatbed towing and breakdown recovery for cars & bikes.', bookings: '44' },
  { id: 502, name: 'Tyre Puncture Repair (On-Site)', icon: 'directions_car', price: 249, skill: 'Mechanic', desc: 'Tubeless puncture plug and air refill at your location.', bookings: '78' },
  { id: 503, name: 'Battery Jumpstart Service', icon: 'directions_car', price: 299, skill: 'Mechanic', desc: 'Instant heavy cable battery jumpstart and alternator check.', bookings: '52' },
  { id: 504, name: 'Foam Car Wash & Detailing', icon: 'directions_car', price: 499, skill: 'Car Wash', desc: 'Exterior foam wash, interior vacuuming, and dashboard polish.', bookings: '81' },
  { id: 505, name: 'On-Demand Personal Driver', icon: 'directions_car', price: 499, skill: 'Driver', desc: 'Experienced verified drivers for manual & automatic vehicles.', bookings: '95' },

  // 6. Professional & Business Services
  { id: 601, name: 'Digital Signature (DSC) Creation', icon: 'business_center', price: 499, skill: 'Documentation', desc: 'Class 3 USB token digital signature for tenders and GST.', bookings: '29' },
  { id: 602, name: 'Chartered Accountant Consultation', icon: 'business_center', price: 999, skill: 'Accounting', desc: 'ITR filing, GST registration, audit, and tax planning.', bookings: '34' },
  { id: 603, name: 'Website Design & Software', icon: 'business_center', price: 2499, skill: 'IT Services', desc: 'Responsive web development, ecommerce, and custom software.', bookings: '21' },
  { id: 604, name: 'CCTV Installation & Setup', icon: 'business_center', price: 899, skill: 'CCTV Installation', desc: '4-channel IP camera installation, DVR and mobile viewing.', bookings: '43' },

  // 7. Tutors & Consultancies
  { id: 701, name: 'Home Tutors (School & College)', icon: 'school', price: 499, skill: 'Tutor', desc: 'Experienced tutors for Maths, Science, English & State/CBSE.', bookings: '62' },
  { id: 702, name: 'Job & Education Consultancy', icon: 'school', price: 599, skill: 'Consultant', desc: 'Overseas education guidance, resume writing, and job placement.', bookings: '38' },

  // 8. Pet & Animal Care
  { id: 801, name: 'Vet Doctor Visit & Vaccination', icon: 'pets', price: 499, skill: 'Veterinary', desc: 'At-home pet health checkup, anti-rabies, and deworming.', bookings: '41' },
  { id: 802, name: 'Pet Grooming & Spa Wash', icon: 'pets', price: 599, skill: 'Pet Grooming', desc: 'Nail clipping, ear cleaning, fur trimming, and medicated bath.', bookings: '35' },

  // 9. Food & Daily Supplies
  { id: 901, name: 'Event Catering & Sadya Booking', icon: 'restaurant', price: 1999, skill: 'Catering', desc: 'Traditional Kerala Sadya, non-veg catering for functions.', bookings: '53' },
  { id: 902, name: 'Fresh Farm Dairy & Meat Supply', icon: 'restaurant', price: 199, skill: 'Daily Supply', desc: 'Fresh milk, organic eggs, chicken and mutton doorstep delivery.', bookings: '76' },

  // 10. Construction & Home Makeover
  { id: 1001, name: 'Interior & Exterior Painting', icon: 'construction', price: 999, skill: 'Home Painting', desc: 'Asian Paints, Berger wall putty, weather-proof coating.', bookings: '48' },
  { id: 1002, name: 'Masonry & Tile Fitting', icon: 'construction', price: 899, skill: 'Masonry', desc: 'Granite, vitrified tile laying, compound wall masonry.', bookings: '39' },
];

async function seed() {
  console.log('Seeding clean service catalog matching all 10 Tier-1 categories into Supabase database...');
  for (const s of NEW_SERVICES) {
    const { error } = await supabase.from('services').upsert(s, { onConflict: 'id' }).select();
    if (error) {
      console.error(`Error seeding ${s.name}:`, error.message);
    } else {
      console.log(`Seeded: ${s.name} (Skill: ${s.skill})`);
    }
  }
  console.log('Finished seeding services into Supabase!');
}

seed();
