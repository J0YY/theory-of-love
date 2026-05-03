export type ChannelKind = "positive" | "anti";

export type CareChannel = {
  id: string;
  name: string;
  weight: number;
  intensity: number;
  variability: number;
  phase: number;
  saturation: number;
  kind: ChannelKind;
};

export type AttachmentStyle = "secure" | "anxious" | "avoidant" | "fearful";

export type PersonModel = {
  id: string;
  name: string;
  age: number;
  relationshipLengthYears: number;
  honeymoonPeakMonth: number;
  honeymoonPeakIntensity: number;
  stableEffort: number;
  compatibility: number;
  repairCapacity: number;
  noveltyCreation: number;
  reliability: number;
  baseline: number;
  floor: number;
  trust: number;
  attachmentStyle: AttachmentStyle;
  reservationUtility: number;
  marketAbundance: number;
  marketElasticity: number;
  genuineness: number;
  reflexivity: number;
  lossAversion: number;
  riskSensitivity: number;
  givingBaseline: number;
  givingResponsiveness: number;
  givingCapacity: number;
  positives: CareChannel[];
  antis: CareChannel[];
};

export type AppModel = {
  version: 1;
  threshold: number;
  horizon: number;
  self: PersonModel;
  partner: PersonModel;
};

export type CurvePoint = {
  t: number;
  age: number;
  lifecycle: number;
  plateau: number;
  honeymoon: number;
  positive: number;
  anti: number;
  natural: number;
  penalized: number;
  love: number;
  floor: number;
  reservation: number;
  trustGate: number;
  endRisk: number;
  giving: number;
};

export type CurveResult = {
  points: CurvePoint[];
  integral: number;
  average: number;
  peak: number;
  trough: number;
  averageRisk: number;
  peakRisk: number;
  givingIntegral: number;
  averageGiving: number;
  peakGiving: number;
  predictedPlateau: number;
  currentLove: number;
  currentRisk: number;
  currentAge: number;
};

export type DyadResult = {
  self: CurveResult;
  partner: CurveResult;
  horizon: number;
  totalIntegral: number;
  gap: number;
  exceedsThreshold: boolean;
  normalizedGap: number;
  averageEndRisk: number;
  peakEndRisk: number;
  totalGivingIntegral: number;
  givingGap: number;
  reciprocityMismatch: number;
  deadweightLoss: number;
  translationEfficiency: number;
};

export const attachmentPresets: Record<
  AttachmentStyle,
  Pick<PersonModel, "trust" | "floor" | "reflexivity" | "marketElasticity" | "riskSensitivity">
> = {
  secure: { trust: 72, floor: 28, reflexivity: 38, marketElasticity: 18, riskSensitivity: 34 },
  anxious: { trust: 56, floor: 20, reflexivity: 66, marketElasticity: 48, riskSensitivity: 74 },
  avoidant: { trust: 46, floor: 18, reflexivity: 24, marketElasticity: 34, riskSensitivity: 58 },
  fearful: { trust: 38, floor: 16, reflexivity: 58, marketElasticity: 58, riskSensitivity: 86 },
};

const positiveDefaults: CareChannel[] = [
  channel("attention", "Attention", 1.2, 74, 18, 0.2, 72, "positive"),
  channel("reliability", "Reliability", 1.45, 68, 8, 1.3, 82, "positive"),
  channel("affection", "Physical affection", 1.05, 58, 22, 2.1, 65, "positive"),
  channel("recognition", "Words of recognition", 0.95, 62, 16, 3.0, 70, "positive"),
];

const antiDefaults: CareChannel[] = [
  channel("withdrawal", "Withdrawal", 0.95, 22, 18, 2.4, 85, "anti"),
  channel("contempt", "Contempt", 1.5, 8, 14, 4.0, 95, "anti"),
];

export const defaultModel: AppModel = {
  version: 1,
  threshold: 8,
  horizon: 68,
  self: {
    id: "self",
    name: "Joy",
    age: 24,
    relationshipLengthYears: 1.2,
    honeymoonPeakMonth: 3,
    honeymoonPeakIntensity: 92,
    stableEffort: 82,
    compatibility: 86,
    repairCapacity: 74,
    noveltyCreation: 78,
    reliability: 80,
    baseline: 12,
    floor: 28,
    trust: 72,
    attachmentStyle: "secure",
    reservationUtility: 36,
    marketAbundance: 34,
    marketElasticity: 18,
    genuineness: 84,
    reflexivity: 38,
    lossAversion: 1.8,
    riskSensitivity: 34,
    givingBaseline: 18,
    givingResponsiveness: 36,
    givingCapacity: 82,
    positives: positiveDefaults,
    antis: antiDefaults,
  },
  partner: {
    id: "partner",
    name: "Socratito",
    age: 24,
    relationshipLengthYears: 1.2,
    honeymoonPeakMonth: 3,
    honeymoonPeakIntensity: 90,
    stableEffort: 80,
    compatibility: 84,
    repairCapacity: 76,
    noveltyCreation: 82,
    reliability: 78,
    baseline: 10,
    floor: 24,
    trust: 66,
    attachmentStyle: "secure",
    reservationUtility: 34,
    marketAbundance: 30,
    marketElasticity: 18,
    genuineness: 82,
    reflexivity: 36,
    lossAversion: 1.8,
    riskSensitivity: 34,
    givingBaseline: 17,
    givingResponsiveness: 34,
    givingCapacity: 78,
    positives: [
      channel("time", "Quality time", 1.35, 70, 14, 0.9, 78, "positive"),
      channel("play", "Play and novelty", 1.05, 54, 28, 2.6, 66, "positive"),
      channel("care", "Tender care", 1.2, 62, 10, 3.4, 80, "positive"),
    ],
    antis: [
      channel("distance", "Emotional distance", 1.1, 18, 18, 1.8, 86, "anti"),
      channel("inconsistency", "Inconsistency", 1.0, 16, 12, 4.2, 82, "anti"),
    ],
  },
};

export function channel(
  id: string,
  name: string,
  weight: number,
  intensity: number,
  variability: number,
  phase: number,
  saturation: number,
  kind: ChannelKind,
): CareChannel {
  return { id, name, weight, intensity, variability, phase, saturation, kind };
}

export function createChannel(kind: ChannelKind, index: number): CareChannel {
  return channel(
    `${kind}-${Date.now()}-${index}`,
    kind === "positive" ? "New love language" : "New anti-love language",
    kind === "positive" ? 1 : 0.9,
    kind === "positive" ? 50 : 12,
    kind === "positive" ? 12 : 8,
    Math.random() * Math.PI * 2,
    kind === "positive" ? 70 : 85,
    kind,
  );
}

export function applyAttachmentPreset(person: PersonModel, attachmentStyle: AttachmentStyle): PersonModel {
  return {
    ...person,
    attachmentStyle,
    ...attachmentPresets[attachmentStyle],
  };
}

export function calculateCurve(person: PersonModel, horizon: number, samples = 121): CurveResult {
  const points: CurvePoint[] = [];
  const dt = horizon / (samples - 1);
  const predictedPlateau = predictPlateau(person);
  const peakYear = Math.max(0.08, person.honeymoonPeakMonth / 12);
  const peakTarget = Math.max(predictedPlateau + 4, person.honeymoonPeakIntensity);
  const ageAtStart = Math.max(0, person.age - person.relationshipLengthYears);

  for (let i = 0; i < samples; i += 1) {
    const t = Number((i * dt).toFixed(2));
    const trustGate = sigmoidGate(person.trust, person.genuineness);
    const positiveRaw = person.positives.reduce((sum, c) => sum + channelSignal(c, t, horizon), 0);
    const antiRaw = person.antis.reduce((sum, c) => sum + channelSignal(c, t, horizon), 0);
    const positive = normalizedChannelScore(person.positives, positiveRaw);
    const anti = normalizedChannelScore(person.antis, antiRaw) * person.lossAversion;
    const marketDrag = (person.marketAbundance / 100) * (person.marketElasticity / 100) * 18;
    const reflexiveLift = (person.reflexivity / 100) * Math.min(9, positive / 11);
    const lifecycle = lifecycleValue({
      t,
      peakYear,
      peakTarget,
      plateau: predictedPlateau,
    });
    const channelLift = (positive - 50) * 0.22;
    const trustAdjustment = (trustGate - 0.62) * 22;
    const natural = lifecycle + person.baseline * 0.34 + channelLift + trustAdjustment + reflexiveLift - marketDrag;
    const penalized = natural - anti;
    const floor = Math.max(0, person.floor - marketDrag * 0.45);
    const love = Math.max(floor, penalized);
    const reservation = person.reservationUtility + marketDrag * 0.7;
    const endRisk = calculateEndRisk({
      love,
      reservation,
      anti,
      positive,
      trustGate,
      floor,
      marketDrag,
      riskSensitivity: person.riskSensitivity,
    });
    const giving = calculateGiving({
      love,
      anti,
      floor,
      genuineness: person.genuineness,
      reflexivity: person.reflexivity,
      givingBaseline: person.givingBaseline,
      givingResponsiveness: person.givingResponsiveness,
      givingCapacity: person.givingCapacity,
    });

    points.push({
      t,
      age: round(ageAtStart + t),
      lifecycle: round(lifecycle),
      plateau: round(predictedPlateau),
      honeymoon: round(Math.max(0, lifecycle - predictedPlateau * (1 - Math.exp(-t / 1.6)))),
      positive: round(positive),
      anti: round(anti),
      natural: round(natural),
      penalized: round(penalized),
      love: round(love),
      floor: round(floor),
      reservation: round(reservation),
      trustGate: round(trustGate),
      endRisk: round(endRisk),
      giving: round(giving),
    });
  }

  const integral = trapezoid(points.map((p) => p.love), dt);
  const values = points.map((p) => p.love);
  const risks = points.map((p) => p.endRisk);
  const givingValues = points.map((p) => p.giving);
  const givingIntegral = trapezoid(givingValues, dt);
  const currentPoint = nearestPoint(points, person.relationshipLengthYears);
  return {
    points,
    integral: round(integral),
    average: round(integral / horizon),
    peak: round(Math.max(...values)),
    trough: round(Math.min(...values)),
    averageRisk: round(trapezoid(risks, dt) / horizon),
    peakRisk: round(Math.max(...risks)),
    givingIntegral: round(givingIntegral),
    averageGiving: round(givingIntegral / horizon),
    peakGiving: round(Math.max(...givingValues)),
    predictedPlateau: round(predictedPlateau),
    currentLove: currentPoint.love,
    currentRisk: currentPoint.endRisk,
    currentAge: currentPoint.age,
  };
}

export function calculateDyad(model: AppModel): DyadResult {
  const horizon = lifetimeHorizon(model);
  const self = calculateCurve(model.self, horizon);
  const partner = calculateCurve(model.partner, horizon);
  const totalIntegral = self.integral + partner.integral;
  const totalGivingIntegral = self.givingIntegral + partner.givingIntegral;
  const gap = Math.abs(self.integral - partner.integral);
  const givingGap = Math.abs(self.givingIntegral - partner.givingIntegral);
  const reciprocityMismatch = Math.abs(self.givingIntegral - partner.integral) + Math.abs(partner.givingIntegral - self.integral);
  const deadweightLoss = Math.max(0, self.givingIntegral - partner.integral) + Math.max(0, partner.givingIntegral - self.integral);
  const translationEfficiency = clamp(100 - (deadweightLoss / Math.max(1, totalGivingIntegral)) * 100, 0, 100);
  const normalizedGap = round((gap / Math.max(1, totalIntegral / 2)) * 100);
  return {
    self,
    partner,
    horizon,
    totalIntegral: round(totalIntegral),
    gap: round(gap),
    exceedsThreshold: normalizedGap > model.threshold,
    normalizedGap,
    averageEndRisk: round(clamp((self.averageRisk + partner.averageRisk) / 2 + Math.max(0, normalizedGap - model.threshold) * 1.8, 0, 100)),
    peakEndRisk: round(Math.max(self.peakRisk, partner.peakRisk)),
    totalGivingIntegral: round(totalGivingIntegral),
    givingGap: round(givingGap),
    reciprocityMismatch: round(reciprocityMismatch),
    deadweightLoss: round(deadweightLoss),
    translationEfficiency: round(translationEfficiency),
  };
}

export function lifetimeHorizon(model: AppModel): number {
  const selfStartAge = model.self.age - model.self.relationshipLengthYears;
  const partnerStartAge = model.partner.age - model.partner.relationshipLengthYears;
  const selfYears = 90 - selfStartAge;
  const partnerYears = 90 - partnerStartAge;
  const longestRelationshipSoFar = Math.max(model.self.relationshipLengthYears, model.partner.relationshipLengthYears);
  return round(clamp(Math.max(model.horizon, selfYears, partnerYears, longestRelationshipSoFar + 5), 5, 80));
}

function predictPlateau(person: PersonModel): number {
  const traitScore =
    person.stableEffort * 0.26 +
    person.compatibility * 0.24 +
    person.repairCapacity * 0.18 +
    person.reliability * 0.18 +
    person.noveltyCreation * 0.14;
  const trustBonus = (person.trust - 50) * 0.12;
  const floorBonus = person.floor * 0.16;
  const channelFit = normalizedChannelScore(
    person.positives,
    person.positives.reduce((sum, channel) => sum + channelSignal(channel, person.relationshipLengthYears, 10), 0),
  );
  const channelBonus = (channelFit - 50) * 0.12;
  const marketDrag = (person.marketAbundance / 100) * (person.marketElasticity / 100) * 12;
  return clamp(10 + traitScore * 0.62 + trustBonus + floorBonus + channelBonus - marketDrag, 0, 100);
}

function lifecycleValue({
  t,
  peakYear,
  peakTarget,
  plateau,
}: {
  t: number;
  peakYear: number;
  peakTarget: number;
  plateau: number;
}): number {
  const rise = 1 - Math.exp(-t / Math.max(0.05, peakYear * 0.48));
  const plateauRise = plateau * (1 - Math.exp(-t / 1.6));
  const honeymoonSurplus = Math.max(0, peakTarget - plateau) * rise * Math.exp(-Math.max(0, t - peakYear) / 1.55);
  return clamp(plateauRise + honeymoonSurplus, 0, 100);
}

function calculateGiving({
  love,
  anti,
  floor,
  genuineness,
  reflexivity,
  givingBaseline,
  givingResponsiveness,
  givingCapacity,
}: {
  love: number;
  anti: number;
  floor: number;
  genuineness: number;
  reflexivity: number;
  givingBaseline: number;
  givingResponsiveness: number;
  givingCapacity: number;
}): number {
  const careIdentity = (genuineness / 100) * 11 + (floor / 100) * 10;
  const reciprocityActivation = (love / 100) * givingResponsiveness;
  const reflexiveCare = (reflexivity / 100) * 8;
  const antiWithdrawal = anti * 0.08;
  const raw = givingBaseline + careIdentity + reciprocityActivation + reflexiveCare - antiWithdrawal;
  return clamp(raw * (givingCapacity / 100), 0, 100);
}

function calculateEndRisk({
  love,
  reservation,
  anti,
  positive,
  trustGate,
  floor,
  marketDrag,
  riskSensitivity,
}: {
  love: number;
  reservation: number;
  anti: number;
  positive: number;
  trustGate: number;
  floor: number;
  marketDrag: number;
  riskSensitivity: number;
}): number {
  const deficitPressure = (reservation - love) / 18;
  const antiPressure = anti / Math.max(20, positive);
  const lowTrustPressure = 1 - trustGate;
  const floorProtection = floor / 90;
  const sensitivity = 0.55 + riskSensitivity / 70;
  const logit = sensitivity * (deficitPressure + antiPressure + lowTrustPressure * 0.7 + marketDrag / 24 - floorProtection);
  return clamp((1 / (1 + Math.exp(-logit)) - 0.24) * 132, 0, 100);
}

function channelSignal(channel: CareChannel, t: number, horizon: number): number {
  const wave = Math.sin((t / horizon) * Math.PI * 2 + channel.phase);
  const pulse = Math.sin((t / horizon) * Math.PI * 5 + channel.phase / 2);
  const raw = channel.intensity + channel.variability * wave + channel.variability * 0.32 * pulse;
  const clipped = clamp(raw, 0, 100);
  const saturation = Math.max(8, channel.saturation);
  const saturated = saturation * (1 - Math.exp(-clipped / saturation));
  return saturated * channel.weight;
}

function normalizedChannelScore(channels: CareChannel[], raw: number): number {
  const maxSignal = channels.reduce((sum, channel) => {
    const saturation = Math.max(8, channel.saturation);
    return sum + saturation * (1 - Math.exp(-100 / saturation)) * channel.weight;
  }, 0);
  return clamp((raw / Math.max(1, maxSignal)) * 100, 0, 100);
}

function nearestPoint(points: CurvePoint[], t: number): CurvePoint {
  return points.reduce((closest, point) => (Math.abs(point.t - t) < Math.abs(closest.t - t) ? point : closest), points[0]);
}

function sigmoidGate(trust: number, genuineness: number): number {
  const centeredTrust = (trust - 50) / 16;
  const gate = 1 / (1 + Math.exp(-centeredTrust));
  const authenticityPenalty = 0.58 + (genuineness / 100) * 0.42;
  return clamp(gate * authenticityPenalty, 0, 1);
}

function trapezoid(values: number[], dt: number): number {
  return values.reduce((sum, value, index) => {
    if (index === 0 || index === values.length - 1) return sum + value * dt * 0.5;
    return sum + value * dt;
  }, 0);
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
