#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import componentsData from './components-data.json' with { type: 'json' };
import type { ComponentMeta } from './types.ts';

const components = componentsData as ComponentMeta[];

function closestName(name: string): string | undefined {
  const target = name.toLowerCase();
  return components.map((c) => c.name).find((n) => n.toLowerCase().startsWith(target[0] ?? ''));
}

const server = new McpServer({
  name: 'pulse-components-mcp',
  version: '0.1.0',
});

server.registerTool(
  'list_components',
  {
    title: 'List pulse-components',
    description:
      'Lists every component available in the pulse-components library with its category and short description. Use this to discover what is available before asking for details on a specific component.',
    inputSchema: {},
  },
  async () => {
    const summary = components.map(({ name, category, description }) => ({ name, category, description }));
    return {
      content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
    };
  },
);

server.registerTool(
  'get_component',
  {
    title: 'Get pulse-components component details',
    description:
      'Returns full details for a single pulse-components component: props, variants, sizes, accessibility notes, and Storybook usage examples. Does not recommend which component to use — that decision is left to the developer.',
    inputSchema: {
      name: z.string().describe('Exact component name, e.g. "Button" or "Select"'),
    },
  },
  async ({ name }) => {
    const component = components.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!component) {
      const suggestion = closestName(name);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `No component named "${name}" was found.${suggestion ? ` Did you mean "${suggestion}"?` : ''} Use list_components to see all available components.`,
          },
        ],
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(component, null, 2) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
