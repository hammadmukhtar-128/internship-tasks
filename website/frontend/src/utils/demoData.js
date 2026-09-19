/**
 * Realistic demo/fallback content. Each service module in src/services/
 * tries the real API first; if the request fails (e.g. the Express backend
 * isn't running yet), it falls back to this data so the frontend is fully
 * demonstrable on its own. Replace/remove once your backend is live.
 */

export const demoServices = [
  {
    _id: "physiotherapy",
    name: "Physiotherapy",
    slug: "physiotherapy",
    shortDescription:
      "Hands-on assessment and treatment to restore movement, reduce pain and build long-term strength.",
    description:
      "Our physiotherapy sessions combine hands-on manual therapy with individually tailored exercise programs. Whether you're recovering from an injury, managing a chronic condition, or simply want to move more comfortably, our physiotherapists take the time to understand your goals and build a treatment plan around them.",
    benefits: [
      "Reduced pain and stiffness",
      "Improved mobility and flexibility",
      "Personalised exercise programs",
      "Better long-term movement patterns",
    ],
    whatToExpect:
      "Your first session includes a thorough assessment of your movement, strength and pain patterns, followed by hands-on treatment and the start of a home exercise plan tailored to your goals.",
    duration: "45–60 minutes",
    price: "From $95",
    image: "/images/clinic/service-physiotherapy.jpg",
    isActive: true,
  },
  {
    _id: "chiropractic-care",
    name: "Chiropractic Care",
    slug: "chiropractic-care",
    shortDescription:
      "Gentle spinal and joint assessment and adjustment to support posture, mobility and everyday comfort.",
    description:
      "Our chiropractic care focuses on the health of your spine, joints and nervous system. Using gentle, evidence-informed techniques, our practitioners assess how your body moves and work with you to relieve tension, improve posture and support long-term wellbeing.",
    benefits: [
      "Improved spinal mobility",
      "Reduced muscular tension",
      "Postural awareness and correction",
      "Support for everyday aches and stiffness",
    ],
    whatToExpect:
      "Sessions begin with a postural and movement assessment. Your practitioner will explain each technique before use and adjust the approach to your comfort level.",
    duration: "30–45 minutes",
    price: "From $85",
    image: "/images/clinic/service-chiropractic.jpg",
    isActive: true,
  },
  {
    _id: "sports-injury-rehabilitation",
    name: "Sports Injury Rehabilitation",
    slug: "sports-injury-rehabilitation",
    shortDescription:
      "Structured rehabilitation to help athletes and active people recover and return to sport with confidence.",
    description:
      "From weekend warriors to competitive athletes, our sports injury rehabilitation programs are designed to help you recover safely and return to the activities you love. We combine manual therapy, targeted strengthening and sport-specific conditioning.",
    benefits: [
      "Faster, safer return to sport",
      "Reduced risk of re-injury",
      "Sport-specific strength and conditioning",
      "Ongoing performance support",
    ],
    whatToExpect:
      "We assess the injury, your sport's demands and your current fitness, then build a staged rehabilitation plan with clear milestones toward returning to play.",
    duration: "45–60 minutes",
    price: "From $95",
    image: "/images/clinic/service-sports-injury.jpg",
    isActive: true,
  },
  {
    _id: "back-neck-pain",
    name: "Back & Neck Pain",
    slug: "back-neck-pain",
    shortDescription:
      "Targeted assessment and treatment for acute or ongoing back and neck discomfort.",
    description:
      "Back and neck pain can affect everything from sleep to concentration at work. Our team assesses posture, movement and muscular tension to identify contributing factors, then combines manual therapy with practical strategies you can use every day.",
    benefits: [
      "Relief from acute and chronic pain",
      "Improved posture and ergonomics",
      "Practical strategies for daily life",
      "A plan for staying pain-free long term",
    ],
    whatToExpect:
      "Your practitioner will review your pain history, posture and daily habits, then combine hands-on treatment with simple exercises and ergonomic advice.",
    duration: "30–45 minutes",
    price: "From $85",
    image: "/images/clinic/service-back-neck-pain.jpg",
    isActive: true,
  },
  {
    _id: "exercise-rehabilitation",
    name: "Exercise Rehabilitation",
    slug: "exercise-rehabilitation",
    shortDescription:
      "Guided, progressive exercise programs to rebuild strength, balance and confidence in movement.",
    description:
      "Exercise rehabilitation uses guided movement and progressive strengthening to help you regain confidence in your body. Programs are tailored to your current ability and progressed gradually as you improve, whether you're returning from injury or building general resilience.",
    benefits: [
      "Progressive, tailored programs",
      "Improved strength and balance",
      "Reduced likelihood of future injury",
      "One-on-one guidance and feedback",
    ],
    whatToExpect:
      "We assess your current strength, balance and movement patterns, then guide you through a program that's reviewed and progressed at each visit.",
    duration: "30–45 minutes",
    price: "From $80",
    image: "/images/clinic/service-exercise-rehab.jpg",
    isActive: true,
  },
  {
    _id: "post-surgery-rehabilitation",
    name: "Post-Surgery Rehabilitation",
    slug: "post-surgery-rehabilitation",
    shortDescription:
      "Structured, staged rehabilitation to support a safe and steady recovery after surgery.",
    description:
      "Recovering well after surgery takes a careful, staged approach. We work alongside your surgeon's guidelines to rebuild strength, restore range of motion and support your return to everyday activities at a pace that's right for you.",
    benefits: [
      "Guided, surgeon-informed recovery",
      "Gradual restoration of strength and range of motion",
      "Reduced risk of complications",
      "Support returning to daily activities and work",
    ],
    whatToExpect:
      "We review your surgical notes and any precautions from your surgeon, then guide you through each stage of recovery with regular reassessment.",
    duration: "45 minutes",
    price: "From $95",
    image: "/images/clinic/service-post-surgery.jpg",
    isActive: true,
  },
  {
    _id: "dry-needling",
    name: "Dry Needling",
    slug: "dry-needling",
    shortDescription:
      "A targeted technique used alongside other treatment to help release tight, overactive muscles.",
    description:
      "Dry needling involves inserting fine, sterile needles into specific muscle points to help release tension and reduce pain. It's often used as part of a broader treatment plan alongside manual therapy and exercise.",
    benefits: [
      "Reduced muscle tightness",
      "Support for pain relief",
      "Complements manual therapy and exercise",
      "Performed by trained practitioners",
    ],
    whatToExpect:
      "Your practitioner will explain the technique and check your comfort throughout. Dry needling is usually combined with other hands-on treatment in the same session.",
    duration: "15–30 minutes (add-on)",
    price: "From $40",
    image: "/images/clinic/service-dry-needling.jpg",
    isActive: true,
  },
  {
    _id: "workplace-injury-rehabilitation",
    name: "Workplace Injury Rehabilitation",
    slug: "workplace-injury-rehabilitation",
    shortDescription:
      "Practical rehabilitation and support to help you recover from a workplace injury and return to work.",
    description:
      "Workplace injuries need a plan that considers both your recovery and your return to work. We assess your injury and job demands together, building a rehabilitation program that supports a safe, staged return to your role.",
    benefits: [
      "Assessment tailored to your job demands",
      "Staged, realistic return-to-work planning",
      "Clear communication and progress updates",
      "Practical strategies to prevent re-injury",
    ],
    whatToExpect:
      "We discuss your role and duties alongside your injury, then build a rehabilitation and return-to-work plan with clear, achievable steps.",
    duration: "45 minutes",
    price: "From $95",
    image: "/images/clinic/service-workplace-injury.jpg",
    isActive: true,
  },
];

export const demoPractitioners = [
  {
    _id: "emily-carter",
    name: "Emily Carter",
    slug: "emily-carter",
    specialization: "Senior Physiotherapist",
    qualifications: ["B.Physiotherapy (Hons)", "APA Titled Musculoskeletal Physiotherapist"],
    experience: "10+ years experience",
    bio: "Emily leads our physiotherapy team with a hands-on, patient-first approach. She has a special interest in musculoskeletal injuries and sports rehabilitation, and enjoys helping patients understand their bodies so they can stay well long after treatment ends.",
    shortBio: "Hands-on physiotherapist with a special interest in musculoskeletal and sports injuries.",
    services: ["physiotherapy", "sports-injury-rehabilitation", "exercise-rehabilitation"],
    languages: ["English"],
    isActive: true,
  },
  {
    _id: "james-whitfield",
    name: "James Whitfield",
    slug: "james-whitfield",
    specialization: "Chiropractor",
    qualifications: ["M.Chiropractic", "B.Clinical Sciences"],
    experience: "8+ years experience",
    bio: "James focuses on gentle, effective chiropractic care for the spine and joints. He believes in clear communication and works closely with each patient to explain what he's found and why a particular technique might help.",
    shortBio: "Gentle, communicative chiropractor with a focus on posture and everyday mobility.",
    services: ["chiropractic-care", "back-neck-pain"],
    languages: ["English"],
    isActive: true,
  },
  {
    _id: "sarah-nguyen",
    name: "Sarah Nguyen",
    slug: "sarah-nguyen",
    specialization: "Physiotherapist",
    qualifications: ["B.Physiotherapy", "Cert. Dry Needling"],
    experience: "5+ years experience",
    bio: "Sarah works with patients recovering from surgery and workplace injuries, guiding them through each stage of rehabilitation with patience and encouragement. She's trained in dry needling and enjoys building programs that fit into real, busy lives.",
    shortBio: "Rehabilitation-focused physiotherapist supporting recovery after surgery and workplace injury.",
    services: ["post-surgery-rehabilitation", "workplace-injury-rehabilitation", "dry-needling"],
    languages: ["English", "Vietnamese"],
    isActive: true,
  },
];

export const demoTestimonials = [
  {
    _id: "t1",
    patientName: "Michael T.",
    rating: 5,
    review:
      "I came in with ongoing lower back pain and the team really took the time to understand what was going on. A few weeks in and I'm moving so much better. Highly recommend.",
    isPublished: true,
  },
  {
    _id: "t2",
    patientName: "Olivia R.",
    rating: 5,
    review:
      "Friendly, professional and genuinely invested in getting me back to running after my knee injury. The exercise program was easy to follow and actually worked.",
    isPublished: true,
  },
  {
    _id: "t3",
    patientName: "David K.",
    rating: 5,
    review:
      "Great first experience with chiropractic care — everything was explained clearly and I never felt rushed. My neck stiffness has improved a lot.",
    isPublished: true,
  },
  {
    _id: "t4",
    patientName: "Priya S.",
    rating: 4,
    review:
      "Really practical advice for my desk-job posture problems, plus hands-on treatment that gave immediate relief. Booking online was easy too.",
    isPublished: true,
  },
  {
    _id: "t5",
    patientName: "Chloe B.",
    rating: 5,
    review:
      "Recovering from surgery felt daunting but the staged rehab plan made it manageable. I always knew what the next step was and why.",
    isPublished: true,
  },
];

export const demoClinicSettings = {
  clinicName: "Your Clinic Name",
  tagline: "Physiotherapy & Chiropractic Care",
  phone: "(03) 9000 1234",
  email: "hello@yourclinic.example",
  address: "123 Example Street",
  suburb: "Melbourne",
  state: "VIC",
  postcode: "3000",
  openingHours: [
    { day: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 1:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  googleMapsUrl: "https://maps.google.com/?q=Melbourne+VIC+3000",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  emergencyMessage:
    "This website is not for medical emergencies. If you require urgent care, please call 000 or visit your nearest emergency department.",
};
