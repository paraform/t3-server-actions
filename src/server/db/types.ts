import { type posts, type users } from "./schema";

export type UserType = typeof users.$inferSelect;
export type UserInsertType = typeof users.$inferInsert;
export type PostType = typeof posts.$inferSelect;
export type PostInsertType = typeof posts.$inferInsert;
