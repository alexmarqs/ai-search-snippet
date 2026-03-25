import type { PropInputType } from '../data/configurator.ts';
import { SNIPPET_VERSION } from '../data/snippets.ts';

export interface CodePropData {
  name: string;
  type: PropInputType;
  value: boolean | number | string;
}

export interface CodeCssVarData {
  name: string;
  value: string;
}

export function toCamelCase(value: string): string {
  return value.replace(/-([a-z])/g, (_match, character: string) => character.toUpperCase());
}

function extractSnippetHash(apiUrl: string): string {
  const match = apiUrl.match(/^https?:\/\/([^.]+)\.search\.ai\.cloudflare\.com/);
  return match ? match[1] : '<hash>';
}

export function generateHtmlCode(
  tag: string,
  propsData: readonly CodePropData[],
  cssVarsData: readonly CodeCssVarData[],
  darkCssData: readonly CodeCssVarData[],
  apiUrl: string
): string {
  const propsStr = propsData.length
    ? `\n${propsData.map((prop) => `  ${prop.name}="${prop.value}"`).join('\n')}`
    : '';

  let cssCode = '';
  if (cssVarsData.length > 0) {
    cssCode += `${tag} {\n${cssVarsData.map((cssVar) => `  ${cssVar.name}: ${cssVar.value};`).join('\n')}\n}`;
  }

  if (darkCssData.length > 0) {
    cssCode += `\n\n/* Dark mode */\n@media (prefers-color-scheme: dark) {\n  ${tag} {\n  ${darkCssData.map((cssVar) => `  ${cssVar.name}: ${cssVar.value};`).join('\n  ')}\n  }\n}`;
  }

  const hash = extractSnippetHash(apiUrl);

  let code = '<!-' + '- Import the library -' + '->\n';
  code += `<script type="module" src="https://${hash}.search.ai.cloudflare.com/assets/v${SNIPPET_VERSION}/search-snippet.es.js"></script>\n\n`;

  if (tag === 'search-modal-snippet') {
    code += '<button id="open-search">Open search</button>\n\n';
  }

  code += `<${tag}${propsStr}>\n`;
  code += `</${tag}>`;

  if (cssCode) {
    code += `\n\n<style>\n${cssCode}\n</style>`;
  }

  if (tag === 'search-modal-snippet') {
    code += '\n\n<script>\n';
    code += `  const modal = document.querySelector('${tag}');\n`;
    code +=
      "  document.querySelector('#open-search')?.addEventListener('click', () => modal?.open());\n";
    code += '</script>';
  }

  return code;
}

export function generateReactCode(
  tag: string,
  propsData: readonly CodePropData[],
  cssVarsData: readonly CodeCssVarData[]
): string {
  const reactProps = propsData.map((prop) => {
    const camelName = toCamelCase(prop.name);
    if (prop.type === 'number' || prop.type === 'boolean') {
      return `      ${camelName}={${prop.value}}`;
    }

    return `      ${camelName}="${prop.value}"`;
  });

  let styleAttr = '';
  if (cssVarsData.length > 0) {
    const styleObj = cssVarsData.map((cssVar) => `'${cssVar.name}': '${cssVar.value}'`).join(', ');
    styleAttr = `\n      style={{ ${styleObj} } as React.CSSProperties}`;
  }

  const hasProps = reactProps.length > 0 || styleAttr.length > 0;
  const propsStr = hasProps ? `\n${reactProps.join('\n')}${styleAttr}\n    ` : '';

  let code = 'import "@cloudflare/ai-search-snippet";\n\n';
  code += 'export default function App() {\n';
  code += '  return (\n';
  code += `    <${tag}${propsStr}/>\n`;
  code += '  );\n';
  code += '}';
  return code;
}

export function generateVueCode(
  tag: string,
  propsData: readonly CodePropData[],
  cssVarsData: readonly CodeCssVarData[]
): string {
  const vueProps = propsData.map((prop) => {
    if (prop.type === 'number' || prop.type === 'boolean') {
      return `      :${prop.name}="${prop.value}"`;
    }

    return `      ${prop.name}="${prop.value}"`;
  });

  let styleAttr = '';
  if (cssVarsData.length > 0) {
    const styleObj = cssVarsData.map((cssVar) => `'${cssVar.name}': '${cssVar.value}'`).join(', ');
    styleAttr = `\n      :style="{ ${styleObj} }"`;
  }

  const hasProps = vueProps.length > 0 || styleAttr.length > 0;
  const propsStr = hasProps ? `\n${vueProps.join('\n')}${styleAttr}\n    ` : '';

  let code = '<script setup lang="ts">\n';
  code += 'import "@cloudflare/ai-search-snippet";\n';
  code += '</script>\n\n';
  code += '<template>\n';
  code += `  <${tag}${propsStr}/>\n`;
  code += '</template>';
  return code;
}
