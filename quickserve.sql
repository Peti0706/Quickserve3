-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 06. 20:56
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `quickserve`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eladók`
--

CREATE TABLE `eladók` (
  `Elado_ID` int(11) NOT NULL,
  `Nev` varchar(30) DEFAULT NULL,
  `Telefonszam` varchar(11) DEFAULT NULL,
  `Nyitvatartas` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Jelszo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `eladók`
--

INSERT INTO `eladók` (`Elado_ID`, `Nev`, `Telefonszam`, `Nyitvatartas`, `Email`, `Jelszo`) VALUES
(1, 'Teszt János', '06309869370', 'Hétfő - Péntek;07:30 - 13:00', 'elado@tesztelek.hu', '$2a$10$g6TcGiQahXo9ZcTkAXa34eLj/HyPV.VNx3Kt9.iyVQRpIk3UwGcZq');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kedvencek`
--

CREATE TABLE `kedvencek` (
  `id` int(11) NOT NULL,
  `Vasarlo_ID` int(36) NOT NULL,
  `Cikkszam` int(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `kedvencek`
--

INSERT INTO `kedvencek` (`id`, `Vasarlo_ID`, `Cikkszam`) VALUES
(45, 5, 106),
(46, 5, 107),
(47, 5, 115),
(48, 5, 205);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kuponok`
--

CREATE TABLE `kuponok` (
  `ID` int(11) NOT NULL,
  `Kuponkod` varchar(255) DEFAULT NULL,
  `Arengedmeny` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `kuponok`
--

INSERT INTO `kuponok` (`ID`, `Kuponkod`, `Arengedmeny`) VALUES
(0, 'NINCS KUPONKÓD', 0),
(1, 'KUPON10', 10),
(15, 'TAVASZ2025', 15);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `megrendelések`
--

CREATE TABLE `megrendelések` (
  `ID` int(11) NOT NULL,
  `Megrendeles_ID` bigint(11) DEFAULT NULL,
  `Vasarlo_ID` int(11) DEFAULT NULL,
  `Cikkszam` int(11) DEFAULT NULL,
  `Datum` datetime NOT NULL,
  `Mennyiseg` int(11) DEFAULT NULL,
  `Szunet` int(11) DEFAULT NULL,
  `Fizetesi_mod` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `Kedvezmenyes_osszeg` int(11) NOT NULL,
  `Kedvezmeny` int(11) NOT NULL,
  `Kuponkod` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `megrendelések`
--

INSERT INTO `megrendelések` (`ID`, `Megrendeles_ID`, `Vasarlo_ID`, `Cikkszam`, `Datum`, `Mennyiseg`, `Szunet`, `Fizetesi_mod`, `Kedvezmenyes_osszeg`, `Kedvezmeny`, `Kuponkod`) VALUES
(76, 20250301015, 6, 102, '2025-03-01 18:30:00', 1, 1, 'Készpénz', 700, 0, '0'),
(77, 20250301015, 6, 101, '2025-03-01 18:30:00', 1, 1, 'Készpénz', 700, 0, '0'),
(78, 20250301990, 6, 101, '2025-03-01 18:30:00', 1, 4, 'Készpénz', 630, 10, '1'),
(79, 20250301990, 6, 102, '2025-03-01 18:30:00', 1, 4, 'Készpénz', 630, 10, '1'),
(80, 20250301609, 5, 105, '2025-03-01 21:55:00', 5, 1, 'Készpénz', 3159, 10, '1'),
(81, 20250301609, 5, 111, '2025-03-01 21:55:00', 1, 1, 'Készpénz', 3159, 10, '1'),
(82, 20250301609, 5, 205, '2025-03-01 21:55:00', 1, 1, 'Készpénz', 3159, 10, '1'),
(83, 20250301609, 5, 219, '2025-03-01 21:55:00', 2, 1, 'Készpénz', 3159, 10, '1'),
(84, 20250301609, 5, 102, '2025-03-01 21:55:00', 1, 1, 'Készpénz', 3159, 10, '1'),
(85, 20250301160, 5, 102, '2025-03-01 22:11:00', 1, 1, 'Készpénz', 700, 0, '0'),
(86, 20250301160, 5, 105, '2025-03-01 22:11:00', 1, 1, 'Készpénz', 700, 0, '0'),
(87, 20250301800, 5, 105, '2025-03-01 22:12:00', 1, 1, 'Készpénz', 1050, 0, '0'),
(88, 20250301800, 5, 111, '2025-03-01 22:12:00', 1, 1, 'Készpénz', 1050, 0, '0'),
(89, 20250301800, 5, 101, '2025-03-01 22:12:00', 1, 1, 'Készpénz', 1050, 0, '0'),
(90, 20250301003, 5, 105, '2025-03-01 22:20:00', 1, 2, 'Készpénz', 700, 0, '0'),
(91, 20250301003, 5, 111, '2025-03-01 22:20:00', 1, 2, 'Készpénz', 700, 0, '0'),
(92, 20250301734, 5, 111, '2025-03-01 22:25:00', 1, 2, 'Készpénz', 750, 0, '0'),
(93, 20250301734, 5, 110, '2025-03-01 22:25:00', 1, 2, 'Készpénz', 750, 0, '0'),
(94, 20250301176, 5, 105, '2025-03-01 22:38:00', 1, 1, 'Készpénz', 350, 0, '0'),
(95, 20250301463, 5, 105, '2025-03-01 22:45:00', 1, 2, 'Készpénz', 350, 0, '0'),
(96, 20250301851, 5, 105, '2025-03-01 22:53:00', 1, 1, 'Készpénz', 350, 0, '0'),
(97, 20250301797, 5, 105, '2025-03-01 23:00:00', 1, 2, 'Bankkártya', 700, 0, '0'),
(98, 20250301797, 5, 111, '2025-03-01 23:00:00', 1, 2, 'Bankkártya', 700, 0, '0'),
(99, 20250301016, 5, 107, '2025-03-01 23:09:00', 1, 4, 'Készpénz', 850, 0, '0'),
(100, 20250301016, 5, 108, '2025-03-01 23:09:00', 1, 4, 'Készpénz', 850, 0, '0'),
(101, 20250301016, 5, 115, '2025-03-01 23:09:00', 1, 4, 'Készpénz', 850, 0, '0'),
(102, 20250301346, 5, 114, '2025-03-01 23:12:00', 1, 4, 'Készpénz', 1250, 0, '0'),
(103, 20250301346, 5, 115, '2025-03-01 23:12:00', 1, 4, 'Készpénz', 1250, 0, '0'),
(104, 20250301346, 5, 116, '2025-03-01 23:12:00', 1, 4, 'Készpénz', 1250, 0, '0'),
(105, 20250301346, 5, 118, '2025-03-01 23:12:00', 1, 4, 'Készpénz', 1250, 0, '0'),
(106, 20250301346, 5, 119, '2025-03-01 23:12:00', 1, 4, 'Készpénz', 1250, 0, '0'),
(107, 20250301471, 7, 106, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(108, 20250301471, 7, 107, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(109, 20250301471, 7, 108, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(110, 20250301471, 7, 109, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(111, 20250301471, 7, 110, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(112, 20250301471, 7, 111, '2025-03-01 23:21:00', 1, 1, 'Készpénz', 2050, 0, '0'),
(118, 20250323116, 5, 110, '2025-03-23 12:00:00', 1, 1, 'Készpénz', 935, 15, ''),
(119, 20250323116, 5, 111, '2025-03-23 12:00:00', 2, 1, 'Készpénz', 935, 15, ''),
(120, 20250323842, 5, 110, '2025-03-23 12:07:00', 1, 1, 'Készpénz', 340, 15, 'TAVASZ2025'),
(121, 20250323780, 5, 110, '2025-03-23 12:49:00', 1, 4, 'Készpénz', 675, 10, 'KUPON10'),
(122, 20250323780, 5, 111, '2025-03-23 12:49:00', 1, 4, 'Készpénz', 675, 10, 'KUPON10'),
(123, 20250323024, 5, 209, '2025-03-23 13:34:00', 1, 3, 'Bankkártya', 1233, 15, 'TAVASZ2025'),
(124, 20250323024, 5, 216, '2025-03-23 13:34:00', 3, 3, 'Bankkártya', 1233, 15, 'TAVASZ2025'),
(125, 20250323531, 5, 200, '2025-03-23 16:00:00', 1, 2, 'Készpénz', 1600, 0, ''),
(126, 20250323531, 5, 212, '2025-03-23 16:00:00', 1, 2, 'Készpénz', 1600, 0, ''),
(127, 20250323531, 5, 111, '2025-03-23 16:00:00', 1, 2, 'Készpénz', 1600, 0, '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelés_állapot`
--

CREATE TABLE `rendelés_állapot` (
  `Megrendeles_ID` bigint(11) NOT NULL,
  `Statusz` varchar(255) DEFAULT NULL,
  `Modositas_datuma` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendelés_állapot`
--

INSERT INTO `rendelés_állapot` (`Megrendeles_ID`, `Statusz`, `Modositas_datuma`) VALUES
(20250227046, 'Rendelés elküldve', '2025-02-27 21:18:51'),
(20250227285, 'Rendelés elküldve', '2025-02-27 21:21:45'),
(20250227309, 'Rendelés elküldve', '2025-02-27 21:29:31'),
(20250227683, 'Rendelés elküldve', '2025-02-27 21:39:46'),
(20250301003, 'Rendelés elküldve', '2025-03-01 21:20:12'),
(20250301015, 'Rendelés elküldve', '2025-03-01 17:30:08'),
(20250301016, 'Elfogadva', '2025-03-02 18:20:25'),
(20250301140, 'Rendelés elküldve', '2025-03-01 16:07:49'),
(20250301150, 'Rendelés elküldve', '2025-03-01 16:42:13'),
(20250301160, 'Rendelés elküldve', '2025-03-01 21:11:09'),
(20250301176, 'Rendelés elküldve', '2025-03-01 21:38:54'),
(20250301202, 'Rendelés elküldve', '2025-03-01 16:55:51'),
(20250301346, 'Rendelés elküldve', '2025-03-01 22:12:04'),
(20250301463, 'Rendelés elküldve', '2025-03-01 21:45:54'),
(20250301471, 'Rendelés elküldve', '2025-03-01 22:21:04'),
(20250301609, 'Rendelés elküldve', '2025-03-01 20:55:57'),
(20250301731, 'Rendelés elküldve', '2025-03-01 15:51:17'),
(20250301734, 'Rendelés elküldve', '2025-03-01 21:25:28'),
(20250301797, 'Rendelés elküldve', '2025-03-01 22:00:13'),
(20250301800, 'Rendelés elküldve', '2025-03-01 21:12:18'),
(20250301826, 'Rendelés elküldve', '2025-03-01 16:56:29'),
(20250301851, 'Elfogadva', '2025-03-02 21:00:20'),
(20250301934, 'Rendelés elküldve', '2025-03-01 16:59:25'),
(20250301990, 'Rendelés elküldve', '2025-03-01 17:30:25'),
(20250309456, 'Rendelés elküldve', '2025-03-09 22:48:46'),
(20250309501, 'Elutasítva', '2025-03-23 10:34:47'),
(20250323024, 'Átvehető', '2025-03-23 14:58:31'),
(20250323036, 'Rendelés elküldve', '2025-03-23 10:41:06'),
(20250323116, 'Rendelés elküldve', '2025-03-23 11:00:20'),
(20250323531, 'Rendelés elküldve', '2025-03-23 15:00:32'),
(20250323780, 'Elfogadva', '2025-03-23 11:52:02'),
(20250323842, 'Teljesítve', '2025-03-23 11:49:08');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termékek`
--

CREATE TABLE `termékek` (
  `Cikkszam` int(11) NOT NULL,
  `Termeknev` varchar(255) DEFAULT NULL,
  `Tipus` varchar(255) DEFAULT NULL,
  `Egysegar` int(11) DEFAULT NULL,
  `Kategoria` varchar(255) DEFAULT NULL,
  `Kepurl` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `termékek`
--

INSERT INTO `termékek` (`Cikkszam`, `Termeknev`, `Tipus`, `Egysegar`, `Kategoria`, `Kepurl`) VALUES
(101, 'Topjoy', 'kaktusz', 350, 'Üditők', 'https://i.imgur.com/lBdllLH.png'),
(102, 'Topjoy', 'mangó', 350, 'Üditők', 'https://i.imgur.com/YcDYj1E.png'),
(103, 'Mizse ásványvíz', 'szénsavmentes', 150, 'Üditők', 'https://i.imgur.com/vFRKCDf.png'),
(104, 'Mizse ásványvíz', 'szénsavas', 150, 'Üditők', 'https://i.imgur.com/No1UKXN.png'),
(105, 'Topjoy', 'görögdinnye', 350, 'Üditők', 'https://i.imgur.com/4H7AaNU.png'),
(106, 'Szentkirályi ásványvíz', 'szénsavmentes', 250, 'Üditők', 'https://i.imgur.com/U9Ya2r5.png'),
(107, 'Szentkirályi ásványvíz', 'szénsavas', 250, 'Üditők', 'https://i.imgur.com/f0ah4Ty.png'),
(108, 'Cappy', 'multivitamin', 400, 'Üditők', 'https://i.imgur.com/rxvqKmz.png'),
(109, 'Cappy', 'alma-körte', 400, 'Üditők', 'https://i.imgur.com/fp5zjdB.png'),
(110, 'Cappy', 'eper-kiwi', 400, 'Üditők', 'https://i.imgur.com/Nl3UePb.png'),
(111, 'Topjoy', 'barack', 350, 'Üditők', 'https://i.imgur.com/mhgOnCv.png'),
(112, 'Topjoy', 'körte', 350, 'Üditők', 'https://i.imgur.com/3Bykfuz.png'),
(113, 'Xixo ice tea', 'barack', 200, 'Üditők', 'https://i.imgur.com/PHUF60R.png'),
(114, 'Xixo ice tea', 'görögdinnye', 200, 'Üditők', 'https://i.imgur.com/wA4oIvT.png'),
(115, 'Xixo ice tea', 'eper', 200, 'Üditők', 'https://i.imgur.com/mRFzxwH.png'),
(116, 'Fuze tea', 'citrom', 450, 'Üditők', 'https://i.imgur.com/5Z1NKUo.png'),
(117, 'Fuze tea', 'barack', 450, 'Üditők', 'https://i.imgur.com/PapN63I.png'),
(118, 'Natur aqua ásványvíz', 'szénvasas', 200, 'Üditők', 'https://i.imgur.com/Q22VpuE.png'),
(119, 'Natur aqua ásványvíz', 'szénsavmentes', 200, 'Üditők', 'https://i.imgur.com/6DiJuYW.png'),
(200, 'Szendvics', 'gyrosos', 700, 'Szendvicsek', 'https://i.imgur.com/pZbWrq9.png'),
(201, 'Szendvics', '', 700, 'Szendvicsek', 'https://i.imgur.com/pZbWrq9.png'),
(202, 'Pizza szelet', 'sonkás-kukoricás', 600, 'Szendvicsek', 'https://i.imgur.com/pIwrtio.png'),
(203, 'Szendvics', 'tarjás', 650, 'Szendvicsek', 'https://i.imgur.com/fVJASZn.png'),
(204, 'Szendvics', 'torpedo', 600, 'Szendvicsek', 'https://i.imgur.com/icxkKxG.png'),
(205, 'Pizza szelet', 'baconson', 600, 'Szendvicsek', 'https://i.imgur.com/ITMR8ut.png'),
(206, 'Szendvics - borsos', 'tarjás', 700, 'Szendvicsek', 'https://i.imgur.com/RZeX0jg.png'),
(207, 'Szendvics - borsos', 'torpedo', 600, 'Szendvicsek', 'https://i.imgur.com/icxkKxG.png'),
(208, 'Hotdog', '-', 500, 'Szendvicsek', 'https://i.imgur.com/3IdH34D.png'),
(209, 'Szendvics - borsos', 'rántotthúsos', 700, 'Szendvicsek', 'https://i.imgur.com/5HJkIpH.png'),
(210, 'Szendvics - borsos', 'gyrosos', 700, 'Szendvicsek', 'https://i.imgur.com/pZbWrq9.png'),
(211, 'Milka', 'fehércsokis', 550, 'Édességek', 'https://i.imgur.com/Qgf1Ww5.png'),
(212, 'Milka', 'mogyorós', 550, 'Édességek', 'https://i.imgur.com/qYSw3Ev.png'),
(213, 'Mars', 'classic', 340, 'Édességek', 'https://i.imgur.com/tOMrc0G.png'),
(214, 'Bounty', 'classic', 330, 'Édességek', 'https://i.imgur.com/6PRFF9e.png'),
(215, 'Knoppers', 'classic', 250, 'Édességek', 'https://i.imgur.com/Hgafkmi.png'),
(216, '3Bit', 'classic', 250, 'Édességek', 'https://i.imgur.com/QS5USA8.png'),
(217, 'Milka', 'classic', 500, 'Édességek', 'https://i.imgur.com/i4PoUl8.png'),
(218, 'kinder bueno', 'classic', 340, 'Édességek', 'https://i.imgur.com/VzgYNx4.png'),
(219, 'kinder cards', 'classic', 230, 'Édességek', 'https://i.imgur.com/tCDfTUj.png'),
(220, 'KitKat', 'classic', 300, 'Édességek', 'https://i.imgur.com/gPSE4nq.png'),
(221, 'Balaton bumm', 'classic', 260, 'Édességek', 'https://i.imgur.com/5XzYi9P.png'),
(222, 'Balaton bumm', 'fehércsokis', 260, 'Édességek', 'https://i.imgur.com/CDp1goW.png'),
(223, 'Twix', 'classic', 300, 'Édességek', 'https://i.imgur.com/42vVYjl.png'),
(224, 'Twix', 'salted caramel', 300, 'Édességek', 'https://i.imgur.com/eQhQaSK.png'),
(225, 'Twix', 'fehércsokis', 300, 'Édességek', 'https://i.imgur.com/ew39nzK.png'),
(226, 'Snickers', 'classic', 320, 'Édességek', 'https://i.imgur.com/CNTHwcd.png'),
(227, 'Snickers', 'pecan', 320, 'Édességek', 'https://i.imgur.com/YYRJQuR.png'),
(228, 'Tibi csokoládé', 'classic', 450, 'Édességek', 'https://i.imgur.com/O5hnjI4.png'),
(229, 'Tibi csokoládé', 'étcsokoládés', 450, 'Édességek', 'https://i.imgur.com/uIMClGd.png'),
(230, 'Haribo', 'goldenbaren', 300, 'Édességek', 'https://i.imgur.com/FDAsk0v.png'),
(231, 'Haribo', 'pico-balla', 320, 'Édességek', 'https://i.imgur.com/cBvD1lV.png'),
(232, 'Haribo', 'spaghetti epres', 320, 'Édességek', 'https://i.imgur.com/95GO49t.png'),
(233, 'Haribo', 'quaxi', 300, 'Édességek', 'https://i.imgur.com/J6yIEb6.png'),
(234, 'Skittles', '-', 350, 'Édességek', 'https://i.imgur.com/XuhFepr.png'),
(235, 'Smarties', 'tejcsokoládé', 270, 'Édességek', 'https://i.imgur.com/WplpXZb.png'),
(236, 'Maltesers', 'tejcsokoládé', 400, 'Édességek', 'https://i.imgur.com/TSqERMi.png'),
(237, 'Skittles', 'fruits', 350, 'Édességek', 'https://i.imgur.com/XuhFepr.png'),
(238, 'kinder chocolate', 'tejcsokoládé', 250, 'Édességek', 'https://i.imgur.com/S4ts2t2.png'),
(239, 'Milka', 'waffelini', 170, 'Édességek', 'https://i.imgur.com/5AmQAQl.png'),
(240, 'Bonbonetti', 'dunakavics', 265, 'Édességek', 'https://i.imgur.com/qP6vrsz.png'),
(241, 'Croco ropi', 'sós', 100, 'Ropogós nasik', 'https://i.imgur.com/DFwkGec.png'),
(242, 'Croco ropi', 'csokoládés', 280, 'Ropogós nasik', 'https://i.imgur.com/IkgJYIw.png'),
(243, 'Croso kréker', '', 300, 'Ropogós nasik', 'https://i.imgur.com/7ujILSS.png'),
(244, 'Lays chips', 'hagymás-tejfölös', 300, 'Ropogós nasik', 'https://i.imgur.com/sLp2mcm.png'),
(245, 'Lays chips', 'sajtos', 360, 'Ropogós nasik', 'https://i.imgur.com/U0GA8Je.png'),
(246, 'Lays chips', 'paprikás', 350, 'Ropogós nasik', 'https://i.imgur.com/a5ifpSF.png'),
(247, 'Vipa chips', 'ketchup', 300, 'Ropogós nasik', 'https://i.imgur.com/W2jGvog.png'),
(248, 'Vipa chips', 'classic', 300, 'Ropogós nasik', 'https://i.imgur.com/1gJxtUu.png'),
(249, 'Vipa chips', 'pizza', 300, 'Ropogós nasik', 'https://i.imgur.com/w3jRQ9c.png'),
(250, 'Vipa chips', 'sajtos', 300, 'Ropogós nasik', 'https://i.imgur.com/tBA6knV.png'),
(251, 'Vipa chips', 'hagymás-tejfölös', 300, 'Ropogós nasik', 'https://i.imgur.com/s3RLWNj.png'),
(252, 'Vipa chips', 'paprikás', 300, 'Ropogós nasik', 'https://i.imgur.com/HWo9Bwz.png'),
(253, 'Fripsy chips', 'classic', 230, 'Ropogós nasik', 'https://i.imgur.com/xYSerlK.png'),
(254, 'Vipa chips', 'grill', 300, 'Ropogós nasik', 'https://i.imgur.com/nuOzHTQ.png'),
(255, 'Kávé', 'fekete', 300, 'Kávék', 'https://i.imgur.com/w58mG8h.png'),
(256, 'Kávé', 'cukorral', 350, 'Kávék', 'https://i.imgur.com/ubEnd8J.png'),
(257, 'Kávé', 'cukor és tejszínhabbal', 350, 'Kávék', 'https://i.imgur.com/BEtEQ2l.png'),
(258, 'Kávé', 'édesítővel', 350, 'Kávék', 'https://i.imgur.com/XScw8q7.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vásárlók`
--

CREATE TABLE `vásárlók` (
  `Vasarlo_ID` int(11) NOT NULL,
  `Nev` varchar(30) DEFAULT NULL,
  `Telefonszam` varchar(11) DEFAULT NULL,
  `Lakcim` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Jelszo` varchar(255) DEFAULT NULL,
  `Osztaly` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_hungarian_ci;

--
-- A tábla adatainak kiíratása `vásárlók`
--

INSERT INTO `vásárlók` (`Vasarlo_ID`, `Nev`, `Telefonszam`, `Lakcim`, `Email`, `Jelszo`, `Osztaly`) VALUES
(5, 'Molnár Péter', '06309869370', 'Fehérgyarmat Honvéd utca 4.', 'petermolnar0706@gmail.com', '$2a$10$VWs1FLj2/b6kEzQm6fLoaeJLW97S0e6hZrAxJSEz7s9f1DawYkGHK', 13),
(6, 'Simon István', '06309869370', '4900 Fehérgyarmat Honvéd utca 4.', 'peterideiglenes0706@gmail.com', '$2a$10$LEqTn2BqAiiPZy6.J9OUW.PtWsW8wZGl3AN.wuJnxmZtiVj7VTeA2', 12),
(7, 'Markulinec Viktória', '06153322972', 'valahol', 'viktoriamarkulinec89@gmail.com', '$2a$10$K2jws2B8DqHJP0ackQJUSeiLb3Blsiz2ILsWkn0JLiLpDcUBDsVay', 13);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `eladók`
--
ALTER TABLE `eladók`
  ADD PRIMARY KEY (`Elado_ID`);

--
-- A tábla indexei `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Vasarlo_ID` (`Vasarlo_ID`,`Cikkszam`);

--
-- A tábla indexei `kuponok`
--
ALTER TABLE `kuponok`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `megrendelések`
--
ALTER TABLE `megrendelések`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `rendelés_állapot`
--
ALTER TABLE `rendelés_állapot`
  ADD PRIMARY KEY (`Megrendeles_ID`);

--
-- A tábla indexei `termékek`
--
ALTER TABLE `termékek`
  ADD PRIMARY KEY (`Cikkszam`);

--
-- A tábla indexei `vásárlók`
--
ALTER TABLE `vásárlók`
  ADD PRIMARY KEY (`Vasarlo_ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `eladók`
--
ALTER TABLE `eladók`
  MODIFY `Elado_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT a táblához `kuponok`
--
ALTER TABLE `kuponok`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `megrendelések`
--
ALTER TABLE `megrendelések`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT a táblához `vásárlók`
--
ALTER TABLE `vásárlók`
  MODIFY `Vasarlo_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
