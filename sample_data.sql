--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.courses VALUES ('3e96be77-a54e-44b0-a9ee-89619abdf8dc', 'JavaScript Basics', 'Learn the fundamentals of JavaScript.', 'JavaScript');
INSERT INTO public.courses VALUES ('9670f830-7f0c-4e13-84c0-2f43b0842c9f', 'HTML Essentials', 'Understand the structure of web pages with HTML.', 'HTML');


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.questions VALUES ('b1191fd3-833a-4d57-a56b-2101d8a5ac12', '3e96be77-a54e-44b0-a9ee-89619abdf8dc', 'MCQ', 'What keyword is used to declare a variable that cannot be reassigned?', '["let", "var", "const", "variable"]', 'const', 1, '2025-04-16 18:20:58.232151+00');
INSERT INTO public.questions VALUES ('5b2650e8-6f4c-44fe-80eb-8c0dbb9fd32f', '3e96be77-a54e-44b0-a9ee-89619abdf8dc', 'MCQ', 'Which operator is used for strict equality comparison (checks type and value)?', '["==", "=", "===", "!="]', '===', 1, '2025-04-16 18:20:58.232151+00');
INSERT INTO public.questions VALUES ('0f3d5dd3-1f10-4b25-9589-b014aab6a924', '3e96be77-a54e-44b0-a9ee-89619abdf8dc', 'FillBlank', 'To add an element to the end of an array, you use the `.____()` method.', NULL, 'push', 2, '2025-04-16 18:20:58.232151+00');
INSERT INTO public.questions VALUES ('e17778fa-018f-44f3-963e-ec24f1888cea', '9670f830-7f0c-4e13-84c0-2f43b0842c9f', 'MCQ', 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Management Language"]', 'Hyper Text Markup Language', 1, '2025-04-16 18:20:58.252248+00');
INSERT INTO public.questions VALUES ('df77f131-1c2d-46cd-86bd-7d4b88aa603a', '9670f830-7f0c-4e13-84c0-2f43b0842c9f', 'MCQ', 'Which tag is used to define the largest heading?', '["<h6>", "<heading>", "<h1>", "<head>"]', '<h1>', 1, '2025-04-16 18:20:58.252248+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('8a47790e-dbc7-4e26-9c47-4c694fc5d830', 'utku', 'utku@mail.com', '$2b$10$u2yh7bRP4SMVdDTYNpRwaOVIHqD9u4ydkeJUZflOVRgMTmXUDu7zm', '2025-04-16 13:40:56.246289+00', '2025-05-19 22:38:40.328033+00', 0, 'utku', 'utku');
INSERT INTO public.users VALUES ('9fe17d04-00fe-4064-8228-07ef2028d315', 'Deneme1', 'deneme@mail.com', '$2b$10$ymMTkhcFiqXu12LSxKP9DuSRtAMIw2QRtzVF3.CffMQsANqngRGbG', '2025-04-15 21:43:35.272795+00', '2025-05-19 22:38:40.328033+00', 0, 'deneme1', 'deneme');
INSERT INTO public.users VALUES ('af6c3d70-6089-4814-9b5c-4701fd7da88f', 'deneme2', 'deneme2@mail.com', '$2b$10$OtsdkoBcM4ItCkXmIcgufubU1jLBauSwVdDDDULqmsw8WI/YTw07a', '2025-04-17 11:22:38.983641+00', '2025-05-19 22:38:40.328033+00', 0, 'deneme2', 'deneme');
INSERT INTO public.users VALUES ('f78ff102-2382-4c5f-8317-55db1b08b4dd', 'admin', 'admin@mail.com', '$2b$10$G.KvYpeKpUQcGwmndRYJ8Obbjs0BCTrsB1tzEC6Whm5VAcX7UtlCu', '2025-05-18 23:37:08.845461+00', '2025-05-19 22:38:40.328033+00', 0, 'admin', 'admin');


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

