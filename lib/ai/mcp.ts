import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { dynamicTool, jsonSchema, type ToolExecutionOptions, type ToolSet } from "ai";

const MORPHO_MCP_URL = "https://mcp.morpho.org";

export type MCPSession = {
  client: Client;
  tools: ToolSet;
  close: () => Promise<void>;
};

export async function createMorphoMCPSession(): Promise<MCPSession> {
  const client = new Client(
    { name: "morpho-demo3", version: "0.1.0" },
    { capabilities: {} },
  );

  const transport = new StreamableHTTPClientTransport(new URL(MORPHO_MCP_URL));
  await client.connect(transport);

  const list = await client.listTools();
  const tools: ToolSet = {};

  for (const t of list.tools) {
    tools[t.name] = dynamicTool({
      description: t.description ?? t.name,
      inputSchema: jsonSchema(t.inputSchema as Record<string, unknown>),
      execute: async (input: unknown, options: ToolExecutionOptions) => {
        const result = await client.callTool(
          {
            name: t.name,
            arguments: (input ?? {}) as Record<string, unknown>,
          },
          undefined,
          { signal: options.abortSignal },
        );
        return result;
      },
    });
  }

  return {
    client,
    tools,
    close: async () => {
      try { await client.close(); } catch { /* ignore */ }
    },
  };
}
