
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."is_provider"() RETURNS integer
    LANGUAGE "sql"
    AS $$
  select count(*) from providers where owner_user_id = auth.uid()
$$;

ALTER FUNCTION "public"."is_provider"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."appointments" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider_id" integer NOT NULL,
    "service_id" integer NOT NULL,
    "date_time" timestamp without time zone NOT NULL,
    "status" character varying(20) NOT NULL,
    CONSTRAINT "appointments_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['Booked'::character varying, 'Confirmed'::character varying, 'Cancelled'::character varying])::"text"[])))
);

ALTER TABLE "public"."appointments" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."appointments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."appointments_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."appointments_id_seq" OWNED BY "public"."appointments"."id";

CREATE TABLE IF NOT EXISTS "public"."availability" (
    "id" integer NOT NULL,
    "provider_id" integer NOT NULL,
    "day_of_week" character varying(10) NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    CONSTRAINT "availability_day_of_week_check" CHECK ((("day_of_week")::"text" = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying, 'Sunday'::character varying])::"text"[])))
);

ALTER TABLE "public"."availability" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."availability_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."availability_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."availability_id_seq" OWNED BY "public"."availability"."id";

CREATE TABLE IF NOT EXISTS "public"."providers" (
    "id" integer NOT NULL,
    "owner_user_id" "uuid" NOT NULL,
    "email" character varying(255) NOT NULL,
    "name" character varying(255) NOT NULL,
    "bio" "text",
    "location_geoJSON" "jsonb",
    "photo_link" character varying(255),
    "phone_number" character varying,
    "location_name" character varying
);

ALTER TABLE "public"."providers" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."barbers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."barbers_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."barbers_id_seq" OWNED BY "public"."providers"."id";

CREATE TABLE IF NOT EXISTS "public"."providers_services" (
    "id" integer NOT NULL,
    "provider_id" integer NOT NULL,
    "service_id" integer NOT NULL
);

ALTER TABLE "public"."providers_services" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."providers_services_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."providers_services_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."providers_services_id_seq" OWNED BY "public"."providers_services"."id";

CREATE TABLE IF NOT EXISTS "public"."services" (
    "id" integer NOT NULL,
    "service_name" character varying(255) NOT NULL,
    "description" "text",
    "price" numeric(10,2) NOT NULL
);

ALTER TABLE "public"."services" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."services_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."services_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."services_id_seq" OWNED BY "public"."services"."id";

ALTER TABLE ONLY "public"."appointments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."appointments_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."availability" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."availability_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."providers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."barbers_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."providers_services" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."providers_services_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."services" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."services_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointment_unique" UNIQUE ("user_id", "provider_id", "service_id", "date_time");

ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."availability"
    ADD CONSTRAINT "availability_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."providers_services"
    ADD CONSTRAINT "barber_services_unique" UNIQUE ("provider_id", "service_id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "barbers_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "barbers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."providers_services"
    ADD CONSTRAINT "providers_services_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_service_name_key" UNIQUE ("service_name");

CREATE INDEX "providers_services_provider_id_idx" ON "public"."providers_services" USING "btree" ("provider_id");

ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id");

ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");

ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."availability"
    ADD CONSTRAINT "availability_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "barbers_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."providers_services"
    ADD CONSTRAINT "providers_services_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id");

ALTER TABLE ONLY "public"."providers_services"
    ADD CONSTRAINT "providers_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");

CREATE POLICY "Enable insert for users based on user_id" ON "public"."appointments" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "add new providers" ON "public"."providers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "alow everyone to see" ON "public"."providers" FOR SELECT USING (true);

ALTER TABLE "public"."appointments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."availability" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."providers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."providers_services" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."is_provider"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_provider"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_provider"() TO "service_role";

GRANT ALL ON TABLE "public"."appointments" TO "anon";
GRANT ALL ON TABLE "public"."appointments" TO "authenticated";
GRANT ALL ON TABLE "public"."appointments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."availability" TO "anon";
GRANT ALL ON TABLE "public"."availability" TO "authenticated";
GRANT ALL ON TABLE "public"."availability" TO "service_role";

GRANT ALL ON SEQUENCE "public"."availability_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."availability_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."availability_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."providers" TO "anon";
GRANT ALL ON TABLE "public"."providers" TO "authenticated";
GRANT ALL ON TABLE "public"."providers" TO "service_role";

GRANT ALL ON SEQUENCE "public"."barbers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."barbers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."barbers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."providers_services" TO "anon";
GRANT ALL ON TABLE "public"."providers_services" TO "authenticated";
GRANT ALL ON TABLE "public"."providers_services" TO "service_role";

GRANT ALL ON SEQUENCE "public"."providers_services_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."providers_services_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."providers_services_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";

GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
