import { type posts, type users } from "./schema";

export type UserProps = typeof users.$inferSelect;
export type UserInsertProps = typeof users.$inferInsert;
export type PostProps = typeof posts.$inferSelect;
export type PostInsertProps = typeof posts.$inferInsert;
