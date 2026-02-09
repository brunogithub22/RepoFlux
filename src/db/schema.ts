import { pgTable, uuid, text, date ,foreignKey} from "drizzle-orm/pg-core";
import { Video } from "lucide-react";

// Posts table - owned by a user
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().notNull(),
  title: text('title'),
  type: text('type'),
  description: text('description'),
  date: date('date'),
});

// Images table - owned by a user
export const images = pgTable('images', {
    id: uuid('id').primaryKey().notNull(),
    public_id: text('public_id').notNull(),
    link: text('link'),
  }
);

export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().notNull(),
    link: text('link'),
  }
);

/* POST ↔ IMAGE */
export const postImage = pgTable(
  "post_image",
  {
    id: uuid("id").primaryKey().notNull(),
    postId: uuid("post_id").notNull(),
    imageId: uuid("image_id").notNull(),
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),

    imageFk: foreignKey({
      columns: [table.imageId],
      foreignColumns: [images.id],
    }).onDelete("cascade"),
  })
);

/* POST ↔ VIDEO */
export const postVideo = pgTable(
  "post_video",
  {
    id: uuid("id").primaryKey().notNull(),
    postId: uuid("post_id").notNull(),
    videoId: uuid("video_id").notNull(),
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),

    videoFk: foreignKey({
      columns: [table.videoId],
      foreignColumns: [videos.id],
    }).onDelete("cascade"),
  })
);

// Languages - can be global (no user_id) or per-user
export const languages = pgTable('languages', {
  id: uuid('id').primaryKey().notNull(),
  language: text('language')
});

export const feedback = pgTable('feedback', 
  {
    id: uuid('id').primaryKey().notNull(),
    name: text('name'),
    feedback: text('feedback'),
    postId: uuid().notNull(),
  },
  (table) =>({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);

export const postLanguage = pgTable(
  "post_language",
  {
    id: uuid("id").primaryKey().notNull(),
    postId: uuid("post_id").notNull(),
    languageId: uuid("language_id").notNull(),
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),

    languageFk: foreignKey({
      columns: [table.languageId],
      foreignColumns: [languages.id],
    }).onDelete("cascade"),
  })
);
        