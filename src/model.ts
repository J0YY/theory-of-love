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
};

export type DyadResult = {
  self: CurveResult;
  partner: CurveResult;
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
  threshold: 180,
  horizon: 30,
  self: {
    id: "self",
    name: "Me",
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
    name: "Boyfriend",
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

  for (let i = 0; i < samples; i += 1) {
    const t = Number((i * dt).toFixed(2));
    const trustGate = sigmoidGate(person.trust, person.genuineness);
    const positive = person.positives.reduce((sum, c) => sum + channelSignal(c, t, horizon), 0);
    const anti = person.antis.reduce((sum, c) => sum + channelSignal(c, t, horizon), 0) * person.lossAversion;
    const marketDrag = (person.marketAbundance / 100) * (person.marketElasticity / 100) * 18;
    const reflexiveLift = (person.reflexivity / 100) * Math.min(10, positive / 35);
    const natural = trustGate * positive + person.baseline + reflexiveLift - marketDrag;
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
  };
}

export function calculateDyad(model: AppModel): DyadResult {
  const self = calculateCurve(model.self, model.horizon);
  const partner = calculateCurve(model.partner, model.horizon);
  const totalIntegral = self.integral + partner.integral;
  const totalGivingIntegral = self.givingIntegral + partner.givingIntegral;
  const gap = Math.abs(self.integral - partner.integral);
  const givingGap = Math.abs(self.givingIntegral - partner.givingIntegral);
  const reciprocityMismatch = Math.abs(self.givingIntegral - partner.integral) + Math.abs(partner.givingIntegral - self.integral);
  const deadweightLoss = Math.max(0, self.givingIntegral - partner.integral) + Math.max(0, partner.givingIntegral - self.integral);
  const translationEfficiency = clamp(100 - (deadweightLoss / Math.max(1, totalGivingIntegral)) * 100, 0, 100);
  return {
    self,
    partner,
    totalIntegral: round(totalIntegral),
    gap: round(gap),
    exceedsThreshold: gap > model.threshold,
    normalizedGap: round((gap / Math.max(1, totalIntegral)) * 100),
    averageEndRisk: round(clamp((self.averageRisk + partner.averageRisk) / 2 + Math.max(0, gap - model.threshold) / 45, 0, 100)),
    peakEndRisk: round(Math.max(self.peakRisk, partner.peakRisk)),
    totalGivingIntegral: round(totalGivingIntegral),
    givingGap: round(givingGap),
    reciprocityMismatch: round(reciprocityMismatch),
    deadweightLoss: round(deadweightLoss),
    translationEfficiency: round(translationEfficiency),
  };
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
