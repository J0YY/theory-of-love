# The Love Integral

**A reflexive theory of giving, receiving, deadweight loss, and relationship risk.**

Live app: [https://j0yy.github.io/theory-of-love/](https://j0yy.github.io/theory-of-love/)  
Paper PDF: [https://j0yy.github.io/theory-of-love/love-integral-paper.pdf](https://j0yy.github.io/theory-of-love/love-integral-paper.pdf)

## Origin

This project began as a conversation between **Joy Yang** and **Socrates Osorio**: Joy and Socrates are long distance, miss each other very much, and started wondering whether love could be modeled with the same kind of clarity people bring to economics, game theory, psychology, and dynamical systems.

The motivating question was not "can love be reduced to math?" It was almost the opposite:

> Can a mathematical framework make love easier to understand without making it less human?

Long-distance relationships make this question especially sharp. When two people miss each other, the relationship becomes full of signals, absences, calls, timing, effort, reassurance, longing, and interpretation. A small gesture can mean a lot. A missed message can mean nothing, or it can feel like everything. Some kinds of care land immediately; other kinds are sincere but do not quite register. The same amount of effort can produce very different felt love depending on trust, attachment, timing, channel fit, and the relationship's current state.

That is the basic inspiration behind **The Love Integral**: love can be treated as a time-varying system with inputs, weights, gates, floors, risks, and integrals, while still recognizing that the thing being modeled is personal, subjective, embodied, and emotionally real.

## What This Repository Contains

This repository has two connected artifacts:

1. **A research paper** written in LaTeX:  
   `paper/main.tex`

2. **An interactive visualizer dashboard** built with React, Vite, Recharts, and TypeScript:  
   `src/`

The paper develops the theory. The dashboard makes the theory tangible by letting people build their own relationship graphs:

- customize love languages
- customize anti-love languages
- change weights, intensities, saturation, volatility, trust, commitment, risk, and attachment-style presets
- compare two partners' receiving and giving curves
- compute total love integrals
- compute deadweight loss
- compute relationship-ending risk
- test whether the imbalance between partners exceeds the Threshold for Maximum Tolerance of Imbalance
- save and share a relationship model through a URL or JSON export

## The Core Idea

The central claim is that love can be modeled as a **reflexive, trust-gated, floor-anchored care function**.

In plain English:

- Love is not just attraction.
- Love is not just preference.
- Love is not just sacrifice.
- Love is not just what one person gives.
- Love is also what the other person can receive as love.

The theory separates two curves:

| Curve | Meaning |
| --- | --- |
| `L_receive(t)` | How loved a person feels over time |
| `G_give(t)` | How much care a person gives outward over time |

These curves are related, but they are not the same.

A person can give a lot of love in a channel the partner does not strongly receive. A person can feel unloved even when the other partner is trying. A relationship can have high effort but low translation. The model calls that loss **deadweight loss**.

## The Love Integral

The "love integral" is the area under a love curve across time:

```math
\mathcal{I}^{rec}_p = \int_0^T L^{rec}_p(t)\,dt
```

This represents cumulative received love for person `p` across the relationship horizon `T`.

For a dyad:

```math
\mathcal{I}^{rec}_{total}
= \mathcal{I}^{rec}_p + \mathcal{I}^{rec}_q
```

The relationship is not evaluated only by the highest peak. A honeymoon peak matters, but so does the plateau. A slightly less intense relationship that stabilizes at a high level can have a greater lifetime love integral than a relationship that peaks intensely and collapses.

This is one of the theory's main intuitions:

> People often choose partners with chemistry rather than random compatible strangers because chemistry steepens the early rise and increases the early area under the curve. But long-term compatibility matters because it determines whether the curve converges to a high stable plateau or decays.

## Lifecycle Shape

The theory assumes a typical romantic curve has three broad phases:

1. **Near-zero starting point**  
   Before the relationship exists, directed romantic love is near zero.

2. **Honeymoon rise and peak**  
   Love rises quickly because of chemistry, novelty, uncertainty, sexual attraction, high effort, and learning about the other person.

3. **Long-run plateau**  
   Novelty decays. Impression effort decays. What remains is stable effort, compatibility, trust, repair, commitment, and channel fit.

A simplified lifecycle decomposition is:

```math
L^{rec}(t)
= P_{effort}
+ N_0 e^{-\alpha t}
+ E_0 e^{-\beta t}
- DWL(t)
- X^-(t)
```

Where:

| Term | Meaning |
| --- | --- |
| `P_effort` | stable long-run effort plateau |
| `N_0 e^{-alpha t}` | novelty and lack-of-information term |
| `E_0 e^{-beta t}` | early impression/courtship effort |
| `DWL(t)` | deadweight loss from misrouted care |
| `X^-(t)` | anti-love pressure |

The goal is not to preserve the honeymoon spike forever. The goal is to create a high, durable plateau.

## The Receiving Function

For person `p` receiving love from person `q`, the paper models registered love as:

```math
L_p^{rec}(t)
=
\max\left(
L_{floor}^{p},
g(\tau_p(t)) \sum_i w_i^p(t)x_i(t) + b_p - X^-_p(t)
\right)
```

Where:

| Symbol | Meaning |
| --- | --- |
| `L_p^{rec}(t)` | love felt by person `p` at time `t` |
| `L_floor^p` | commitment floor |
| `g(tau_p(t))` | trust gate |
| `w_i^p(t)` | how strongly person `p` weights care channel `i` |
| `x_i(t)` | amount of care delivered through channel `i` |
| `b_p` | baseline love level |
| `X^-_p(t)` | anti-love pressure |

This equation says that positive care matters, but only after it passes through trust and interpretation. The same action can register differently depending on the receiver's attachment, history, expectations, and current trust.

## Trust Gate

Trust is modeled as a gate:

```math
g(\tau) \in [0,1]
```

If trust is high, positive care enters the receiving curve efficiently.

If trust is low, even sincere care may be discounted:

```math
L^{rec}(t)
\approx
low\ trust \times positive\ care
```

This is why the dashboard includes trust and attachment-style presets. Attachment is not treated as a diagnosis. It is treated as a rough way to change the system's trust, floor, reflexivity, market elasticity, and risk sensitivity.

## Commitment Floor

The floor is the structural minimum below which short-run shocks do not immediately push love:

```math
L^{rec}(t) \geq L_{floor}
```

In plain English, the floor is commitment.

It represents the part of love that says:

> This was a bad day, but the relationship is still real.

The floor does not erase harm. It does not make contempt okay. It does not turn anti-love into love. It simply means the relationship has some durability against temporary dips.

## Giving Curve

The model distinguishes received love from given love:

```math
G_{p \rightarrow q}(t)
=
h_p(
L_{q \rightarrow p}^{rec}(t),
L_{floor}^{p},
\pi_p,
capacity_p,
X_p^-(t)
)
```

Where `G_{p -> q}(t)` is how much care `p` gives to `q`.

Giving depends on:

- the person's default giving baseline
- their capacity
- their genuineness
- their commitment floor
- how loved they feel in return
- how much anti-love pressure is present

This matters because a relationship can fail in several different ways:

| Failure mode | What happens |
| --- | --- |
| Low receiving | one or both people do not feel loved |
| Low giving | one or both people are not sending much care |
| High translation loss | effort is real, but it does not become felt love |
| High risk | love exists, but the relationship is unstable |

## Deadweight Loss

Deadweight loss is one of the most important ideas in the project.

In economics, deadweight loss is value that is destroyed by inefficient allocation. In this theory, deadweight loss is **costly care that does not become felt love**.

```math
DWL(t)
=
\max(0, G_{p \rightarrow q}(t) - L_q^{rec}(t))
+
\max(0, G_{q \rightarrow p}(t) - L_p^{rec}(t))
```

If Socrates gives a lot of care in a channel Joy does not strongly receive, his giving curve can be high while Joy's receiving curve does not rise proportionally. That does not mean the care is fake. It means some of it is lost in translation.

This is the theory's generalized interpretation of love languages:

> Love languages are the practical technology for minimizing deadweight loss.

## Love Languages as Channel Optimization

The project generalizes "love languages" beyond the usual five categories.

A love language is any care channel where the receiver has high marginal response.

Examples:

- physical affection
- cuddling
- sex
- words of recognition
- long conversations
- quality time
- reliability
- repair after conflict
- play and novelty
- intellectual collaboration
- spiritual practice
- public loyalty
- domestic competence
- financial steadiness
- respecting solitude
- planning visits in a long-distance relationship
- remembering small details

Each channel has:

| Variable | Meaning |
| --- | --- |
| weight | how important this channel is to the receiver |
| intensity | how much of it is being supplied |
| variability | how uneven it is over time |
| saturation | where diminishing returns begin |

The optimization problem is:

```math
\max_{e_{p \rightarrow q}}
\quad
g_q(\tau_q)\sum_i w_i^q e_i
-
\sum_i c_i^p(e_i)
```

In plain English:

> Give care where your partner's receiving function has the highest return, while respecting your own real costs and limits.

This is also where game theory enters the model. In a repeated relationship, each partner can sustain a high-care equilibrium if both partners keep investing in each other's high-weight channels. But if both partners invest only in their own default channels, the couple can get stuck in an inefficient equilibrium where both are trying and both feel under-loved.

## Anti-Love Languages

The theory also includes anti-love languages: channels that pull the curve down.

Examples:

- contempt
- withdrawal
- unreliability
- humiliation
- chronic cancellation
- stonewalling
- public criticism
- emotional distance
- inconsistency
- betrayal
- dismissiveness

Positive and negative channels are not symmetric.

Removing contempt does not create bonus love. It removes damage.

```math
L_{natural}(t) = g(\tau(t))X^+(t) + b
```

```math
L_{penalized}(t) = L_{natural}(t) - X^-(t)
```

```math
L(t) = \max(L_{floor}, L_{penalized}(t))
```

This is why the dashboard has separate love-language and anti-love-language sections.

## Relationship-Ending Risk

Risk is modeled directly because the possibility that a relationship ends is not just another preference. It is a structurally undesirable state with emotional, practical, identity, and future-trust costs.

The paper represents relationship-ending risk as:

```math
\Omega_p(t)
=
\sigma\left(
\eta_p[
R_p(t)-L_p(t)
+ \lambda X_p^-(t)
+ \mu(1-g(\tau_p(t)))
+ \nu m_p(t)
- \kappa L_{floor}^p
]
\right)
```

Where:

| Symbol | Meaning |
| --- | --- |
| `Omega_p(t)` | ending-risk pressure |
| `sigma` | logistic function |
| `eta_p` | risk sensitivity |
| `R_p(t)` | reservation utility |
| `L_p(t)` | received love |
| `X^-_p(t)` | anti-love pressure |
| `g(tau_p(t))` | trust gate |
| `m_p(t)` | outside-option market pull |
| `L_floor^p` | commitment floor |

Risk rises when:

- love falls below reservation utility
- trust is low
- anti-love is high
- visible alternatives become more salient
- the commitment floor is weak
- one partner's integral falls far behind the other's
- deadweight loss is high

The dashboard shows average risk and peak risk because a relationship can be loving but unstable.

## Dyadic Imbalance

For two partners, the model compares both received-love integrals:

```math
\Delta^{rec}
=
\left|
\mathcal{I}_p^{rec}
-
\mathcal{I}_q^{rec}
\right|
```

The dashboard calls the acceptable bound:

**Threshold for Maximum Tolerance of Imbalance**

```math
\Delta^{rec} > \Theta
```

If the gap exceeds the threshold, the relationship is flagged as structurally imbalanced. This is not a moral verdict and not a breakup recommendation. It is a diagnostic signal that one person may be carrying more cumulative love load than the dyad can comfortably tolerate.

## Market Pull and Reservation Utility

The model includes an economics-inspired outside-option term.

Outside options do not mean someone is disloyal. They mean the social environment can change perceived thresholds.

High market abundance and high market elasticity can:

- raise reservation utility
- lower the effective commitment floor
- increase sensitivity to deficits
- make instability more likely when the love curve dips

The theory borrows from search theory, bargaining, investment models, and commitment-device accounts of emotion.

## Genuineness

The model also distinguishes love from merely performing the right behavior.

A person can output care-like signals while optimizing for control, reputation, guilt avoidance, or reward. The paper uses a policy-divergence condition:

```math
D_{KL}(\pi_p \| \pi_{care}(q)) \leq \epsilon
```

Meaning:

> The person's actual behavioral policy should stay close to a genuine care policy.

This is meant to preserve the philosophical difference between love and manipulation.

## Case Study Intuition

The paper uses Maya and Leo as a case study.

Maya feels loved through:

- reliability
- quality time
- words of recognition

Maya is hurt by:

- last-minute cancellation
- contempt during conflict

Leo feels loved through:

- physical affection
- playful novelty
- practical help

Leo is hurt by:

- emotional distance
- public criticism

Both people can love each other and still miss. Leo can plan elaborate dates, but if he often reschedules last minute, the novelty he gives may be partially canceled by Maya's reliability penalty. Maya can do practical favors, but if she withdraws affection, Leo's highest-weight channel may be underfed.

The important point:

> The problem may not be absence of love. The problem may be mistranslated love.

That is exactly what the visualizer is designed to make visible.

## How the Dashboard Maps to the Theory

| Dashboard control | Paper concept |
| --- | --- |
| Baseline | `b_p` |
| Floor commitment | `L_floor` |
| Trust | `g(tau)` |
| Genuineness | policy closeness / trust-gate authenticity |
| Reflexive update | weight update and self-expansion |
| Reservation utility | `R_p(t)` |
| Market abundance | outside-option visibility |
| Market elasticity | responsiveness to outside options |
| Loss aversion | asymmetric weight on anti-love |
| End-risk sensitivity | `eta_p` |
| Giving baseline | default outward care |
| Giving responsiveness | reciprocity activation |
| Giving capacity | sustainable care capacity |
| Love-language weight | `w_i` |
| Love-language intensity | `x_i(t)` |
| Variability | time volatility of a channel |
| Saturation | diminishing returns |
| Imbalance threshold | `Theta` |

## Sharing a Relationship Graph

The app can serialize the current model into a URL. That means one partner can fill out their side, send the link, and the other partner can fill out theirs.

The combined view then shows:

- each partner's received-love curve
- each partner's giving curve
- total love integral
- total giving integral
- imbalance gap
- deadweight loss
- translation efficiency
- average ending risk
- peak ending risk

## Important Caveats

This is not a clinical instrument.

It is not a compatibility test.

It is not a diagnostic tool.

It is an intuition machine: a way to make hidden assumptions explicit, inspect them, and talk about them more clearly.

The numbers are not moral scores. A low value on a channel does not mean someone is bad at loving. A high anti-love weight does not mean someone is unreasonable. The purpose is to ask:

- What do I actually receive as love?
- What does my partner actually receive as love?
- Where am I spending effort that is not landing?
- What hurts more than I realized?
- What stabilizes the relationship?
- What raises risk?
- What would increase the total love integral over time?

## Development

Install dependencies:

```bash
npm install
```

Run the web app locally:

```bash
npm run dev
```

Build the web app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Compile the paper with Tectonic:

```bash
npm run paper
```

The compiled paper is generated at:

```text
paper/build/main.pdf
```

The website links the public copy at:

```text
public/love-integral-paper.pdf
```

If the paper changes, recompile it and copy the new PDF into `public/` before deploying:

```bash
npm run paper
cp paper/build/main.pdf public/love-integral-paper.pdf
```

## Deployment

The app is deployed with GitHub Pages using:

```text
.github/workflows/deploy.yml
```

On every push to `main`, GitHub Actions:

1. installs dependencies with `npm ci`
2. builds the Vite app with the GitHub Pages base path
3. uploads the `dist/` artifact
4. deploys to GitHub Pages

The Vite config switches base paths depending on environment:

```ts
base: process.env.GITHUB_PAGES === "true" ? "/theory-of-love/" : "/"
```

That keeps local development on `/` while deploying correctly to:

```text
https://j0yy.github.io/theory-of-love/
```

## Project Structure

```text
.
├── paper/
│   ├── main.tex
│   └── references.bib
├── public/
│   └── love-integral-paper.pdf
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── model.ts
│   ├── sharing.ts
│   ├── styles.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.ts
└── README.md
```

## Authors

**Joy Yang** and **Socrates Osorio**

Made from a long-distance relationship, missing each other, and asking whether love could be made more visible without being made less romantic.
