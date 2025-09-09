CREATE TABLE "accounts" (
	"id" char(32) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"account_id" char(32) NOT NULL,
	"provider_id" char(32) NOT NULL,
	"user_id" char(32) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" char(32) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"impersonated_by" char(32),
	"user_id" char(32) NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" char(32) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"display_username" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone_number" text,
	"phone_number_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" date,
	"invite_by" char(32),
	"invite_code" text,
	"last_login_at" timestamp,
	"up" bigint DEFAULT 0 NOT NULL,
	"down" bigint DEFAULT 0 NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"remaining" bigint DEFAULT 0 NOT NULL,
	"current_traffic_package_id" char(32),
	"token" text NOT NULL,
	"speed_limit" integer DEFAULT 0 NOT NULL,
	"device_limit" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_invite_code_unique" UNIQUE("invite_code"),
	CONSTRAINT "users_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" char(32) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_invite_by" ON "users" USING btree ("invite_by");--> statement-breakpoint
CREATE INDEX "user_invite_code" ON "users" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX "user_token" ON "users" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_current_traffic_package_id" ON "users" USING btree ("current_traffic_package_id");