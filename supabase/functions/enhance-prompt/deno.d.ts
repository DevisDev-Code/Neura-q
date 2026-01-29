// Minimal Deno type shims for VS Code linting; ignored at runtime in Supabase Edge Functions
// deno-lint-ignore-file
// This file helps the TypeScript language server understand the Deno environment

declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
}

declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void
}
