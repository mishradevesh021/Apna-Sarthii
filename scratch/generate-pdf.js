const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createMasterGuidePDF() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89; // A4
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkPageBreak(neededHeight = 40) {
    if (y - neededHeight < margin + 30) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    currentPage.drawText('SARTHI -- Hackathon Master Defense & Architecture Guide', {
      x: margin,
      y: pageHeight - 25,
      size: 8,
      font: fontBold,
      color: rgb(0.39, 0.45, 0.55),
    });
    currentPage.drawLine({
      start: { x: margin, y: pageHeight - 30 },
      end: { x: pageWidth - margin, y: pageHeight - 30 },
      thickness: 0.5,
      color: rgb(0.85, 0.88, 0.92),
    });

    currentPage.drawLine({
      start: { x: margin, y: 35 },
      end: { x: pageWidth - margin, y: 35 },
      thickness: 0.5,
      color: rgb(0.85, 0.88, 0.92),
    });
    currentPage.drawText('Confidential -- Hackathon Defense Blueprint | Production Release v1.0', {
      x: margin,
      y: 22,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.65),
    });
  }

  // --- COVER PAGE ---
  currentPage.drawRectangle({
    x: margin - 15,
    y: margin - 15,
    width: pageWidth - (margin - 15) * 2,
    height: pageHeight - (margin - 15) * 2,
    color: rgb(0.04, 0.07, 0.17),
    borderColor: rgb(0.2, 0.35, 0.7),
    borderWidth: 2,
  });

  currentPage.drawRectangle({
    x: margin + 10,
    y: pageHeight - 120,
    width: 260,
    height: 24,
    color: rgb(0.15, 0.39, 0.92),
  });
  currentPage.drawText('HACKATHON MASTER DEFENSE GUIDE', {
    x: margin + 22,
    y: pageHeight - 113,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('SARTHI', {
    x: margin + 10,
    y: pageHeight - 170,
    size: 42,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  currentPage.drawText('(Your Trusted Guide)', {
    x: margin + 200,
    y: pageHeight - 165,
    size: 22,
    font: fontBold,
    color: rgb(0.96, 0.62, 0.04),
  });

  currentPage.drawText('"Aapki Sewa Ka Sachha Sarthi -- Finding the Right Pro, Done Right."', {
    x: margin + 12,
    y: pageHeight - 200,
    size: 11,
    font: fontOblique,
    color: rgb(0.7, 0.8, 0.95),
  });

  currentPage.drawText(
    'A Hyperlocal, AI-Guided On-Demand Worker Discovery & Job Dispatch Platform\nBuilt for Tier-2 & Tier-3 Indian Households & Local Tradesmen.',
    {
      x: margin + 12,
      y: pageHeight - 245,
      size: 10.5,
      font: fontRegular,
      color: rgb(0.85, 0.9, 0.98),
      lineHeight: 16,
    }
  );

  currentPage.drawRectangle({
    x: margin + 10,
    y: 110,
    width: contentWidth - 20,
    height: 290,
    color: rgb(0.08, 0.12, 0.25),
    borderColor: rgb(0.25, 0.35, 0.55),
    borderWidth: 1,
  });

  const coverDetails = [
    ['PROJECT TRACK', 'Full-Stack Web | AI for Social Good | Hyperlocal SaaS Platform'],
    ['TECH STACK', 'Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, JWT, Bcrypt'],
    ['ALGORITHMS', 'Haversine Proximity Formula + Smart Match Scoring + NLP Problem Diagnostician'],
    ['TARGET DEMO', 'Tier-2 & Tier-3 Indian Cities (Prayagraj, Lucknow, Varanasi, Indore, Patna)'],
    ['DATABASE', '13 Relational Tables (Users, Profiles, Requests, Timeline Audit, Reviews)'],
    ['REPOSITORY', 'github.com/mishradevesh021/Apna-Sarthii'],
    ['PREPARED FOR', 'Hackathon Jury, Technical Evaluators & Product Investors'],
  ];

  let coverY = 370;
  coverDetails.forEach(([lbl, val]) => {
    currentPage.drawText(lbl, {
      x: margin + 25,
      y: coverY,
      size: 8,
      font: fontBold,
      color: rgb(0.4, 0.65, 1.0),
    });
    currentPage.drawText(val, {
      x: margin + 25,
      y: coverY - 14,
      size: 9,
      font: fontRegular,
      color: rgb(0.95, 0.95, 0.95),
    });
    coverY -= 36;
  });

  currentPage.drawText('Production Release v1.0.0 | Complete Architectural Breakdown & Q&A Defense', {
    x: margin + 15,
    y: 65,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.7, 0.85),
  });

  // Helper functions for content pages
  function drawH1(text) {
    checkPageBreak(50);
    y -= 14;
    currentPage.drawRectangle({
      x: margin,
      y: y - 3,
      width: contentWidth,
      height: 20,
      color: rgb(0.93, 0.96, 1.0),
    });
    currentPage.drawText(text, {
      x: margin + 6,
      y: y + 3,
      size: 11,
      font: fontBold,
      color: rgb(0.08, 0.25, 0.65),
    });
    y -= 16;
  }

  function drawH2(text) {
    checkPageBreak(30);
    y -= 8;
    currentPage.drawText(text, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontBold,
      color: rgb(0.12, 0.18, 0.3),
    });
    y -= 12;
  }

  function drawPara(text, size = 8.5, indent = 0) {
    const words = text.split(' ');
    let line = '';
    const maxChars = Math.floor((contentWidth - indent) / (size * 0.52));

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      if (testLine.length > maxChars) {
        checkPageBreak(14);
        currentPage.drawText(line, {
          x: margin + indent,
          y: y,
          size: size,
          font: fontRegular,
          color: rgb(0.2, 0.25, 0.35),
        });
        y -= size + 3;
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line) {
      checkPageBreak(14);
      currentPage.drawText(line, {
        x: margin + indent,
        y: y,
        size: size,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.35),
      });
      y -= size + 5;
    }
  }

  function drawBullet(title, body) {
    checkPageBreak(20);
    currentPage.drawText('* ' + title + ': ', {
      x: margin + 6,
      y: y,
      size: 8.2,
      font: fontBold,
      color: rgb(0.1, 0.2, 0.4),
    });
    const titleWidth = fontBold.widthOfTextAtSize('* ' + title + ': ', 8.2);
    drawPara(body, 8.2, titleWidth + 6);
  }

  function drawCard(q, a) {
    checkPageBreak(65);
    y -= 6;
    currentPage.drawText(q, {
      x: margin + 4,
      y: y,
      size: 9,
      font: fontBold,
      color: rgb(0.08, 0.2, 0.5),
    });
    y -= 12;
    drawPara(a, 8.2, 10);
    y -= 4;
  }

  // --- CONTENT PAGES ---
  currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - margin;
  drawHeaderFooter();

  drawH1('1. EXECUTIVE SUMMARY & PROBLEM STATEMENT');
  drawPara(
    'SARTHI addresses the unorganized $50 Billion home services market across Tier-2 and Tier-3 Indian cities. Today, households face 4 critical barriers: (1) 25-35% middleman commission markups from conglomerate apps, (2) Spam calling directory models (JustDial), (3) Zero identity and background verification, and (4) Opaque pricing where customers are routinely overcharged for simple fixes.'
  );
  drawPara(
    'Sarthi solves this with a mobile-first, zero-commission hyperlocal ecosystem featuring an AI Problem Diagnostician, Haversine proximity-first smart matching, in-app safety tracking, and a 6-stage real-time job timeline.'
  );

  drawH1('2. FULL-STACK TECHNICAL ARCHITECTURE');
  drawBullet('Frontend Framework', 'Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide Icons + Framer Motion.');
  drawBullet('State & Auth', 'Stateless signed JSON Web Tokens (Jose 5.9) in HTTP-only SameSite=Lax cookies + Bcrypt password hashing.');
  drawBullet('Database & ORM', 'Prisma 5.21 with 13 Relational Tables (Dual PostgreSQL & SQLite compatibility).');
  drawBullet('Resilience Layer', 'In-memory fallback seed store ensuring zero-cold-start stability on serverless platforms like Vercel.');
  drawBullet('Validation & Guards', 'Zod 3.23 schema validation + Server-side Role-Based Access Control (requireRole).');

  drawH1('3. CORE ALGORITHMIC & AI INNOVATIONS');
  drawH2('A. Haversine Distance & Smart Matchmaking Formula (src/lib/matching.ts)');
  drawPara(
    'Sarthi implements geodesic distance calculation using the Haversine formula on spherical coordinates: d = 2R * arcsin( sqrt( sin^2(dLat/2) + cos(lat1)*cos(lat2)*sin^2(dLon/2) ) ).'
  );
  drawPara(
    'Candidate Score (S) = (100 - 5 * distanceKm) + (Rating * 8) + (VerifiedBadge * 15) + (Availability * 10) + (EmergencyBonus * 10). This ensures the closest, highest-rated, and fully verified professional appears at the top.'
  );

  drawH2('B. Natural Language AI Problem Diagnostician (src/lib/ai-assistant.ts)');
  drawPara(
    'Customers describe their issue in plain language (e.g., "fan regulator is sparking and humming"). The NLU engine parses intent tokens, maps them to the exact service trade (Electrician), calculates labor cost benchmarks (Rs. 250), and surfaces critical safety warnings ("Turn off main MCB breaker before inspecting").'
  );

  drawH1('4. THE 6-STAGE JOB LIFECYCLE STATE MACHINE');
  drawPara('Every booking creates an immutable audit trail across 6 deterministic states:');
  drawBullet('1. REQUESTED', 'Customer books with address, urgency, and estimated budget.');
  drawBullet('2. ACCEPTED', 'Worker receives instant alert and confirms dispatch.');
  drawBullet('3. ON_THE_WAY', 'Worker is en route with live status notification.');
  drawBullet('4. ARRIVED', 'Worker reaches customer premises.');
  drawBullet('5. IN_PROGRESS', 'Repair is actively performed under recorded timeline.');
  drawBullet('6. COMPLETED', 'Job finished, customer submits 5-star review, rating dynamically recalculated.');

  drawH1('5. CODEBASE REFERENCE & KEY DIRECTORIES');
  drawBullet('src/app/page.tsx', 'Home page master layout with CategoryGrid, SearchHero, and Worker Cards.');
  drawBullet('src/components/home/CategoryGrid.tsx', '12 Trade categories with screenshot-accurate colored badges & SVG icons.');
  drawBullet('src/components/ai/AIDiagnoseModal.tsx', 'Interactive AI assistant with instant symptom triage.');
  drawBullet('src/app/worker/dashboard/page.tsx', 'Worker dispatch terminal with status advance buttons.');
  drawBullet('src/app/admin/page.tsx', 'Admin Command Center with All Users & Workers directory.');
  drawBullet('prisma/schema.prisma', 'Complete relational schema definitions.');

  drawH1('6. WINNING HACKATHON PITCH SCRIPT');
  drawH2('The 30-Second Elevator Pitch:');
  drawPara(
    '"Good morning judges. When an electrical spark happens or a pipe bursts at night in Tier-2/3 India, households face chaotic directories, overpriced middlemen, and unverified strangers. We built SARTHI -- an AI-guided, mobile-first hyperlocal platform matching customers with verified neighborhood electricians and plumbers in under 30 seconds. Featuring plain-language AI problem diagnosis, upfront pricing, live tracking, and zero worker commissions, Sarthi empowers both Bharat households and local tradesmen."'
  );

  drawH2('The 3-Minute Live Demo Flow:');
  drawBullet('Step 1', 'Open Sarthi, use AI Problem Diagnostician to describe a sparking fan, observe auto-category & safety tips.');
  drawBullet('Step 2', 'Show distance-ranked workers, select Rahul Kumar (Electrician, 4.9*, 1.8 km away).');
  drawBullet('Step 3', 'Book service as Priya Singh (Customer).');
  drawBullet('Step 4', 'Use 1-click Demo Switcher in navbar to switch to Rahul Kumar (Worker), open dashboard, and progress status to COMPLETED.');
  drawBullet('Step 5', 'Switch back to Customer, submit 5-star review, and open Admin Command Center to view live user directory.');

  drawH1('7. TOP 10 HARDEST HACKATHON JUDGE Q&As');

  drawCard(
    'Q1: How is Sarthi different from Urban Company or JustDial?',
    'Urban Company takes 25-35% commission and focuses on metro Tier-1. JustDial sells phone numbers leading to spam calls. Sarthi is zero-commission, hyperlocal, protects user privacy with in-app chat, and provides live 6-stage status tracking.'
  );

  drawCard(
    'Q2: How do you prevent users and workers from bypassing the platform?',
    'Our Trust & Growth Flywheel: Every job completed on Sarthi increases the worker\'s verified count and search ranking, bringing them 10x more high-paying clients. Customers receive timeline audit safety and dispute resolution.'
  );

  drawCard(
    'Q3: How do you verify workers without expensive manual background checks?',
    'A 3-tier pipeline: (1) Aadhaar/Govt ID verification, (2) Trade credential and local association reference check, (3) Graduated community vetting (New Pro to Verified Master Pro after 5 high-rated jobs).'
  );

  drawCard(
    'Q4: What is your monetization and business model?',
    'Three sustainable streams: (1) Worker Premium Subscriptions (Rs. 199/mo for priority leads), (2) Micro-Insurance fee (Rs. 10/job for accidental damage cover), (3) Commercial B2B maintenance contracts.'
  );

  drawCard(
    'Q5: How does the application scale to millions of users?',
    'Built on Next.js 14 Serverless architecture with lightweight bundle size (87 kB shared), stateless JWT sessions in HTTP-only cookies, and connection-pooled PostgreSQL with Prisma ORM.'
  );

  drawH1('8. FUTURE ROADMAP & SUMMARY');
  drawBullet('Phase 1 (Current)', 'MVP pilot in Prayagraj & Lucknow with 100+ verified workers and AI assistant.');
  drawBullet('Phase 2', 'Vernacular Voice AI (Hindi, Bhojpuri, Tamil speech recognition) & WhatsApp Bot fallback.');
  drawBullet('Phase 3', 'Sarthi Suraksha: Rs. 50,000 on-duty worker health insurance and tool micro-financing.');

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'SARTHI_Hackathon_Master_Guide.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF created successfully at: ${outputPath} (${pdfBytes.length} bytes)`);
}

createMasterGuidePDF().catch(console.error);
