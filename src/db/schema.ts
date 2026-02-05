import { pgTable, serial, text, date } from "drizzle-orm/pg-core";

export const users = pgTable('posts', {
  id: serial('id').primaryKey().notNull(),
  title: text('title'),
  description: text('description'),
  date: date('date'),
});

export const images = pgTable('images', {
  id: serial('id').primaryKey().notNull(),
  link: text('link')
});

export const user_image = pgTable('user_image', {
  id: serial('id').primaryKey().notNull(),
  user_id: serial('user_id'),
  image_id: serial('image_id')
});

export const languages = pgTable('languages', {
  id: serial('id').primaryKey().notNull(),
  language: text('language')
});

export const user_language = pgTable('user_language', {
  id: serial('id').primaryKey().notNull(),
  user_id: serial('user_id'),
  language_id: serial('language_id')
});
        