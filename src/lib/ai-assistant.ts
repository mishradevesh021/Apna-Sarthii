export interface DiagnosisResult {
  categorySlug: string;
  categoryName: string;
  suggestedService: string;
  extractedProblem: string;
  urgency: 'ASAP' | 'TODAY' | 'TOMORROW';
  confidence: number;
  safetyAdvice?: string;
  estimatedPriceRange?: string;
}

export function diagnoseServiceProblem(userQuery: string): DiagnosisResult {
  const query = userQuery.toLowerCase().trim();

  // Electrician intent
  if (
    query.includes('spark') ||
    query.includes('switch') ||
    query.includes('wiring') ||
    query.includes('short circuit') ||
    query.includes('fuse') ||
    query.includes('mcb') ||
    query.includes('light') ||
    query.includes('fan') ||
    query.includes('electric') ||
    query.includes('socket') ||
    query.includes('tripping') ||
    query.includes('inverter')
  ) {
    const isUrgent = query.includes('spark') || query.includes('smoke') || query.includes('short');
    return {
      categorySlug: 'electrician',
      categoryName: 'Electrician',
      suggestedService: query.includes('fan') ? 'Ceiling Fan Repair / Installation' : 'Electrical Wiring & Switchboard Repair',
      extractedProblem: userQuery,
      urgency: isUrgent ? 'ASAP' : 'TODAY',
      confidence: 0.94,
      safetyAdvice: isUrgent
        ? '⚠️ Caution: Please turn off your main MCB switch immediately before the electrician arrives.'
        : 'Ensure switchboards are kept dry.',
      estimatedPriceRange: '₹199 - ₹450',
    };
  }

  // Plumbing intent
  if (
    query.includes('pipe') ||
    query.includes('leak') ||
    query.includes('tap') ||
    query.includes('water') ||
    query.includes('drain') ||
    query.includes('clog') ||
    query.includes('sink') ||
    query.includes('plumb') ||
    query.includes('flush') ||
    query.includes('tank') ||
    query.includes('shower')
  ) {
    return {
      categorySlug: 'plumber',
      categoryName: 'Plumber',
      suggestedService: query.includes('leak') ? 'Pipe Leakage & Tap Replacement' : 'Drain Blockage & Sanitary Fitting',
      extractedProblem: userQuery,
      urgency: query.includes('burst') || query.includes('overflow') ? 'ASAP' : 'TODAY',
      confidence: 0.95,
      safetyAdvice: 'Turn off the main overhead water valve if water is overflowing.',
      estimatedPriceRange: '₹200 - ₹500',
    };
  }

  // AC & Cooling intent
  if (
    query.includes('ac') ||
    query.includes('cooling') ||
    query.includes('air condition') ||
    query.includes('gas refilling') ||
    query.includes('filter') ||
    query.includes('compressor')
  ) {
    return {
      categorySlug: 'ac-repair',
      categoryName: 'AC Repair & Service',
      suggestedService: 'Split/Window AC Deep Servicing & Gas Check',
      extractedProblem: userQuery,
      urgency: 'TODAY',
      confidence: 0.96,
      safetyAdvice: 'Turn off the AC stabilizer if there is unusual buzzing sound.',
      estimatedPriceRange: '₹399 - ₹899',
    };
  }

  // Appliance intent (Washing machine, Refrigerator, Microwave)
  if (
    query.includes('washing machine') ||
    query.includes('fridge') ||
    query.includes('refrigerator') ||
    query.includes('microwave') ||
    query.includes('oven') ||
    query.includes('spin') ||
    query.includes('drum')
  ) {
    return {
      categorySlug: 'appliance-repair',
      categoryName: 'Appliance Repair',
      suggestedService: query.includes('washing') ? 'Washing Machine Motor & Drum Repair' : 'Refrigerator Cooling & Thermostat Repair',
      extractedProblem: userQuery,
      urgency: 'TODAY',
      confidence: 0.92,
      safetyAdvice: 'Disconnect power cable from wall socket before inspection.',
      estimatedPriceRange: '₹299 - ₹650',
    };
  }

  // Carpenter intent
  if (
    query.includes('wood') ||
    query.includes('door') ||
    query.includes('furniture') ||
    query.includes('hinge') ||
    query.includes('bed') ||
    query.includes('cupboard') ||
    query.includes('carpenter') ||
    query.includes('lock')
  ) {
    return {
      categorySlug: 'carpenter',
      categoryName: 'Carpenter',
      suggestedService: 'Furniture Repair & Door Fitting',
      extractedProblem: userQuery,
      urgency: 'TODAY',
      confidence: 0.91,
      estimatedPriceRange: '₹250 - ₹600',
    };
  }

  // Painter intent
  if (query.includes('paint') || query.includes('wall') || query.includes('putty') || query.includes('seepage') || query.includes('color')) {
    return {
      categorySlug: 'painter',
      categoryName: 'Painter',
      suggestedService: 'Home Painting & Seepage Waterproofing',
      extractedProblem: userQuery,
      urgency: 'TOMORROW',
      confidence: 0.9,
      estimatedPriceRange: '₹500 - ₹2000',
    };
  }

  // Mason / Construction intent
  if (query.includes('mason') || query.includes('brick') || query.includes('cement') || query.includes('plaster') || query.includes('tile') || query.includes('mistri')) {
    return {
      categorySlug: 'mason',
      categoryName: 'Mason / Mistri',
      suggestedService: 'Tile Fixing, Plastering & Brickwork',
      extractedProblem: userQuery,
      urgency: 'TOMORROW',
      confidence: 0.9,
      estimatedPriceRange: '₹400 - ₹800/day',
    };
  }

  // RO / Water purifier intent
  if (query.includes('ro') || query.includes('filter') || query.includes('water purifier') || query.includes('kent') || query.includes('aquaguard')) {
    return {
      categorySlug: 'ro-technician',
      categoryName: 'RO Technician',
      suggestedService: 'RO Membrane & Filter Replacement',
      extractedProblem: userQuery,
      urgency: 'TODAY',
      confidence: 0.93,
      estimatedPriceRange: '₹250 - ₹550',
    };
  }

  // Default fallback
  return {
    categorySlug: 'electrician',
    categoryName: 'General Technician',
    suggestedService: 'General Home Inspection & Repair',
    extractedProblem: userQuery,
    urgency: 'TODAY',
    confidence: 0.75,
    estimatedPriceRange: '₹250 - ₹500',
  };
}
