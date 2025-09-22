# Codex Convergence - Game Design Document

## Overview
Codex Convergence is a fast-paced browser game where players assemble glowing "codex fragments" to restore the legendary Codex Obscura. The game mixes match-and-collect mechanics with a time pressure system, requiring quick thinking and prioritization to achieve high scores. The theme draws inspiration from arcane libraries and digital runes, blending ancient tomes with neon circuitry.

## Platform & Technology
- **Platform:** Desktop and mobile web browsers
- **Technology Stack:** HTML, CSS, Vanilla JavaScript
- **Screen Orientation:** Responsive layout optimized for landscape but playable in portrait
- **Dependencies:** None (self-contained assets)

## Target Audience & Experience Goals
- Casual players looking for quick, satisfying sessions (~3 minutes)
- Fans of puzzle and arcade gameplay with thematic flair
- Goals: deliver an intuitive core loop with escalating challenge, light narrative flavor, and replayability through high-score chasing

## Core Gameplay Loop
1. Fragments bearing different runes fall into the Codex grid.
2. Player clicks/taps sequences of adjacent fragments to "bind" them into a verse.
3. Binding fills the Codex progress bar; combo multipliers increase score.
4. Timer counts down; successfully binding grants bonus time and special sigils.
5. Game ends when time expires; player sees final score and codex completion percentage.

## Mechanics
- **Grid:** 6x6 matrix of codex fragments.
- **Fragments:** Four rune types (Aether, Cipher, Pulse, Glyph) represented by distinct colors.
- **Binding:** Players select chains of 3+ matching fragments. Bound fragments vanish, remaining ones collapse downward, and new fragments spawn at top.
- **Combo Meter:** Consecutive bindings within a short window increase multiplier.
- **Sigils:** Binding 5+ fragments spawns a sigil fragment that clears its row when bound.
- **Timer:** 90-second base timer; binding adds +2 seconds per chain, +5 with sigils.
- **Scoring:** Base score = number of fragments * multiplier. Bonus for sigils.

## Controls & Input
- Mouse click or touch to select fragments; release to bind.
- Optional keyboard support: arrow keys to move cursor, space to bind (if time allows).

## Progression & Difficulty Scaling
- Timer decreases faster as score increases.
- Random chance of "glitched" fragments that require double binding at higher scores.
- Background visuals intensify (glowing lines animate faster) as player approaches codex completion.

## Visual & Audio Direction
- Palette: dark indigo background with cyan, magenta, gold, and lime highlights.
- Typography: stylized techno serif for titles, monospace for HUD.
- Effects: neon glow, particle sparks when binding, subtle parallax of shelves.
- Audio: ambient hum for background, chime for bindings, booming chord for sigils.

## UI Layout
- Header: Game title and timer at top.
- Left Sidebar: Combo meter and codex progress bar.
- Center: Game grid occupying majority of screen.
- Right Sidebar: Score display, sigil counter, instructions button.
- Footer: Restart button and credits.

## Game States
- **Title Screen:** Start button and brief lore snippet.
- **Gameplay:** Active play with HUD.
- **Pause:** Triggered by pressing `P`, dims screen.
- **Game Over:** Displays results and restart option.

## Narrative Flavor
- Player is an Archivist restoring the shattered Codex Obscura.
- Each binding reveals a "verse" line, randomly selected from flavor text pool.

## Live Ops & Replayability
- Local high-score storage using browser localStorage.
- Daily rune alignment: small shift in color palette or starting grid random seed.

## Accessibility
- Color-blind friendly mode toggled via settings (uses patterns in fragments).
- Adjustable animation speed (normal, reduced).
- Sound toggle.

## Monetization
- None; free browser experience.

## Development Scope & Milestones
1. **Prototype:** Implement grid spawning, chain detection, and scoring logic.
2. **Vertical Slice:** Add UI elements, animations, timer, and sigils.
3. **Polish:** Implement sound hooks, accessibility options, localStorage, responsive layout.
4. **Launch:** Optimize performance, finalize art assets, QA on major browsers.

## Risks & Mitigations
- **Touch Input Accuracy:** Simplify selection to tap-only binding if drag detection proves unreliable.
- **Performance on Low-End Devices:** Use CSS transitions and limit DOM updates.
- **Scope Creep:** Maintain focus on core loop; treat sigils and accessibility toggles as stretch goals.

## Success Metrics
- Average session length of 2+ minutes.
- Player retention through high-score replays (localStorage usage metrics).
- Positive feedback on codex theme integration (visuals + narrative flavor).

