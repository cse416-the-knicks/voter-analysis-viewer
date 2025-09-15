-- Create project role
CREATE ROLE "Leffison Members" WITH LOGIN PASSWORD 'raj';

-- Create database owned by that role
CREATE DATABASE leffison_db OWNER "Leffison Members";

\connect leffison_db

-- Create schema and set defaults
CREATE SCHEMA app AUTHORIZATION "Leffison Members";
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
ALTER ROLE "Leffison Members" SET search_path = app, public;
