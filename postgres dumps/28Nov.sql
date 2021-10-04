--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

-- Started on 2020-11-28 17:14:21 SAST

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

--
-- TOC entry 560 (class 1247 OID 25488)
-- Name: enum_Assessments_assessmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Assessments_assessmentType" AS ENUM (
    'Activity',
    'Class Test',
    'Practical',
    'Assignment',
    'Demo',
    'Project',
    'Mini Project',
    'Sememster Test',
    'Exam',
    'Tutorial',
    'Tutorial Test'
);


ALTER TYPE public."enum_Assessments_assessmentType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 25511)
-- Name: Assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Assessments" (
    id integer NOT NULL,
    "assessmentType" public."enum_Assessments_assessmentType",
    "assessmentName" character varying(255),
    "perWeight" numeric,
    active boolean,
    total numeric,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "CourseId" integer
);


ALTER TABLE public."Assessments" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 25517)
-- Name: Assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Assessments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Assessments_id_seq" OWNER TO postgres;

--
-- TOC entry 3324 (class 0 OID 0)
-- Dependencies: 213
-- Name: Assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Assessments_id_seq" OWNED BY public."Assessments".id;


--
-- TOC entry 214 (class 1259 OID 25519)
-- Name: Courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Courses" (
    id integer NOT NULL,
    year integer,
    active boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ModuleId" integer
);


ALTER TABLE public."Courses" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25522)
-- Name: Courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Courses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Courses_id_seq" OWNER TO postgres;

--
-- TOC entry 3325 (class 0 OID 0)
-- Dependencies: 215
-- Name: Courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Courses_id_seq" OWNED BY public."Courses".id;


--
-- TOC entry 216 (class 1259 OID 25524)
-- Name: Marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Marks" (
    id integer NOT NULL,
    "studentNumber" character varying(255) NOT NULL,
    "courseId" integer,
    "assessmentId" integer,
    mark integer,
    "totalMark" integer,
    "perWeight" numeric,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Marks" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25530)
-- Name: Marks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Marks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Marks_id_seq" OWNER TO postgres;

--
-- TOC entry 3326 (class 0 OID 0)
-- Dependencies: 217
-- Name: Marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Marks_id_seq" OWNED BY public."Marks".id;


--
-- TOC entry 218 (class 1259 OID 25532)
-- Name: Modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Modules" (
    id integer NOT NULL,
    "moduleCode" character varying(255),
    "moduleName" character varying(255),
    active boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Modules" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25538)
-- Name: Modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Modules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Modules_id_seq" OWNER TO postgres;

--
-- TOC entry 3327 (class 0 OID 0)
-- Dependencies: 219
-- Name: Modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Modules_id_seq" OWNED BY public."Modules".id;


--
-- TOC entry 226 (class 1259 OID 25603)
-- Name: Notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notes" (
    id integer NOT NULL,
    course character varying(255),
    educator character varying(255),
    "noteDescription" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer
);


ALTER TABLE public."Notes" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25601)
-- Name: Notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notes_id_seq" OWNER TO postgres;

--
-- TOC entry 3328 (class 0 OID 0)
-- Dependencies: 225
-- Name: Notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notes_id_seq" OWNED BY public."Notes".id;


--
-- TOC entry 220 (class 1259 OID 25540)
-- Name: Role_Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role_Course" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "RoleId" integer NOT NULL,
    "CourseId" integer NOT NULL
);


ALTER TABLE public."Role_Course" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25543)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    id integer NOT NULL,
    "roleType" character varying(255),
    active boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25546)
-- Name: Roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_id_seq" OWNER TO postgres;

--
-- TOC entry 3329 (class 0 OID 0)
-- Dependencies: 222
-- Name: Roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;


--
-- TOC entry 223 (class 1259 OID 25548)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255),
    "lastName" character varying(255),
    active boolean,
    "upNumber" character varying(255) NOT NULL,
    email character varying(255),
    "lastLogin" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25554)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 3330 (class 0 OID 0)
-- Dependencies: 224
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 3149 (class 2604 OID 25642)
-- Name: Assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assessments" ALTER COLUMN id SET DEFAULT nextval('public."Assessments_id_seq"'::regclass);


--
-- TOC entry 3150 (class 2604 OID 25643)
-- Name: Courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses" ALTER COLUMN id SET DEFAULT nextval('public."Courses_id_seq"'::regclass);


--
-- TOC entry 3151 (class 2604 OID 25644)
-- Name: Marks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Marks" ALTER COLUMN id SET DEFAULT nextval('public."Marks_id_seq"'::regclass);


--
-- TOC entry 3152 (class 2604 OID 25645)
-- Name: Modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Modules" ALTER COLUMN id SET DEFAULT nextval('public."Modules_id_seq"'::regclass);


--
-- TOC entry 3155 (class 2604 OID 25606)
-- Name: Notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notes" ALTER COLUMN id SET DEFAULT nextval('public."Notes_id_seq"'::regclass);


--
-- TOC entry 3153 (class 2604 OID 25646)
-- Name: Roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);


--
-- TOC entry 3154 (class 2604 OID 25647)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 3304 (class 0 OID 25511)
-- Dependencies: 212
-- Data for Name: Assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Assessments" (id, "assessmentType", "assessmentName", "perWeight", active, total, "createdAt", "updatedAt", "CourseId") FROM stdin;
2	Class Test	Ct3	10	t	50	2020-11-24 11:50:37.668+02	2020-11-24 11:50:37.668+02	3
3	Class Test	Ct1	10	t	50	2020-11-24 11:50:37.668+02	2020-11-24 11:50:37.668+02	3
1	Class Test	Ct2	10	t	30	2020-11-24 11:50:37.668+02	2020-11-24 11:50:37.668+02	3
\.


--
-- TOC entry 3306 (class 0 OID 25519)
-- Dependencies: 214
-- Data for Name: Courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Courses" (id, year, active, "createdAt", "updatedAt", "ModuleId") FROM stdin;
2	2020	t	2020-11-14 16:12:34.666044+02	2020-11-14 16:12:34.666044+02	2
3	2020	t	2020-11-14 16:12:37.460384+02	2020-11-14 16:12:37.460384+02	3
4	2020	t	2020-11-14 16:12:39.980116+02	2020-11-14 16:12:39.980116+02	4
5	2021	f	2020-11-15 22:50:53.358+02	2020-11-15 22:50:53.358+02	1
1	2020	f	2020-11-14 16:12:31.598855+02	2020-11-15 22:51:16.688+02	1
6	2021	f	2020-11-16 16:06:15.77+02	2020-11-16 16:06:15.77+02	6
\.


--
-- TOC entry 3308 (class 0 OID 25524)
-- Dependencies: 216
-- Data for Name: Marks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Marks" (id, "studentNumber", "courseId", "assessmentId", mark, "totalMark", "perWeight", "createdAt", "updatedAt") FROM stdin;
1	u12345678	3	2	4	50	10	2020-11-24 11:50:38.149+02	2020-11-24 11:50:38.149+02
2	u16091486	3	2	12	50	10	2020-11-24 11:50:38.149+02	2020-11-24 11:50:38.149+02
3	u13245687	3	2	23	50	10	2020-11-24 11:50:38.149+02	2020-11-24 11:50:38.149+02
4	u4555648	3	2	45	50	10	2020-11-24 11:50:38.149+02	2020-11-24 11:50:38.149+02
5	u12345678	3	1	5	30	10	2020-11-24 11:50:38.207+02	2020-11-24 11:50:38.207+02
6	u12345678	3	3	50	50	10	2020-11-24 11:50:38.197+02	2020-11-24 11:50:38.197+02
7	u16091486	3	1	6	30	10	2020-11-24 11:50:38.207+02	2020-11-24 11:50:38.207+02
8	u13245687	3	1	25	30	10	2020-11-24 11:50:38.207+02	2020-11-24 11:50:38.207+02
9	u16091486	3	3	25	50	10	2020-11-24 11:50:38.197+02	2020-11-24 11:50:38.197+02
10	u13245687	3	3	30	50	10	2020-11-24 11:50:38.197+02	2020-11-24 11:50:38.197+02
11	u4555648	3	1	8	30	10	2020-11-24 11:50:38.207+02	2020-11-24 11:50:38.207+02
12	u4555648	3	3	10	50	10	2020-11-24 11:50:38.197+02	2020-11-24 11:50:38.197+02
\.


--
-- TOC entry 3310 (class 0 OID 25532)
-- Dependencies: 218
-- Data for Name: Modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Modules" (id, "moduleCode", "moduleName", active, "createdAt", "updatedAt") FROM stdin;
1	COS301	Software Engineering	t	2020-11-14 16:10:50.579021+02	2020-11-14 16:10:50.579021+02
3	COS326	Advanced Databases	t	2020-11-14 16:11:24.509283+02	2020-11-14 16:11:24.509283+02
4	COS330	Computer security	t	2020-11-14 16:11:48.260746+02	2020-11-14 16:11:48.260746+02
5	COS110	Imperative Programming HI	t	2020-11-15 22:48:35.017+02	2020-11-15 22:48:58.452+02
6	COS122	Operating Systems	t	2020-11-16 16:05:09.566+02	2020-11-16 16:05:09.566+02
2	COS332	Computer networks YAY	t	2020-11-14 16:11:06.662531+02	2020-11-16 16:05:39.359+02
\.


--
-- TOC entry 3318 (class 0 OID 25603)
-- Dependencies: 226
-- Data for Name: Notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notes" (id, course, educator, "noteDescription", "createdAt", "updatedAt", "UserId") FROM stdin;
\.


--
-- TOC entry 3312 (class 0 OID 25540)
-- Dependencies: 220
-- Data for Name: Role_Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role_Course" ("createdAt", "updatedAt", "RoleId", "CourseId") FROM stdin;
2020-11-14 16:13:42.562582+02	2020-11-14 16:13:42.562582+02	2	1
2020-11-14 16:13:47.230177+02	2020-11-14 16:13:47.230177+02	2	2
2020-11-14 16:13:54.897044+02	2020-11-14 16:13:54.897044+02	3	3
2020-11-14 16:13:57.59706+02	2020-11-14 16:13:57.59706+02	3	4
2020-11-15 22:39:30.726+02	2020-11-15 22:39:30.726+02	4	3
2020-11-15 22:43:42.8+02	2020-11-15 22:43:42.8+02	5	3
2020-11-15 22:43:42.824+02	2020-11-15 22:43:42.824+02	6	4
2020-11-16 16:31:47.472+02	2020-11-16 16:31:47.472+02	7	6
2020-11-24 11:54:02.659+02	2020-11-24 11:54:02.659+02	9	3
2020-11-24 11:54:02.746+02	2020-11-24 11:54:02.746+02	10	3
2020-11-24 11:54:02.798+02	2020-11-24 11:54:02.798+02	12	3
2020-11-24 11:54:02.808+02	2020-11-24 11:54:02.808+02	8	3
2020-11-24 11:54:02.879+02	2020-11-24 11:54:02.879+02	13	3
2020-11-24 11:54:02.801+02	2020-11-24 11:54:02.801+02	11	3
2020-11-24 11:54:02.898+02	2020-11-24 11:54:02.898+02	15	3
2020-11-24 11:54:02.909+02	2020-11-24 11:54:02.909+02	14	3
\.


--
-- TOC entry 3313 (class 0 OID 25543)
-- Dependencies: 221
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Roles" (id, "roleType", active, "createdAt", "updatedAt", "UserId") FROM stdin;
4	Educator	t	2020-11-15 22:39:30.635+02	2020-11-15 22:39:30.635+02	2
1	Admin	f	2020-11-14 16:09:48.289169+02	2020-11-15 22:47:50.116+02	1
2	Student	f	2020-11-14 16:09:54.887269+02	2020-11-15 22:47:50.116+02	1
3	Educator	t	2020-11-14 16:10:00.23939+02	2020-11-15 22:47:50.143+02	1
6	Educator	f	2020-11-15 22:43:42.811+02	2020-11-16 16:07:48.358+02	3
5	Educator	t	2020-11-15 22:43:42.783+02	2020-11-16 16:07:48.401+02	3
7	Educator	t	2020-11-16 16:31:47.412+02	2020-11-16 16:31:47.412+02	4
8	Student	f	2020-11-24 11:54:01.968+02	2020-11-24 11:54:01.968+02	5
10	Student	f	2020-11-24 11:54:02.223+02	2020-11-24 11:54:02.223+02	6
9	Student	f	2020-11-24 11:54:02.151+02	2020-11-24 11:54:02.151+02	5
11	Student	f	2020-11-24 11:54:02.282+02	2020-11-24 11:54:02.282+02	7
12	Student	f	2020-11-24 11:54:02.296+02	2020-11-24 11:54:02.296+02	10
13	Student	f	2020-11-24 11:54:02.335+02	2020-11-24 11:54:02.335+02	8
15	Student	f	2020-11-24 11:54:02.344+02	2020-11-24 11:54:02.344+02	9
14	Student	f	2020-11-24 11:54:02.402+02	2020-11-24 11:54:02.402+02	11
\.


--
-- TOC entry 3315 (class 0 OID 25548)
-- Dependencies: 223
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "firstName", "lastName", active, "upNumber", email, "lastLogin", "createdAt", "updatedAt") FROM stdin;
3	John	Doe	t	19837632	19837632@tuks.co.za	\N	2020-11-15 22:43:42.739+02	2020-11-15 22:46:24.03+02
2	John	Doe	t	19837632	19837632@tuks.co.za	\N	2020-11-15 22:39:30.567+02	2020-11-16 16:07:48.342+02
4	Tim	Tam	f	15241343	123@tuk	\N	2020-11-16 16:31:47.268+02	2020-11-16 16:31:47.268+02
1	tuks	exp1	t	u12345678	tuksexp1@gmail.com	2020-11-28 15:07:27.508411+02	2020-11-14 16:08:54.048656+02	2020-11-28 15:07:27.486+02
5	Abubakar	Darki	f	u16091486	u16091486@tuks.co.za	\N	2020-11-24 11:53:55.864+02	2020-11-24 11:53:55.864+02
6	Katlego	Sekgethela	f	u16329784	katlegosekgethela@gmail.com	\N	2020-11-24 11:54:01.749+02	2020-11-24 11:54:01.749+02
7	Johnny	Doey	f	u45556485	jo.do@tuks.co.za	\N	2020-11-24 11:54:01.849+02	2020-11-24 11:54:01.849+02
8	Johnny	Doey	f	u45556485	jo.do@tuks.co.za	\N	2020-11-24 11:53:56.025+02	2020-11-24 11:53:56.025+02
10	John	Doe	f	u13245687	john.doe@tuks.co.za	\N	2020-11-24 11:53:55.38+02	2020-11-24 11:53:55.38+02
9	John	Doe	f	u13245687	john.doe@tuks.co.za	\N	2020-11-24 11:53:56.065+02	2020-11-24 11:53:56.065+02
11	Katlego	Sekgethela	f	u16329784	katlegosekgethela@gmail.com	\N	2020-11-24 11:53:55.982+02	2020-11-24 11:53:55.982+02
\.


--
-- TOC entry 3331 (class 0 OID 0)
-- Dependencies: 213
-- Name: Assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Assessments_id_seq"', 1, false);


--
-- TOC entry 3332 (class 0 OID 0)
-- Dependencies: 215
-- Name: Courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Courses_id_seq"', 4, true);


--
-- TOC entry 3333 (class 0 OID 0)
-- Dependencies: 217
-- Name: Marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Marks_id_seq"', 1, false);


--
-- TOC entry 3334 (class 0 OID 0)
-- Dependencies: 219
-- Name: Modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Modules_id_seq"', 4, true);


--
-- TOC entry 3335 (class 0 OID 0)
-- Dependencies: 225
-- Name: Notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notes_id_seq"', 1, false);


--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 222
-- Name: Roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Roles_id_seq"', 3, true);


--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 224
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, true);


--
-- TOC entry 3157 (class 2606 OID 25563)
-- Name: Assessments Assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assessments"
    ADD CONSTRAINT "Assessments_pkey" PRIMARY KEY (id);


--
-- TOC entry 3159 (class 2606 OID 25565)
-- Name: Courses Courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY (id);


--
-- TOC entry 3161 (class 2606 OID 25567)
-- Name: Marks Marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Marks"
    ADD CONSTRAINT "Marks_pkey" PRIMARY KEY (id);


--
-- TOC entry 3163 (class 2606 OID 25569)
-- Name: Modules Modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Modules"
    ADD CONSTRAINT "Modules_pkey" PRIMARY KEY (id);


--
-- TOC entry 3171 (class 2606 OID 25611)
-- Name: Notes Notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "Notes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3165 (class 2606 OID 25571)
-- Name: Role_Course Role_Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role_Course"
    ADD CONSTRAINT "Role_Course_pkey" PRIMARY KEY ("RoleId", "CourseId");


--
-- TOC entry 3167 (class 2606 OID 25573)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3169 (class 2606 OID 25575)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3172 (class 2606 OID 25576)
-- Name: Assessments Assessments_CourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assessments"
    ADD CONSTRAINT "Assessments_CourseId_fkey" FOREIGN KEY ("CourseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3173 (class 2606 OID 25581)
-- Name: Courses Courses_ModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Courses"
    ADD CONSTRAINT "Courses_ModuleId_fkey" FOREIGN KEY ("ModuleId") REFERENCES public."Modules"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3177 (class 2606 OID 25612)
-- Name: Notes Notes_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notes"
    ADD CONSTRAINT "Notes_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3174 (class 2606 OID 25586)
-- Name: Role_Course Role_Course_CourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role_Course"
    ADD CONSTRAINT "Role_Course_CourseId_fkey" FOREIGN KEY ("CourseId") REFERENCES public."Courses"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3175 (class 2606 OID 25591)
-- Name: Role_Course Role_Course_RoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role_Course"
    ADD CONSTRAINT "Role_Course_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3176 (class 2606 OID 25596)
-- Name: Roles Roles_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2020-11-28 17:14:24 SAST

--
-- PostgreSQL database dump complete
--

