import { Mentor, BookingRequest, ForumPost, NotificationItem } from './types';

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Rhea Kapoor',
    role: 'Product Manager',
    company: 'Microsoft',
    domain: 'Product Management',
    experience: 6,
    bio: 'Ex-PM intern at Twitter. Passionate about AI products, UX, and helping students transition from tech to product roles.',
    longBio: 'Rhea is a Senior Product Manager at Microsoft leading a team in the Azure AI Developer Platform division. After graduating with a Bachelor in Computer Science in 2018, she transitioned into Product Management via Microsoft\'s PM Rotation program. Over the last six years, she has mentored over 50+ college students, helping them navigate recruitment, PM interview case studies, and product design fundamentals. In her free time, she enjoys hiking, painting, and reviewing product designs of emerging startups.',
    location: 'Seattle, WA (Remote Friendly)',
    gradYear: 2018,
    availability: 'Available this week',
    rating: 4.9,
    sessionsCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['PM Interview Prep', 'Product Strategy', 'Resume Review', 'AI/ML Products', 'Case Study Frameworks'],
    education: [
      { degree: 'B.Tech in Computer Science & Engineering', school: 'Delhi Technological University', year: 2018 },
      { degree: 'Product Management Executive Certificate', school: 'Product School', year: 2020 }
    ],
    experienceTimeline: [
      { role: 'Senior Product Manager', company: 'Microsoft', period: '2021 - Present', description: 'Driving product strategy for developer tooling and artificial intelligence APIs on Azure.' },
      { role: 'Product Manager II', company: 'Microsoft', period: '2019 - 2021', description: 'Led features for collaboration workflows in Microsoft Teams, driving 12% increase in active users.' },
      { role: 'Associate PM', company: 'Microsoft', period: '2018 - 2019', description: 'Rotational program across Xbox Cloud Gaming and Office suite integrations.' }
    ],
    sessionFormats: ['1:1 career guidance', 'resume review', 'mock interview'],
    availableSlots: ['Wednesday 4:00 PM', 'Wednesday 5:00 PM', 'Friday 2:00 PM', 'Friday 3:00 PM'],
    isVerified: true,
    reviews: [
      { id: 'r1_1', studentName: 'Avishi Khanna', rating: 5, date: '2026-06-20', comment: 'Rhea gave me incredible feedback on my PM resume. She literally rephrased my bullet points to highlight product outcomes rather than just technical tasks. Highly recommend!' },
      { id: 'r1_2', studentName: 'Rohan Sharma', rating: 5, date: '2026-05-15', comment: 'Great mock interview session! Her structured case framework helped me break down a complex system design question with absolute ease.' }
    ]
  },
  {
    id: 'm2',
    name: 'Arjun Mehta',
    role: 'Staff Software Engineer',
    company: 'Google',
    domain: 'Software Engineering',
    experience: 9,
    bio: 'Tech lead on Google Search Infrastructure. Algorithms enthusiast, system architecture expert, and competitive programmer mentor.',
    longBio: 'Arjun is a Staff Software Engineer at Google, working on core ranking infrastructure. He graduated in 2017 with high honors and has since focused on highly-scalable distributed systems. He has a deep love for algorithms, data structures, and low-level optimization. Arjun is highly committed to guiding students through technical engineering interviews, offering precise strategies to excel in LeetCode-style assessments and system design principles.',
    location: 'Mountain View, CA (Remote Friendly)',
    gradYear: 2017,
    availability: 'Booking fast',
    rating: 4.8,
    sessionsCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['System Design', 'Algorithms & Data Structures', 'Big Data Engineering', 'Mock Interviews', 'Backend Architecture'],
    education: [
      { degree: 'B.Tech in Computer Science', school: 'BITS Pilani', year: 2017 }
    ],
    experienceTimeline: [
      { role: 'Staff Software Engineer', company: 'Google', period: '2023 - Present', description: 'Technical lead for core index crawling pipeline serving billions of daily active queries.' },
      { role: 'Senior Software Engineer', company: 'Google', period: '2020 - 2023', description: 'Designed high-throughput distributed message brokers for Google Cloud services.' },
      { role: 'Software Engineer II', company: 'Google', period: '2017 - 2020', description: 'Developed low-latency search APIs and microservices.' }
    ],
    sessionFormats: ['1:1 career guidance', 'mock interview', 'resume review'],
    availableSlots: ['Tuesday 10:00 AM', 'Thursday 2:00 PM', 'Thursday 3:00 PM'],
    isVerified: true,
    reviews: [
      { id: 'r2_1', studentName: 'Preeti Deshmukh', rating: 5, date: '2026-06-12', comment: 'Arjuns guidance on system design was exceptional. He mapped out clear guidelines on how to discuss scaling, caching, and database partitioning.' },
      { id: 'r2_2', studentName: 'Aditya Sen', rating: 4, date: '2026-04-18', comment: 'Very intense mock interview. He asked tough questions but his feedback on time complexity analysis was invaluable.' }
    ]
  },
  {
    id: 'm3',
    name: 'Naina Bansal',
    role: 'Investment Analyst',
    company: 'Goldman Sachs',
    domain: 'Finance',
    experience: 4,
    bio: 'Investment banker turned analyst. Specializes in equity research, venture capital evaluation, corporate valuation, and consulting prep.',
    longBio: 'Naina is an Investment Analyst at Goldman Sachs in New York, focusing on technology, media, and telecom (TMT) equities. She graduated with a degree in Economics & Business Finance in 2020. Having successfully broken into Wall Street from a non-Ivy university, she provides actionable, real-world advice to students on networking strategies, modeling tests, resume customization, and quantitative interviews.',
    location: 'New York, NY',
    gradYear: 2020,
    availability: 'Available this week',
    rating: 4.9,
    sessionsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['Financial Modeling', 'Corporate Finance', 'Investment Banking Prep', 'Networking Strategies', 'Equity Research'],
    education: [
      { degree: 'B.Sc in Finance & Economics', school: 'SRCC, Delhi University', year: 2020 },
      { degree: 'Chartered Financial Analyst (CFA) Level II Passed', school: 'CFA Institute', year: 2022 }
    ],
    experienceTimeline: [
      { role: 'Investment Analyst', company: 'Goldman Sachs', period: '2022 - Present', description: 'Publishing equity research and conducting financial analysis on public tech conglomerates.' },
      { role: 'Financial Analyst', company: 'J.P. Morgan', period: '2020 - 2022', description: 'Assisted in private placement and leveraged buyout advisory deals amounting to $1.2B.' }
    ],
    sessionFormats: ['1:1 career guidance', 'resume review'],
    availableSlots: ['Monday 8:00 AM', 'Wednesday 8:00 AM', 'Thursday 9:00 AM'],
    isVerified: true,
    reviews: [
      { id: 'r3_1', studentName: 'Dev Patel', rating: 5, date: '2026-06-01', comment: 'Naina gave me a masterclass on how to cold email bankers and build a solid pitch. Absolute game-changer.' }
    ]
  },
  {
    id: 'm4',
    name: 'Kabir Shah',
    role: 'Senior UX Designer',
    company: 'Adobe',
    domain: 'Design',
    experience: 7,
    bio: 'Interaction designer and design educator. Mentoring students on building beautiful, developer-friendly UX portfolios.',
    longBio: 'Kabir is a Senior UX Designer at Adobe, working on future-focused creative collaboration tools. He is deeply interested in human-computer interaction, inclusive design, and the intersection of visual art and technology. Kabir regularly guides aspiring product designers on portfolio storytelling, wireframing, user research methodologies, and presentation skills to stand out during creative reviews.',
    location: 'San Francisco, CA',
    gradYear: 2019,
    availability: 'Available this week',
    rating: 5.0,
    sessionsCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['Portfolio Review', 'UI/UX Best Practices', 'User Research', 'Design System Architecture', 'Figma Prototyping'],
    education: [
      { degree: 'B.Des in Communication Design', school: 'National Institute of Design', year: 2019 }
    ],
    experienceTimeline: [
      { role: 'Senior UX Designer', company: 'Adobe', period: '2022 - Present', description: 'Leading end-to-end design strategy for mobile drawing apps and cross-device syncing workflows.' },
      { role: 'Product Designer', company: 'Framer', period: '2020 - 2022', description: 'Collaborated on layout engines, interactive component builders, and canvas animations.' },
      { role: 'UX Designer', company: 'Zomato', period: '2019 - 2020', description: 'Redesigned core food ordering checkout screens, improving conversion rate by 4.2%.' }
    ],
    sessionFormats: ['1:1 career guidance', 'portfolio review', 'resume review'],
    availableSlots: ['Monday 3:00 PM', 'Tuesday 4:00 PM', 'Thursday 5:00 PM'],
    isVerified: true,
    reviews: [
      { id: 'r4_1', studentName: 'Sanya Gupta', rating: 5, date: '2026-06-25', comment: 'The portfolio review with Kabir was incredibly detailed. He helped me restructure my case studies to make my problem-solving process shine.' }
    ]
  },
  {
    id: 'm5',
    name: 'Ishita Verma',
    role: 'Founder',
    company: 'EdTech Startup (SkillUp)',
    domain: 'Entrepreneurship',
    experience: 8,
    bio: 'Y-Combinator alumnus. Passionate about venture capital fundraising, zero-to-one growth hacking, and tech product launches.',
    longBio: 'Ishita is the founder and CEO of SkillUp, a venture-backed EdTech platform empowering college students in tier-2 cities. She started her career in product design but quickly fell in love with business building. After getting accepted into Y-Combinator in 2021, she raised a $3M seed round. She loves mentoring student builders, startup founders, and anyone interested in raising capital or building product prototypes from scratch.',
    location: 'Bengaluru, India (Remote Friendly)',
    gradYear: 2016,
    availability: 'Next week',
    rating: 4.7,
    sessionsCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['Fundraising & Pitches', 'Growth Hacking', 'Zero-to-One Product Launch', 'Market Validation', 'Business Modeling'],
    education: [
      { degree: 'B.Tech in Information Technology', school: 'IIIT Allahabad', year: 2016 }
    ],
    experienceTimeline: [
      { role: 'Founder & CEO', company: 'SkillUp', period: '2021 - Present', description: 'Built an EdTech platform educating over 150k+ students. Raised seed capital from Tier-1 VCs.' },
      { role: 'Lead Growth Manager', company: 'Razorpay', period: '2018 - 2021', description: 'Grew active merchant acquisition by 3x through structural product-led loops.' },
      { role: 'Product Analyst', company: 'Flipkart', period: '2016 - 2018', description: 'Analyzed user churn paths and structured mobile app notifications pipelines.' }
    ],
    sessionFormats: ['1:1 career guidance', 'higher studies guidance'],
    availableSlots: ['Friday 11:00 AM', 'Friday 12:00 PM'],
    isVerified: true,
    reviews: [
      { id: 'r5_1', studentName: 'Kabir Chawla', rating: 5, date: '2026-05-20', comment: 'Ishita gave me brutally honest advice on our pitch deck. Her pointers on articulating our product-led growth loops were gold!' }
    ]
  },
  {
    id: 'm6',
    name: 'Siddharth Rao',
    role: 'Senior Data Scientist',
    company: 'Amazon',
    domain: 'Research',
    experience: 11,
    bio: 'AI researcher and forecasting expert. Guidance on machine learning research papers, PhD applications, and corporate ML roles.',
    longBio: 'Siddharth has spent more than a decade at the intersection of quantitative modeling, machine learning, and business intelligence. Currently a Senior Data Scientist at Amazon, he manages predictive inventory networks powered by deep learning models. He holds a Masters degree from Carnegie Mellon University and advises students who are trying to choose between academic research paths, PhD programs, and private industry ML positions.',
    location: 'Boston, MA',
    gradYear: 2015,
    availability: 'Available this week',
    rating: 4.9,
    sessionsCount: 51,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    expertise: ['Machine Learning Systems', 'Predictive Modeling', 'PhD / Masters Admissions', 'Research Methodologies', 'Statistical Analysis'],
    education: [
      { degree: 'M.S. in Machine Learning & Data Science', school: 'Carnegie Mellon University', year: 2017 },
      { degree: 'B.Tech in Computer Science', school: 'IIT Madras', year: 2015 }
    ],
    experienceTimeline: [
      { role: 'Senior Data Scientist', company: 'Amazon', period: '2020 - Present', description: 'Leading algorithms for demand forecasting and supply chain inventory planning.' },
      { role: 'Data Scientist II', company: 'Uber', period: '2017 - 2020', description: 'Developed dynamic surge-pricing algorithms and ride duration prediction networks.' }
    ],
    sessionFormats: ['1:1 career guidance', 'higher studies guidance', 'resume review'],
    availableSlots: ['Wednesday 9:00 AM', 'Friday 4:00 PM'],
    isVerified: true,
    reviews: [
      { id: 'r6_1', studentName: 'Anita Krishnan', rating: 5, date: '2026-06-15', comment: 'Siddharth gave me an incredibly clear blueprint for MS in CS applications. He highlighted how to emphasize research experiences rather than just grades.' }
    ]
  }
];

export const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'req_1',
    mentorId: 'm1',
    mentorName: 'Rhea Kapoor',
    mentorRole: 'Product Manager',
    mentorCompany: 'Microsoft',
    mentorImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    sessionTopic: 'resume review',
    date: '2026-07-08',
    time: '4:00 PM',
    status: 'Accepted',
    dateRequested: '2026-07-01',
    message: 'Hi Rhea, I am currently applying for APM internships and would love if you could review my resume and share some tips on highlighting product-centric outcomes. Thanks!',
    timeline: [
      { status: 'Pending', date: '2026-07-01', comment: 'Request sent by Avishi' },
      { status: 'Accepted', date: '2026-07-03', comment: 'Accepted by Rhea. Meeting link created.' }
    ]
  },
  {
    id: 'req_2',
    mentorId: 'm2',
    mentorName: 'Arjun Mehta',
    mentorRole: 'Staff Software Engineer',
    mentorCompany: 'Google',
    mentorImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
    sessionTopic: 'mock interview',
    date: '2026-07-16',
    time: '2:00 PM',
    status: 'Pending',
    dateRequested: '2026-07-05',
    message: 'Hello Arjun! I have a Google backend interview coming up in 3 weeks. I would be deeply grateful if we could do a mock technical interview focusing on binary trees and graphs, followed by some system design feedback.',
    timeline: [
      { status: 'Pending', date: '2026-07-05', comment: 'Request submitted' }
    ]
  },
  {
    id: 'req_3',
    mentorId: 'm3',
    mentorName: 'Naina Bansal',
    mentorRole: 'Investment Analyst',
    mentorCompany: 'Goldman Sachs',
    mentorImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
    sessionTopic: '1:1 career guidance',
    date: '2026-06-25',
    time: '8:00 AM',
    status: 'Completed',
    dateRequested: '2026-06-18',
    message: 'Hi Naina, I want to understand what skills Goldman Sachs looks for in junior analyst candidates, and how I can prepare myself quantitatively during my final year.',
    timeline: [
      { status: 'Pending', date: '2026-06-18', comment: 'Request submitted' },
      { status: 'Accepted', date: '2026-06-19', comment: 'Naina accepted the session' },
      { status: 'Completed', date: '2026-06-25', comment: 'Session marked complete' }
    ]
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p1',
    authorName: 'Preeti Deshmukh',
    authorRole: 'CS Senior',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    category: 'Internships',
    title: 'How should I prepare for product management internships?',
    content: 'I am a computer science senior trying to break into Product Management. I have several software dev projects but zero product-specific experience. What resources, books, or interview prep techniques are absolutely essential to land an APM internship? Should I build a side project specifically highlighting product spec work?',
    likes: 24,
    commentsCount: 3,
    views: 184,
    timestamp: '2026-07-04T14:30:00Z',
    likedByUser: true,
    savedByUser: true,
    replies: [
      {
        id: 'rep1_1',
        authorName: 'Rhea Kapoor',
        authorRole: 'Alumni \'18 | Product Manager at Microsoft',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Hi Preeti! First of all, having CS projects is a MASSIVE advantage. Product engineering teams love PMs who understand code. \n\nHere is my playbook for APM prep:\n1. **Core Reading**: Read "Cracking the PM Interview" (by Gayle McDowell) and "Decode and Conquer" (by Lewis Lin). These teach you the basic circles framework, estimation models, and metrics structures.\n2. **Product Teardowns**: Pick an app you use daily (like Spotify or Uber). Write a 1-page spec of how you would improve a specific feature. Map out the goal, user personas, wireframes, and metrics. Put this on a personal blog—it works wonders during resumes reviews!\n3. **Mock Interviews**: Do at least 15-20 live mock interviews with other PM candidates on sites like StellarPeers or with alumni here. Speed is key, but structured reasoning is what gets you hired.',
        timestamp: '2026-07-04T16:15:00Z',
        isPinnedAnswer: true,
        likes: 18,
        likedByUser: false
      },
      {
        id: 'rep1_2',
        authorName: 'Siddharth Rao',
        authorRole: 'Alumni \'15 | Sr. Data Scientist at Amazon',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Adding to Rheas point: Make sure to brush up on SQL and analytical metrics (A/B testing, cohort retention). Modern PMs are highly data-driven. Knowing how to define success quantitatively is super attractive to recruiters!',
        timestamp: '2026-07-05T09:20:00Z',
        likes: 8,
        likedByUser: false
      }
    ]
  },
  {
    id: 'p2',
    authorName: 'Rohan Sen',
    authorRole: 'EE Junior',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150',
    category: 'Placements',
    title: 'What projects helped you stand out during placements?',
    content: 'We have campus placement season commencing in two months. Recruiters always skip past basic "todo-list" apps or weather forecasts. Alumni, what projects did you put on your resume that actually triggered detailed technical discussions during your interview? Looking for non-trivial ideas.',
    likes: 31,
    commentsCount: 2,
    views: 245,
    timestamp: '2026-07-03T10:00:00Z',
    replies: [
      {
        id: 'rep2_1',
        authorName: 'Arjun Mehta',
        authorRole: 'Alumni \'17 | Staff Engineer at Google',
        authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Spot-on observation, Rohan. As an interviewer, I immediately ignore standard React boilerplate clones. \n\nInstead, focus on projects that demonstrate **systems understanding** or **real utility**:\n1. **Build a custom server or rate limiter**: Implement a basic Redis-like key-value store in Go or Rust with TTL support, or a token-bucket rate limiter middleware. This forces you to handle concurrency, mutexes, and low-level network sockets.\n2. **A distributed crawler**: Build a crawler that fetches web pages, parses them, handles rate limits gracefully, and stores links in a graph format. This shows you understand multi-threading, network protocols, and storage optimizations.\n3. **Contribute to Open Source**: Even minor bug fixes or documentation edits in respected libraries (like express, fastify, or Tailwind) carry more weight than 5 boilerplate apps.',
        timestamp: '2026-07-03T11:45:00Z',
        isPinnedAnswer: true,
        likes: 22
      }
    ]
  },
  {
    id: 'p3',
    authorName: 'Megha Iyer',
    authorRole: 'SDE at Salesforce (Alumni \'24)',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    category: 'Higher Studies',
    title: 'Is a master’s abroad worth it after two years of work experience?',
    content: 'I have been working as an SDE-1 at Salesforce for 22 months. I am contemplating applying for an MS in CS in the USA/Europe for Fall 2027. Some of my seniors recommend staying in India since the developer tech market here is booming, while others swear by the global exposure. Would appreciate hearing from alumni who did an MS after working for 2-3 years.',
    likes: 19,
    commentsCount: 1,
    views: 192,
    timestamp: '2026-07-01T08:00:00Z',
    replies: [
      {
        id: 'rep3_1',
        authorName: 'Siddharth Rao',
        authorRole: 'Alumni \'15 | Senior Data Scientist at Amazon',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
        content: 'Megha, doing my MS at CMU after 2 years of work at Oracle was the best decision of my life, but the market is indeed different today. \n\nWith 2 years of experience, you have a massive advantage: \n1. Your resume stands out for **graduate co-ops/internships**. Finding a job will be substantially easier for you compared to fresh graduates.\n2. You actually understand software lifecycle, which makes coursework much more digestible.\n\nHowever, do it only if: you want to pivot to a specialized sub-field (like AI/Systems), or you genuinely want to relocate globally. If it\'s purely for salary progression, the compounding growth of staying inside tech hubs in India (with remote work/VC funding) can easily rival standard overseas returns today.',
        timestamp: '2026-07-01T15:30:00Z',
        likes: 15
      }
    ]
  },
  {
    id: 'p4',
    authorName: 'Akash Roy',
    authorRole: 'Alumni \'22 | Analyst at McKinsey',
    authorAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=150&h=150',
    category: 'Career Advice',
    title: 'How do I transition from software development to consulting?',
    content: 'Currently a developer at a FinTech firm but I want to transition into Management Consulting (MBB). How are technical hires evaluated? Do they look for deep domain expertise, or is it strictly case-study competency? How should I tailor my software engineering resume to highlight advisory and product-thinking potential?',
    likes: 15,
    commentsCount: 0,
    views: 110,
    timestamp: '2026-06-28T11:00:00Z',
    replies: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Request Accepted!',
    message: 'Rhea Kapoor accepted your Resume Review request. The meeting link has been scheduled for Wednesday at 4:00 PM.',
    timestamp: '2026-07-03T10:00:00Z',
    read: false,
    type: 'request'
  },
  {
    id: 'n2',
    title: 'New Forum Reply',
    message: 'Rhea Kapoor pinned an answer on your discussion "How should I prepare for product management internships?".',
    timestamp: '2026-07-04T16:15:00Z',
    read: false,
    type: 'forum'
  },
  {
    id: 'n3',
    title: 'Platform Welcome',
    message: 'Welcome to the Alumni Mentorship Platform! Complete your profile to get personalized recommendations.',
    timestamp: '2026-07-01T09:00:00Z',
    read: true,
    type: 'system'
  }
];
