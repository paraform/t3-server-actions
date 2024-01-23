import "server-only";

import { headers } from "next/headers";
import { createAppRouterCaller } from "@/server/api/root";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

export const api = createAppRouterCaller({
  db: db,
  headers: headers(),
  session: await auth(),
});
