# ITS Backdrop - Interactive 3D Landing Page

A high-performance, cinematic 3D landing page built with Next.js, React Three Fiber, and Tailwind CSS. Featuring an interactive chrome-finished keychain as a centerpiece.

## Features

- **Interactive 3D Centerpiece**: High-quality GLB model with premium chrome shaders using `MeshPhysicalMaterial`.
- **Dynamic Background Branding**: Massive "World of IT" logo with toggle controls and responsive scaling.
- **Cinematic Environment**: Pure black aesthetic with optimized "City" preset lighting for realistic metal reflections.
- **Capture & Export**: Integrated MediaRecorder engine to download high-quality (60fps) animations with transparent background support.
- **Responsive Design**: Full viewport-aware scaling for both the 3D scene and layout elements.
- **Animation Controls**: Real-time speed adjustment (0.5x to 5x) for the model's movement.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **3D Engine**: React Three Fiber (R3F)
- **3D Utilities**: @react-three/drei
- **Styling**: Tailwind CSS
- **Recording**: MediaRecorder API + captureStream

## Setup and Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

## Key Components

- `app/page.tsx`: Main entry point containing the UI layer, recording logic, and logo toggle state.
- `app/components/Scene.tsx`: The 3D engine implementation, including viewport scaling, lighting, and chromic material application.

## Controls

- **Hide/Show Logo**: Toggles the visibility of the background branding.
- **Speed Selector**: Adjusts the rotation/animation speed of the keychain miniatures.
- **Capture Scene**: Records a 10-second high-quality clip of the 3D scene.
