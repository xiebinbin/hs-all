import type { auth } from "@/lib/auth";

export interface JSONRPCRequest {
  method: string
  params: any[]
  id?: number | string | null
  jsonrpc: string
}

export interface RpcContext {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}


