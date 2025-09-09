CREATE TABLE "settings" (
	"id" char(32) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	"remark" text
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_invite_code_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_token_unique";--> statement-breakpoint
DROP INDEX "user_invite_by";--> statement-breakpoint
DROP INDEX "user_invite_code";--> statement-breakpoint
DROP INDEX "user_token";--> statement-breakpoint
DROP INDEX "user_current_traffic_package_id";--> statement-breakpoint
CREATE INDEX "system_setting_key_idx" ON "settings" USING btree ("key");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "invite_by";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "invite_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_login_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "up";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "down";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "total";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "remaining";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "current_traffic_package_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "speed_limit";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "device_limit";