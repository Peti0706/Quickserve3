-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 10. 21:41
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
(1, 'Teszt Eladó', '06309869370', 'Hétfő - Péntek 07:30 - 13:00', 'teszt@bolt.com', '$2a$10$Psw2USRDHeNeHdowz2r4S.VxJllPJ8kIItgLhvu3Rd2PZMO9.yMha');

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
(1, 1, 212),
(3, 1, 235),
(2, 1, 255);

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
(2, 'MEGAHET', 15),
(3, 'KUPON10', 10);

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
(1, 20250410820, 1, 212, '2025-04-10 20:34:00', 1, 2, 'Készpénz', 1120, 0, ''),
(2, 20250410820, 1, 255, '2025-04-10 20:34:00', 1, 2, 'Készpénz', 1120, 0, ''),
(3, 20250410820, 1, 235, '2025-04-10 20:34:00', 1, 2, 'Készpénz', 1120, 0, ''),
(4, 20250410857, 1, 118, '2025-04-10 20:38:00', 3, 5, 'Bankkártya', 900, 10, 'TAVASZ2025'),
(5, 20250410857, 1, 119, '2025-04-10 20:38:00', 2, 5, 'Bankkártya', 900, 10, 'TAVASZ2025');

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
(20250410820, 'Rendelés elküldve', '2025-04-10 18:34:44'),
(20250410857, 'Átvehető', '2025-04-10 18:40:11');

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
(1, 'Teszt Vásárló', '06309869370', 'Fehérgyarmat', 'quickserveprojekt2025@gmail.com', '$2a$10$TEWtq5Fwze3gKCSFYCKbWuyk/W.yyIcv2NBwSNnCcV0HrbFFBa0L2', 13);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `kuponok`
--
ALTER TABLE `kuponok`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `megrendelések`
--
ALTER TABLE `megrendelések`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `vásárlók`
--
ALTER TABLE `vásárlók`
  MODIFY `Vasarlo_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
