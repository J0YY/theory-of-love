import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Download,
  FileText,
  HelpCircle,
  Heart,
  Link,
  Plus,
  RefreshCcw,
  Send,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import {
  AppModel,
  AttachmentStyle,
  CareChannel,
  PersonModel,
  applyAttachmentPreset,
  calculateCurve,
  calculateDyad,
  clamp,
  createChannel,
  defaultModel,
} from "./model";
import { createShareUrl, loadSharedModel, normalizeModel } from "./sharing";

type Tab = "learn" | "me" | "partner" | "together";

const tabLabels: Record<Tab, string> = {
  learn: "Theory",
  me: "Joy graph",
  partner: "Socratito graph",
  together: "Together",
};

const tips = {
  name: "This only changes the chart labels and shared dashboard identity.",
  attachment:
    "Attachment presets move trust, floor, reflexive update, market elasticity, and end-risk sensitivity together. They are shortcuts, not diagnoses.",
  secure: "Higher trust and floor with lower risk sensitivity. Good care registers more easily and shocks are less destabilizing.",
  anxious: "Higher reflexive update and risk sensitivity. The curve reacts strongly to both care and perceived threat.",
  avoidant: "Lower trust and reflexive update. Positive care tends to register more weakly unless the floor and channels compensate.",
  fearful: "Lower trust with high risk sensitivity. The graph can become volatile because care and threat are both hard to metabolize.",
  baseline: "The starting level of felt love before specific love-language channels are added. Raising it lifts the whole natural curve.",
  floor:
    "The commitment floor: the lowest level love is allowed to fall to after shocks. Raising it protects the curve and usually lowers end risk.",
  trust:
    "The trust gate on positive care. Low trust makes even strong love languages count less; high trust lets ordinary care register.",
  genuineness:
    "How authentic the care feels. Low genuineness weakens the trust gate, so the same action produces less felt love.",
  reflexivity:
    "How much feeling loved teaches the system to love more. Higher values add lift when positive care is already strong.",
  reservationUtility:
    "The relationship benchmark. If received love falls below this line, end-risk pressure rises.",
  marketAbundance:
    "How visible alternatives feel. Higher abundance increases market drag, pushing up the benchmark and slightly eroding the floor.",
  marketElasticity:
    "How responsive the person is to alternatives. High elasticity makes market abundance matter more.",
  lossAversion:
    "How heavily anti-love is weighted. Raising it makes harmful channels pull the curve down more sharply.",
  riskSensitivity:
    "How quickly deficits, distrust, and anti-love translate into relationship-ending risk.",
  givingBaseline: "The person's default tendency to give love even before receiving much in return.",
  givingResponsiveness:
    "How much giving rises when the person feels loved. Higher values make G(t) move with L_receive(t).",
  givingCapacity:
    "The maximum sustainable giving capacity. Lower capacity compresses the giving curve even if motivation is high.",
  positiveWeight:
    "Importance of this love language. A high weight means each unit of this channel contributes more to felt love.",
  antiWeight:
    "Importance of this anti-love language. A high weight means each unit of this harm produces more damage.",
  positiveIntensity:
    "How much of this love language is currently being supplied. Raising it increases the channel signal until saturation kicks in.",
  antiIntensity:
    "How often or strongly this damaging pattern appears. Raising it lowers the penalized love curve.",
  variability:
    "How uneven this channel is over time. Higher variability creates waves: bursts, dips, and more graph movement.",
  saturation:
    "Diminishing returns for this channel. Lower saturation means the love language maxes out sooner; higher saturation keeps extra effort valuable longer.",
  threshold:
    "The maximum tolerable lifetime imbalance between partners' received-love integrals before the dyad is flagged as unstable.",
  channelName: "Rename the channel to match the actual behavior, like cuddling, sex, long conversations, repairs, or withdrawal.",
};

export default function App() {
  const [model, setModel] = useState<AppModel>(() => loadSharedModel());
  const [tab, setTab] = useState<Tab>("learn");
  const [shareStatus, setShareStatus] = useState("Ready");
  const dyad = useMemo(() => calculateDyad(model), [model]);
  const selfName = displayName(model.self.name, "Joy");
  const partnerName = displayName(model.partner.name, "Socratito");
  const activeTabLabels: Record<Tab, string> = {
    ...tabLabels,
    me: `${selfName} graph`,
    partner: `${partnerName} graph`,
  };

  function updatePerson(key: "self" | "partner", next: PersonModel) {
    setModel((current) => ({ ...current, [key]: next }));
  }

  async function copyShareUrl() {
    const url = createShareUrl(model);
    await navigator.clipboard.writeText(url);
    setShareStatus("Link copied");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "theory-of-love-state.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = normalizeModel(JSON.parse(String(reader.result)));
        setModel(next);
        setShareStatus("Imported");
      } catch {
        setShareStatus("Import failed");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Reflexive functional framework</p>
          <h1>Theory of Love</h1>
        </div>
        <div className="top-actions">
          <a
            className="icon-button ghost"
            href={`${import.meta.env.BASE_URL}love-integral-paper.pdf`}
            target="_blank"
            rel="noreferrer"
            title="Open the research paper PDF"
          >
            <FileText size={18} />
            <span>Paper</span>
          </a>
          <button className="icon-button" onClick={copyShareUrl} title="Copy share link">
            <Link size={18} />
            <span>Share</span>
          </button>
          <button className="icon-button ghost" onClick={() => setModel(defaultModel)} title="Reset model">
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Dashboard sections">
        {(Object.keys(activeTabLabels) as Tab[]).map((key) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
            {activeTabLabels[key]}
          </button>
        ))}
      </nav>

      {tab === "learn" && <TheoryView model={model} dyad={dyad} />}
      {tab === "me" && (
        <PersonWorkspace
          title={`${selfName} received-love curve`}
          person={model.self}
          result={dyad.self}
          onChange={(next) => updatePerson("self", next)}
        />
      )}
      {tab === "partner" && (
        <PersonWorkspace
          title={`${partnerName} received-love curve`}
          person={model.partner}
          result={dyad.partner}
          onChange={(next) => updatePerson("partner", next)}
        />
      )}
      {tab === "together" && (
        <TogetherView
          model={model}
          dyad={dyad}
          onThresholdChange={(threshold) => setModel((current) => ({ ...current, threshold }))}
          onCopy={copyShareUrl}
          onExport={exportJson}
          onImport={importJson}
          shareStatus={shareStatus}
        />
      )}
    </main>
  );
}

function TheoryView({ model, dyad }: { model: AppModel; dyad: ReturnType<typeof calculateDyad> }) {
  const selfName = displayName(model.self.name, "Joy");
  const partnerName = displayName(model.partner.name, "Socratito");
  const combined = dyad.self.points.map((point, index) => ({
    t: point.t,
    self: point.love,
    partner: dyad.partner.points[index]?.love ?? 0,
    floor: point.floor,
  }));

  return (
    <section className="learn-grid">
      <div className="hero-panel">
        <div className="formula-mark">
          <Heart size={28} />
          <span>L(t)</span>
        </div>
        <h2>Love is a floor-anchored, trust-gated care function.</h2>
        <p>
          Positive care channels raise the natural curve. Anti-love channels subtract from it.
          Commitment sets a floor. Giving is a second curve, not the same thing as feeling loved.
        </p>
        <div className="equation">
          L<sub>receive</sub>(t) tracks feeling loved; G<sub>give</sub>(t) tracks care sent outward; risk rises when L(t) &lt; R(t)
        </div>
      </div>

      <div className="chart-panel">
        <PanelHeader label="Live dyadic curve" value={`Gap ${dyad.gap}`} />
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={combined} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9ded6" />
            <XAxis dataKey="t" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="self" stroke="#1f7a76" strokeWidth={3} dot={false} name={selfName} />
            <Line type="monotone" dataKey="partner" stroke="#c0506f" strokeWidth={3} dot={false} name={partnerName} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="concept-row">
        <ConceptCard title="Trust gate" text="Low trust makes even good care harder to register. Secure trust lets ordinary care count." />
        <ConceptCard title="Floor" text="Commitment prevents short-run shocks from driving love below the structural minimum." />
        <ConceptCard title="Anti-love" text="Harmful channels lower the curve. Their absence only removes damage; it does not add bonus love." />
        <ConceptCard title="Giving curve" text="Feeling loved and giving love are coupled but distinct. A dyad can fail because care is sent in channels the partner does not receive." />
        <ConceptCard title="Deadweight loss" text="Love languages reduce wasted care: the gap between love given and love actually received." />
        <ConceptCard title="Lifetime curve" text="Honeymoon love is novelty plus high effort; the long-run plateau depends on stable effort, fit, repair, and trust." />
        <ConceptCard title="Market pull" text="Visible alternatives can raise reservation utility and erode the effective floor." />
        <ConceptCard title="End risk" text="Risk is not a love ingredient. It is the undesirable probability pressure created by deficit, distrust, anti-love, and imbalance." />
      </div>
    </section>
  );
}

function PersonWorkspace({
  title,
  person,
  result,
  onChange,
}: {
  title: string;
  person: PersonModel;
  result: ReturnType<typeof calculateCurve>;
  onChange: (person: PersonModel) => void;
}) {
  const [insight, setInsight] = useState<string[]>([]);

  return (
    <section className="workspace">
      <div className="chart-panel primary-chart">
        <PanelHeader label={title} value={`Integral ${result.integral}`} />
        <SingleCurveChart result={result} />
        <InsightBox
          insight={insight}
          onGenerate={() => setInsight(generatePersonInsight(person, result))}
          label="AI insight"
        />
      </div>

      <div className="side-panel">
        <PersonControls person={person} onChange={onChange} />
      </div>
    </section>
  );
}

function SingleCurveChart({ result }: { result: ReturnType<typeof calculateCurve> }) {
  return (
    <ResponsiveContainer width="100%" height={390}>
      <AreaChart data={result.points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="loveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1f7a76" stopOpacity={0.36} />
            <stop offset="95%" stopColor="#1f7a76" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#d9ded6" />
        <XAxis dataKey="t" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <ReferenceLine y={result.points[0]?.floor ?? 0} stroke="#9b6a2f" strokeDasharray="5 5" />
        <ReferenceLine y={result.points[0]?.reservation ?? 0} stroke="#7d8191" strokeDasharray="4 4" />
        <Area type="monotone" dataKey="love" stroke="#1f7a76" strokeWidth={3} fill="url(#loveFill)" name="L(t)" />
        <Line type="monotone" dataKey="giving" stroke="#4967a8" strokeWidth={2} dot={false} name="G(t) giving" />
        <Line type="monotone" dataKey="natural" stroke="#6b8e5d" strokeWidth={2} dot={false} name="natural" />
        <Line type="monotone" dataKey="penalized" stroke="#c0506f" strokeWidth={2} dot={false} name="after anti-love" />
        <Line type="monotone" dataKey="endRisk" stroke="#d28b21" strokeWidth={2} dot={false} strokeDasharray="6 4" name="ending risk" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PersonControls({ person, onChange }: { person: PersonModel; onChange: (person: PersonModel) => void }) {
  function update<K extends keyof PersonModel>(key: K, value: PersonModel[K]) {
    onChange({ ...person, [key]: value });
  }

  function updateChannel(kind: "positives" | "antis", channel: CareChannel) {
    onChange({ ...person, [kind]: person[kind].map((item) => (item.id === channel.id ? channel : item)) });
  }

  function removeChannel(kind: "positives" | "antis", id: string) {
    onChange({ ...person, [kind]: person[kind].filter((item) => item.id !== id) });
  }

  function addChannel(kind: "positives" | "antis") {
    onChange({ ...person, [kind]: [...person[kind], createChannel(kind === "positives" ? "positive" : "anti", person[kind].length)] });
  }

  return (
    <div className="controls">
      <label className="field">
        <span className="label-with-help">
          Name
          <TooltipHelp text={tips.name} />
        </span>
        <input title={tips.name} value={person.name} onChange={(event) => update("name", event.target.value)} />
      </label>

      <div className="section-kicker">
        <span className="label-with-help">
          Attachment preset
          <TooltipHelp text={tips.attachment} />
        </span>
      </div>
      <div className="preset-row" aria-label="Attachment style presets">
        {(["secure", "anxious", "avoidant", "fearful"] as AttachmentStyle[]).map((style) => (
          <button
            key={style}
            className={person.attachmentStyle === style ? "chip active" : "chip"}
            onClick={() => onChange(applyAttachmentPreset(person, style))}
            title={tips[style]}
          >
            {style}
          </button>
        ))}
      </div>

      <Slider label="Baseline" description={tips.baseline} value={person.baseline} min={0} max={40} onChange={(value) => update("baseline", value)} />
      <Slider label="Floor commitment" description={tips.floor} value={person.floor} min={0} max={80} onChange={(value) => update("floor", value)} />
      <Slider label="Trust" description={tips.trust} value={person.trust} min={0} max={100} onChange={(value) => update("trust", value)} />
      <Slider label="Genuineness" description={tips.genuineness} value={person.genuineness} min={0} max={100} onChange={(value) => update("genuineness", value)} />
      <Slider label="Reflexive update" description={tips.reflexivity} value={person.reflexivity} min={0} max={100} onChange={(value) => update("reflexivity", value)} />
      <Slider label="Reservation utility" description={tips.reservationUtility} value={person.reservationUtility} min={0} max={90} onChange={(value) => update("reservationUtility", value)} />
      <Slider label="Market abundance" description={tips.marketAbundance} value={person.marketAbundance} min={0} max={100} onChange={(value) => update("marketAbundance", value)} />
      <Slider label="Market elasticity" description={tips.marketElasticity} value={person.marketElasticity} min={0} max={100} onChange={(value) => update("marketElasticity", value)} />
      <Slider label="Loss aversion" description={tips.lossAversion} value={person.lossAversion} min={1} max={3} step={0.1} onChange={(value) => update("lossAversion", value)} />
      <Slider label="End-risk sensitivity" description={tips.riskSensitivity} value={person.riskSensitivity} min={0} max={100} onChange={(value) => update("riskSensitivity", value)} />
      <Slider label="Giving baseline" description={tips.givingBaseline} value={person.givingBaseline} min={0} max={50} onChange={(value) => update("givingBaseline", value)} />
      <Slider label="Giving responsiveness" description={tips.givingResponsiveness} value={person.givingResponsiveness} min={0} max={80} onChange={(value) => update("givingResponsiveness", value)} />
      <Slider label="Giving capacity" description={tips.givingCapacity} value={person.givingCapacity} min={0} max={100} onChange={(value) => update("givingCapacity", value)} />

      <ChannelSection
        title="Love languages"
        channels={person.positives}
        tone="positive"
        onAdd={() => addChannel("positives")}
        onChange={(channel) => updateChannel("positives", channel)}
        onRemove={(id) => removeChannel("positives", id)}
      />
      <ChannelSection
        title="Anti-love languages"
        channels={person.antis}
        tone="anti"
        onAdd={() => addChannel("antis")}
        onChange={(channel) => updateChannel("antis", channel)}
        onRemove={(id) => removeChannel("antis", id)}
      />
    </div>
  );
}

function ChannelSection({
  title,
  channels,
  tone,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  channels: CareChannel[];
  tone: "positive" | "anti";
  onAdd: () => void;
  onChange: (channel: CareChannel) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className={`channel-section ${tone}`}>
      <div className="section-title">
        <h3>{title}</h3>
        <button className="icon-button compact" onClick={onAdd} title={`Add ${title.toLowerCase()}`}>
          <Plus size={16} />
        </button>
      </div>
      {channels.map((channel) => (
        <div className="channel-card" key={channel.id}>
          <div className="channel-top">
            <input
              title={tips.channelName}
              value={channel.name}
              onChange={(event) => onChange({ ...channel, name: event.target.value })}
            />
            <button className="icon-only" onClick={() => onRemove(channel.id)} title="Remove channel">
              <Trash2 size={16} />
            </button>
          </div>
          <Slider label="Weight" description={tone === "positive" ? tips.positiveWeight : tips.antiWeight} value={channel.weight} min={0} max={2.5} step={0.05} onChange={(value) => onChange({ ...channel, weight: value })} />
          <Slider label="Intensity" description={tone === "positive" ? tips.positiveIntensity : tips.antiIntensity} value={channel.intensity} min={0} max={100} onChange={(value) => onChange({ ...channel, intensity: value })} />
          <Slider label="Variability" description={tips.variability} value={channel.variability} min={0} max={50} onChange={(value) => onChange({ ...channel, variability: value })} />
          <Slider label="Saturation" description={tips.saturation} value={channel.saturation} min={10} max={100} onChange={(value) => onChange({ ...channel, saturation: value })} />
        </div>
      ))}
    </section>
  );
}

function TogetherView({
  model,
  dyad,
  onThresholdChange,
  onCopy,
  onExport,
  onImport,
  shareStatus,
}: {
  model: AppModel;
  dyad: ReturnType<typeof calculateDyad>;
  onThresholdChange: (value: number) => void;
  onCopy: () => void;
  onExport: () => void;
  onImport: (file: File | null) => void;
  shareStatus: string;
}) {
  const [insight, setInsight] = useState<string[]>([]);
  const selfName = displayName(model.self.name, "Joy");
  const partnerName = displayName(model.partner.name, "Socratito");
  const combined = dyad.self.points.map((point, index) => ({
    t: point.t,
    [selfName]: point.love,
    [partnerName]: dyad.partner.points[index]?.love ?? 0,
    [`${selfName} giving`]: point.giving,
    [`${partnerName} giving`]: dyad.partner.points[index]?.giving ?? 0,
    gap: Math.abs(point.love - (dyad.partner.points[index]?.love ?? 0)),
    risk: (point.endRisk + (dyad.partner.points[index]?.endRisk ?? 0)) / 2,
    deadweight:
      Math.max(0, point.giving - (dyad.partner.points[index]?.love ?? 0)) +
      Math.max(0, (dyad.partner.points[index]?.giving ?? 0) - point.love),
  }));

  return (
    <section className="together-grid">
      <div className="chart-panel wide">
        <PanelHeader
          label="Dyadic comparison"
          value={dyad.exceedsThreshold ? "Above imbalance threshold" : "Within imbalance threshold"}
        />
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9ded6" />
            <XAxis dataKey="t" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey={selfName} stroke="#1f7a76" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey={partnerName} stroke="#c0506f" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey={`${selfName} giving`} stroke="#4967a8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={`${partnerName} giving`} stroke="#7c6ab1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gap" stroke="#9b6a2f" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="deadweight" stroke="#5f6673" strokeWidth={2} dot={false} strokeDasharray="2 5" />
            <Line type="monotone" dataKey="risk" stroke="#d28b21" strokeWidth={2} dot={false} strokeDasharray="6 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="verdict-panel">
        <div className={dyad.exceedsThreshold ? "verdict danger" : "verdict calm"}>
          <span>Threshold for Maximum Tolerance of Imbalance</span>
          <strong>{dyad.gap} / {model.threshold}</strong>
        </div>
        <div className="metric-grid">
          <Metric label={`${selfName} integral`} value={dyad.self.integral} />
          <Metric label={`${partnerName} integral`} value={dyad.partner.integral} />
          <Metric label={`${selfName} giving`} value={dyad.self.givingIntegral} />
          <Metric label={`${partnerName} giving`} value={dyad.partner.givingIntegral} />
          <Metric label="Total love integral" value={dyad.totalIntegral} />
          <Metric label="Total giving integral" value={dyad.totalGivingIntegral} />
          <Metric label="Normalized gap" value={`${dyad.normalizedGap}%`} />
          <Metric label="Deadweight loss" value={dyad.deadweightLoss} />
          <Metric label="Translation efficiency" value={`${dyad.translationEfficiency}%`} />
          <Metric label="Average end risk" value={`${dyad.averageEndRisk}%`} />
          <Metric label="Peak end risk" value={`${dyad.peakEndRisk}%`} />
        </div>
        <Slider
          label="Imbalance threshold"
          description={tips.threshold}
          value={model.threshold}
          min={10}
          max={800}
          onChange={onThresholdChange}
        />
        <InsightBox
          insight={insight}
          onGenerate={() => setInsight(generateDyadInsight(model, dyad))}
          label="AI insight"
        />
        <div className="share-box">
          <button className="icon-button" onClick={onCopy}>
            <Send size={18} />
            <span>Copy share link</span>
          </button>
          <button className="icon-button ghost" onClick={onExport}>
            <Download size={18} />
            <span>JSON</span>
          </button>
          <label className="icon-button ghost file-button">
            <Upload size={18} />
            <span>Import</span>
            <input type="file" accept="application/json" onChange={(event) => onImport(event.target.files?.[0] ?? null)} />
          </label>
          <p>{shareStatus}</p>
        </div>
      </div>
    </section>
  );
}

function generatePersonInsight(person: PersonModel, result: ReturnType<typeof calculateCurve>): string[] {
  const personName = displayName(person.name, "This person");
  const topPositive = strongestChannel(person.positives);
  const topAnti = strongestChannel(person.antis);
  const floorShare = Math.round(
    (result.points.filter((point) => point.love <= point.floor + 0.5).length / result.points.length) * 100,
  );
  const volatility = Math.round(result.peak - result.trough);
  const givingDelta = Math.round(result.averageGiving - result.average);
  const antiLoad = Math.round(person.antis.reduce((sum, channel) => sum + channel.weight * channel.intensity, 0));
  const positiveLoad = Math.round(person.positives.reduce((sum, channel) => sum + channel.weight * channel.intensity, 0));
  const trustInterpretation =
    person.trust < 45
      ? "Because trust is low, the model discounts some positive care before it reaches the felt-love curve."
      : person.trust > 70
        ? "Because trust is high, positive care translates efficiently into felt love."
        : "Trust is in the middle range, so positive care registers but still has room to translate more efficiently.";

  const lines = [
    `${personName}'s graph averages ${result.average} received-love units over the horizon, with a lifetime integral of ${result.integral}. ${trustInterpretation}`,
  ];

  if (topPositive) {
    lines.push(
      `${topPositive.name} is the strongest love-language input right now. Its weight and intensity make it a main reason the curve rises above baseline, while saturation controls how much extra effort still pays off.`,
    );
  }

  if (topAnti && antiLoad > positiveLoad * 0.12) {
    lines.push(
      `${topAnti.name} is the largest anti-love drag. It pulls down the penalized curve, and loss aversion makes that harm count more heavily than an equal-sized positive signal.`,
    );
  } else {
    lines.push("Anti-love is not dominating the graph right now, so the curve is mostly shaped by baseline, trust, floor, and positive channels.");
  }

  if (floorShare > 18) {
    lines.push(
      `The commitment floor is binding for about ${floorShare}% of sampled moments, which means the relationship structure is preventing deeper dips rather than the natural curve staying high on its own.`,
    );
  } else {
    lines.push(`The curve is rarely pinned to the floor. Most movement is coming from active care channels rather than only commitment protection.`);
  }

  lines.push(
    `Giving is ${Math.abs(givingDelta)} points ${givingDelta >= 0 ? "above" : "below"} received love on average. Volatility is about ${volatility} points, and average ending risk is ${result.averageRisk}%.`,
  );

  return lines;
}

function generateDyadInsight(model: AppModel, dyad: ReturnType<typeof calculateDyad>): string[] {
  const selfName = displayName(model.self.name, "Joy");
  const partnerName = displayName(model.partner.name, "Socratito");
  const higherReceiver = dyad.self.integral >= dyad.partner.integral ? selfName : partnerName;
  const higherGiver = dyad.self.givingIntegral >= dyad.partner.givingIntegral ? selfName : partnerName;
  const status = dyad.exceedsThreshold
    ? `The received-love gap is above the threshold by ${Math.round(dyad.gap - model.threshold)} integral units.`
    : `The received-love gap is ${Math.round(model.threshold - dyad.gap)} integral units inside the current threshold.`;
  const deadweightRead =
    dyad.translationEfficiency >= 85
      ? "Most giving is translating into received love."
      : dyad.translationEfficiency >= 65
        ? "Some effort is getting lost in translation, so better love-language matching would likely raise the total integral."
        : "A lot of care is being sent in forms that do not become received love, which is exactly the deadweight-loss problem.";

  return [
    `${status} ${higherReceiver} currently has the larger received-love integral, while ${higherGiver} has the larger giving integral.`,
    `${deadweightRead} Deadweight loss is ${dyad.deadweightLoss}, and translation efficiency is ${dyad.translationEfficiency}%.`,
    `Average relationship-ending risk is ${dyad.averageEndRisk}% and peak risk is ${dyad.peakEndRisk}%. Risk rises when one or both curves fall below reservation utility, when anti-love is strong, or when imbalance exceeds tolerance.`,
    `To improve the total love integral, look for high-weight positive channels on each side and raise those before raising generic effort. That targets the exact places where care becomes felt love.`,
  ];
}

function strongestChannel(channels: CareChannel[]): CareChannel | null {
  return channels.reduce<CareChannel | null>((best, channel) => {
    if (!best) return channel;
    return channel.weight * channel.intensity > best.weight * best.intensity ? channel : best;
  }, null);
}

function Slider({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider">
      <span className="slider-label">
        <span className="label-with-help">
          {label}
          {description && <TooltipHelp text={description} />}
        </span>
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function TooltipHelp({ text }: { text: string }) {
  return (
    <span className="tooltip-wrap" tabIndex={0}>
      <HelpCircle size={15} />
      <span className="tooltip-bubble">{text}</span>
    </span>
  );
}

function InsightBox({
  insight,
  onGenerate,
  label,
}: {
  insight: string[];
  onGenerate: () => void;
  label: string;
}) {
  return (
    <div className="insight-box">
      <button className="icon-button ghost" onClick={onGenerate} title="Generate context for the current graph settings">
        <Sparkles size={18} />
        <span>{label}</span>
      </button>
      {insight.length > 0 && (
        <div className="insight-copy">
          {insight.map((line, index) => (
            <p key={`${index}-${line}`}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function PanelHeader({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel-header">
      <div>
        <SlidersHorizontal size={18} />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function ConceptCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="concept-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function displayName(name: string, fallback: string): string {
  return name.trim() || fallback;
}
