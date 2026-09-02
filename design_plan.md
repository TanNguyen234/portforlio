You are acting as a senior Creative Frontend Engineer, WebGL Engineer,
UI Engineer, and performance-conscious software architect.

I want you to TEMPORARILY redesign the VISUAL PRESENTATION of my existing
portfolio into a premium immersive Three.js experience.

This is NOT a UX redesign.

The existing portfolio already has its information architecture, content,
routes, navigation, sections, interactions, links and user flows.

Your job is to build a reversible "immersive visual skin" on top of the
existing portfolio.

============================================================
PRIMARY OBJECTIVE
============================================================

Create a visually impressive, modern, premium developer portfolio using
Three.js/WebGL while preserving the current UX almost exactly.

The result should feel like a high-end creative developer / AI engineer
portfolio seen on modern Awwwards-style websites, but it must remain:

- readable
- fast
- accessible
- recruiter-friendly
- easy to navigate
- responsive
- maintainable
- completely reversible

DO NOT convert the portfolio into a game.

DO NOT redesign the information architecture.

DO NOT replace normal website navigation with 3D navigation.

============================================================
CRITICAL REQUIREMENT: REVERSIBLE VISUAL MODE
============================================================

The existing UI MUST remain available.

Do not delete or destructively rewrite the current design.

Implement two visual modes:

1. legacy
   = current visual appearance

2. immersive
   = new Three.js visual appearance

Create a clean visual-mode abstraction appropriate for the current stack.

Prefer architecture similar to:

VisualModeProvider / visualMode config
        |
        +-- legacy
        |
        +-- immersive

or an equivalent architecture that fits this repository.

The underlying content, routes, business logic and interaction behavior
should be shared whenever possible.

DO NOT duplicate the entire website unnecessarily.

A visual mode should control presentation, animation and WebGL layers,
not application logic.

============================================================
SWITCHING REQUIREMENTS
============================================================

I need to be able to return to the old design very easily.

Implement an explicit configuration switch.

Depending on the project's framework, use an appropriate environment
variable such as:

NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE=legacy
NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE=immersive

or:

VITE_PORTFOLIO_VISUAL_MODE=legacy
VITE_PORTFOLIO_VISUAL_MODE=immersive

or the equivalent mechanism for the detected stack.

Also implement a DEVELOPMENT/QA override:

?visual=legacy
?visual=immersive

The query parameter may override the default visual mode for testing.

Do NOT expose an unnecessary visual-mode control to normal users unless
there is already a theme/settings UI where it naturally belongs.

Default safely to legacy if configuration is invalid.

If WebGL cannot initialize, automatically fall back to legacy or a
lightweight non-WebGL immersive fallback.

============================================================
FIRST: INSPECT THE REPOSITORY
============================================================

Before modifying code, inspect the existing repository thoroughly.

Determine:

- framework
- rendering architecture
- routing
- styling solution
- current animation libraries
- component structure
- page sections
- responsive implementation
- reusable design tokens
- current dependencies
- whether Three.js already exists
- whether React Three Fiber is appropriate
- whether GSAP or another animation library already exists
- deployment environment

Identify the CURRENT UX contract.

Explicitly inventory:

- routes
- nav links
- anchor targets
- CTA buttons
- project links
- forms
- downloadable links
- external links
- keyboard interactions
- responsive navigation
- scroll behavior
- section order

Treat this behavior as immutable unless fixing an obvious bug.

============================================================
NON-NEGOTIABLE UX CONTRACT
============================================================

DO NOT change:

- route structure
- section order
- project order unless the existing code already dynamically controls it
- text/content
- link destinations
- navigation behavior
- CTA behavior
- form behavior
- keyboard focus order
- semantic heading hierarchy
- accessibility labels
- responsive navigation behavior
- native scrolling behavior
- existing functional state
- API calls
- backend logic
- authentication if any
- analytics behavior
- SEO metadata unless technically required

A user familiar with the current portfolio should immediately know how to
use the immersive version.

The visual experience may change dramatically.

The UX must not.

============================================================
DO NOT USE THESE PATTERNS
============================================================

Do NOT:

- turn the portfolio into a first-person environment
- require WASD
- require drag-to-explore to discover content
- hide projects inside a 3D world
- replace DOM buttons with WebGL hit targets
- replace readable HTML text with canvas-rendered text
- hijack native scrolling
- require horizontal scrolling
- add unnecessary splash screens
- introduce long cinematic intros
- block the page while waiting for large 3D assets
- make important information depend on animation
- add excessive bloom everywhere
- add generic cyberpunk neon styling
- create a template-looking "AI website"
- rewrite unrelated components
- modify backend code for visual purposes

============================================================
ART DIRECTION
============================================================

Creative direction:

"Immersive Digital Intelligence Space"

The portfolio should feel:

- sophisticated
- technical
- futuristic
- spatial
- intelligent
- precise
- slightly experimental
- premium

Avoid:

- childish 3D
- excessive gradients
- giant blobs
- random floating cubes
- generic SaaS gradients
- generic particle backgrounds
- Tron-style neon overload
- excessive glassmorphism
- visual noise

Use a restrained dark visual system:

- graphite / near-black environment
- subtle luminous accents
- metallic / glass-like materials when appropriate
- soft volumetric-looking light illusion
- controlled bloom only where visually justified
- fine grid/data/constellation motifs
- large negative space
- sharp typography
- strong depth hierarchy

The 3D should support the content rather than compete with it.

============================================================
HERO EXPERIENCE
============================================================

The Hero should be the strongest visual moment.

Create a central abstract "AI Core" / "Digital Intelligence Object".

It should NOT be a literal robot brain.

Possible visual language:

- distorted icosahedron
- layered translucent geometry
- refractive shell
- wireframe/data layer
- subtle Fresnel edge
- controlled shader displacement
- internal particle energy
- slow autonomous motion
- pointer-reactive distortion

The object should feel mathematically/generated rather than like a stock
3D model.

Interaction:

Mouse movement should create subtle:

- rotation
- parallax
- light movement
- shader response

Do not make the object aggressively follow the cursor.

The existing hero:

- name
- job title
- description
- CTA
- social links

must remain normal DOM content.

Keep all text selectable.

Keep all links accessible.

The WebGL canvas must NEVER prevent clicking or selecting the HTML UI.

============================================================
GLOBAL THREE.JS ENVIRONMENT
============================================================

Prefer ONE intelligently managed global scene/canvas rather than creating
many independent WebGL contexts.

The canvas may be:

position: fixed

behind or between selected DOM layers.

It should react to the current visible section.

Use section state to transition the scene rather than loading completely
different heavy scenes.

Possible scene progression:

HERO
AI Core + spatial particles

ABOUT
Core opens / decomposes slightly into structured layers

SKILLS
Particles organize into network / constellation patterns

PROJECTS
Subtle floating planes / geometry suggest a digital gallery,
but actual project cards remain HTML

EXPERIENCE
Structured lines / timeline-like depth field

CONTACT
Scene becomes minimal, calm and focused

These transitions should happen smoothly based on normal page scrolling.

Scrolling itself must remain native.

============================================================
DOM + WEBGL HYBRID
============================================================

Important content must remain HTML/DOM.

Three.js should primarily handle:

- background spatial environment
- abstract centerpiece
- decorative geometry
- particles
- shader effects
- lighting/depth
- section atmosphere

HTML/CSS should handle:

- headings
- paragraphs
- navigation
- buttons
- links
- project information
- forms
- skill labels
- experience content

This separation is mandatory.

============================================================
PROJECT CARDS
============================================================

Preserve the current project cards and their interaction behavior.

Enhance them visually rather than replacing them.

Possible enhancements:

- subtle CSS perspective
- very small mouse tilt
- light-follow-cursor
- depth shadow
- edge highlight
- animated border
- reveal masks
- image parallax
- restrained glass/metal surface

Do NOT make project cards hard to click.

Do NOT make text rotate in 3D.

Do NOT put project titles into WebGL.

On touch devices, remove cursor-dependent effects cleanly.

============================================================
SCROLL ANIMATION
============================================================

Use native document scrolling.

You may use an existing animation system or GSAP ScrollTrigger if
appropriate for observing scroll progress.

DO NOT implement scroll hijacking.

DO NOT force each wheel event into cinematic sections.

DO NOT lock scroll.

Scene transitions should respond to scrolling rather than control it.

============================================================
MOTION DESIGN
============================================================

Animation should feel smooth and physical.

Use:

- interpolation / damping
- subtle inertia
- staggered reveals
- restrained parallax
- slow ambient motion
- section-based state transitions

Avoid constant large motion.

Most animations should settle.

The site should still look good in a static screenshot.

============================================================
PERFORMANCE ARCHITECTURE
============================================================

Performance is a first-class feature.

Before implementing expensive effects, consider their cost.

Requirements:

- lazy-load WebGL code when possible
- do not block initial HTML rendering
- avoid unnecessary large 3D assets
- prefer procedural geometry for the primary abstract scene
- cap effective device pixel ratio appropriately
- reduce complexity on mobile
- reduce post-processing on weak devices
- avoid excessive draw calls
- reuse geometry/materials where possible
- use instancing where repeated geometry is justified
- pause/reduce rendering when the page is not visible
- avoid rendering at full cost when nothing changes
- clean up listeners
- clean up animation loops
- properly dispose Three.js resources on unmount
- avoid memory leaks when switching immersive -> legacy -> immersive

If React Three Fiber is already appropriate for the stack:

- use it cleanly rather than mixing imperative Three.js everywhere
- consider on-demand/adaptive rendering where suitable
- keep Canvas isolated from application state
- avoid unnecessary React re-renders inside animation loops

Do not introduce R3F solely because it is fashionable if native Three.js
fits this repository better.

============================================================
RESPONSIVE BEHAVIOR
============================================================

Desktop may receive the full experience.

Tablet:
- reduce particle counts
- reduce shader complexity if needed
- reduce parallax amplitude

Mobile:
- preserve the exact mobile UX
- prioritize text readability
- keep CTA immediately usable
- simplify the Three.js scene
- disable expensive effects
- remove hover-only behavior
- avoid giant canvas GPU cost
- avoid horizontal overflow

The mobile experience should feel intentionally designed rather than being
a desktop scene squeezed onto a phone.

============================================================
ACCESSIBILITY
============================================================

Respect:

prefers-reduced-motion: reduce

When reduced motion is requested:

- disable pointer parallax
- remove large continuous rotations
- remove unnecessary camera motion
- strongly reduce particle movement
- eliminate intense transitions
- maintain visual hierarchy

The page must remain fully usable without WebGL.

Maintain:

- semantic HTML
- keyboard navigation
- focus indicators
- readable contrast
- screen-reader-compatible content

Canvas decorations should not pollute the accessibility tree.

============================================================
LOADING
============================================================

Do not create a long loading screen.

HTML content should appear independently of the WebGL scene.

If WebGL needs time to initialize:

1. render the website normally
2. progressively introduce the 3D scene
3. crossfade it in when ready

Never make a recruiter wait for the portfolio content because a shader or
3D asset is loading.

============================================================
FAILURE/FALLBACK BEHAVIOR
============================================================

Immersive mode must fail gracefully.

If any of these occur:

- WebGL initialization failure
- shader compilation problem
- unsupported GPU feature
- asset loading failure

the core portfolio must continue working.

Never allow a Three.js failure to blank the page.

============================================================
ARCHITECTURE
============================================================

Keep the implementation modular.

Adapt naming to the existing repository, but conceptually separate:

visual-mode/
three/
    scene/
    components/
    shaders/
    hooks/
    performance/
    config/
styles/
    tokens/
    legacy/
    immersive/

Do not reorganize the entire application just to match this example.

Prefer the smallest architectural change capable of cleanly separating
visual presentation.

============================================================
CSS / DESIGN TOKENS
============================================================

Reuse existing semantic styling where possible.

Introduce visual tokens instead of scattering magic values.

Example concept:

--surface
--surface-elevated
--text-primary
--text-secondary
--accent
--border
--glow
--depth-shadow

Visual mode should swap token values.

Avoid adding hundreds of one-off CSS declarations.

============================================================
POINTER LAYERING
============================================================

WebGL must not break HTML interaction.

As a default:

canvas {
    pointer-events: none;
}

If the scene needs pointer position, track pointer position from the
window/document rather than turning the entire canvas into an interaction
surface.

Only use pointer events on WebGL objects if absolutely necessary, and
never for existing navigation or CTA functionality.

============================================================
IMPLEMENTATION STRATEGY
============================================================

Work in phases.

PHASE 1 — BASELINE

Inspect the project and document:

- current architecture
- existing UX
- current visual system
- performance-sensitive areas
- files likely to be modified

PHASE 2 — REVERSIBLE MODE SYSTEM

Implement legacy / immersive visual mode infrastructure.

Verify legacy mode still renders identically to the original UI before
continuing.

PHASE 3 — IMMERSIVE FOUNDATION

Add:

- global Three.js canvas
- camera
- lighting/environment
- visual tokens
- responsive behavior
- WebGL fallback
- reduced-motion behavior

PHASE 4 — HERO

Implement the high-quality procedural AI Core.

Spend most creative effort here.

PHASE 5 — SECTION STATES

Make the global scene subtly evolve as existing sections enter/leave the
viewport.

Do NOT modify page navigation.

PHASE 6 — DOM MICRO-INTERACTIONS

Improve:

- project cards
- buttons
- section reveals
- decorative borders
- depth effects

without altering their behavior.

PHASE 7 — PERFORMANCE

Profile:

- FPS
- draw calls
- triangles
- texture usage
- bundle impact
- mobile behavior
- memory after repeated visual-mode switches

Optimize based on observed bottlenecks.

PHASE 8 — QA

Test both visual modes.

============================================================
MANDATORY REGRESSION TEST
============================================================

Compare legacy and immersive modes.

The following must behave identically:

[ ] navigation
[ ] anchor scrolling
[ ] route transitions
[ ] project links
[ ] GitHub links
[ ] demo links
[ ] contact links
[ ] buttons
[ ] forms
[ ] mobile navigation
[ ] keyboard navigation
[ ] responsive layout
[ ] content ordering

Check:

320px
375px
768px
1024px
1440px
1920px

Also verify:

- no unexpected horizontal scrolling
- no canvas blocking clicks
- no layout shift caused by canvas
- no WebGL errors
- no hydration errors
- no console errors
- no event-listener leaks
- no obvious GPU-resource leaks

============================================================
PERFORMANCE ACCEPTANCE
============================================================

Measure the current portfolio before making the visual changes.

Use the existing site as the baseline.

The immersive experience may cost additional GPU resources, but it should
not severely regress normal page usability.

Prefer a relative target:

- keep layout/content responsive during load
- avoid noticeable input latency
- desktop animation should visually approach smooth 60fps where practical
- mobile animation should remain stable rather than chasing maximum visual quality
- avoid large Lighthouse regressions compared with the baseline
- minimize CLS
- do not delay meaningful text content for WebGL

If an effect is beautiful but causes major performance regression,
simplify or remove it.

============================================================
VISUAL QUALITY BAR
============================================================

Do NOT stop after adding:

- a rotating sphere
- a starfield
- a gradient background
- random floating geometry

That is not enough.

The scene needs a coherent visual identity.

Focus on:

1. composition
2. material response
3. depth
4. controlled lighting
5. shader detail
6. interaction
7. transitions between section states
8. typography/3D balance

The result should look intentionally art-directed.

============================================================
IMPORTANT CREATIVE PRINCIPLE
============================================================

The website should communicate:

"This developer can build sophisticated interactive software."

NOT:

"This developer downloaded a Three.js effect."

Every visual effect should feel connected to the portfolio's identity as a
software / AI / technology portfolio.

============================================================
DO NOT OVERENGINEER
============================================================

Do not introduce:

- a game engine
- physics unless absolutely necessary
- Blender assets unless genuinely useful
- a huge asset pipeline
- global state libraries just for animation
- unnecessary new frameworks

Prefer procedural Three.js techniques and small composable systems.

============================================================
DELIVERABLES
============================================================

When finished, provide:

1. Summary of the original architecture.
2. List of modified files.
3. List of newly created files.
4. Explanation of the immersive architecture.
5. Exact method to switch:

   legacy -> immersive
   immersive -> legacy

6. New dependencies and why each dependency was needed.
7. Performance optimizations performed.
8. Mobile degradation strategy.
9. Accessibility/fallback strategy.
10. Known limitations.
11. Exact commands to run/test the project.

Also create:

docs/IMMERSIVE_UI.md

Document:

- architecture
- visual mode configuration
- Three.js scene structure
- performance decisions
- how to disable Three.js completely
- how to remove the immersive implementation later without damaging the
  original portfolio

============================================================
FINAL RULE
============================================================

When deciding between:

A. a more impressive 3D effect that changes or harms the UX

and

B. a slightly more restrained effect that preserves the existing UX

ALWAYS choose B.

Preserve functionality first.

Then make it visually exceptional.