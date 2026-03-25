type UnicornStudioSceneConfig = {
  altText: string;
  ariaLabel: string;
  dpi: number;
  elementId: string;
  filePath: string;
  lazyLoad: boolean;
  scale: number;
};

type UnicornStudioWindow = Window & {
  UnicornStudio?: {
    addScene: (config: UnicornStudioSceneConfig) => Promise<unknown>;
  };
};

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      return false;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
      const normalizedRenderer = renderer.toLowerCase();
      if (
        normalizedRenderer.includes('swiftshader') ||
        normalizedRenderer.includes('llvmpipe') ||
        normalizedRenderer.includes('software')
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

function init(): void {
  const canvasTarget = document.getElementById('unicorn-canvas');
  if (!canvasTarget) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.info('Skipping UnicornStudio: User prefers reduced motion');
    return;
  }

  if (!checkWebGLSupport()) {
    console.info('Skipping UnicornStudio: Hardware acceleration unavailable');
    return;
  }

  const existingScript = document.querySelector<HTMLScriptElement>('[data-unicorn-studio-loader]');
  if (existingScript) {
    return;
  }

  const script = document.createElement('script');
  script.dataset.unicornStudioLoader = 'true';
  script.src =
    'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js';
  script.onload = () => {
    const unicornWindow = window as UnicornStudioWindow;
    unicornWindow.UnicornStudio?.addScene({
      elementId: 'unicorn-canvas',
      filePath: '/clouds.json',
      scale: 1,
      dpi: 1.5,
      lazyLoad: true,
      altText: 'Animated cloud background',
      ariaLabel: 'Animated cloud background',
    }).catch((error: unknown) => {
      console.warn('UnicornStudio failed to load:', error);
    });
  };
  document.head.appendChild(script);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
