# Mountain — 3D Portfolio

Interactive 3D mountain scene (React + Vite + react-three-fiber) with an in-scene browser portfolio UI.

## Tech

- React 18 + TypeScript
- Vite
- `@react-three/fiber`, `@react-three/drei`, `three`
- ESLint, Yarn

## Scripts

```bash
yarn dev      # start dev server
yarn lint     # eslint
yarn build    # tsc -b && vite build (outputs to dist/)
```

## Architecture (DDD-aligned, feature-based)

```
src/
├── main.tsx / App.tsx           # composition root
│
├── context/                     # cross-feature state (split per domain)
│   ├── scene/                   # runIntro, cameraPreset (+ PresetKey canonical)
│   ├── portfolio/               # browserMode, visibleSectionIds, language,
│   │                            # useTranslation (context-aware hook)
│   └── device/                  # DeviceContext (DeviceType re-exported from shared)
│
├── shared/                      # leaf — imports nothing from context/ or presentation/
│   ├── components/              # ErrorBoundary, Icon
│   ├── i18n/                    # translations, LanguageType, getText()
│   └── device/                  # detectDevice(), breakpoints, DEVICE/DeviceType
│
└── presentation/                # UI features
    ├── Scene/                   # EVERYTHING 3D (Canvas, Model, CameraRig, …)
    │   ├── config/              # cameraPresets, sceneObjects, positions, …
    │   ├── adapters/            # Position3D → three.js types
    │   ├── hooks/               # useOpenPortfolio, useChangeCameraPreset, …
    │   └── <Component>/         # one folder per component (.tsx + .css + types.ts)
    │
    └── Browser/                 # EVERYTHING portfolio UI
        ├── Navigation/
        │   ├── hooks/           # useScrollNavigation, useScreenVisibility, …
        │   ├── services/        # computeActiveSection (pure)
        │   └── LanguageSwitcher/
        └── Sections/            # Overview, About, Service, Contact
            └── Contact/
                ├── services/    # generate*Link, meetingScheduler, phoneValidator
                └── hooks/
```

### Dependency rules

```
presentation/  → context/ + shared/
context/       → shared/ only
shared/        → (leaf, imports nothing from the above)
Scene/ ⟷ Browser/                (never — composed in App.tsx via render-prop)
```

- `Scene` and `Browser` never import from each other. `App.tsx` composes them
  by passing `renderPortfolio={(pos) => <Browser position={pos} />}` to `Scene`.
- Types that are shared state (`PresetKey`, `SectionIdType`, `DeviceType`,
  `BROWSER_MODE`) live in their context/shared module; presentation re-exports
  them for import-path stability.

### Deployment

See `deploy.md`.
