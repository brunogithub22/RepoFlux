import { pgTable, uuid, text, date ,foreignKey, jsonb,integer,boolean } from "drizzle-orm/pg-core";

// Posts table - owned by a user
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().notNull(),
  title: text('title'),
  type: text('type'),
  description: text('description'),
  languages: jsonb('languages').$type<{id: string, language: string}[]>(),
  isPublished: boolean('published').default(false).notNull(),
  date: date('date'),
  numContent: integer('num_content').notNull()
});

export const files = pgTable('files', 
  {
    id: uuid('id').primaryKey().notNull(),
    name: text('name').notNull(),
    link_download: text('link_download').notNull(),
    link_preview: text('link_preview').notNull(),
    mime_type: text('mime_type').notNull(),
    createdAt: text('createdAt').notNull(),
    size: text('size').notNull(),
    idBlock: integer("id_block").notNull(),
    postId: uuid().notNull(),
  },
  (table) =>({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);

export const textBlock = pgTable('textBlock', {
    id: uuid('id').primaryKey().notNull(),
    type: text('type').notNull(),
    text: text('text').notNull(),
    postId: uuid("post_id").notNull(),
    idBlock: integer("id_block").notNull(),
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);

export const code = pgTable('code', {
    id: uuid('id').primaryKey().notNull(),
    filename: text('filename').notNull(),
    code: text('code').notNull(), 
    postId: uuid("post_id").notNull(),
    idBlock: integer("id_block").notNull(),
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);

export const github = pgTable('github', {
    id: uuid('id').primaryKey().notNull(),
    link: text('link').notNull(),
    description: text('description').notNull(),  
    postId: uuid("post_id").notNull(),
    idBlock: integer("id_block").notNull(),
    text: text('text').notNull()
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);

// Images table - owned by a user
export const images = pgTable('images', {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    link: text('link'),
  }
);

export const link= pgTable('links', {
    id: text('id').primaryKey().notNull(),
    type: text('type').notNull(),
    link: text('link').notNull(),
    name: text('name').notNull(),
    imageId: text('image_id').notNull(),
    idBlock: integer("id_block").notNull(),
    index: integer('index').notNull(),
    postId: uuid("post_id").notNull(),
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

export const youtube_video = pgTable('youtube', {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull().unique(),
    link: text('link').notNull(),
  }
);

/* POST ↔ IMAGE */
export const postImage = pgTable(
  "post_image",
  {
    id: uuid("id").primaryKey().notNull(),
    postId: uuid("post_id").notNull(),
    imageId: text("image_id").notNull(),
    idBlock: integer('id_block').notNull(),
    index: integer('index').notNull(),
    text: text('text').notNull()
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
  "post_youtube",
  {
    id: uuid("id").primaryKey().notNull(),
    postId: uuid("post_id").notNull(),
    videoId: text("video_id").notNull(),
    idBlock: integer("id_block").notNull(),
    text: text('text').notNull()
  },
  (table) => ({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),

    videoFk: foreignKey({
      columns: [table.videoId],
      foreignColumns: [youtube_video.id],
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
    feedback: text('feedback').notNull(),
    valutation: integer('valutation').notNull(),
    postId: uuid().notNull(),
  },
  (table) =>({
    postFk: foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
    }).onDelete("cascade"),
  })
);        