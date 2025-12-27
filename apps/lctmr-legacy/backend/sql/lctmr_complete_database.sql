--
-- PostgreSQL database cluster dump
--

-- Started on 2025-10-13 15:50:43

\restrict xmEru5Z0ta25DRIDgmRGRB65KZUaXPgHCHilRVhBwXCG2KFkqvspPUNP4Mqwn3h

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE web_app;
ALTER ROLE web_app WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT pg_read_all_data TO web_app WITH INHERIT TRUE GRANTED BY postgres;
GRANT pg_write_all_data TO web_app WITH INHERIT TRUE GRANTED BY postgres;
GRANT supabase_admin TO web_app WITH INHERIT TRUE GRANTED BY postgres;




\unrestrict xmEru5Z0ta25DRIDgmRGRB65KZUaXPgHCHilRVhBwXCG2KFkqvspPUNP4Mqwn3h

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict aSR4pRNzoQF7Dexm9JBbamHFtsfMgDn1xoi2AGjmcx1aze2oq0kSJaovv7V9ekG

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-13 15:50:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2025-10-13 15:50:45

--
-- PostgreSQL database dump complete
--

\unrestrict aSR4pRNzoQF7Dexm9JBbamHFtsfMgDn1xoi2AGjmcx1aze2oq0kSJaovv7V9ekG

--
-- Database "lctmr_production" dump
--

--
-- PostgreSQL database dump
--

\restrict 7GOW5iesOA9GG0hXcHhRJLikmwpq9SnqZa22GQNdj44VVdczshqFa5db3i92kn1

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-13 15:50:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4270 (class 1262 OID 18525)
-- Name: lctmr_production; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE lctmr_production WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


\unrestrict 7GOW5iesOA9GG0hXcHhRJLikmwpq9SnqZa22GQNdj44VVdczshqFa5db3i92kn1
\connect lctmr_production
\restrict 7GOW5iesOA9GG0hXcHhRJLikmwpq9SnqZa22GQNdj44VVdczshqFa5db3i92kn1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 10 (class 2615 OID 18526)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- TOC entry 11 (class 2615 OID 18527)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- TOC entry 19 (class 2615 OID 18528)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- TOC entry 18 (class 2615 OID 18529)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- TOC entry 12 (class 2615 OID 18530)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- TOC entry 13 (class 2615 OID 18531)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- TOC entry 14 (class 2615 OID 18532)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- TOC entry 15 (class 2615 OID 18533)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- TOC entry 17 (class 2615 OID 18534)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- TOC entry 6 (class 3079 OID 19458)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4271 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 18535)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4272 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 3 (class 3079 OID 18572)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4273 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 19435)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4274 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 4 (class 3079 OID 18609)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4275 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1047 (class 1247 OID 18621)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1050 (class 1247 OID 18628)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1053 (class 1247 OID 18634)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1056 (class 1247 OID 18640)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1059 (class 1247 OID 18648)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1062 (class 1247 OID 18662)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1065 (class 1247 OID 18674)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1068 (class 1247 OID 18691)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- TOC entry 1071 (class 1247 OID 18694)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- TOC entry 1074 (class 1247 OID 18697)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- TOC entry 1077 (class 1247 OID 18699)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- TOC entry 337 (class 1255 OID 18703)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4276 (class 0 OID 0)
-- Dependencies: 337
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 363 (class 1255 OID 18704)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 314 (class 1255 OID 18705)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4277 (class 0 OID 0)
-- Dependencies: 314
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 375 (class 1255 OID 18706)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4278 (class 0 OID 0)
-- Dependencies: 375
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 384 (class 1255 OID 18707)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4279 (class 0 OID 0)
-- Dependencies: 384
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 315 (class 1255 OID 18708)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4280 (class 0 OID 0)
-- Dependencies: 315
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 336 (class 1255 OID 18709)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4281 (class 0 OID 0)
-- Dependencies: 336
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 333 (class 1255 OID 18710)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 348 (class 1255 OID 18711)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 312 (class 1255 OID 18712)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4282 (class 0 OID 0)
-- Dependencies: 312
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 320 (class 1255 OID 18713)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 364 (class 1255 OID 18714)
-- Name: add_points(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_points(user_email text, points_to_add integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- If the user does not exist, insert; otherwise, add points.
  INSERT INTO public.scores (username, points)
  VALUES (user_email, points_to_add)
  ON CONFLICT (username)
  DO UPDATE SET points = scores.points + points_to_add;
END;
$$;


--
-- TOC entry 385 (class 1255 OID 18715)
-- Name: award_achievement(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_achievement(achievement_key text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  achievement_to_award_id uuid;
  current_user_id uuid := auth.uid(); -- 获取当前操作用户的ID
  already_earned boolean;
BEGIN
  -- 步骤 3.1: 根据传入的触发键（例如 'COMPLETE_FIRST_BLOCK'）查找对应的成就ID
  SELECT id INTO achievement_to_award_id
  FROM public.achievements
  WHERE trigger_key = achievement_key;

  -- 如果没有找到对应的成就，就直接退出
  IF achievement_to_award_id IS NULL THEN
    RETURN;
  END IF;

  -- 步骤 3.2: 检查该用户是否已经获得过这个成就，防止重复授予
  SELECT EXISTS (
    SELECT 1
    FROM public.user_achievements
    WHERE user_id = current_user_id AND achievement_id = achievement_to_award_id
  ) INTO already_earned;

  -- 步骤 3.3: 如果用户尚未获得该成就，就插入一条新记录，完成授予
  IF NOT already_earned THEN
    INSERT INTO public.user_achievements (user_id, achievement_id)
    VALUES (current_user_id, achievement_to_award_id);
  END IF;
END;
$$;


--
-- TOC entry 395 (class 1255 OID 18716)
-- Name: finish_challenge(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.finish_challenge(challenge_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    challenge_record RECORD;
    target_category_id_param uuid;
    reward_points_param int;
    challenge_badge_id uuid;
BEGIN
    -- 获取挑战详情
    SELECT * INTO challenge_record
    FROM public.challenges
    WHERE id = challenge_id_param AND is_active = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION '找不到活跃的挑战或挑战ID无效: %', challenge_id_param;
    END IF;

    target_category_id_param := challenge_record.target_category_id;
    reward_points_param := challenge_record.reward_points;

    -- 为胜利阵营的所有用户更新分数
    WITH winning_faction_members AS (
        SELECT p.id as user_id
        FROM public.profiles p
        WHERE p.faction = (
            SELECT faction FROM get_faction_leaderboard() ORDER BY average_score DESC LIMIT 1
        )
    )
    UPDATE public.scores s
    SET points = s.points + reward_points_param
    FROM winning_faction_members wfm
    WHERE s.user_id = wfm.user_id;

    -- 授予“挑战先锋”徽章
    SELECT id INTO challenge_badge_id FROM public.badges WHERE name = '挑战先锋' LIMIT 1;

    IF challenge_badge_id IS NOT NULL THEN
        WITH target_blocks AS (
            SELECT b.id
            FROM blocks b
            JOIN sections s ON b.section_id = s.id
            JOIN chapters ch ON s.chapter_id = ch.id
            WHERE ch.category_id = target_category_id_param
        ),
        completing_users AS (
            SELECT up.user_id
            FROM user_progress up
            WHERE up.completed_blocks::uuid[] @> (SELECT array_agg(id) FROM target_blocks)
        )
        INSERT INTO public.user_badges (user_id, badge_id, context)
        SELECT cu.user_id, challenge_badge_id, jsonb_build_object('challenge_id', challenge_id_param)
        FROM completing_users cu
        -- [最终修正] 直接指定冲突的列，而不是约束名称，更加稳妥
        ON CONFLICT (user_id, badge_id, (context->>'challenge_id')) DO NOTHING;
    END IF;

    -- 将挑战设为非活跃状态
    UPDATE public.challenges
    SET is_active = FALSE
    WHERE id = challenge_id_param;

END;
$$;


--
-- TOC entry 343 (class 1255 OID 19574)
-- Name: get_conversation_leaderboard(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_conversation_leaderboard(limit_count integer DEFAULT 10) RETURNS TABLE(user_id character varying, total_points integer, completed_conversations integer, completion_rate numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cls.user_id,
        cls.total_conversation_points::INTEGER as total_points,
        cls.completed_conversations::INTEGER,
        CASE 
            WHEN cls.total_conversations > 0 THEN 
                ROUND((cls.completed_conversations::NUMERIC / cls.total_conversations * 100), 2)
            ELSE 0
        END as completion_rate
    FROM conversation_learning_stats cls
    WHERE cls.total_conversations > 0
    ORDER BY cls.total_conversation_points DESC, cls.completed_conversations DESC
    LIMIT limit_count;
END;
$$;


--
-- TOC entry 400 (class 1255 OID 18717)
-- Name: get_faction_leaderboard(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_faction_leaderboard() RETURNS TABLE(faction text, total_members bigint, total_points bigint, average_score numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.faction,
        COUNT(p.id) AS total_members,
        COALESCE(SUM(s.points), 0) AS total_points,
        CASE
            WHEN COUNT(p.id) > 0 THEN
                COALESCE(SUM(s.points), 0)::numeric / COUNT(p.id)
            ELSE
                0
        END AS average_score
    FROM
        public.profiles p
    LEFT JOIN
        public.scores s ON p.id = s.user_id
    WHERE
        p.faction IS NOT NULL
    GROUP BY
        p.faction
    ORDER BY
        average_score DESC, total_points DESC;
END;
$$;


--
-- TOC entry 368 (class 1255 OID 18718)
-- Name: get_leaderboard_with_names(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_leaderboard_with_names() RETURNS TABLE(user_id uuid, points integer, username text, full_name text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.user_id,
        s.points,
        s.username,
        p.full_name
    FROM
        public.scores AS s
    LEFT JOIN
        public.profiles AS p ON s.user_id = p.id
    ORDER BY
        s.points DESC;
END;
$$;


--
-- TOC entry 421 (class 1255 OID 18719)
-- Name: get_my_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


--
-- TOC entry 378 (class 1255 OID 18720)
-- Name: get_single_faction_challenge_progress(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_single_faction_challenge_progress(challenge_id_param uuid, faction_param text) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  target_category uuid;
  total_block_count int;
  progress_percentage numeric;
BEGIN
  -- 首先，根据挑战ID找到它关联的学习篇章ID
  SELECT target_category_id INTO target_category FROM public.challenges WHERE id = challenge_id_param;
  IF target_category IS NULL THEN
    RETURN 0;
  END IF;

  -- 接着，计算出这个篇章总共包含多少个学习内容块
  SELECT count(b.id)
  INTO total_block_count
  FROM public.blocks b
  JOIN public.sections s ON b.section_id = s.id
  JOIN public.chapters ch ON s.chapter_id = ch.id
  WHERE ch.category_id = target_category;

  IF total_block_count = 0 THEN
    RETURN 0;
  END IF;

  -- 最核心的计算：
  -- 1. 找到指定部门的所有成员。
  -- 2. 对每个成员，计算他/她在这个挑战篇章中的个人完成度（例如，张三完成了80%，李四完成了60%）。
  -- 3. 将所有成员的个人完成度取一个平均值。
  SELECT COALESCE(AVG(user_progress.completion_percentage), 0)
  INTO progress_percentage
  FROM (
      SELECT
          (COUNT(DISTINCT cb.block_id)::numeric / total_block_count) * 100 AS completion_percentage
      FROM public.profiles p
      LEFT JOIN public.user_progress up ON p.id = up.user_id
      -- 将每个用户已完成的块ID数组展开，以便进行匹配
      LEFT JOIN LATERAL unnest(COALESCE(up.completed_blocks, '{}'::uuid[])) AS completed_block_id ON TRUE
      -- 只匹配那些属于本次挑战篇章的块
      LEFT JOIN (
        SELECT b.id AS block_id FROM public.blocks b
        JOIN public.sections s ON b.section_id = s.id
        JOIN public.chapters ch ON s.chapter_id = ch.id
        WHERE ch.category_id = target_category
      ) AS cb ON completed_block_id = cb.block_id
      WHERE p.faction = faction_param
      GROUP BY p.id
  ) AS user_progress;

  RETURN progress_percentage;
END;
$$;


--
-- TOC entry 297 (class 1255 OID 18721)
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Insert a new row into the profiles table for the new user.
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;


--
-- TOC entry 381 (class 1255 OID 18722)
-- Name: reset_user_progress(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.reset_user_progress() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.user_progress
  SET completed_blocks = '{}' -- 将已完成的块设置为空数组
  WHERE user_id = auth.uid();
END;
$$;


--
-- TOC entry 344 (class 1255 OID 19567)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 383 (class 1255 OID 18723)
-- Name: upsert_score(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_score(user_id_input uuid, points_to_add integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    user_email_from_auth text;
BEGIN
    -- 1. 根据用户ID安全地获取用户的 email
    SELECT u.email INTO user_email_from_auth 
    FROM auth.users AS u 
    WHERE u.id = user_id_input;

    -- 2. 使用 ON CONFLICT 执行高效的 Upsert（更新或插入）操作
    INSERT INTO public.scores (user_id, username, points)
    VALUES (user_id_input, user_email_from_auth, points_to_add)
    ON CONFLICT (user_id) -- 如果 user_id 已存在，则触发更新
    DO UPDATE SET
      -- 在原有分数的基础上累加新的分数
      points = public.scores.points + points_to_add;

END;
$$;


--
-- TOC entry 387 (class 1255 OID 18724)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 376 (class 1255 OID 18727)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 342 (class 1255 OID 18728)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 423 (class 1255 OID 18729)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 339 (class 1255 OID 18730)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 351 (class 1255 OID 18731)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 372 (class 1255 OID 18732)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 352 (class 1255 OID 18733)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 420 (class 1255 OID 18734)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 360 (class 1255 OID 18735)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 347 (class 1255 OID 18736)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 399 (class 1255 OID 18737)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 358 (class 1255 OID 18738)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- TOC entry 380 (class 1255 OID 18739)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 322 (class 1255 OID 18740)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- TOC entry 309 (class 1255 OID 18741)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- TOC entry 305 (class 1255 OID 18742)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- TOC entry 407 (class 1255 OID 18743)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 397 (class 1255 OID 18744)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 328 (class 1255 OID 18745)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- TOC entry 346 (class 1255 OID 18746)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 374 (class 1255 OID 18747)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- TOC entry 331 (class 1255 OID 18748)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- TOC entry 353 (class 1255 OID 18749)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 330 (class 1255 OID 18750)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 413 (class 1255 OID 18751)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 321 (class 1255 OID 18752)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 373 (class 1255 OID 18753)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 422 (class 1255 OID 18754)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 319 (class 1255 OID 18755)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- TOC entry 317 (class 1255 OID 18756)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- TOC entry 299 (class 1255 OID 18757)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 411 (class 1255 OID 18758)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 390 (class 1255 OID 18759)
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


--
-- TOC entry 361 (class 1255 OID 18760)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 18761)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4283 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 237 (class 1259 OID 18767)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- TOC entry 4284 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 238 (class 1259 OID 18772)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 4285 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4286 (class 0 OID 0)
-- Dependencies: 238
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 239 (class 1259 OID 18779)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- TOC entry 4287 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 240 (class 1259 OID 18784)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- TOC entry 4288 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 241 (class 1259 OID 18789)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- TOC entry 4289 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 242 (class 1259 OID 18794)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- TOC entry 4290 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 243 (class 1259 OID 18799)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- TOC entry 244 (class 1259 OID 18807)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- TOC entry 4291 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 245 (class 1259 OID 18812)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4292 (class 0 OID 0)
-- Dependencies: 245
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 246 (class 1259 OID 18813)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- TOC entry 4293 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 247 (class 1259 OID 18821)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- TOC entry 4294 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 248 (class 1259 OID 18827)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- TOC entry 4295 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 249 (class 1259 OID 18830)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- TOC entry 4296 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4297 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 250 (class 1259 OID 18835)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- TOC entry 4298 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 251 (class 1259 OID 18841)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- TOC entry 4299 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4300 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 252 (class 1259 OID 18847)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- TOC entry 4301 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4302 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 253 (class 1259 OID 18862)
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon_url text,
    trigger_key text NOT NULL
);


--
-- TOC entry 4303 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE achievements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.achievements IS '存储所有可获得的成就/徽章的定义。';


--
-- TOC entry 4304 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN achievements.trigger_key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.achievements.trigger_key IS '用于在代码中识别成就的唯一、不可变的键。';


--
-- TOC entry 254 (class 1259 OID 18869)
-- Name: badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    icon_url text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 255 (class 1259 OID 18876)
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_id uuid NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    content_markdown text,
    video_url text,
    quiz_question text,
    quiz_options text[],
    correct_answer_index integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ppt_url text,
    pdf_url text,
    document_url text,
    content_html text,
    content_format character varying(20) DEFAULT 'markdown'::character varying NOT NULL
);


--
-- TOC entry 256 (class 1259 OID 18884)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 18892)
-- Name: challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    target_category_id uuid,
    reward_points integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 258 (class 1259 OID 18901)
-- Name: chapters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    image_url text,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 294 (class 1259 OID 19543)
-- Name: conversation_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_content (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    content_format character varying(10) DEFAULT 'html'::character varying,
    content_html text,
    conversation_data jsonb NOT NULL,
    created_by character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT false,
    CONSTRAINT conversation_content_content_format_check CHECK (((content_format)::text = ANY ((ARRAY['markdown'::character varying, 'html'::character varying])::text[])))
);


--
-- TOC entry 293 (class 1259 OID 19542)
-- Name: conversation_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversation_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4305 (class 0 OID 0)
-- Dependencies: 293
-- Name: conversation_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversation_content_id_seq OWNED BY public.conversation_content.id;


--
-- TOC entry 290 (class 1259 OID 19510)
-- Name: conversation_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_progress (
    id integer NOT NULL,
    user_id character varying(100) NOT NULL,
    content_block_id character varying(100) NOT NULL,
    current_step integer DEFAULT 0 NOT NULL,
    total_steps integer DEFAULT 1 NOT NULL,
    progress_percentage integer DEFAULT 0 NOT NULL,
    points_earned integer DEFAULT 0 NOT NULL,
    completed_tests jsonb DEFAULT '[]'::jsonb,
    is_completed boolean DEFAULT false NOT NULL,
    conversation_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_accessed_at timestamp with time zone DEFAULT now(),
    CONSTRAINT conversation_progress_points_earned_check CHECK ((points_earned >= 0)),
    CONSTRAINT conversation_progress_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


--
-- TOC entry 295 (class 1259 OID 19570)
-- Name: conversation_learning_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.conversation_learning_stats AS
 SELECT user_id,
    count(*) AS total_conversations,
    count(*) FILTER (WHERE (is_completed = true)) AS completed_conversations,
    COALESCE(sum(points_earned), (0)::bigint) AS total_conversation_points,
    COALESCE(avg(progress_percentage), (0)::numeric) AS average_progress,
    count(DISTINCT content_block_id) AS unique_blocks_started,
    max(last_accessed_at) AS last_learning_time
   FROM public.conversation_progress
  GROUP BY user_id;


--
-- TOC entry 289 (class 1259 OID 19509)
-- Name: conversation_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversation_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4306 (class 0 OID 0)
-- Dependencies: 289
-- Name: conversation_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversation_progress_id_seq OWNED BY public.conversation_progress.id;


--
-- TOC entry 259 (class 1259 OID 18909)
-- Name: factions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.factions (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    color character varying(7),
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 260 (class 1259 OID 18918)
-- Name: factions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.factions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4307 (class 0 OID 0)
-- Dependencies: 260
-- Name: factions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.factions_id_seq OWNED BY public.factions.id;


--
-- TOC entry 261 (class 1259 OID 18919)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    role text DEFAULT 'user'::text,
    updated_at timestamp with time zone DEFAULT now(),
    faction text,
    full_name text
);

ALTER TABLE ONLY public.profiles FORCE ROW LEVEL SECURITY;


--
-- TOC entry 262 (class 1259 OID 18926)
-- Name: scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scores (
    username text NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    user_id uuid NOT NULL
);

ALTER TABLE ONLY public.scores FORCE ROW LEVEL SECURITY;


--
-- TOC entry 4308 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE scores; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.scores IS '存储用户的学分和排名信息。';


--
-- TOC entry 4309 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN scores.username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.scores.username IS '用户的唯一名称';


--
-- TOC entry 4310 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN scores.points; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.scores.points IS '用户的总积分';


--
-- TOC entry 263 (class 1259 OID 18932)
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chapter_id uuid NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 264 (class 1259 OID 18940)
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 4311 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE user_achievements; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_achievements IS '记录用户已获得的成就。';


--
-- TOC entry 265 (class 1259 OID 18945)
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    awarded_at timestamp with time zone DEFAULT now(),
    context jsonb
);


--
-- TOC entry 266 (class 1259 OID 18951)
-- Name: user_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_badges ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_badges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 292 (class 1259 OID 19532)
-- Name: user_points_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_points_history (
    id integer NOT NULL,
    user_id character varying(100) NOT NULL,
    points integer NOT NULL,
    source_type character varying(50) DEFAULT 'manual'::character varying NOT NULL,
    source_id character varying(100),
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 291 (class 1259 OID 19531)
-- Name: user_points_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_points_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4312 (class 0 OID 0)
-- Dependencies: 291
-- Name: user_points_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_points_history_id_seq OWNED BY public.user_points_history.id;


--
-- TOC entry 267 (class 1259 OID 18952)
-- Name: user_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_progress (
    user_id uuid NOT NULL,
    completed_sections jsonb DEFAULT '[]'::jsonb,
    updated_at timestamp with time zone DEFAULT now(),
    awarded_points_sections jsonb DEFAULT '[]'::jsonb,
    completed_blocks text[],
    awarded_points_blocks text[]
);

ALTER TABLE ONLY public.user_progress FORCE ROW LEVEL SECURITY;


--
-- TOC entry 268 (class 1259 OID 18960)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- TOC entry 269 (class 1259 OID 18967)
-- Name: messages_2025_08_27; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 270 (class 1259 OID 18976)
-- Name: messages_2025_08_28; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 271 (class 1259 OID 18985)
-- Name: messages_2025_08_29; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_29 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 272 (class 1259 OID 18994)
-- Name: messages_2025_08_30; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_30 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 273 (class 1259 OID 19003)
-- Name: messages_2025_08_31; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_31 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 274 (class 1259 OID 19012)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- TOC entry 275 (class 1259 OID 19015)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- TOC entry 276 (class 1259 OID 19023)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 277 (class 1259 OID 19024)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- TOC entry 4313 (class 0 OID 0)
-- Dependencies: 277
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 278 (class 1259 OID 19034)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 279 (class 1259 OID 19043)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 280 (class 1259 OID 19047)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- TOC entry 4314 (class 0 OID 0)
-- Dependencies: 280
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 281 (class 1259 OID 19057)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 282 (class 1259 OID 19065)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- TOC entry 283 (class 1259 OID 19072)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 284 (class 1259 OID 19080)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- TOC entry 285 (class 1259 OID 19085)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- TOC entry 3638 (class 0 OID 0)
-- Name: messages_2025_08_27; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_27 FOR VALUES FROM ('2025-08-27 00:00:00') TO ('2025-08-28 00:00:00');


--
-- TOC entry 3639 (class 0 OID 0)
-- Name: messages_2025_08_28; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_28 FOR VALUES FROM ('2025-08-28 00:00:00') TO ('2025-08-29 00:00:00');


--
-- TOC entry 3640 (class 0 OID 0)
-- Name: messages_2025_08_29; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_29 FOR VALUES FROM ('2025-08-29 00:00:00') TO ('2025-08-30 00:00:00');


--
-- TOC entry 3641 (class 0 OID 0)
-- Name: messages_2025_08_30; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_30 FOR VALUES FROM ('2025-08-30 00:00:00') TO ('2025-08-31 00:00:00');


--
-- TOC entry 3642 (class 0 OID 0)
-- Name: messages_2025_08_31; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_31 FOR VALUES FROM ('2025-08-31 00:00:00') TO ('2025-09-01 00:00:00');


--
-- TOC entry 3648 (class 2604 OID 19090)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3761 (class 2604 OID 19546)
-- Name: conversation_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_content ALTER COLUMN id SET DEFAULT nextval('public.conversation_content_id_seq'::regclass);


--
-- TOC entry 3748 (class 2604 OID 19513)
-- Name: conversation_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_progress ALTER COLUMN id SET DEFAULT nextval('public.conversation_progress_id_seq'::regclass);


--
-- TOC entry 3676 (class 2604 OID 19091)
-- Name: factions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factions ALTER COLUMN id SET DEFAULT nextval('public.factions_id_seq'::regclass);


--
-- TOC entry 3758 (class 2604 OID 19535)
-- Name: user_points_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_points_history ALTER COLUMN id SET DEFAULT nextval('public.user_points_history_id_seq'::regclass);


--
-- TOC entry 4210 (class 0 OID 18761)
-- Dependencies: 236
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	a4d47e58-16c6-4109-845b-1dfa6591d546	{"action":"user_signedup","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-05 12:36:57.472183+08	
00000000-0000-0000-0000-000000000000	19c84c08-6376-47a6-aec6-a4a8231041d8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:36:57.478648+08	
00000000-0000-0000-0000-000000000000	e0ee5c84-2b33-4678-8450-0287b2bf6df0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:37:23.104844+08	
00000000-0000-0000-0000-000000000000	a538dee4-c6be-4219-b9ae-45f843a19468	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:41:53.737418+08	
00000000-0000-0000-0000-000000000000	fbd72a8e-d60c-4643-820d-fe490395c4b4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:41:59.616467+08	
00000000-0000-0000-0000-000000000000	c9bc6643-d492-44f7-9745-3872d928f644	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:42:20.541291+08	
00000000-0000-0000-0000-000000000000	e5452e89-aed1-4045-a122-80de1e8ee3f9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:42:26.729986+08	
00000000-0000-0000-0000-000000000000	4720ab01-d66a-4e1c-b565-d9e48b34161d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:44:04.076378+08	
00000000-0000-0000-0000-000000000000	a0e57dc2-bd9f-4763-9fa3-98d5dbcb5ea6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:26:36.287118+08	
00000000-0000-0000-0000-000000000000	080b4a9a-93f8-48e0-99b1-5ab3f2df1088	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:26:44.661845+08	
00000000-0000-0000-0000-000000000000	c326d5f5-d1d4-4537-9a45-22e61f463b90	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:37:59.142073+08	
00000000-0000-0000-0000-000000000000	d4cd6bd9-f6f4-4ccc-b372-2d859d8d219b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:46:53.519965+08	
00000000-0000-0000-0000-000000000000	5595a1a0-0791-4778-a3b2-3ef6f38be74f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:05:42.307448+08	
00000000-0000-0000-0000-000000000000	d6d11916-bee5-4309-842d-da6f2af4b304	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:07:58.482837+08	
00000000-0000-0000-0000-000000000000	36f6907c-4fe3-4088-a537-3fa18c44564a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:08:14.82199+08	
00000000-0000-0000-0000-000000000000	26df3a60-41c5-4370-a012-7916298b6390	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:10:56.802275+08	
00000000-0000-0000-0000-000000000000	a3e99239-4336-4bc0-9d8e-1df92e185f62	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:18:17.71398+08	
00000000-0000-0000-0000-000000000000	e45a2d24-c695-46aa-84e6-0c0a4072c862	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:24:36.412961+08	
00000000-0000-0000-0000-000000000000	48be702e-4f7a-4037-84d1-83e153453f2c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:28:01.489021+08	
00000000-0000-0000-0000-000000000000	790d8949-1a6f-4e90-b4eb-f6bca791786c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:34:08.27524+08	
00000000-0000-0000-0000-000000000000	b5edf1f8-089d-48ef-809e-cedc02ce6d16	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:38:31.249961+08	
00000000-0000-0000-0000-000000000000	caf2445c-f1a3-4691-aaee-97cd45630a8c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:39:55.759328+08	
00000000-0000-0000-0000-000000000000	167e3c9e-1241-44ba-9fe5-3550ca85479d	{"action":"user_signedup","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-05 14:40:23.975454+08	
00000000-0000-0000-0000-000000000000	85803953-58d6-49da-a8d3-eeb40c62c12c	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:40:23.979162+08	
00000000-0000-0000-0000-000000000000	4cad4290-b84a-4889-9491-ea910673f358	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:40:53.85477+08	
00000000-0000-0000-0000-000000000000	38427762-1913-40c9-b9a5-d22927576362	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:44:49.3295+08	
00000000-0000-0000-0000-000000000000	a987c3c3-8aab-4094-8801-824b334d7c61	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:45:13.017507+08	
00000000-0000-0000-0000-000000000000	bc75e2ab-9e81-47f3-8e82-dd95ecbd357d	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:45:24.116592+08	
00000000-0000-0000-0000-000000000000	2eb43a92-5c94-4b2b-89df-c3ddb1d4286f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:01:36.743445+08	
00000000-0000-0000-0000-000000000000	2fd0d1f2-1080-4de9-951a-75cc192b1174	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 15:02:08.404872+08	
00000000-0000-0000-0000-000000000000	056a069a-7f7f-4696-878e-7e2da18c65fd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:02:10.809943+08	
00000000-0000-0000-0000-000000000000	8d4e37ff-c31e-4bd0-8a45-84d9c2b555ef	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 15:02:23.193954+08	
00000000-0000-0000-0000-000000000000	7e84e85a-fb54-4242-ac6e-14b11f9a3e3d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:03:39.289602+08	
00000000-0000-0000-0000-000000000000	5e75cdc5-47ab-4d93-a54d-5a9ef0903c8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:09:47.187853+08	
00000000-0000-0000-0000-000000000000	5993959d-390d-4917-bb2a-658bc7a90d18	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:18:19.426113+08	
00000000-0000-0000-0000-000000000000	aaa5a69d-34b3-4d3f-b4b5-33c87c737890	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:22:51.022723+08	
00000000-0000-0000-0000-000000000000	d809896d-8a94-4dad-8dbe-b14d6059b27f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:49:59.439864+08	
00000000-0000-0000-0000-000000000000	46153855-9a3c-4108-b000-a5cfa407892d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:56:49.43211+08	
00000000-0000-0000-0000-000000000000	35eaad60-3acd-497d-a25c-c18f67eee9c4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:12:50.659523+08	
00000000-0000-0000-0000-000000000000	fb261098-2d64-475a-9d13-05791c7ce38f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:17.589757+08	
00000000-0000-0000-0000-000000000000	f29f59f0-eb4c-48cd-bbd6-f5489edf160b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:25.42683+08	
00000000-0000-0000-0000-000000000000	473b88f2-00b3-4510-8a74-002e421cd2ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:31.760055+08	
00000000-0000-0000-0000-000000000000	6bd43f02-d7b0-4103-9d17-8029417aab8a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:37.222255+08	
00000000-0000-0000-0000-000000000000	461feb68-248b-4a78-bbbd-68b84211dce8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:57.730943+08	
00000000-0000-0000-0000-000000000000	34ab6a20-5e0d-46b1-bc30-761660740ab6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:28:00.923139+08	
00000000-0000-0000-0000-000000000000	19c350c1-d439-4b07-ac2a-21994ddc19ae	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:33:40.018339+08	
00000000-0000-0000-0000-000000000000	dcb7054a-e44e-4c71-85f1-e5b0b39d2ac0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:33:46.465814+08	
00000000-0000-0000-0000-000000000000	5ffc7d0d-544d-4807-9206-7d0d0342683f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:39:44.148319+08	
00000000-0000-0000-0000-000000000000	28d79b0f-fd79-4ca8-a944-70105d5f4bc3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:41:06.219764+08	
00000000-0000-0000-0000-000000000000	8f9a7e54-ac86-4154-9ab4-05ca8448c6d2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:46:20.406556+08	
00000000-0000-0000-0000-000000000000	7117063c-9bab-4564-8def-bdb56c974888	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:50:16.359146+08	
00000000-0000-0000-0000-000000000000	3770449a-64b3-4936-880f-068555068b94	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 16:51:20.132725+08	
00000000-0000-0000-0000-000000000000	57be2eae-07f6-4ea1-8465-5b3d53e2b9d3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:21:38.435815+08	
00000000-0000-0000-0000-000000000000	0a8ba79e-03c0-4844-90c7-c46035e23b81	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:28:18.410042+08	
00000000-0000-0000-0000-000000000000	3f06e451-6b35-4242-ace9-db6cf2680de1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:29:44.088271+08	
00000000-0000-0000-0000-000000000000	a6e61ef4-7dbd-43ad-bd22-5543041f8e24	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 09:31:00.325299+08	
00000000-0000-0000-0000-000000000000	a9b9231e-fd8a-4bb5-a669-42e684d824cb	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:31:16.787366+08	
00000000-0000-0000-0000-000000000000	1ff583ff-d55b-43ac-90a9-55fa552f73a9	{"action":"logout","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 09:31:36.611756+08	
00000000-0000-0000-0000-000000000000	1488c3aa-2dc2-4285-923f-ef552dc578b4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:31:56.325854+08	
00000000-0000-0000-0000-000000000000	08f99971-affe-48f8-bbed-847754a191a0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:38:13.613108+08	
00000000-0000-0000-0000-000000000000	b393b9b2-85fa-4d78-aded-340a332c92c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:38:59.671643+08	
00000000-0000-0000-0000-000000000000	b5a45ca1-7b28-4dcb-bda2-d1cf57dee945	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:48:36.466666+08	
00000000-0000-0000-0000-000000000000	925d0fb9-1c93-4a74-ad85-b28bede634e1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:02:27.256818+08	
00000000-0000-0000-0000-000000000000	818fd6c0-84dd-4ff2-b7d9-16c287fbcfff	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:03:13.268139+08	
00000000-0000-0000-0000-000000000000	b20d2891-0d69-4666-8fef-e052c3da462d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:49:27.739267+08	
00000000-0000-0000-0000-000000000000	53fd4c84-4c36-4c4b-9aed-3bb716cc9032	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 12:12:41.475879+08	
00000000-0000-0000-0000-000000000000	acb6968f-f998-415d-bc2e-b66a635681b3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 12:16:15.536568+08	
00000000-0000-0000-0000-000000000000	f9e75ac3-d1bb-44b9-8d7e-1b776934959f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:07:56.716333+08	
00000000-0000-0000-0000-000000000000	61be66e8-dba0-4cac-8b13-66c51407d5a6	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:08:20.155955+08	
00000000-0000-0000-0000-000000000000	5f6c3938-df43-4aa8-87f2-b45b80bc7196	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:08:22.666964+08	
00000000-0000-0000-0000-000000000000	ee79a8f6-c603-4c58-98eb-1b3f1a11dc97	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:09:21.162134+08	
00000000-0000-0000-0000-000000000000	19a6d59d-9fdf-4e72-a113-a92327c4f7ad	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:09:28.509794+08	
00000000-0000-0000-0000-000000000000	de5b7715-e9fb-48ee-866e-61e69ed13848	{"action":"logout","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:09:40.245354+08	
00000000-0000-0000-0000-000000000000	31506ce5-65e3-498b-a1b2-6553992f4b16	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:45:16.913404+08	
00000000-0000-0000-0000-000000000000	18598197-d641-49d3-affa-c3de21b77954	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:46:44.48034+08	
00000000-0000-0000-0000-000000000000	7a1d4661-385e-4878-943e-3a6e73ee9103	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 16:47:28.92829+08	
00000000-0000-0000-0000-000000000000	054c7e72-52e1-42f0-b8b6-02d6c6d07c8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:47:42.439552+08	
00000000-0000-0000-0000-000000000000	e436c3e1-2cfb-4498-9f34-0f8304abf89d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:54:09.899738+08	
00000000-0000-0000-0000-000000000000	13fbbfd2-d104-4bb1-859b-a8b2d2a5c61b	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 16:54:59.76359+08	
00000000-0000-0000-0000-000000000000	b961fff3-8ffd-4b80-b69c-17dffffc06aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:25:10.769123+08	
00000000-0000-0000-0000-000000000000	4909039d-24be-4547-9d54-00fc2ca3ef33	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 17:26:48.078215+08	
00000000-0000-0000-0000-000000000000	0131b4f5-171c-44d9-882e-9138e684b74c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:30:19.677286+08	
00000000-0000-0000-0000-000000000000	1bfb291a-f744-44d4-b69f-039dbbb4dbe3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:30:42.732823+08	
00000000-0000-0000-0000-000000000000	b317bdc0-4ebf-4cf9-a663-97e8f2cd9070	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 17:31:33.018563+08	
00000000-0000-0000-0000-000000000000	cd505d03-1345-485a-b7a8-5ab7ff267f5e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:32:02.732291+08	
00000000-0000-0000-0000-000000000000	ed994b7d-4fa8-4f78-b48b-3370883424ad	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:28:00.507878+08	
00000000-0000-0000-0000-000000000000	9ae79754-33cd-4b69-8179-66a9cf581063	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:28:16.89596+08	
00000000-0000-0000-0000-000000000000	e3e8bedc-bc35-440c-965c-567dd1f53a47	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:34:23.878958+08	
00000000-0000-0000-0000-000000000000	a93c0ef7-ae02-4a18-aec4-43e6379b9275	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:47:44.952957+08	
00000000-0000-0000-0000-000000000000	9f110fb4-b059-4031-b578-c39177c27493	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:49:20.445058+08	
00000000-0000-0000-0000-000000000000	3a4e49bd-e0ae-471a-8561-cfc93b841996	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:57:50.137665+08	
00000000-0000-0000-0000-000000000000	67651980-edf4-4c21-b523-e5c1f07960d7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 19:50:09.282077+08	
00000000-0000-0000-0000-000000000000	7633b660-616e-4172-8a3e-d2a80e6759b6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 20:09:01.057687+08	
00000000-0000-0000-0000-000000000000	15023973-4157-4784-a65e-92e3413db9c7	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:07:32.985973+08	
00000000-0000-0000-0000-000000000000	0a6c881b-4dbd-4882-ae33-5c78f0ce5d16	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:07:32.988634+08	
00000000-0000-0000-0000-000000000000	ca15b462-436f-4b20-82f1-d89f7aeb4e1f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 21:23:15.27942+08	
00000000-0000-0000-0000-000000000000	ed3a8fb1-106e-4bbd-bd37-c2fd128a343b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:22:52.829588+08	
00000000-0000-0000-0000-000000000000	be934048-679f-44bb-b7cd-5a5e7a892c31	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:23:32.793995+08	
00000000-0000-0000-0000-000000000000	801f2566-8bee-484e-8d4b-6d12750d71a4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:30:23.903269+08	
00000000-0000-0000-0000-000000000000	e150dda4-364c-4bdb-b618-125f28702fa4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 10:35:26.286876+08	
00000000-0000-0000-0000-000000000000	f403cbb4-12e9-4f89-8efc-24e54424e7a6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:35:37.526301+08	
00000000-0000-0000-0000-000000000000	563862f5-a25b-497e-b6b5-77e412434c4a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:36:25.022033+08	
00000000-0000-0000-0000-000000000000	eeca943c-db6a-4032-8887-2db2fe3b8792	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 10:38:04.055161+08	
00000000-0000-0000-0000-000000000000	02b5866a-a137-4704-8062-01a292f483e8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:38:19.563041+08	
00000000-0000-0000-0000-000000000000	fc8f5bcd-1dc7-4829-a7db-b01ba74d0e7f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:36:26.505395+08	
00000000-0000-0000-0000-000000000000	fb599968-6b63-4f3d-b4ef-7408c93e21cf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:36:51.557444+08	
00000000-0000-0000-0000-000000000000	0c4192c0-f8b0-42bb-8997-f16984e397fe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:41:11.930336+08	
00000000-0000-0000-0000-000000000000	c9138a8c-5c55-4e31-908c-21578c443f40	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 11:44:32.017583+08	
00000000-0000-0000-0000-000000000000	16478274-f26d-4484-87bd-4e0d8d5b77f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:45:52.671464+08	
00000000-0000-0000-0000-000000000000	72f05b66-5c68-4f42-886e-b591161d0bed	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:51:16.793722+08	
00000000-0000-0000-0000-000000000000	6036c600-ddae-4cb6-ac3c-3bc307c56735	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:57:40.449766+08	
00000000-0000-0000-0000-000000000000	c2ea40de-e223-4755-9fae-588dd1540e8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:01:55.106277+08	
00000000-0000-0000-0000-000000000000	635d0be8-3ce0-4fad-a23a-aacb0c4693cc	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:05:27.1148+08	
00000000-0000-0000-0000-000000000000	b63a41c6-9a1b-4e6d-8497-89bf15a1d31d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:07:02.347333+08	
00000000-0000-0000-0000-000000000000	77a82ea2-8605-403e-a107-ee6c407de885	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:10:05.00727+08	
00000000-0000-0000-0000-000000000000	a06fd762-5cee-4043-b80d-4271ff5f04fb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 13:11:52.555149+08	
00000000-0000-0000-0000-000000000000	796bb8ad-9a11-4445-9a10-7cb8a178df27	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 13:15:48.50789+08	
00000000-0000-0000-0000-000000000000	c78d0810-355f-4000-9613-8257826f0869	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 15:55:29.514801+08	
00000000-0000-0000-0000-000000000000	88d57f3d-6f67-4a67-876c-33cbaeace261	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 15:58:44.793703+08	
00000000-0000-0000-0000-000000000000	e319ebc5-e1b7-4cd7-8493-04aadb3db873	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 16:01:24.275499+08	
00000000-0000-0000-0000-000000000000	d68348a6-6ed7-4148-8ae1-b24e55f08790	{"action":"user_signedup","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 16:02:32.239361+08	
00000000-0000-0000-0000-000000000000	ad6a4879-e98d-4b76-94c1-866a7889eb4d	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:02:32.250604+08	
00000000-0000-0000-0000-000000000000	487eceaa-e82d-4896-abee-57b62cd2af64	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 16:02:57.658757+08	
00000000-0000-0000-0000-000000000000	47332c96-3a92-48e9-9b2a-cd09691e9b45	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:08:02.430218+08	
00000000-0000-0000-0000-000000000000	46c98d19-8cbb-434b-8790-f96a0bb55227	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:10:49.893134+08	
00000000-0000-0000-0000-000000000000	e9484d23-65f8-4604-85a5-94c8d8cf302f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:28:25.485822+08	
00000000-0000-0000-0000-000000000000	d991194c-88b0-41f6-852a-44fc662d08e0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:28:49.320777+08	
00000000-0000-0000-0000-000000000000	98c61d8c-467e-4f2a-b130-c8dd2cb5d713	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:45:16.877932+08	
00000000-0000-0000-0000-000000000000	e987d9fa-5c90-411f-8336-5fab07908afe	{"action":"user_signedup","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 16:59:21.296055+08	
00000000-0000-0000-0000-000000000000	da73474b-4e35-427d-9591-a7b76abdf74c	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:59:21.302136+08	
00000000-0000-0000-0000-000000000000	e8231c43-869a-483f-9e03-494ed1a0eed8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 17:06:14.104682+08	
00000000-0000-0000-0000-000000000000	3fedc63d-e06c-4514-955e-391c95920861	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 17:06:14.106829+08	
00000000-0000-0000-0000-000000000000	bdf7780e-82d8-4556-9aea-5caf11de0b0d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:04:44.395872+08	
00000000-0000-0000-0000-000000000000	6ec6d833-6962-4370-814a-110f3b9e5ac8	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:04:44.396736+08	
00000000-0000-0000-0000-000000000000	3175b46c-a5b2-4d98-b7b4-bc454f71d8a6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:16:40.993203+08	
00000000-0000-0000-0000-000000000000	168dac5a-ccff-4057-ad6e-daa21e651be1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:16:40.994684+08	
00000000-0000-0000-0000-000000000000	92583fd4-1114-436a-a01d-6769511c7e16	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:22:49.161279+08	
00000000-0000-0000-0000-000000000000	2bc6e3b9-3437-4c39-a786-1ee3477e627d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 18:23:34.5086+08	
00000000-0000-0000-0000-000000000000	cef3b251-749c-4707-a802-36089f9b52ed	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:28:05.498729+08	
00000000-0000-0000-0000-000000000000	d4614711-73e3-4742-91ad-274aa8edf453	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 18:30:09.366183+08	
00000000-0000-0000-0000-000000000000	1eaa8bef-c6d1-4ace-976a-af940e8d3203	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:00.734182+08	
00000000-0000-0000-0000-000000000000	56da2b10-4189-4feb-aa31-952ada31eb88	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:03.421366+08	
00000000-0000-0000-0000-000000000000	c936aad5-e8f7-478a-8de7-c5fe6b4a6fd9	{"action":"user_signedup","actor_id":"15e9b9ba-649b-498c-8134-62d4fa2f4e48","actor_username":"123@88.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 18:31:43.876168+08	
00000000-0000-0000-0000-000000000000	1f8e59fd-92c1-4dc7-8739-b6c17de7aa52	{"action":"login","actor_id":"15e9b9ba-649b-498c-8134-62d4fa2f4e48","actor_username":"123@88.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:43.880702+08	
00000000-0000-0000-0000-000000000000	c72a8d19-2a67-4976-85d8-ed6e289226a4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 19:16:54.317641+08	
00000000-0000-0000-0000-000000000000	8f31a363-b988-49e2-a864-f5f72260df4a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 19:16:54.319399+08	
00000000-0000-0000-0000-000000000000	3127fa24-a077-4c61-b1af-c1830ed4024b	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 20:20:13.665903+08	
00000000-0000-0000-0000-000000000000	5df831ae-6c06-48cc-bf8a-f1980cf2a326	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 20:20:13.668069+08	
00000000-0000-0000-0000-000000000000	8bd6a36d-d528-4c6c-a453-abfd9809af9a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 20:26:18.308788+08	
00000000-0000-0000-0000-000000000000	4a285e21-588c-4358-8b5e-e319f3554222	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 21:18:52.081605+08	
00000000-0000-0000-0000-000000000000	ab7dc64d-6ca1-4012-b713-538c255c118f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 21:18:52.091769+08	
00000000-0000-0000-0000-000000000000	cfb890e8-d9fe-4084-83e0-a0d20e748034	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 22:17:51.677925+08	
00000000-0000-0000-0000-000000000000	1d76d0b4-88a9-4cb3-9ea5-6380bbd6d27b	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 22:17:51.680346+08	
00000000-0000-0000-0000-000000000000	bd765214-64c9-4551-b209-f2a882743cf1	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 23:16:51.847943+08	
00000000-0000-0000-0000-000000000000	02de231b-77b3-4c1a-acd4-f91ac1169fb9	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 23:16:51.850595+08	
00000000-0000-0000-0000-000000000000	2058e96e-d1a1-462b-b9f7-2fdc17fbb6a4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 00:15:39.431125+08	
00000000-0000-0000-0000-000000000000	4ab50301-64e0-4825-95a5-50cf6f0efdb1	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 00:15:39.433201+08	
00000000-0000-0000-0000-000000000000	b9a7fb15-fa0a-421d-80e1-668fbc70b8a3	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 01:14:49.888472+08	
00000000-0000-0000-0000-000000000000	f58acdbc-e7cc-45b7-8c87-5abe7be10724	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 01:14:49.891252+08	
00000000-0000-0000-0000-000000000000	6afca8e4-e010-4fb1-a00e-4af0c4f3688e	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 02:16:18.467362+08	
00000000-0000-0000-0000-000000000000	0b5b0af6-4629-49bc-9774-5ac966bf9a67	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 02:16:18.468996+08	
00000000-0000-0000-0000-000000000000	4f060607-7153-486b-9f04-7a2723957c68	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 03:18:35.588571+08	
00000000-0000-0000-0000-000000000000	21f5deec-1f99-4407-b7ae-103c61560c5e	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 03:18:35.59063+08	
00000000-0000-0000-0000-000000000000	6e5fdc65-bacf-4b6a-b6a2-9bef6592f70c	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 04:23:39.003348+08	
00000000-0000-0000-0000-000000000000	f9ec7334-a5c1-425e-be72-4082191272ee	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 04:23:39.004929+08	
00000000-0000-0000-0000-000000000000	419d8d87-93db-4d39-8108-7be332add537	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 05:30:13.663122+08	
00000000-0000-0000-0000-000000000000	aef1b303-15c2-4ed3-a18c-65a72cbb761f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 05:30:13.665176+08	
00000000-0000-0000-0000-000000000000	5e2a7b9e-5dc3-49cb-bc73-331243b90ffd	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 06:33:40.884068+08	
00000000-0000-0000-0000-000000000000	6b49b2f4-4cb5-45b7-801d-c824b2889c7f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 06:33:40.885673+08	
00000000-0000-0000-0000-000000000000	260c6598-3b25-4daf-9124-006501e270de	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 07:37:47.91377+08	
00000000-0000-0000-0000-000000000000	72a42e85-4ade-4083-a4b5-901e4352c68a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 07:37:47.915295+08	
00000000-0000-0000-0000-000000000000	7c735dc0-402a-41c2-89c7-23f68c12f0dc	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 08:36:30.9365+08	
00000000-0000-0000-0000-000000000000	308a2c11-c3be-4746-8094-bd710452f8ca	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 08:36:30.93861+08	
00000000-0000-0000-0000-000000000000	958838c3-2905-42bc-a7a6-c6ba180b5e93	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 10:18:27.284355+08	
00000000-0000-0000-0000-000000000000	ab596043-02e5-40fd-8bc8-bd50471b15c5	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 10:18:27.285842+08	
00000000-0000-0000-0000-000000000000	f58b3a3e-5b90-44c5-83a5-fccf9cc6dcbc	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-09 10:18:31.583081+08	
00000000-0000-0000-0000-000000000000	15079fb5-eb46-462f-a850-31430cf570ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-09 10:19:28.085081+08	
00000000-0000-0000-0000-000000000000	4cb4443d-579e-4ea4-bb81-d0bfd5af6e6e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 17:50:22.692262+08	
00000000-0000-0000-0000-000000000000	95a06f70-6aff-4991-a125-9a41065419cf	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 17:50:22.713379+08	
00000000-0000-0000-0000-000000000000	1bd61f73-9a7f-4082-8d4b-88ffa7e49e99	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-09 17:51:07.757955+08	
00000000-0000-0000-0000-000000000000	c971cde0-b998-4589-b043-8b02948b09f5	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 11:53:05.023479+08	
00000000-0000-0000-0000-000000000000	bb42a94b-08f6-4444-a8dd-ba32b0aee756	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 11:53:05.037268+08	
00000000-0000-0000-0000-000000000000	c0a8c793-530b-4036-a211-09a069c8e648	{"action":"logout","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account"}	2025-07-10 11:58:58.276834+08	
00000000-0000-0000-0000-000000000000	169321d3-7688-448e-aeb3-051862b8c89d	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 11:59:07.799252+08	
00000000-0000-0000-0000-000000000000	f4662d1b-f29c-46c2-ba1d-dedd57f0d35d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 12:05:21.263294+08	
00000000-0000-0000-0000-000000000000	59e15d16-2cb4-45e4-b8ee-8e8ed36f44eb	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 13:02:28.907568+08	
00000000-0000-0000-0000-000000000000	8097f7f9-7303-467a-b4cd-0ef6e25adf9a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 13:02:28.910233+08	
00000000-0000-0000-0000-000000000000	d12100de-066a-4383-8737-601d63b24198	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 14:01:08.283257+08	
00000000-0000-0000-0000-000000000000	c0a65ce6-b1d3-48d3-8595-927f31e42b97	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 14:01:08.28599+08	
00000000-0000-0000-0000-000000000000	58e6aaa4-b426-4979-a43d-e19e02402596	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 14:45:27.872495+08	
00000000-0000-0000-0000-000000000000	e8708e23-905c-4cb1-8c41-3ab7c4579086	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:00:33.814331+08	
00000000-0000-0000-0000-000000000000	07d002fd-0c02-4d6b-9da0-945add59008d	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:00:33.81946+08	
00000000-0000-0000-0000-000000000000	3618da6d-f23c-49a0-b7b9-5b589d02dbaf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:22:00.790779+08	
00000000-0000-0000-0000-000000000000	002d7dce-18e5-4c3d-ba60-f2407be208c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:39:20.322856+08	
00000000-0000-0000-0000-000000000000	4d701161-19bb-41ef-b68b-3be7191cabf9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:39:54.275468+08	
00000000-0000-0000-0000-000000000000	a510a624-db59-4b4a-8e61-fa9f6418910b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:42:20.492887+08	
00000000-0000-0000-0000-000000000000	ac436771-e3d1-4444-928e-032253ebad6d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:49:20.013704+08	
00000000-0000-0000-0000-000000000000	5dba5eb4-648f-42cc-9480-d48938fe4c8f	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:59:11.807262+08	
00000000-0000-0000-0000-000000000000	58298cdb-d852-4282-827b-f08b02b36f5c	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:59:11.809377+08	
00000000-0000-0000-0000-000000000000	8dd71cc2-abff-4ca0-a586-f8898d27bc9b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 16:03:32.585782+08	
00000000-0000-0000-0000-000000000000	81a7f49c-6afe-4231-b73f-5b35bfd8d30b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 16:12:39.503738+08	
00000000-0000-0000-0000-000000000000	658cbd39-b842-49b2-b265-fcce275bfe14	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:20:13.529541+08	
00000000-0000-0000-0000-000000000000	e7fdea3a-d701-412a-9aeb-b89ce2b7a3a1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:20:13.531044+08	
00000000-0000-0000-0000-000000000000	4ac015d6-94f3-449d-9279-366ae6a117f8	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:57:55.384969+08	
00000000-0000-0000-0000-000000000000	33fb3a6e-7a14-4ae9-bb6d-b910c4df44d2	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:57:55.388144+08	
00000000-0000-0000-0000-000000000000	673b7a22-6c5a-46c3-aacc-d7bd03da0155	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:19:07.734562+08	
00000000-0000-0000-0000-000000000000	23441d09-ec4d-449c-9bb9-aed75afb1da1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:19:07.737357+08	
00000000-0000-0000-0000-000000000000	86fd0c62-b036-419d-af87-a5662e371a09	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:56:43.321279+08	
00000000-0000-0000-0000-000000000000	50a5f752-24fa-4d39-8456-2b23c30cce4f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:56:43.322119+08	
00000000-0000-0000-0000-000000000000	2e26972b-cb53-4838-ab1f-1d0453406e1d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 18:59:01.798088+08	
00000000-0000-0000-0000-000000000000	e1ba4b5a-a377-4069-b2f0-3ce9a9059390	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 18:59:01.800288+08	
00000000-0000-0000-0000-000000000000	193bedc9-3255-4bd1-8525-a5d0e5c12d02	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 19:59:59.569276+08	
00000000-0000-0000-0000-000000000000	b3d79032-aef4-49c3-b76a-f24e20c70fff	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 19:59:59.582171+08	
00000000-0000-0000-0000-000000000000	a4aaf762-3b65-4be3-bf69-2a0292b71e36	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 20:59:29.150044+08	
00000000-0000-0000-0000-000000000000	24dd363a-4311-4623-943c-ba953457f588	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 20:59:29.152989+08	
00000000-0000-0000-0000-000000000000	6859ecd3-2b5c-4139-9cd2-dc5503368039	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 21:58:08.109906+08	
00000000-0000-0000-0000-000000000000	58b79d9a-269c-42f1-a9c4-8bbfd4c9da4d	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 21:58:08.11341+08	
00000000-0000-0000-0000-000000000000	6f3af5c0-ba48-4b45-b0e1-119e8a5dee7d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 22:57:52.311105+08	
00000000-0000-0000-0000-000000000000	4c514e33-6f1c-4092-b15a-87f639dbe8a0	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 22:57:52.313098+08	
00000000-0000-0000-0000-000000000000	b1596e41-9c28-41e1-beba-8138b080c3bd	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 23:56:39.248539+08	
00000000-0000-0000-0000-000000000000	5b74a640-edc7-448b-8389-c63a3d27af70	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 23:56:39.249308+08	
00000000-0000-0000-0000-000000000000	2ba1992d-4d6f-4ad5-bb30-ea84d7759e8d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 01:08:38.12313+08	
00000000-0000-0000-0000-000000000000	b1ff908a-8d27-41ef-8aa6-c16fbd2ef364	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 01:08:38.123951+08	
00000000-0000-0000-0000-000000000000	5f6f8bc8-348c-4040-90df-081bd35999c4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 02:49:29.538032+08	
00000000-0000-0000-0000-000000000000	6ec1583f-868f-4d82-928e-4b856349ae79	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 03:48:00.642029+08	
00000000-0000-0000-0000-000000000000	4b35a296-ec7f-4e5f-95b0-085c76622354	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 03:48:00.64414+08	
00000000-0000-0000-0000-000000000000	0ff9c126-28ef-4b67-87fd-c9c49e083344	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 04:46:51.767315+08	
00000000-0000-0000-0000-000000000000	60cfb4a5-9e81-4508-a1df-4a38fe112d2e	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 04:46:51.768105+08	
00000000-0000-0000-0000-000000000000	3a6ffef3-dabb-467f-8441-f1c38c46a24e	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 05:52:14.659758+08	
00000000-0000-0000-0000-000000000000	c746f675-b123-4c8c-945f-f3a198c9599f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 05:52:14.661218+08	
00000000-0000-0000-0000-000000000000	1cfc7459-489d-4dd8-ab06-fcf3762c7524	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 06:53:05.140269+08	
00000000-0000-0000-0000-000000000000	90389419-0eab-4a39-a515-ef778cdda1e1	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 06:53:05.141122+08	
00000000-0000-0000-0000-000000000000	a6ec94f6-849f-4aa2-8915-4001d903da51	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 07:52:49.678255+08	
00000000-0000-0000-0000-000000000000	294b98ff-14ee-47ba-bae2-9c89cc2e2b13	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 07:52:49.681533+08	
00000000-0000-0000-0000-000000000000	3b1f5c67-c3cd-4685-bdbc-e7cf7ebeab66	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 08:58:01.60998+08	
00000000-0000-0000-0000-000000000000	6bf747a0-ae52-43d9-934f-d81d6c6bb718	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 08:58:01.613804+08	
00000000-0000-0000-0000-000000000000	edd777bc-a845-4e54-b0f5-0f344fef0f88	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 09:36:12.171148+08	
00000000-0000-0000-0000-000000000000	003fe3da-6a15-4b19-99ec-b5b4234dc231	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 09:36:12.173986+08	
00000000-0000-0000-0000-000000000000	1855c10c-5b47-457f-bb07-385a8cd0467f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 09:38:05.746433+08	
00000000-0000-0000-0000-000000000000	e46d1053-d360-427c-b268-9a712dceb662	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:04:14.883581+08	
00000000-0000-0000-0000-000000000000	c0ae38d7-c6be-4a48-8082-88e909a5dbbd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:08:36.654685+08	
00000000-0000-0000-0000-000000000000	fa49e778-4e6d-4f72-8156-d629c7da1be8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 10:10:23.864943+08	
00000000-0000-0000-0000-000000000000	9059bea6-9232-4854-aee7-7f44045cb581	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:14:46.873036+08	
00000000-0000-0000-0000-000000000000	df29c9ae-2bb4-4810-8182-79ca0fd43b20	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:15:14.284309+08	
00000000-0000-0000-0000-000000000000	adbfdf38-a7b9-4de5-aa9e-4039aa5c2121	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:18:28.248919+08	
00000000-0000-0000-0000-000000000000	25bdb294-a71e-4e13-b382-78716a6926f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:26:09.290367+08	
00000000-0000-0000-0000-000000000000	2284676b-7141-4987-b909-16371299fd6f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:31:20.719015+08	
00000000-0000-0000-0000-000000000000	227f9789-747c-4300-93c5-06ab63e3fb83	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:41:07.869397+08	
00000000-0000-0000-0000-000000000000	9c1290e9-dd80-4b7f-b1d2-455fa52b231c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:01:20.484524+08	
00000000-0000-0000-0000-000000000000	ecd2ee40-f27b-4836-afb4-dc254cf1f756	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:08:40.132557+08	
00000000-0000-0000-0000-000000000000	cdbadcdc-b22e-4ac3-a8a7-e564ae971086	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:12:42.359367+08	
00000000-0000-0000-0000-000000000000	0174bb56-2760-4c30-b936-5f9fd3afb4a8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:20:07.310265+08	
00000000-0000-0000-0000-000000000000	8d9b7879-88db-4056-bbd6-c3a5fd218591	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 14:24:08.101121+08	
00000000-0000-0000-0000-000000000000	57761928-1f93-490a-872f-bd6b24455906	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 14:24:08.106122+08	
00000000-0000-0000-0000-000000000000	b66a4dc6-2531-478a-b08c-4cf0a1e6e0f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:26:25.340832+08	
00000000-0000-0000-0000-000000000000	18ac02d2-f888-4d43-81e7-d7f0223e195e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:33:24.113236+08	
00000000-0000-0000-0000-000000000000	10f9bc7e-5670-4634-bc6f-4bf505a2ca3c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:34:01.404518+08	
00000000-0000-0000-0000-000000000000	9df537f3-36de-42ef-8832-18fcc4daa7c1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:44:46.239412+08	
00000000-0000-0000-0000-000000000000	81a52277-4556-4da5-8e59-70e3b12c9b30	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:51:05.07+08	
00000000-0000-0000-0000-000000000000	b7cc5398-4180-436b-a72a-ba32dc476ade	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:52:11.87683+08	
00000000-0000-0000-0000-000000000000	732de6e4-69df-4d88-880d-8d949d4cdebb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:52:14.982911+08	
00000000-0000-0000-0000-000000000000	5c3933c7-6a10-4ddb-9c9c-86d816ebf619	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:53:30.907255+08	
00000000-0000-0000-0000-000000000000	ab0b3081-05da-4114-b710-1bb30b355fbe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:53:34.181035+08	
00000000-0000-0000-0000-000000000000	921213e3-36fd-4bf4-b42b-5f542fb6d4bc	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:54:08.309433+08	
00000000-0000-0000-0000-000000000000	486d4a27-cb60-45ad-9735-0104c4d13135	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:54:11.38216+08	
00000000-0000-0000-0000-000000000000	f0220e61-bba4-47c0-95e2-016058e101f8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:58:03.936236+08	
00000000-0000-0000-0000-000000000000	38d12fc7-3fb1-483a-ba38-7865dcdf2d87	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:58:07.276077+08	
00000000-0000-0000-0000-000000000000	a0c9682f-4701-473d-a063-69cbc05d1c11	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 15:53:18.234885+08	
00000000-0000-0000-0000-000000000000	df8cfee4-517a-4a66-9cb7-ac9c4e530613	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 15:54:19.036037+08	
00000000-0000-0000-0000-000000000000	8902f9d1-0f68-4aae-b775-05904beed6fa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 18:37:17.94317+08	
00000000-0000-0000-0000-000000000000	63a5b2cd-c1a9-48a7-9339-bea5f3b43a2c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 18:48:59.172555+08	
00000000-0000-0000-0000-000000000000	9182efd0-8263-450b-9792-a7859115d3cd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 09:03:28.924249+08	
00000000-0000-0000-0000-000000000000	761a14cd-4ec1-40f6-83c9-a1c6ebedefbb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 09:05:13.69121+08	
00000000-0000-0000-0000-000000000000	b3d82f61-4d55-4d36-b287-905925e384dd	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 10:01:56.976617+08	
00000000-0000-0000-0000-000000000000	bb4f14bf-9af2-4d8c-b944-2e5458ca5d69	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 10:01:56.981291+08	
00000000-0000-0000-0000-000000000000	eca143e7-7ba2-4d57-887f-d96d7ba79671	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:00:09.4677+08	
00000000-0000-0000-0000-000000000000	d3a7069c-fe0d-4d82-b6eb-16a69a6450fd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:00:09.470926+08	
00000000-0000-0000-0000-000000000000	0656c169-cfda-4dee-a343-371e2aa1143b	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:04:47.219638+08	
00000000-0000-0000-0000-000000000000	bebb6ad3-dda3-4606-ba24-2bb2f64bdbea	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:04:47.222219+08	
00000000-0000-0000-0000-000000000000	ab66f832-dd2b-4dc1-8019-5cbef588f6f3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:58:24.766159+08	
00000000-0000-0000-0000-000000000000	fd879dfa-bd9a-435a-83a7-369859fc55f5	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:58:24.769304+08	
00000000-0000-0000-0000-000000000000	3a43b3c3-aa8f-419e-8ccf-09e15c36cf61	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 11:58:35.354474+08	
00000000-0000-0000-0000-000000000000	f53023fd-f975-4fc1-b2da-869ce1c03e02	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 11:58:41.871439+08	
00000000-0000-0000-0000-000000000000	a564fd0d-7c0b-4ba1-aa44-856c4e14072e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 12:14:53.404214+08	
00000000-0000-0000-0000-000000000000	a62093f9-5be3-4133-9407-25310d25dc14	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 12:14:59.789201+08	
00000000-0000-0000-0000-000000000000	cf91642d-406f-43d8-ae4c-95bc1add77e4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 12:21:38.562861+08	
00000000-0000-0000-0000-000000000000	655e196f-10a9-4d80-bd64-1a6dfd6eebb8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 13:13:33.802169+08	
00000000-0000-0000-0000-000000000000	cf2d5802-1484-4b69-895d-21dd7867967e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 13:13:33.804669+08	
00000000-0000-0000-0000-000000000000	61fa196f-0385-4075-a3b7-440842327277	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 15:02:06.742269+08	
00000000-0000-0000-0000-000000000000	9ef8d24c-fa9e-43e9-bdb4-feee2e67d45b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 15:02:06.747087+08	
00000000-0000-0000-0000-000000000000	139a7a2f-6080-4343-99c4-833afd0110fa	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 15:03:48.253454+08	
00000000-0000-0000-0000-000000000000	39077c8a-9c56-4b95-a0bc-196f5f15e9c9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 15:03:54.467325+08	
00000000-0000-0000-0000-000000000000	65533312-af5e-44ee-94fb-45aef929f9ba	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 16:03:19.765108+08	
00000000-0000-0000-0000-000000000000	e6c8b8bc-58f9-4a88-981f-2def5c1e0cbf	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 16:03:19.766517+08	
00000000-0000-0000-0000-000000000000	e4e87774-2578-475d-a359-9bd6524aebd3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 17:03:05.029396+08	
00000000-0000-0000-0000-000000000000	588a168b-ac59-40c4-9ed1-be3e69c83a2b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 17:03:05.030871+08	
00000000-0000-0000-0000-000000000000	05111cf4-a4e1-4937-a769-acdedd47d464	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 18:02:19.086844+08	
00000000-0000-0000-0000-000000000000	20e4c0fa-a102-44b0-ad8d-b62b09a409be	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 18:02:19.089678+08	
00000000-0000-0000-0000-000000000000	8fd870ae-48ad-4e05-a365-a2e4a1504187	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 18:46:54.523472+08	
00000000-0000-0000-0000-000000000000	ac567357-97ff-4e65-8ab9-483cdce868a2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:26:12.651751+08	
00000000-0000-0000-0000-000000000000	037fa221-c1c6-4347-a0c5-5805ee64085b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:42:27.795236+08	
00000000-0000-0000-0000-000000000000	c97c9971-580d-4c58-bc17-d2e8473cd351	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:43:19.267633+08	
00000000-0000-0000-0000-000000000000	35d74695-e51e-4d32-8150-4a732c600ee2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:43:22.264152+08	
00000000-0000-0000-0000-000000000000	2354c3b3-1ef9-481f-a016-4052caf96095	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:51:26.599632+08	
00000000-0000-0000-0000-000000000000	d56cb667-4e10-4a6e-8bef-2f6c882cbebc	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:51:29.415774+08	
00000000-0000-0000-0000-000000000000	90ef3427-b795-426a-b8a6-23ae3c5a45ea	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:52:37.338872+08	
00000000-0000-0000-0000-000000000000	95b0a15b-ac55-41e0-ae32-b1f7dbff4180	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:52:40.262016+08	
00000000-0000-0000-0000-000000000000	40f41f22-cdf3-4e71-a859-1d6a2381960f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:54:16.160541+08	
00000000-0000-0000-0000-000000000000	b91c8c30-e6ea-4c83-bba3-600aaf0aea86	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:54:19.332505+08	
00000000-0000-0000-0000-000000000000	f7f85ac3-4a19-42b6-bcea-1167a08b90f5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:59:58.823349+08	
00000000-0000-0000-0000-000000000000	6c6bac96-4c41-4ac5-9bbe-c792ed65061b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:05:31.990385+08	
00000000-0000-0000-0000-000000000000	9814ad49-bada-4796-8058-837f0d8565eb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:06:09.290611+08	
00000000-0000-0000-0000-000000000000	303a1cd0-7f61-4213-ba32-b00e5809d187	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:07:09.163238+08	
00000000-0000-0000-0000-000000000000	6a8f8659-88bf-4c09-a69e-8c77f8d668db	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:10:59.989702+08	
00000000-0000-0000-0000-000000000000	14d028d7-bfa1-4ea7-8b8f-61351e9d6efe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:16:45.092628+08	
00000000-0000-0000-0000-000000000000	986fb078-a8b9-4806-816f-25a0f4345347	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:29:36.242628+08	
00000000-0000-0000-0000-000000000000	9fe64c7b-777f-452a-9053-50505c7dbc3f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:30:52.274547+08	
00000000-0000-0000-0000-000000000000	7e5aabe8-e28f-4e21-b04c-7eea08d5e6a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:39:39.342805+08	
00000000-0000-0000-0000-000000000000	6a7495a5-a27b-49e7-aa67-d551f91d76be	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:54:40.393409+08	
00000000-0000-0000-0000-000000000000	bf4041f6-eafa-4743-a73c-e3a64fc3dce6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 10:06:22.063355+08	
00000000-0000-0000-0000-000000000000	4dea58a6-1fb2-4013-8b4b-aea67936e23e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 10:06:22.066068+08	
00000000-0000-0000-0000-000000000000	62f1aeba-1981-494f-b677-f79f6ede3dcc	{"action":"user_signedup","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-15 10:15:59.281842+08	
00000000-0000-0000-0000-000000000000	6142232f-9b22-4b01-b478-0a7c5cb552fd	{"action":"login","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 10:15:59.294327+08	
00000000-0000-0000-0000-000000000000	6abbc564-470c-4c65-b1cc-fd77750a6e23	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 11:14:54.972845+08	
00000000-0000-0000-0000-000000000000	eb381b49-013a-45a9-8147-48d4b6179794	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 11:14:54.975534+08	
00000000-0000-0000-0000-000000000000	aa3473ef-2e2f-4ac3-b764-e07f3f9490fe	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 12:13:57.142258+08	
00000000-0000-0000-0000-000000000000	7dcd9e23-5cd9-49fd-809e-e44ed129d5b1	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 12:13:57.144407+08	
00000000-0000-0000-0000-000000000000	a2bb337c-d3b2-4622-9426-8d7b66e61290	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 13:12:56.980301+08	
00000000-0000-0000-0000-000000000000	a8e86e0e-059a-4f27-aa0f-401754c3e8ab	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 13:12:56.981757+08	
00000000-0000-0000-0000-000000000000	a4e3d503-fba6-4465-8cc8-65cb5c305aac	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 14:11:43.916643+08	
00000000-0000-0000-0000-000000000000	023b62d0-f0c7-4434-a97b-e9d5f2d3aa1e	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 14:11:43.926788+08	
00000000-0000-0000-0000-000000000000	9ad53bd0-9653-412a-ba61-8f6cc205a1eb	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 15:10:18.613231+08	
00000000-0000-0000-0000-000000000000	f6ff6fb5-19c7-4f71-8da1-d7f4a4b9e7a4	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 15:10:18.616109+08	
00000000-0000-0000-0000-000000000000	9efc9317-3e80-4f40-a3f1-467b96af709f	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 16:09:08.617279+08	
00000000-0000-0000-0000-000000000000	619771dc-fe5f-4726-b75c-76adaf78bc6b	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 16:09:08.621973+08	
00000000-0000-0000-0000-000000000000	bce66e5f-29f3-4852-94aa-e0ef85db9357	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:05:25.765494+08	
00000000-0000-0000-0000-000000000000	4d3eb916-c082-4959-820c-4c6ac0bb14e3	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:05:25.769086+08	
00000000-0000-0000-0000-000000000000	fb3f3b8f-742e-4559-9608-0f9e17ffaf30	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:07:57.948754+08	
00000000-0000-0000-0000-000000000000	1cf03169-fba2-469c-914a-9eda01730e35	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:07:57.95028+08	
00000000-0000-0000-0000-000000000000	d7c315be-bf2d-42f9-9080-8f021354512f	{"action":"user_signedup","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-15 17:15:49.724604+08	
00000000-0000-0000-0000-000000000000	202e22f0-9c78-421c-ae9e-a30532972848	{"action":"login","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 17:15:49.732228+08	
00000000-0000-0000-0000-000000000000	991173f6-1eed-4c1d-8385-4f069bc368ab	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:06:48.684595+08	
00000000-0000-0000-0000-000000000000	6a941b2c-9754-4bb1-8552-92098e9d2d23	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:06:48.686173+08	
00000000-0000-0000-0000-000000000000	9d03aceb-826a-4a68-a69d-380d8c874068	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:15:22.313717+08	
00000000-0000-0000-0000-000000000000	08c2f366-77d9-463f-b676-d6b686cbb3e9	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:15:22.315256+08	
00000000-0000-0000-0000-000000000000	9d874927-cad6-49f6-89d1-c33c3a775fad	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 19:14:10.368828+08	
00000000-0000-0000-0000-000000000000	93c8c948-07bf-4236-a8de-3f46ece589df	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 19:14:10.369669+08	
00000000-0000-0000-0000-000000000000	33e0d122-e4c7-49a4-819d-2ee0abe81a19	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 20:12:49.059311+08	
00000000-0000-0000-0000-000000000000	608d654a-7e3c-4688-b33a-430c046a6c22	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 20:12:49.061423+08	
00000000-0000-0000-0000-000000000000	b5392eb5-bc4e-4c91-a29d-08ab372373fe	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 21:12:10.380711+08	
00000000-0000-0000-0000-000000000000	8db127b7-f004-4265-870f-0a73bc1fa988	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 21:12:10.382817+08	
00000000-0000-0000-0000-000000000000	8d769113-1d7f-4ae7-add4-d0227aff6cd9	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 22:11:35.402864+08	
00000000-0000-0000-0000-000000000000	254ec783-fdf4-4715-bec8-be1aa14703d4	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 22:11:35.404348+08	
00000000-0000-0000-0000-000000000000	8fb5d1cf-d6e1-4dd7-a097-43727d3a8387	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 23:10:20.341646+08	
00000000-0000-0000-0000-000000000000	6a54759a-a4a7-4da4-8004-06202e1c2fb3	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 23:10:20.344252+08	
00000000-0000-0000-0000-000000000000	58f694e0-6ab7-4e4a-b521-3a89238807d7	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 00:09:11.127784+08	
00000000-0000-0000-0000-000000000000	655fcba9-1c2b-4abc-be4e-21af317c9cc1	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 00:09:11.129291+08	
00000000-0000-0000-0000-000000000000	b77b3d40-b8e6-4c82-ba95-52f917890816	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 01:08:10.633459+08	
00000000-0000-0000-0000-000000000000	2bc67856-042a-4a21-b78a-d473e6e15774	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 01:08:10.634972+08	
00000000-0000-0000-0000-000000000000	94d393e1-9213-4a18-adf9-64da12abb6b2	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 02:06:57.606321+08	
00000000-0000-0000-0000-000000000000	7986df53-ed59-44f1-baac-2ef36e78ac81	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 02:06:57.607119+08	
00000000-0000-0000-0000-000000000000	184b79f9-8e22-4d0e-8c8a-bb6af72fc9de	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 03:06:30.416771+08	
00000000-0000-0000-0000-000000000000	17d6fbb4-1ba0-488a-890b-0b411448d025	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 03:06:30.418968+08	
00000000-0000-0000-0000-000000000000	9f72a96f-9a80-4d9b-a1f2-b5b1326a9942	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 04:05:06.503591+08	
00000000-0000-0000-0000-000000000000	0efd7fbd-88b5-416d-b5b0-4d4208383bf6	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 04:05:06.505778+08	
00000000-0000-0000-0000-000000000000	2f9c5443-e2e9-4a3c-870a-8fc551be628a	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 05:03:44.439029+08	
00000000-0000-0000-0000-000000000000	0eb5d18b-32fa-4512-8efe-d9f7a664ca40	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 05:03:44.440641+08	
00000000-0000-0000-0000-000000000000	248eef09-934d-4429-8efd-8db3b3a1de99	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 06:03:06.584119+08	
00000000-0000-0000-0000-000000000000	a8ac6db9-b052-4c5e-8a21-ad38d6f6d959	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 06:03:06.586232+08	
00000000-0000-0000-0000-000000000000	4645b4e7-034e-4427-b39d-e13982444e7d	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 07:01:54.55115+08	
00000000-0000-0000-0000-000000000000	71792ddf-bb04-43ec-a8cf-1ced0f2035dd	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 07:01:54.554419+08	
00000000-0000-0000-0000-000000000000	fb4e39c1-1d44-4942-8b08-9ba1ed061b7d	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 08:01:30.666029+08	
00000000-0000-0000-0000-000000000000	5677ff28-7edc-4079-b140-33760ada7b4c	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 08:01:30.66883+08	
00000000-0000-0000-0000-000000000000	5430e6fb-0b52-4150-bf07-9bd56157cf30	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 09:01:15.4809+08	
00000000-0000-0000-0000-000000000000	9ed83155-ab61-4614-bd86-acff759b4fff	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 09:01:15.483261+08	
00000000-0000-0000-0000-000000000000	2a9387ff-97d0-4233-9de3-8a76adb57eb8	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:00:04.695475+08	
00000000-0000-0000-0000-000000000000	49733ed8-b935-49d1-accb-83a0370f3d8c	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:00:04.698742+08	
00000000-0000-0000-0000-000000000000	9ae8e727-fc63-40c0-acd7-d486fa6c11b3	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:59:10.586225+08	
00000000-0000-0000-0000-000000000000	c7f284fb-2ba3-4787-8d0a-bded59c15dd2	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:59:10.587564+08	
00000000-0000-0000-0000-000000000000	b5ba60e4-0e82-45b6-b67e-6193e3911726	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 11:58:06.68382+08	
00000000-0000-0000-0000-000000000000	50570bba-f731-4599-82f5-59f05ed59b83	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 11:58:06.685429+08	
00000000-0000-0000-0000-000000000000	f1aaf669-f26b-43b6-84f5-1f2078e27f85	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 12:56:55.717875+08	
00000000-0000-0000-0000-000000000000	59a06773-7a78-4261-a5b6-f5d875b83bf7	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 12:56:55.719397+08	
00000000-0000-0000-0000-000000000000	9e018722-ba3f-4b57-9827-3cb5354bd3b0	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 13:55:48.717326+08	
00000000-0000-0000-0000-000000000000	97c2b7ed-9177-46d4-9340-bb5a7b68c1a6	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 13:55:48.719898+08	
00000000-0000-0000-0000-000000000000	5e4c21bd-0dd4-47e4-ab24-3ca5977c0206	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 14:54:22.565755+08	
00000000-0000-0000-0000-000000000000	46313459-02a2-438f-9cee-2da50fbb9455	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 14:54:22.569204+08	
00000000-0000-0000-0000-000000000000	7c2042b3-6220-4095-a78f-3a794229867f	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 15:53:10.724532+08	
00000000-0000-0000-0000-000000000000	e4a0ba15-880c-485b-85b9-a16f3b101f5e	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 15:53:10.727995+08	
00000000-0000-0000-0000-000000000000	40341c67-8824-4131-b43c-d20d09d027be	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:19:47.622909+08	
00000000-0000-0000-0000-000000000000	8eab384c-1ecf-469f-99c1-6c96fd32856c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:27:09.040095+08	
00000000-0000-0000-0000-000000000000	20409b91-e3b7-4285-94f9-18f2c2d7e7b2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:31:53.452963+08	
00000000-0000-0000-0000-000000000000	ac9e99bb-e889-42b1-8f2c-fed5eccdd81b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:41:47.245301+08	
00000000-0000-0000-0000-000000000000	48bf680c-3a7f-490e-bc8e-14afd741cacb	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:47:14.22518+08	
00000000-0000-0000-0000-000000000000	1aaed648-2600-47f6-835e-5bf9ea4c06ff	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:47:14.229065+08	
00000000-0000-0000-0000-000000000000	cba27552-4827-47b4-901c-c5fffd319d64	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:49:29.561696+08	
00000000-0000-0000-0000-000000000000	cfb4884c-f9f6-40de-96c8-a65590bb012a	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:52:23.553844+08	
00000000-0000-0000-0000-000000000000	88a1d974-8662-472b-9c12-b7f9f5ae25ef	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:52:23.555944+08	
00000000-0000-0000-0000-000000000000	d9321cd3-d161-4b74-be5b-43bc31657660	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:57:46.833881+08	
00000000-0000-0000-0000-000000000000	26c2b5fe-5cf4-4469-ad57-fd80b583e52d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 16:59:22.007277+08	
00000000-0000-0000-0000-000000000000	479ac4a8-c817-433f-84aa-f02b56b1bfa5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:59:25.341909+08	
00000000-0000-0000-0000-000000000000	287f30ff-9efc-44f8-ba21-fe7d5ee77238	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:08:03.402853+08	
00000000-0000-0000-0000-000000000000	fc697c46-f171-41ef-b5d1-5247fbab5b20	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 17:09:46.596493+08	
00000000-0000-0000-0000-000000000000	4bfd5867-5fc6-4386-9cb4-064d8b9b3b23	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:09:53.317191+08	
00000000-0000-0000-0000-000000000000	66e9dd21-1003-4f70-9c04-09399b9cc395	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:17:11.657001+08	
00000000-0000-0000-0000-000000000000	30ee665a-52be-456b-b507-c81d8763cff4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:22:34.191184+08	
00000000-0000-0000-0000-000000000000	05bbb9fb-4f5d-4559-98a1-ef41906f1b88	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:31:13.850577+08	
00000000-0000-0000-0000-000000000000	4b51f172-7bb1-4485-b5f7-87568e02f954	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:33:15.074385+08	
00000000-0000-0000-0000-000000000000	c567344c-742b-4fd4-bdb6-0ac50f160d1d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:41:16.811462+08	
00000000-0000-0000-0000-000000000000	b99c6d65-09a0-47a9-a174-8e902c5cfbe5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:42:21.161913+08	
00000000-0000-0000-0000-000000000000	1c781653-2935-486e-bc37-9050a0b7b2ce	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:50:10.511722+08	
00000000-0000-0000-0000-000000000000	66d60bc9-c246-4b03-98f6-fae949b7f246	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 17:50:56.928634+08	
00000000-0000-0000-0000-000000000000	b3d82795-752b-4404-894c-d25eec5d2a3f	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 17:50:56.929173+08	
00000000-0000-0000-0000-000000000000	69f449ac-1c91-41da-8805-b256fcf70563	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:48:18.489544+08	
00000000-0000-0000-0000-000000000000	7b2e4955-30cb-4a4a-8a88-1834f6b55e3e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:48:18.49221+08	
00000000-0000-0000-0000-000000000000	b5f4fde1-4c83-4c5b-a5d7-93231d9d9f66	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:49:29.675425+08	
00000000-0000-0000-0000-000000000000	8c6c5924-6bdc-46f8-8257-5593ef71f523	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:49:29.677107+08	
00000000-0000-0000-0000-000000000000	ba200636-6d57-42e7-a264-ed49c5561580	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 19:01:34.015274+08	
00000000-0000-0000-0000-000000000000	8293d2a2-28ac-4992-92bf-e9782229a136	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 19:08:41.501375+08	
00000000-0000-0000-0000-000000000000	9d5ea138-7031-4b4f-aeca-02a8e388a0f7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 19:10:50.134984+08	
00000000-0000-0000-0000-000000000000	a97da2d6-0750-4e25-83be-185c9b5426b9	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 19:48:04.962462+08	
00000000-0000-0000-0000-000000000000	7639f7b0-f313-4d32-82d3-5c16bb5b7b6a	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 19:48:04.96452+08	
00000000-0000-0000-0000-000000000000	b5a2b481-672c-4083-a32b-a5d022b734c6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 20:46:54.872938+08	
00000000-0000-0000-0000-000000000000	fc26dfd2-5a47-48d9-91ab-d79ae4e3dc63	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 20:46:54.876731+08	
00000000-0000-0000-0000-000000000000	2d3f0b4b-da3f-4654-8b05-4c13479ac8c3	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 21:45:47.436566+08	
00000000-0000-0000-0000-000000000000	6ab4453e-72bf-4ea8-a347-528229da96eb	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 21:45:47.447685+08	
00000000-0000-0000-0000-000000000000	84e7ac1b-8428-4d7a-910f-391c15c07093	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 22:44:29.851105+08	
00000000-0000-0000-0000-000000000000	659961e5-d6a4-45e2-b90a-bff576f3513a	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 22:44:29.852519+08	
00000000-0000-0000-0000-000000000000	7e1f292c-f2a7-40b8-8b13-faab3df97fc6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 23:43:12.979038+08	
00000000-0000-0000-0000-000000000000	51a9fbca-36bd-43c5-b034-27314f8e2c83	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 23:43:12.980694+08	
00000000-0000-0000-0000-000000000000	22c0b45b-5a89-4a23-a99e-3b5a94d23192	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 00:41:46.829248+08	
00000000-0000-0000-0000-000000000000	3ac7cfcd-decc-4047-b07c-7b030b2b9260	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 00:41:46.830834+08	
00000000-0000-0000-0000-000000000000	255f375c-b7d0-4730-bfd7-1adbfed1be85	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 01:41:22.954699+08	
00000000-0000-0000-0000-000000000000	cd1963bc-89e0-415a-afb1-aabb890eda7b	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 01:41:22.956244+08	
00000000-0000-0000-0000-000000000000	5cb01b45-f892-45d3-ac74-4cb4545ed5a5	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 02:40:10.963196+08	
00000000-0000-0000-0000-000000000000	4d7fcab1-ed3b-4ba9-a0b5-d811ebb771dc	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 02:40:10.964638+08	
00000000-0000-0000-0000-000000000000	6c42b7ef-9ddb-4cab-9a69-e73fee9d8c69	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 03:39:11.553412+08	
00000000-0000-0000-0000-000000000000	9c7e0e6d-1469-4323-a3c9-a12117c16815	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 03:39:11.555456+08	
00000000-0000-0000-0000-000000000000	39f62e6e-f9c7-4f0f-b4c2-93839ef726cc	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:37:46.975107+08	
00000000-0000-0000-0000-000000000000	c3e09a00-b447-4065-9b75-5cc00146f838	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:37:46.976885+08	
00000000-0000-0000-0000-000000000000	871795d0-5687-46cb-89cf-0ee471df68b6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 05:37:23.004194+08	
00000000-0000-0000-0000-000000000000	51c58c02-2ee5-4ad0-9ded-f1f1f3e25798	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 05:37:23.00573+08	
00000000-0000-0000-0000-000000000000	9b2f3178-a118-4563-9216-c573006ac216	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 06:36:11.009501+08	
00000000-0000-0000-0000-000000000000	9b7b87c2-b1a4-4277-a5d2-b9a2a79835d3	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 06:36:11.011863+08	
00000000-0000-0000-0000-000000000000	ced92f18-0b25-4af3-966a-0a65ba6669d5	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 07:35:11.233827+08	
00000000-0000-0000-0000-000000000000	73fc04d4-dec0-4eb5-899a-170d332ab3fd	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 07:35:11.237637+08	
00000000-0000-0000-0000-000000000000	c67c84c4-858e-4e9a-b511-302cfe470e5f	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 08:33:57.006908+08	
00000000-0000-0000-0000-000000000000	df662af8-7096-4a7b-91d2-fb376d6437e5	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 08:33:57.008393+08	
00000000-0000-0000-0000-000000000000	ed30a8b1-15e0-4fc2-bc81-bf9bec50e73a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 08:58:25.183744+08	
00000000-0000-0000-0000-000000000000	a10affc4-029e-4f9b-95fe-38e6a63e0af3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:07:20.810436+08	
00000000-0000-0000-0000-000000000000	36a6e0ef-4428-43f3-ba22-efc4271ede5b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:16:31.678659+08	
00000000-0000-0000-0000-000000000000	855a6edf-09dd-4429-8926-048ba1ceab73	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:28:46.879295+08	
00000000-0000-0000-0000-000000000000	384a93c9-b9bc-4216-91dd-1558c63ec487	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 09:33:32.160069+08	
00000000-0000-0000-0000-000000000000	d83235f2-7cb1-4cac-a8a3-6b5c4efe2be9	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 09:33:32.163436+08	
00000000-0000-0000-0000-000000000000	86d2772e-cd10-4f25-b0d9-f85fd25f801e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:34:00.884047+08	
00000000-0000-0000-0000-000000000000	1fba93c4-3a19-41c2-8585-7cba424afb21	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:35:29.966097+08	
00000000-0000-0000-0000-000000000000	7a82ea1b-4515-4159-8590-f687b80a8576	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:44:34.80302+08	
00000000-0000-0000-0000-000000000000	57b41d24-337d-4b87-bf16-adaa88ac0cf5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:53:24.943621+08	
00000000-0000-0000-0000-000000000000	e2425f2a-0ee7-4086-a79e-06b39c306328	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 10:17:42.434119+08	
00000000-0000-0000-0000-000000000000	d70bc02b-09ca-4f83-8c1a-3d667bfb8383	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:32:16.55978+08	
00000000-0000-0000-0000-000000000000	601f28d4-db2a-40ff-a339-133751432338	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:32:16.562543+08	
00000000-0000-0000-0000-000000000000	08d678dd-852d-4f9d-b78f-35cf61658d22	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:39:57.639552+08	
00000000-0000-0000-0000-000000000000	57928a2f-e1da-45ce-a780-5eea67d39fd3	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:39:57.642262+08	
00000000-0000-0000-0000-000000000000	1ac0fde0-cc50-46ae-b6f4-98c4a2dbb0ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 10:51:35.735409+08	
00000000-0000-0000-0000-000000000000	62a5f969-e5ff-48dc-a784-cc105e963b84	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 11:25:45.544962+08	
00000000-0000-0000-0000-000000000000	c51a8ba3-8608-46e8-804c-c94bb62e2f4e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 11:49:46.692288+08	
00000000-0000-0000-0000-000000000000	098c8997-1844-499b-8e38-878488ce0677	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 11:49:46.697298+08	
00000000-0000-0000-0000-000000000000	07e0d89f-1535-47fd-b0e3-ca023e7fbd80	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 12:17:56.350776+08	
00000000-0000-0000-0000-000000000000	8fd1ab56-00c8-4a13-bb26-1bc0cb266556	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 14:18:38.275999+08	
00000000-0000-0000-0000-000000000000	4788b1cf-8fd4-4b8a-9b75-e740aca7fdbb	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 14:19:42.289541+08	
00000000-0000-0000-0000-000000000000	7777cdd8-d99d-4859-80cd-12ffd87ad50c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 14:19:42.291074+08	
00000000-0000-0000-0000-000000000000	bd0cb146-7b53-4ac5-bca5-d83dadefd872	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 14:41:06.64384+08	
00000000-0000-0000-0000-000000000000	f31d44c0-0088-4fd9-a2a3-4511e7c5755f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 15:27:11.557405+08	
00000000-0000-0000-0000-000000000000	ea030153-2056-40b1-b5f9-c18d10586e9a	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 15:27:55.142879+08	
00000000-0000-0000-0000-000000000000	2004679e-1811-406f-bb63-39b341919e03	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 15:27:55.14405+08	
00000000-0000-0000-0000-000000000000	5b1b823e-ad69-47e5-97e2-56338021fd82	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:12:14.622913+08	
00000000-0000-0000-0000-000000000000	ce847734-d1b9-4e43-aa7b-235d35f704dd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:12:14.625719+08	
00000000-0000-0000-0000-000000000000	8b9a1249-0635-4218-8dbe-5b5cbcd50c27	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:31:15.457242+08	
00000000-0000-0000-0000-000000000000	13fbb560-038a-4f73-987f-e1bb3faa997e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:31:15.462233+08	
00000000-0000-0000-0000-000000000000	f03385b6-178e-490c-a567-f32216dd4957	{"action":"user_signedup","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-17 17:01:21.180471+08	
00000000-0000-0000-0000-000000000000	0d8f0f64-48be-4aba-b83d-5a21655fe126	{"action":"login","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 17:01:21.190541+08	
00000000-0000-0000-0000-000000000000	5ed0bc33-0fe4-4138-b91e-1b4dd81f13c3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:10:19.018887+08	
00000000-0000-0000-0000-000000000000	6b1f61cf-9a9b-4bb8-addf-122ec89f0a57	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:10:19.022242+08	
00000000-0000-0000-0000-000000000000	79b585ad-4406-4004-be8e-0acb632531c9	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:30:40.268746+08	
00000000-0000-0000-0000-000000000000	7185bf54-a703-432c-aa3d-1c86ab81eeea	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:30:40.272077+08	
00000000-0000-0000-0000-000000000000	3a347a5a-17d4-4f00-baa6-d8a9014b4e26	{"action":"user_signedup","actor_id":"169dd076-28e3-4141-80fb-7d92067b467a","actor_username":"guanyw@novots.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-17 17:30:57.028893+08	
00000000-0000-0000-0000-000000000000	3e097d27-f682-448b-80d9-3646008d37c1	{"action":"login","actor_id":"169dd076-28e3-4141-80fb-7d92067b467a","actor_username":"guanyw@novots.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 17:30:57.03581+08	
00000000-0000-0000-0000-000000000000	958ce67f-8abb-4568-9ce7-2366eac531d8	{"action":"token_refreshed","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:59:54.840064+08	
00000000-0000-0000-0000-000000000000	cc3bc104-957f-4fc8-babd-7a998baf0514	{"action":"token_revoked","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:59:54.841546+08	
00000000-0000-0000-0000-000000000000	026ec78c-c790-45b6-8f8b-b9da7f8524b7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 18:08:56.793192+08	
00000000-0000-0000-0000-000000000000	75b75919-6a22-4737-9ddd-9aa140084415	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:15:53.202735+08	
00000000-0000-0000-0000-000000000000	ae1a1d46-f97e-4f8f-8c54-df860e0fee75	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:15:53.216144+08	
00000000-0000-0000-0000-000000000000	2e8ae1a3-baba-4cad-9c52-abde2ab3cda6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:17:41.464619+08	
00000000-0000-0000-0000-000000000000	4d90b751-371c-422b-877d-1e4dfbfd0e2e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:17:41.466043+08	
00000000-0000-0000-0000-000000000000	c09aa6e8-90d7-4e84-b65c-1b920d36b6de	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 09:44:49.89189+08	
00000000-0000-0000-0000-000000000000	22a80d0a-e25b-4248-9184-867e6c9abca6	{"action":"user_signedup","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-18 10:02:49.163342+08	
00000000-0000-0000-0000-000000000000	8c6a779a-edc4-470c-b242-8819b377908b	{"action":"login","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 10:02:49.171128+08	
00000000-0000-0000-0000-000000000000	89c77226-2525-4741-92fc-f84da1b34fdd	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 10:37:54.3826+08	
00000000-0000-0000-0000-000000000000	3bcb9825-b878-4d38-a8cb-6b879afb281b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 10:37:54.384074+08	
00000000-0000-0000-0000-000000000000	bb3c74cf-5f20-49b8-b064-c9e9522f6601	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 10:38:09.577811+08	
00000000-0000-0000-0000-000000000000	f4aebbb6-42ee-4e7e-8e9d-2a86593957a3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 11:36:14.119675+08	
00000000-0000-0000-0000-000000000000	897f8776-8bfd-488d-b4ea-a0c1f50e93d7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 12:10:07.568659+08	
00000000-0000-0000-0000-000000000000	6bf0cde2-7c5c-4710-95db-1b65e9d5b841	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 12:10:40.502972+08	
00000000-0000-0000-0000-000000000000	08b1398e-cc0f-4b17-89f5-dd2a2e158463	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 12:12:52.232139+08	
00000000-0000-0000-0000-000000000000	9025183c-53e5-42e4-9661-812ebb12a443	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 12:22:40.610499+08	
00000000-0000-0000-0000-000000000000	b1237591-448d-45c2-88fc-ad22f5b4f3b5	{"action":"user_signedup","actor_id":"945d7d0f-c366-4fcf-96dd-7206222cb4b5","actor_username":"gucaihua@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-18 14:19:08.836257+08	
00000000-0000-0000-0000-000000000000	de86e15a-37b6-4c6e-9e5c-1f5739f6e092	{"action":"login","actor_id":"945d7d0f-c366-4fcf-96dd-7206222cb4b5","actor_username":"gucaihua@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 14:19:08.844035+08	
00000000-0000-0000-0000-000000000000	80aac6e8-9559-4f50-81e5-a03ee1685c1c	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 14:23:09.789087+08	
00000000-0000-0000-0000-000000000000	d5aedf99-774b-4aab-81a8-2a376209fe1b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 14:23:09.790598+08	
00000000-0000-0000-0000-000000000000	daf84e63-3f7c-4326-9828-8ce0fda6e5e8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 18:44:44.156886+08	
00000000-0000-0000-0000-000000000000	11c5253a-930d-45f4-ad75-cec749f6726e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 18:44:59.365985+08	
00000000-0000-0000-0000-000000000000	79058c2d-cebb-4647-a0ca-46f81832fd22	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 19:27:15.848786+08	
00000000-0000-0000-0000-000000000000	1aa5aa8f-985e-4646-8697-529206c21ccb	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 19:33:24.702224+08	
00000000-0000-0000-0000-000000000000	d4ee9f08-2163-4579-b87d-f1813e7cef38	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-22 10:16:29.035705+08	
00000000-0000-0000-0000-000000000000	c30af4d3-368e-471b-ae2f-daf3ccbdb6b4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-23 09:00:55.592839+08	
00000000-0000-0000-0000-000000000000	d282d449-ecfa-47a5-8dfa-786912ffcc36	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-23 09:00:55.602791+08	
00000000-0000-0000-0000-000000000000	b1d3da3c-4393-46ed-9159-ec41eeca9785	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 14:49:43.079338+08	
00000000-0000-0000-0000-000000000000	8d5ba02f-6fae-4530-8ee3-f6a10572435c	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 17:15:41.07291+08	
00000000-0000-0000-0000-000000000000	c71e6568-0de9-47ce-91c7-9c45ad3d2530	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 17:15:41.075299+08	
00000000-0000-0000-0000-000000000000	e123dc09-a49f-4233-b878-d3d1044ce297	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 17:22:51.248557+08	
00000000-0000-0000-0000-000000000000	4eac595a-9971-448d-a8e1-5fcd2e944157	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 17:38:16.519462+08	
00000000-0000-0000-0000-000000000000	b57751b4-4161-4a6d-bcf8-35da36d7d3d0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 17:57:36.231602+08	
00000000-0000-0000-0000-000000000000	cd92ef64-3742-4091-9c7a-7f34764d5a0a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 18:05:11.489008+08	
00000000-0000-0000-0000-000000000000	7ca7a5b3-755d-4ccd-b975-a34db863d743	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 18:08:56.154577+08	
00000000-0000-0000-0000-000000000000	4fd894ef-8862-4bca-a1c7-6c2ca4eff6a8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 18:12:35.455426+08	
00000000-0000-0000-0000-000000000000	c2feec74-d659-42b3-9526-65c3d3b44fbf	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 19:29:37.053308+08	
00000000-0000-0000-0000-000000000000	b01b78f2-e31b-4281-b373-d437b345bc74	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 19:29:37.056819+08	
00000000-0000-0000-0000-000000000000	6414bab2-9824-4b35-a08e-945c2b223786	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 09:46:21.222112+08	
00000000-0000-0000-0000-000000000000	26450023-4c7f-448a-ad91-175bc27dced4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 09:46:21.233931+08	
00000000-0000-0000-0000-000000000000	5e8b0b32-c550-4754-a6a4-474efa7e29c3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 09:46:27.436449+08	
00000000-0000-0000-0000-000000000000	74cc846a-9e1f-4518-9c4f-d964a5b77563	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 11:45:20.966072+08	
00000000-0000-0000-0000-000000000000	a34febd7-3ac0-4be8-bead-434b9fb8a937	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 11:54:15.503022+08	
00000000-0000-0000-0000-000000000000	97707dca-2ee3-4080-9655-ecaf0b3b477c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 11:54:33.714891+08	
00000000-0000-0000-0000-000000000000	2b806676-40be-45c0-8d59-d9d5166562d3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:06:43.743759+08	
00000000-0000-0000-0000-000000000000	d6c89c29-90e0-45f8-bf0f-b79df5a22fc2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:06:51.769024+08	
00000000-0000-0000-0000-000000000000	0f61f102-9af3-4e9e-bde5-98cfba92bd47	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:07:08.762288+08	
00000000-0000-0000-0000-000000000000	b734ab00-c516-4a0f-9fa2-7ddd4458cc69	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:09:17.559239+08	
00000000-0000-0000-0000-000000000000	d4d1c581-db39-4d45-8283-bd3c79998a4d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:12:57.255674+08	
00000000-0000-0000-0000-000000000000	5785dc6a-98b5-4c8e-bbb4-073d593ad03e	{"action":"user_signedup","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-04 12:13:35.329991+08	
00000000-0000-0000-0000-000000000000	94cca047-f7be-4163-aaed-4d151f2a4f60	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:13:35.341666+08	
00000000-0000-0000-0000-000000000000	d9074dbb-2cac-470b-858d-fc7a469861c8	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:21:05.679904+08	
00000000-0000-0000-0000-000000000000	d0838da0-3e08-45d5-9ac0-910b1bb84885	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:21:15.502178+08	
00000000-0000-0000-0000-000000000000	26ffc197-76c0-4ef4-a3f1-77580bed9b59	{"action":"token_refreshed","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 14:43:46.08851+08	
00000000-0000-0000-0000-000000000000	d4aa1e35-6deb-4ff0-ac30-ed71b1cb367f	{"action":"token_revoked","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 14:43:46.094348+08	
00000000-0000-0000-0000-000000000000	45c346bb-5617-43d0-afaa-1f1477755739	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 14:44:12.016843+08	
00000000-0000-0000-0000-000000000000	87202a5a-5e31-4e65-af07-7a67d242a267	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 14:44:22.26235+08	
00000000-0000-0000-0000-000000000000	34844dfe-0c81-422a-a651-87b1cfd4affb	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 14:44:39.312975+08	
00000000-0000-0000-0000-000000000000	d5bc849b-789c-48df-b1bd-c7c5e5182d15	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 14:44:42.676773+08	
00000000-0000-0000-0000-000000000000	7a0a018a-6f7d-4d1c-b7fd-45384bb16635	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:04:23.842063+08	
00000000-0000-0000-0000-000000000000	c0b9bb2e-20ec-43d7-bda3-cff565036884	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:04:32.495079+08	
00000000-0000-0000-0000-000000000000	ca3db26e-ffe8-4cab-badc-eeb5e7f292e8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:08:04.552944+08	
00000000-0000-0000-0000-000000000000	91359cd1-ebd9-4a43-b513-c9e89f124a78	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:08:11.638006+08	
00000000-0000-0000-0000-000000000000	fe2c324c-c7a2-45aa-89e5-33a0f77fad00	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:09:40.240921+08	
00000000-0000-0000-0000-000000000000	7fec8db3-48d7-4f83-8a1a-60cd1d034a1c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:04.639803+08	
00000000-0000-0000-0000-000000000000	e981e717-49f5-4264-a80f-d707a8f1a8aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:08.409358+08	
00000000-0000-0000-0000-000000000000	a1e49a05-e29c-45a5-aa1e-c0f72c56fd7c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:12.969384+08	
00000000-0000-0000-0000-000000000000	9474db88-4ed6-4911-ab6d-9cee84ef8ea2	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:19.759166+08	
00000000-0000-0000-0000-000000000000	5ff8b59d-61e9-4738-8b1c-d18cd20a1e81	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:25.138891+08	
00000000-0000-0000-0000-000000000000	4f5d7d68-82d1-4c29-b0fb-561a646542de	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:30.219748+08	
00000000-0000-0000-0000-000000000000	663e1e1a-0dfd-410f-96ba-1d4b6ca07666	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:11:25.288423+08	
00000000-0000-0000-0000-000000000000	ce077abc-e2d7-4ba1-bd0d-fadaa65a9707	{"action":"user_signedup","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-04 15:11:40.110326+08	
00000000-0000-0000-0000-000000000000	8867b08f-e331-4028-b813-82e77f16460e	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:11:40.117225+08	
00000000-0000-0000-0000-000000000000	09eb5a2e-321c-43ec-b03e-d307aa283e2c	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:11:49.953548+08	
00000000-0000-0000-0000-000000000000	61f86b7d-161c-433f-86a1-1c41f38d48b8	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:12:01.119461+08	
00000000-0000-0000-0000-000000000000	edc0c46a-9014-44a1-af6f-82648b84a279	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:13:01.514741+08	
00000000-0000-0000-0000-000000000000	cd994c93-bf96-4f79-8685-1ae2252ac4e1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:13:08.51097+08	
00000000-0000-0000-0000-000000000000	a1d3c22f-0a3a-48df-aa03-f9c392de0a85	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:13:12.862557+08	
00000000-0000-0000-0000-000000000000	fb6579e5-d63d-4997-881a-32a0d978ede7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:13:16.309625+08	
00000000-0000-0000-0000-000000000000	03fa63c5-feef-44b5-aa36-e127d992210d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:23:10.651973+08	
00000000-0000-0000-0000-000000000000	468a2bdb-4819-42f3-a78c-fd5a9e3087aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:23:18.005239+08	
00000000-0000-0000-0000-000000000000	3f260bac-7ac6-4f14-a107-8f25f4b8067c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:30:04.157777+08	
00000000-0000-0000-0000-000000000000	9e18d55a-50d3-4a03-b49c-2e37414ecbd2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:30:12.13374+08	
00000000-0000-0000-0000-000000000000	1453a8ff-f923-4a51-9686-4b925ca56049	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:39:48.815374+08	
00000000-0000-0000-0000-000000000000	89cea3c1-cb76-45ec-85a2-717eb725a79e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:01:10.903756+08	
00000000-0000-0000-0000-000000000000	e8c25045-0121-4428-8ce0-7adbe23dd94c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:01:14.40235+08	
00000000-0000-0000-0000-000000000000	865986d0-0a42-49f7-8bc5-b04d6e51108d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:13:30.458242+08	
00000000-0000-0000-0000-000000000000	acd9c1ce-50f4-4b89-a436-d140919ba543	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 17:18:04.033993+08	
00000000-0000-0000-0000-000000000000	3e6e181a-bfdc-4e24-9c7a-2542eead033b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 17:18:04.036059+08	
00000000-0000-0000-0000-000000000000	9399a76f-108a-4fd7-9477-4d626a73bf9d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:18:14.395305+08	
00000000-0000-0000-0000-000000000000	cd52cc67-d0ff-4fcc-a70b-64cc1f3bb767	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:20:04.562411+08	
00000000-0000-0000-0000-000000000000	6a096a98-8b3c-4cf0-a42b-aabc19700d15	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:23:21.94576+08	
00000000-0000-0000-0000-000000000000	7fb585f6-41c7-436b-914b-e3757d434c90	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:23:29.592264+08	
00000000-0000-0000-0000-000000000000	828e95fa-0a0a-47c3-80d0-f38a19323dcf	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:23:33.960707+08	
00000000-0000-0000-0000-000000000000	69d20b91-a367-479b-81db-78ba0783730f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:33:46.37231+08	
00000000-0000-0000-0000-000000000000	89208238-132a-4928-a2ac-970de6f357ee	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:33:50.322258+08	
00000000-0000-0000-0000-000000000000	0e0516df-e1ae-4fb5-ad1d-6f7865908c00	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:41:50.949355+08	
00000000-0000-0000-0000-000000000000	d656d553-23f8-4863-8548-9cf614864b8f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:42:04.102084+08	
00000000-0000-0000-0000-000000000000	65d7314c-3196-47c6-87a3-f177c9a40dfa	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:42:14.299738+08	
00000000-0000-0000-0000-000000000000	fccbdcb4-4f05-42c0-af88-2eaffcb86447	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:42:59.818312+08	
00000000-0000-0000-0000-000000000000	59dda8f6-9d86-4a85-9a6b-adc1dcba6a76	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:22:11.174625+08	
00000000-0000-0000-0000-000000000000	76d83e3f-7d7f-4960-a29f-48fa9bb30ea7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:28:27.615276+08	
00000000-0000-0000-0000-000000000000	7f9ffefb-f95d-47a5-ba73-30bd39b66a75	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:29:17.759631+08	
00000000-0000-0000-0000-000000000000	96f64377-4f89-4cf7-9270-61522925283d	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:29:40.526634+08	
00000000-0000-0000-0000-000000000000	5bc4e265-facd-4454-bf0a-3db82c9879db	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:44:57.941236+08	
00000000-0000-0000-0000-000000000000	50df24a3-6bec-4de2-9c6f-65609f78d447	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:45:25.353967+08	
00000000-0000-0000-0000-000000000000	a30a6747-e674-457e-b3db-3dd06b2b8fbc	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:49:13.739759+08	
00000000-0000-0000-0000-000000000000	204a7560-d6d3-4bed-9fc8-2a59007ac964	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:49:28.797894+08	
00000000-0000-0000-0000-000000000000	fcb31e61-621b-4787-a328-1331a6ae6ccc	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:53:39.974623+08	
00000000-0000-0000-0000-000000000000	64fb0d59-eb89-497c-94bd-96969e32f33f	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:56:42.242056+08	
00000000-0000-0000-0000-000000000000	2d5a1d4c-f3e1-4696-888d-369ce2d5c67b	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:56:46.043117+08	
00000000-0000-0000-0000-000000000000	cc197951-132e-4d51-896b-85f5baad84e6	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:58:52.607581+08	
00000000-0000-0000-0000-000000000000	af3e4766-97b1-44d3-b0a1-09f164b0e671	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:58:55.444731+08	
00000000-0000-0000-0000-000000000000	8c125fa4-e240-40c8-b8c1-7757a75ab632	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 19:02:35.901494+08	
00000000-0000-0000-0000-000000000000	e7a56917-8433-478e-afbb-731efa7187cf	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 19:03:00.844512+08	
00000000-0000-0000-0000-000000000000	b5e08c51-edfd-4b03-b04a-65d1b8cd1021	{"action":"token_refreshed","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-05 08:46:39.159569+08	
00000000-0000-0000-0000-000000000000	0658256a-bdd8-4cb8-93d6-41ae03b9970b	{"action":"token_revoked","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-05 08:46:39.173588+08	
00000000-0000-0000-0000-000000000000	1c0e1d2e-cdf5-4bf6-a656-01436cc1a308	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 08:47:03.070476+08	
00000000-0000-0000-0000-000000000000	9ead3385-71b9-47e3-8a90-b7febf1016c1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:48:21.654131+08	
00000000-0000-0000-0000-000000000000	9637bd47-5667-46db-9dc9-be17ca20c14a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:56:29.205875+08	
00000000-0000-0000-0000-000000000000	8a51469a-0c96-4003-bd2a-1d99eaf24ab3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 08:58:31.556018+08	
00000000-0000-0000-0000-000000000000	3775e4f9-ed4a-4d7a-9d21-f8f42907d010	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:58:40.098091+08	
00000000-0000-0000-0000-000000000000	4bf23780-ce78-4c5b-8c22-06d005dd570c	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:17:43.392746+08	
00000000-0000-0000-0000-000000000000	7418e188-a248-4ea7-8a43-e76ab6abdaa3	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:18:12.055152+08	
00000000-0000-0000-0000-000000000000	141062e8-a146-4fab-8954-c891acbaec2c	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:18:19.508349+08	
00000000-0000-0000-0000-000000000000	708db7a3-3461-4469-9e6a-63de3d5e37c1	{"action":"user_signedup","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:18:34.206945+08	
00000000-0000-0000-0000-000000000000	ea03d702-12a5-4053-a05f-67862aaecfb4	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:18:34.214631+08	
00000000-0000-0000-0000-000000000000	fb59b7c9-fb4a-4b2b-8023-1c7b4777b3b3	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:19:14.915657+08	
00000000-0000-0000-0000-000000000000	74c799dc-a14e-4da3-b886-903b205a4966	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:23:10.574715+08	
00000000-0000-0000-0000-000000000000	ac9df428-df04-4c45-b1d7-a6d119497201	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:23:25.84989+08	
00000000-0000-0000-0000-000000000000	cf9b9359-720d-4928-b6e1-822f3cde3bf7	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:24:47.994578+08	
00000000-0000-0000-0000-000000000000	b665fc17-669c-4c81-89f1-b61354544358	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:25:05.443115+08	
00000000-0000-0000-0000-000000000000	a0528343-f87b-4624-8361-7255de49f028	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:28:44.461241+08	
00000000-0000-0000-0000-000000000000	f98cc16b-0568-41f9-a031-0a9760914838	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:28:56.200546+08	
00000000-0000-0000-0000-000000000000	67da7d7c-bd43-4b44-b84f-e19ffad786e9	{"action":"user_signedup","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:41:30.800371+08	
00000000-0000-0000-0000-000000000000	e2076998-d76d-4be6-ac04-bcad18a3ad18	{"action":"login","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:41:30.816061+08	
00000000-0000-0000-0000-000000000000	d89353a5-686e-4e85-851e-d77c495ad704	{"action":"logout","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:42:21.212117+08	
00000000-0000-0000-0000-000000000000	2ae1c3dc-8aa7-49a2-a760-aed7ea0f5e75	{"action":"user_repeated_signup","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-05 09:49:49.229746+08	
00000000-0000-0000-0000-000000000000	fb2a659a-89e7-4b6d-83df-f4551267a097	{"action":"user_signedup","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:50:00.225268+08	
00000000-0000-0000-0000-000000000000	078251c9-c2fb-49be-a716-4111660d1f44	{"action":"login","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:50:00.229189+08	
00000000-0000-0000-0000-000000000000	73d8da5c-97d1-46ab-8dc8-fa9cff502a54	{"action":"logout","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 10:42:54.590091+08	
00000000-0000-0000-0000-000000000000	9688c4de-2670-4442-82ee-96910bedefe6	{"action":"user_signedup","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 11:51:20.636461+08	
00000000-0000-0000-0000-000000000000	1a1fefcd-0d73-4ade-9104-d0730567a48b	{"action":"login","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:51:20.644287+08	
00000000-0000-0000-0000-000000000000	dbd39a96-7c72-4691-8e67-4be441c79dd6	{"action":"logout","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:54:02.409356+08	
00000000-0000-0000-0000-000000000000	da29e79b-4fbd-4832-82df-d70c240223e1	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:54:12.627339+08	
00000000-0000-0000-0000-000000000000	8301ce97-35ba-4bab-a9c5-de62bb3ea67a	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:54:31.070196+08	
00000000-0000-0000-0000-000000000000	1b1b4c04-1234-43cd-b1b6-a8c57945cd07	{"action":"user_signedup","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 11:54:44.616377+08	
00000000-0000-0000-0000-000000000000	cb4f0ee3-63e4-43db-8f62-0112838ebccf	{"action":"login","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:54:44.619986+08	
00000000-0000-0000-0000-000000000000	fe942fd8-671b-46a5-98e5-a9c1b4fe9058	{"action":"logout","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:55:37.746912+08	
00000000-0000-0000-0000-000000000000	582d9791-efcf-4d74-ab83-dba501dcdab0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 17:59:29.499126+08	
00000000-0000-0000-0000-000000000000	804543b7-c164-458e-b9a7-85896d22fb4f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 18:00:49.827692+08	
00000000-0000-0000-0000-000000000000	4bb4706a-f438-4c99-a30b-63a4517db87a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 10:47:07.821543+08	
00000000-0000-0000-0000-000000000000	8f1d9ca7-49f3-4440-b543-0005ce34350e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-06 11:00:17.159087+08	
00000000-0000-0000-0000-000000000000	8690fb1e-0f09-4a1a-9823-b92f180e27b5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 11:39:11.264835+08	
00000000-0000-0000-0000-000000000000	8db152b3-10ea-452f-8506-9bdce9e36b3d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-06 11:41:39.807873+08	
00000000-0000-0000-0000-000000000000	9e7cdb01-783d-4d6a-97e1-2f3421b5a777	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 12:25:13.897506+08	
00000000-0000-0000-0000-000000000000	2524f377-7624-443c-933f-b7ad592b54bc	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 13:24:48.290649+08	
00000000-0000-0000-0000-000000000000	d639fd8e-e48b-4be8-911a-02e21040f44f	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 13:24:48.292792+08	
00000000-0000-0000-0000-000000000000	182644e4-43c3-440b-a4da-a80ab873420a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 14:42:23.66752+08	
00000000-0000-0000-0000-000000000000	55349d58-3cdf-4936-890f-30d0310b04c1	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 15:44:23.343421+08	
00000000-0000-0000-0000-000000000000	3f85ca63-444b-4b47-835e-cdef7570f6dd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 15:44:23.354053+08	
00000000-0000-0000-0000-000000000000	711ed426-1931-4c40-a2fc-670dbb2e115e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:06:26.932152+08	
00000000-0000-0000-0000-000000000000	63136c77-9f8a-4bb4-a0ae-efcfd9f69f3c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:06:26.938624+08	
00000000-0000-0000-0000-000000000000	80687489-508e-48a2-9894-a177a1838e4d	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:43:03.171702+08	
00000000-0000-0000-0000-000000000000	8f79ffcc-8069-4e5b-bec2-c0f662387303	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:43:03.173349+08	
00000000-0000-0000-0000-000000000000	c9f54bdc-9bfc-4ec2-b6c8-e943720dbeae	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 17:41:38.333431+08	
00000000-0000-0000-0000-000000000000	670ad55c-9d4a-4f2d-996b-ceb1bd4ec7e4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 17:41:38.336468+08	
00000000-0000-0000-0000-000000000000	2fcb127c-58a8-4206-a133-e0924056db29	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 09:20:00.792434+08	
00000000-0000-0000-0000-000000000000	ec4378dc-b4f2-41a3-9431-5e7995bd6fb4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 09:20:00.813784+08	
00000000-0000-0000-0000-000000000000	5f61ae62-ef23-4ba8-a2bb-6e2145758952	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 09:20:05.622574+08	
00000000-0000-0000-0000-000000000000	7225c61f-ff71-4da7-8b71-c4231a69bf77	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 09:51:43.207915+08	
00000000-0000-0000-0000-000000000000	6db2fcf1-c640-4f8f-903a-628fd7ee3c4d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:30:01.198587+08	
00000000-0000-0000-0000-000000000000	069088d1-8825-4f9f-ab7f-61fffe1b7d70	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:44:32.83547+08	
00000000-0000-0000-0000-000000000000	151a03ba-d6f2-4410-9375-60dfb5d88e69	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:45:09.933102+08	
00000000-0000-0000-0000-000000000000	4ef1166a-04ba-4766-b7bf-0360b9d18e91	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:48:36.866451+08	
00000000-0000-0000-0000-000000000000	e64ae0ca-c720-4ab6-9bac-f8574d22c89e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:49:10.386555+08	
00000000-0000-0000-0000-000000000000	307190be-e49e-4bc6-bee0-55ba5a999fd3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:51.187557+08	
00000000-0000-0000-0000-000000000000	d57cc143-db8d-4483-a859-1722273250f4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:54.508578+08	
00000000-0000-0000-0000-000000000000	911faea7-6847-468c-8791-6029bda5ffd4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:57.886636+08	
00000000-0000-0000-0000-000000000000	30ce3190-f707-4b27-8d30-ce4b1326ba63	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:55:16.184032+08	
00000000-0000-0000-0000-000000000000	9cdb8ba8-1cbd-45a1-8889-86224d5f64e5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:07:32.143979+08	
00000000-0000-0000-0000-000000000000	d70f9bb0-0151-4941-b60d-2795a1119852	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:08:26.806144+08	
00000000-0000-0000-0000-000000000000	92914286-2449-4b72-a1f3-6edcd3e6c440	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:08:58.069174+08	
00000000-0000-0000-0000-000000000000	6a28d8a0-6a7f-4dc9-ad55-df14390eefc0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:19:11.127541+08	
00000000-0000-0000-0000-000000000000	260e5450-1305-4b49-8040-9f62b5ef401a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:19:56.042437+08	
00000000-0000-0000-0000-000000000000	50b97420-018d-42c9-84ce-e3604facaaff	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:31:28.324212+08	
00000000-0000-0000-0000-000000000000	48f72d8b-8ea2-4527-8389-2924a8463774	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:31:41.394844+08	
00000000-0000-0000-0000-000000000000	db19f462-964f-48cf-8597-140e0af9f29f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:35:39.783133+08	
00000000-0000-0000-0000-000000000000	c05481fd-980e-4d67-8e9f-bd16a18c692a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:35:59.853542+08	
00000000-0000-0000-0000-000000000000	c7eb73fe-3dbb-41ed-b079-ae15034cf2b1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:50:51.813734+08	
00000000-0000-0000-0000-000000000000	c10cbcb5-d5e7-4a63-9401-2eeaa189a42e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 12:50:37.074227+08	
00000000-0000-0000-0000-000000000000	04b89c3a-36d2-46b2-9f86-873a599f3858	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 12:50:37.077076+08	
00000000-0000-0000-0000-000000000000	75dc75f1-15c5-47e1-b9dd-0eeda29ffedf	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 14:18:49.896556+08	
00000000-0000-0000-0000-000000000000	08631add-6ee2-46a2-bc70-a4e4e69a1dd9	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 14:18:49.898523+08	
00000000-0000-0000-0000-000000000000	f9d21068-5749-4347-a08b-627062f81e7d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 14:18:52.904353+08	
00000000-0000-0000-0000-000000000000	b5c16ff2-4824-4ca8-a7c1-6372d67a89c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 18:21:05.96866+08	
00000000-0000-0000-0000-000000000000	d4e0996c-aecd-4472-8f6d-abb153c5f483	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 18:24:44.351177+08	
00000000-0000-0000-0000-000000000000	4bbc3489-57c7-49d4-8c42-8cf4017be3b8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 18:43:54.327011+08	
00000000-0000-0000-0000-000000000000	e6448915-90d0-44e2-ba9c-c0f0df000ad0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 18:48:22.877722+08	
00000000-0000-0000-0000-000000000000	503e5d2f-d6fc-4ea6-8216-b41d1bdb77ae	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:50:18.33889+08	
00000000-0000-0000-0000-000000000000	683dd07e-6452-4377-896f-743650b0aa8c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:51:14.603381+08	
00000000-0000-0000-0000-000000000000	602d533d-0cbf-4857-aa59-109b7d027c95	{"action":"user_repeated_signup","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 09:51:34.666915+08	
00000000-0000-0000-0000-000000000000	6036e068-ec9e-4ef8-8fed-2d60b8d8ed50	{"action":"user_signedup","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 09:51:43.029234+08	
00000000-0000-0000-0000-000000000000	c05a5f3e-664d-46d2-99b4-b9d2529c6547	{"action":"login","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:51:43.037641+08	
00000000-0000-0000-0000-000000000000	5f9d6078-9b0e-4ac4-a139-c6c58863a16c	{"action":"logout","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:53:13.007477+08	
00000000-0000-0000-0000-000000000000	6d77ef97-e514-494f-ade1-569a179a44ba	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:53:29.02809+08	
00000000-0000-0000-0000-000000000000	0178370b-8140-4507-b79b-0500048ae7c0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:54:05.827142+08	
00000000-0000-0000-0000-000000000000	dc09ac63-f26a-48ee-9a2f-a061f627aa08	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:54:13.144906+08	
00000000-0000-0000-0000-000000000000	1a663889-98e7-49ee-a2e2-9da165166efe	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:54:41.504113+08	
00000000-0000-0000-0000-000000000000	a770f0dc-9a85-4436-baab-4ad525c1169c	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:54:58.913962+08	
00000000-0000-0000-0000-000000000000	8469dff9-cad9-431f-8568-8b4be957bac7	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:55:51.007818+08	
00000000-0000-0000-0000-000000000000	7415bbde-f034-47e2-b885-0b282603b780	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:55:54.16148+08	
00000000-0000-0000-0000-000000000000	931d208c-b1d3-4170-a20a-952542867d6f	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:56:00.811572+08	
00000000-0000-0000-0000-000000000000	e62dd2a6-dc93-4b6b-8c5b-5dc6301930ee	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:08:03.499529+08	
00000000-0000-0000-0000-000000000000	85253a04-eda8-4213-98ec-26ab3d37eac4	{"action":"user_signedup","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 10:12:41.906181+08	
00000000-0000-0000-0000-000000000000	c58318c8-b5ec-4208-a0f5-c936f79e70e5	{"action":"login","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:12:41.910992+08	
00000000-0000-0000-0000-000000000000	1a75d55b-bc55-474e-bb27-632cdc0b0002	{"action":"logout","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:14:11.054265+08	
00000000-0000-0000-0000-000000000000	69136858-f682-484c-83f1-a3d8b29e2ca5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:49:35.00627+08	
00000000-0000-0000-0000-000000000000	46998323-af07-44dc-be29-df926aef9fcd	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:50:06.901304+08	
00000000-0000-0000-0000-000000000000	1440b088-ded8-4a57-be8f-42da87431b7a	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:50:14.103726+08	
00000000-0000-0000-0000-000000000000	d9de552c-0328-44e4-8399-6a138ec21d02	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:50:49.485694+08	
00000000-0000-0000-0000-000000000000	01a6ad62-abbc-4f6d-8c95-6f23454ae5d0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 11:11:04.880103+08	
00000000-0000-0000-0000-000000000000	a3345a08-7bc2-48a2-9033-72e4e188454d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 11:11:32.935651+08	
00000000-0000-0000-0000-000000000000	57246082-9ff7-40fb-bbf4-19376ec06309	{"action":"user_repeated_signup","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 11:12:55.37516+08	
00000000-0000-0000-0000-000000000000	04e6826c-423f-46db-b00f-6b63328becf4	{"action":"user_signedup","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 11:13:01.292319+08	
00000000-0000-0000-0000-000000000000	46c8bb09-11b4-4cc1-9bf8-431925162624	{"action":"login","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 11:13:01.299322+08	
00000000-0000-0000-0000-000000000000	9e5543e0-deb0-4e3d-9ab2-505019aafa20	{"action":"logout","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 11:16:14.315753+08	
00000000-0000-0000-0000-000000000000	0215a425-4016-4f1e-89a8-8959e1bbd3a0	{"action":"user_signedup","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 12:02:10.11049+08	
00000000-0000-0000-0000-000000000000	353d59cb-23ff-485f-9ff2-85f1037a8aa4	{"action":"login","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 12:02:10.116869+08	
00000000-0000-0000-0000-000000000000	09a9cba1-28d9-4f54-bcf3-15a7062a362b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:21:23.395006+08	
00000000-0000-0000-0000-000000000000	3b80082f-83b2-475d-9092-eb39602d5cb0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 14:27:50.128981+08	
00000000-0000-0000-0000-000000000000	4eef6389-7ad7-4807-947b-ff4c2e6d6130	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:44:40.884374+08	
00000000-0000-0000-0000-000000000000	d20ba146-91e6-4a96-8822-99716b0fcb60	{"action":"token_refreshed","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 15:06:16.80192+08	
00000000-0000-0000-0000-000000000000	38dda6e5-61a3-4f3b-82e7-596f2975ed6c	{"action":"token_revoked","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 15:06:16.807688+08	
00000000-0000-0000-0000-000000000000	56c20533-a880-4620-be06-396e2ec5878b	{"action":"logout","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 15:06:23.018709+08	
00000000-0000-0000-0000-000000000000	5dfc4e17-b7da-4a72-8a37-d2247d3a39c9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 15:30:09.680079+08	
00000000-0000-0000-0000-000000000000	b6501258-a3a7-44e4-91f5-31788a3a2b1a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 16:08:25.891758+08	
00000000-0000-0000-0000-000000000000	472d1a39-bcbe-4cab-91aa-0f9943f7a009	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 16:51:26.586769+08	
00000000-0000-0000-0000-000000000000	4ec19266-1f7f-46bb-b42e-f6ff0d189be1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:11:09.820094+08	
00000000-0000-0000-0000-000000000000	d557892d-cd3c-47a5-93b6-32d9e572e9da	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:19:03.129276+08	
00000000-0000-0000-0000-000000000000	bcffee87-7d01-401b-8114-6dad008b519a	{"action":"user_signedup","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 17:19:50.298601+08	
00000000-0000-0000-0000-000000000000	d1841081-e6f2-4858-8e8e-9b43cb0d95a5	{"action":"login","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:19:50.303633+08	
00000000-0000-0000-0000-000000000000	9330066f-c837-407e-bf01-55db1803a52a	{"action":"logout","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 17:22:04.673587+08	
00000000-0000-0000-0000-000000000000	639a0c4d-1960-4991-b720-31a680fbd51c	{"action":"user_signedup","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 17:22:14.941993+08	
00000000-0000-0000-0000-000000000000	bc859afb-b4c6-4977-b643-621c8461c434	{"action":"login","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:22:14.948666+08	
00000000-0000-0000-0000-000000000000	1d9a06ed-0c10-46b5-8733-5e16d8372ca1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:27:01.746121+08	
00000000-0000-0000-0000-000000000000	ab84df9c-e333-4626-9239-af3bb5b2753d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 17:27:22.23952+08	
00000000-0000-0000-0000-000000000000	87837349-4310-421b-980e-5b5938162642	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:28:30.277893+08	
00000000-0000-0000-0000-000000000000	5abf8004-9aae-447d-ab4c-66458b1c08de	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:33:09.757726+08	
00000000-0000-0000-0000-000000000000	8ebe180a-c4a7-4cf5-bc2d-41dc0d083e04	{"action":"token_refreshed","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 17:33:10.501283+08	
00000000-0000-0000-0000-000000000000	f0030959-0504-4305-acb4-16b97b340d05	{"action":"token_revoked","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 17:33:10.502617+08	
00000000-0000-0000-0000-000000000000	b8645b5e-3f2b-4763-9521-bf79e7ca718d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:42:40.107037+08	
00000000-0000-0000-0000-000000000000	ce38d79f-6705-4fee-9cf8-8257a8eae7b7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:42:45.728474+08	
00000000-0000-0000-0000-000000000000	fe413b95-dd42-41be-a0cd-9a57a34f53f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:43:00.883253+08	
00000000-0000-0000-0000-000000000000	d40ccee9-3833-4ba9-bdb3-20863551cda5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:43:27.906165+08	
00000000-0000-0000-0000-000000000000	d93f627c-7e09-408b-ae06-dd341c1ca718	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:44:51.968344+08	
00000000-0000-0000-0000-000000000000	16929353-b21e-4f40-8bd6-5a469a1f758e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:46:16.86621+08	
00000000-0000-0000-0000-000000000000	9103c9bd-e5d2-495f-ba97-865fbec3d1a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:59:35.848856+08	
00000000-0000-0000-0000-000000000000	5ccb5475-12c9-48b7-bff3-6b8b6dc81c65	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:13:13.76071+08	
00000000-0000-0000-0000-000000000000	cfc52232-9c88-42f3-aa92-7e2adc821e58	{"action":"user_signedup","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 18:13:54.9015+08	
00000000-0000-0000-0000-000000000000	355bb669-8a9d-483f-9ee3-99aac9738103	{"action":"login","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:13:54.91018+08	
00000000-0000-0000-0000-000000000000	04e7a3c5-9d70-46e3-8640-dfdcaf1f0f13	{"action":"logout","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:24:35.265675+08	
00000000-0000-0000-0000-000000000000	28531962-4215-4c79-9eb9-f09e2ef19aad	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:30:55.530908+08	
00000000-0000-0000-0000-000000000000	8d07cde6-4269-444a-81be-0a57c334adad	{"action":"user_signedup","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 18:32:08.062629+08	
00000000-0000-0000-0000-000000000000	a8877533-6ef2-4081-a21f-fac9a68ce332	{"action":"login","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:32:08.067428+08	
00000000-0000-0000-0000-000000000000	4c9e4dae-7f0c-4959-b8cc-198dd9020387	{"action":"logout","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:35:35.257176+08	
00000000-0000-0000-0000-000000000000	92141c94-0fe7-4b7e-b0b7-78ebcd250aea	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:35:54.60147+08	
00000000-0000-0000-0000-000000000000	7e5e85f0-fc74-4595-b1f5-96e1073d406e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:14.133583+08	
00000000-0000-0000-0000-000000000000	b0b6c75e-0ea3-4423-83ec-7d3575923bf3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:19.29702+08	
00000000-0000-0000-0000-000000000000	f8cf36f9-f75b-48e7-bb56-461be8496f55	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:28.094405+08	
00000000-0000-0000-0000-000000000000	ceb40cda-d0ff-44a0-94f9-b228d8ea3990	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:39.470156+08	
00000000-0000-0000-0000-000000000000	387e752a-2373-4fc3-a0cc-5c2cf265e2e4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:38:14.741528+08	
00000000-0000-0000-0000-000000000000	008b5af3-26c1-4428-bd39-7d7db486acdf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:38:20.642426+08	
00000000-0000-0000-0000-000000000000	c4488f61-1836-4abd-b331-1cae43bdc031	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:43:33.118609+08	
00000000-0000-0000-0000-000000000000	d0335db8-05e9-40dd-90c9-1766ed077ef3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:53:58.43847+08	
00000000-0000-0000-0000-000000000000	718f86cc-91b3-416b-8fcd-383a81175028	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:54:38.220433+08	
00000000-0000-0000-0000-000000000000	59e5a843-b5b9-4e14-92df-5072754bd267	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:14:23.302188+08	
00000000-0000-0000-0000-000000000000	ca5e5edc-3bb7-4a6e-a348-991a845cbce0	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 19:30:32.385372+08	
00000000-0000-0000-0000-000000000000	d86a8637-9727-4abe-9077-d68fe7c6d66b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:32:42.642014+08	
00000000-0000-0000-0000-000000000000	fcbc3a38-b1cf-4a81-a071-10f9c5247ee9	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 19:33:22.51274+08	
00000000-0000-0000-0000-000000000000	d7095850-5297-4fcf-b9ff-6f6300d5dfa9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:38:38.289726+08	
00000000-0000-0000-0000-000000000000	3f14538f-e260-4d47-91b3-872b369e0602	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 08:38:18.988959+08	
00000000-0000-0000-0000-000000000000	44abbfb4-9fcf-4a5d-80d7-2a70f7c6b7ef	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 08:38:19.005433+08	
00000000-0000-0000-0000-000000000000	1a2ecfe7-50d2-4e4c-862b-cc601db99eb1	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:38:24.894152+08	
00000000-0000-0000-0000-000000000000	4f0f957b-169f-418a-98ec-adac2df171a9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:38:38.66152+08	
00000000-0000-0000-0000-000000000000	23dc2de7-f5ca-4beb-befa-3b4bd55ff96e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:39:23.159554+08	
00000000-0000-0000-0000-000000000000	150f0789-d6f7-4ae3-8e60-f7077df6ac95	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:39:42.023987+08	
00000000-0000-0000-0000-000000000000	104d25bf-8fd4-44fe-967a-fa3a3f910021	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:42:05.285092+08	
00000000-0000-0000-0000-000000000000	e6fabf4f-d2e7-4b18-84f6-337b377c4d29	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:52:44.28446+08	
00000000-0000-0000-0000-000000000000	8fd0818e-0630-4a1b-9dab-d0750ecfcae2	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:53:04.493563+08	
00000000-0000-0000-0000-000000000000	58f5209d-d113-4909-9fb2-b2c8397235a0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:53:11.693173+08	
00000000-0000-0000-0000-000000000000	20800f05-8651-4c49-b9f7-3c698b8c7eb8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:17:58.167607+08	
00000000-0000-0000-0000-000000000000	a5eb806b-fb70-4993-96bf-548ea52c7f57	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:18:15.939856+08	
00000000-0000-0000-0000-000000000000	c7746037-457b-4f82-92a5-9a3850d2018d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:19:22.076408+08	
00000000-0000-0000-0000-000000000000	a0865e11-6951-4514-9e90-6ed5eca489c5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:19:26.046839+08	
00000000-0000-0000-0000-000000000000	ccee9449-a30a-4f84-9818-437556303dbe	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:20:41.589453+08	
00000000-0000-0000-0000-000000000000	948a260b-811e-4c17-ad5a-eb4af8252e9b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:25:13.90997+08	
00000000-0000-0000-0000-000000000000	7a3fb55f-9fcc-4c95-90e0-1bccbbcbe1f3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:49:56.279857+08	
00000000-0000-0000-0000-000000000000	0837f67e-a11a-4697-afe3-503d3c8032ab	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:53:24.902373+08	
00000000-0000-0000-0000-000000000000	af2b9326-946b-4f17-a964-8fac85be573f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:57:18.015231+08	
00000000-0000-0000-0000-000000000000	25b0f8da-e47c-46f7-8955-d186694d7d8b	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:23:56.55685+08	
00000000-0000-0000-0000-000000000000	5211151d-60c9-459d-8f1c-970ad341d3d8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:24:18.212627+08	
00000000-0000-0000-0000-000000000000	8cdadf92-2307-47f5-83ef-e6c7ee79af16	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:24:38.752325+08	
00000000-0000-0000-0000-000000000000	e2b1e23a-4c8b-41db-8839-46c08ec36677	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:25:57.075744+08	
00000000-0000-0000-0000-000000000000	3aa2b084-325c-47ec-8d14-eab321a5d4ec	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:26:09.892916+08	
00000000-0000-0000-0000-000000000000	2bca555d-5077-4fa8-aef9-775383cefcbf	{"action":"login","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:26:20.242833+08	
00000000-0000-0000-0000-000000000000	7540cb78-b039-4c49-9e73-8da786142a0b	{"action":"token_refreshed","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 11:24:23.394045+08	
00000000-0000-0000-0000-000000000000	a03d9549-bf4e-4a6e-82c5-3ca429341ba3	{"action":"token_revoked","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 11:24:23.397481+08	
00000000-0000-0000-0000-000000000000	6dca5458-13d7-4181-8cc1-2879b3a9c898	{"action":"logout","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:26:15.217638+08	
00000000-0000-0000-0000-000000000000	074e6a96-2e50-430c-bfd5-831d799db813	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:26:33.395553+08	
00000000-0000-0000-0000-000000000000	7875eea3-2402-4334-9c95-a0e5c22a4550	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:41:31.594651+08	
00000000-0000-0000-0000-000000000000	be51630c-733d-420d-84a6-9b0b1df78811	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:50:47.602379+08	
00000000-0000-0000-0000-000000000000	c9413cf3-7832-41df-a9d6-5acab5091a0e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:50:53.36935+08	
00000000-0000-0000-0000-000000000000	94b5d727-ae79-484c-b56d-f01343b6ad5e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:54:32.422446+08	
00000000-0000-0000-0000-000000000000	c15783e4-0156-45e6-9d8e-ade16564fde4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:56:27.535471+08	
00000000-0000-0000-0000-000000000000	407fa5fe-7234-4c95-9795-624c3ecbe6d9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:17.341555+08	
00000000-0000-0000-0000-000000000000	5b257f9a-89a7-40dc-a068-5ec474fdf965	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:24.503303+08	
00000000-0000-0000-0000-000000000000	aebcd0a1-5153-4030-bb4a-eaea48d3be9d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:29.927432+08	
00000000-0000-0000-0000-000000000000	58c8b0c5-befb-4199-bbe3-451e5317dfed	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 14:12:05.391519+08	
00000000-0000-0000-0000-000000000000	59d34171-03c6-4b76-802b-1d1feb34658c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 14:12:05.397452+08	
00000000-0000-0000-0000-000000000000	d2fa0d7e-3dca-49d4-ad2a-e56356830620	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:12:12.958052+08	
00000000-0000-0000-0000-000000000000	f8550dc3-41e5-455f-a941-d7f8f1a89cda	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:12:20.480932+08	
00000000-0000-0000-0000-000000000000	bce9db95-cd8d-41ff-9970-c354672a0019	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:23:51.00183+08	
00000000-0000-0000-0000-000000000000	c6ce3a17-e441-4654-b307-c3f687197185	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:23:58.331706+08	
00000000-0000-0000-0000-000000000000	b6074ee7-45f5-4d9d-8b4a-d0c5420396ed	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:47:31.280855+08	
00000000-0000-0000-0000-000000000000	a629c13a-520e-47b2-8361-8acaf001f411	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:47:50.270062+08	
00000000-0000-0000-0000-000000000000	e754f435-9c0b-454f-8385-bb6ebef1b094	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:11:44.299253+08	
00000000-0000-0000-0000-000000000000	9a5a3f24-c08a-4559-a481-63d064313afb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:11:52.827373+08	
00000000-0000-0000-0000-000000000000	8d4dbbdd-7b7a-4d5f-be6f-3a0c2205a692	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:21:20.947652+08	
00000000-0000-0000-0000-000000000000	820611f5-1384-4de9-b626-8733ae071bfd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:21:43.547402+08	
00000000-0000-0000-0000-000000000000	61444913-e2a2-4a25-8882-81bc68b6040a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:23:02.49554+08	
00000000-0000-0000-0000-000000000000	90b1ec52-a26c-4078-b42b-43796db60da3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:36:28.187568+08	
00000000-0000-0000-0000-000000000000	d7180065-bf98-42c0-83a4-64093401d259	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:37:44.908865+08	
00000000-0000-0000-0000-000000000000	596ef523-ae4f-44f3-ac94-d944170a7850	{"action":"user_repeated_signup","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-11 15:38:11.413701+08	
00000000-0000-0000-0000-000000000000	a715aa66-756e-4785-b4ea-ffa41e1fedf5	{"action":"user_signedup","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-11 15:38:20.297032+08	
00000000-0000-0000-0000-000000000000	7f9c8beb-14d4-4dc7-84e8-eb5634b3a1b9	{"action":"login","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:38:20.306947+08	
00000000-0000-0000-0000-000000000000	4f5dd24a-1724-45b4-8745-2cb79a0333ac	{"action":"logout","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:51:31.831992+08	
00000000-0000-0000-0000-000000000000	9e459795-7553-490a-acd4-26423651851e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 16:29:02.77007+08	
00000000-0000-0000-0000-000000000000	6b4c80a4-b54e-40a5-8baa-6cefcfda8f08	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 16:38:57.585513+08	
00000000-0000-0000-0000-000000000000	6f4fb519-c31c-429b-b293-08c73861337f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 16:39:35.715747+08	
00000000-0000-0000-0000-000000000000	af19a866-03d2-4552-bb65-97baf61abca8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 17:49:52.090528+08	
00000000-0000-0000-0000-000000000000	688fbfd3-9f81-497f-b81f-85161cf22199	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 17:49:52.094551+08	
00000000-0000-0000-0000-000000000000	5f4b39d0-a0ab-4bb7-a9fb-6223848a2a3a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:49:57.52787+08	
00000000-0000-0000-0000-000000000000	626bb1a7-2234-450f-8bb0-c2a7ea3e2980	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:41:01.35338+08	
00000000-0000-0000-0000-000000000000	4f46a99b-89ea-4375-a467-b0a5094231e6	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 18:41:23.908359+08	
00000000-0000-0000-0000-000000000000	1539c8a1-805f-4c60-8343-937acafd395f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:48:59.07687+08	
00000000-0000-0000-0000-000000000000	ced65897-6a4f-4215-be6d-772103a6d044	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 18:50:30.173975+08	
00000000-0000-0000-0000-000000000000	e9320d53-0212-401b-a891-c1697063a5df	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:50:43.471118+08	
00000000-0000-0000-0000-000000000000	9147e040-eee8-4ea0-b95e-fcc6d518fa1d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 19:21:23.770136+08	
00000000-0000-0000-0000-000000000000	64d7bd58-2710-4568-9029-80f11de5b9bf	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 19:22:17.257596+08	
00000000-0000-0000-0000-000000000000	20f8546d-c819-4f57-9b63-0e414796203d	{"action":"user_signedup","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-11 19:22:45.938047+08	
00000000-0000-0000-0000-000000000000	61ffa0f2-48fb-43b9-b717-7402ddb68b02	{"action":"login","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 19:22:45.947769+08	
00000000-0000-0000-0000-000000000000	943b73c3-1633-4901-8569-d37f5c76054d	{"action":"logout","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 19:27:22.289902+08	
00000000-0000-0000-0000-000000000000	ce494049-957d-4b43-a4b5-e13d7b046dfd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 21:13:54.653494+08	
00000000-0000-0000-0000-000000000000	5b6fb1e4-0b6a-4a83-b66f-22f1eed11985	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 21:18:48.692253+08	
00000000-0000-0000-0000-000000000000	fa536dc2-6046-48dd-ada0-a3050c2bc40d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 09:59:58.905868+08	
00000000-0000-0000-0000-000000000000	088c8840-b43d-4346-be85-0dd6e8562f4f	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-12 11:56:04.825798+08	
00000000-0000-0000-0000-000000000000	6d28f9b2-9ddd-465c-869f-d0390b6ba30a	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-12 11:56:04.831675+08	
00000000-0000-0000-0000-000000000000	b83650db-dd60-4597-94ec-ecdfba53a1a3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 11:58:27.355958+08	
00000000-0000-0000-0000-000000000000	3b02e26f-c582-45e6-b24f-18a1047ef6a7	{"action":"user_signedup","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-12 15:35:24.022491+08	
00000000-0000-0000-0000-000000000000	db493c32-f0c3-4d06-ab85-6658933f57c6	{"action":"login","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 15:35:24.035854+08	
00000000-0000-0000-0000-000000000000	15c1f540-95a0-4877-ab2a-25fa2d5d4615	{"action":"logout","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 15:40:10.582439+08	
00000000-0000-0000-0000-000000000000	d2887a46-efd3-4783-baf0-5958a2e936e0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 18:01:30.188167+08	
00000000-0000-0000-0000-000000000000	99434dd7-e510-4da2-8b62-3f7c61cce0ad	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 18:02:54.322288+08	
00000000-0000-0000-0000-000000000000	f619b3b5-8592-4a59-8cf0-b74e883a530c	{"action":"user_signedup","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-14 17:03:19.431891+08	
00000000-0000-0000-0000-000000000000	86fd4d0d-379b-4320-9f3f-74f5a727203f	{"action":"login","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 17:03:19.45095+08	
00000000-0000-0000-0000-000000000000	409679f3-c9fa-4739-a860-9d39adf5fd58	{"action":"token_refreshed","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:02:17.842266+08	
00000000-0000-0000-0000-000000000000	95548122-b73b-45be-b694-85974b6db13c	{"action":"token_revoked","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:02:17.847308+08	
00000000-0000-0000-0000-000000000000	cd8fecfe-7666-4381-a79a-5731a29e70a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:05:18.242966+08	
00000000-0000-0000-0000-000000000000	6beb6b63-4ec1-427d-beb2-5cc2d588165d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:38:22.936666+08	
00000000-0000-0000-0000-000000000000	ec7b6817-90d3-4be9-8dea-342cf5b77e67	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:40:41.760228+08	
00000000-0000-0000-0000-000000000000	5fd90f4f-5faa-4a9f-b43c-6b904f4ac9a4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 18:40:58.562433+08	
00000000-0000-0000-0000-000000000000	b09b3ef2-819f-4cc6-8c68-98d103aa872c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:42:47.371286+08	
00000000-0000-0000-0000-000000000000	83f4845b-9b0c-488d-8b10-ec2dbe122e44	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 18:49:42.988106+08	
00000000-0000-0000-0000-000000000000	94f80f22-7cbc-43db-b499-4e6be8583432	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:22:45.623285+08	
00000000-0000-0000-0000-000000000000	6c65640c-1dac-4097-b52f-3210e5ea360b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:23:28.679689+08	
00000000-0000-0000-0000-000000000000	e2a2b570-b179-431f-8bde-6bde1cb5ca48	{"action":"user_signedup","actor_id":"a31228a8-6005-4e39-99ac-82ee46e09bd3","actor_username":"1234567@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-19 15:25:44.403207+08	
00000000-0000-0000-0000-000000000000	17ce3417-4fa7-459d-935b-6b4a607f7cca	{"action":"login","actor_id":"a31228a8-6005-4e39-99ac-82ee46e09bd3","actor_username":"1234567@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:25:44.413236+08	
00000000-0000-0000-0000-000000000000	17686703-f428-49bd-b2c3-82c179f30f78	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 15:37:11.112776+08	
00000000-0000-0000-0000-000000000000	ee351dc8-d721-4eee-876d-ac937a64ee6b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:13:18.198719+08	
00000000-0000-0000-0000-000000000000	30007768-471a-41c9-9e7f-d5c1b828706c	{"action":"user_signedup","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-19 16:39:31.378958+08	
00000000-0000-0000-0000-000000000000	60b7dbfb-dd86-4d0d-b72d-f2541f7b8b65	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:39:31.384491+08	
00000000-0000-0000-0000-000000000000	7e68c696-75c1-4afa-8add-bff76c091549	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 16:43:57.085909+08	
00000000-0000-0000-0000-000000000000	1f79d951-b626-403a-b559-0b416d999893	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:44:20.878745+08	
00000000-0000-0000-0000-000000000000	6383a142-3fcf-4cd8-8b76-c01deb54dfe2	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:47:25.480992+08	
00000000-0000-0000-0000-000000000000	227cbc63-d99b-48c6-85ca-52ef4caae9f5	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:50:19.802854+08	
00000000-0000-0000-0000-000000000000	b92783ed-f1f5-4254-bcb3-02e28230635c	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 16:57:16.229447+08	
00000000-0000-0000-0000-000000000000	563687a4-9b13-4cc5-b19c-4d5aa59b27af	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:57:19.617685+08	
00000000-0000-0000-0000-000000000000	e1f7e05f-0038-4dad-b5c1-4fef7f3ffe7e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 17:00:58.586907+08	
00000000-0000-0000-0000-000000000000	4b15dbff-6359-4747-b80e-3730c26943ac	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-19 18:10:46.13723+08	
00000000-0000-0000-0000-000000000000	288ce558-bc19-4126-a37b-381f5cea0413	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-19 18:10:46.140583+08	
00000000-0000-0000-0000-000000000000	f96b9a72-582f-46ba-aeda-b4713857a239	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 18:54:15.867387+08	
00000000-0000-0000-0000-000000000000	3454062e-c208-4d84-8551-b260fa870313	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 12:15:54.495956+08	
00000000-0000-0000-0000-000000000000	30c34088-a583-4fa2-ace5-2935790251bb	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 12:17:06.501985+08	
00000000-0000-0000-0000-000000000000	ba65956b-7709-49ba-8ed0-1491b049f601	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 14:39:30.938792+08	
00000000-0000-0000-0000-000000000000	7da9da37-22aa-428d-bb7b-655cf2591f7e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 11:47:50.632706+08	
00000000-0000-0000-0000-000000000000	3291176c-b2c3-4ef2-8d5a-7438fdaed122	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 12:09:03.507424+08	
00000000-0000-0000-0000-000000000000	e7aed7e5-e5bd-40d0-bd4c-b1abd4186975	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 12:09:12.813226+08	
00000000-0000-0000-0000-000000000000	20184e45-759c-4d88-bb2d-bd6fc07f2ce6	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-25 18:01:07.017451+08	
00000000-0000-0000-0000-000000000000	62d490f3-5816-47ed-9b56-49d6f32693a0	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-25 18:01:07.026476+08	
00000000-0000-0000-0000-000000000000	424dcd83-19dc-4435-809e-e0898088cd49	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:01:13.291824+08	
00000000-0000-0000-0000-000000000000	1e647128-9193-40fb-8ba3-452a2b028d61	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:01:18.324203+08	
00000000-0000-0000-0000-000000000000	526d7e73-3599-489b-83fb-3b427991e4a8	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:01:40.484529+08	
00000000-0000-0000-0000-000000000000	3da9eb90-c264-44b2-8ae0-5b1fd6a9d0e5	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:01:55.123699+08	
00000000-0000-0000-0000-000000000000	493d2966-81a4-4962-9909-c46d32f4e8a7	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:01:57.885635+08	
00000000-0000-0000-0000-000000000000	239878f2-4a86-4c3c-86b5-09fd56ccff20	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:02:19.105135+08	
00000000-0000-0000-0000-000000000000	6d6dca1e-2972-4a86-9af1-1fd5db0006bb	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:03:33.983564+08	
00000000-0000-0000-0000-000000000000	0fa1e271-b581-4474-873d-8b2e3deb1c68	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:03:35.752562+08	
00000000-0000-0000-0000-000000000000	8f301f86-b482-4147-aeed-75bc176ec87c	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:03:41.22784+08	
00000000-0000-0000-0000-000000000000	cb2e6df1-079c-45b0-bd2a-caab63db2317	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:04:18.133827+08	
00000000-0000-0000-0000-000000000000	3566911b-2d6c-4a8e-8b35-62bd2361bdd8	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:05:46.969803+08	
00000000-0000-0000-0000-000000000000	70011800-967a-453a-bcb1-889b9d0d8b96	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:06:02.672815+08	
00000000-0000-0000-0000-000000000000	00c2f3ff-0509-4696-832c-cd254059216d	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:06:18.799318+08	
00000000-0000-0000-0000-000000000000	0a8a5133-3091-4431-9b7d-66072f3644ca	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:07:58.137098+08	
00000000-0000-0000-0000-000000000000	55ba6a01-3de7-4929-aec7-b97c815fee09	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:13:36.476015+08	
00000000-0000-0000-0000-000000000000	017ecd05-bbae-4fe1-a7bb-09cb6363055a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:13:54.955039+08	
00000000-0000-0000-0000-000000000000	0ef7ee34-0ea8-439d-ad5c-a27f3479a108	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:23:41.937666+08	
00000000-0000-0000-0000-000000000000	176443fb-dba9-49fc-a703-bd510fe8fb68	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 18:25:15.275439+08	
00000000-0000-0000-0000-000000000000	7887e9c5-fa87-4e98-a813-d6e1f6369d4e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 19:01:08.332394+08	
00000000-0000-0000-0000-000000000000	f45a95a1-b8e9-4edd-a144-8701dd64c749	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 19:01:55.984028+08	
00000000-0000-0000-0000-000000000000	5e215c00-0d4c-405c-b865-0c6b46f5dde5	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-25 19:05:10.494318+08	
00000000-0000-0000-0000-000000000000	c889b9f7-3641-4331-8444-a2945faebd1c	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-25 19:05:10.4965+08	
00000000-0000-0000-0000-000000000000	6cead528-9bce-47d5-b6e5-94df1f4d7470	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-25 19:13:39.140307+08	
00000000-0000-0000-0000-000000000000	1faca1a7-2154-4d4f-941f-06fe8bbcda51	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 09:30:35.239837+08	
00000000-0000-0000-0000-000000000000	fbd4e465-b9b5-4173-9a14-e3079302e93f	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 10:19:22.370213+08	
00000000-0000-0000-0000-000000000000	5de69fcb-5f19-42e6-9240-02c691d99bec	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 10:19:22.373474+08	
00000000-0000-0000-0000-000000000000	913b388d-45c2-4edd-a0d0-2a21aa630b93	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 10:19:22.443971+08	
00000000-0000-0000-0000-000000000000	3c7cbdce-077d-425d-9c03-846492fe7f2f	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 11:24:21.514646+08	
00000000-0000-0000-0000-000000000000	98dab55b-f0ab-4eaf-aa5e-aae00cc572a1	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-26 11:24:21.518581+08	
00000000-0000-0000-0000-000000000000	f366abb5-09c2-4e4d-b562-7f8ed7cc9bd8	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 11:24:23.691785+08	
00000000-0000-0000-0000-000000000000	340c0e62-21e5-4134-ad2e-68c771641e6f	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 11:24:34.592382+08	
00000000-0000-0000-0000-000000000000	c6f2d719-1c2a-47b1-aa2f-5835c0b867b3	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 11:50:32.742902+08	
00000000-0000-0000-0000-000000000000	0455b9e5-777c-4040-908a-30e07de856f3	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 11:51:10.625182+08	
00000000-0000-0000-0000-000000000000	e010d4d9-c0bb-416c-ab54-781d0ffea1f5	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 12:05:22.731248+08	
00000000-0000-0000-0000-000000000000	f3448766-5759-4288-9e3f-8fa1f2d95f36	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 12:06:16.562019+08	
00000000-0000-0000-0000-000000000000	bc72e725-5f4f-4967-86a1-1bc011937548	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 12:06:32.351106+08	
00000000-0000-0000-0000-000000000000	1ada5f08-dd97-40ac-9db7-879ce1f2a454	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-26 12:07:24.921457+08	
00000000-0000-0000-0000-000000000000	6c4d7fab-b215-4e2f-995c-1e99273fc76a	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-26 12:07:33.852931+08	
00000000-0000-0000-0000-000000000000	92deaf46-f1b1-4771-975f-139e4491b1bc	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:04:26.794762+08	
00000000-0000-0000-0000-000000000000	2a2b7253-365d-4af6-a094-7fe955ffdc3a	{"action":"user_signedup","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:04:49.123974+08	
00000000-0000-0000-0000-000000000000	450b315a-3b33-4f3d-b2aa-40d9b0192a3f	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:04:49.131014+08	
00000000-0000-0000-0000-000000000000	7e809df6-49c5-4b82-9881-14d6684dde8a	{"action":"user_signedup","actor_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:06:04.073594+08	
00000000-0000-0000-0000-000000000000	13187ac8-e983-4630-b55f-fc383949500c	{"action":"login","actor_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:06:04.077542+08	
00000000-0000-0000-0000-000000000000	c3c79578-42da-46e5-9d90-9feb473f87f6	{"action":"logout","actor_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:08:33.769579+08	
00000000-0000-0000-0000-000000000000	3df08bef-a8ac-47bf-a4f0-076d27faa1f5	{"action":"user_signedup","actor_id":"18cc2351-5ac9-4da8-930f-57ca3787c2df","actor_username":"wenyuanfeng@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:08:46.478726+08	
00000000-0000-0000-0000-000000000000	5c95968b-131e-4d2f-b74a-8a6f491e92d8	{"action":"login","actor_id":"18cc2351-5ac9-4da8-930f-57ca3787c2df","actor_username":"wenyuanfeng@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:08:46.48311+08	
00000000-0000-0000-0000-000000000000	bfc2a4f5-01bd-41e3-b13a-4c5360091b75	{"action":"user_signedup","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:15:08.469782+08	
00000000-0000-0000-0000-000000000000	57cd8b76-9e52-47a0-8b2a-e8b05b0c78dd	{"action":"login","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:15:08.477121+08	
00000000-0000-0000-0000-000000000000	405e9e58-f91c-4ff2-8475-a4dfbcf682c9	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:16:34.793981+08	
00000000-0000-0000-0000-000000000000	527fd59b-7b8d-4f14-86fa-02fcb22ca22d	{"action":"login","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:16:39.344233+08	
00000000-0000-0000-0000-000000000000	724e24b2-ae3a-4f90-b29d-b7651b34f4ca	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:16:41.170439+08	
00000000-0000-0000-0000-000000000000	5168aa9d-1a72-45bf-8452-2dcb15579026	{"action":"user_signedup","actor_id":"cb16bfab-cf42-4f9f-bd66-52a42db6bdc9","actor_username":"yuejianglei@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:16:57.874566+08	
00000000-0000-0000-0000-000000000000	01231109-8f90-4803-95e1-a89062ab8674	{"action":"login","actor_id":"cb16bfab-cf42-4f9f-bd66-52a42db6bdc9","actor_username":"yuejianglei@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:16:57.880707+08	
00000000-0000-0000-0000-000000000000	bf388136-c048-45c5-8e76-bbbb4527e63c	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:17:25.595851+08	
00000000-0000-0000-0000-000000000000	612e7aca-e857-4656-9a01-09acdf0a32c5	{"action":"user_signedup","actor_id":"1daa74d9-1438-40bc-84f5-3484f2f5bb7c","actor_username":"zxx911@vip.qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:18:20.963746+08	
00000000-0000-0000-0000-000000000000	4701c0ad-d477-479c-9fb0-f2876f18bd88	{"action":"login","actor_id":"1daa74d9-1438-40bc-84f5-3484f2f5bb7c","actor_username":"zxx911@vip.qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:18:20.96669+08	
00000000-0000-0000-0000-000000000000	7dcc1711-540e-4bda-a4b5-3e3d55dfabaf	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:18:21.9528+08	
00000000-0000-0000-0000-000000000000	53b02b2b-6034-4524-8633-fa2680d71e2f	{"action":"logout","actor_id":"18cc2351-5ac9-4da8-930f-57ca3787c2df","actor_username":"wenyuanfeng@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:18:26.073664+08	
00000000-0000-0000-0000-000000000000	e59c69b2-de0d-43f1-ba65-ede680a2b5e2	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:18:29.649444+08	
00000000-0000-0000-0000-000000000000	8b06660a-fc0a-4ed2-88a2-7ce44f35cdec	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:24:35.932069+08	
00000000-0000-0000-0000-000000000000	d364825b-bd39-4f8d-80e3-e07947ff0e1d	{"action":"user_recovery_requested","actor_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"user"}	2025-08-28 10:44:15.752716+08	
00000000-0000-0000-0000-000000000000	d91266c8-48e5-4789-92a6-cd75dadae4f3	{"action":"login","actor_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account"}	2025-08-28 10:45:04.843624+08	
00000000-0000-0000-0000-000000000000	0a723f11-d6fc-4e0e-989f-c52e400229ef	{"action":"login","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:47:10.336066+08	
00000000-0000-0000-0000-000000000000	09813d22-6bb5-464b-a633-456b154c9887	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"3057885232@qq.com","user_id":"d365ae00-1901-4ca7-8b61-98f0e48c8d4c","user_phone":""}}	2025-08-28 10:53:00.10137+08	
00000000-0000-0000-0000-000000000000	7ef66d61-723f-405a-8680-d3c13b8ee8bd	{"action":"user_signedup","actor_id":"af39292a-57b0-45ef-a3d6-df64950b52f9","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 10:54:30.036828+08	
00000000-0000-0000-0000-000000000000	11b204d9-5780-4b82-bedd-cec126f75ebd	{"action":"login","actor_id":"af39292a-57b0-45ef-a3d6-df64950b52f9","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 10:54:30.041656+08	
00000000-0000-0000-0000-000000000000	103fc1a2-a815-423b-9601-9aaf68b80965	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"3057885232@qq.com","user_id":"af39292a-57b0-45ef-a3d6-df64950b52f9","user_phone":""}}	2025-08-28 11:04:45.746002+08	
00000000-0000-0000-0000-000000000000	37fa1f6b-32d7-48b0-b8ed-596236e61367	{"action":"user_signedup","actor_id":"bc37c85d-c04d-48ab-ab5d-7bf3ad4242a3","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-28 11:07:37.613351+08	
00000000-0000-0000-0000-000000000000	14cadb08-c980-4ec5-a6b7-e6d91cc637bd	{"action":"login","actor_id":"bc37c85d-c04d-48ab-ab5d-7bf3ad4242a3","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 11:07:37.617063+08	
00000000-0000-0000-0000-000000000000	fc8c25db-2bfa-4649-9615-8b7a02335afd	{"action":"token_refreshed","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 11:46:31.21181+08	
00000000-0000-0000-0000-000000000000	f4523fb9-fa6a-4014-aabe-2bf348841d61	{"action":"token_revoked","actor_id":"276e6c8e-d15d-4c3a-a48a-d1b8a08439a1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-08-28 11:46:31.213341+08	
00000000-0000-0000-0000-000000000000	96fed7c0-c6ae-4bbc-998f-d914640f5658	{"action":"login","actor_id":"bc37c85d-c04d-48ab-ab5d-7bf3ad4242a3","actor_username":"3057885232@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-28 15:17:06.606312+08	
00000000-0000-0000-0000-000000000000	3f43f46a-7e85-4368-bc69-c5971c236266	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-30 10:14:47.765607+08	
00000000-0000-0000-0000-000000000000	15ba5164-cb52-4a45-afaf-082ddac1890a	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 09:10:32.803957+08	
00000000-0000-0000-0000-000000000000	c6f3870d-9388-4ec9-a2a1-536ab5222c76	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 09:10:32.817201+08	
00000000-0000-0000-0000-000000000000	fac5cbe1-ac47-4cf1-a515-594425ee0fa8	{"action":"user_signedup","actor_id":"5996f719-18f2-478d-adef-abc0fefeacf8","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 09:19:19.232648+08	
00000000-0000-0000-0000-000000000000	01d5258a-cc28-4b20-8167-9436ac96aada	{"action":"login","actor_id":"5996f719-18f2-478d-adef-abc0fefeacf8","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:19:19.243847+08	
00000000-0000-0000-0000-000000000000	6f537329-0230-4084-aa38-393716a7dc52	{"action":"user_signedup","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 09:36:18.929478+08	
00000000-0000-0000-0000-000000000000	eba5141f-332b-4cc8-bbf9-63300018e8ba	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:36:18.93944+08	
00000000-0000-0000-0000-000000000000	536f4f24-5ef8-4ff4-b86c-fa2996bb89f0	{"action":"user_signedup","actor_id":"b92239dd-6020-4e23-ba31-c0058ec400b4","actor_username":"shule@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 09:36:26.257106+08	
00000000-0000-0000-0000-000000000000	793e77f2-a959-4d34-8a19-ccd0f0097381	{"action":"login","actor_id":"b92239dd-6020-4e23-ba31-c0058ec400b4","actor_username":"shule@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:36:26.26172+08	
00000000-0000-0000-0000-000000000000	523342a0-3f05-4985-8e84-162a1dc15ba8	{"action":"logout","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 09:41:31.038177+08	
00000000-0000-0000-0000-000000000000	f27560c5-0340-47ec-bfa0-78b45dc97221	{"action":"user_signedup","actor_id":"d16afdfa-a23a-45a5-8378-bbbada5c4452","actor_username":"yumingzhong@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 09:41:36.510489+08	
00000000-0000-0000-0000-000000000000	27cdc946-a5b5-44a7-b51d-1fc17eecd9fd	{"action":"login","actor_id":"d16afdfa-a23a-45a5-8378-bbbada5c4452","actor_username":"yumingzhong@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:41:36.515028+08	
00000000-0000-0000-0000-000000000000	c55f01f3-c1e4-4092-b724-af1c4b930d77	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:42:00.8255+08	
00000000-0000-0000-0000-000000000000	2af34104-9e08-4e3a-b21f-a5e2ab053576	{"action":"logout","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 09:43:42.760759+08	
00000000-0000-0000-0000-000000000000	a8cdaee8-9b6d-41bf-9105-42717e649dcc	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:44:07.978045+08	
00000000-0000-0000-0000-000000000000	333aa3d9-1fb4-4d94-862c-3f0fec335255	{"action":"logout","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 09:44:14.077087+08	
00000000-0000-0000-0000-000000000000	3e549352-5d12-4538-ab92-a567b198950b	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 09:44:19.833539+08	
00000000-0000-0000-0000-000000000000	b7c9bb27-db0e-4d92-bc51-33948d151f37	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 10:39:08.999479+08	
00000000-0000-0000-0000-000000000000	0f63af81-6628-4a5e-b000-54f4c67225d0	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 10:39:09.002208+08	
00000000-0000-0000-0000-000000000000	dc5ec9f6-6eae-4668-a05f-bc7fcdd4343f	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 10:39:09.1015+08	
00000000-0000-0000-0000-000000000000	0a84be49-ec3a-4fc9-9d49-6f4213b53d22	{"action":"user_signedup","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 11:49:43.727664+08	
00000000-0000-0000-0000-000000000000	3973ffc2-bffe-4636-955b-af3448b4aef6	{"action":"login","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 11:49:43.733073+08	
00000000-0000-0000-0000-000000000000	c348a40e-58b8-4ac6-b981-a5f46aebcfd6	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 12:00:53.887532+08	
00000000-0000-0000-0000-000000000000	7516146a-a2f1-4f93-b887-a0d529ebc67d	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 12:18:23.160655+08	
00000000-0000-0000-0000-000000000000	806e63b3-5d1a-4080-b8b1-4fefc5add900	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 17:27:52.537252+08	
00000000-0000-0000-0000-000000000000	71c50843-fe20-490d-b65c-d076e09a5968	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 17:28:52.329912+08	
00000000-0000-0000-0000-000000000000	93f0eca2-6b27-4fad-86ac-4ae549f597a5	{"action":"login","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 17:42:57.85888+08	
00000000-0000-0000-0000-000000000000	873a7d46-7ea0-4d3e-9e93-ac1f241a60bf	{"action":"login","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 18:02:05.169857+08	
00000000-0000-0000-0000-000000000000	a6d73be4-3a31-4d39-b2e0-b13843f272dd	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 18:18:00.576022+08	
00000000-0000-0000-0000-000000000000	d6a250f3-c72d-49ce-9b6f-98fac717c9f2	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 18:23:50.482281+08	
00000000-0000-0000-0000-000000000000	9a6116d9-985b-45fc-bff9-53dd202e051c	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 18:23:59.12974+08	
00000000-0000-0000-0000-000000000000	f6bc5879-90b7-4903-a89e-43266d3d447b	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 18:25:18.337034+08	
00000000-0000-0000-0000-000000000000	4fe0a62c-e6c3-4914-9cce-c152ab259a7c	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 18:25:23.78402+08	
00000000-0000-0000-0000-000000000000	dd670849-c1ae-4ae2-afd8-455233b102e2	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 18:25:26.214756+08	
00000000-0000-0000-0000-000000000000	d4e79ddb-7ca8-4c28-8635-9ccb0c512e5f	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:00:04.704132+08	
00000000-0000-0000-0000-000000000000	8f974cee-05d1-4c3c-a6a8-2ebd7492829f	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:00:16.034109+08	
00000000-0000-0000-0000-000000000000	5b32f871-7f65-45af-bae7-960a4a248c78	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:36:06.72313+08	
00000000-0000-0000-0000-000000000000	951fb70b-d070-4e58-ab38-e8fbbc9176e6	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:36:14.492953+08	
00000000-0000-0000-0000-000000000000	17b6a564-9a8f-4ebf-aac0-047fa4bf12e9	{"action":"user_signedup","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 19:36:37.939981+08	
00000000-0000-0000-0000-000000000000	d9f06624-6bd3-461c-b4da-6e1ecb510164	{"action":"login","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:36:37.949034+08	
00000000-0000-0000-0000-000000000000	1b10808e-e459-4c3d-ba97-82a326f35a6f	{"action":"logout","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:36:53.047041+08	
00000000-0000-0000-0000-000000000000	15448152-e2bd-4dd1-8542-c96e4dbcedac	{"action":"user_signedup","actor_id":"fd4e29ba-8477-4787-b84d-8b6e63708bde","actor_username":"test1@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 19:37:06.421134+08	
00000000-0000-0000-0000-000000000000	1f8fd492-948e-4ae8-b1ee-1e6c80c51da9	{"action":"login","actor_id":"fd4e29ba-8477-4787-b84d-8b6e63708bde","actor_username":"test1@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:37:06.424489+08	
00000000-0000-0000-0000-000000000000	49fc9404-a31a-4fe6-b665-d3e4442e2dc6	{"action":"logout","actor_id":"fd4e29ba-8477-4787-b84d-8b6e63708bde","actor_username":"test1@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:37:13.775072+08	
00000000-0000-0000-0000-000000000000	9ed00c52-ba31-4578-9a78-1ede34e27f5a	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:37:36.737482+08	
00000000-0000-0000-0000-000000000000	13e1b493-f23e-46a4-8d5d-7dd2f6e0aa51	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:39:38.512274+08	
00000000-0000-0000-0000-000000000000	3a0625e1-c265-4da6-9273-bdd2a25d2e84	{"action":"login","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:39:49.566347+08	
00000000-0000-0000-0000-000000000000	182db2ee-61cb-4db2-9246-3209c777f4a8	{"action":"token_refreshed","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 19:41:02.172173+08	
00000000-0000-0000-0000-000000000000	4b196a2c-bb75-4423-9a1e-301883add5a6	{"action":"token_revoked","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 19:41:02.175514+08	
00000000-0000-0000-0000-000000000000	3b46679e-74ff-471f-94d8-69988b75f26c	{"action":"login","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:52:27.367818+08	
00000000-0000-0000-0000-000000000000	34aae9d1-8f26-4bc8-95f2-21984bedfb65	{"action":"logout","actor_id":"2a9d890a-c45e-4f77-a92d-b68f6857e62a","actor_username":"test@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:52:37.539589+08	
00000000-0000-0000-0000-000000000000	85ee8087-bf07-45f4-839b-8dc17496b899	{"action":"user_signedup","actor_id":"70f7fea0-2a83-48b9-a45d-9c68b81bb119","actor_username":"test2@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-01 19:52:56.55146+08	
00000000-0000-0000-0000-000000000000	cb0b99bc-1366-40bb-ba9e-c5e55f376bce	{"action":"login","actor_id":"70f7fea0-2a83-48b9-a45d-9c68b81bb119","actor_username":"test2@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-01 19:52:56.558698+08	
00000000-0000-0000-0000-000000000000	d13b3fdb-8cbe-4506-9fbb-db39230f9188	{"action":"logout","actor_id":"70f7fea0-2a83-48b9-a45d-9c68b81bb119","actor_username":"test2@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-01 19:53:12.244848+08	
00000000-0000-0000-0000-000000000000	a8c95465-f595-4ee2-bdcb-88de2690bd19	{"action":"token_refreshed","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 20:12:35.796201+08	
00000000-0000-0000-0000-000000000000	ce637c3a-6466-44d0-9cf6-50ce250cac2b	{"action":"token_revoked","actor_id":"e1febadd-ec14-48e7-accc-54cfb4d67ede","actor_username":"yangzhiheng@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-01 20:12:35.799091+08	
00000000-0000-0000-0000-000000000000	937d5c6e-910f-4bb6-b510-098583a70451	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:02:13.416414+08	
00000000-0000-0000-0000-000000000000	37e83f3f-6e2d-4bd0-b2ff-17366d136a17	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:02:40.679778+08	
00000000-0000-0000-0000-000000000000	b432bd27-fa24-4c55-9182-3abc724e0c84	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:02:44.211368+08	
00000000-0000-0000-0000-000000000000	f14e3205-93fa-4a41-b136-e00aaa68c280	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:02:47.120076+08	
00000000-0000-0000-0000-000000000000	46fd82d7-d34a-4068-8318-e46a3e3a14a3	{"action":"user_signedup","actor_id":"c61a3d41-d2f2-4b0c-9a6a-8da55498bdf9","actor_username":"1@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-02 10:03:17.149219+08	
00000000-0000-0000-0000-000000000000	41873152-2bed-471d-9c39-14126690d8bd	{"action":"login","actor_id":"c61a3d41-d2f2-4b0c-9a6a-8da55498bdf9","actor_username":"1@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:03:17.159913+08	
00000000-0000-0000-0000-000000000000	346acf03-4b97-4679-99a4-5c27d8675042	{"action":"logout","actor_id":"c61a3d41-d2f2-4b0c-9a6a-8da55498bdf9","actor_username":"1@qq.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:03:42.805495+08	
00000000-0000-0000-0000-000000000000	925c7889-2d2a-4421-9204-395d0233167c	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:04:24.6927+08	
00000000-0000-0000-0000-000000000000	ad41dc41-6a0a-4b11-b350-6b914655b86b	{"action":"token_refreshed","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 10:05:24.800687+08	
00000000-0000-0000-0000-000000000000	7b1f8a18-a2b2-4d57-82e8-76017014f0cc	{"action":"token_revoked","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 10:05:24.801534+08	
00000000-0000-0000-0000-000000000000	68303d71-d11a-43fb-9fcf-706fc01ffac8	{"action":"user_signedup","actor_id":"feed2449-0e1d-4187-add8-af21a3f344de","actor_username":"test3@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-02 10:09:47.31583+08	
00000000-0000-0000-0000-000000000000	c0150c80-6851-4731-b31d-056856aae564	{"action":"login","actor_id":"feed2449-0e1d-4187-add8-af21a3f344de","actor_username":"test3@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:09:47.322394+08	
00000000-0000-0000-0000-000000000000	568b7b55-8b6e-45bd-923b-01b98b4b130d	{"action":"login","actor_id":"feed2449-0e1d-4187-add8-af21a3f344de","actor_username":"test3@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:10:31.929602+08	
00000000-0000-0000-0000-000000000000	0f3f1c3c-cd3a-48b0-9445-8ace830c2022	{"action":"login","actor_id":"feed2449-0e1d-4187-add8-af21a3f344de","actor_username":"test3@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:11:53.425492+08	
00000000-0000-0000-0000-000000000000	30bee516-b57c-44b1-8d6f-8c4bc69e5b5e	{"action":"logout","actor_id":"feed2449-0e1d-4187-add8-af21a3f344de","actor_username":"test3@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:34:15.411645+08	
00000000-0000-0000-0000-000000000000	dcff9f75-c199-4852-b767-9f17f7920f3b	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:35:13.793635+08	
00000000-0000-0000-0000-000000000000	34b19c06-d93f-4157-872e-a3e880878f60	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:35:24.174571+08	
00000000-0000-0000-0000-000000000000	6858f339-baae-4c46-8b1f-cc3c468bea06	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:35:28.282197+08	
00000000-0000-0000-0000-000000000000	34c28f93-a33b-458b-923d-3875e329efba	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:35:44.095568+08	
00000000-0000-0000-0000-000000000000	383ed4c1-2f9e-4f30-822e-f477eead4152	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:35:57.629849+08	
00000000-0000-0000-0000-000000000000	f3796a6a-7d04-4b99-855f-e8f4a681956b	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:36:02.735826+08	
00000000-0000-0000-0000-000000000000	d52e05bb-4d7a-429e-9ca1-8968a8c0d6bb	{"action":"user_signedup","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-02 10:36:08.114173+08	
00000000-0000-0000-0000-000000000000	aa662760-216a-49d0-a04f-6a417a2806fd	{"action":"login","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:36:08.119539+08	
00000000-0000-0000-0000-000000000000	94eb4093-bdbb-4394-b7c6-82cfadb8bab0	{"action":"user_repeated_signup","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-09-02 10:37:01.142507+08	
00000000-0000-0000-0000-000000000000	ed708463-3357-498f-a15a-d2f91fbb9f2a	{"action":"user_signedup","actor_id":"3729a0b3-de65-43db-bd9f-e302e6faa665","actor_username":"test4@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-02 10:37:06.715197+08	
00000000-0000-0000-0000-000000000000	7714fdea-8c9a-44b5-bda2-9902e9246b7e	{"action":"login","actor_id":"3729a0b3-de65-43db-bd9f-e302e6faa665","actor_username":"test4@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:37:06.719537+08	
00000000-0000-0000-0000-000000000000	8a74b5a0-d47a-4795-92e5-6507738c9ec1	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:37:26.99519+08	
00000000-0000-0000-0000-000000000000	7a166191-0e59-4271-9887-b40d77d72bb5	{"action":"logout","actor_id":"3729a0b3-de65-43db-bd9f-e302e6faa665","actor_username":"test4@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:37:42.309511+08	
00000000-0000-0000-0000-000000000000	d37e2640-fe7f-4f51-8a63-78c51bd56d8a	{"action":"login","actor_id":"fd4e29ba-8477-4787-b84d-8b6e63708bde","actor_username":"test1@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:38:02.997358+08	
00000000-0000-0000-0000-000000000000	521f4447-b546-41e9-b57a-f34420d5affd	{"action":"logout","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:39:13.282311+08	
00000000-0000-0000-0000-000000000000	f2e1afe5-d0d4-4e77-b167-975c41b6e183	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:39:17.744752+08	
00000000-0000-0000-0000-000000000000	4b5c80ad-f896-431e-9862-94dacee73913	{"action":"login","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:39:41.241184+08	
00000000-0000-0000-0000-000000000000	f8b62260-4dd5-4234-9b97-65d17790e2fe	{"action":"logout","actor_id":"cee8c878-6e1b-4283-a28b-487a532613b0","actor_username":"guozhongyou@cosmo-lady.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 10:41:52.452739+08	
00000000-0000-0000-0000-000000000000	2011a0ca-59f4-4a4e-8c6c-a7b753059715	{"action":"login","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 10:59:15.925185+08	
00000000-0000-0000-0000-000000000000	3065ca49-70ac-41e3-a9c1-1f47f7af09fb	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:02:03.692345+08	
00000000-0000-0000-0000-000000000000	ae627c32-aef7-4944-960a-f7a5c7503bf4	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:02:22.343174+08	
00000000-0000-0000-0000-000000000000	6e65462d-e048-4566-ac10-eee5f8d8a3ab	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:02:51.816618+08	
00000000-0000-0000-0000-000000000000	c9abd6a8-6a3b-4688-8b38-9f7373091c08	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:06:25.23109+08	
00000000-0000-0000-0000-000000000000	d32de86f-dd38-4d99-a243-b8216c36f12d	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:10:17.130701+08	
00000000-0000-0000-0000-000000000000	f53d9bf5-1963-478b-897e-502047ac510a	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:13:42.906311+08	
00000000-0000-0000-0000-000000000000	63567ed0-e533-475f-a1b6-6dd7dc5adeb8	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:13:52.081366+08	
00000000-0000-0000-0000-000000000000	65f023a5-3d24-42c6-90a3-e4390443ff5b	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:17:11.110138+08	
00000000-0000-0000-0000-000000000000	9bce8ab8-cb10-4f60-a3ba-65e1746a827c	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:18:18.686547+08	
00000000-0000-0000-0000-000000000000	25069cd1-b518-433d-ac65-aa9f0a679690	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:18:29.1437+08	
00000000-0000-0000-0000-000000000000	a7ae6842-c34c-4407-b21a-49d71cbbf86a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:18:35.627172+08	
00000000-0000-0000-0000-000000000000	4f18a0f2-90f0-4b7d-9a18-ae418861147a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:19:02.77042+08	
00000000-0000-0000-0000-000000000000	0bb70e82-fcd9-4eba-b850-4ae769786a96	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:23:58.219774+08	
00000000-0000-0000-0000-000000000000	a27f32c9-fe1a-44f7-8f88-2ebd52e11976	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:27:20.657764+08	
00000000-0000-0000-0000-000000000000	6fd16a50-fa90-452b-a7d1-993371d92534	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:29:20.297223+08	
00000000-0000-0000-0000-000000000000	26075737-2d2e-442a-93f3-05482ba8c02e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:30:22.588184+08	
00000000-0000-0000-0000-000000000000	9bf474c0-44f3-40ad-895f-4096c15f72c0	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:31:13.497587+08	
00000000-0000-0000-0000-000000000000	44db4a22-3d57-4bbd-b62a-d487ce5ff55e	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 11:31:35.560761+08	
00000000-0000-0000-0000-000000000000	0dcd75e3-dcc8-4ead-8567-161917cf6401	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:32:05.808231+08	
00000000-0000-0000-0000-000000000000	bb535aa7-2a16-4c44-ab4c-c7b8949f24f4	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:35:18.470412+08	
00000000-0000-0000-0000-000000000000	a1b41901-ea83-4af3-8d5b-236f0c3ed083	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 11:41:43.211494+08	
00000000-0000-0000-0000-000000000000	16df3007-13a1-4b51-9f19-4bd9415bad80	{"action":"token_refreshed","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 11:53:27.942448+08	
00000000-0000-0000-0000-000000000000	1f461edf-d90f-4774-93ff-7763f7021a47	{"action":"token_revoked","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 11:53:27.94481+08	
00000000-0000-0000-0000-000000000000	92ed50ef-ce53-4dee-81a3-4808414546fd	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:00:29.920937+08	
00000000-0000-0000-0000-000000000000	05487f58-1c36-48f3-a7ba-f881bb5fcd4b	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:04:05.881345+08	
00000000-0000-0000-0000-000000000000	fe13598d-7138-4c7f-b319-b131e55d11ec	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:09:53.977406+08	
00000000-0000-0000-0000-000000000000	17bd0853-3f7d-4997-a968-ea7bbdaf22cc	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 12:10:47.606671+08	
00000000-0000-0000-0000-000000000000	adced41f-56ee-4f94-83ed-1699c0aba338	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:17:21.408234+08	
00000000-0000-0000-0000-000000000000	e12ed93f-3675-4500-82f1-06a5771b6165	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 12:20:10.161353+08	
00000000-0000-0000-0000-000000000000	08066938-7e41-486d-ac56-8541dccfe82f	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:20:15.090334+08	
00000000-0000-0000-0000-000000000000	78d6544f-889e-4f3f-a895-dd6dc705b736	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:28:36.434662+08	
00000000-0000-0000-0000-000000000000	2665044c-dc52-4af7-9aa7-aa1c9b6c04a4	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:29:05.047193+08	
00000000-0000-0000-0000-000000000000	d5632de1-f689-47fa-b9e8-572e76fcd589	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:30:09.667559+08	
00000000-0000-0000-0000-000000000000	70180d57-8fa3-4356-b149-37d1318a5914	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 12:34:25.826799+08	
00000000-0000-0000-0000-000000000000	9d7e136f-d12b-4e17-9306-0867237d8efb	{"action":"token_refreshed","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 12:53:15.080432+08	
00000000-0000-0000-0000-000000000000	192de4b8-9067-48c3-93b2-5c4a48815d0f	{"action":"token_revoked","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 12:53:15.08131+08	
00000000-0000-0000-0000-000000000000	2ee74276-0532-4a26-bcb2-fff1cbceaf94	{"action":"token_refreshed","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 13:51:50.529353+08	
00000000-0000-0000-0000-000000000000	2f8e6123-9c80-4046-b08b-e1633bb10c1e	{"action":"token_revoked","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 13:51:50.530195+08	
00000000-0000-0000-0000-000000000000	ae2571b7-6bfe-4288-9a0b-ed7683cf8d40	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:08:47.104897+08	
00000000-0000-0000-0000-000000000000	779e1950-d57d-4ce7-a4c9-b1327a040ac8	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:08:47.105748+08	
00000000-0000-0000-0000-000000000000	4ade2174-72b0-4d7c-8d43-878c7707fc7f	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:08:55.71025+08	
00000000-0000-0000-0000-000000000000	50e5ebc6-a276-4733-a927-16283d09c3a6	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:08:55.710856+08	
00000000-0000-0000-0000-000000000000	b7eb9309-ef24-4256-8587-23a96f50f1a6	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:09:13.766304+08	
00000000-0000-0000-0000-000000000000	92700054-bded-42d3-bda4-4b2bd52652ba	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:09:49.608577+08	
00000000-0000-0000-0000-000000000000	a6c2b56e-06b1-4dc3-ae5a-00681bf0145f	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:09:53.821975+08	
00000000-0000-0000-0000-000000000000	de74108e-fd1a-4843-aab3-f2aa4f3b5439	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:10:40.249979+08	
00000000-0000-0000-0000-000000000000	dc387bd0-49e5-45b6-9591-b715414b5318	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:10:51.486512+08	
00000000-0000-0000-0000-000000000000	93620122-2c48-403c-a325-da1b203944b2	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:11:58.004203+08	
00000000-0000-0000-0000-000000000000	030db656-ef17-4b8e-8fa8-7b8055cf1f52	{"action":"token_refreshed","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:13:12.8616+08	
00000000-0000-0000-0000-000000000000	b7a551e4-789e-4b52-a061-507ef1033dbf	{"action":"token_revoked","actor_id":"6ddbafdb-26f4-4bd5-babb-583ad64ecb7c","actor_username":"chenpengfei@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 14:13:12.862405+08	
00000000-0000-0000-0000-000000000000	6685b520-6bf3-4e9c-9e89-85126cc9a109	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:13:50.813974+08	
00000000-0000-0000-0000-000000000000	4c9e058b-1446-4a97-b6a0-d565704b52f0	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:17:04.295687+08	
00000000-0000-0000-0000-000000000000	385331e4-e404-48e0-91f4-5fc7f3732991	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:17:08.442066+08	
00000000-0000-0000-0000-000000000000	3828c11e-2ff1-4d4b-ad8d-33b7bfe55adf	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:17:38.763584+08	
00000000-0000-0000-0000-000000000000	a4a8e998-2305-47b5-809b-afd5ce1cea8a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:18:16.270334+08	
00000000-0000-0000-0000-000000000000	85d4cbc6-5bfa-47d1-a462-c58083a43faf	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:20:40.629158+08	
00000000-0000-0000-0000-000000000000	58e76ef2-c8ea-4665-beab-fba75245fd3d	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:21:12.468013+08	
00000000-0000-0000-0000-000000000000	f1558ba8-1f15-4787-b0e2-b4801f0c5f48	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:21:16.226298+08	
00000000-0000-0000-0000-000000000000	d3b0091c-b1c4-4988-b130-8398799d8fb5	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:21:44.000076+08	
00000000-0000-0000-0000-000000000000	1981028a-d39b-4bff-8bf5-ca3239b8a4aa	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:21:47.863781+08	
00000000-0000-0000-0000-000000000000	793099aa-de0c-4a02-8701-bbbdc2ca1d9d	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 14:21:52.443317+08	
00000000-0000-0000-0000-000000000000	f5384a4e-8532-476a-8f78-675b4285d17a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 14:21:56.884682+08	
00000000-0000-0000-0000-000000000000	7ece74c3-520d-41ca-870e-af2138bd4c28	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:03:03.267454+08	
00000000-0000-0000-0000-000000000000	9606ab54-d3a3-46dc-b7e1-f5d6895905eb	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:03:16.475598+08	
00000000-0000-0000-0000-000000000000	97dc9e88-f3ab-41ac-b3f7-e5e643e7ce6e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:04:42.342277+08	
00000000-0000-0000-0000-000000000000	819c0309-543c-4561-ba0f-3857863dfc0b	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:05:08.959923+08	
00000000-0000-0000-0000-000000000000	f3ed4b5c-9f06-4bbf-85f7-d3fec4095e85	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:05:18.524006+08	
00000000-0000-0000-0000-000000000000	d6042e02-07b7-4f04-ac16-b4544b228892	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:10:16.470766+08	
00000000-0000-0000-0000-000000000000	5c2b3d4d-aedc-4e56-9217-1e0dd4bbb2a3	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:10:22.718402+08	
00000000-0000-0000-0000-000000000000	5f65a1e2-2648-49ca-8b33-cd01392167b3	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:13:09.133164+08	
00000000-0000-0000-0000-000000000000	e92db532-14fa-4fce-aa7c-2582d4ac5d3e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:13:16.539928+08	
00000000-0000-0000-0000-000000000000	9d3894ed-28ff-4aca-adec-853924c54175	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:17:17.530683+08	
00000000-0000-0000-0000-000000000000	07061e3e-59c9-4330-9563-f3413847562f	{"action":"token_refreshed","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 15:31:54.17674+08	
00000000-0000-0000-0000-000000000000	e73960b8-8cd2-4e39-8b60-14c470aa13e9	{"action":"token_revoked","actor_id":"99fa10e9-9bd5-4be3-bb99-a80de515aecf","actor_username":"morongbo@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-09-02 15:31:54.178294+08	
00000000-0000-0000-0000-000000000000	186234d5-abfe-43f3-a7f6-0c4f6b4fe568	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:35:12.730956+08	
00000000-0000-0000-0000-000000000000	aa42a919-3ae8-4e5c-9840-1c50c1a950b2	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:36:40.599539+08	
00000000-0000-0000-0000-000000000000	28cf9f8e-b7db-42a5-8a31-8655a612419e	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:40:26.010664+08	
00000000-0000-0000-0000-000000000000	8072f752-a2e8-4798-9049-3e2e36425e45	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:40:53.573992+08	
00000000-0000-0000-0000-000000000000	0b93bd22-b7c0-40f5-97c9-33314cefbb5e	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:40:57.957502+08	
00000000-0000-0000-0000-000000000000	e1fa9e86-5f38-4d22-8cd3-82fc4578403a	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 15:47:09.532865+08	
00000000-0000-0000-0000-000000000000	8d4a3df8-0726-4c5b-8c2e-6b08e2479f4c	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 15:47:18.810625+08	
00000000-0000-0000-0000-000000000000	92cf760e-19c3-458d-acdd-ef110317b1f8	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 17:58:34.457645+08	
00000000-0000-0000-0000-000000000000	a2f04baf-e57e-4db0-8afa-44cb00c2c0d1	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-09-02 17:58:39.092025+08	
00000000-0000-0000-0000-000000000000	a686e733-af5e-43df-b827-bce3693ca684	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-02 17:59:22.466039+08	
\.


--
-- TOC entry 4211 (class 0 OID 18767)
-- Dependencies: 237
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- TOC entry 4212 (class 0 OID 18772)
-- Dependencies: 238
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- TOC entry 4213 (class 0 OID 18779)
-- Dependencies: 239
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4214 (class 0 OID 18784)
-- Dependencies: 240
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- TOC entry 4215 (class 0 OID 18789)
-- Dependencies: 241
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4216 (class 0 OID 18794)
-- Dependencies: 242
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- TOC entry 4217 (class 0 OID 18799)
-- Dependencies: 243
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4218 (class 0 OID 18807)
-- Dependencies: 244
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- TOC entry 4220 (class 0 OID 18813)
-- Dependencies: 246
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4221 (class 0 OID 18821)
-- Dependencies: 247
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4222 (class 0 OID 18827)
-- Dependencies: 248
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- TOC entry 4223 (class 0 OID 18830)
-- Dependencies: 249
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- TOC entry 4224 (class 0 OID 18835)
-- Dependencies: 250
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4225 (class 0 OID 18841)
-- Dependencies: 251
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4226 (class 0 OID 18847)
-- Dependencies: 252
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\N	30345913-b52f-4cd0-b314-c8fb90ddb5c8	\N	\N	hkpking@example.com	$2b$12$fK3RLgnsZ8aLQE.eGc/VE.szoSBGlW67RWh/l6csi0qa2l84tN7z.	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	8463876b-55ef-4c31-b9b7-b6426fab2fcd	\N	\N	yumingzhong@cosmo-lady.com	$2a$12$4ck.FhmHxN7SgxP64paFL.opztJWbsKcw0mUMoMGrhKfMiAq5ZL0i	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	cacb1509-5fb4-4509-898d-38dd8d4d23be	\N	\N	hkpking01@example.com	$2a$12$WYbq.dKKXZ/rZMJGKurTvePsmYl7nM016NGVLuo.yjHgk9YRnCTIO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	77823c57-6072-497d-93a0-a60fce816f3a	\N	\N	dengzhixiong@cosmo-lady.com.cn	$2a$12$6tsvQP4cjji.BEA4c8b3xexabbrURABx.Pp.mBZt8RRG/mNhvaeVO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	77d0e868-e6db-484c-96a0-f071c6ab6689	\N	\N	liangyijian@cosmo-lady.com	$2a$12$wB/Nobli5hzbmz0hSsLaHuC/N0BNVhEsC776uyDuZqUAq0s0qbAwO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	3ad62335-583b-4fc7-bff3-5792d545f7ec	\N	\N	fuwulong@cosmo-lady.com.cn	$2a$12$D.LlfVEsbg8INaeDOnQhNuaePLIXp1NZSpAcI36Eb001WO53K3mfC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	57d88a71-dde2-4b30-8fe8-b1d911e23067	\N	\N	liujiashuanga@cosmo-lady.com.cn	$2a$12$pk/kvbxVkRYQaxtxSmNhfOJ5iTMFSxjtqTQaUWRUGOGqO3RFkTzk6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	4aa35680-7d31-44e6-b879-db4636ee8a11	\N	\N	yangzhiheng@cosmo-lady.com	$2a$12$OHP8tnToBOACrOE0TxfyDuteKcQztrlW2KXYsSphb/vCjCKaX7ekC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	c986bfcb-dd8e-456b-a257-c18b202639db	\N	\N	chenyonga@cosmo-lady.com	$2a$12$2oOwIylu0wAp7Rj2mkcgguOgIR0btEXB4SX2pf9nJA3ZbwrtGDA/u	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	1b9ec97c-26a8-438b-bcda-7aa1e64e7e89	\N	\N	chenjinping@cosmo-lady.com.cn	$2a$12$79VXhTt7jcuqr9jZpHb3NukkgrIwfhdPIZR2DyWaEAgYUYQy4w.EG	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	5e7bba9d-1d2c-42de-a62f-dee737b23765	\N	\N	shule@cosmo-lady.com.cn	$2a$12$iHv2DZspMKTxPq6y4zOo.eou9MFmVzM0fzRSjo16JKPsF4XcsVwMG	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	52236e5e-deb1-485a-bdf0-d9bfd3e63df8	\N	\N	chenmaoteng@cosmo-lady.com	$2a$12$hZZvKsLb99nTarViYeDUXeKCXBNg6DDAKYYlEyu91G4//s.FYJLHC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	f58f80be-5b80-43e5-9ecd-17789a903907	\N	\N	liqiheng@cosmo-lady.com	$2a$12$4uYtcZeaqmX.V01xE/C4pOhlJ99WuO.WFC9IDKFaPMbmy1b/ldowa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	72ebb535-b6f6-4571-8ddd-f832009834dd	\N	\N	1458574484@qq.com	$2a$12$64JtgW2lmBf2i.zEpdbgjeKY4ousssYgpOANeIK6Bw.nY5yJ2F6Ti	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	209e9e9c-77c7-4c70-b2de-1c260b5b9e66	\N	\N	wenyuanfeng@cosmo-lady.com.cn	$2a$12$/3LxBhQiPX4iRFBgIkAXbOwIPmqNW2NFbROUplhejkoc4D2XWL0QW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	ea14ad8d-3212-4e06-aacb-9c48ceb0070d	\N	\N	liuguang@cosmo-lady.com.cn	$2a$12$Fa3qRIzW6aGGRTJALZIdK.GYXDoCsicSv8AbBnYzlHMbKRhH.rOWe	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	015c5f49-19ea-49bf-bed8-083f7383beaa	\N	\N	zhangjunping@cosmo-lady.com	$2a$12$IGRDB0RKuSCL9HmxvvUyRuHxym7h96NCqJTXfEZ8P8wrurbd2oyf2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd	\N	\N	liurence@cosmo-lady.com	$2a$12$gtp0ucpbG/OcwQgF5FMRUuEYAZggqDV2lhA6/gFcHdBFi0/v0T9XS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	e8b2066d-1abb-45f2-aa37-952efbecb061	\N	\N	yuejainglei@cosmo-lady.com.cn	$2a$12$i./iIFMKqUd9jKI8op8nKOrzAaYQoqcypwtsVZFyqWXS11wxqESJO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	2322b6af-192b-4a79-9e6e-d38dd592df6f	\N	\N	yangziyu@cosmo-lady.com.cn	$2a$12$1I46TNXgDMrVqepG9cw9v.F3OaiKPyMI6XasBHuXdjj8PmF8h7tiK	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	7187cf5e-58ec-44c0-a1f0-c6a75806f9c8	\N	\N	yuejianglei@cosmo-lady.com.cn	$2a$12$Ixfyb9g2crKEbUouuYtxbu0tC9fRfub3x5gyVPrrlF3PG6gY9sNRu	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\N	f906e11b-bd21-4b80-9cd5-1ed28ef4d028	\N	\N	zhangdongliang@cosmo-lady.com	$2a$12$LlVYQ3peH8wun83xUZtklOgQAOk9Fr0AOPz/Yc1xvRcV/6/tkzdmq	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4227 (class 0 OID 18862)
-- Dependencies: 253
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, created_at, name, description, icon_url, trigger_key) FROM stdin;
fb5f9136-e977-400c-bb27-f6332ce6ecf9	2025-08-08 19:04:06.523938+08	初窥门径	完成你的第一个学习内容块，正式踏上流程天命的征途。	https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/external-gate-ancient-egypt-flatart-icons-lineal-color-flatarticons.png	COMPLETE_FIRST_BLOCK
d9263e23-dc5a-41ed-b00e-5526ed195bf5	2025-08-08 19:04:06.523938+08	学有所成	征服一个完整的章节，你的知识体系正在形成。	https://img.icons8.com/external-flat-icons-vectorslab/68/external-Scroll-ancient-egypt-flat-icons-vectorslab.png	COMPLETE_FIRST_CHAPTER
f7f49830-97f6-4709-ab2e-25d9c9f15781	2025-08-08 19:04:06.523938+08	点石成金	首次在测验中获得学分，智慧即是财富。	https://img.icons8.com/fluency/48/stack-of-coins.png	SCORE_FIRST_POINTS
\.


--
-- TOC entry 4228 (class 0 OID 18869)
-- Dependencies: 254
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.badges (id, name, description, icon_url, created_at) FROM stdin;
9e0cf04c-60e5-4893-9c71-07599959b0dd	挑战先锋	成功完成并见证了首次部门挑战的勇者证明。	https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/external-badge-startup-flatart-icons-lineal-color-flatarticons.png	2025-08-07 18:38:51.696244+08
\.


--
-- TOC entry 4229 (class 0 OID 18876)
-- Dependencies: 255
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocks (id, section_id, title, "order", content_markdown, video_url, quiz_question, quiz_options, correct_answer_index, created_at, ppt_url, pdf_url, document_url, content_html, content_format) FROM stdin;
e573db83-941a-46f8-af64-82832cee8768	3388f27f-28e7-4f77-b030-3b1e729a0061	流程密码现世	0	自玄奘往西天取经后，大唐盛世历经了千年繁荣。\n但随着时间的推移，流程真经逐渐被人们遗忘，结果导致妖魔入侵。\n而类却各自为政，人民生活和秩序遭到破坏，为了让生活重归秩序与繁荣。\n现任大唐董事，决定重选天命人，再次踏上了灵山，寻找流程真经之路。\n大唐董事为了找到天命人，便发布了《无字真书》，里面藏了七篇文章，只有解读出来之后，就会得到感召的力量，觉醒成为天命人。\n\t你在无意之中得到了《无字真书》，然而，它并非无字，当你翻开的时候，显入你眼里赫然是《流程密码》，你怀着好奇的心打开了它。\n\t此时，一阵精光大闪，你卷进了书里面，你看到的是一个来自未来的导师-章老师在向你讲解一些内容。\n\t你似乎可以听懂，不觉的惊讶，里面居然暗函天地运行的秩序和通向繁荣的关键，但你还是很混沌，里面不断提及到流程，但什么是流程，流程为何具备这么强大的力量。\n\t从而激起了你强烈的探索欲，你迫不及待地的想要揭示出什么是流程。\n			\N	\N	2025-08-19 16:53:10.229194+08	\N	\N		\N	markdown
52f543ed-da89-41ba-b1f8-a9efbc585ef8	117c673d-592b-4065-bece-8242543ab173	最终试炼	9			在没有流程管理的企业中，最常见的问题是什么？	{"A. 员工工作不饱和","B. 对“英雄”或“能人”的过度依赖","C. 部门预算过高","D. 企业创新能力不足"}	1	2025-08-19 17:23:58.947378+08	\N	\N		\N	markdown
5bb5133f-03e5-44b8-a90b-8bc4141bd134	5820de7a-fb7f-469f-8cf6-8d7b95a185de	流程驱动，智启未来。	0	1、随机分组或自由组合成5人小组。\n●为小组命名。\n●各成员以西游为题材，取个响亮的名字。\n2、抽取辩论题。\n3、小组讨论。\n4、代表分享。\n			\N	\N	2025-08-19 17:11:16.84349+08	\N	\N		\N	markdown
870b2ddf-c58f-426b-ba38-4c5c33b70b3b	117c673d-592b-4065-bece-8242543ab173	试炼3	2			从客户角度看，实施流程管理带来的最显著的价值是？	{"A. 产品价格更便宜","B. 获得更稳定、可预期的服务或产品","C. 公司内部沟通更顺畅","D. 企业品牌形象更好"}	1	2025-08-19 17:16:33.912574+08	\N	\N		\N	markdown
22d3a3a9-d72d-469e-af7f-4387b690b1a4	117c673d-592b-4065-bece-8242543ab173	试炼1	0			流程管理的核心价值是什么？	{"A. 降低成本","B. 提升客户满意度","C. 为客户创造价值","D. 标准化操作"}	2	2025-08-19 17:14:09.870418+08	\N	\N		\N	markdown
691d333b-07f4-4617-9201-3c607743610f	117c673d-592b-4065-bece-8242543ab173	试炼2	1			以下哪项不是流程管理的直接目标？	{"A. 提高效率","B. 增加企业利润","C. 优化资源配置","D. 增强组织协同"}	1	2025-08-19 17:15:10.699627+08	\N	\N		\N	markdown
0ad8e860-4ff0-4930-9408-b5d0d173d0d9	117c673d-592b-4065-bece-8242543ab173	试炼4	3			 “流程管理有助于企业快速响应市场变化”，这句话强调了流程管理的什么价值？	{"A. 成本领先","B. 运营卓越","C. 组织灵活性和敏捷性","D. 员工满意度"}	2	2025-08-19 17:17:56.342517+08	\N	\N		\N	markdown
4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e	117c673d-592b-4065-bece-8242543ab173	试炼5	4			为什么说流程管理是实现企业战略的桥梁？	{"A. 因为流程管理需要高层领导的支持","B. 因为流程管理能将战略目标分解为具体的、可执行的活动","C. 因为流程管理是一种先进的管理理念","D. 因为流程管理涉及到企业所有部门"}	1	2025-08-19 17:18:54.177742+08	\N	\N		\N	markdown
fe8762c2-82bf-4c86-9fc5-ad299d23f6eb	117c673d-592b-4065-bece-8242543ab173	试炼6	5			在流程管理中，“端到端”流程视角强调的是什么？	{"A. 从第一个部门到最后一个部门","B. 从收到客户需求到交付价值给客户","C. 从流程开始到流程结束的全部文件记录","D. 从IT系统的数据输入到数据输出"}	1	2025-08-19 17:19:55.560182+08	\N	\N		\N	markdown
126e2898-355a-47d2-aa1e-9f9a812ab8e6	117c673d-592b-4065-bece-8242543ab173	试炼7	6			关于流程、制度和表单的关系，以下说法最准确的是？	{"A. 流程是核心，制度和表单是流程的补充说明","B. 制度是管理的基础，流程必须符合制度规定","C. 流程定义“做什么、怎么做”，制度规定“不能做什么”，表单是执行的载体","D. 三者是独立的，企业可以根据需要选择性实施"}	2	2025-08-19 17:20:57.181199+08	\N	\N		\N	markdown
6969eed1-8855-4a0d-8cee-1dabf0d14206	117c673d-592b-4065-bece-8242543ab173	试炼8	7			引入流程管理后，对员工的主要价值体现在哪里？	{"A. 工作更有挑战性","B. 可以减少工作量","C. 工作职责更清晰，减少推诿扯皮","D. 可以更快地获得晋升"}	2	2025-08-19 17:21:57.600786+08	\N	\N		\N	markdown
764744f3-35d8-4051-8ed2-b06051e990a5	117c673d-592b-4065-bece-8242543ab173	试炼9	8			流程管理的持续优化（BPM）理念，强调了流程的什么特性？	{"A. 流程的静态性","B. 流程的生命周期特性","C. 流程的复杂性","D. 流程的保密性"}	1	2025-08-19 17:22:53.660766+08	\N	\N		\N	markdown
7a9d09b2-6270-4a21-8133-3521944b009e	851efde3-e8e1-48ea-9bdc-656ed9b0fce5	学习目标	0	通过本篇章学习能清晰了解流程，它和流程管理，业务流程，业务流程管理的区别。\n（流程的理解和定义有多个版本，本篇根据都市丽人《流程管理术语》中的定义进行学习）	\N	\N	\N	\N	2025-10-09 10:42:06.541453+08	\N	\N	\N	\N	markdown
07f7f37f-e77b-4943-b8c6-2af521ff65fb	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	用流程复制	0		https://upload.xjio.cn/filedown/f8dd0b8490bc41468cb0eb3ea2d05f78/1.先导片 用流程复制.mp4	\N	\N	\N	2025-08-19 16:57:09.829401+08	\N	\N	\N	\N	markdown
60576453-fd0a-4b09-8921-29422c51cfef	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	企业强弱看基因	4		https://upload.xjio.cn/filedown/cc6e4ca6a4a84c6f8a88476dc2e756f7/5.企业强弱看基因.mp4	\N	\N	\N	2025-08-19 17:08:49.269391+08	\N	\N	\N	\N	markdown
0d005ba5-45d8-4c3c-97ce-6743644400c5	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	企业成长的周期	2		https://upload.xjio.cn/filedown/e0c35a825fab48ba9a42b7f74449be75/3.企业成长的周期.mp4	\N	\N	\N	2025-08-19 17:07:31.868382+08	\N	\N	\N	\N	markdown
a88a1e23-6dd5-48f4-ad64-cdb385877014	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	差距的根源	5		https://upload.xjio.cn/filedown/228033ab21064508b81299880807f7ea/6.差距的根源.mp4	\N	\N	\N	2025-08-19 17:09:09.257729+08	\N	\N	\N	\N	markdown
86675d17-8ada-4127-9bcf-c4295ec30eb7	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	企业未来30年的挑战	6		https://upload.xjio.cn/filedown/41f8ddec09604821b062c16dd2d83612/7.企业未来30年的挑战.mp4	\N	\N	\N	2025-08-19 17:09:30.215678+08	\N	\N	\N	\N	markdown
29f1e54c-8dab-4168-b22e-dbab4303c00a	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	竞争的三个层级	3		https://upload.xjio.cn/filedown/90a8faffcf1e4f639237e75bbed4c162/4.竞争的三个层级.mp4	\N	\N	\N	2025-08-19 17:08:06.098895+08	\N	\N	\N	\N	markdown
0260f637-cf56-4efb-8300-b2a1c77df03d	e6fa35ff-70c7-47f1-aaca-f900e3a84e33	中外企业的差距	1		https://upload.xjio.cn/filedown/56b50da5ced24624914d7a561f89c960/2.中外企业的差距.mp4	\N	\N	\N	2025-08-19 17:04:25.047563+08	\N	\N	\N	\N	markdown
dd9d17fe-0899-4415-8c5e-02853758350b	f99cc679-04f9-4417-badd-07ed10b440e7	道心试练	0	正当你准备启程的时候，天降祥光，当光芒消失之后。\n\t你看见一个老翁站在你面前。\n\t“此去灵山取经，困难重重，路途遥远，若无坚定的信念和意志，恐将不成“\n\t你听着老翁喃喃自语，不知它欲意何为？\n\t只见老翁一挥手。\n\t你便进入到一个小黑屋。\n\t随后便听到，“当你的信念和意志坚定之后，自会有光明大道指引你出来。“\n\t你在小黑屋中，四处探索，想要走出小黑屋，但你发现无论走多远，好像都是在原地。\n\t由是你便静坐下来思考什么是流程管理？	\N	\N	\N	\N	2025-09-29 16:32:35.552039+08	\N	\N	\N	\N	markdown
7cc4fca9-eb7d-4832-8af2-247273817f54	bfc065ab-2881-4c50-a1d6-938a051941e7	123	0		\N	\N	\N	\N	2025-10-09 19:48:30.746116+08	\N	\N	\N	<!-- 最终修复版交互式学习HTML - 可直接复制到内容块中 -->\n<div id="interactiveLearning" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">\n    \n    <!-- 头部 -->\n    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 20px; text-align: center;">\n        <h2 style="margin: 0; font-size: 24px;">📚 交互式学习：流程管理基础</h2>\n        <p style="margin: 10px 0 0 0; opacity: 0.9;">通过对话式学习，逐步了解流程管理的核心概念</p>\n    </div>\n    \n    <!-- 进度条 -->\n    <div style="padding: 20px 20px 0 20px;">\n        <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">\n            <div id="learningProgressBar" style="height: 100%; background: linear-gradient(90deg, #4f46e5, #7c3aed); width: 20%; transition: width 0.3s ease;"></div>\n        </div>\n        <div style="text-align: center; margin: 10px 0; color: #6b7280; font-size: 14px;">\n            <span id="learningStepCounter">步骤 1 / 5</span>\n        </div>\n    </div>\n    \n    <!-- 学习内容 -->\n    <div style="padding: 20px; min-height: 400px;">\n        \n        <!-- 步骤1：什么是流程 -->\n        <div class="learn-step" data-step="1" style="display: block;">\n            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🤔 什么是流程？</h3>\n            <div style="line-height: 1.8; color: #374151;">\n                <p>让我们从一个简单的问题开始：<strong>什么是流程？</strong></p>\n                \n                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">\n                    <h4 style="color: #0369a1; margin-top: 0;">💡 流程的定义</h4>\n                    <p><strong>流程是一系列相互关联的活动，按照特定的顺序执行，以实现特定的目标或结果。</strong></p>\n                </div>\n                \n                <p>想象一下您每天早上起床的过程：</p>\n                <ul>\n                    <li>闹钟响起</li>\n                    <li>起床</li>\n                    <li>洗漱</li>\n                    <li>吃早餐</li>\n                    <li>出门上班</li>\n                </ul>\n                <p>这就是一个典型的<strong>日常流程</strong>！</p>\n            </div>\n        </div>\n\n        <!-- 步骤2：流程的特征 -->\n        <div class="learn-step" data-step="2" style="display: none;">\n            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🔍 流程的基本特征</h3>\n            <div style="line-height: 1.8; color: #374151;">\n                <p>每个有效的流程都具有以下基本特征：</p>\n                \n                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">\n                    <h4 style="color: #0369a1; margin-top: 0;">📋 流程的核心特征</h4>\n                    <ol>\n                        <li><strong>目标明确</strong>：每个流程都有明确的输出或结果</li>\n                        <li><strong>步骤有序</strong>：活动按照逻辑顺序执行</li>\n                        <li><strong>可重复</strong>：流程可以反复执行</li>\n                        <li><strong>可测量</strong>：可以用指标来衡量流程的效果</li>\n                    </ol>\n                </div>\n                \n                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">\n                    <h5 style="color: #92400e; margin-top: 0;">🌰 实际例子：咖啡制作流程</h5>\n                    <p><strong>目标</strong>：制作一杯美味的咖啡</p>\n                    <p><strong>步骤</strong>：研磨咖啡豆 → 加热水 → 冲泡 → 过滤 → 装杯</p>\n                </div>\n            </div>\n        </div>\n\n        <!-- 步骤3：什么是流程管理 -->\n        <div class="learn-step" data-step="3" style="display: none;">\n            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">⚙️ 什么是流程管理？</h3>\n            <div style="line-height: 1.8; color: #374151;">\n                <p>现在您已经了解了什么是流程，接下来让我们学习<strong>流程管理</strong>。</p>\n                \n                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">\n                    <h4 style="color: #0369a1; margin-top: 0;">🎯 流程管理的定义</h4>\n                    <p><strong>流程管理是对组织内各种业务流程进行规划、设计、执行、监控和优化的系统性管理活动。</strong></p>\n                </div>\n                \n                <p>流程管理的核心目标：</p>\n                <ul>\n                    <li><strong>提高效率</strong>：消除不必要的步骤，减少浪费</li>\n                    <li><strong>保证质量</strong>：确保每个步骤都按照标准执行</li>\n                    <li><strong>降低成本</strong>：通过优化流程减少资源消耗</li>\n                    <li><strong>增强一致性</strong>：确保每次执行都得到相同的结果</li>\n                </ul>\n            </div>\n        </div>\n\n        <!-- 步骤4：什么是业务流程 -->\n        <div class="learn-step" data-step="4" style="display: none;">\n            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🏢 什么是业务流程？</h3>\n            <div style="line-height: 1.8; color: #374151;">\n                <p>在组织中，我们经常听到<strong>业务流程</strong>这个术语。</p>\n                \n                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">\n                    <h4 style="color: #0369a1; margin-top: 0;">💼 业务流程的定义</h4>\n                    <p><strong>业务流程是为了实现特定业务目标而设计的一系列标准化活动，通常跨越多个部门或功能区域。</strong></p>\n                </div>\n                \n                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">\n                    <h5 style="color: #92400e; margin-top: 0;">📦 客户服务流程示例</h5>\n                    <p><strong>涉及部门</strong>：客服部、技术部、财务部</p>\n                    <ol>\n                        <li>客户提交问题</li>\n                        <li>客服部门初步处理</li>\n                        <li>技术部门提供解决方案</li>\n                        <li>财务部门处理退款（如需要）</li>\n                        <li>客户满意度调查</li>\n                    </ol>\n                </div>\n            </div>\n        </div>\n\n        <!-- 步骤5：总结 -->\n        <div class="learn-step" data-step="5" style="display: none;">\n            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🎉 学习总结</h3>\n            <div style="line-height: 1.8; color: #374151;">\n                <p>恭喜您完成了流程管理基础学习！让我们回顾一下今天学到的内容：</p>\n                \n                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">\n                    <h4 style="color: #0369a1; margin-top: 0;">📚 知识要点回顾</h4>\n                    <ul>\n                        <li><strong>流程</strong>：一系列相互关联的活动，按照特定顺序执行</li>\n                        <li><strong>流程管理</strong>：对业务流程进行规划、设计、执行、监控和优化</li>\n                        <li><strong>业务流程</strong>：跨部门的标准化活动，以实现业务目标</li>\n                    </ul>\n                </div>\n                \n                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">\n                    <h5 style="color: #92400e; margin-top: 0;">🤔 思考题</h5>\n                    <ol>\n                        <li>您的工作中有哪些常见的流程？</li>\n                        <li>这些流程是否还有改进的空间？</li>\n                        <li>如何衡量一个流程的效果？</li>\n                    </ol>\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <!-- 导航按钮 -->\n    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f9fafb; border-top: 1px solid #e5e7eb;">\n        <button id="learnPrevBtn" disabled style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; opacity: 0.5;">← 上一步</button>\n        <button id="learnNextBtn" style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">下一步 →</button>\n    </div>\n</div>\n\n<script>\n(function() {\n    var currentStep = 1;\n    var totalSteps = 5;\n\n    function changeStep(direction) {\n        currentStep += direction;\n        \n        if (currentStep < 1) currentStep = 1;\n        if (currentStep > totalSteps) currentStep = totalSteps;\n        \n        updateDisplay();\n        \n        if (currentStep === totalSteps && direction === 1) {\n            setTimeout(function() {\n                alert('🎉 恭喜您完成了流程管理基础学习！');\n            }, 500);\n        }\n    }\n\n    function updateDisplay() {\n        // 更新步骤显示\n        var steps = document.querySelectorAll('#interactiveLearning .learn-step');\n        for (var i = 0; i < steps.length; i++) {\n            steps[i].style.display = 'none';\n        }\n        var currentStepEl = document.querySelector('#interactiveLearning .learn-step[data-step="' + currentStep + '"]');\n        if (currentStepEl) {\n            currentStepEl.style.display = 'block';\n        }\n        \n        // 更新进度条\n        var progress = (currentStep / totalSteps) * 100;\n        var progressBar = document.getElementById('learningProgressBar');\n        if (progressBar) {\n            progressBar.style.width = progress + '%';\n        }\n        \n        // 更新步骤计数器\n        var counter = document.getElementById('learningStepCounter');\n        if (counter) {\n            counter.textContent = '步骤 ' + currentStep + ' / ' + totalSteps;\n        }\n        \n        // 更新按钮\n        var prevBtn = document.getElementById('learnPrevBtn');\n        var nextBtn = document.getElementById('learnNextBtn');\n        \n        if (prevBtn) {\n            prevBtn.disabled = currentStep === 1;\n            prevBtn.style.opacity = currentStep === 1 ? '0.5' : '1';\n            prevBtn.style.cursor = currentStep === 1 ? 'not-allowed' : 'pointer';\n        }\n        \n        if (nextBtn) {\n            if (currentStep === totalSteps) {\n                nextBtn.textContent = '完成学习 ✓';\n                nextBtn.style.background = '#10b981';\n            } else {\n                nextBtn.textContent = '下一步 →';\n                nextBtn.style.background = '#4f46e5';\n            }\n        }\n    }\n\n    // 绑定按钮事件\n    document.getElementById('learnPrevBtn').addEventListener('click', function() {\n        changeStep(-1);\n    });\n    \n    document.getElementById('learnNextBtn').addEventListener('click', function() {\n        changeStep(1);\n    });\n\n    // 初始化\n    updateDisplay();\n})();\n</script>	html
717de790-a699-44ed-9275-4cc97878b61f	851efde3-e8e1-48ea-9bdc-656ed9b0fce5	流程的定义	0		\N	\N	\N	\N	2025-10-11 15:52:05.384437+08	\N	\N	\N	<script type="application/json" data-conversation>\n{\n  "title": "流程管理基础概念详解",\n  "conversations": [\n    {\n      "id": 1,\n      "type": "text",\n      "content": "嗨！今天我们来聊聊流程管理的基础概念，这是企业规范运作的重要基石哦！"\n    },\n    {\n      "id": 2,\n      "type": "text",\n      "content": "流程就像做菜的食谱，通过一系列有序活动，将输入转化为有价值的输出。"\n    },\n    {\n      "id": 3,\n      "type": "text",\n      "content": "它承载着公司政策、质量管理、内控等要求，是企业管理的核心支撑体系。"\n    },\n    {\n      "id": 4,\n      "type": "text",\n      "content": "记住：流程不是政策，但必须遵从政策；流程也不等于IT，IT只是固化关键动作。"\n    },\n    {\n      "id": 5,\n      "type": "test",\n      "question": "关于流程的描述，以下哪项最准确？",\n      "options": [\n        "流程就是公司的政策文件",\n        "流程是通过有序活动将输入转化为有价值输出的业务运作规则",\n        "流程等同于IT系统",\n        "流程只是形式化的文档"\n      ],\n      "correctAnswer": 1,\n      "explanation": "完全正确！流程是通过可重复、有逻辑顺序的活动，将输入转换为明确、可度量、有价值输出的业务运作规则。"\n    },\n    {\n      "id": 6,\n      "type": "text",\n      "content": "流程文件有六种类型：手册、程序、规范、指导书、模板和检查表，各司其职。"\n    },\n    {\n      "id": 7,\n      "type": "text",\n      "content": "程序文件是流程的骨架，描述必须执行的活动和要求，包括流程图和说明。"\n    },\n    {\n      "id": 8,\n      "type": "text",\n      "content": "规范文件是程序的补充，详述必须遵从的要求；指导书则提供建议性的方法。"\n    },\n    {\n      "id": 9,\n      "type": "text",\n      "content": "模板确保输出一致性，检查表保证工作质量，它们都是流程执行的重要工具。"\n    },\n    {\n      "id": 10,\n      "type": "test",\n      "question": "以下哪种流程文件描述的是必须执行的活动和要求？",\n      "options": [\n        "操作指导书",\n        "模板文件",\n        "程序文件",\n        "检查表"\n      ],\n      "correctAnswer": 2,\n      "explanation": "答对了！程序文件是流程基本要素的定义文件，描述且仅描述流程中必须执行的活动和必须遵循的要求。"\n    },\n    {\n      "id": 11,\n      "type": "text",\n      "content": "流程分为六个层级：从L1流程分类到L6任务，层层细化，便于管理和执行。"\n    },\n    {\n      "id": 12,\n      "type": "text",\n      "content": "L1流程分类体现公司价值链，L3流程是执行核心，L5活动落实到具体角色。"\n    },\n    {\n      "id": 13,\n      "type": "text",\n      "content": "流程管理是持续改进的过程，包括规划、设计、执行、监控、评估到废止的全生命周期。"\n    },\n    {\n      "id": 14,\n      "type": "text",\n      "content": "掌握这些基础概念，你就能更好地理解和参与企业的流程管理工作啦！"\n    }\n  ]\n}\n</script>\n<div class="conversation-learning-container">\n    <p>正在加载对话学习内容...</p>\n</div>	html
292a589d-5587-47b6-8c86-9881f5a38465	851efde3-e8e1-48ea-9bdc-656ed9b0fce5	流程管理的定义	1		\N	\N	\N	\N	2025-10-11 16:24:39.954765+08	\N	\N	\N	<script type="application/json" data-conversation>\n{\n  "title": "流程管理基础概念详解",\n  "conversations": [\n    {\n      "id": 1,\n      "type": "text",\n      "content": "嗨！今天我们来聊聊流程管理的基础概念，这是企业规范运作的重要基石哦！"\n    },\n    {\n      "id": 2,\n      "type": "text",\n      "content": "流程就像做菜的食谱，通过一系列有序活动，将输入转化为有价值的输出。"\n    },\n    {\n      "id": 3,\n      "type": "text",\n      "content": "它承载着公司政策、质量管理、内控等要求，是企业管理的核心支撑体系。"\n    },\n    {\n      "id": 4,\n      "type": "text",\n      "content": "记住：流程不是政策，但必须遵从政策；流程也不等于IT，IT只是固化关键动作。"\n    },\n    {\n      "id": 5,\n      "type": "test",\n      "question": "关于流程的描述，以下哪项最准确？",\n      "options": [\n        "流程就是公司的政策文件",\n        "流程是通过有序活动将输入转化为有价值输出的业务运作规则",\n        "流程等同于IT系统",\n        "流程只是形式化的文档"\n      ],\n      "correctAnswer": 1,\n      "explanation": "完全正确！流程是通过可重复、有逻辑顺序的活动，将输入转换为明确、可度量、有价值输出的业务运作规则。"\n    },\n    {\n      "id": 6,\n      "type": "text",\n      "content": "流程文件有六种类型：手册、程序、规范、指导书、模板和检查表，各司其职。"\n    },\n    {\n      "id": 7,\n      "type": "text",\n      "content": "程序文件是流程的骨架，描述必须执行的活动和要求，包括流程图和说明。"\n    },\n    {\n      "id": 8,\n      "type": "text",\n      "content": "规范文件是程序的补充，详述必须遵从的要求；指导书则提供建议性的方法。"\n    },\n    {\n      "id": 9,\n      "type": "text",\n      "content": "模板确保输出一致性，检查表保证工作质量，它们都是流程执行的重要工具。"\n    },\n    {\n      "id": 10,\n      "type": "test",\n      "question": "以下哪种流程文件描述的是必须执行的活动和要求？",\n      "options": [\n        "操作指导书",\n        "模板文件",\n        "程序文件",\n        "检查表"\n      ],\n      "correctAnswer": 2,\n      "explanation": "答对了！程序文件是流程基本要素的定义文件，描述且仅描述流程中必须执行的活动和必须遵循的要求。"\n    },\n    {\n      "id": 11,\n      "type": "text",\n      "content": "流程分为六个层级：从L1流程分类到L6任务，层层细化，便于管理和执行。"\n    },\n    {\n      "id": 12,\n      "type": "text",\n      "content": "L1流程分类体现公司价值链，L3流程是执行核心，L5活动落实到具体角色。"\n    },\n    {\n      "id": 13,\n      "type": "text",\n      "content": "流程管理是持续改进的过程，包括规划、设计、执行、监控、评估到废止的全生命周期。"\n    },\n    {\n      "id": 14,\n      "type": "text",\n      "content": "掌握这些基础概念，你就能更好地理解和参与企业的流程管理工作啦！"\n    }\n  ]\n}\n</script>\n<div class="conversation-learning-container">\n    <p>正在加载对话学习内容...</p>\n</div>	html
\.


--
-- TOC entry 4230 (class 0 OID 18884)
-- Dependencies: 256
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, title, description, "order", created_at) FROM stdin;
e527bd29-c854-4297-bd06-19a01ef6eff7	觉醒篇	初识流程	0	2025-08-19 16:47:57.615538+08
6679258c-679d-4e00-a970-9bd6db35ade6	基础篇	流程浮现	1	2025-09-28 15:51:36.525639+08
\.


--
-- TOC entry 4231 (class 0 OID 18892)
-- Dependencies: 257
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.challenges (id, title, description, start_date, end_date, target_category_id, reward_points, is_active, created_at) FROM stdin;
6349bac2-15f4-48e3-bd3b-e20167f7c60a	天命觉醒启程	个副本开启：为你的阵营而战！\n个人的修行能铸就传奇，但阵营的荣耀方可成就史诗！首个团队试炼的大门现已敞开，这不再是孤军奋战，而是考验整个阵营谋略、协作与勇气的巅峰对决。	2025-09-01 09:13:00+08	2025-09-08 09:13:00+08	e527bd29-c854-4297-bd06-19a01ef6eff7	5	t	2025-09-01 09:22:29.651702+08
\.


--
-- TOC entry 4232 (class 0 OID 18901)
-- Dependencies: 258
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters (id, category_id, title, description, image_url, "order", created_at) FROM stdin;
91a7a32d-e139-4977-8aa6-877db9dc0308	e527bd29-c854-4297-bd06-19a01ef6eff7	天命人觉醒			0	2025-08-19 16:48:50.776342+08
46555e69-87e4-4270-97f9-d133b2438044	6679258c-679d-4e00-a970-9bd6db35ade6	流程道心试练	当你完成了《流程密码》前7篇时，一道精光从你身上直冲天庭。\n\t此时，正在查阅奏折的大唐董事，被惊动。\n\t”天命人终于出现了“。\n大唐董事看着光的方向激动的说道。\n不久，便有人将你带到了大唐董事的面前。\n\t看着你充满闪烁的智慧眼睛，大唐董事有预感，大唐必定将重建秩序和繁荣。\n\t由是，在大唐董事和国民的期待下，你再次踏上了取经之路。	\N	0	2025-09-29 16:32:00.903754+08
\.


--
-- TOC entry 4264 (class 0 OID 19543)
-- Dependencies: 294
-- Data for Name: conversation_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversation_content (id, title, description, content_format, content_html, conversation_data, created_by, created_at, updated_at, is_published) FROM stdin;
1	BPMN流程建模基础	学习业务流程建模的基本概念和实际应用	html	<script type="application/json" data-conversation>\n{\n    "title": "BPMN流程建模基础",\n    "description": "学习业务流程建模的基本概念和实际应用", \n    "conversations": [\n        {"id": 1, "type": "text", "content": "你好！今天我们来学习BPMN流程建模基础。", "points": 2},\n        {"id": 2, "type": "text", "content": "BPMN是Business Process Model and Notation的缩写，中文叫业务流程建模标记法。", "points": 2},\n        {"id": 3, "type": "text", "content": "它是一种图形化的表示法，用来描述业务流程中的步骤。", "points": 2},\n        {"id": 4, "type": "image", "content": "让我们看看BPMN的基本元素：", "imageUrl": "/assets/images/bpmn-elements.png", "imageAlt": "BPMN基本元素图", "points": 3},\n        {"id": 5, "type": "test", "content": "让我们来测试一下你的理解！", "question": "以下哪个不是BPMN的基本元素？", "options": ["事件（Events）", "活动（Activities）", "数据对象（Data Objects）", "网关（Gateways）"], "correctAnswer": 2, "explanation": "数据对象是BPMN的辅助元素，不是四大基本元素之一。四大基本元素是：事件、活动、网关和连接对象。", "points": 5}\n    ]\n}\n</script>	{"title": "BPMN流程建模基础", "description": "学习业务流程建模的基本概念和实际应用", "conversations": [{"id": 1, "type": "text", "points": 2, "content": "你好！今天我们来学习BPMN流程建模基础。"}, {"id": 2, "type": "text", "points": 2, "content": "BPMN是Business Process Model and Notation的缩写，中文叫业务流程建模标记法。"}, {"id": 3, "type": "text", "points": 2, "content": "它是一种图形化的表示法，用来描述业务流程中的步骤。"}, {"id": 4, "type": "image", "points": 3, "content": "让我们看看BPMN的基本元素：", "imageAlt": "BPMN基本元素图", "imageUrl": "/assets/images/bpmn-elements.png"}, {"id": 5, "type": "test", "points": 5, "content": "让我们来测试一下你的理解！", "options": ["事件（Events）", "活动（Activities）", "数据对象（Data Objects）", "网关（Gateways）"], "question": "以下哪个不是BPMN的基本元素？", "explanation": "数据对象是BPMN的辅助元素，不是四大基本元素之一。四大基本元素是：事件、活动、网关和连接对象。", "correctAnswer": 2}]}	admin	2025-10-10 10:31:48.953985+08	2025-10-10 10:31:48.953985+08	t
\.


--
-- TOC entry 4260 (class 0 OID 19510)
-- Dependencies: 290
-- Data for Name: conversation_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.conversation_progress (id, user_id, content_block_id, current_step, total_steps, progress_percentage, points_earned, completed_tests, is_completed, conversation_data, created_at, updated_at, last_accessed_at) FROM stdin;
\.


--
-- TOC entry 4233 (class 0 OID 18909)
-- Dependencies: 259
-- Data for Name: factions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.factions (id, code, name, description, color, is_active, sort_order, created_at, updated_at) FROM stdin;
1	it_dept	IT技术部	负责技术开发和系统维护	#FF5733	t	1	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
2	im_dept	信息管理部	负责信息管理和数据分析	#33FF57	t	2	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
3	pmo_dept	项目综合管理部	负责项目管理和协调	#3357FF	t	3	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
4	dm_dept	数据管理部	负责数据管理和治理	#FF33F5	t	4	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
5	strategy_dept	战略管理部	负责战略规划和决策	#F5FF33	t	5	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
6	logistics_dept	物流IT部	负责物流信息化建设	#33FFF5	t	6	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
7	aoc_dept	项目AOC	负责项目运营中心	#FF8C33	t	7	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
8	3333_dept	3333部门	特殊项目部门	#8C33FF	t	8	2025-09-04 17:29:50.434891+08	2025-09-04 17:29:50.434891+08
\.


--
-- TOC entry 4235 (class 0 OID 18919)
-- Dependencies: 261
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, role, updated_at, faction, full_name) FROM stdin;
30345913-b52f-4cd0-b314-c8fb90ddb5c8	admin	2025-09-04 17:49:56.844607+08	im_dept	hkpking
209e9e9c-77c7-4c70-b2de-1c260b5b9e66	user	2025-10-11 12:00:01.62624+08	im_dept	W
ea14ad8d-3212-4e06-aacb-9c48ceb0070d	user	2025-10-11 15:08:57.303281+08	dm_dept	刘广
015c5f49-19ea-49bf-bed8-083f7383beaa	user	2025-10-11 17:34:23.967381+08	im_dept	张军平
8463876b-55ef-4c31-b9b7-b6426fab2fcd	user	2025-09-17 17:10:20.630184+08	im_dept	喻明忠
e8b2066d-1abb-45f2-aa37-952efbecb061	user	2025-10-11 17:52:35.881314+08	\N	乐江磊
cacb1509-5fb4-4509-898d-38dd8d4d23be	user	2025-09-26 18:15:49.600351+08	im_dept	黄大虫
8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd	user	2025-10-11 17:52:43.905985+08	3333_dept	刘仁策
77823c57-6072-497d-93a0-a60fce816f3a	user	2025-09-27 09:19:39.772237+08	dm_dept	邓志雄
77d0e868-e6db-484c-96a0-f071c6ab6689	user	2025-09-27 14:22:25.318265+08	it_dept	梁毅坚
2322b6af-192b-4a79-9e6e-d38dd592df6f	user	2025-10-11 17:53:54.326519+08	3333_dept	杨子渝
3ad62335-583b-4fc7-bff3-5792d545f7ec	user	2025-09-30 16:35:31.666508+08	im_dept	傅武龙
7187cf5e-58ec-44c0-a1f0-c6a75806f9c8	user	2025-10-11 17:54:41.914833+08	im_dept	乐江磊
57d88a71-dde2-4b30-8fe8-b1d911e23067	user	2025-10-11 10:37:20.144335+08	im_dept	刘加双
f906e11b-bd21-4b80-9cd5-1ed28ef4d028	user	2025-10-11 17:57:13.072103+08	aoc_dept	zz
4aa35680-7d31-44e6-b879-db4636ee8a11	user	2025-10-11 10:45:16.33019+08	im_dept	杨智恒
c986bfcb-dd8e-456b-a257-c18b202639db	user	2025-10-11 10:45:22.956948+08	im_dept	陈勇
1b9ec97c-26a8-438b-bcda-7aa1e64e7e89	user	2025-10-11 10:52:42.208903+08	im_dept	陈锦萍
5e7bba9d-1d2c-42de-a62f-dee737b23765	user	2025-10-11 10:54:20.155256+08	dm_dept	舒乐
52236e5e-deb1-485a-bdf0-d9bfd3e63df8	user	2025-10-11 11:04:01.294179+08	im_dept	陈茂腾
f58f80be-5b80-43e5-9ecd-17789a903907	user	2025-10-11 11:14:31.319765+08	im_dept	李奇恒
72ebb535-b6f6-4571-8ddd-f832009834dd	user	2025-10-11 11:17:38.223682+08	im_dept	W
\.


--
-- TOC entry 4236 (class 0 OID 18926)
-- Dependencies: 262
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scores (username, points, user_id) FROM stdin;
liqiheng@cosmo-lady.com	190	f58f80be-5b80-43e5-9ecd-17789a903907
liuguang@cosmo-lady.com.cn	0	ea14ad8d-3212-4e06-aacb-9c48ceb0070d
chenmaoteng@cosmo-lady.com	90	52236e5e-deb1-485a-bdf0-d9bfd3e63df8
yuejianglei@cosmo-lady.com.cn	10	7187cf5e-58ec-44c0-a1f0-c6a75806f9c8
yangziyu@cosmo-lady.com.cn	90	2322b6af-192b-4a79-9e6e-d38dd592df6f
yumingzhong@cosmo-lady.com	100	8463876b-55ef-4c31-b9b7-b6426fab2fcd
hkpking01@example.com	0	cacb1509-5fb4-4509-898d-38dd8d4d23be
dengzhixiong@cosmo-lady.com.cn	0	77823c57-6072-497d-93a0-a60fce816f3a
liangyijian@cosmo-lady.com	60	77d0e868-e6db-484c-96a0-f071c6ab6689
fuwulong@cosmo-lady.com.cn	0	3ad62335-583b-4fc7-bff3-5792d545f7ec
zhangjunping@cosmo-lady.com	100	015c5f49-19ea-49bf-bed8-083f7383beaa
yuejainglei@cosmo-lady.com.cn	0	e8b2066d-1abb-45f2-aa37-952efbecb061
hkpking@example.com	100	30345913-b52f-4cd0-b314-c8fb90ddb5c8
liujiashuanga@cosmo-lady.com.cn	0	57d88a71-dde2-4b30-8fe8-b1d911e23067
yangzhiheng@cosmo-lady.com	0	4aa35680-7d31-44e6-b879-db4636ee8a11
chenjinping@cosmo-lady.com.cn	0	1b9ec97c-26a8-438b-bcda-7aa1e64e7e89
shule@cosmo-lady.com.cn	0	5e7bba9d-1d2c-42de-a62f-dee737b23765
wenyuanfeng@cosmo-lady.com.cn	0	209e9e9c-77c7-4c70-b2de-1c260b5b9e66
1458574484@qq.com	0	72ebb535-b6f6-4571-8ddd-f832009834dd
chenyonga@cosmo-lady.com	100	c986bfcb-dd8e-456b-a257-c18b202639db
zhangdongliang@cosmo-lady.com	30	f906e11b-bd21-4b80-9cd5-1ed28ef4d028
liurence@cosmo-lady.com	100	8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd
\.


--
-- TOC entry 4237 (class 0 OID 18932)
-- Dependencies: 263
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, chapter_id, title, "order", created_at) FROM stdin;
3388f27f-28e7-4f77-b030-3b1e729a0061	91a7a32d-e139-4977-8aa6-877db9dc0308	故事内容	0	2025-08-19 16:49:03.471227+08
e6fa35ff-70c7-47f1-aaca-f900e3a84e33	91a7a32d-e139-4977-8aa6-877db9dc0308	知识学习	1	2025-08-19 16:54:34.396483+08
5820de7a-fb7f-469f-8cf6-8d7b95a185de	91a7a32d-e139-4977-8aa6-877db9dc0308	业务实践	2	2025-08-19 16:55:19.124201+08
117c673d-592b-4065-bece-8242543ab173	91a7a32d-e139-4977-8aa6-877db9dc0308	关卡试炼	3	2025-08-19 16:55:51.312056+08
f99cc679-04f9-4417-badd-07ed10b440e7	46555e69-87e4-4270-97f9-d133b2438044	故事内容	0	2025-09-29 16:32:12.076188+08
851efde3-e8e1-48ea-9bdc-656ed9b0fce5	46555e69-87e4-4270-97f9-d133b2438044	知识学习	1	2025-09-29 16:33:08.939556+08
bfc065ab-2881-4c50-a1d6-938a051941e7	46555e69-87e4-4270-97f9-d133b2438044	业务实践	2	2025-09-29 16:33:35.683977+08
b6948952-7ad4-410f-b0c6-ef0ec33c02dd	46555e69-87e4-4270-97f9-d133b2438044	关卡试炼	4	2025-09-29 16:33:53.911007+08
\.


--
-- TOC entry 4238 (class 0 OID 18940)
-- Dependencies: 264
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_achievements (id, user_id, achievement_id, earned_at) FROM stdin;
\.


--
-- TOC entry 4239 (class 0 OID 18945)
-- Dependencies: 265
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_badges (id, user_id, badge_id, awarded_at, context) FROM stdin;
\.


--
-- TOC entry 4262 (class 0 OID 19532)
-- Dependencies: 292
-- Data for Name: user_points_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_points_history (id, user_id, points, source_type, source_id, description, created_at) FROM stdin;
\.


--
-- TOC entry 4241 (class 0 OID 18952)
-- Dependencies: 267
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_progress (user_id, completed_sections, updated_at, awarded_points_sections, completed_blocks, awarded_points_blocks) FROM stdin;
77d0e868-e6db-484c-96a0-f071c6ab6689	[]	2025-09-27 18:04:09.970764+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
8463876b-55ef-4c31-b9b7-b6426fab2fcd	[]	2025-09-17 17:13:30.727391+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
cacb1509-5fb4-4509-898d-38dd8d4d23be	[]	2025-09-26 18:15:19.648671+08	[]	{}	{}
3ad62335-583b-4fc7-bff3-5792d545f7ec	[]	2025-09-30 16:35:14.566823+08	[]	{}	{}
77823c57-6072-497d-93a0-a60fce816f3a	[]	2025-09-27 09:53:04.252892+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb}	{}
2322b6af-192b-4a79-9e6e-d38dd592df6f	[]	2025-10-13 10:04:27.20577+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
4aa35680-7d31-44e6-b879-db4636ee8a11	[]	2025-10-11 10:45:06.560742+08	[]	{}	{}
52236e5e-deb1-485a-bdf0-d9bfd3e63df8	[]	2025-10-11 18:08:07.247992+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
1b9ec97c-26a8-438b-bcda-7aa1e64e7e89	[]	2025-10-11 10:52:28.271086+08	[]	{}	{}
5e7bba9d-1d2c-42de-a62f-dee737b23765	[]	2025-10-11 10:54:39.29514+08	[]	{e573db83-941a-46f8-af64-82832cee8768}	{}
f58f80be-5b80-43e5-9ecd-17789a903907	[]	2025-10-11 11:29:23.130895+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
72ebb535-b6f6-4571-8ddd-f832009834dd	[]	2025-10-11 11:16:58.244649+08	[]	{}	{}
209e9e9c-77c7-4c70-b2de-1c260b5b9e66	[]	2025-10-11 14:18:34.42801+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7}	{}
ea14ad8d-3212-4e06-aacb-9c48ceb0070d	[]	2025-10-11 15:09:33.659038+08	[]	{e573db83-941a-46f8-af64-82832cee8768}	{}
57d88a71-dde2-4b30-8fe8-b1d911e23067	[]	2025-10-11 18:04:28.089447+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d}	{}
30345913-b52f-4cd0-b314-c8fb90ddb5c8	[]	2025-10-11 17:16:07.165281+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8,dd9d17fe-0899-4415-8c5e-02853758350b,7a9d09b2-6270-4a21-8133-3521944b009e,3b62e5a1-da42-4d86-9d15-01a37411d0a7,3068f470-08b7-445a-82fb-fc3d46aba700,c69d5dc1-6e7c-462f-8651-cf7eaa310d88,48eb8b92-d59f-42b4-9c29-0d3f6b0ccbb4,e01995e2-a42b-4c37-aed3-644165f9a0d7,a9237b3f-c345-4ebb-8d9d-bf97be47f14d,28fe4fa0-aa35-4716-aba1-0ab3aa76af30,15582ca0-6142-49bd-9185-168b05961574,d8683f09-8d8c-4663-85ea-c866b71676d2,191880f2-5f4f-4d09-b298-98ee239ebe61,039016e4-4de8-47c4-a1fe-0946b99338c3,6899681c-3097-44a0-958f-154cd0565a7d,2a44b2bd-54bd-43b5-bfee-00cc2f848cb0,717de790-a699-44ed-9275-4cc97878b61f,292a589d-5587-47b6-8c86-9881f5a38465}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
e8b2066d-1abb-45f2-aa37-952efbecb061	[]	2025-10-11 17:52:35.881314+08	[]	{}	{}
7187cf5e-58ec-44c0-a1f0-c6a75806f9c8	[]	2025-10-13 09:14:55.606342+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f}	{691d333b-07f4-4617-9201-3c607743610f}
015c5f49-19ea-49bf-bed8-083f7383beaa	[]	2025-10-11 17:53:33.34801+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8,dd9d17fe-0899-4415-8c5e-02853758350b,7a9d09b2-6270-4a21-8133-3521944b009e,717de790-a699-44ed-9275-4cc97878b61f,292a589d-5587-47b6-8c86-9881f5a38465,7cc4fca9-eb7d-4832-8af2-247273817f54}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
f906e11b-bd21-4b80-9cd5-1ed28ef4d028	[]	2025-10-11 17:59:29.925353+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b}
c986bfcb-dd8e-456b-a257-c18b202639db	[]	2025-10-11 17:57:01.974395+08	[]	{e573db83-941a-46f8-af64-82832cee8768,07f7f37f-e77b-4943-b8c6-2af521ff65fb,0260f637-cf56-4efb-8300-b2a1c77df03d,0d005ba5-45d8-4c3c-97ce-6743644400c5,29f1e54c-8dab-4168-b22e-dbab4303c00a,60576453-fd0a-4b09-8921-29422c51cfef,a88a1e23-6dd5-48f4-ad64-cdb385877014,86675d17-8ada-4127-9bcf-c4295ec30eb7,5bb5133f-03e5-44b8-a90b-8bc4141bd134,22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}	{22d3a3a9-d72d-469e-af7f-4387b690b1a4,691d333b-07f4-4617-9201-3c607743610f,870b2ddf-c58f-426b-ba38-4c5c33b70b3b,0ad8e860-4ff0-4930-9408-b5d0d173d0d9,4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e,fe8762c2-82bf-4c86-9fc5-ad299d23f6eb,126e2898-355a-47d2-aa1e-9f9a812ab8e6,6969eed1-8855-4a0d-8cee-1dabf0d14206,764744f3-35d8-4051-8ed2-b06051e990a5,52f543ed-da89-41ba-b1f8-a9efbc585ef8}
8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd	[]	2025-10-11 18:02:49.935504+08	[]	{}	{}
\.


--
-- TOC entry 4242 (class 0 OID 18967)
-- Dependencies: 269
-- Data for Name: messages_2025_08_27; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_27 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4243 (class 0 OID 18976)
-- Dependencies: 270
-- Data for Name: messages_2025_08_28; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_28 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4244 (class 0 OID 18985)
-- Dependencies: 271
-- Data for Name: messages_2025_08_29; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_29 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4245 (class 0 OID 18994)
-- Dependencies: 272
-- Data for Name: messages_2025_08_30; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_30 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4246 (class 0 OID 19003)
-- Dependencies: 273
-- Data for Name: messages_2025_08_31; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_31 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4247 (class 0 OID 19012)
-- Dependencies: 274
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-07-05 02:58:35
20211116045059	2025-07-05 02:58:35
20211116050929	2025-07-05 02:58:35
20211116051442	2025-07-05 02:58:35
20211116212300	2025-07-05 02:58:35
20211116213355	2025-07-05 02:58:35
20211116213934	2025-07-05 02:58:35
20211116214523	2025-07-05 02:58:35
20211122062447	2025-07-05 02:58:35
20211124070109	2025-07-05 02:58:35
20211202204204	2025-07-05 02:58:35
20211202204605	2025-07-05 02:58:35
20211210212804	2025-07-05 02:58:35
20211228014915	2025-07-05 02:58:35
20220107221237	2025-07-05 02:58:35
20220228202821	2025-07-05 02:58:35
20220312004840	2025-07-05 02:58:35
20220603231003	2025-07-05 02:58:35
20220603232444	2025-07-05 02:58:35
20220615214548	2025-07-05 02:58:35
20220712093339	2025-07-05 02:58:35
20220908172859	2025-07-05 02:58:35
20220916233421	2025-07-05 02:58:35
20230119133233	2025-07-05 02:58:35
20230128025114	2025-07-05 02:58:35
20230128025212	2025-07-05 02:58:35
20230227211149	2025-07-05 02:58:35
20230228184745	2025-07-05 02:58:36
20230308225145	2025-07-05 02:58:36
20230328144023	2025-07-05 02:58:36
20231018144023	2025-07-05 02:58:36
20231204144023	2025-07-05 02:58:36
20231204144024	2025-07-05 02:58:36
20231204144025	2025-07-05 02:58:36
20240108234812	2025-07-05 02:58:36
20240109165339	2025-07-05 02:58:36
20240227174441	2025-07-05 02:58:36
20240311171622	2025-07-05 02:58:36
20240321100241	2025-07-05 02:58:36
20240401105812	2025-07-05 02:58:36
20240418121054	2025-07-05 02:58:36
20240523004032	2025-07-05 02:58:36
20240618124746	2025-07-05 02:58:36
20240801235015	2025-07-05 02:58:36
20240805133720	2025-07-05 02:58:36
20240827160934	2025-07-05 02:58:36
20240919163303	2025-07-05 02:58:36
20240919163305	2025-07-05 02:58:36
20241019105805	2025-07-05 02:58:36
20241030150047	2025-07-05 02:58:36
20241108114728	2025-07-05 02:58:36
20241121104152	2025-07-05 02:58:36
20241130184212	2025-07-05 02:58:36
20241220035512	2025-07-05 02:58:36
20241220123912	2025-07-05 02:58:36
20241224161212	2025-07-05 02:58:36
20250107150512	2025-07-05 02:58:36
20250110162412	2025-07-05 02:58:36
20250123174212	2025-07-05 02:58:36
20250128220012	2025-07-05 02:58:36
20250506224012	2025-07-05 02:58:36
20250523164012	2025-07-05 02:58:36
20250714121412	2025-07-18 10:44:47
\.


--
-- TOC entry 4248 (class 0 OID 19015)
-- Dependencies: 275
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4250 (class 0 OID 19024)
-- Dependencies: 277
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
lcxx	lcxx	\N	2025-07-07 20:07:34.74911+08	2025-07-07 20:07:34.74911+08	t	f	\N	\N	\N	STANDARD
lc	lc	\N	2025-07-08 15:04:58.775963+08	2025-07-08 15:04:58.775963+08	f	f	52428800	{video/*}	\N	STANDARD
\.


--
-- TOC entry 4251 (class 0 OID 19034)
-- Dependencies: 278
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4252 (class 0 OID 19043)
-- Dependencies: 279
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-05 02:58:36.505468
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-05 02:58:36.514006
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-05 02:58:36.523834
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-05 02:58:36.549207
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-05 02:58:36.566507
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-05 02:58:36.580496
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-05 02:58:36.591754
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-05 02:58:36.602654
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-05 02:58:36.612446
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-05 02:58:36.622001
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-05 02:58:36.629735
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-05 02:58:36.636494
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-05 02:58:36.64539
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-05 02:58:36.653518
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-05 02:58:36.662137
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-05 02:58:36.712663
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-05 02:58:36.717889
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-05 02:58:36.724624
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-05 02:58:36.730082
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-05 02:58:36.745547
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-05 02:58:36.757202
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-05 02:58:36.764396
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-05 02:58:36.80681
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-05 02:58:36.823663
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-05 02:58:36.832287
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-05 02:58:36.837839
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-27 11:05:55.287147
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-27 11:05:55.467244
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-27 11:05:55.484921
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-27 11:05:55.569519
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-27 11:05:55.871396
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-27 11:05:56.371572
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-27 11:05:56.384789
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-27 11:05:56.469564
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-27 11:05:56.474795
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-27 11:05:56.48314
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-27 11:05:56.49009
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-27 11:05:56.589796
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-27 11:05:56.771925
\.


--
-- TOC entry 4253 (class 0 OID 19047)
-- Dependencies: 280
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
cde8cfe0-43e3-45e4-a60f-af86cfa5ce7b	lcxx	.emptyFolderPlaceholder	\N	2025-07-08 15:02:48.440369+08	2025-08-27 19:05:55.675975+08	2025-07-08 15:02:48.440369+08	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-07-08T07:02:49.000Z", "contentLength": 0, "httpStatusCode": 200}	eb1be209-d3a2-4592-8e22-18c4d1a3d5be	\N	{}	1
6139fa92-0913-4129-aeca-e7f03249cdba	lcxx	Gemini_Generated_Image_b2j5rlb2j5rlb2j5.png	\N	2025-07-14 10:46:22.878976+08	2025-08-27 19:05:55.675975+08	2025-07-14 10:46:22.878976+08	{"eTag": "\\"b634c357cf89b1aef69189c4df43b490-1\\"", "size": 6164010, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-07-14T02:46:22.000Z", "contentLength": 6164010, "httpStatusCode": 200}	ed520f7f-0b1d-4bb1-a963-11efafb4f777	\N	\N	1
\.


--
-- TOC entry 4254 (class 0 OID 19057)
-- Dependencies: 281
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4255 (class 0 OID 19065)
-- Dependencies: 282
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4256 (class 0 OID 19072)
-- Dependencies: 283
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4257 (class 0 OID 19080)
-- Dependencies: 284
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
\.


--
-- TOC entry 4258 (class 0 OID 19085)
-- Dependencies: 285
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- TOC entry 3637 (class 0 OID 19439)
-- Dependencies: 286
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4315 (class 0 OID 0)
-- Dependencies: 245
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 677, true);


--
-- TOC entry 4316 (class 0 OID 0)
-- Dependencies: 293
-- Name: conversation_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conversation_content_id_seq', 1, true);


--
-- TOC entry 4317 (class 0 OID 0)
-- Dependencies: 289
-- Name: conversation_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.conversation_progress_id_seq', 1, false);


--
-- TOC entry 4318 (class 0 OID 0)
-- Dependencies: 260
-- Name: factions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.factions_id_seq', 1, false);


--
-- TOC entry 4319 (class 0 OID 0)
-- Dependencies: 266
-- Name: user_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_badges_id_seq', 1, false);


--
-- TOC entry 4320 (class 0 OID 0)
-- Dependencies: 291
-- Name: user_points_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_points_history_id_seq', 1, false);


--
-- TOC entry 4321 (class 0 OID 0)
-- Dependencies: 276
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 3794 (class 2606 OID 19093)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 3778 (class 2606 OID 19095)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3782 (class 2606 OID 19097)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 3787 (class 2606 OID 19099)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 3789 (class 2606 OID 19101)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 3792 (class 2606 OID 19103)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 3796 (class 2606 OID 19105)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 3799 (class 2606 OID 19107)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3802 (class 2606 OID 19109)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 3804 (class 2606 OID 19111)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 3809 (class 2606 OID 19113)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3817 (class 2606 OID 19115)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3820 (class 2606 OID 19117)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 3823 (class 2606 OID 19119)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 3825 (class 2606 OID 19121)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3830 (class 2606 OID 19123)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3833 (class 2606 OID 19125)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3836 (class 2606 OID 19127)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3841 (class 2606 OID 19129)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 3844 (class 2606 OID 19131)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3856 (class 2606 OID 19133)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3858 (class 2606 OID 19135)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3860 (class 2606 OID 19137)
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- TOC entry 3862 (class 2606 OID 19139)
-- Name: achievements achievements_trigger_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_trigger_key_key UNIQUE (trigger_key);


--
-- TOC entry 3864 (class 2606 OID 19141)
-- Name: badges badges_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_name_key UNIQUE (name);


--
-- TOC entry 3866 (class 2606 OID 19143)
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3868 (class 2606 OID 19145)
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- TOC entry 3870 (class 2606 OID 19147)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3872 (class 2606 OID 19149)
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3876 (class 2606 OID 19151)
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- TOC entry 3967 (class 2606 OID 19555)
-- Name: conversation_content conversation_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_content
    ADD CONSTRAINT conversation_content_pkey PRIMARY KEY (id);


--
-- TOC entry 3953 (class 2606 OID 19528)
-- Name: conversation_progress conversation_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_progress
    ADD CONSTRAINT conversation_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3955 (class 2606 OID 19530)
-- Name: conversation_progress conversation_progress_user_id_content_block_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_progress
    ADD CONSTRAINT conversation_progress_user_id_content_block_id_key UNIQUE (user_id, content_block_id);


--
-- TOC entry 3878 (class 2606 OID 19153)
-- Name: factions factions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factions
    ADD CONSTRAINT factions_code_key UNIQUE (code);


--
-- TOC entry 3880 (class 2606 OID 19155)
-- Name: factions factions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factions
    ADD CONSTRAINT factions_pkey PRIMARY KEY (id);


--
-- TOC entry 3884 (class 2606 OID 19157)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3886 (class 2606 OID 19159)
-- Name: scores scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3888 (class 2606 OID 19161)
-- Name: scores scores_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_user_id_key UNIQUE (user_id);


--
-- TOC entry 3890 (class 2606 OID 19163)
-- Name: scores scores_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_username_key UNIQUE (username);


--
-- TOC entry 3892 (class 2606 OID 19165)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3894 (class 2606 OID 19167)
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- TOC entry 3896 (class 2606 OID 19169)
-- Name: user_achievements user_achievements_user_achievement_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_achievement_unique UNIQUE (user_id, achievement_id);


--
-- TOC entry 3898 (class 2606 OID 19171)
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3965 (class 2606 OID 19541)
-- Name: user_points_history user_points_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_points_history
    ADD CONSTRAINT user_points_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3901 (class 2606 OID 19173)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3903 (class 2606 OID 19175)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3905 (class 2606 OID 19177)
-- Name: messages_2025_08_27 messages_2025_08_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_27
    ADD CONSTRAINT messages_2025_08_27_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3907 (class 2606 OID 19179)
-- Name: messages_2025_08_28 messages_2025_08_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_28
    ADD CONSTRAINT messages_2025_08_28_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3909 (class 2606 OID 19181)
-- Name: messages_2025_08_29 messages_2025_08_29_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_29
    ADD CONSTRAINT messages_2025_08_29_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3911 (class 2606 OID 19183)
-- Name: messages_2025_08_30 messages_2025_08_30_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_30
    ADD CONSTRAINT messages_2025_08_30_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3913 (class 2606 OID 19185)
-- Name: messages_2025_08_31 messages_2025_08_31_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_31
    ADD CONSTRAINT messages_2025_08_31_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3918 (class 2606 OID 19187)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 3915 (class 2606 OID 19189)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3924 (class 2606 OID 19191)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 3922 (class 2606 OID 19193)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 3926 (class 2606 OID 19195)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 3928 (class 2606 OID 19197)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3936 (class 2606 OID 19199)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 3939 (class 2606 OID 19201)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 3944 (class 2606 OID 19203)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 3942 (class 2606 OID 19205)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 3946 (class 2606 OID 19207)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3948 (class 2606 OID 19209)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 3779 (class 1259 OID 19210)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 3846 (class 1259 OID 19211)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3847 (class 1259 OID 19212)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3848 (class 1259 OID 19213)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3800 (class 1259 OID 19214)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 3780 (class 1259 OID 19215)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 3785 (class 1259 OID 19216)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4322 (class 0 OID 0)
-- Dependencies: 3785
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3790 (class 1259 OID 19217)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 3783 (class 1259 OID 19218)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 3784 (class 1259 OID 19219)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 3797 (class 1259 OID 19220)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 3805 (class 1259 OID 19221)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 3806 (class 1259 OID 19222)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 3810 (class 1259 OID 19223)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 3811 (class 1259 OID 19224)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 3812 (class 1259 OID 19225)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 3849 (class 1259 OID 19226)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3850 (class 1259 OID 19227)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3813 (class 1259 OID 19228)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 3814 (class 1259 OID 19229)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 3815 (class 1259 OID 19230)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 3818 (class 1259 OID 19231)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 3821 (class 1259 OID 19232)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 3826 (class 1259 OID 19233)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 3827 (class 1259 OID 19234)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 3828 (class 1259 OID 19235)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 3831 (class 1259 OID 19236)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 3834 (class 1259 OID 19237)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 3837 (class 1259 OID 19238)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 3839 (class 1259 OID 19239)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 3842 (class 1259 OID 19240)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 3845 (class 1259 OID 19241)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 3807 (class 1259 OID 19242)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 3838 (class 1259 OID 19243)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 3851 (class 1259 OID 19244)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4323 (class 0 OID 0)
-- Dependencies: 3851
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 3852 (class 1259 OID 19245)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 3853 (class 1259 OID 19246)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 3854 (class 1259 OID 19247)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 3873 (class 1259 OID 19248)
-- Name: idx_challenges_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_challenges_dates ON public.challenges USING btree (start_date, end_date);


--
-- TOC entry 3874 (class 1259 OID 19249)
-- Name: idx_challenges_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_challenges_is_active ON public.challenges USING btree (is_active);


--
-- TOC entry 3968 (class 1259 OID 19566)
-- Name: idx_conversation_content_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_content_created ON public.conversation_content USING btree (created_at DESC);


--
-- TOC entry 3969 (class 1259 OID 19564)
-- Name: idx_conversation_content_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_content_created_by ON public.conversation_content USING btree (created_by);


--
-- TOC entry 3970 (class 1259 OID 19565)
-- Name: idx_conversation_content_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_content_published ON public.conversation_content USING btree (is_published);


--
-- TOC entry 3956 (class 1259 OID 19557)
-- Name: idx_conversation_progress_block_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_progress_block_id ON public.conversation_progress USING btree (content_block_id);


--
-- TOC entry 3957 (class 1259 OID 19558)
-- Name: idx_conversation_progress_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_progress_completed ON public.conversation_progress USING btree (is_completed);


--
-- TOC entry 3958 (class 1259 OID 19559)
-- Name: idx_conversation_progress_updated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_progress_updated ON public.conversation_progress USING btree (updated_at DESC);


--
-- TOC entry 3959 (class 1259 OID 19560)
-- Name: idx_conversation_progress_user_block; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_progress_user_block ON public.conversation_progress USING btree (user_id, content_block_id);


--
-- TOC entry 3960 (class 1259 OID 19556)
-- Name: idx_conversation_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_progress_user_id ON public.conversation_progress USING btree (user_id);


--
-- TOC entry 3881 (class 1259 OID 19250)
-- Name: idx_factions_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factions_active ON public.factions USING btree (is_active);


--
-- TOC entry 3882 (class 1259 OID 19251)
-- Name: idx_factions_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factions_code ON public.factions USING btree (code);


--
-- TOC entry 3961 (class 1259 OID 19563)
-- Name: idx_user_points_history_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_points_history_created ON public.user_points_history USING btree (created_at DESC);


--
-- TOC entry 3962 (class 1259 OID 19562)
-- Name: idx_user_points_history_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_points_history_source ON public.user_points_history USING btree (source_type, source_id);


--
-- TOC entry 3963 (class 1259 OID 19561)
-- Name: idx_user_points_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_points_history_user_id ON public.user_points_history USING btree (user_id);


--
-- TOC entry 3899 (class 1259 OID 19252)
-- Name: user_challenge_badge_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_challenge_badge_unique_idx ON public.user_badges USING btree (user_id, badge_id, ((context ->> 'challenge_id'::text)));


--
-- TOC entry 3916 (class 1259 OID 19253)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 3919 (class 1259 OID 19254)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 3920 (class 1259 OID 19255)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 3929 (class 1259 OID 19256)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 3940 (class 1259 OID 19257)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 3930 (class 1259 OID 19258)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 3931 (class 1259 OID 19259)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 3932 (class 1259 OID 19260)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 3937 (class 1259 OID 19261)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 3933 (class 1259 OID 19262)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 3934 (class 1259 OID 19264)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 3971 (class 0 OID 0)
-- Name: messages_2025_08_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_27_pkey;


--
-- TOC entry 3972 (class 0 OID 0)
-- Name: messages_2025_08_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_28_pkey;


--
-- TOC entry 3973 (class 0 OID 0)
-- Name: messages_2025_08_29_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_29_pkey;


--
-- TOC entry 3974 (class 0 OID 0)
-- Name: messages_2025_08_30_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_30_pkey;


--
-- TOC entry 3975 (class 0 OID 0)
-- Name: messages_2025_08_31_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_31_pkey;


--
-- TOC entry 4003 (class 2620 OID 19265)
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- TOC entry 4013 (class 2620 OID 19569)
-- Name: conversation_content update_conversation_content_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_conversation_content_updated_at BEFORE UPDATE ON public.conversation_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4012 (class 2620 OID 19568)
-- Name: conversation_progress update_conversation_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_conversation_progress_updated_at BEFORE UPDATE ON public.conversation_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4004 (class 2620 OID 19266)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4005 (class 2620 OID 19267)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4006 (class 2620 OID 19268)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4007 (class 2620 OID 19269)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 4008 (class 2620 OID 19270)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- TOC entry 4010 (class 2620 OID 19271)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 4011 (class 2620 OID 19272)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4009 (class 2620 OID 19273)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 3976 (class 2606 OID 19274)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3977 (class 2606 OID 19279)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3978 (class 2606 OID 19284)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 3979 (class 2606 OID 19289)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3980 (class 2606 OID 19294)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3981 (class 2606 OID 19299)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3982 (class 2606 OID 19304)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3983 (class 2606 OID 19309)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 19314)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3985 (class 2606 OID 19319)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3986 (class 2606 OID 19324)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 3987 (class 2606 OID 19329)
-- Name: blocks blocks_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- TOC entry 3988 (class 2606 OID 19334)
-- Name: challenges challenges_target_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_target_category_id_fkey FOREIGN KEY (target_category_id) REFERENCES public.categories(id);


--
-- TOC entry 3989 (class 2606 OID 19339)
-- Name: chapters chapters_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3990 (class 2606 OID 19344)
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3991 (class 2606 OID 19349)
-- Name: scores scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3992 (class 2606 OID 19354)
-- Name: sections sections_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- TOC entry 3993 (class 2606 OID 19359)
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- TOC entry 3994 (class 2606 OID 19364)
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3995 (class 2606 OID 19369)
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- TOC entry 3996 (class 2606 OID 19374)
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 3997 (class 2606 OID 19379)
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3998 (class 2606 OID 19384)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 3999 (class 2606 OID 19389)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4000 (class 2606 OID 19394)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4001 (class 2606 OID 19399)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4002 (class 2606 OID 19404)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4163 (class 0 OID 18761)
-- Dependencies: 236
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4164 (class 0 OID 18767)
-- Dependencies: 237
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4165 (class 0 OID 18772)
-- Dependencies: 238
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4166 (class 0 OID 18779)
-- Dependencies: 239
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4167 (class 0 OID 18784)
-- Dependencies: 240
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4168 (class 0 OID 18789)
-- Dependencies: 241
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4169 (class 0 OID 18794)
-- Dependencies: 242
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4170 (class 0 OID 18799)
-- Dependencies: 243
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4171 (class 0 OID 18807)
-- Dependencies: 244
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4172 (class 0 OID 18813)
-- Dependencies: 246
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4173 (class 0 OID 18821)
-- Dependencies: 247
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4174 (class 0 OID 18827)
-- Dependencies: 248
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4175 (class 0 OID 18830)
-- Dependencies: 249
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4176 (class 0 OID 18835)
-- Dependencies: 250
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4177 (class 0 OID 18841)
-- Dependencies: 251
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4178 (class 0 OID 18847)
-- Dependencies: 252
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4196 (class 3256 OID 19409)
-- Name: achievements Allow all users to read achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all users to read achievements" ON public.achievements FOR SELECT USING (true);


--
-- TOC entry 4204 (class 3256 OID 19410)
-- Name: scores Allow all users to read scores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all users to read scores" ON public.scores FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- TOC entry 4203 (class 3256 OID 19411)
-- Name: scores Allow individual user to insert their own score; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow individual user to insert their own score" ON public.scores FOR INSERT WITH CHECK ((auth.email() = username));


--
-- TOC entry 4202 (class 3256 OID 19412)
-- Name: scores Allow individual user to update their own score; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow individual user to update their own score" ON public.scores FOR UPDATE USING ((auth.email() = username)) WITH CHECK ((auth.email() = username));


--
-- TOC entry 4201 (class 3256 OID 19413)
-- Name: scores Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.scores FOR SELECT USING (true);


--
-- TOC entry 4206 (class 3256 OID 19414)
-- Name: user_progress Allow users to manage their own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to manage their own progress" ON public.user_progress USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4205 (class 3256 OID 19415)
-- Name: user_achievements Allow users to read their own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to read their own achievements" ON public.user_achievements FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4200 (class 3256 OID 19416)
-- Name: profiles Allow users to view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- TOC entry 4199 (class 3256 OID 19417)
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- TOC entry 4198 (class 3256 OID 19418)
-- Name: profiles Users can update their own profile.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- TOC entry 4197 (class 3256 OID 19419)
-- Name: profiles Users can view their own profile.; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- TOC entry 4179 (class 0 OID 18862)
-- Dependencies: 253
-- Name: achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4180 (class 0 OID 18876)
-- Dependencies: 255
-- Name: blocks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4181 (class 0 OID 18884)
-- Dependencies: 256
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4182 (class 0 OID 18901)
-- Dependencies: 258
-- Name: chapters; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4183 (class 0 OID 18919)
-- Dependencies: 261
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4184 (class 0 OID 18926)
-- Dependencies: 262
-- Name: scores; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4185 (class 0 OID 18932)
-- Dependencies: 263
-- Name: sections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4186 (class 0 OID 18940)
-- Dependencies: 264
-- Name: user_achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4187 (class 0 OID 18952)
-- Dependencies: 267
-- Name: user_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4188 (class 0 OID 18960)
-- Dependencies: 268
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4189 (class 0 OID 19024)
-- Dependencies: 277
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4190 (class 0 OID 19034)
-- Dependencies: 278
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4191 (class 0 OID 19043)
-- Dependencies: 279
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4192 (class 0 OID 19047)
-- Dependencies: 280
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4193 (class 0 OID 19057)
-- Dependencies: 281
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4194 (class 0 OID 19065)
-- Dependencies: 282
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4195 (class 0 OID 19072)
-- Dependencies: 283
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4207 (class 6104 OID 19420)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4208 (class 6104 OID 19421)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4209 (class 6106 OID 19422)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- TOC entry 3629 (class 3466 OID 19429)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- TOC entry 3630 (class 3466 OID 19430)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- TOC entry 3631 (class 3466 OID 19431)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- TOC entry 3632 (class 3466 OID 19432)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- TOC entry 3633 (class 3466 OID 19433)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- TOC entry 3634 (class 3466 OID 19434)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


-- Completed on 2025-10-13 15:50:50

--
-- PostgreSQL database dump complete
--

\unrestrict 7GOW5iesOA9GG0hXcHhRJLikmwpq9SnqZa22GQNdj44VVdczshqFa5db3i92kn1

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict tMnbga1yXdTk71nUF3Y7cEdb9xWxUBj1oPMYc0jigAXk8Hm2G6dHssBfvbVd1N3

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-13 15:50:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 17 (class 2615 OID 16521)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- TOC entry 18 (class 2615 OID 16522)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- TOC entry 11 (class 2615 OID 16388)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- TOC entry 12 (class 2615 OID 16523)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- TOC entry 13 (class 2615 OID 16524)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- TOC entry 15 (class 2615 OID 17862)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 4261 (class 0 OID 0)
-- Dependencies: 15
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 19 (class 2615 OID 16525)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- TOC entry 9 (class 2615 OID 16526)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- TOC entry 16 (class 2615 OID 16527)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- TOC entry 14 (class 2615 OID 16473)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4262 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 6 (class 3079 OID 17410)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4263 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 5 (class 3079 OID 17447)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4264 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 16474)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4265 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 4 (class 3079 OID 17484)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4266 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1032 (class 1247 OID 16529)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1035 (class 1247 OID 16536)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1038 (class 1247 OID 16542)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1041 (class 1247 OID 16548)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1044 (class 1247 OID 16556)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1047 (class 1247 OID 16570)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1050 (class 1247 OID 16582)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1053 (class 1247 OID 16599)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- TOC entry 1056 (class 1247 OID 16602)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- TOC entry 1059 (class 1247 OID 16605)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- TOC entry 1165 (class 1247 OID 17496)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- TOC entry 338 (class 1255 OID 16606)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4267 (class 0 OID 0)
-- Dependencies: 338
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 300 (class 1255 OID 16607)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 347 (class 1255 OID 16608)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4268 (class 0 OID 0)
-- Dependencies: 347
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 295 (class 1255 OID 16609)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4269 (class 0 OID 0)
-- Dependencies: 295
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 375 (class 1255 OID 16610)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4270 (class 0 OID 0)
-- Dependencies: 375
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 320 (class 1255 OID 16611)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4271 (class 0 OID 0)
-- Dependencies: 320
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 366 (class 1255 OID 16612)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4272 (class 0 OID 0)
-- Dependencies: 366
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 391 (class 1255 OID 16613)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 304 (class 1255 OID 16614)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 335 (class 1255 OID 16615)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4273 (class 0 OID 0)
-- Dependencies: 335
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 403 (class 1255 OID 16616)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 408 (class 1255 OID 16627)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 390 (class 1255 OID 16630)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 334 (class 1255 OID 16631)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 332 (class 1255 OID 16632)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 294 (class 1255 OID 16633)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 392 (class 1255 OID 16634)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 387 (class 1255 OID 16635)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 333 (class 1255 OID 16636)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 370 (class 1255 OID 16637)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 383 (class 1255 OID 16638)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 346 (class 1255 OID 16639)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 319 (class 1255 OID 16640)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 345 (class 1255 OID 17511)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- TOC entry 407 (class 1255 OID 16641)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 358 (class 1255 OID 17512)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- TOC entry 372 (class 1255 OID 17513)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- TOC entry 357 (class 1255 OID 17514)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- TOC entry 405 (class 1255 OID 16642)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 373 (class 1255 OID 16643)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 303 (class 1255 OID 16644)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- TOC entry 310 (class 1255 OID 17515)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 298 (class 1255 OID 17516)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- TOC entry 314 (class 1255 OID 17517)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- TOC entry 384 (class 1255 OID 16645)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 394 (class 1255 OID 16646)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 371 (class 1255 OID 16647)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 311 (class 1255 OID 17518)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 385 (class 1255 OID 17519)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 336 (class 1255 OID 16648)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 339 (class 1255 OID 17520)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- TOC entry 396 (class 1255 OID 16649)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 367 (class 1255 OID 17521)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 326 (class 1255 OID 17522)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 349 (class 1255 OID 17523)
-- Name: search_v2(text, text, integer, integer, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$_$;


--
-- TOC entry 307 (class 1255 OID 16650)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 237 (class 1259 OID 16651)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4274 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 238 (class 1259 OID 16657)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- TOC entry 4275 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 239 (class 1259 OID 16662)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 4276 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4277 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 240 (class 1259 OID 16669)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- TOC entry 4278 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 241 (class 1259 OID 16674)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- TOC entry 4279 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 242 (class 1259 OID 16679)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- TOC entry 4280 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 243 (class 1259 OID 16684)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- TOC entry 4281 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 244 (class 1259 OID 16689)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- TOC entry 245 (class 1259 OID 16697)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- TOC entry 4282 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 246 (class 1259 OID 16702)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4283 (class 0 OID 0)
-- Dependencies: 246
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 247 (class 1259 OID 16703)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- TOC entry 4284 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 248 (class 1259 OID 16711)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- TOC entry 4285 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 249 (class 1259 OID 16717)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- TOC entry 4286 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 250 (class 1259 OID 16720)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- TOC entry 4287 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4288 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 251 (class 1259 OID 16725)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- TOC entry 4289 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 252 (class 1259 OID 16731)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- TOC entry 4290 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4291 (class 0 OID 0)
-- Dependencies: 252
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 253 (class 1259 OID 16737)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- TOC entry 4292 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4293 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 289 (class 1259 OID 17978)
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    icon_url character varying(500),
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 290 (class 1259 OID 17988)
-- Name: badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    icon_url character varying(500),
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 288 (class 1259 OID 17963)
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_id uuid,
    title character varying(255) NOT NULL,
    content_markdown text,
    video_url character varying(500),
    quiz_question text,
    quiz_options jsonb,
    correct_answer_index integer,
    pdf_url character varying(500),
    document_url character varying(500),
    ppt_url character varying(500),
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    content text,
    type character varying(50) DEFAULT 'text'::character varying,
    points integer DEFAULT 0,
    is_required boolean DEFAULT false,
    content_format character varying(20) DEFAULT 'markdown'::character varying NOT NULL,
    content_html text
);


--
-- TOC entry 4294 (class 0 OID 0)
-- Dependencies: 288
-- Name: COLUMN blocks.content_format; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.blocks.content_format IS '内容格式: markdown/html';


--
-- TOC entry 285 (class 1259 OID 17925)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 291 (class 1259 OID 17997)
-- Name: challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 286 (class 1259 OID 17935)
-- Name: chapters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid,
    title character varying(255) NOT NULL,
    description text,
    image_url character varying(500),
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 282 (class 1259 OID 17877)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    role text DEFAULT 'user'::text,
    faction text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 283 (class 1259 OID 17892)
-- Name: scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scores (
    user_id uuid NOT NULL,
    username character varying(255) NOT NULL,
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 287 (class 1259 OID 17950)
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chapter_id uuid,
    title character varying(255) NOT NULL,
    "order" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 292 (class 1259 OID 18007)
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    user_id uuid NOT NULL,
    achievement_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 293 (class 1259 OID 18023)
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    user_id uuid NOT NULL,
    badge_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 284 (class 1259 OID 17907)
-- Name: user_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_progress (
    user_id uuid NOT NULL,
    completed_sections jsonb DEFAULT '[]'::jsonb,
    completed_blocks jsonb DEFAULT '{}'::jsonb,
    awarded_points_sections jsonb DEFAULT '[]'::jsonb,
    awarded_points_blocks jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 281 (class 1259 OID 17863)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email_confirmed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    role character varying(255) DEFAULT 'authenticated'::character varying,
    aud character varying(255) DEFAULT 'authenticated'::character varying
);


--
-- TOC entry 254 (class 1259 OID 16840)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- TOC entry 255 (class 1259 OID 16847)
-- Name: messages_2025_08_08; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_08 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 256 (class 1259 OID 16856)
-- Name: messages_2025_08_09; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_09 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 16865)
-- Name: messages_2025_08_10; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_10 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 258 (class 1259 OID 16874)
-- Name: messages_2025_08_11; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_11 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 259 (class 1259 OID 16883)
-- Name: messages_2025_08_12; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 260 (class 1259 OID 16892)
-- Name: messages_2025_08_13; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_13 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 261 (class 1259 OID 16901)
-- Name: messages_2025_08_14; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_14 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 274 (class 1259 OID 17612)
-- Name: messages_2025_08_27; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_27 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 275 (class 1259 OID 17621)
-- Name: messages_2025_08_28; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_28 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 276 (class 1259 OID 17630)
-- Name: messages_2025_08_29; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_29 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 277 (class 1259 OID 17639)
-- Name: messages_2025_08_30; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_30 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 278 (class 1259 OID 17648)
-- Name: messages_2025_08_31; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_08_31 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 262 (class 1259 OID 16910)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- TOC entry 263 (class 1259 OID 16913)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- TOC entry 264 (class 1259 OID 16921)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 265 (class 1259 OID 16922)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


--
-- TOC entry 4295 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 279 (class 1259 OID 17657)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 266 (class 1259 OID 16931)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 267 (class 1259 OID 16935)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- TOC entry 4296 (class 0 OID 0)
-- Dependencies: 267
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 280 (class 1259 OID 17666)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 268 (class 1259 OID 16945)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- TOC entry 269 (class 1259 OID 16952)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 270 (class 1259 OID 16960)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- TOC entry 271 (class 1259 OID 16965)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- TOC entry 3641 (class 0 OID 0)
-- Name: messages_2025_08_08; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_08 FOR VALUES FROM ('2025-08-08 00:00:00') TO ('2025-08-09 00:00:00');


--
-- TOC entry 3642 (class 0 OID 0)
-- Name: messages_2025_08_09; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_09 FOR VALUES FROM ('2025-08-09 00:00:00') TO ('2025-08-10 00:00:00');


--
-- TOC entry 3643 (class 0 OID 0)
-- Name: messages_2025_08_10; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_10 FOR VALUES FROM ('2025-08-10 00:00:00') TO ('2025-08-11 00:00:00');


--
-- TOC entry 3644 (class 0 OID 0)
-- Name: messages_2025_08_11; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_11 FOR VALUES FROM ('2025-08-11 00:00:00') TO ('2025-08-12 00:00:00');


--
-- TOC entry 3645 (class 0 OID 0)
-- Name: messages_2025_08_12; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_12 FOR VALUES FROM ('2025-08-12 00:00:00') TO ('2025-08-13 00:00:00');


--
-- TOC entry 3646 (class 0 OID 0)
-- Name: messages_2025_08_13; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_13 FOR VALUES FROM ('2025-08-13 00:00:00') TO ('2025-08-14 00:00:00');


--
-- TOC entry 3647 (class 0 OID 0)
-- Name: messages_2025_08_14; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_14 FOR VALUES FROM ('2025-08-14 00:00:00') TO ('2025-08-15 00:00:00');


--
-- TOC entry 3648 (class 0 OID 0)
-- Name: messages_2025_08_27; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_27 FOR VALUES FROM ('2025-08-27 00:00:00') TO ('2025-08-28 00:00:00');


--
-- TOC entry 3649 (class 0 OID 0)
-- Name: messages_2025_08_28; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_28 FOR VALUES FROM ('2025-08-28 00:00:00') TO ('2025-08-29 00:00:00');


--
-- TOC entry 3650 (class 0 OID 0)
-- Name: messages_2025_08_29; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_29 FOR VALUES FROM ('2025-08-29 00:00:00') TO ('2025-08-30 00:00:00');


--
-- TOC entry 3651 (class 0 OID 0)
-- Name: messages_2025_08_30; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_30 FOR VALUES FROM ('2025-08-30 00:00:00') TO ('2025-08-31 00:00:00');


--
-- TOC entry 3652 (class 0 OID 0)
-- Name: messages_2025_08_31; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_08_31 FOR VALUES FROM ('2025-08-31 00:00:00') TO ('2025-09-01 00:00:00');


--
-- TOC entry 3663 (class 2604 OID 17684)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4202 (class 0 OID 16651)
-- Dependencies: 237
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	a4d47e58-16c6-4109-845b-1dfa6591d546	{"action":"user_signedup","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-05 12:36:57.472183+08	
00000000-0000-0000-0000-000000000000	19c84c08-6376-47a6-aec6-a4a8231041d8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:36:57.478648+08	
00000000-0000-0000-0000-000000000000	e0ee5c84-2b33-4678-8450-0287b2bf6df0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:37:23.104844+08	
00000000-0000-0000-0000-000000000000	a538dee4-c6be-4219-b9ae-45f843a19468	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:41:53.737418+08	
00000000-0000-0000-0000-000000000000	fbd72a8e-d60c-4643-820d-fe490395c4b4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:41:59.616467+08	
00000000-0000-0000-0000-000000000000	c9bc6643-d492-44f7-9745-3872d928f644	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:42:20.541291+08	
00000000-0000-0000-0000-000000000000	e5452e89-aed1-4045-a122-80de1e8ee3f9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 12:42:26.729986+08	
00000000-0000-0000-0000-000000000000	4720ab01-d66a-4e1c-b565-d9e48b34161d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 12:44:04.076378+08	
00000000-0000-0000-0000-000000000000	a0e57dc2-bd9f-4763-9fa3-98d5dbcb5ea6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:26:36.287118+08	
00000000-0000-0000-0000-000000000000	080b4a9a-93f8-48e0-99b1-5ab3f2df1088	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:26:44.661845+08	
00000000-0000-0000-0000-000000000000	c326d5f5-d1d4-4537-9a45-22e61f463b90	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:37:59.142073+08	
00000000-0000-0000-0000-000000000000	d4cd6bd9-f6f4-4ccc-b372-2d859d8d219b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 13:46:53.519965+08	
00000000-0000-0000-0000-000000000000	5595a1a0-0791-4778-a3b2-3ef6f38be74f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:05:42.307448+08	
00000000-0000-0000-0000-000000000000	d6d11916-bee5-4309-842d-da6f2af4b304	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:07:58.482837+08	
00000000-0000-0000-0000-000000000000	36f6907c-4fe3-4088-a537-3fa18c44564a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:08:14.82199+08	
00000000-0000-0000-0000-000000000000	26df3a60-41c5-4370-a012-7916298b6390	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:10:56.802275+08	
00000000-0000-0000-0000-000000000000	a3e99239-4336-4bc0-9d8e-1df92e185f62	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:18:17.71398+08	
00000000-0000-0000-0000-000000000000	e45a2d24-c695-46aa-84e6-0c0a4072c862	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:24:36.412961+08	
00000000-0000-0000-0000-000000000000	48be702e-4f7a-4037-84d1-83e153453f2c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:28:01.489021+08	
00000000-0000-0000-0000-000000000000	790d8949-1a6f-4e90-b4eb-f6bca791786c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:34:08.27524+08	
00000000-0000-0000-0000-000000000000	b5edf1f8-089d-48ef-809e-cedc02ce6d16	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:38:31.249961+08	
00000000-0000-0000-0000-000000000000	caf2445c-f1a3-4691-aaee-97cd45630a8c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:39:55.759328+08	
00000000-0000-0000-0000-000000000000	167e3c9e-1241-44ba-9fe5-3550ca85479d	{"action":"user_signedup","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-05 14:40:23.975454+08	
00000000-0000-0000-0000-000000000000	85803953-58d6-49da-a8d3-eeb40c62c12c	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:40:23.979162+08	
00000000-0000-0000-0000-000000000000	4cad4290-b84a-4889-9491-ea910673f358	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:40:53.85477+08	
00000000-0000-0000-0000-000000000000	38427762-1913-40c9-b9a5-d22927576362	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:44:49.3295+08	
00000000-0000-0000-0000-000000000000	a987c3c3-8aab-4094-8801-824b334d7c61	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 14:45:13.017507+08	
00000000-0000-0000-0000-000000000000	bc75e2ab-9e81-47f3-8e82-dd95ecbd357d	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 14:45:24.116592+08	
00000000-0000-0000-0000-000000000000	2eb43a92-5c94-4b2b-89df-c3ddb1d4286f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:01:36.743445+08	
00000000-0000-0000-0000-000000000000	2fd0d1f2-1080-4de9-951a-75cc192b1174	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 15:02:08.404872+08	
00000000-0000-0000-0000-000000000000	056a069a-7f7f-4696-878e-7e2da18c65fd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:02:10.809943+08	
00000000-0000-0000-0000-000000000000	8d4e37ff-c31e-4bd0-8a45-84d9c2b555ef	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 15:02:23.193954+08	
00000000-0000-0000-0000-000000000000	7e84e85a-fb54-4242-ac6e-14b11f9a3e3d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:03:39.289602+08	
00000000-0000-0000-0000-000000000000	5e75cdc5-47ab-4d93-a54d-5a9ef0903c8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:09:47.187853+08	
00000000-0000-0000-0000-000000000000	5993959d-390d-4917-bb2a-658bc7a90d18	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:18:19.426113+08	
00000000-0000-0000-0000-000000000000	aaa5a69d-34b3-4d3f-b4b5-33c87c737890	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:22:51.022723+08	
00000000-0000-0000-0000-000000000000	d809896d-8a94-4dad-8dbe-b14d6059b27f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:49:59.439864+08	
00000000-0000-0000-0000-000000000000	46153855-9a3c-4108-b000-a5cfa407892d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 15:56:49.43211+08	
00000000-0000-0000-0000-000000000000	35eaad60-3acd-497d-a25c-c18f67eee9c4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:12:50.659523+08	
00000000-0000-0000-0000-000000000000	fb261098-2d64-475a-9d13-05791c7ce38f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:17.589757+08	
00000000-0000-0000-0000-000000000000	f29f59f0-eb4c-48cd-bbd6-f5489edf160b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:25.42683+08	
00000000-0000-0000-0000-000000000000	473b88f2-00b3-4510-8a74-002e421cd2ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:31.760055+08	
00000000-0000-0000-0000-000000000000	6bd43f02-d7b0-4103-9d17-8029417aab8a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:37.222255+08	
00000000-0000-0000-0000-000000000000	461feb68-248b-4a78-bbbd-68b84211dce8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:25:57.730943+08	
00000000-0000-0000-0000-000000000000	34ab6a20-5e0d-46b1-bc30-761660740ab6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:28:00.923139+08	
00000000-0000-0000-0000-000000000000	19c350c1-d439-4b07-ac2a-21994ddc19ae	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:33:40.018339+08	
00000000-0000-0000-0000-000000000000	dcb7054a-e44e-4c71-85f1-e5b0b39d2ac0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:33:46.465814+08	
00000000-0000-0000-0000-000000000000	5ffc7d0d-544d-4807-9206-7d0d0342683f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:39:44.148319+08	
00000000-0000-0000-0000-000000000000	28d79b0f-fd79-4ca8-a944-70105d5f4bc3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:41:06.219764+08	
00000000-0000-0000-0000-000000000000	8f9a7e54-ac86-4154-9ab4-05ca8448c6d2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:46:20.406556+08	
00000000-0000-0000-0000-000000000000	7117063c-9bab-4564-8def-bdb56c974888	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-05 16:50:16.359146+08	
00000000-0000-0000-0000-000000000000	3770449a-64b3-4936-880f-068555068b94	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-05 16:51:20.132725+08	
00000000-0000-0000-0000-000000000000	57be2eae-07f6-4ea1-8465-5b3d53e2b9d3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:21:38.435815+08	
00000000-0000-0000-0000-000000000000	0a8ba79e-03c0-4844-90c7-c46035e23b81	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:28:18.410042+08	
00000000-0000-0000-0000-000000000000	3f06e451-6b35-4242-ace9-db6cf2680de1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:29:44.088271+08	
00000000-0000-0000-0000-000000000000	a6e61ef4-7dbd-43ad-bd22-5543041f8e24	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 09:31:00.325299+08	
00000000-0000-0000-0000-000000000000	a9b9231e-fd8a-4bb5-a669-42e684d824cb	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:31:16.787366+08	
00000000-0000-0000-0000-000000000000	1ff583ff-d55b-43ac-90a9-55fa552f73a9	{"action":"logout","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 09:31:36.611756+08	
00000000-0000-0000-0000-000000000000	1488c3aa-2dc2-4285-923f-ef552dc578b4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:31:56.325854+08	
00000000-0000-0000-0000-000000000000	08f99971-affe-48f8-bbed-847754a191a0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:38:13.613108+08	
00000000-0000-0000-0000-000000000000	b393b9b2-85fa-4d78-aded-340a332c92c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:38:59.671643+08	
00000000-0000-0000-0000-000000000000	b5a45ca1-7b28-4dcb-bda2-d1cf57dee945	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 09:48:36.466666+08	
00000000-0000-0000-0000-000000000000	925d0fb9-1c93-4a74-ad85-b28bede634e1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:02:27.256818+08	
00000000-0000-0000-0000-000000000000	818fd6c0-84dd-4ff2-b7d9-16c287fbcfff	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:03:13.268139+08	
00000000-0000-0000-0000-000000000000	b20d2891-0d69-4666-8fef-e052c3da462d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 10:49:27.739267+08	
00000000-0000-0000-0000-000000000000	53fd4c84-4c36-4c4b-9aed-3bb716cc9032	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 12:12:41.475879+08	
00000000-0000-0000-0000-000000000000	acb6968f-f998-415d-bc2e-b66a635681b3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 12:16:15.536568+08	
00000000-0000-0000-0000-000000000000	f9e75ac3-d1bb-44b9-8d7e-1b776934959f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:07:56.716333+08	
00000000-0000-0000-0000-000000000000	61be66e8-dba0-4cac-8b13-66c51407d5a6	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:08:20.155955+08	
00000000-0000-0000-0000-000000000000	5f6c3938-df43-4aa8-87f2-b45b80bc7196	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:08:22.666964+08	
00000000-0000-0000-0000-000000000000	ee79a8f6-c603-4c58-98eb-1b3f1a11dc97	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:09:21.162134+08	
00000000-0000-0000-0000-000000000000	19a6d59d-9fdf-4e72-a113-a92327c4f7ad	{"action":"login","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 15:09:28.509794+08	
00000000-0000-0000-0000-000000000000	de5b7715-e9fb-48ee-866e-61e69ed13848	{"action":"logout","actor_id":"fda3391e-dfc8-4d87-b44d-87b545668a41","actor_username":"hkpkingtx01@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 15:09:40.245354+08	
00000000-0000-0000-0000-000000000000	31506ce5-65e3-498b-a1b2-6553992f4b16	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:45:16.913404+08	
00000000-0000-0000-0000-000000000000	18598197-d641-49d3-affa-c3de21b77954	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:46:44.48034+08	
00000000-0000-0000-0000-000000000000	7a1d4661-385e-4878-943e-3a6e73ee9103	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 16:47:28.92829+08	
00000000-0000-0000-0000-000000000000	054c7e72-52e1-42f0-b8b6-02d6c6d07c8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:47:42.439552+08	
00000000-0000-0000-0000-000000000000	e436c3e1-2cfb-4498-9f34-0f8304abf89d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 16:54:09.899738+08	
00000000-0000-0000-0000-000000000000	13fbbfd2-d104-4bb1-859b-a8b2d2a5c61b	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 16:54:59.76359+08	
00000000-0000-0000-0000-000000000000	b961fff3-8ffd-4b80-b69c-17dffffc06aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:25:10.769123+08	
00000000-0000-0000-0000-000000000000	4909039d-24be-4547-9d54-00fc2ca3ef33	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 17:26:48.078215+08	
00000000-0000-0000-0000-000000000000	0131b4f5-171c-44d9-882e-9138e684b74c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:30:19.677286+08	
00000000-0000-0000-0000-000000000000	1bfb291a-f744-44d4-b69f-039dbbb4dbe3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:30:42.732823+08	
00000000-0000-0000-0000-000000000000	b317bdc0-4ebf-4cf9-a663-97e8f2cd9070	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-07 17:31:33.018563+08	
00000000-0000-0000-0000-000000000000	cd505d03-1345-485a-b7a8-5ab7ff267f5e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 17:32:02.732291+08	
00000000-0000-0000-0000-000000000000	ed994b7d-4fa8-4f78-b48b-3370883424ad	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:28:00.507878+08	
00000000-0000-0000-0000-000000000000	9ae79754-33cd-4b69-8179-66a9cf581063	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:28:16.89596+08	
00000000-0000-0000-0000-000000000000	e3e8bedc-bc35-440c-965c-567dd1f53a47	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:34:23.878958+08	
00000000-0000-0000-0000-000000000000	a93c0ef7-ae02-4a18-aec4-43e6379b9275	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:47:44.952957+08	
00000000-0000-0000-0000-000000000000	9f110fb4-b059-4031-b578-c39177c27493	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:49:20.445058+08	
00000000-0000-0000-0000-000000000000	3a4e49bd-e0ae-471a-8561-cfc93b841996	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 18:57:50.137665+08	
00000000-0000-0000-0000-000000000000	67651980-edf4-4c21-b523-e5c1f07960d7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 19:50:09.282077+08	
00000000-0000-0000-0000-000000000000	7633b660-616e-4172-8a3e-d2a80e6759b6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 20:09:01.057687+08	
00000000-0000-0000-0000-000000000000	15023973-4157-4784-a65e-92e3413db9c7	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:07:32.985973+08	
00000000-0000-0000-0000-000000000000	0a6c881b-4dbd-4882-ae33-5c78f0ce5d16	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:07:32.988634+08	
00000000-0000-0000-0000-000000000000	ca15b462-436f-4b20-82f1-d89f7aeb4e1f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-07 21:23:15.27942+08	
00000000-0000-0000-0000-000000000000	ed3a8fb1-106e-4bbd-bd37-c2fd128a343b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:22:52.829588+08	
00000000-0000-0000-0000-000000000000	be934048-679f-44bb-b7cd-5a5e7a892c31	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:23:32.793995+08	
00000000-0000-0000-0000-000000000000	801f2566-8bee-484e-8d4b-6d12750d71a4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:30:23.903269+08	
00000000-0000-0000-0000-000000000000	e150dda4-364c-4bdb-b618-125f28702fa4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 10:35:26.286876+08	
00000000-0000-0000-0000-000000000000	f403cbb4-12e9-4f89-8efc-24e54424e7a6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:35:37.526301+08	
00000000-0000-0000-0000-000000000000	563862f5-a25b-497e-b6b5-77e412434c4a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:36:25.022033+08	
00000000-0000-0000-0000-000000000000	eeca943c-db6a-4032-8887-2db2fe3b8792	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 10:38:04.055161+08	
00000000-0000-0000-0000-000000000000	02b5866a-a137-4704-8062-01a292f483e8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 10:38:19.563041+08	
00000000-0000-0000-0000-000000000000	fc8f5bcd-1dc7-4829-a7db-b01ba74d0e7f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:36:26.505395+08	
00000000-0000-0000-0000-000000000000	fb599968-6b63-4f3d-b4ef-7408c93e21cf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:36:51.557444+08	
00000000-0000-0000-0000-000000000000	0c4192c0-f8b0-42bb-8997-f16984e397fe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:41:11.930336+08	
00000000-0000-0000-0000-000000000000	c9138a8c-5c55-4e31-908c-21578c443f40	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 11:44:32.017583+08	
00000000-0000-0000-0000-000000000000	16478274-f26d-4484-87bd-4e0d8d5b77f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:45:52.671464+08	
00000000-0000-0000-0000-000000000000	72f05b66-5c68-4f42-886e-b591161d0bed	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:51:16.793722+08	
00000000-0000-0000-0000-000000000000	6036c600-ddae-4cb6-ac3c-3bc307c56735	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 11:57:40.449766+08	
00000000-0000-0000-0000-000000000000	c2ea40de-e223-4755-9fae-588dd1540e8f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:01:55.106277+08	
00000000-0000-0000-0000-000000000000	635d0be8-3ce0-4fad-a23a-aacb0c4693cc	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:05:27.1148+08	
00000000-0000-0000-0000-000000000000	b63a41c6-9a1b-4e6d-8497-89bf15a1d31d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:07:02.347333+08	
00000000-0000-0000-0000-000000000000	77a82ea2-8605-403e-a107-ee6c407de885	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 12:10:05.00727+08	
00000000-0000-0000-0000-000000000000	a06fd762-5cee-4043-b80d-4271ff5f04fb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 13:11:52.555149+08	
00000000-0000-0000-0000-000000000000	796bb8ad-9a11-4445-9a10-7cb8a178df27	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 13:15:48.50789+08	
00000000-0000-0000-0000-000000000000	c78d0810-355f-4000-9613-8257826f0869	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 15:55:29.514801+08	
00000000-0000-0000-0000-000000000000	88d57f3d-6f67-4a67-876c-33cbaeace261	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 15:58:44.793703+08	
00000000-0000-0000-0000-000000000000	e319ebc5-e1b7-4cd7-8493-04aadb3db873	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 16:01:24.275499+08	
00000000-0000-0000-0000-000000000000	d68348a6-6ed7-4148-8ae1-b24e55f08790	{"action":"user_signedup","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 16:02:32.239361+08	
00000000-0000-0000-0000-000000000000	ad6a4879-e98d-4b76-94c1-866a7889eb4d	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:02:32.250604+08	
00000000-0000-0000-0000-000000000000	487eceaa-e82d-4896-abee-57b62cd2af64	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 16:02:57.658757+08	
00000000-0000-0000-0000-000000000000	47332c96-3a92-48e9-9b2a-cd09691e9b45	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:08:02.430218+08	
00000000-0000-0000-0000-000000000000	46c98d19-8cbb-434b-8790-f96a0bb55227	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:10:49.893134+08	
00000000-0000-0000-0000-000000000000	e9484d23-65f8-4604-85a5-94c8d8cf302f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:28:25.485822+08	
00000000-0000-0000-0000-000000000000	d991194c-88b0-41f6-852a-44fc662d08e0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:28:49.320777+08	
00000000-0000-0000-0000-000000000000	98c61d8c-467e-4f2a-b130-c8dd2cb5d713	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:45:16.877932+08	
00000000-0000-0000-0000-000000000000	e987d9fa-5c90-411f-8336-5fab07908afe	{"action":"user_signedup","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 16:59:21.296055+08	
00000000-0000-0000-0000-000000000000	da73474b-4e35-427d-9591-a7b76abdf74c	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 16:59:21.302136+08	
00000000-0000-0000-0000-000000000000	e8231c43-869a-483f-9e03-494ed1a0eed8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 17:06:14.104682+08	
00000000-0000-0000-0000-000000000000	3fedc63d-e06c-4514-955e-391c95920861	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 17:06:14.106829+08	
00000000-0000-0000-0000-000000000000	bdf7780e-82d8-4556-9aea-5caf11de0b0d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:04:44.395872+08	
00000000-0000-0000-0000-000000000000	6ec6d833-6962-4370-814a-110f3b9e5ac8	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:04:44.396736+08	
00000000-0000-0000-0000-000000000000	3175b46c-a5b2-4d98-b7b4-bc454f71d8a6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:16:40.993203+08	
00000000-0000-0000-0000-000000000000	168dac5a-ccff-4057-ad6e-daa21e651be1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:16:40.994684+08	
00000000-0000-0000-0000-000000000000	92583fd4-1114-436a-a01d-6769511c7e16	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 18:22:49.161279+08	
00000000-0000-0000-0000-000000000000	2bc6e3b9-3437-4c39-a786-1ee3477e627d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 18:23:34.5086+08	
00000000-0000-0000-0000-000000000000	cef3b251-749c-4707-a802-36089f9b52ed	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:28:05.498729+08	
00000000-0000-0000-0000-000000000000	d4614711-73e3-4742-91ad-274aa8edf453	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-08 18:30:09.366183+08	
00000000-0000-0000-0000-000000000000	1eaa8bef-c6d1-4ace-976a-af940e8d3203	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:00.734182+08	
00000000-0000-0000-0000-000000000000	56da2b10-4189-4feb-aa31-952ada31eb88	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:03.421366+08	
00000000-0000-0000-0000-000000000000	c936aad5-e8f7-478a-8de7-c5fe6b4a6fd9	{"action":"user_signedup","actor_id":"15e9b9ba-649b-498c-8134-62d4fa2f4e48","actor_username":"123@88.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-08 18:31:43.876168+08	
00000000-0000-0000-0000-000000000000	1f8e59fd-92c1-4dc7-8739-b6c17de7aa52	{"action":"login","actor_id":"15e9b9ba-649b-498c-8134-62d4fa2f4e48","actor_username":"123@88.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 18:31:43.880702+08	
00000000-0000-0000-0000-000000000000	c72a8d19-2a67-4976-85d8-ed6e289226a4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 19:16:54.317641+08	
00000000-0000-0000-0000-000000000000	8f31a363-b988-49e2-a864-f5f72260df4a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 19:16:54.319399+08	
00000000-0000-0000-0000-000000000000	3127fa24-a077-4c61-b1af-c1830ed4024b	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 20:20:13.665903+08	
00000000-0000-0000-0000-000000000000	5df831ae-6c06-48cc-bf8a-f1980cf2a326	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 20:20:13.668069+08	
00000000-0000-0000-0000-000000000000	8bd6a36d-d528-4c6c-a453-abfd9809af9a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-08 20:26:18.308788+08	
00000000-0000-0000-0000-000000000000	4a285e21-588c-4358-8b5e-e319f3554222	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 21:18:52.081605+08	
00000000-0000-0000-0000-000000000000	ab7dc64d-6ca1-4012-b713-538c255c118f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 21:18:52.091769+08	
00000000-0000-0000-0000-000000000000	cfb890e8-d9fe-4084-83e0-a0d20e748034	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 22:17:51.677925+08	
00000000-0000-0000-0000-000000000000	1d76d0b4-88a9-4cb3-9ea5-6380bbd6d27b	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 22:17:51.680346+08	
00000000-0000-0000-0000-000000000000	bd765214-64c9-4551-b209-f2a882743cf1	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 23:16:51.847943+08	
00000000-0000-0000-0000-000000000000	02de231b-77b3-4c1a-acd4-f91ac1169fb9	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-08 23:16:51.850595+08	
00000000-0000-0000-0000-000000000000	2058e96e-d1a1-462b-b9f7-2fdc17fbb6a4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 00:15:39.431125+08	
00000000-0000-0000-0000-000000000000	4ab50301-64e0-4825-95a5-50cf6f0efdb1	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 00:15:39.433201+08	
00000000-0000-0000-0000-000000000000	b9a7fb15-fa0a-421d-80e1-668fbc70b8a3	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 01:14:49.888472+08	
00000000-0000-0000-0000-000000000000	f58acdbc-e7cc-45b7-8c87-5abe7be10724	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 01:14:49.891252+08	
00000000-0000-0000-0000-000000000000	6afca8e4-e010-4fb1-a00e-4af0c4f3688e	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 02:16:18.467362+08	
00000000-0000-0000-0000-000000000000	0b5b0af6-4629-49bc-9774-5ac966bf9a67	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 02:16:18.468996+08	
00000000-0000-0000-0000-000000000000	4f060607-7153-486b-9f04-7a2723957c68	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 03:18:35.588571+08	
00000000-0000-0000-0000-000000000000	21f5deec-1f99-4407-b7ae-103c61560c5e	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 03:18:35.59063+08	
00000000-0000-0000-0000-000000000000	6e5fdc65-bacf-4b6a-b6a2-9bef6592f70c	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 04:23:39.003348+08	
00000000-0000-0000-0000-000000000000	f9ec7334-a5c1-425e-be72-4082191272ee	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 04:23:39.004929+08	
00000000-0000-0000-0000-000000000000	419d8d87-93db-4d39-8108-7be332add537	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 05:30:13.663122+08	
00000000-0000-0000-0000-000000000000	aef1b303-15c2-4ed3-a18c-65a72cbb761f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 05:30:13.665176+08	
00000000-0000-0000-0000-000000000000	5e2a7b9e-5dc3-49cb-bc73-331243b90ffd	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 06:33:40.884068+08	
00000000-0000-0000-0000-000000000000	6b49b2f4-4cb5-45b7-801d-c824b2889c7f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 06:33:40.885673+08	
00000000-0000-0000-0000-000000000000	260c6598-3b25-4daf-9124-006501e270de	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 07:37:47.91377+08	
00000000-0000-0000-0000-000000000000	72a42e85-4ade-4083-a4b5-901e4352c68a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 07:37:47.915295+08	
00000000-0000-0000-0000-000000000000	7c735dc0-402a-41c2-89c7-23f68c12f0dc	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 08:36:30.9365+08	
00000000-0000-0000-0000-000000000000	308a2c11-c3be-4746-8094-bd710452f8ca	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 08:36:30.93861+08	
00000000-0000-0000-0000-000000000000	958838c3-2905-42bc-a7a6-c6ba180b5e93	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 10:18:27.284355+08	
00000000-0000-0000-0000-000000000000	ab596043-02e5-40fd-8bc8-bd50471b15c5	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 10:18:27.285842+08	
00000000-0000-0000-0000-000000000000	f58b3a3e-5b90-44c5-83a5-fccf9cc6dcbc	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-09 10:18:31.583081+08	
00000000-0000-0000-0000-000000000000	15079fb5-eb46-462f-a850-31430cf570ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-09 10:19:28.085081+08	
00000000-0000-0000-0000-000000000000	4cb4443d-579e-4ea4-bb81-d0bfd5af6e6e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 17:50:22.692262+08	
00000000-0000-0000-0000-000000000000	95a06f70-6aff-4991-a125-9a41065419cf	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-09 17:50:22.713379+08	
00000000-0000-0000-0000-000000000000	1bd61f73-9a7f-4082-8d4b-88ffa7e49e99	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-09 17:51:07.757955+08	
00000000-0000-0000-0000-000000000000	c971cde0-b998-4589-b043-8b02948b09f5	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 11:53:05.023479+08	
00000000-0000-0000-0000-000000000000	bb42a94b-08f6-4444-a8dd-ba32b0aee756	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 11:53:05.037268+08	
00000000-0000-0000-0000-000000000000	c0a8c793-530b-4036-a211-09a069c8e648	{"action":"logout","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account"}	2025-07-10 11:58:58.276834+08	
00000000-0000-0000-0000-000000000000	169321d3-7688-448e-aeb3-051862b8c89d	{"action":"login","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 11:59:07.799252+08	
00000000-0000-0000-0000-000000000000	f4662d1b-f29c-46c2-ba1d-dedd57f0d35d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 12:05:21.263294+08	
00000000-0000-0000-0000-000000000000	59e15d16-2cb4-45e4-b8ee-8e8ed36f44eb	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 13:02:28.907568+08	
00000000-0000-0000-0000-000000000000	8097f7f9-7303-467a-b4cd-0ef6e25adf9a	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 13:02:28.910233+08	
00000000-0000-0000-0000-000000000000	d12100de-066a-4383-8737-601d63b24198	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 14:01:08.283257+08	
00000000-0000-0000-0000-000000000000	c0a65ce6-b1d3-48d3-8595-927f31e42b97	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 14:01:08.28599+08	
00000000-0000-0000-0000-000000000000	58e6aaa4-b426-4979-a43d-e19e02402596	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 14:45:27.872495+08	
00000000-0000-0000-0000-000000000000	e8708e23-905c-4cb1-8c41-3ab7c4579086	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:00:33.814331+08	
00000000-0000-0000-0000-000000000000	07d002fd-0c02-4d6b-9da0-945add59008d	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:00:33.81946+08	
00000000-0000-0000-0000-000000000000	3618da6d-f23c-49a0-b7b9-5b589d02dbaf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:22:00.790779+08	
00000000-0000-0000-0000-000000000000	002d7dce-18e5-4c3d-ba60-f2407be208c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:39:20.322856+08	
00000000-0000-0000-0000-000000000000	4d701161-19bb-41ef-b68b-3be7191cabf9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:39:54.275468+08	
00000000-0000-0000-0000-000000000000	a510a624-db59-4b4a-8e61-fa9f6418910b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:42:20.492887+08	
00000000-0000-0000-0000-000000000000	ac436771-e3d1-4444-928e-032253ebad6d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 15:49:20.013704+08	
00000000-0000-0000-0000-000000000000	5dba5eb4-648f-42cc-9480-d48938fe4c8f	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:59:11.807262+08	
00000000-0000-0000-0000-000000000000	58298cdb-d852-4282-827b-f08b02b36f5c	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 15:59:11.809377+08	
00000000-0000-0000-0000-000000000000	8dd71cc2-abff-4ca0-a586-f8898d27bc9b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 16:03:32.585782+08	
00000000-0000-0000-0000-000000000000	81a7f49c-6afe-4231-b73f-5b35bfd8d30b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-10 16:12:39.503738+08	
00000000-0000-0000-0000-000000000000	658cbd39-b842-49b2-b265-fcce275bfe14	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:20:13.529541+08	
00000000-0000-0000-0000-000000000000	e7fdea3a-d701-412a-9aeb-b89ce2b7a3a1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:20:13.531044+08	
00000000-0000-0000-0000-000000000000	4ac015d6-94f3-449d-9279-366ae6a117f8	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:57:55.384969+08	
00000000-0000-0000-0000-000000000000	33fb3a6e-7a14-4ae9-bb6d-b910c4df44d2	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 16:57:55.388144+08	
00000000-0000-0000-0000-000000000000	673b7a22-6c5a-46c3-aacc-d7bd03da0155	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:19:07.734562+08	
00000000-0000-0000-0000-000000000000	23441d09-ec4d-449c-9bb9-aed75afb1da1	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:19:07.737357+08	
00000000-0000-0000-0000-000000000000	86fd0c62-b036-419d-af87-a5662e371a09	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:56:43.321279+08	
00000000-0000-0000-0000-000000000000	50a5f752-24fa-4d39-8456-2b23c30cce4f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 17:56:43.322119+08	
00000000-0000-0000-0000-000000000000	2e26972b-cb53-4838-ab1f-1d0453406e1d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 18:59:01.798088+08	
00000000-0000-0000-0000-000000000000	e1ba4b5a-a377-4069-b2f0-3ce9a9059390	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 18:59:01.800288+08	
00000000-0000-0000-0000-000000000000	193bedc9-3255-4bd1-8525-a5d0e5c12d02	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 19:59:59.569276+08	
00000000-0000-0000-0000-000000000000	b3d79032-aef4-49c3-b76a-f24e20c70fff	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 19:59:59.582171+08	
00000000-0000-0000-0000-000000000000	a4aaf762-3b65-4be3-bf69-2a0292b71e36	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 20:59:29.150044+08	
00000000-0000-0000-0000-000000000000	24dd363a-4311-4623-943c-ba953457f588	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 20:59:29.152989+08	
00000000-0000-0000-0000-000000000000	6859ecd3-2b5c-4139-9cd2-dc5503368039	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 21:58:08.109906+08	
00000000-0000-0000-0000-000000000000	58b79d9a-269c-42f1-a9c4-8bbfd4c9da4d	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 21:58:08.11341+08	
00000000-0000-0000-0000-000000000000	6f3af5c0-ba48-4b45-b0e1-119e8a5dee7d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 22:57:52.311105+08	
00000000-0000-0000-0000-000000000000	4c514e33-6f1c-4092-b15a-87f639dbe8a0	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 22:57:52.313098+08	
00000000-0000-0000-0000-000000000000	b1596e41-9c28-41e1-beba-8138b080c3bd	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 23:56:39.248539+08	
00000000-0000-0000-0000-000000000000	5b74a640-edc7-448b-8389-c63a3d27af70	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-10 23:56:39.249308+08	
00000000-0000-0000-0000-000000000000	2ba1992d-4d6f-4ad5-bb30-ea84d7759e8d	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 01:08:38.12313+08	
00000000-0000-0000-0000-000000000000	b1ff908a-8d27-41ef-8aa6-c16fbd2ef364	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 01:08:38.123951+08	
00000000-0000-0000-0000-000000000000	5f6f8bc8-348c-4040-90df-081bd35999c4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 02:49:29.538032+08	
00000000-0000-0000-0000-000000000000	6ec1583f-868f-4d82-928e-4b856349ae79	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 03:48:00.642029+08	
00000000-0000-0000-0000-000000000000	4b35a296-ec7f-4e5f-95b0-085c76622354	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 03:48:00.64414+08	
00000000-0000-0000-0000-000000000000	0ff9c126-28ef-4b67-87fd-c9c49e083344	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 04:46:51.767315+08	
00000000-0000-0000-0000-000000000000	60cfb4a5-9e81-4508-a1df-4a38fe112d2e	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 04:46:51.768105+08	
00000000-0000-0000-0000-000000000000	3a6ffef3-dabb-467f-8441-f1c38c46a24e	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 05:52:14.659758+08	
00000000-0000-0000-0000-000000000000	c746f675-b123-4c8c-945f-f3a198c9599f	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 05:52:14.661218+08	
00000000-0000-0000-0000-000000000000	1cfc7459-489d-4dd8-ab06-fcf3762c7524	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 06:53:05.140269+08	
00000000-0000-0000-0000-000000000000	90389419-0eab-4a39-a515-ef778cdda1e1	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 06:53:05.141122+08	
00000000-0000-0000-0000-000000000000	a6ec94f6-849f-4aa2-8915-4001d903da51	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 07:52:49.678255+08	
00000000-0000-0000-0000-000000000000	294b98ff-14ee-47ba-bae2-9c89cc2e2b13	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 07:52:49.681533+08	
00000000-0000-0000-0000-000000000000	3b1f5c67-c3cd-4685-bdbc-e7cf7ebeab66	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 08:58:01.60998+08	
00000000-0000-0000-0000-000000000000	6bf747a0-ae52-43d9-934f-d81d6c6bb718	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 08:58:01.613804+08	
00000000-0000-0000-0000-000000000000	edd777bc-a845-4e54-b0f5-0f344fef0f88	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 09:36:12.171148+08	
00000000-0000-0000-0000-000000000000	003fe3da-6a15-4b19-99ec-b5b4234dc231	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 09:36:12.173986+08	
00000000-0000-0000-0000-000000000000	1855c10c-5b47-457f-bb07-385a8cd0467f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 09:38:05.746433+08	
00000000-0000-0000-0000-000000000000	e46d1053-d360-427c-b268-9a712dceb662	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:04:14.883581+08	
00000000-0000-0000-0000-000000000000	c0ae38d7-c6be-4a48-8082-88e909a5dbbd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:08:36.654685+08	
00000000-0000-0000-0000-000000000000	fa49e778-4e6d-4f72-8156-d629c7da1be8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 10:10:23.864943+08	
00000000-0000-0000-0000-000000000000	9059bea6-9232-4854-aee7-7f44045cb581	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:14:46.873036+08	
00000000-0000-0000-0000-000000000000	df29c9ae-2bb4-4810-8182-79ca0fd43b20	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:15:14.284309+08	
00000000-0000-0000-0000-000000000000	adbfdf38-a7b9-4de5-aa9e-4039aa5c2121	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:18:28.248919+08	
00000000-0000-0000-0000-000000000000	25bdb294-a71e-4e13-b382-78716a6926f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:26:09.290367+08	
00000000-0000-0000-0000-000000000000	2284676b-7141-4987-b909-16371299fd6f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:31:20.719015+08	
00000000-0000-0000-0000-000000000000	227f9789-747c-4300-93c5-06ab63e3fb83	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 10:41:07.869397+08	
00000000-0000-0000-0000-000000000000	9c1290e9-dd80-4b7f-b1d2-455fa52b231c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:01:20.484524+08	
00000000-0000-0000-0000-000000000000	ecd2ee40-f27b-4836-afb4-dc254cf1f756	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:08:40.132557+08	
00000000-0000-0000-0000-000000000000	cdbadcdc-b22e-4ac3-a8a7-e564ae971086	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:12:42.359367+08	
00000000-0000-0000-0000-000000000000	0174bb56-2760-4c30-b936-5f9fd3afb4a8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 11:20:07.310265+08	
00000000-0000-0000-0000-000000000000	8d9b7879-88db-4056-bbd6-c3a5fd218591	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 14:24:08.101121+08	
00000000-0000-0000-0000-000000000000	57761928-1f93-490a-872f-bd6b24455906	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-11 14:24:08.106122+08	
00000000-0000-0000-0000-000000000000	b66a4dc6-2531-478a-b08c-4cf0a1e6e0f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:26:25.340832+08	
00000000-0000-0000-0000-000000000000	18ac02d2-f888-4d43-81e7-d7f0223e195e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:33:24.113236+08	
00000000-0000-0000-0000-000000000000	10f9bc7e-5670-4634-bc6f-4bf505a2ca3c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:34:01.404518+08	
00000000-0000-0000-0000-000000000000	9df537f3-36de-42ef-8832-18fcc4daa7c1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:44:46.239412+08	
00000000-0000-0000-0000-000000000000	81a52277-4556-4da5-8e59-70e3b12c9b30	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:51:05.07+08	
00000000-0000-0000-0000-000000000000	b7cc5398-4180-436b-a72a-ba32dc476ade	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:52:11.87683+08	
00000000-0000-0000-0000-000000000000	732de6e4-69df-4d88-880d-8d949d4cdebb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:52:14.982911+08	
00000000-0000-0000-0000-000000000000	5c3933c7-6a10-4ddb-9c9c-86d816ebf619	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:53:30.907255+08	
00000000-0000-0000-0000-000000000000	ab0b3081-05da-4114-b710-1bb30b355fbe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:53:34.181035+08	
00000000-0000-0000-0000-000000000000	921213e3-36fd-4bf4-b42b-5f542fb6d4bc	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:54:08.309433+08	
00000000-0000-0000-0000-000000000000	486d4a27-cb60-45ad-9735-0104c4d13135	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:54:11.38216+08	
00000000-0000-0000-0000-000000000000	f0220e61-bba4-47c0-95e2-016058e101f8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 14:58:03.936236+08	
00000000-0000-0000-0000-000000000000	38d12fc7-3fb1-483a-ba38-7865dcdf2d87	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 14:58:07.276077+08	
00000000-0000-0000-0000-000000000000	a0c9682f-4701-473d-a063-69cbc05d1c11	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 15:53:18.234885+08	
00000000-0000-0000-0000-000000000000	df8cfee4-517a-4a66-9cb7-ac9c4e530613	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-11 15:54:19.036037+08	
00000000-0000-0000-0000-000000000000	8902f9d1-0f68-4aae-b775-05904beed6fa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 18:37:17.94317+08	
00000000-0000-0000-0000-000000000000	63a5b2cd-c1a9-48a7-9339-bea5f3b43a2c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-11 18:48:59.172555+08	
00000000-0000-0000-0000-000000000000	9182efd0-8263-450b-9792-a7859115d3cd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 09:03:28.924249+08	
00000000-0000-0000-0000-000000000000	761a14cd-4ec1-40f6-83c9-a1c6ebedefbb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 09:05:13.69121+08	
00000000-0000-0000-0000-000000000000	b3d82f61-4d55-4d36-b287-905925e384dd	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 10:01:56.976617+08	
00000000-0000-0000-0000-000000000000	bb4f14bf-9af2-4d8c-b944-2e5458ca5d69	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 10:01:56.981291+08	
00000000-0000-0000-0000-000000000000	eca143e7-7ba2-4d57-887f-d96d7ba79671	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:00:09.4677+08	
00000000-0000-0000-0000-000000000000	d3a7069c-fe0d-4d82-b6eb-16a69a6450fd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:00:09.470926+08	
00000000-0000-0000-0000-000000000000	0656c169-cfda-4dee-a343-371e2aa1143b	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:04:47.219638+08	
00000000-0000-0000-0000-000000000000	bebb6ad3-dda3-4606-ba24-2bb2f64bdbea	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:04:47.222219+08	
00000000-0000-0000-0000-000000000000	ab66f832-dd2b-4dc1-8019-5cbef588f6f3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:58:24.766159+08	
00000000-0000-0000-0000-000000000000	fd879dfa-bd9a-435a-83a7-369859fc55f5	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 11:58:24.769304+08	
00000000-0000-0000-0000-000000000000	3a43b3c3-aa8f-419e-8ccf-09e15c36cf61	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 11:58:35.354474+08	
00000000-0000-0000-0000-000000000000	f53023fd-f975-4fc1-b2da-869ce1c03e02	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 11:58:41.871439+08	
00000000-0000-0000-0000-000000000000	a564fd0d-7c0b-4ba1-aa44-856c4e14072e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 12:14:53.404214+08	
00000000-0000-0000-0000-000000000000	a62093f9-5be3-4133-9407-25310d25dc14	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 12:14:59.789201+08	
00000000-0000-0000-0000-000000000000	cf91642d-406f-43d8-ae4c-95bc1add77e4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 12:21:38.562861+08	
00000000-0000-0000-0000-000000000000	655e196f-10a9-4d80-bd64-1a6dfd6eebb8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 13:13:33.802169+08	
00000000-0000-0000-0000-000000000000	cf2d5802-1484-4b69-895d-21dd7867967e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 13:13:33.804669+08	
00000000-0000-0000-0000-000000000000	61fa196f-0385-4075-a3b7-440842327277	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 15:02:06.742269+08	
00000000-0000-0000-0000-000000000000	9ef8d24c-fa9e-43e9-bdb4-feee2e67d45b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 15:02:06.747087+08	
00000000-0000-0000-0000-000000000000	139a7a2f-6080-4343-99c4-833afd0110fa	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 15:03:48.253454+08	
00000000-0000-0000-0000-000000000000	39077c8a-9c56-4b95-a0bc-196f5f15e9c9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 15:03:54.467325+08	
00000000-0000-0000-0000-000000000000	65533312-af5e-44ee-94fb-45aef929f9ba	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 16:03:19.765108+08	
00000000-0000-0000-0000-000000000000	e6c8b8bc-58f9-4a88-981f-2def5c1e0cbf	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 16:03:19.766517+08	
00000000-0000-0000-0000-000000000000	e4e87774-2578-475d-a359-9bd6524aebd3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 17:03:05.029396+08	
00000000-0000-0000-0000-000000000000	588a168b-ac59-40c4-9ed1-be3e69c83a2b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 17:03:05.030871+08	
00000000-0000-0000-0000-000000000000	05111cf4-a4e1-4937-a769-acdedd47d464	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 18:02:19.086844+08	
00000000-0000-0000-0000-000000000000	20e4c0fa-a102-44b0-ad8d-b62b09a409be	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-14 18:02:19.089678+08	
00000000-0000-0000-0000-000000000000	8fd870ae-48ad-4e05-a365-a2e4a1504187	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 18:46:54.523472+08	
00000000-0000-0000-0000-000000000000	ac567357-97ff-4e65-8ab9-483cdce868a2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:26:12.651751+08	
00000000-0000-0000-0000-000000000000	037fa221-c1c6-4347-a0c5-5805ee64085b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:42:27.795236+08	
00000000-0000-0000-0000-000000000000	c97c9971-580d-4c58-bc17-d2e8473cd351	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:43:19.267633+08	
00000000-0000-0000-0000-000000000000	35d74695-e51e-4d32-8150-4a732c600ee2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:43:22.264152+08	
00000000-0000-0000-0000-000000000000	2354c3b3-1ef9-481f-a016-4052caf96095	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:51:26.599632+08	
00000000-0000-0000-0000-000000000000	d56cb667-4e10-4a6e-8bef-2f6c882cbebc	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:51:29.415774+08	
00000000-0000-0000-0000-000000000000	90ef3427-b795-426a-b8a6-23ae3c5a45ea	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:52:37.338872+08	
00000000-0000-0000-0000-000000000000	95b0a15b-ac55-41e0-ae32-b1f7dbff4180	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:52:40.262016+08	
00000000-0000-0000-0000-000000000000	40f41f22-cdf3-4e71-a859-1d6a2381960f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-14 19:54:16.160541+08	
00000000-0000-0000-0000-000000000000	b91c8c30-e6ea-4c83-bba3-600aaf0aea86	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:54:19.332505+08	
00000000-0000-0000-0000-000000000000	f7f85ac3-4a19-42b6-bcea-1167a08b90f5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-14 19:59:58.823349+08	
00000000-0000-0000-0000-000000000000	6c6bac96-4c41-4ac5-9bbe-c792ed65061b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:05:31.990385+08	
00000000-0000-0000-0000-000000000000	9814ad49-bada-4796-8058-837f0d8565eb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:06:09.290611+08	
00000000-0000-0000-0000-000000000000	303a1cd0-7f61-4213-ba32-b00e5809d187	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:07:09.163238+08	
00000000-0000-0000-0000-000000000000	6a8f8659-88bf-4c09-a69e-8c77f8d668db	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:10:59.989702+08	
00000000-0000-0000-0000-000000000000	14d028d7-bfa1-4ea7-8b8f-61351e9d6efe	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:16:45.092628+08	
00000000-0000-0000-0000-000000000000	986fb078-a8b9-4806-816f-25a0f4345347	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:29:36.242628+08	
00000000-0000-0000-0000-000000000000	9fe64c7b-777f-452a-9053-50505c7dbc3f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:30:52.274547+08	
00000000-0000-0000-0000-000000000000	7e5aabe8-e28f-4e21-b04c-7eea08d5e6a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:39:39.342805+08	
00000000-0000-0000-0000-000000000000	6a7495a5-a27b-49e7-aa67-d551f91d76be	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 09:54:40.393409+08	
00000000-0000-0000-0000-000000000000	bf4041f6-eafa-4743-a73c-e3a64fc3dce6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 10:06:22.063355+08	
00000000-0000-0000-0000-000000000000	4dea58a6-1fb2-4013-8b4b-aea67936e23e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 10:06:22.066068+08	
00000000-0000-0000-0000-000000000000	62f1aeba-1981-494f-b677-f79f6ede3dcc	{"action":"user_signedup","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-15 10:15:59.281842+08	
00000000-0000-0000-0000-000000000000	6142232f-9b22-4b01-b478-0a7c5cb552fd	{"action":"login","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 10:15:59.294327+08	
00000000-0000-0000-0000-000000000000	6abbc564-470c-4c65-b1cc-fd77750a6e23	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 11:14:54.972845+08	
00000000-0000-0000-0000-000000000000	eb381b49-013a-45a9-8147-48d4b6179794	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 11:14:54.975534+08	
00000000-0000-0000-0000-000000000000	aa3473ef-2e2f-4ac3-b764-e07f3f9490fe	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 12:13:57.142258+08	
00000000-0000-0000-0000-000000000000	7dcd9e23-5cd9-49fd-809e-e44ed129d5b1	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 12:13:57.144407+08	
00000000-0000-0000-0000-000000000000	a2bb337c-d3b2-4622-9426-8d7b66e61290	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 13:12:56.980301+08	
00000000-0000-0000-0000-000000000000	a8e86e0e-059a-4f27-aa0f-401754c3e8ab	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 13:12:56.981757+08	
00000000-0000-0000-0000-000000000000	a4e3d503-fba6-4465-8cc8-65cb5c305aac	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 14:11:43.916643+08	
00000000-0000-0000-0000-000000000000	023b62d0-f0c7-4434-a97b-e9d5f2d3aa1e	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 14:11:43.926788+08	
00000000-0000-0000-0000-000000000000	9ad53bd0-9653-412a-ba61-8f6cc205a1eb	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 15:10:18.613231+08	
00000000-0000-0000-0000-000000000000	f6ff6fb5-19c7-4f71-8da1-d7f4a4b9e7a4	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 15:10:18.616109+08	
00000000-0000-0000-0000-000000000000	9efc9317-3e80-4f40-a3f1-467b96af709f	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 16:09:08.617279+08	
00000000-0000-0000-0000-000000000000	619771dc-fe5f-4726-b75c-76adaf78bc6b	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 16:09:08.621973+08	
00000000-0000-0000-0000-000000000000	bce66e5f-29f3-4852-94aa-e0ef85db9357	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:05:25.765494+08	
00000000-0000-0000-0000-000000000000	4d3eb916-c082-4959-820c-4c6ac0bb14e3	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:05:25.769086+08	
00000000-0000-0000-0000-000000000000	fb3f3b8f-742e-4559-9608-0f9e17ffaf30	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:07:57.948754+08	
00000000-0000-0000-0000-000000000000	1cf03169-fba2-469c-914a-9eda01730e35	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 17:07:57.95028+08	
00000000-0000-0000-0000-000000000000	d7c315be-bf2d-42f9-9080-8f021354512f	{"action":"user_signedup","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-15 17:15:49.724604+08	
00000000-0000-0000-0000-000000000000	202e22f0-9c78-421c-ae9e-a30532972848	{"action":"login","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-15 17:15:49.732228+08	
00000000-0000-0000-0000-000000000000	991173f6-1eed-4c1d-8385-4f069bc368ab	{"action":"token_refreshed","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:06:48.684595+08	
00000000-0000-0000-0000-000000000000	6a941b2c-9754-4bb1-8552-92098e9d2d23	{"action":"token_revoked","actor_id":"5229fa40-01fd-4d4a-85b3-c12539f0b01a","actor_username":"cyong1991@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:06:48.686173+08	
00000000-0000-0000-0000-000000000000	9d03aceb-826a-4a68-a69d-380d8c874068	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:15:22.313717+08	
00000000-0000-0000-0000-000000000000	08c2f366-77d9-463f-b676-d6b686cbb3e9	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 18:15:22.315256+08	
00000000-0000-0000-0000-000000000000	9d874927-cad6-49f6-89d1-c33c3a775fad	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 19:14:10.368828+08	
00000000-0000-0000-0000-000000000000	93c8c948-07bf-4236-a8de-3f46ece589df	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 19:14:10.369669+08	
00000000-0000-0000-0000-000000000000	33e0d122-e4c7-49a4-819d-2ee0abe81a19	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 20:12:49.059311+08	
00000000-0000-0000-0000-000000000000	608d654a-7e3c-4688-b33a-430c046a6c22	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 20:12:49.061423+08	
00000000-0000-0000-0000-000000000000	b5392eb5-bc4e-4c91-a29d-08ab372373fe	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 21:12:10.380711+08	
00000000-0000-0000-0000-000000000000	8db127b7-f004-4265-870f-0a73bc1fa988	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 21:12:10.382817+08	
00000000-0000-0000-0000-000000000000	8d769113-1d7f-4ae7-add4-d0227aff6cd9	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 22:11:35.402864+08	
00000000-0000-0000-0000-000000000000	254ec783-fdf4-4715-bec8-be1aa14703d4	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 22:11:35.404348+08	
00000000-0000-0000-0000-000000000000	8fb5d1cf-d6e1-4dd7-a097-43727d3a8387	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 23:10:20.341646+08	
00000000-0000-0000-0000-000000000000	6a54759a-a4a7-4da4-8004-06202e1c2fb3	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-15 23:10:20.344252+08	
00000000-0000-0000-0000-000000000000	58f694e0-6ab7-4e4a-b521-3a89238807d7	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 00:09:11.127784+08	
00000000-0000-0000-0000-000000000000	655fcba9-1c2b-4abc-be4e-21af317c9cc1	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 00:09:11.129291+08	
00000000-0000-0000-0000-000000000000	b77b3d40-b8e6-4c82-ba95-52f917890816	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 01:08:10.633459+08	
00000000-0000-0000-0000-000000000000	2bc67856-042a-4a21-b78a-d473e6e15774	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 01:08:10.634972+08	
00000000-0000-0000-0000-000000000000	94d393e1-9213-4a18-adf9-64da12abb6b2	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 02:06:57.606321+08	
00000000-0000-0000-0000-000000000000	7986df53-ed59-44f1-baac-2ef36e78ac81	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 02:06:57.607119+08	
00000000-0000-0000-0000-000000000000	184b79f9-8e22-4d0e-8c8a-bb6af72fc9de	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 03:06:30.416771+08	
00000000-0000-0000-0000-000000000000	17d6fbb4-1ba0-488a-890b-0b411448d025	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 03:06:30.418968+08	
00000000-0000-0000-0000-000000000000	9f72a96f-9a80-4d9b-a1f2-b5b1326a9942	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 04:05:06.503591+08	
00000000-0000-0000-0000-000000000000	0efd7fbd-88b5-416d-b5b0-4d4208383bf6	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 04:05:06.505778+08	
00000000-0000-0000-0000-000000000000	2f9c5443-e2e9-4a3c-870a-8fc551be628a	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 05:03:44.439029+08	
00000000-0000-0000-0000-000000000000	0eb5d18b-32fa-4512-8efe-d9f7a664ca40	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 05:03:44.440641+08	
00000000-0000-0000-0000-000000000000	248eef09-934d-4429-8efd-8db3b3a1de99	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 06:03:06.584119+08	
00000000-0000-0000-0000-000000000000	a8ac6db9-b052-4c5e-8a21-ad38d6f6d959	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 06:03:06.586232+08	
00000000-0000-0000-0000-000000000000	4645b4e7-034e-4427-b39d-e13982444e7d	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 07:01:54.55115+08	
00000000-0000-0000-0000-000000000000	71792ddf-bb04-43ec-a8cf-1ced0f2035dd	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 07:01:54.554419+08	
00000000-0000-0000-0000-000000000000	fb4e39c1-1d44-4942-8b08-9ba1ed061b7d	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 08:01:30.666029+08	
00000000-0000-0000-0000-000000000000	5677ff28-7edc-4079-b140-33760ada7b4c	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 08:01:30.66883+08	
00000000-0000-0000-0000-000000000000	5430e6fb-0b52-4150-bf07-9bd56157cf30	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 09:01:15.4809+08	
00000000-0000-0000-0000-000000000000	9ed83155-ab61-4614-bd86-acff759b4fff	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 09:01:15.483261+08	
00000000-0000-0000-0000-000000000000	2a9387ff-97d0-4233-9de3-8a76adb57eb8	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:00:04.695475+08	
00000000-0000-0000-0000-000000000000	49733ed8-b935-49d1-accb-83a0370f3d8c	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:00:04.698742+08	
00000000-0000-0000-0000-000000000000	9ae8e727-fc63-40c0-acd7-d486fa6c11b3	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:59:10.586225+08	
00000000-0000-0000-0000-000000000000	c7f284fb-2ba3-4787-8d0a-bded59c15dd2	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 10:59:10.587564+08	
00000000-0000-0000-0000-000000000000	b5ba60e4-0e82-45b6-b67e-6193e3911726	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 11:58:06.68382+08	
00000000-0000-0000-0000-000000000000	50570bba-f731-4599-82f5-59f05ed59b83	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 11:58:06.685429+08	
00000000-0000-0000-0000-000000000000	f1aaf669-f26b-43b6-84f5-1f2078e27f85	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 12:56:55.717875+08	
00000000-0000-0000-0000-000000000000	59a06773-7a78-4261-a5b6-f5d875b83bf7	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 12:56:55.719397+08	
00000000-0000-0000-0000-000000000000	9e018722-ba3f-4b57-9827-3cb5354bd3b0	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 13:55:48.717326+08	
00000000-0000-0000-0000-000000000000	97c2b7ed-9177-46d4-9340-bb5a7b68c1a6	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 13:55:48.719898+08	
00000000-0000-0000-0000-000000000000	5e4c21bd-0dd4-47e4-ab24-3ca5977c0206	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 14:54:22.565755+08	
00000000-0000-0000-0000-000000000000	46313459-02a2-438f-9cee-2da50fbb9455	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 14:54:22.569204+08	
00000000-0000-0000-0000-000000000000	7c2042b3-6220-4095-a78f-3a794229867f	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 15:53:10.724532+08	
00000000-0000-0000-0000-000000000000	e4a0ba15-880c-485b-85b9-a16f3b101f5e	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 15:53:10.727995+08	
00000000-0000-0000-0000-000000000000	40341c67-8824-4131-b43c-d20d09d027be	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:19:47.622909+08	
00000000-0000-0000-0000-000000000000	8eab384c-1ecf-469f-99c1-6c96fd32856c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:27:09.040095+08	
00000000-0000-0000-0000-000000000000	20409b91-e3b7-4285-94f9-18f2c2d7e7b2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:31:53.452963+08	
00000000-0000-0000-0000-000000000000	ac9e99bb-e889-42b1-8f2c-fed5eccdd81b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:41:47.245301+08	
00000000-0000-0000-0000-000000000000	48bf680c-3a7f-490e-bc8e-14afd741cacb	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:47:14.22518+08	
00000000-0000-0000-0000-000000000000	1aaed648-2600-47f6-835e-5bf9ea4c06ff	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:47:14.229065+08	
00000000-0000-0000-0000-000000000000	cba27552-4827-47b4-901c-c5fffd319d64	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:49:29.561696+08	
00000000-0000-0000-0000-000000000000	cfb4884c-f9f6-40de-96c8-a65590bb012a	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:52:23.553844+08	
00000000-0000-0000-0000-000000000000	88a1d974-8662-472b-9c12-b7f9f5ae25ef	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 16:52:23.555944+08	
00000000-0000-0000-0000-000000000000	d9321cd3-d161-4b74-be5b-43bc31657660	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:57:46.833881+08	
00000000-0000-0000-0000-000000000000	26c2b5fe-5cf4-4469-ad57-fd80b583e52d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 16:59:22.007277+08	
00000000-0000-0000-0000-000000000000	479ac4a8-c817-433f-84aa-f02b56b1bfa5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 16:59:25.341909+08	
00000000-0000-0000-0000-000000000000	287f30ff-9efc-44f8-ba21-fe7d5ee77238	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:08:03.402853+08	
00000000-0000-0000-0000-000000000000	fc697c46-f171-41ef-b5d1-5247fbab5b20	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 17:09:46.596493+08	
00000000-0000-0000-0000-000000000000	4bfd5867-5fc6-4386-9cb4-064d8b9b3b23	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:09:53.317191+08	
00000000-0000-0000-0000-000000000000	66e9dd21-1003-4f70-9c04-09399b9cc395	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:17:11.657001+08	
00000000-0000-0000-0000-000000000000	30ee665a-52be-456b-b507-c81d8763cff4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:22:34.191184+08	
00000000-0000-0000-0000-000000000000	05bbb9fb-4f5d-4559-98a1-ef41906f1b88	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:31:13.850577+08	
00000000-0000-0000-0000-000000000000	4b51f172-7bb1-4485-b5f7-87568e02f954	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:33:15.074385+08	
00000000-0000-0000-0000-000000000000	c567344c-742b-4fd4-bdb6-0ac50f160d1d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:41:16.811462+08	
00000000-0000-0000-0000-000000000000	b99c6d65-09a0-47a9-a174-8e902c5cfbe5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:42:21.161913+08	
00000000-0000-0000-0000-000000000000	1c781653-2935-486e-bc37-9050a0b7b2ce	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 17:50:10.511722+08	
00000000-0000-0000-0000-000000000000	66d60bc9-c246-4b03-98f6-fae949b7f246	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 17:50:56.928634+08	
00000000-0000-0000-0000-000000000000	b3d82795-752b-4404-894c-d25eec5d2a3f	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 17:50:56.929173+08	
00000000-0000-0000-0000-000000000000	69f449ac-1c91-41da-8805-b256fcf70563	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:48:18.489544+08	
00000000-0000-0000-0000-000000000000	7b2e4955-30cb-4a4a-8a88-1834f6b55e3e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:48:18.49221+08	
00000000-0000-0000-0000-000000000000	b5f4fde1-4c83-4c5b-a5d7-93231d9d9f66	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:49:29.675425+08	
00000000-0000-0000-0000-000000000000	8c6c5924-6bdc-46f8-8257-5593ef71f523	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 18:49:29.677107+08	
00000000-0000-0000-0000-000000000000	ba200636-6d57-42e7-a264-ed49c5561580	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 19:01:34.015274+08	
00000000-0000-0000-0000-000000000000	8293d2a2-28ac-4992-92bf-e9782229a136	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-16 19:08:41.501375+08	
00000000-0000-0000-0000-000000000000	9d5ea138-7031-4b4f-aeca-02a8e388a0f7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-16 19:10:50.134984+08	
00000000-0000-0000-0000-000000000000	a97da2d6-0750-4e25-83be-185c9b5426b9	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 19:48:04.962462+08	
00000000-0000-0000-0000-000000000000	7639f7b0-f313-4d32-82d3-5c16bb5b7b6a	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 19:48:04.96452+08	
00000000-0000-0000-0000-000000000000	b5a2b481-672c-4083-a32b-a5d022b734c6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 20:46:54.872938+08	
00000000-0000-0000-0000-000000000000	fc26dfd2-5a47-48d9-91ab-d79ae4e3dc63	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 20:46:54.876731+08	
00000000-0000-0000-0000-000000000000	2d3f0b4b-da3f-4654-8b05-4c13479ac8c3	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 21:45:47.436566+08	
00000000-0000-0000-0000-000000000000	6ab4453e-72bf-4ea8-a347-528229da96eb	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 21:45:47.447685+08	
00000000-0000-0000-0000-000000000000	84e7ac1b-8428-4d7a-910f-391c15c07093	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 22:44:29.851105+08	
00000000-0000-0000-0000-000000000000	659961e5-d6a4-45e2-b90a-bff576f3513a	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 22:44:29.852519+08	
00000000-0000-0000-0000-000000000000	7e1f292c-f2a7-40b8-8b13-faab3df97fc6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 23:43:12.979038+08	
00000000-0000-0000-0000-000000000000	51a9fbca-36bd-43c5-b034-27314f8e2c83	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-16 23:43:12.980694+08	
00000000-0000-0000-0000-000000000000	22c0b45b-5a89-4a23-a99e-3b5a94d23192	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 00:41:46.829248+08	
00000000-0000-0000-0000-000000000000	3ac7cfcd-decc-4047-b07c-7b030b2b9260	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 00:41:46.830834+08	
00000000-0000-0000-0000-000000000000	255f375c-b7d0-4730-bfd7-1adbfed1be85	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 01:41:22.954699+08	
00000000-0000-0000-0000-000000000000	cd1963bc-89e0-415a-afb1-aabb890eda7b	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 01:41:22.956244+08	
00000000-0000-0000-0000-000000000000	5cb01b45-f892-45d3-ac74-4cb4545ed5a5	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 02:40:10.963196+08	
00000000-0000-0000-0000-000000000000	4d7fcab1-ed3b-4ba9-a0b5-d811ebb771dc	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 02:40:10.964638+08	
00000000-0000-0000-0000-000000000000	6c42b7ef-9ddb-4cab-9a69-e73fee9d8c69	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 03:39:11.553412+08	
00000000-0000-0000-0000-000000000000	9c7e0e6d-1469-4323-a3c9-a12117c16815	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 03:39:11.555456+08	
00000000-0000-0000-0000-000000000000	39f62e6e-f9c7-4f0f-b4c2-93839ef726cc	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:37:46.975107+08	
00000000-0000-0000-0000-000000000000	c3e09a00-b447-4065-9b75-5cc00146f838	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:37:46.976885+08	
00000000-0000-0000-0000-000000000000	871795d0-5687-46cb-89cf-0ee471df68b6	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 05:37:23.004194+08	
00000000-0000-0000-0000-000000000000	51c58c02-2ee5-4ad0-9ded-f1f1f3e25798	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 05:37:23.00573+08	
00000000-0000-0000-0000-000000000000	9b2f3178-a118-4563-9216-c573006ac216	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 06:36:11.009501+08	
00000000-0000-0000-0000-000000000000	9b7b87c2-b1a4-4277-a5d2-b9a2a79835d3	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 06:36:11.011863+08	
00000000-0000-0000-0000-000000000000	ced92f18-0b25-4af3-966a-0a65ba6669d5	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 07:35:11.233827+08	
00000000-0000-0000-0000-000000000000	73fc04d4-dec0-4eb5-899a-170d332ab3fd	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 07:35:11.237637+08	
00000000-0000-0000-0000-000000000000	c67c84c4-858e-4e9a-b511-302cfe470e5f	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 08:33:57.006908+08	
00000000-0000-0000-0000-000000000000	df662af8-7096-4a7b-91d2-fb376d6437e5	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 08:33:57.008393+08	
00000000-0000-0000-0000-000000000000	ed30a8b1-15e0-4fc2-bc81-bf9bec50e73a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 08:58:25.183744+08	
00000000-0000-0000-0000-000000000000	a10affc4-029e-4f9b-95fe-38e6a63e0af3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:07:20.810436+08	
00000000-0000-0000-0000-000000000000	36a6e0ef-4428-43f3-ba22-efc4271ede5b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:16:31.678659+08	
00000000-0000-0000-0000-000000000000	855a6edf-09dd-4429-8926-048ba1ceab73	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:28:46.879295+08	
00000000-0000-0000-0000-000000000000	384a93c9-b9bc-4216-91dd-1558c63ec487	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 09:33:32.160069+08	
00000000-0000-0000-0000-000000000000	d83235f2-7cb1-4cac-a8a3-6b5c4efe2be9	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 09:33:32.163436+08	
00000000-0000-0000-0000-000000000000	86d2772e-cd10-4f25-b0d9-f85fd25f801e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:34:00.884047+08	
00000000-0000-0000-0000-000000000000	1fba93c4-3a19-41c2-8585-7cba424afb21	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:35:29.966097+08	
00000000-0000-0000-0000-000000000000	7a82ea1b-4515-4159-8590-f687b80a8576	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:44:34.80302+08	
00000000-0000-0000-0000-000000000000	57b41d24-337d-4b87-bf16-adaa88ac0cf5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 09:53:24.943621+08	
00000000-0000-0000-0000-000000000000	e2425f2a-0ee7-4086-a79e-06b39c306328	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 10:17:42.434119+08	
00000000-0000-0000-0000-000000000000	d70bc02b-09ca-4f83-8c1a-3d667bfb8383	{"action":"token_refreshed","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:32:16.55978+08	
00000000-0000-0000-0000-000000000000	601f28d4-db2a-40ff-a339-133751432338	{"action":"token_revoked","actor_id":"8054387b-dbc9-4148-8846-a76ac0d0a024","actor_username":"123456@163.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:32:16.562543+08	
00000000-0000-0000-0000-000000000000	08d678dd-852d-4f9d-b78f-35cf61658d22	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:39:57.639552+08	
00000000-0000-0000-0000-000000000000	57928a2f-e1da-45ce-a780-5eea67d39fd3	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 10:39:57.642262+08	
00000000-0000-0000-0000-000000000000	1ac0fde0-cc50-46ae-b6f4-98c4a2dbb0ec	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 10:51:35.735409+08	
00000000-0000-0000-0000-000000000000	62a5f969-e5ff-48dc-a784-cc105e963b84	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 11:25:45.544962+08	
00000000-0000-0000-0000-000000000000	c51a8ba3-8608-46e8-804c-c94bb62e2f4e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 11:49:46.692288+08	
00000000-0000-0000-0000-000000000000	098c8997-1844-499b-8e38-878488ce0677	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 11:49:46.697298+08	
00000000-0000-0000-0000-000000000000	07e0d89f-1535-47fd-b0e3-ca023e7fbd80	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 12:17:56.350776+08	
00000000-0000-0000-0000-000000000000	8fd1ab56-00c8-4a13-bb26-1bc0cb266556	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 14:18:38.275999+08	
00000000-0000-0000-0000-000000000000	4788b1cf-8fd4-4b8a-9b75-e740aca7fdbb	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 14:19:42.289541+08	
00000000-0000-0000-0000-000000000000	7777cdd8-d99d-4859-80cd-12ffd87ad50c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 14:19:42.291074+08	
00000000-0000-0000-0000-000000000000	bd0cb146-7b53-4ac5-bca5-d83dadefd872	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 14:41:06.64384+08	
00000000-0000-0000-0000-000000000000	f31d44c0-0088-4fd9-a2a3-4511e7c5755f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 15:27:11.557405+08	
00000000-0000-0000-0000-000000000000	ea030153-2056-40b1-b5f9-c18d10586e9a	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 15:27:55.142879+08	
00000000-0000-0000-0000-000000000000	2004679e-1811-406f-bb63-39b341919e03	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 15:27:55.14405+08	
00000000-0000-0000-0000-000000000000	5b1b823e-ad69-47e5-97e2-56338021fd82	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:12:14.622913+08	
00000000-0000-0000-0000-000000000000	ce847734-d1b9-4e43-aa7b-235d35f704dd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:12:14.625719+08	
00000000-0000-0000-0000-000000000000	8b9a1249-0635-4218-8dbe-5b5cbcd50c27	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:31:15.457242+08	
00000000-0000-0000-0000-000000000000	13fbb560-038a-4f73-987f-e1bb3faa997e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 16:31:15.462233+08	
00000000-0000-0000-0000-000000000000	f03385b6-178e-490c-a567-f32216dd4957	{"action":"user_signedup","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-17 17:01:21.180471+08	
00000000-0000-0000-0000-000000000000	0d8f0f64-48be-4aba-b83d-5a21655fe126	{"action":"login","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 17:01:21.190541+08	
00000000-0000-0000-0000-000000000000	5ed0bc33-0fe4-4138-b91e-1b4dd81f13c3	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:10:19.018887+08	
00000000-0000-0000-0000-000000000000	6b1f61cf-9a9b-4bb8-addf-122ec89f0a57	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:10:19.022242+08	
00000000-0000-0000-0000-000000000000	79b585ad-4406-4004-be8e-0acb632531c9	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:30:40.268746+08	
00000000-0000-0000-0000-000000000000	7185bf54-a703-432c-aa3d-1c86ab81eeea	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:30:40.272077+08	
00000000-0000-0000-0000-000000000000	3a347a5a-17d4-4f00-baa6-d8a9014b4e26	{"action":"user_signedup","actor_id":"169dd076-28e3-4141-80fb-7d92067b467a","actor_username":"guanyw@novots.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-17 17:30:57.028893+08	
00000000-0000-0000-0000-000000000000	3e097d27-f682-448b-80d9-3646008d37c1	{"action":"login","actor_id":"169dd076-28e3-4141-80fb-7d92067b467a","actor_username":"guanyw@novots.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 17:30:57.03581+08	
00000000-0000-0000-0000-000000000000	958ce67f-8abb-4568-9ce7-2366eac531d8	{"action":"token_refreshed","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:59:54.840064+08	
00000000-0000-0000-0000-000000000000	cc3bc104-957f-4fc8-babd-7a998baf0514	{"action":"token_revoked","actor_id":"65e49e29-53ca-4077-9186-e34605b45bd1","actor_username":"wanggang@cosmo-lady.com","actor_via_sso":false,"log_type":"token"}	2025-07-17 17:59:54.841546+08	
00000000-0000-0000-0000-000000000000	026ec78c-c790-45b6-8f8b-b9da7f8524b7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-17 18:08:56.793192+08	
00000000-0000-0000-0000-000000000000	75b75919-6a22-4737-9ddd-9aa140084415	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:15:53.202735+08	
00000000-0000-0000-0000-000000000000	ae1a1d46-f97e-4f8f-8c54-df860e0fee75	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:15:53.216144+08	
00000000-0000-0000-0000-000000000000	2e8ae1a3-baba-4cad-9c52-abde2ab3cda6	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:17:41.464619+08	
00000000-0000-0000-0000-000000000000	4d90b751-371c-422b-877d-1e4dfbfd0e2e	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 09:17:41.466043+08	
00000000-0000-0000-0000-000000000000	c09aa6e8-90d7-4e84-b65c-1b920d36b6de	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 09:44:49.89189+08	
00000000-0000-0000-0000-000000000000	22a80d0a-e25b-4248-9184-867e6c9abca6	{"action":"user_signedup","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-18 10:02:49.163342+08	
00000000-0000-0000-0000-000000000000	8c6a779a-edc4-470c-b242-8819b377908b	{"action":"login","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 10:02:49.171128+08	
00000000-0000-0000-0000-000000000000	89c77226-2525-4741-92fc-f84da1b34fdd	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 10:37:54.3826+08	
00000000-0000-0000-0000-000000000000	3bcb9825-b878-4d38-a8cb-6b879afb281b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 10:37:54.384074+08	
00000000-0000-0000-0000-000000000000	bb3c74cf-5f20-49b8-b064-c9e9522f6601	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 10:38:09.577811+08	
00000000-0000-0000-0000-000000000000	f4aebbb6-42ee-4e7e-8e9d-2a86593957a3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 11:36:14.119675+08	
00000000-0000-0000-0000-000000000000	897f8776-8bfd-488d-b4ea-a0c1f50e93d7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 12:10:07.568659+08	
00000000-0000-0000-0000-000000000000	6bf0cde2-7c5c-4710-95db-1b65e9d5b841	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 12:10:40.502972+08	
00000000-0000-0000-0000-000000000000	08b1398e-cc0f-4b17-89f5-dd2a2e158463	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 12:12:52.232139+08	
00000000-0000-0000-0000-000000000000	9025183c-53e5-42e4-9661-812ebb12a443	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 12:22:40.610499+08	
00000000-0000-0000-0000-000000000000	b1237591-448d-45c2-88fc-ad22f5b4f3b5	{"action":"user_signedup","actor_id":"945d7d0f-c366-4fcf-96dd-7206222cb4b5","actor_username":"gucaihua@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-18 14:19:08.836257+08	
00000000-0000-0000-0000-000000000000	de86e15a-37b6-4c6e-9e5c-1f5739f6e092	{"action":"login","actor_id":"945d7d0f-c366-4fcf-96dd-7206222cb4b5","actor_username":"gucaihua@cosmo-lady.com.cn","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 14:19:08.844035+08	
00000000-0000-0000-0000-000000000000	80aac6e8-9559-4f50-81e5-a03ee1685c1c	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 14:23:09.789087+08	
00000000-0000-0000-0000-000000000000	d5aedf99-774b-4aab-81a8-2a376209fe1b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-18 14:23:09.790598+08	
00000000-0000-0000-0000-000000000000	daf84e63-3f7c-4326-9828-8ce0fda6e5e8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 18:44:44.156886+08	
00000000-0000-0000-0000-000000000000	11c5253a-930d-45f4-ad75-cec749f6726e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 18:44:59.365985+08	
00000000-0000-0000-0000-000000000000	79058c2d-cebb-4647-a0ca-46f81832fd22	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-18 19:27:15.848786+08	
00000000-0000-0000-0000-000000000000	1aa5aa8f-985e-4646-8697-529206c21ccb	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-18 19:33:24.702224+08	
00000000-0000-0000-0000-000000000000	d4ee9f08-2163-4579-b87d-f1813e7cef38	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-22 10:16:29.035705+08	
00000000-0000-0000-0000-000000000000	c30af4d3-368e-471b-ae2f-daf3ccbdb6b4	{"action":"token_refreshed","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-23 09:00:55.592839+08	
00000000-0000-0000-0000-000000000000	d282d449-ecfa-47a5-8dfa-786912ffcc36	{"action":"token_revoked","actor_id":"32e054db-47db-4535-b65c-c9edc40274cd","actor_username":"zxx@dslr.com","actor_via_sso":false,"log_type":"token"}	2025-07-23 09:00:55.602791+08	
00000000-0000-0000-0000-000000000000	b1d3da3c-4393-46ed-9159-ec41eeca9785	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 14:49:43.079338+08	
00000000-0000-0000-0000-000000000000	8d5ba02f-6fae-4530-8ee3-f6a10572435c	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 17:15:41.07291+08	
00000000-0000-0000-0000-000000000000	c71e6568-0de9-47ce-91c7-9c45ad3d2530	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 17:15:41.075299+08	
00000000-0000-0000-0000-000000000000	e123dc09-a49f-4233-b878-d3d1044ce297	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 17:22:51.248557+08	
00000000-0000-0000-0000-000000000000	4eac595a-9971-448d-a8e1-5fcd2e944157	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 17:38:16.519462+08	
00000000-0000-0000-0000-000000000000	b57751b4-4161-4a6d-bcf8-35da36d7d3d0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 17:57:36.231602+08	
00000000-0000-0000-0000-000000000000	cd92ef64-3742-4091-9c7a-7f34764d5a0a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 18:05:11.489008+08	
00000000-0000-0000-0000-000000000000	7ca7a5b3-755d-4ccd-b975-a34db863d743	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-07-29 18:08:56.154577+08	
00000000-0000-0000-0000-000000000000	4fd894ef-8862-4bca-a1c7-6c2ca4eff6a8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-29 18:12:35.455426+08	
00000000-0000-0000-0000-000000000000	c2feec74-d659-42b3-9526-65c3d3b44fbf	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 19:29:37.053308+08	
00000000-0000-0000-0000-000000000000	b01b78f2-e31b-4281-b373-d437b345bc74	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-07-29 19:29:37.056819+08	
00000000-0000-0000-0000-000000000000	6414bab2-9824-4b35-a08e-945c2b223786	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 09:46:21.222112+08	
00000000-0000-0000-0000-000000000000	26450023-4c7f-448a-ad91-175bc27dced4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 09:46:21.233931+08	
00000000-0000-0000-0000-000000000000	5e8b0b32-c550-4754-a6a4-474efa7e29c3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 09:46:27.436449+08	
00000000-0000-0000-0000-000000000000	74cc846a-9e1f-4518-9c4f-d964a5b77563	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 11:45:20.966072+08	
00000000-0000-0000-0000-000000000000	a34febd7-3ac0-4be8-bead-434b9fb8a937	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 11:54:15.503022+08	
00000000-0000-0000-0000-000000000000	97707dca-2ee3-4080-9655-ecaf0b3b477c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 11:54:33.714891+08	
00000000-0000-0000-0000-000000000000	2b806676-40be-45c0-8d59-d9d5166562d3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:06:43.743759+08	
00000000-0000-0000-0000-000000000000	d6c89c29-90e0-45f8-bf0f-b79df5a22fc2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:06:51.769024+08	
00000000-0000-0000-0000-000000000000	0f61f102-9af3-4e9e-bde5-98cfba92bd47	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:07:08.762288+08	
00000000-0000-0000-0000-000000000000	b734ab00-c516-4a0f-9fa2-7ddd4458cc69	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:09:17.559239+08	
00000000-0000-0000-0000-000000000000	d4d1c581-db39-4d45-8283-bd3c79998a4d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:12:57.255674+08	
00000000-0000-0000-0000-000000000000	5785dc6a-98b5-4c8e-bbb4-073d593ad03e	{"action":"user_signedup","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-04 12:13:35.329991+08	
00000000-0000-0000-0000-000000000000	94cca047-f7be-4163-aaed-4d151f2a4f60	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:13:35.341666+08	
00000000-0000-0000-0000-000000000000	d9074dbb-2cac-470b-858d-fc7a469861c8	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 12:21:05.679904+08	
00000000-0000-0000-0000-000000000000	d0838da0-3e08-45d5-9ac0-910b1bb84885	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 12:21:15.502178+08	
00000000-0000-0000-0000-000000000000	26ffc197-76c0-4ef4-a3f1-77580bed9b59	{"action":"token_refreshed","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 14:43:46.08851+08	
00000000-0000-0000-0000-000000000000	d4aa1e35-6deb-4ff0-ac30-ed71b1cb367f	{"action":"token_revoked","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 14:43:46.094348+08	
00000000-0000-0000-0000-000000000000	45c346bb-5617-43d0-afaa-1f1477755739	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 14:44:12.016843+08	
00000000-0000-0000-0000-000000000000	87202a5a-5e31-4e65-af07-7a67d242a267	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 14:44:22.26235+08	
00000000-0000-0000-0000-000000000000	34844dfe-0c81-422a-a651-87b1cfd4affb	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 14:44:39.312975+08	
00000000-0000-0000-0000-000000000000	d5bc849b-789c-48df-b1bd-c7c5e5182d15	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 14:44:42.676773+08	
00000000-0000-0000-0000-000000000000	7a0a018a-6f7d-4d1c-b7fd-45384bb16635	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:04:23.842063+08	
00000000-0000-0000-0000-000000000000	c0b9bb2e-20ec-43d7-bda3-cff565036884	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:04:32.495079+08	
00000000-0000-0000-0000-000000000000	ca3db26e-ffe8-4cab-badc-eeb5e7f292e8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:08:04.552944+08	
00000000-0000-0000-0000-000000000000	91359cd1-ebd9-4a43-b513-c9e89f124a78	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:08:11.638006+08	
00000000-0000-0000-0000-000000000000	fe2c324c-c7a2-45aa-89e5-33a0f77fad00	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:09:40.240921+08	
00000000-0000-0000-0000-000000000000	7fec8db3-48d7-4f83-8a1a-60cd1d034a1c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:04.639803+08	
00000000-0000-0000-0000-000000000000	e981e717-49f5-4264-a80f-d707a8f1a8aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:08.409358+08	
00000000-0000-0000-0000-000000000000	a1e49a05-e29c-45a5-aa1e-c0f72c56fd7c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:12.969384+08	
00000000-0000-0000-0000-000000000000	9474db88-4ed6-4911-ab6d-9cee84ef8ea2	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:19.759166+08	
00000000-0000-0000-0000-000000000000	5ff8b59d-61e9-4738-8b1c-d18cd20a1e81	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:10:25.138891+08	
00000000-0000-0000-0000-000000000000	4f5d7d68-82d1-4c29-b0fb-561a646542de	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:10:30.219748+08	
00000000-0000-0000-0000-000000000000	663e1e1a-0dfd-410f-96ba-1d4b6ca07666	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:11:25.288423+08	
00000000-0000-0000-0000-000000000000	ce077abc-e2d7-4ba1-bd0d-fadaa65a9707	{"action":"user_signedup","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-04 15:11:40.110326+08	
00000000-0000-0000-0000-000000000000	8867b08f-e331-4028-b813-82e77f16460e	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:11:40.117225+08	
00000000-0000-0000-0000-000000000000	09eb5a2e-321c-43ec-b03e-d307aa283e2c	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:11:49.953548+08	
00000000-0000-0000-0000-000000000000	61f86b7d-161c-433f-86a1-1c41f38d48b8	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:12:01.119461+08	
00000000-0000-0000-0000-000000000000	edc0c46a-9014-44a1-af6f-82648b84a279	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:13:01.514741+08	
00000000-0000-0000-0000-000000000000	cd994c93-bf96-4f79-8685-1ae2252ac4e1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:13:08.51097+08	
00000000-0000-0000-0000-000000000000	a1d3c22f-0a3a-48df-aa03-f9c392de0a85	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:13:12.862557+08	
00000000-0000-0000-0000-000000000000	fb6579e5-d63d-4997-881a-32a0d978ede7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:13:16.309625+08	
00000000-0000-0000-0000-000000000000	03fa63c5-feef-44b5-aa36-e127d992210d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:23:10.651973+08	
00000000-0000-0000-0000-000000000000	468a2bdb-4819-42f3-a78c-fd5a9e3087aa	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:23:18.005239+08	
00000000-0000-0000-0000-000000000000	3f260bac-7ac6-4f14-a107-8f25f4b8067c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:30:04.157777+08	
00000000-0000-0000-0000-000000000000	9e18d55a-50d3-4a03-b49c-2e37414ecbd2	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 15:30:12.13374+08	
00000000-0000-0000-0000-000000000000	1453a8ff-f923-4a51-9686-4b925ca56049	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 15:39:48.815374+08	
00000000-0000-0000-0000-000000000000	89cea3c1-cb76-45ec-85a2-717eb725a79e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:01:10.903756+08	
00000000-0000-0000-0000-000000000000	e8c25045-0121-4428-8ce0-7adbe23dd94c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:01:14.40235+08	
00000000-0000-0000-0000-000000000000	865986d0-0a42-49f7-8bc5-b04d6e51108d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 16:13:30.458242+08	
00000000-0000-0000-0000-000000000000	acd9c1ce-50f4-4b89-a436-d140919ba543	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 17:18:04.033993+08	
00000000-0000-0000-0000-000000000000	3e6e181a-bfdc-4e24-9c7a-2542eead033b	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-04 17:18:04.036059+08	
00000000-0000-0000-0000-000000000000	9399a76f-108a-4fd7-9477-4d626a73bf9d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:18:14.395305+08	
00000000-0000-0000-0000-000000000000	cd52cc67-d0ff-4fcc-a70b-64cc1f3bb767	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:20:04.562411+08	
00000000-0000-0000-0000-000000000000	6a096a98-8b3c-4cf0-a42b-aabc19700d15	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:23:21.94576+08	
00000000-0000-0000-0000-000000000000	7fb585f6-41c7-436b-914b-e3757d434c90	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:23:29.592264+08	
00000000-0000-0000-0000-000000000000	828e95fa-0a0a-47c3-80d0-f38a19323dcf	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:23:33.960707+08	
00000000-0000-0000-0000-000000000000	69d20b91-a367-479b-81db-78ba0783730f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:33:46.37231+08	
00000000-0000-0000-0000-000000000000	89208238-132a-4928-a2ac-970de6f357ee	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:33:50.322258+08	
00000000-0000-0000-0000-000000000000	0e0516df-e1ae-4fb5-ad1d-6f7865908c00	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:41:50.949355+08	
00000000-0000-0000-0000-000000000000	d656d553-23f8-4863-8548-9cf614864b8f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:42:04.102084+08	
00000000-0000-0000-0000-000000000000	65d7314c-3196-47c6-87a3-f177c9a40dfa	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 17:42:14.299738+08	
00000000-0000-0000-0000-000000000000	fccbdcb4-4f05-42c0-af88-2eaffcb86447	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 17:42:59.818312+08	
00000000-0000-0000-0000-000000000000	59dda8f6-9d86-4a85-9a6b-adc1dcba6a76	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:22:11.174625+08	
00000000-0000-0000-0000-000000000000	76d83e3f-7d7f-4960-a29f-48fa9bb30ea7	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:28:27.615276+08	
00000000-0000-0000-0000-000000000000	7f9ffefb-f95d-47a5-ba73-30bd39b66a75	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:29:17.759631+08	
00000000-0000-0000-0000-000000000000	96f64377-4f89-4cf7-9270-61522925283d	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:29:40.526634+08	
00000000-0000-0000-0000-000000000000	5bc4e265-facd-4454-bf0a-3db82c9879db	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:44:57.941236+08	
00000000-0000-0000-0000-000000000000	50df24a3-6bec-4de2-9c6f-65609f78d447	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:45:25.353967+08	
00000000-0000-0000-0000-000000000000	a30a6747-e674-457e-b3db-3dd06b2b8fbc	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:49:13.739759+08	
00000000-0000-0000-0000-000000000000	204a7560-d6d3-4bed-9fc8-2a59007ac964	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:49:28.797894+08	
00000000-0000-0000-0000-000000000000	fcb31e61-621b-4787-a328-1331a6ae6ccc	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:53:39.974623+08	
00000000-0000-0000-0000-000000000000	64fb0d59-eb89-497c-94bd-96969e32f33f	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:56:42.242056+08	
00000000-0000-0000-0000-000000000000	2d5a1d4c-f3e1-4696-888d-369ce2d5c67b	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:56:46.043117+08	
00000000-0000-0000-0000-000000000000	cc197951-132e-4d51-896b-85f5baad84e6	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 18:58:52.607581+08	
00000000-0000-0000-0000-000000000000	af3e4766-97b1-44d3-b0a1-09f164b0e671	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 18:58:55.444731+08	
00000000-0000-0000-0000-000000000000	8c125fa4-e240-40c8-b8c1-7757a75ab632	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-04 19:02:35.901494+08	
00000000-0000-0000-0000-000000000000	e7a56917-8433-478e-afbb-731efa7187cf	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-04 19:03:00.844512+08	
00000000-0000-0000-0000-000000000000	b5e08c51-edfd-4b03-b04a-65d1b8cd1021	{"action":"token_refreshed","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-05 08:46:39.159569+08	
00000000-0000-0000-0000-000000000000	0658256a-bdd8-4cb8-93d6-41ae03b9970b	{"action":"token_revoked","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-05 08:46:39.173588+08	
00000000-0000-0000-0000-000000000000	1c0e1d2e-cdf5-4bf6-a656-01436cc1a308	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 08:47:03.070476+08	
00000000-0000-0000-0000-000000000000	9ead3385-71b9-47e3-8a90-b7febf1016c1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:48:21.654131+08	
00000000-0000-0000-0000-000000000000	9637bd47-5667-46db-9dc9-be17ca20c14a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:56:29.205875+08	
00000000-0000-0000-0000-000000000000	8a51469a-0c96-4003-bd2a-1d99eaf24ab3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 08:58:31.556018+08	
00000000-0000-0000-0000-000000000000	3775e4f9-ed4a-4d7a-9d21-f8f42907d010	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 08:58:40.098091+08	
00000000-0000-0000-0000-000000000000	4bf23780-ce78-4c5b-8c22-06d005dd570c	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:17:43.392746+08	
00000000-0000-0000-0000-000000000000	7418e188-a248-4ea7-8a43-e76ab6abdaa3	{"action":"login","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:18:12.055152+08	
00000000-0000-0000-0000-000000000000	141062e8-a146-4fab-8954-c891acbaec2c	{"action":"logout","actor_id":"f3a32d06-536e-43ea-a232-350fe528e475","actor_username":"hkpking006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:18:19.508349+08	
00000000-0000-0000-0000-000000000000	708db7a3-3461-4469-9e6a-63de3d5e37c1	{"action":"user_signedup","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:18:34.206945+08	
00000000-0000-0000-0000-000000000000	ea03d702-12a5-4053-a05f-67862aaecfb4	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:18:34.214631+08	
00000000-0000-0000-0000-000000000000	fb59b7c9-fb4a-4b2b-8023-1c7b4777b3b3	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:19:14.915657+08	
00000000-0000-0000-0000-000000000000	74c799dc-a14e-4da3-b886-903b205a4966	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:23:10.574715+08	
00000000-0000-0000-0000-000000000000	ac9df428-df04-4c45-b1d7-a6d119497201	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:23:25.84989+08	
00000000-0000-0000-0000-000000000000	cf9b9359-720d-4928-b6e1-822f3cde3bf7	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:24:47.994578+08	
00000000-0000-0000-0000-000000000000	b665fc17-669c-4c81-89f1-b61354544358	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:25:05.443115+08	
00000000-0000-0000-0000-000000000000	a0528343-f87b-4624-8361-7255de49f028	{"action":"login","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:28:44.461241+08	
00000000-0000-0000-0000-000000000000	f98cc16b-0568-41f9-a031-0a9760914838	{"action":"logout","actor_id":"f2b3f8bc-4b0d-4b73-8884-205eb99050ed","actor_username":"hkpking007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:28:56.200546+08	
00000000-0000-0000-0000-000000000000	67da7d7c-bd43-4b44-b84f-e19ffad786e9	{"action":"user_signedup","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:41:30.800371+08	
00000000-0000-0000-0000-000000000000	e2076998-d76d-4be6-ac04-bcad18a3ad18	{"action":"login","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:41:30.816061+08	
00000000-0000-0000-0000-000000000000	d89353a5-686e-4e85-851e-d77c495ad704	{"action":"logout","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 09:42:21.212117+08	
00000000-0000-0000-0000-000000000000	2ae1c3dc-8aa7-49a2-a760-aed7ea0f5e75	{"action":"user_repeated_signup","actor_id":"46758769-1d0c-49cd-bf9d-ee27e76cf96d","actor_username":"hkpking008@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-05 09:49:49.229746+08	
00000000-0000-0000-0000-000000000000	fb2a659a-89e7-4b6d-83df-f4551267a097	{"action":"user_signedup","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 09:50:00.225268+08	
00000000-0000-0000-0000-000000000000	078251c9-c2fb-49be-a716-4111660d1f44	{"action":"login","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 09:50:00.229189+08	
00000000-0000-0000-0000-000000000000	73d8da5c-97d1-46ab-8dc8-fa9cff502a54	{"action":"logout","actor_id":"1b78cf0f-0a63-40e7-8beb-f2a88dff911c","actor_username":"hkpking009@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 10:42:54.590091+08	
00000000-0000-0000-0000-000000000000	9688c4de-2670-4442-82ee-96910bedefe6	{"action":"user_signedup","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 11:51:20.636461+08	
00000000-0000-0000-0000-000000000000	1a1fefcd-0d73-4ade-9104-d0730567a48b	{"action":"login","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:51:20.644287+08	
00000000-0000-0000-0000-000000000000	dbd39a96-7c72-4691-8e67-4be441c79dd6	{"action":"logout","actor_id":"7e308943-ec5e-4ef9-baad-967a2682b4be","actor_username":"hkpking010@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:54:02.409356+08	
00000000-0000-0000-0000-000000000000	da29e79b-4fbd-4832-82df-d70c240223e1	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:54:12.627339+08	
00000000-0000-0000-0000-000000000000	8301ce97-35ba-4bab-a9c5-de62bb3ea67a	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:54:31.070196+08	
00000000-0000-0000-0000-000000000000	1b1b4c04-1234-43cd-b1b6-a8c57945cd07	{"action":"user_signedup","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-05 11:54:44.616377+08	
00000000-0000-0000-0000-000000000000	cb4f0ee3-63e4-43db-8f62-0112838ebccf	{"action":"login","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 11:54:44.619986+08	
00000000-0000-0000-0000-000000000000	fe942fd8-671b-46a5-98e5-a9c1b4fe9058	{"action":"logout","actor_id":"8d4531c2-2f6a-43fe-bab4-d681e898f48a","actor_username":"hkpking011@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 11:55:37.746912+08	
00000000-0000-0000-0000-000000000000	582d9791-efcf-4d74-ab83-dba501dcdab0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-05 17:59:29.499126+08	
00000000-0000-0000-0000-000000000000	804543b7-c164-458e-b9a7-85896d22fb4f	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-05 18:00:49.827692+08	
00000000-0000-0000-0000-000000000000	4bb4706a-f438-4c99-a30b-63a4517db87a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 10:47:07.821543+08	
00000000-0000-0000-0000-000000000000	8f1d9ca7-49f3-4440-b543-0005ce34350e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-06 11:00:17.159087+08	
00000000-0000-0000-0000-000000000000	8690fb1e-0f09-4a1a-9823-b92f180e27b5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 11:39:11.264835+08	
00000000-0000-0000-0000-000000000000	8db152b3-10ea-452f-8506-9bdce9e36b3d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-06 11:41:39.807873+08	
00000000-0000-0000-0000-000000000000	9e7cdb01-783d-4d6a-97e1-2f3421b5a777	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 12:25:13.897506+08	
00000000-0000-0000-0000-000000000000	2524f377-7624-443c-933f-b7ad592b54bc	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 13:24:48.290649+08	
00000000-0000-0000-0000-000000000000	d639fd8e-e48b-4be8-911a-02e21040f44f	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 13:24:48.292792+08	
00000000-0000-0000-0000-000000000000	182644e4-43c3-440b-a4da-a80ab873420a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-06 14:42:23.66752+08	
00000000-0000-0000-0000-000000000000	55349d58-3cdf-4936-890f-30d0310b04c1	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 15:44:23.343421+08	
00000000-0000-0000-0000-000000000000	3f85ca63-444b-4b47-835e-cdef7570f6dd	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 15:44:23.354053+08	
00000000-0000-0000-0000-000000000000	711ed426-1931-4c40-a2fc-670dbb2e115e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:06:26.932152+08	
00000000-0000-0000-0000-000000000000	63136c77-9f8a-4bb4-a0ae-efcfd9f69f3c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:06:26.938624+08	
00000000-0000-0000-0000-000000000000	80687489-508e-48a2-9894-a177a1838e4d	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:43:03.171702+08	
00000000-0000-0000-0000-000000000000	8f79ffcc-8069-4e5b-bec2-c0f662387303	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 16:43:03.173349+08	
00000000-0000-0000-0000-000000000000	c9f54bdc-9bfc-4ec2-b6c8-e943720dbeae	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 17:41:38.333431+08	
00000000-0000-0000-0000-000000000000	670ad55c-9d4a-4f2d-996b-ceb1bd4ec7e4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-06 17:41:38.336468+08	
00000000-0000-0000-0000-000000000000	2fcb127c-58a8-4206-a133-e0924056db29	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 09:20:00.792434+08	
00000000-0000-0000-0000-000000000000	ec4378dc-b4f2-41a3-9431-5e7995bd6fb4	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 09:20:00.813784+08	
00000000-0000-0000-0000-000000000000	5f61ae62-ef23-4ba8-a2bb-6e2145758952	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 09:20:05.622574+08	
00000000-0000-0000-0000-000000000000	7225c61f-ff71-4da7-8b71-c4231a69bf77	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 09:51:43.207915+08	
00000000-0000-0000-0000-000000000000	6db2fcf1-c640-4f8f-903a-628fd7ee3c4d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:30:01.198587+08	
00000000-0000-0000-0000-000000000000	069088d1-8825-4f9f-ab7f-61fffe1b7d70	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:44:32.83547+08	
00000000-0000-0000-0000-000000000000	151a03ba-d6f2-4410-9375-60dfb5d88e69	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:45:09.933102+08	
00000000-0000-0000-0000-000000000000	4ef1166a-04ba-4766-b7bf-0360b9d18e91	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:48:36.866451+08	
00000000-0000-0000-0000-000000000000	e64ae0ca-c720-4ab6-9bac-f8574d22c89e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:49:10.386555+08	
00000000-0000-0000-0000-000000000000	307190be-e49e-4bc6-bee0-55ba5a999fd3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:51.187557+08	
00000000-0000-0000-0000-000000000000	d57cc143-db8d-4483-a859-1722273250f4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:54.508578+08	
00000000-0000-0000-0000-000000000000	911faea7-6847-468c-8791-6029bda5ffd4	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 10:54:57.886636+08	
00000000-0000-0000-0000-000000000000	30ce3190-f707-4b27-8d30-ce4b1326ba63	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 10:55:16.184032+08	
00000000-0000-0000-0000-000000000000	9cdb8ba8-1cbd-45a1-8889-86224d5f64e5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:07:32.143979+08	
00000000-0000-0000-0000-000000000000	d70f9bb0-0151-4941-b60d-2795a1119852	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:08:26.806144+08	
00000000-0000-0000-0000-000000000000	92914286-2449-4b72-a1f3-6edcd3e6c440	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:08:58.069174+08	
00000000-0000-0000-0000-000000000000	6a28d8a0-6a7f-4dc9-ad55-df14390eefc0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:19:11.127541+08	
00000000-0000-0000-0000-000000000000	260e5450-1305-4b49-8040-9f62b5ef401a	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:19:56.042437+08	
00000000-0000-0000-0000-000000000000	50b97420-018d-42c9-84ce-e3604facaaff	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:31:28.324212+08	
00000000-0000-0000-0000-000000000000	48f72d8b-8ea2-4527-8389-2924a8463774	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:31:41.394844+08	
00000000-0000-0000-0000-000000000000	db19f462-964f-48cf-8597-140e0af9f29f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:35:39.783133+08	
00000000-0000-0000-0000-000000000000	c05481fd-980e-4d67-8e9f-bd16a18c692a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 11:35:59.853542+08	
00000000-0000-0000-0000-000000000000	c7eb73fe-3dbb-41ed-b079-ae15034cf2b1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 11:50:51.813734+08	
00000000-0000-0000-0000-000000000000	c10cbcb5-d5e7-4a63-9401-2eeaa189a42e	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 12:50:37.074227+08	
00000000-0000-0000-0000-000000000000	04b89c3a-36d2-46b2-9f86-873a599f3858	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 12:50:37.077076+08	
00000000-0000-0000-0000-000000000000	75dc75f1-15c5-47e1-b9dd-0eeda29ffedf	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 14:18:49.896556+08	
00000000-0000-0000-0000-000000000000	08631add-6ee2-46a2-bc70-a4e4e69a1dd9	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-07 14:18:49.898523+08	
00000000-0000-0000-0000-000000000000	f9d21068-5749-4347-a08b-627062f81e7d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 14:18:52.904353+08	
00000000-0000-0000-0000-000000000000	b5c16ff2-4824-4ca8-a7c1-6372d67a89c6	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 18:21:05.96866+08	
00000000-0000-0000-0000-000000000000	d4e0996c-aecd-4472-8f6d-abb153c5f483	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 18:24:44.351177+08	
00000000-0000-0000-0000-000000000000	4bbc3489-57c7-49d4-8c42-8cf4017be3b8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-07 18:43:54.327011+08	
00000000-0000-0000-0000-000000000000	e6448915-90d0-44e2-ba9c-c0f0df000ad0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-07 18:48:22.877722+08	
00000000-0000-0000-0000-000000000000	503e5d2f-d6fc-4ea6-8216-b41d1bdb77ae	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:50:18.33889+08	
00000000-0000-0000-0000-000000000000	683dd07e-6452-4377-896f-743650b0aa8c	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:51:14.603381+08	
00000000-0000-0000-0000-000000000000	602d533d-0cbf-4857-aa59-109b7d027c95	{"action":"user_repeated_signup","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 09:51:34.666915+08	
00000000-0000-0000-0000-000000000000	6036e068-ec9e-4ef8-8fed-2d60b8d8ed50	{"action":"user_signedup","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 09:51:43.029234+08	
00000000-0000-0000-0000-000000000000	c05a5f3e-664d-46d2-99b4-b9d2529c6547	{"action":"login","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:51:43.037641+08	
00000000-0000-0000-0000-000000000000	5f9d6078-9b0e-4ac4-a139-c6c58863a16c	{"action":"logout","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:53:13.007477+08	
00000000-0000-0000-0000-000000000000	6d77ef97-e514-494f-ade1-569a179a44ba	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:53:29.02809+08	
00000000-0000-0000-0000-000000000000	0178370b-8140-4507-b79b-0500048ae7c0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:54:05.827142+08	
00000000-0000-0000-0000-000000000000	dc09ac63-f26a-48ee-9a2f-a061f627aa08	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:54:13.144906+08	
00000000-0000-0000-0000-000000000000	1a663889-98e7-49ee-a2e2-9da165166efe	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:54:41.504113+08	
00000000-0000-0000-0000-000000000000	a770f0dc-9a85-4436-baab-4ad525c1169c	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:54:58.913962+08	
00000000-0000-0000-0000-000000000000	8469dff9-cad9-431f-8568-8b4be957bac7	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:55:51.007818+08	
00000000-0000-0000-0000-000000000000	7415bbde-f034-47e2-b885-0b282603b780	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 09:55:54.16148+08	
00000000-0000-0000-0000-000000000000	931d208c-b1d3-4170-a20a-952542867d6f	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 09:56:00.811572+08	
00000000-0000-0000-0000-000000000000	e62dd2a6-dc93-4b6b-8c5b-5dc6301930ee	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:08:03.499529+08	
00000000-0000-0000-0000-000000000000	85253a04-eda8-4213-98ec-26ab3d37eac4	{"action":"user_signedup","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 10:12:41.906181+08	
00000000-0000-0000-0000-000000000000	c58318c8-b5ec-4208-a0f5-c936f79e70e5	{"action":"login","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:12:41.910992+08	
00000000-0000-0000-0000-000000000000	1a75d55b-bc55-474e-bb27-632cdc0b0002	{"action":"logout","actor_id":"273b9669-32df-456b-a9ec-03943da2d1d9","actor_username":"hkpking012@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:14:11.054265+08	
00000000-0000-0000-0000-000000000000	69136858-f682-484c-83f1-a3d8b29e2ca5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:49:35.00627+08	
00000000-0000-0000-0000-000000000000	46998323-af07-44dc-be29-df926aef9fcd	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:50:06.901304+08	
00000000-0000-0000-0000-000000000000	1440b088-ded8-4a57-be8f-42da87431b7a	{"action":"login","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 10:50:14.103726+08	
00000000-0000-0000-0000-000000000000	d9de552c-0328-44e4-8399-6a138ec21d02	{"action":"logout","actor_id":"e69b5421-4425-4daa-be7e-4a0fc22347c9","actor_username":"hkpking00001@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 10:50:49.485694+08	
00000000-0000-0000-0000-000000000000	01a6ad62-abbc-4f6d-8c95-6f23454ae5d0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 11:11:04.880103+08	
00000000-0000-0000-0000-000000000000	a3345a08-7bc2-48a2-9033-72e4e188454d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 11:11:32.935651+08	
00000000-0000-0000-0000-000000000000	57246082-9ff7-40fb-bbf4-19376ec06309	{"action":"user_repeated_signup","actor_id":"9afd800c-3113-4192-8baf-508a7bffaba3","actor_username":"hkpking00002@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-08 11:12:55.37516+08	
00000000-0000-0000-0000-000000000000	04e6826c-423f-46db-b00f-6b63328becf4	{"action":"user_signedup","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 11:13:01.292319+08	
00000000-0000-0000-0000-000000000000	46c8bb09-11b4-4cc1-9bf8-431925162624	{"action":"login","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 11:13:01.299322+08	
00000000-0000-0000-0000-000000000000	9e5543e0-deb0-4e3d-9ab2-505019aafa20	{"action":"logout","actor_id":"269a263f-4cd4-434a-815f-4b988324e386","actor_username":"hkpking00003@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 11:16:14.315753+08	
00000000-0000-0000-0000-000000000000	0215a425-4016-4f1e-89a8-8959e1bbd3a0	{"action":"user_signedup","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 12:02:10.11049+08	
00000000-0000-0000-0000-000000000000	353d59cb-23ff-485f-9ff2-85f1037a8aa4	{"action":"login","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 12:02:10.116869+08	
00000000-0000-0000-0000-000000000000	09a9cba1-28d9-4f54-bcf3-15a7062a362b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:21:23.395006+08	
00000000-0000-0000-0000-000000000000	3b80082f-83b2-475d-9092-eb39602d5cb0	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 14:27:50.128981+08	
00000000-0000-0000-0000-000000000000	4eef6389-7ad7-4807-947b-ff4c2e6d6130	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 14:44:40.884374+08	
00000000-0000-0000-0000-000000000000	d20ba146-91e6-4a96-8822-99716b0fcb60	{"action":"token_refreshed","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 15:06:16.80192+08	
00000000-0000-0000-0000-000000000000	38dda6e5-61a3-4f3b-82e7-596f2975ed6c	{"action":"token_revoked","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 15:06:16.807688+08	
00000000-0000-0000-0000-000000000000	56c20533-a880-4620-be06-396e2ec5878b	{"action":"logout","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 15:06:23.018709+08	
00000000-0000-0000-0000-000000000000	5dfc4e17-b7da-4a72-8a37-d2247d3a39c9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 15:30:09.680079+08	
00000000-0000-0000-0000-000000000000	b6501258-a3a7-44e4-91f5-31788a3a2b1a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 16:08:25.891758+08	
00000000-0000-0000-0000-000000000000	472d1a39-bcbe-4cab-91aa-0f9943f7a009	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 16:51:26.586769+08	
00000000-0000-0000-0000-000000000000	4ec19266-1f7f-46bb-b42e-f6ff0d189be1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:11:09.820094+08	
00000000-0000-0000-0000-000000000000	d557892d-cd3c-47a5-93b6-32d9e572e9da	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:19:03.129276+08	
00000000-0000-0000-0000-000000000000	bcffee87-7d01-401b-8114-6dad008b519a	{"action":"user_signedup","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 17:19:50.298601+08	
00000000-0000-0000-0000-000000000000	d1841081-e6f2-4858-8e8e-9b43cb0d95a5	{"action":"login","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:19:50.303633+08	
00000000-0000-0000-0000-000000000000	9330066f-c837-407e-bf01-55db1803a52a	{"action":"logout","actor_id":"8a79850d-c6fb-4644-8074-c91735281a52","actor_username":"hkpking00006@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 17:22:04.673587+08	
00000000-0000-0000-0000-000000000000	639a0c4d-1960-4991-b720-31a680fbd51c	{"action":"user_signedup","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 17:22:14.941993+08	
00000000-0000-0000-0000-000000000000	bc859afb-b4c6-4977-b643-621c8461c434	{"action":"login","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:22:14.948666+08	
00000000-0000-0000-0000-000000000000	1d9a06ed-0c10-46b5-8733-5e16d8372ca1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:27:01.746121+08	
00000000-0000-0000-0000-000000000000	ab84df9c-e333-4626-9239-af3bb5b2753d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 17:27:22.23952+08	
00000000-0000-0000-0000-000000000000	87837349-4310-421b-980e-5b5938162642	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:28:30.277893+08	
00000000-0000-0000-0000-000000000000	5abf8004-9aae-447d-ab4c-66458b1c08de	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:33:09.757726+08	
00000000-0000-0000-0000-000000000000	8ebe180a-c4a7-4cf5-bc2d-41dc0d083e04	{"action":"token_refreshed","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 17:33:10.501283+08	
00000000-0000-0000-0000-000000000000	f0030959-0504-4305-acb4-16b97b340d05	{"action":"token_revoked","actor_id":"22e7d03b-17ec-4c63-a34e-b1998f85702d","actor_username":"469655953@qq.com","actor_via_sso":false,"log_type":"token"}	2025-08-08 17:33:10.502617+08	
00000000-0000-0000-0000-000000000000	b8645b5e-3f2b-4763-9521-bf79e7ca718d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:42:40.107037+08	
00000000-0000-0000-0000-000000000000	ce38d79f-6705-4fee-9cf8-8257a8eae7b7	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:42:45.728474+08	
00000000-0000-0000-0000-000000000000	fe413b95-dd42-41be-a0cd-9a57a34f53f1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:43:00.883253+08	
00000000-0000-0000-0000-000000000000	d40ccee9-3833-4ba9-bdb3-20863551cda5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:43:27.906165+08	
00000000-0000-0000-0000-000000000000	d93f627c-7e09-408b-ae06-dd341c1ca718	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:44:51.968344+08	
00000000-0000-0000-0000-000000000000	16929353-b21e-4f40-8bd6-5a469a1f758e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:46:16.86621+08	
00000000-0000-0000-0000-000000000000	9103c9bd-e5d2-495f-ba97-865fbec3d1a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 17:59:35.848856+08	
00000000-0000-0000-0000-000000000000	5ccb5475-12c9-48b7-bff3-6b8b6dc81c65	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:13:13.76071+08	
00000000-0000-0000-0000-000000000000	cfc52232-9c88-42f3-aa92-7e2adc821e58	{"action":"user_signedup","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 18:13:54.9015+08	
00000000-0000-0000-0000-000000000000	355bb669-8a9d-483f-9ee3-99aac9738103	{"action":"login","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:13:54.91018+08	
00000000-0000-0000-0000-000000000000	04e7a3c5-9d70-46e3-8640-dfdcaf1f0f13	{"action":"logout","actor_id":"cd30c3bf-df26-43e0-b8a3-a0aa1e32c518","actor_username":"hkpking00008@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:24:35.265675+08	
00000000-0000-0000-0000-000000000000	28531962-4215-4c79-9eb9-f09e2ef19aad	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:30:55.530908+08	
00000000-0000-0000-0000-000000000000	8d07cde6-4269-444a-81be-0a57c334adad	{"action":"user_signedup","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-08 18:32:08.062629+08	
00000000-0000-0000-0000-000000000000	a8877533-6ef2-4081-a21f-fac9a68ce332	{"action":"login","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:32:08.067428+08	
00000000-0000-0000-0000-000000000000	4c9e4dae-7f0c-4959-b8cc-198dd9020387	{"action":"logout","actor_id":"00645fb9-3847-4d3b-b093-d4a377e4a63c","actor_username":"hkpking000010@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:35:35.257176+08	
00000000-0000-0000-0000-000000000000	92141c94-0fe7-4b7e-b0b7-78ebcd250aea	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:35:54.60147+08	
00000000-0000-0000-0000-000000000000	7e5e85f0-fc74-4595-b1f5-96e1073d406e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:14.133583+08	
00000000-0000-0000-0000-000000000000	b0b6c75e-0ea3-4423-83ec-7d3575923bf3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:19.29702+08	
00000000-0000-0000-0000-000000000000	f8cf36f9-f75b-48e7-bb56-461be8496f55	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:28.094405+08	
00000000-0000-0000-0000-000000000000	ceb40cda-d0ff-44a0-94f9-b228d8ea3990	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:37:39.470156+08	
00000000-0000-0000-0000-000000000000	387e752a-2373-4fc3-a0cc-5c2cf265e2e4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:38:14.741528+08	
00000000-0000-0000-0000-000000000000	008b5af3-26c1-4428-bd39-7d7db486acdf	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:38:20.642426+08	
00000000-0000-0000-0000-000000000000	c4488f61-1836-4abd-b331-1cae43bdc031	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:43:33.118609+08	
00000000-0000-0000-0000-000000000000	d0335db8-05e9-40dd-90c9-1766ed077ef3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 18:53:58.43847+08	
00000000-0000-0000-0000-000000000000	718f86cc-91b3-416b-8fcd-383a81175028	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 18:54:38.220433+08	
00000000-0000-0000-0000-000000000000	59e5a843-b5b9-4e14-92df-5072754bd267	{"action":"login","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:14:23.302188+08	
00000000-0000-0000-0000-000000000000	ca5e5edc-3bb7-4a6e-a348-991a845cbce0	{"action":"logout","actor_id":"9c96af3b-2718-4e7e-8fe9-e06e9c745087","actor_username":"hkpking005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 19:30:32.385372+08	
00000000-0000-0000-0000-000000000000	d86a8637-9727-4abe-9077-d68fe7c6d66b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:32:42.642014+08	
00000000-0000-0000-0000-000000000000	fcbc3a38-b1cf-4a81-a071-10f9c5247ee9	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-08 19:33:22.51274+08	
00000000-0000-0000-0000-000000000000	d7095850-5297-4fcf-b9ff-6f6300d5dfa9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-08 19:38:38.289726+08	
00000000-0000-0000-0000-000000000000	3f14538f-e260-4d47-91b3-872b369e0602	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 08:38:18.988959+08	
00000000-0000-0000-0000-000000000000	44abbfb4-9fcf-4a5d-80d7-2a70f7c6b7ef	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 08:38:19.005433+08	
00000000-0000-0000-0000-000000000000	1a2ecfe7-50d2-4e4c-862b-cc601db99eb1	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:38:24.894152+08	
00000000-0000-0000-0000-000000000000	4f0f957b-169f-418a-98ec-adac2df171a9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:38:38.66152+08	
00000000-0000-0000-0000-000000000000	23dc2de7-f5ca-4beb-befa-3b4bd55ff96e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:39:23.159554+08	
00000000-0000-0000-0000-000000000000	150f0789-d6f7-4ae3-8e60-f7077df6ac95	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:39:42.023987+08	
00000000-0000-0000-0000-000000000000	104d25bf-8fd4-44fe-967a-fa3a3f910021	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:42:05.285092+08	
00000000-0000-0000-0000-000000000000	e6fabf4f-d2e7-4b18-84f6-337b377c4d29	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:52:44.28446+08	
00000000-0000-0000-0000-000000000000	8fd0818e-0630-4a1b-9dab-d0750ecfcae2	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 08:53:04.493563+08	
00000000-0000-0000-0000-000000000000	58f5209d-d113-4909-9fb2-b2c8397235a0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 08:53:11.693173+08	
00000000-0000-0000-0000-000000000000	20800f05-8651-4c49-b9f7-3c698b8c7eb8	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:17:58.167607+08	
00000000-0000-0000-0000-000000000000	a5eb806b-fb70-4993-96bf-548ea52c7f57	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:18:15.939856+08	
00000000-0000-0000-0000-000000000000	c7746037-457b-4f82-92a5-9a3850d2018d	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:19:22.076408+08	
00000000-0000-0000-0000-000000000000	a0865e11-6951-4514-9e90-6ed5eca489c5	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:19:26.046839+08	
00000000-0000-0000-0000-000000000000	ccee9449-a30a-4f84-9818-437556303dbe	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:20:41.589453+08	
00000000-0000-0000-0000-000000000000	948a260b-811e-4c17-ad5a-eb4af8252e9b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:25:13.90997+08	
00000000-0000-0000-0000-000000000000	7a3fb55f-9fcc-4c95-90e0-1bccbbcbe1f3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:49:56.279857+08	
00000000-0000-0000-0000-000000000000	0837f67e-a11a-4697-afe3-503d3c8032ab	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 09:53:24.902373+08	
00000000-0000-0000-0000-000000000000	af2b9326-946b-4f17-a964-8fac85be573f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 09:57:18.015231+08	
00000000-0000-0000-0000-000000000000	25b0f8da-e47c-46f7-8955-d186694d7d8b	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:23:56.55685+08	
00000000-0000-0000-0000-000000000000	5211151d-60c9-459d-8f1c-970ad341d3d8	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:24:18.212627+08	
00000000-0000-0000-0000-000000000000	8cdadf92-2307-47f5-83ef-e6c7ee79af16	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:24:38.752325+08	
00000000-0000-0000-0000-000000000000	e2b1e23a-4c8b-41db-8839-46c08ec36677	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:25:57.075744+08	
00000000-0000-0000-0000-000000000000	3aa2b084-325c-47ec-8d14-eab321a5d4ec	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 10:26:09.892916+08	
00000000-0000-0000-0000-000000000000	2bca555d-5077-4fa8-aef9-775383cefcbf	{"action":"login","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 10:26:20.242833+08	
00000000-0000-0000-0000-000000000000	7540cb78-b039-4c49-9e73-8da786142a0b	{"action":"token_refreshed","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 11:24:23.394045+08	
00000000-0000-0000-0000-000000000000	a03d9549-bf4e-4a6e-82c5-3ca429341ba3	{"action":"token_revoked","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 11:24:23.397481+08	
00000000-0000-0000-0000-000000000000	6dca5458-13d7-4181-8cc1-2879b3a9c898	{"action":"logout","actor_id":"b50c11f4-c08a-494c-802e-c24170783286","actor_username":"hkpking00007@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:26:15.217638+08	
00000000-0000-0000-0000-000000000000	074e6a96-2e50-430c-bfd5-831d799db813	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:26:33.395553+08	
00000000-0000-0000-0000-000000000000	7875eea3-2402-4334-9c95-a0e5c22a4550	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:41:31.594651+08	
00000000-0000-0000-0000-000000000000	be51630c-733d-420d-84a6-9b0b1df78811	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:50:47.602379+08	
00000000-0000-0000-0000-000000000000	c9413cf3-7832-41df-a9d6-5acab5091a0e	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:50:53.36935+08	
00000000-0000-0000-0000-000000000000	94b5d727-ae79-484c-b56d-f01343b6ad5e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 11:54:32.422446+08	
00000000-0000-0000-0000-000000000000	c15783e4-0156-45e6-9d8e-ade16564fde4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 11:56:27.535471+08	
00000000-0000-0000-0000-000000000000	407fa5fe-7234-4c95-9795-624c3ecbe6d9	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:17.341555+08	
00000000-0000-0000-0000-000000000000	5b257f9a-89a7-40dc-a068-5ec474fdf965	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:24.503303+08	
00000000-0000-0000-0000-000000000000	aebcd0a1-5153-4030-bb4a-eaea48d3be9d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 12:34:29.927432+08	
00000000-0000-0000-0000-000000000000	58c8b0c5-befb-4199-bbe3-451e5317dfed	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 14:12:05.391519+08	
00000000-0000-0000-0000-000000000000	59d34171-03c6-4b76-802b-1d1feb34658c	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 14:12:05.397452+08	
00000000-0000-0000-0000-000000000000	d2fa0d7e-3dca-49d4-ad2a-e56356830620	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:12:12.958052+08	
00000000-0000-0000-0000-000000000000	f8550dc3-41e5-455f-a941-d7f8f1a89cda	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:12:20.480932+08	
00000000-0000-0000-0000-000000000000	bce9db95-cd8d-41ff-9970-c354672a0019	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:23:51.00183+08	
00000000-0000-0000-0000-000000000000	c6ce3a17-e441-4654-b307-c3f687197185	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:23:58.331706+08	
00000000-0000-0000-0000-000000000000	b6074ee7-45f5-4d9d-8b4a-d0c5420396ed	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 14:47:31.280855+08	
00000000-0000-0000-0000-000000000000	a629c13a-520e-47b2-8361-8acaf001f411	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 14:47:50.270062+08	
00000000-0000-0000-0000-000000000000	e754f435-9c0b-454f-8385-bb6ebef1b094	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:11:44.299253+08	
00000000-0000-0000-0000-000000000000	9a5a3f24-c08a-4559-a481-63d064313afb	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:11:52.827373+08	
00000000-0000-0000-0000-000000000000	8d4dbbdd-7b7a-4d5f-be6f-3a0c2205a692	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:21:20.947652+08	
00000000-0000-0000-0000-000000000000	820611f5-1384-4de9-b626-8733ae071bfd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:21:43.547402+08	
00000000-0000-0000-0000-000000000000	61444913-e2a2-4a25-8882-81bc68b6040a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:23:02.49554+08	
00000000-0000-0000-0000-000000000000	90b1ec52-a26c-4078-b42b-43796db60da3	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:36:28.187568+08	
00000000-0000-0000-0000-000000000000	d7180065-bf98-42c0-83a4-64093401d259	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:37:44.908865+08	
00000000-0000-0000-0000-000000000000	596ef523-ae4f-44f3-ac94-d944170a7850	{"action":"user_repeated_signup","actor_id":"01a5d02c-465e-4cea-9378-3b68370786fa","actor_username":"hkpking00005@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-08-11 15:38:11.413701+08	
00000000-0000-0000-0000-000000000000	a715aa66-756e-4785-b4ea-ffa41e1fedf5	{"action":"user_signedup","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-11 15:38:20.297032+08	
00000000-0000-0000-0000-000000000000	7f9c8beb-14d4-4dc7-84e8-eb5634b3a1b9	{"action":"login","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 15:38:20.306947+08	
00000000-0000-0000-0000-000000000000	4f5dd24a-1724-45b4-8745-2cb79a0333ac	{"action":"logout","actor_id":"cbcc1419-5e83-437d-8b47-e67d19fba4ca","actor_username":"hkpking000005@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 15:51:31.831992+08	
00000000-0000-0000-0000-000000000000	9e459795-7553-490a-acd4-26423651851e	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 16:29:02.77007+08	
00000000-0000-0000-0000-000000000000	6b4c80a4-b54e-40a5-8baa-6cefcfda8f08	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 16:38:57.585513+08	
00000000-0000-0000-0000-000000000000	6f4fb519-c31c-429b-b293-08c73861337f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 16:39:35.715747+08	
00000000-0000-0000-0000-000000000000	af19a866-03d2-4552-bb65-97baf61abca8	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 17:49:52.090528+08	
00000000-0000-0000-0000-000000000000	688fbfd3-9f81-497f-b81f-85161cf22199	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-11 17:49:52.094551+08	
00000000-0000-0000-0000-000000000000	5f4b39d0-a0ab-4bb7-a9fb-6223848a2a3a	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 17:49:57.52787+08	
00000000-0000-0000-0000-000000000000	626bb1a7-2234-450f-8bb0-c2a7ea3e2980	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:41:01.35338+08	
00000000-0000-0000-0000-000000000000	4f46a99b-89ea-4375-a467-b0a5094231e6	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 18:41:23.908359+08	
00000000-0000-0000-0000-000000000000	1539c8a1-805f-4c60-8343-937acafd395f	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:48:59.07687+08	
00000000-0000-0000-0000-000000000000	ced65897-6a4f-4215-be6d-772103a6d044	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 18:50:30.173975+08	
00000000-0000-0000-0000-000000000000	e9320d53-0212-401b-a891-c1697063a5df	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 18:50:43.471118+08	
00000000-0000-0000-0000-000000000000	9147e040-eee8-4ea0-b95e-fcc6d518fa1d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 19:21:23.770136+08	
00000000-0000-0000-0000-000000000000	64d7bd58-2710-4568-9029-80f11de5b9bf	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 19:22:17.257596+08	
00000000-0000-0000-0000-000000000000	20f8546d-c819-4f57-9b63-0e414796203d	{"action":"user_signedup","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-11 19:22:45.938047+08	
00000000-0000-0000-0000-000000000000	61ffa0f2-48fb-43b9-b717-7402ddb68b02	{"action":"login","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 19:22:45.947769+08	
00000000-0000-0000-0000-000000000000	943b73c3-1633-4901-8569-d37f5c76054d	{"action":"logout","actor_id":"8f3bd880-e224-44cb-88eb-fda0223443ab","actor_username":"hkpking0-1@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 19:27:22.289902+08	
00000000-0000-0000-0000-000000000000	ce494049-957d-4b43-a4b5-e13d7b046dfd	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-11 21:13:54.653494+08	
00000000-0000-0000-0000-000000000000	5b6fb1e4-0b6a-4a83-b66f-22f1eed11985	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-11 21:18:48.692253+08	
00000000-0000-0000-0000-000000000000	fa536dc2-6046-48dd-ada0-a3050c2bc40d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 09:59:58.905868+08	
00000000-0000-0000-0000-000000000000	088c8840-b43d-4346-be85-0dd6e8562f4f	{"action":"token_refreshed","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-12 11:56:04.825798+08	
00000000-0000-0000-0000-000000000000	6d28f9b2-9ddd-465c-869f-d0390b6ba30a	{"action":"token_revoked","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-12 11:56:04.831675+08	
00000000-0000-0000-0000-000000000000	b83650db-dd60-4597-94ec-ecdfba53a1a3	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 11:58:27.355958+08	
00000000-0000-0000-0000-000000000000	3b02e26f-c582-45e6-b24f-18a1047ef6a7	{"action":"user_signedup","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-12 15:35:24.022491+08	
00000000-0000-0000-0000-000000000000	db493c32-f0c3-4d06-ab85-6658933f57c6	{"action":"login","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 15:35:24.035854+08	
00000000-0000-0000-0000-000000000000	15c1f540-95a0-4877-ab2a-25fa2d5d4615	{"action":"logout","actor_id":"9e965512-ae6c-43ed-8a1f-f5a1d3b4b6ec","actor_username":"hkpking999999@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 15:40:10.582439+08	
00000000-0000-0000-0000-000000000000	d2887a46-efd3-4783-baf0-5958a2e936e0	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-12 18:01:30.188167+08	
00000000-0000-0000-0000-000000000000	99434dd7-e510-4da2-8b62-3f7c61cce0ad	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-12 18:02:54.322288+08	
00000000-0000-0000-0000-000000000000	f619b3b5-8592-4a59-8cf0-b74e883a530c	{"action":"user_signedup","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-14 17:03:19.431891+08	
00000000-0000-0000-0000-000000000000	86fd4d0d-379b-4320-9f3f-74f5a727203f	{"action":"login","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 17:03:19.45095+08	
00000000-0000-0000-0000-000000000000	409679f3-c9fa-4739-a860-9d39adf5fd58	{"action":"token_refreshed","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:02:17.842266+08	
00000000-0000-0000-0000-000000000000	95548122-b73b-45be-b694-85974b6db13c	{"action":"token_revoked","actor_id":"a04c5a72-e63c-4be7-83f0-5a3902510513","actor_username":"hkpking10298@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-14 18:02:17.847308+08	
00000000-0000-0000-0000-000000000000	cd8fecfe-7666-4381-a79a-5731a29e70a1	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:05:18.242966+08	
00000000-0000-0000-0000-000000000000	6beb6b63-4ec1-427d-beb2-5cc2d588165d	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:38:22.936666+08	
00000000-0000-0000-0000-000000000000	ec7b6817-90d3-4be9-8dea-342cf5b77e67	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:40:41.760228+08	
00000000-0000-0000-0000-000000000000	5fd90f4f-5faa-4a9f-b43c-6b904f4ac9a4	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 18:40:58.562433+08	
00000000-0000-0000-0000-000000000000	b09b3ef2-819f-4cc6-8c68-98d103aa872c	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-14 18:42:47.371286+08	
00000000-0000-0000-0000-000000000000	83f4845b-9b0c-488d-8b10-ec2dbe122e44	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-14 18:49:42.988106+08	
00000000-0000-0000-0000-000000000000	94f80f22-7cbc-43db-b499-4e6be8583432	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:22:45.623285+08	
00000000-0000-0000-0000-000000000000	6c65640c-1dac-4097-b52f-3210e5ea360b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:23:28.679689+08	
00000000-0000-0000-0000-000000000000	e2a2b570-b179-431f-8bde-6bde1cb5ca48	{"action":"user_signedup","actor_id":"a31228a8-6005-4e39-99ac-82ee46e09bd3","actor_username":"1234567@qq.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-19 15:25:44.403207+08	
00000000-0000-0000-0000-000000000000	17ce3417-4fa7-459d-935b-6b4a607f7cca	{"action":"login","actor_id":"a31228a8-6005-4e39-99ac-82ee46e09bd3","actor_username":"1234567@qq.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 15:25:44.413236+08	
00000000-0000-0000-0000-000000000000	17686703-f428-49bd-b2c3-82c179f30f78	{"action":"logout","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 15:37:11.112776+08	
00000000-0000-0000-0000-000000000000	ee351dc8-d721-4eee-876d-ac937a64ee6b	{"action":"login","actor_id":"9b39f12c-98f3-4520-b742-0ab7af4fbca1","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:13:18.198719+08	
00000000-0000-0000-0000-000000000000	30007768-471a-41c9-9e7f-d5c1b828706c	{"action":"user_signedup","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-08-19 16:39:31.378958+08	
00000000-0000-0000-0000-000000000000	60b7dbfb-dd86-4d0d-b72d-f2541f7b8b65	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:39:31.384491+08	
00000000-0000-0000-0000-000000000000	7e68c696-75c1-4afa-8add-bff76c091549	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 16:43:57.085909+08	
00000000-0000-0000-0000-000000000000	1f79d951-b626-403a-b559-0b416d999893	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:44:20.878745+08	
00000000-0000-0000-0000-000000000000	6383a142-3fcf-4cd8-8b76-c01deb54dfe2	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:47:25.480992+08	
00000000-0000-0000-0000-000000000000	227cbc63-d99b-48c6-85ca-52ef4caae9f5	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:50:19.802854+08	
00000000-0000-0000-0000-000000000000	b92783ed-f1f5-4254-bcb3-02e28230635c	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 16:57:16.229447+08	
00000000-0000-0000-0000-000000000000	563687a4-9b13-4cc5-b19c-4d5aa59b27af	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 16:57:19.617685+08	
00000000-0000-0000-0000-000000000000	e1f7e05f-0038-4dad-b5c1-4fef7f3ffe7e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-19 17:00:58.586907+08	
00000000-0000-0000-0000-000000000000	4b15dbff-6359-4747-b80e-3730c26943ac	{"action":"token_refreshed","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-19 18:10:46.13723+08	
00000000-0000-0000-0000-000000000000	288ce558-bc19-4126-a37b-381f5cea0413	{"action":"token_revoked","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"token"}	2025-08-19 18:10:46.140583+08	
00000000-0000-0000-0000-000000000000	f96b9a72-582f-46ba-aeda-b4713857a239	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-19 18:54:15.867387+08	
00000000-0000-0000-0000-000000000000	3454062e-c208-4d84-8551-b260fa870313	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 12:15:54.495956+08	
00000000-0000-0000-0000-000000000000	30c34088-a583-4fa2-ace5-2935790251bb	{"action":"logout","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account"}	2025-08-21 12:17:06.501985+08	
00000000-0000-0000-0000-000000000000	ba65956b-7709-49ba-8ed0-1491b049f601	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-21 14:39:30.938792+08	
00000000-0000-0000-0000-000000000000	7da9da37-22aa-428d-bb7b-655cf2591f7e	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 11:47:50.632706+08	
00000000-0000-0000-0000-000000000000	3291176c-b2c3-4ef2-8d5a-7438fdaed122	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 12:09:03.507424+08	
00000000-0000-0000-0000-000000000000	e7aed7e5-e5bd-40d0-bd4c-b1abd4186975	{"action":"login","actor_id":"e841df39-0ab7-43ac-8c00-e40d47da1a43","actor_username":"hkpking@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-08-22 12:09:12.813226+08	
\.


--
-- TOC entry 4203 (class 0 OID 16657)
-- Dependencies: 238
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- TOC entry 4204 (class 0 OID 16662)
-- Dependencies: 239
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
e841df39-0ab7-43ac-8c00-e40d47da1a43	e841df39-0ab7-43ac-8c00-e40d47da1a43	{"sub": "e841df39-0ab7-43ac-8c00-e40d47da1a43", "email": "hkpking@example.com", "email_verified": false, "phone_verified": false}	email	2025-08-19 16:39:31.375871+08	2025-08-19 16:39:31.375919+08	2025-08-19 16:39:31.375919+08	4d106ac1-e174-486e-b753-ddb575d3209e
\.


--
-- TOC entry 4205 (class 0 OID 16669)
-- Dependencies: 240
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4206 (class 0 OID 16674)
-- Dependencies: 241
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
384b18d8-4708-4a18-bdff-97240d7dc127	2025-08-21 14:39:30.951432+08	2025-08-21 14:39:30.951432+08	password	72f6ffde-d12e-4f77-8bbd-ab1cff1f6814
9feec499-fb16-4775-86b2-3be09a419613	2025-08-22 11:47:50.72365+08	2025-08-22 11:47:50.72365+08	password	904a369f-01c2-4fe4-9e03-f196e4848340
7b8240dc-540e-45c0-8651-e71029db0bee	2025-08-22 12:09:03.517536+08	2025-08-22 12:09:03.517536+08	password	f1eb6955-e999-4afc-9cfa-92a787491eec
502ee34b-a256-4627-aed5-29457c3967c1	2025-08-22 12:09:12.819201+08	2025-08-22 12:09:12.819201+08	password	06b2c8d3-6c99-439c-818f-04038acc4613
\.


--
-- TOC entry 4207 (class 0 OID 16679)
-- Dependencies: 242
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4208 (class 0 OID 16684)
-- Dependencies: 243
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- TOC entry 4209 (class 0 OID 16689)
-- Dependencies: 244
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4210 (class 0 OID 16697)
-- Dependencies: 245
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	525	xmnzwxguqlwa	e841df39-0ab7-43ac-8c00-e40d47da1a43	f	2025-08-21 14:39:30.946599+08	2025-08-21 14:39:30.946599+08	\N	384b18d8-4708-4a18-bdff-97240d7dc127
00000000-0000-0000-0000-000000000000	526	yo25h7moxglj	e841df39-0ab7-43ac-8c00-e40d47da1a43	f	2025-08-22 11:47:50.690226+08	2025-08-22 11:47:50.690226+08	\N	9feec499-fb16-4775-86b2-3be09a419613
00000000-0000-0000-0000-000000000000	527	6lcancudcqeb	e841df39-0ab7-43ac-8c00-e40d47da1a43	f	2025-08-22 12:09:03.512944+08	2025-08-22 12:09:03.512944+08	\N	7b8240dc-540e-45c0-8651-e71029db0bee
00000000-0000-0000-0000-000000000000	528	szs6jzpxpuy2	e841df39-0ab7-43ac-8c00-e40d47da1a43	f	2025-08-22 12:09:12.81672+08	2025-08-22 12:09:12.81672+08	\N	502ee34b-a256-4627-aed5-29457c3967c1
\.


--
-- TOC entry 4212 (class 0 OID 16703)
-- Dependencies: 247
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4213 (class 0 OID 16711)
-- Dependencies: 248
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4214 (class 0 OID 16717)
-- Dependencies: 249
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- TOC entry 4215 (class 0 OID 16720)
-- Dependencies: 250
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
384b18d8-4708-4a18-bdff-97240d7dc127	e841df39-0ab7-43ac-8c00-e40d47da1a43	2025-08-21 14:39:30.943201+08	2025-08-21 14:39:30.943201+08	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0	64.23.154.139	\N
9feec499-fb16-4775-86b2-3be09a419613	e841df39-0ab7-43ac-8c00-e40d47da1a43	2025-08-22 11:47:50.663502+08	2025-08-22 11:47:50.663502+08	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0	120.86.127.114	\N
7b8240dc-540e-45c0-8651-e71029db0bee	e841df39-0ab7-43ac-8c00-e40d47da1a43	2025-08-22 12:09:03.510435+08	2025-08-22 12:09:03.510435+08	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0	61.145.169.66	\N
502ee34b-a256-4627-aed5-29457c3967c1	e841df39-0ab7-43ac-8c00-e40d47da1a43	2025-08-22 12:09:12.815935+08	2025-08-22 12:09:12.815935+08	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0	61.145.169.66	\N
\.


--
-- TOC entry 4216 (class 0 OID 16725)
-- Dependencies: 251
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4217 (class 0 OID 16731)
-- Dependencies: 252
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4218 (class 0 OID 16737)
-- Dependencies: 253
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	e841df39-0ab7-43ac-8c00-e40d47da1a43	authenticated	authenticated	hkpking@example.com	$2a$10$Zxmdnj1fXBJb0cT38LfYWOlKWDzu7CJNkGjNGNRPz3DJyQdPG.rk.	2025-08-19 16:39:31.381029+08	\N		\N		\N			\N	2025-08-22 12:09:12.815852+08	{"provider": "email", "providers": ["email"]}	{"sub": "e841df39-0ab7-43ac-8c00-e40d47da1a43", "email": "hkpking@example.com", "email_verified": true, "phone_verified": false}	\N	2025-08-19 16:39:31.369412+08	2025-08-22 12:09:12.818263+08	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 4251 (class 0 OID 17978)
-- Dependencies: 289
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, name, description, icon_url, points, created_at) FROM stdin;
\.


--
-- TOC entry 4252 (class 0 OID 17988)
-- Dependencies: 290
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.badges (id, name, description, icon_url, created_at) FROM stdin;
\.


--
-- TOC entry 4250 (class 0 OID 17963)
-- Dependencies: 288
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocks (id, section_id, title, content_markdown, video_url, quiz_question, quiz_options, correct_answer_index, pdf_url, document_url, ppt_url, "order", created_at, content, type, points, is_required, content_format, content_html) FROM stdin;
\.


--
-- TOC entry 4247 (class 0 OID 17925)
-- Dependencies: 285
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, title, description, "order", created_at) FROM stdin;
e527bd29-c854-4297-bd06-19a01ef6eff7	觉醒篇	初识流程	0	2025-09-04 11:40:06.875918+08
550e8400-e29b-41d4-a716-446655440001	流程管理基础	学习流程管理的基本概念和原理	1	2025-09-04 11:40:06.875918+08
550e8400-e29b-41d4-a716-446655440002	进阶教程	深入学习内容	2	2025-09-28 14:48:53.024225+08
550e8400-e29b-41d4-a716-446655440003	实战项目	实际应用项目	3	2025-09-28 14:48:53.024225+08
\.


--
-- TOC entry 4253 (class 0 OID 17997)
-- Dependencies: 291
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.challenges (id, title, description, points, created_at) FROM stdin;
\.


--
-- TOC entry 4248 (class 0 OID 17935)
-- Dependencies: 286
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters (id, category_id, title, description, image_url, "order", created_at) FROM stdin;
91a7a32d-e139-4977-8aa6-877db9dc0308	e527bd29-c854-4297-bd06-19a01ef6eff7	天命人觉醒		\N	0	2025-09-04 11:40:13.796507+08
550e8400-e29b-41d4-a716-446655440011	550e8400-e29b-41d4-a716-446655440001	第一章：入门基础	学习基础概念	\N	1	2025-09-28 14:48:53.040809+08
550e8400-e29b-41d4-a716-446655440012	550e8400-e29b-41d4-a716-446655440001	第二章：核心概念	掌握核心知识	\N	2	2025-09-28 14:48:53.040809+08
550e8400-e29b-41d4-a716-446655440021	550e8400-e29b-41d4-a716-446655440002	第三章：进阶技巧	学习高级技巧	\N	1	2025-09-28 14:48:53.040809+08
\.


--
-- TOC entry 4244 (class 0 OID 17877)
-- Dependencies: 282
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, full_name, role, faction, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4245 (class 0 OID 17892)
-- Dependencies: 283
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scores (user_id, username, points, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4249 (class 0 OID 17950)
-- Dependencies: 287
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, chapter_id, title, "order", created_at) FROM stdin;
550e8400-e29b-41d4-a716-446655440111	550e8400-e29b-41d4-a716-446655440011	1.1 基本概念	1	2025-09-28 14:48:53.055791+08
550e8400-e29b-41d4-a716-446655440112	550e8400-e29b-41d4-a716-446655440011	1.2 环境搭建	2	2025-09-28 14:48:53.055791+08
550e8400-e29b-41d4-a716-446655440121	550e8400-e29b-41d4-a716-446655440012	2.1 核心原理	1	2025-09-28 14:48:53.055791+08
92c73fe4-218e-4643-a726-1a30e9160ed0	550e8400-e29b-41d4-a716-446655440021	第三章：进阶技巧 - 基础内容	1	2025-09-28 14:53:35.695262+08
ee48500d-a135-4f5f-9575-94ec4802c527	550e8400-e29b-41d4-a716-446655440021	第三章：进阶技巧 - 实践应用	2	2025-09-28 14:53:35.711859+08
05725a3a-05cc-4f8c-a3f9-f0212596a2fc	550e8400-e29b-41d4-a716-446655440021	第三章：进阶技巧 - 总结回顾	3	2025-09-28 14:53:35.726425+08
3eb8f479-1564-499b-8d35-ef05d5e6cb41	91a7a32d-e139-4977-8aa6-877db9dc0308	天命人觉醒 - 基础内容	1	2025-09-28 14:53:35.741914+08
09b68c53-6fc9-436d-b361-804482f57e7d	91a7a32d-e139-4977-8aa6-877db9dc0308	天命人觉醒 - 实践应用	2	2025-09-28 14:53:35.755257+08
3668c114-c073-4322-ac9d-d4361edd1b55	91a7a32d-e139-4977-8aa6-877db9dc0308	天命人觉醒 - 总结回顾	3	2025-09-28 14:53:35.771869+08
\.


--
-- TOC entry 4254 (class 0 OID 18007)
-- Dependencies: 292
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_achievements (user_id, achievement_id, earned_at) FROM stdin;
\.


--
-- TOC entry 4255 (class 0 OID 18023)
-- Dependencies: 293
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_badges (user_id, badge_id, earned_at) FROM stdin;
\.


--
-- TOC entry 4246 (class 0 OID 17907)
-- Dependencies: 284
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_progress (user_id, completed_sections, completed_blocks, awarded_points_sections, awarded_points_blocks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4243 (class 0 OID 17863)
-- Dependencies: 281
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, email_confirmed_at, created_at, updated_at, role, aud) FROM stdin;
962f48f9-2d0e-4f88-8e7c-c9e2f84f50b8	test@test.com	hashedpassword	\N	2025-09-04 11:36:55.886244+08	2025-09-04 11:36:55.886244+08	authenticated	authenticated
\.


--
-- TOC entry 4219 (class 0 OID 16847)
-- Dependencies: 255
-- Data for Name: messages_2025_08_08; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_08 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4220 (class 0 OID 16856)
-- Dependencies: 256
-- Data for Name: messages_2025_08_09; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_09 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4221 (class 0 OID 16865)
-- Dependencies: 257
-- Data for Name: messages_2025_08_10; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_10 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4222 (class 0 OID 16874)
-- Dependencies: 258
-- Data for Name: messages_2025_08_11; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_11 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4223 (class 0 OID 16883)
-- Dependencies: 259
-- Data for Name: messages_2025_08_12; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_12 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4224 (class 0 OID 16892)
-- Dependencies: 260
-- Data for Name: messages_2025_08_13; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_13 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4225 (class 0 OID 16901)
-- Dependencies: 261
-- Data for Name: messages_2025_08_14; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_14 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4236 (class 0 OID 17612)
-- Dependencies: 274
-- Data for Name: messages_2025_08_27; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_27 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4237 (class 0 OID 17621)
-- Dependencies: 275
-- Data for Name: messages_2025_08_28; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_28 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4238 (class 0 OID 17630)
-- Dependencies: 276
-- Data for Name: messages_2025_08_29; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_29 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4239 (class 0 OID 17639)
-- Dependencies: 277
-- Data for Name: messages_2025_08_30; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_30 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4240 (class 0 OID 17648)
-- Dependencies: 278
-- Data for Name: messages_2025_08_31; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_08_31 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- TOC entry 4226 (class 0 OID 16910)
-- Dependencies: 262
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-07-05 02:58:35
20211116045059	2025-07-05 02:58:35
20211116050929	2025-07-05 02:58:35
20211116051442	2025-07-05 02:58:35
20211116212300	2025-07-05 02:58:35
20211116213355	2025-07-05 02:58:35
20211116213934	2025-07-05 02:58:35
20211116214523	2025-07-05 02:58:35
20211122062447	2025-07-05 02:58:35
20211124070109	2025-07-05 02:58:35
20211202204204	2025-07-05 02:58:35
20211202204605	2025-07-05 02:58:35
20211210212804	2025-07-05 02:58:35
20211228014915	2025-07-05 02:58:35
20220107221237	2025-07-05 02:58:35
20220228202821	2025-07-05 02:58:35
20220312004840	2025-07-05 02:58:35
20220603231003	2025-07-05 02:58:35
20220603232444	2025-07-05 02:58:35
20220615214548	2025-07-05 02:58:35
20220712093339	2025-07-05 02:58:35
20220908172859	2025-07-05 02:58:35
20220916233421	2025-07-05 02:58:35
20230119133233	2025-07-05 02:58:35
20230128025114	2025-07-05 02:58:35
20230128025212	2025-07-05 02:58:35
20230227211149	2025-07-05 02:58:35
20230228184745	2025-07-05 02:58:36
20230308225145	2025-07-05 02:58:36
20230328144023	2025-07-05 02:58:36
20231018144023	2025-07-05 02:58:36
20231204144023	2025-07-05 02:58:36
20231204144024	2025-07-05 02:58:36
20231204144025	2025-07-05 02:58:36
20240108234812	2025-07-05 02:58:36
20240109165339	2025-07-05 02:58:36
20240227174441	2025-07-05 02:58:36
20240311171622	2025-07-05 02:58:36
20240321100241	2025-07-05 02:58:36
20240401105812	2025-07-05 02:58:36
20240418121054	2025-07-05 02:58:36
20240523004032	2025-07-05 02:58:36
20240618124746	2025-07-05 02:58:36
20240801235015	2025-07-05 02:58:36
20240805133720	2025-07-05 02:58:36
20240827160934	2025-07-05 02:58:36
20240919163303	2025-07-05 02:58:36
20240919163305	2025-07-05 02:58:36
20241019105805	2025-07-05 02:58:36
20241030150047	2025-07-05 02:58:36
20241108114728	2025-07-05 02:58:36
20241121104152	2025-07-05 02:58:36
20241130184212	2025-07-05 02:58:36
20241220035512	2025-07-05 02:58:36
20241220123912	2025-07-05 02:58:36
20241224161212	2025-07-05 02:58:36
20250107150512	2025-07-05 02:58:36
20250110162412	2025-07-05 02:58:36
20250123174212	2025-07-05 02:58:36
20250128220012	2025-07-05 02:58:36
20250506224012	2025-07-05 02:58:36
20250523164012	2025-07-05 02:58:36
20250714121412	2025-07-18 10:44:47
\.


--
-- TOC entry 4227 (class 0 OID 16913)
-- Dependencies: 263
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 4229 (class 0 OID 16922)
-- Dependencies: 265
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
lcxx	lcxx	\N	2025-07-07 20:07:34.74911+08	2025-07-07 20:07:34.74911+08	t	f	\N	\N	\N
lc	lc	\N	2025-07-08 15:04:58.775963+08	2025-07-08 15:04:58.775963+08	f	f	52428800	{video/*}	\N
\.


--
-- TOC entry 4241 (class 0 OID 17657)
-- Dependencies: 279
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4230 (class 0 OID 16931)
-- Dependencies: 266
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-05 02:58:36.505468
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-05 02:58:36.514006
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-05 02:58:36.523834
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-05 02:58:36.549207
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-05 02:58:36.566507
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-05 02:58:36.580496
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-05 02:58:36.591754
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-05 02:58:36.602654
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-05 02:58:36.612446
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-05 02:58:36.622001
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-05 02:58:36.629735
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-05 02:58:36.636494
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-05 02:58:36.64539
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-05 02:58:36.653518
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-05 02:58:36.662137
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-05 02:58:36.712663
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-05 02:58:36.717889
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-05 02:58:36.724624
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-05 02:58:36.730082
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-05 02:58:36.745547
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-05 02:58:36.757202
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-05 02:58:36.764396
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-05 02:58:36.80681
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-05 02:58:36.823663
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-05 02:58:36.832287
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-05 02:58:36.837839
\.


--
-- TOC entry 4231 (class 0 OID 16935)
-- Dependencies: 267
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
cde8cfe0-43e3-45e4-a60f-af86cfa5ce7b	lcxx	.emptyFolderPlaceholder	\N	2025-07-08 15:02:48.440369+08	2025-07-08 15:02:48.440369+08	2025-07-08 15:02:48.440369+08	{"eTag": "\\"d41d8cd98f00b204e9800998ecf8427e\\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2025-07-08T07:02:49.000Z", "contentLength": 0, "httpStatusCode": 200}	eb1be209-d3a2-4592-8e22-18c4d1a3d5be	\N	{}
6139fa92-0913-4129-aeca-e7f03249cdba	lcxx	Gemini_Generated_Image_b2j5rlb2j5rlb2j5.png	\N	2025-07-14 10:46:22.878976+08	2025-07-14 10:46:22.878976+08	2025-07-14 10:46:22.878976+08	{"eTag": "\\"b634c357cf89b1aef69189c4df43b490-1\\"", "size": 6164010, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-07-14T02:46:22.000Z", "contentLength": 6164010, "httpStatusCode": 200}	ed520f7f-0b1d-4bb1-a963-11efafb4f777	\N	\N
\.


--
-- TOC entry 4242 (class 0 OID 17666)
-- Dependencies: 280
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4232 (class 0 OID 16945)
-- Dependencies: 268
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4233 (class 0 OID 16952)
-- Dependencies: 269
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4234 (class 0 OID 16960)
-- Dependencies: 270
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
\.


--
-- TOC entry 4235 (class 0 OID 16965)
-- Dependencies: 271
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- TOC entry 3640 (class 0 OID 16478)
-- Dependencies: 232
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4297 (class 0 OID 0)
-- Dependencies: 246
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 528, true);


--
-- TOC entry 4298 (class 0 OID 0)
-- Dependencies: 264
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 3821 (class 2606 OID 16972)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 3805 (class 2606 OID 16974)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3809 (class 2606 OID 16976)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 3814 (class 2606 OID 16978)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 3816 (class 2606 OID 16980)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 3819 (class 2606 OID 16982)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 3823 (class 2606 OID 16984)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 3826 (class 2606 OID 16986)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3829 (class 2606 OID 16988)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 3831 (class 2606 OID 16990)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 3836 (class 2606 OID 16992)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3844 (class 2606 OID 16994)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3847 (class 2606 OID 16996)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 3850 (class 2606 OID 16998)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 3852 (class 2606 OID 17000)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 17002)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3860 (class 2606 OID 17004)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3863 (class 2606 OID 17006)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3868 (class 2606 OID 17008)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 3871 (class 2606 OID 17010)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3883 (class 2606 OID 17012)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3885 (class 2606 OID 17014)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3972 (class 2606 OID 17987)
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 17996)
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3969 (class 2606 OID 17972)
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- TOC entry 3960 (class 2606 OID 17934)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3976 (class 2606 OID 18006)
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3963 (class 2606 OID 17944)
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- TOC entry 3951 (class 2606 OID 17886)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3954 (class 2606 OID 17899)
-- Name: scores scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3956 (class 2606 OID 17901)
-- Name: scores scores_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_username_key UNIQUE (username);


--
-- TOC entry 3967 (class 2606 OID 17957)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3978 (class 2606 OID 18012)
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (user_id, achievement_id);


--
-- TOC entry 3980 (class 2606 OID 18028)
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (user_id, badge_id);


--
-- TOC entry 3958 (class 2606 OID 17919)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3946 (class 2606 OID 17876)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3948 (class 2606 OID 17874)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3887 (class 2606 OID 17050)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3889 (class 2606 OID 17052)
-- Name: messages_2025_08_08 messages_2025_08_08_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_08
    ADD CONSTRAINT messages_2025_08_08_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3891 (class 2606 OID 17054)
-- Name: messages_2025_08_09 messages_2025_08_09_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_09
    ADD CONSTRAINT messages_2025_08_09_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3893 (class 2606 OID 17056)
-- Name: messages_2025_08_10 messages_2025_08_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_10
    ADD CONSTRAINT messages_2025_08_10_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3895 (class 2606 OID 17058)
-- Name: messages_2025_08_11 messages_2025_08_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_11
    ADD CONSTRAINT messages_2025_08_11_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3897 (class 2606 OID 17060)
-- Name: messages_2025_08_12 messages_2025_08_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_12
    ADD CONSTRAINT messages_2025_08_12_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3899 (class 2606 OID 17062)
-- Name: messages_2025_08_13 messages_2025_08_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_13
    ADD CONSTRAINT messages_2025_08_13_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3901 (class 2606 OID 17064)
-- Name: messages_2025_08_14 messages_2025_08_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_14
    ADD CONSTRAINT messages_2025_08_14_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3930 (class 2606 OID 17675)
-- Name: messages_2025_08_27 messages_2025_08_27_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_27
    ADD CONSTRAINT messages_2025_08_27_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3932 (class 2606 OID 17677)
-- Name: messages_2025_08_28 messages_2025_08_28_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_28
    ADD CONSTRAINT messages_2025_08_28_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3934 (class 2606 OID 17679)
-- Name: messages_2025_08_29 messages_2025_08_29_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_29
    ADD CONSTRAINT messages_2025_08_29_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3936 (class 2606 OID 17681)
-- Name: messages_2025_08_30 messages_2025_08_30_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_30
    ADD CONSTRAINT messages_2025_08_30_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3938 (class 2606 OID 17683)
-- Name: messages_2025_08_31 messages_2025_08_31_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_08_31
    ADD CONSTRAINT messages_2025_08_31_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 3906 (class 2606 OID 17066)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 3903 (class 2606 OID 17068)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3940 (class 2606 OID 17720)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 3910 (class 2606 OID 17070)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 3912 (class 2606 OID 17072)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 3914 (class 2606 OID 17074)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3919 (class 2606 OID 17076)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 3943 (class 2606 OID 17722)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 3924 (class 2606 OID 17078)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 3922 (class 2606 OID 17080)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 3926 (class 2606 OID 17082)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3928 (class 2606 OID 17084)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 3806 (class 1259 OID 17085)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 3873 (class 1259 OID 17086)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3874 (class 1259 OID 17087)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3875 (class 1259 OID 17088)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3827 (class 1259 OID 17089)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 3807 (class 1259 OID 17090)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 3812 (class 1259 OID 17091)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4299 (class 0 OID 0)
-- Dependencies: 3812
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3817 (class 1259 OID 17092)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 3810 (class 1259 OID 17093)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 3811 (class 1259 OID 17094)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 3824 (class 1259 OID 17095)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 3832 (class 1259 OID 17096)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 3833 (class 1259 OID 17097)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 3837 (class 1259 OID 17098)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 3838 (class 1259 OID 17099)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 3839 (class 1259 OID 17100)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 3876 (class 1259 OID 17101)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3877 (class 1259 OID 17102)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 3840 (class 1259 OID 17103)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 3841 (class 1259 OID 17104)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 3842 (class 1259 OID 17105)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 3845 (class 1259 OID 17106)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 3848 (class 1259 OID 17107)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 3853 (class 1259 OID 17108)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 3854 (class 1259 OID 17109)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 3855 (class 1259 OID 17110)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 3858 (class 1259 OID 17111)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 3861 (class 1259 OID 17112)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 3864 (class 1259 OID 17113)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 3866 (class 1259 OID 17114)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 3869 (class 1259 OID 17115)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 3872 (class 1259 OID 17116)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 3834 (class 1259 OID 17117)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 3865 (class 1259 OID 17118)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 3878 (class 1259 OID 17119)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4300 (class 0 OID 0)
-- Dependencies: 3878
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 3879 (class 1259 OID 17120)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 3880 (class 1259 OID 17121)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 3881 (class 1259 OID 17122)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 3970 (class 1259 OID 18045)
-- Name: idx_blocks_section_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blocks_section_order ON public.blocks USING btree (section_id, "order");


--
-- TOC entry 3961 (class 1259 OID 18042)
-- Name: idx_categories_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_order ON public.categories USING btree ("order");


--
-- TOC entry 3964 (class 1259 OID 18043)
-- Name: idx_chapters_category_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chapters_category_order ON public.chapters USING btree (category_id, "order");


--
-- TOC entry 3949 (class 1259 OID 18040)
-- Name: idx_profiles_faction; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_faction ON public.profiles USING btree (faction);


--
-- TOC entry 3952 (class 1259 OID 18041)
-- Name: idx_scores_points; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scores_points ON public.scores USING btree (points DESC);


--
-- TOC entry 3965 (class 1259 OID 18044)
-- Name: idx_sections_chapter_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sections_chapter_order ON public.sections USING btree (chapter_id, "order");


--
-- TOC entry 3944 (class 1259 OID 18039)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3904 (class 1259 OID 17126)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 3907 (class 1259 OID 17127)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 3908 (class 1259 OID 17128)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 3915 (class 1259 OID 17129)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 3920 (class 1259 OID 17130)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 3916 (class 1259 OID 17131)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 3941 (class 1259 OID 17726)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 3917 (class 1259 OID 17132)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 3981 (class 0 OID 0)
-- Name: messages_2025_08_08_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_08_pkey;


--
-- TOC entry 3982 (class 0 OID 0)
-- Name: messages_2025_08_09_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_09_pkey;


--
-- TOC entry 3983 (class 0 OID 0)
-- Name: messages_2025_08_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_10_pkey;


--
-- TOC entry 3984 (class 0 OID 0)
-- Name: messages_2025_08_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_11_pkey;


--
-- TOC entry 3985 (class 0 OID 0)
-- Name: messages_2025_08_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_12_pkey;


--
-- TOC entry 3986 (class 0 OID 0)
-- Name: messages_2025_08_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_13_pkey;


--
-- TOC entry 3987 (class 0 OID 0)
-- Name: messages_2025_08_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_14_pkey;


--
-- TOC entry 3988 (class 0 OID 0)
-- Name: messages_2025_08_27_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_27_pkey;


--
-- TOC entry 3989 (class 0 OID 0)
-- Name: messages_2025_08_28_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_28_pkey;


--
-- TOC entry 3990 (class 0 OID 0)
-- Name: messages_2025_08_29_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_29_pkey;


--
-- TOC entry 3991 (class 0 OID 0)
-- Name: messages_2025_08_30_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_30_pkey;


--
-- TOC entry 3992 (class 0 OID 0)
-- Name: messages_2025_08_31_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_08_31_pkey;


--
-- TOC entry 4019 (class 2620 OID 17134)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4020 (class 2620 OID 17728)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4021 (class 2620 OID 17729)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4022 (class 2620 OID 17730)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 4023 (class 2620 OID 17731)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- TOC entry 4025 (class 2620 OID 17732)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 4026 (class 2620 OID 17733)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 4024 (class 2620 OID 17135)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 3993 (class 2606 OID 17136)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3994 (class 2606 OID 17141)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3995 (class 2606 OID 17146)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 3996 (class 2606 OID 17151)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3997 (class 2606 OID 17156)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 3998 (class 2606 OID 17161)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3999 (class 2606 OID 17166)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4000 (class 2606 OID 17171)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4001 (class 2606 OID 17176)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4002 (class 2606 OID 17181)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4003 (class 2606 OID 17186)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4014 (class 2606 OID 17973)
-- Name: blocks blocks_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- TOC entry 4012 (class 2606 OID 17945)
-- Name: chapters chapters_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 4009 (class 2606 OID 17887)
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4010 (class 2606 OID 17902)
-- Name: scores scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4013 (class 2606 OID 17958)
-- Name: sections sections_chapter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- TOC entry 4015 (class 2606 OID 18018)
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- TOC entry 4016 (class 2606 OID 18013)
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4017 (class 2606 OID 18034)
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;


--
-- TOC entry 4018 (class 2606 OID 18029)
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4011 (class 2606 OID 17920)
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4004 (class 2606 OID 17246)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4008 (class 2606 OID 17789)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4005 (class 2606 OID 17251)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4006 (class 2606 OID 17256)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4007 (class 2606 OID 17261)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4175 (class 0 OID 16651)
-- Dependencies: 237
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4176 (class 0 OID 16657)
-- Dependencies: 238
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4177 (class 0 OID 16662)
-- Dependencies: 239
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4178 (class 0 OID 16669)
-- Dependencies: 240
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4179 (class 0 OID 16674)
-- Dependencies: 241
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4180 (class 0 OID 16679)
-- Dependencies: 242
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4181 (class 0 OID 16684)
-- Dependencies: 243
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4182 (class 0 OID 16689)
-- Dependencies: 244
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4183 (class 0 OID 16697)
-- Dependencies: 245
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4184 (class 0 OID 16703)
-- Dependencies: 247
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4185 (class 0 OID 16711)
-- Dependencies: 248
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4186 (class 0 OID 16717)
-- Dependencies: 249
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4187 (class 0 OID 16720)
-- Dependencies: 250
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4188 (class 0 OID 16725)
-- Dependencies: 251
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4189 (class 0 OID 16731)
-- Dependencies: 252
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4190 (class 0 OID 16737)
-- Dependencies: 253
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4191 (class 0 OID 16840)
-- Dependencies: 254
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4192 (class 0 OID 16922)
-- Dependencies: 265
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4197 (class 0 OID 17657)
-- Dependencies: 279
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4193 (class 0 OID 16931)
-- Dependencies: 266
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4194 (class 0 OID 16935)
-- Dependencies: 267
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4198 (class 0 OID 17666)
-- Dependencies: 280
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4195 (class 0 OID 16945)
-- Dependencies: 268
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4196 (class 0 OID 16952)
-- Dependencies: 269
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4199 (class 6104 OID 17298)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4200 (class 6104 OID 17299)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4201 (class 6106 OID 17300)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- TOC entry 3634 (class 3466 OID 17331)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- TOC entry 3635 (class 3466 OID 17332)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- TOC entry 3636 (class 3466 OID 17333)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- TOC entry 3637 (class 3466 OID 17334)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- TOC entry 3638 (class 3466 OID 17335)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- TOC entry 3639 (class 3466 OID 17336)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


-- Completed on 2025-10-13 15:50:54

--
-- PostgreSQL database dump complete
--

\unrestrict tMnbga1yXdTk71nUF3Y7cEdb9xWxUBj1oPMYc0jigAXk8Hm2G6dHssBfvbVd1N3

-- Completed on 2025-10-13 15:50:54

--
-- PostgreSQL database cluster dump complete
--

