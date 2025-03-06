--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: juegos_plataformas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.juegos_plataformas (
    id integer NOT NULL,
    id_plataforma integer NOT NULL,
    usado boolean DEFAULT false
);


ALTER TABLE public.juegos_plataformas OWNER TO postgres;

--
-- Name: plataformas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plataformas (
    id_plataforma integer NOT NULL,
    nombre_plataforma character varying(100) NOT NULL
);


ALTER TABLE public.plataformas OWNER TO postgres;

--
-- Name: plataformas_id_plataforma_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plataformas_id_plataforma_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plataformas_id_plataforma_seq OWNER TO postgres;

--
-- Name: plataformas_id_plataforma_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plataformas_id_plataforma_seq OWNED BY public.plataformas.id_plataforma;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    nombre_juego character varying(255) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    fecha_lanzamiento date NOT NULL,
    imageurl character varying(255),
    videourl character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_juego_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_juego_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_juego_seq OWNER TO postgres;

--
-- Name: products_id_juego_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_juego_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: plataformas id_plataforma; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataformas ALTER COLUMN id_plataforma SET DEFAULT nextval('public.plataformas_id_plataforma_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_juego_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: juegos_plataformas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.juegos_plataformas (id, id_plataforma, usado) FROM stdin;
1	1	t
2	1	t
3	2	t
6	2	f
4	3	f
5	3	f
\.


--
-- Data for Name: plataformas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plataformas (id_plataforma, nombre_plataforma) FROM stdin;
1	PS4
2	Nintendo Switch
3	Xbox One
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, nombre_juego, descripcion, precio, fecha_lanzamiento, imageurl, videourl) FROM stdin;
1	Sekiro	Juego de acción y aventura desarrollado por FromSoftware	59.99	2019-03-22	/images/sekiro-ps4.webp	https://www.youtube.com/embed/rXMX4YJ7Lks
2	Outriders	RPG de disparos cooperativo	59.99	2021-04-01	/images/outriders-ps4.webp	https://www.youtube.com/embed/SrRDiiaCf8c
3	Donkey Kong Country	Juego de plataformas con Donkey Kong	59.99	2018-05-04	/images/donkeykongcountry-switch.webp	https://www.youtube.com/embed/_5p0SiWHwvw
4	Mortal Kombat	Juego de lucha con gráficos mejorados	59.99	2019-04-23	/images/mk11-xbox.webp	https://www.youtube.com/embed/G4My4kc-Lbo
5	Cyberpunk 2077	RPG en un mundo distópico futurista	59.99	2020-12-10	/images/cyberpunk2077-xbox.webp	https://www.youtube.com/embed/AY5tccjZFKU
6	Zelda: Breath of the Wild	Juego de aventura y exploración en un vasto mundo abierto	59.99	2017-03-03	/images/tlozbotw-switch.webp	https://www.youtube.com/embed/IJnnn0BBj_c
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
21	testUser2@example.com	$2b$10$DCSY/nrVMJ61Qy3TmQVdQuE9E9JwCVVJkMAX2bjjfuebNjBTip2Vu
22	asd@asdf.com	$2b$10$LFKapSe6oKx5/3cCgQ5XvuniBMKQYqY.PiNDEdjjdgH8cfz0sWqMq
\.


--
-- Name: plataformas_id_plataforma_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plataformas_id_plataforma_seq', 3, true);


--
-- Name: products_id_juego_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_juego_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: juegos_plataformas juegos_plataformas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.juegos_plataformas
    ADD CONSTRAINT juegos_plataformas_pkey PRIMARY KEY (id, id_plataforma);


--
-- Name: plataformas plataformas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataformas
    ADD CONSTRAINT plataformas_pkey PRIMARY KEY (id_plataforma);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (email);


--
-- Name: juegos_plataformas juegos_plataformas_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.juegos_plataformas
    ADD CONSTRAINT juegos_plataformas_id_fkey FOREIGN KEY (id) REFERENCES public.products(id);


--
-- Name: juegos_plataformas juegos_plataformas_id_plataforma_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.juegos_plataformas
    ADD CONSTRAINT juegos_plataformas_id_plataforma_fkey FOREIGN KEY (id_plataforma) REFERENCES public.plataformas(id_plataforma);


--
-- PostgreSQL database dump complete
--

