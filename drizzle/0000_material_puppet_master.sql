CREATE TABLE "images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"language" text
);
--> statement-breakpoint
CREATE TABLE "post_image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"image_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_language" (
	"id" uuid PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"language_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"type" text,
	"description" text,
	"date" date
);
--> statement-breakpoint
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_language" ADD CONSTRAINT "post_language_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_language" ADD CONSTRAINT "post_language_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;