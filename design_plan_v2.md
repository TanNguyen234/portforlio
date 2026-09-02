IMMERSIVE UI V2 - COMPREHENSIVE VISUAL OVERHAUL

You are performing a SECOND-PASS redesign of the immersive visual mode
that already exists in this repository.

DO NOT treat the current immersive implementation as the target quality.

Treat it as an architectural prototype.

The reversible visual-mode architecture is useful and should be preserved,
but the current immersive design is visually insufficient.

============================================================
WHY THIS PASS EXISTS
============================================================

The current implementation technically supports:

legacy
vs
immersive

but visually it behaves too much like:

LEGACY DOM UI
+
A Three.js object in the background
+
some teal token changes.

That is NOT the intended result.

The immersive mode must feel like a completely art-directed alternate
presentation of the same portfolio.

IMPORTANT DISTINCTION:

PRESERVE UX.

DO NOT PRESERVE UI.

Same UX does NOT mean:
- same card design
- same typography hierarchy
- same grid
- same visual composition
- same surfaces
- same section art direction
- same navbar appearance

It means the user must still understand and operate the portfolio in the
same way.

============================================================
CURRENT IMPLEMENTATION AUDIT
============================================================

Before making changes, inspect CURRENT MAIN, especially:

- HomePage.tsx
- Hero.tsx
- About.tsx
- ExperienceTimeline.tsx
- ProjectsShowcase.tsx
- SkillsConstellation.tsx
- Contact.tsx
- globals.css
- VisualModeProvider.tsx
- visualMode.ts
- GlobalThreeCanvas.tsx
- AICoreObject.tsx
- SpatialField.tsx
- SceneCameraController.tsx
- sceneState.ts
- design_plan.md

Do not assume the original plan was implemented completely.

Audit what actually exists.

Explicitly identify where immersive mode currently differs from legacy.

You should notice that most DOM presentation remains shared and visually
almost identical.

That is the core problem this pass must solve.

============================================================
NEW DESIGN DIALS
============================================================

DESIGN_VARIANCE: 9 / 10
MOTION_INTENSITY: 8 / 10
VISUAL_DENSITY: 5 / 10

Interpretation:

- radically stronger visual distinction
- highly art-directed
- spatial and cinematic
- still readable
- still recruiter-friendly
- still technically restrained where performance matters

This is NOT permission to destroy usability.

This IS permission to substantially redesign presentation.

============================================================
PRIMARY QUALITY TEST
============================================================

At the end, compare:

?visual=legacy

and

?visual=immersive

at:

1440x900

The difference must be IMMEDIATELY obvious even in a static screenshot.

If the only obvious difference is:

- background
- color
- glowing 3D object
- slightly different borders

THE REDESIGN HAS FAILED.

Second test:

Temporarily disable WebGL while retaining immersive DOM styling.

The site must STILL look like a deliberately designed immersive version.

If disabling WebGL causes immersive mode to look almost identical to
legacy mode:

THE REDESIGN HAS FAILED.

============================================================
NON-NEGOTIABLE UX CONTRACT
============================================================

Preserve:

- section order
- information hierarchy
- actual content
- routes
- navigation destinations
- anchor behavior
- CTA destinations
- GitHub links
- LinkedIn links
- CV download
- project modal/drawer functionality
- horizontal project browsing behavior
- locale switching
- keyboard accessibility
- semantic structure
- responsive usability

Do NOT turn the portfolio into a game.

Do NOT require exploration to find information.

Do NOT introduce WASD navigation.

Do NOT hide core portfolio content in WebGL.

============================================================
YOU ARE EXPLICITLY ALLOWED TO CHANGE
============================================================

In IMMERSIVE MODE ONLY, you MAY substantially redesign:

- navbar appearance
- Hero composition
- section layouts
- typography scale
- typography placement
- spacing
- card shells
- borders
- backgrounds
- decorative DOM
- section transitions
- content framing
- number/index treatments
- dividers
- masks
- visual hierarchy
- hover presentation
- WebGL composition

Legacy mode must remain visually unchanged.

============================================================
ARCHITECTURE RULE
============================================================

Do NOT duplicate business logic or portfolio data.

But do not over-optimize for DOM sharing either.

If forcing the exact same markup between legacy and immersive modes
prevents meaningful art direction, introduce PRESENTATIONAL variants.

Good:

<Hero variant="legacy" />
<Hero variant="immersive" />

or:

<HeroLegacyPresentation />
<HeroImmersivePresentation />

while sharing:
- data
- actions
- link targets
- behavior
- semantics where practical

The same principle may be used for other sections.

Avoid duplicating application logic.

Visual duplication is acceptable when necessary for strong art direction.

============================================================
NEW ART DIRECTION
============================================================

Theme:

COMPUTATIONAL EDITORIAL × SPATIAL INTELLIGENCE

Do NOT build a stereotypical "AI website".

Visual references should feel closer to:

- experimental creative developer portfolio
- technical editorial design
- scientific visualization
- high-end motion identity
- generative computational art

and farther from:

- SaaS landing page
- glassmorphism dashboard
- cyberpunk game UI
- crypto website
- generic AI startup

Core palette remains mostly:

#020203
#050608
#F4F6F8

with restrained signal accent:

#14B8A6

Very small secondary cool spectral variation is allowed only when
compositionally justified.

============================================================
BAN THE CURRENT CARD LANGUAGE
============================================================

Immersive mode currently relies too heavily on:

rounded rectangle
+ blur
+ border
+ another rounded rectangle
+ teal glow.

Reduce this aggressively.

Do NOT build every section out of cards.

Do NOT repeatedly use:

rounded-2xl
rounded-3xl
pill
glass panel
double bezel

as the primary visual language.

Use more:

- open compositions
- editorial rules
- edge-to-edge structures
- asymmetric grids
- thin technical lines
- whitespace
- layered planes
- typography
- spatial depth
- clipped/masked surfaces
- index markers

Rounded cards should become the exception.

============================================================
GLOBAL VISUAL SYSTEM
============================================================

Create one coherent spatial world.

The page should feel like the user is moving through different states of
ONE computational environment.

Do not create six unrelated Three.js demos.

Use a shared set of motifs:

1. intelligence core
2. signal field
3. structural line system
4. controlled spectral material
5. sparse technical metadata
6. depth planes
7. large editorial typography

Each section remixes these motifs.

============================================================
HERO V2
============================================================

The current Hero is too close to a standard landing page with an object
behind it.

Completely recompose the immersive Hero.

Keep:
- existing headline
- role
- subhead
- CTA destinations
- highlights

But radically change presentation.

Target composition:

Desktop:

LEFT / CENTER LEFT
- large editorial headline
- intentional line breaks where content naturally allows
- high contrast scale
- precise supporting metadata

RIGHT / CENTER RIGHT
- dominant spatial intelligence object

The AI Core must have enough scale and depth to define the entire first
viewport.

Allow controlled overlap between typography and spatial imagery while
keeping text fully readable.

Create depth layers:

foreground typography
midground computational markings
AI Core
background field

The first viewport should immediately communicate:

"This is an engineered interactive experience."

not:

"This is a Tailwind portfolio with Three.js behind it."

============================================================
AI CORE V2
============================================================

The current object is essentially:

icosahedron
+ wireframe
+ two torus rings
+ sphere.

That is not distinctive enough.

Redesign it into a genuinely authored procedural object.

Do NOT replace it with a downloaded model.

Explore a combination of:

- multi-layer procedural shell
- fragmented / segmented surface
- barycentric or faceted edge treatment
- inner singularity
- signal arcs
- orbit fragments rather than complete generic torus rings
- controlled displacement
- surface phase transitions
- sparse data nodes
- subtle energy transfer between shell and core
- sectional decomposition driven by scroll

It should have states rather than merely positions.

Examples:

DORMANT
ASSEMBLING
DECOMPOSED
INDEXING
COMPRESSED
RESOLVED

These states correspond to sections.

Do not just move the same object left/right/backward.

============================================================
IMPORTANT SHADER AUDIT
============================================================

Audit the existing Fresnel shader carefully.

Ensure view direction and normals are calculated in compatible coordinate
spaces.

Do not preserve visually incorrect shader math merely because it already
works without compilation errors.

Improve:
- material depth
- silhouette
- Fresnel response
- displacement
- transparency ordering where necessary

Avoid overcomplicated shader code with no visible payoff.

============================================================
HERO TYPOGRAPHY / WEBGL RELATIONSHIP
============================================================

WebGL must visibly respond to DOM composition.

For example:

headline bounding region
        ↓
AI Core composition avoids/counterbalances it

pointer movement
        ↓
signal field bends slightly

scroll velocity
        ↓
temporary material tension / deformation

Do not make the DOM and Canvas feel like two unrelated layers.

============================================================
NAVIGATION
============================================================

Keep every current nav item, target and behavior.

But immersive mode should NOT retain the generic floating pill navbar
unchanged.

Design a technical editorial navigation system.

Possible direction:

- thin horizontal rail
- small section index
- precise mono labels
- minimal active-position indicator
- transparent surface
- almost no rounded-container language

Do not add complicated navigation behavior.

Mobile menu behavior must remain functionally identical.

============================================================
ABOUT
============================================================

Current About relies on a conventional text column + education card.

For immersive mode, turn it into an editorial identity spread.

Preserve all existing information.

Suggested composition:

large statement
+
secondary body
+
education metadata as structured technical information

Use:
- asymmetric columns
- large whitespace
- horizontal/vertical rules
- large section index
- subtle WebGL structure behind the empty region

Avoid placing education information inside another generic glowing card.

Think editorial technical dossier, not dashboard widget.

============================================================
EXPERIENCE
============================================================

Keep the existing chronological information and scroll behavior.

Remove the feeling of:

card
card
card.

Reframe it as a SYSTEM TIMELINE.

Potential visual structure:

YEAR / PERIOD column
|
ROLE + COMPANY
|
SUMMARY
|
SELECTED DETAILS

Use a single continuous structural axis.

The WebGL environment may create sparse depth traces aligned with the
timeline.

As each experience enters the focus region:

- structural line activates
- local spatial field tightens
- AI Core subtly decomposes
- one signal pulse moves through the global scene

Do NOT animate everything.

Use one high-quality visual response.

============================================================
PROJECTS
============================================================

The existing horizontal pinned project experience is a valuable UX
feature.

PRESERVE IT.

But redesign its visual presentation substantially.

Current project cards look too generic.

Treat Projects like a curated engineering case-study gallery.

Each project viewport should feel almost like a cover/poster.

Use:

- very large project index
- project title with stronger editorial scale
- short description
- stack represented cleanly
- optional existing imagery if available
- architectural rules and masks
- less rounded-card framing
- stronger empty-space composition

The project remains clickable exactly as before.

Do NOT move project interaction into WebGL.

However, synchronize the background WebGL state to the active project.

For example:

Project 01:
specific core orientation / signal topology

Project 02:
different shell state

Project 03:
different field compression

Use project index / scroll position, not fake random animations.

============================================================
SKILLS
============================================================

Current Skills is an asymmetric bento made of double-bezel cards.

Replace this visual language in immersive mode.

Do NOT make another skill-card grid.

Reinterpret skills as a computational capability matrix.

Possible structure:

AI / ML                technologies
LLM / RAG              technologies
BACKEND                 technologies
INFRASTRUCTURE          technologies

Use:

large discipline labels
thin grid lines
small technology metadata
deliberate alignment
responsive wrapping

Optionally allow the WebGL spatial field to organize into structured
clusters while this section is active.

IMPORTANT:

Do NOT create the generic AI visualization:

random dots
+
many connecting lines.

Any connections must be sparse and meaningful.

============================================================
CONTACT
============================================================

Contact should feel like the spatial experience resolving into a calm,
precise final frame.

Preserve all current contact methods and actions.

Reduce visual noise.

Use:
- one strong final statement
- clear email/contact action
- precise metadata
- restrained spatial field
- nearly resolved AI Core

Avoid another large rounded glass card.

The final viewport should feel intentional enough to work as the closing
frame of a film.

============================================================
SECTION TRANSITIONS
============================================================

The current implementation relies too heavily on hard-coded global scroll
fractions.

Do not use arbitrary assumptions like:

0.25
0.55
0.80

as the primary section choreography system.

The current page includes pinned horizontal project scrolling, so global
document percentages do not reliably represent semantic section state.

Build section-aware progress.

Measure actual DOM section locations.

Possible techniques:

- ScrollTrigger progress
- IntersectionObserver + measured bounds
- cached section geometry
- section-specific normalized progress

Expose:

activeSection
sectionProgress
globalProgress
scrollVelocity
pointer

The Three.js scene should know semantically where the user is.

============================================================
SCENE STORYBOARD
============================================================

Implement a clear visual storyboard.

HERO
Core is large, asymmetric, composed beside headline.
Field is sparse and deep.

ABOUT
Outer shell separates into architectural layers.
Core remains visible but less dominant.

EXPERIENCE
Fragments align into a directional structural axis.
Signal motion becomes linear and deliberate.

PROJECTS
Core becomes more planar/compressed.
Background acts as a spatial gallery environment.
State may respond to active project index.

SKILLS
Field becomes structured and computational.
Core exposes internal hierarchy.

CONTACT
Fragments resolve.
Field becomes minimal.
Motion decays toward stillness.

The changes must be visible.

Do not merely move the object to a different x/y/z position.

============================================================
SPATIAL FIELD V2
============================================================

The existing implementation is a small random points cloud.

Redesign it.

Avoid generic stars.

Consider a combination of:

- depth-distributed micro glyph-like points
- sparse signal segments
- deterministic spatial clusters
- near-camera dust only where useful
- section-dependent topology
- scroll-velocity disturbances that settle quickly

The field should have composition.

It must not look randomly generated.

Use seeded deterministic layouts.

============================================================
DOM MICRO-INTERACTIONS
============================================================

Immersive mode should have its own motion language.

Examples:

headings:
mask reveal / line reveal

section numbers:
precise opacity/position transitions

project surfaces:
subtle perspective and specular edge response

links:
directional indicator response

technical rules:
draw/retract

Do NOT animate every child element.

Create hierarchy:

PRIMARY MOTION
scene transformation

SECONDARY MOTION
section typography

TERTIARY MOTION
micro-interaction

============================================================
MOTION PRINCIPLE
============================================================

Motion should react to:

- section state
- pointer
- scroll progress
- scroll velocity

But every input must be damped.

No jitter.

No twitching.

No excessive mouse-following.

No looping animation solely because animation is possible.

Ambient animation should be slow.

Interaction animation can be responsive.

Transitions should settle.

============================================================
POST-PROCESSING
============================================================

The current Canvas has almost no authored image treatment.

Evaluate whether SMALL amounts of post-processing materially improve the
scene.

Potentially acceptable:

- extremely controlled bloom
- subtle vignette
- restrained noise/dither
- limited chromatic treatment during transitions only

Do NOT add all effects by default.

No permanent heavy chromatic aberration.

No excessive bloom.

No blurry cinematic filter over readable DOM.

Performance tiers must control these features.

============================================================
LIGHTING
============================================================

The current simple ambient + directional + teal point-light setup feels
technical-demo-like.

Improve the light composition.

Use lighting to establish:

- primary form
- rim
- inner emission
- controlled contrast
- depth separation

Avoid rainbow lighting.

Maintain restrained spectral identity.

============================================================
IMMERSIVE DESIGN TOKENS
============================================================

Create a richer immersive token layer.

Current immersive token differences are too small.

Introduce semantic variables for:

--immersive-bg
--immersive-surface
--immersive-surface-hot
--immersive-fg
--immersive-muted
--immersive-signal
--immersive-line
--immersive-line-strong
--immersive-depth
--immersive-specular

Use them intentionally.

Do not sprinkle arbitrary teal everywhere.

Signal accent must be scarce enough to remain meaningful.

============================================================
RESPONSIVE ART DIRECTION
============================================================

Do not simply scale desktop down.

Desktop:
full spatial composition

Tablet:
recompose rather than shrink

Mobile:
AI Core becomes atmospheric / partially cropped
typography becomes primary
WebGL moves behind content
simplify structural decoration
remove pointer-dependent behavior

Mobile must still clearly look like immersive mode.

============================================================
PERFORMANCE
============================================================

Preserve existing:

full
reduced
static

graphics tiers.

Improve them where appropriate.

Do not sacrifice architectural clarity.

No excessive geometry.

No huge textures unless absolutely justified.

Reuse geometry/materials.

Use instancing where meaningful.

Avoid allocations in useFrame.

Do not use React state per frame.

No duplicate RAF systems.

Audit existing Lenis + GSAP integration before adding new animation
infrastructure.

============================================================
LEGACY SAFETY
============================================================

Legacy mode is now frozen.

Do not visually redesign legacy mode.

Do not accidentally apply immersive selectors globally.

Every substantial new DOM treatment must be scoped to immersive mode or
to explicit variants.

After implementation:

?visual=legacy

must remain equivalent to the current legacy site.

============================================================
NO DESIGN-SLOP CHECKLIST
============================================================

Reject the implementation if it contains excessive:

[ ] pill containers
[ ] glassmorphism cards
[ ] rounded rectangles
[ ] meaningless gradients
[ ] neon glow
[ ] generic particles
[ ] floating cubes
[ ] fake terminal windows
[ ] fake code snippets
[ ] fake telemetry
[ ] random coordinates
[ ] arbitrary futuristic labels
[ ] decorative charts with fake data
[ ] AI-purple
[ ] cyan everywhere
[ ] repeated bento cards

Do not invent fake technical information just to make the site look
technical.

Visual detail should arise from structure and motion, not fake content.

============================================================
VISUAL ACCEPTANCE CRITERIA
============================================================

The redesign is accepted only if ALL are true:

1. Legacy and immersive screenshots look like two clearly different art
   directions.

2. Navigation and content behavior remain the same.

3. Immersive mode still looks intentionally redesigned when WebGL is
   disabled.

4. Hero no longer looks like a normal Tailwind landing page with a 3D
   object behind it.

5. At least About, Experience, Projects, Skills and Contact receive
   immersive-specific presentation treatment.

6. No section feels like a collection of generic glass cards.

7. Three.js changes semantically by section rather than merely moving an
   object across the screen.

8. Project horizontal-scroll behavior still works exactly as before.

9. Mobile clearly retains the immersive identity.

10. No obvious accessibility, hydration, performance or lifecycle
    regressions.

============================================================
IMPLEMENTATION PROCESS
============================================================

PHASE 1
Audit current immersive implementation.

Before coding, explicitly write:

- what is visually insufficient
- what will remain
- what will be replaced
- section-by-section visual storyboard

PHASE 2
Implement immersive DOM design system.

Do NOT start by adding more Three.js effects.

First make immersive mode visually compelling with DOM/CSS alone.

PHASE 3
Rebuild Hero composition.

PHASE 4
Redesign About / Experience / Projects / Skills / Contact.

PHASE 5
Upgrade Three.js Core and field.

PHASE 6
Connect semantic section progress and project state to WebGL.

PHASE 7
Add only justified postprocessing / micro-interactions.

PHASE 8
Performance profiling.

PHASE 9
Side-by-side visual QA.

============================================================
FINAL QA
============================================================

Capture or inspect at minimum:

1440x900:
legacy hero
immersive hero
immersive about
immersive experience
immersive projects
immersive skills
immersive contact

375x812:
immersive hero
immersive projects
immersive contact

Then critically ask:

"Would an experienced frontend/creative developer describe this as an
art-directed immersive portfolio, or simply a standard portfolio with a
Three.js background?"

If the second answer is plausible, continue iterating.

Do not stop at technically correct.

Do not stop because the build passes.

Visual quality is a required deliverable.