require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db= require("./database")
const app = express();
app.use(express.json());
app.use(cors());


// Regisztráció
app.post("/register", async (req, res) => {
  const { Nev, Telefonszam, Lakcim, Email, Jelszo, Osztaly } = req.body;
  try {
  
    const checkSql = "SELECT * FROM Vásárlók WHERE Email = ?";
    db.query(checkSql, [Email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Hiba az ellenőrzésnél" });
      }

      
      if (results.length > 0) {
        return res.status(400).json({ error: "Ez az email cím már regisztrálva van!" });
      }

      
      const hashedPassword = await bcrypt.hash(Jelszo, 10);
      const insertSql = "INSERT INTO Vásárlók (Nev, Telefonszam, Lakcim, Email, Jelszo, Osztaly) VALUES (?, ?, ?, ?, ?, ?)";

      db.query(insertSql, [Nev, Telefonszam, Lakcim, Email, hashedPassword, Osztaly], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Hiba a regisztrációnál" });
        }
        res.json({ message: "Sikeres regisztráció!" });
      
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba" });
  }
});

// Bejelentkezés
app.post("/login", (req, res) => {
  const { Nev, Jelszo } = req.body;
  const sql = "SELECT * FROM vásárlók WHERE Nev = ?";

  db.query(sql, [Nev], async (err, results) => {
    console.log(Nev);
    if (err || results.length === 0) return res.status(400).json({ error: "Hibás név vagy jelszó" });
    const vasarlo = results[0];
  
    const isMatch = await bcrypt.compare(Jelszo, vasarlo.Jelszo);
    if (!isMatch) return res.status(400).json({ error: "Hibás név vagy jelszó" });

    const token = jwt.sign({ Vasarlo_ID: vasarlo.Vasarlo_ID, Nev: vasarlo.Nev ,Email:vasarlo.Email}, "secret", { expiresIn: "1h" });
    res.json({ token, vasarlo: { name: vasarlo.Nev } });
  });
});

//ELADÓI regisztráció
app.post("/elado/register", async (req, res) => {
  const { Nev, Telefonszam, Nyitvatartas,Email,Jelszo } = req.body;
  try {
  
    const checkSql = "SELECT * FROM Eladók WHERE Email = ?";
    db.query(checkSql, [Email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Hiba az ellenőrzésnél" });
      }

      
      if (results.length > 0) {
        return res.status(400).json({ error: "Ez az email cím már regisztrálva van!" });
      }

      
      const hashedPassword = await bcrypt.hash(Jelszo, 10);
      const sql = "INSERT INTO Eladók (Nev, Telefonszam, Nyitvatartas,Email,Jelszo) VALUES (?, ?, ?,?,?)";

      db.query(sql, [Nev, Telefonszam, Nyitvatartas,Email,hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Hiba a regisztrációnál" });
        }
        res.json({ message: "Sikeres regisztráció!" });
      
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba" });
  }
});


// ELADÓI bejelentkezés
app.post("/elado/login", (req, res) => {
  const { Nev, Jelszo } = req.body;
  const sql = "SELECT * FROM Eladók WHERE Nev = ?";

  db.query(sql, [Nev], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: "Hibás email vagy jelszó" });
    const elado = results[0];
    console.log(elado);
    const isMatch = await bcrypt.compare(Jelszo, elado.Jelszo);
    if (!isMatch) return res.status(400).json({ error: "Hibás email vagy jelszó" });

    const token = jwt.sign({ Elado_ID: elado.Elado_ID, Nev: elado.Nev }, "secret", { expiresIn: "1h" });
    res.json({ token, elado: { name: elado.Nev } });
  });
});









// Felhasználó nevének lekérdezése
app.get("/user", (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
    res.json(decoded.Nev);
  });
});

//Eladók oldal api végpontjai:
//ELadó adatainak lekérése 1.
app.get('/admin/accountinf', (req, res) => {
  
  const token=req.headers.authorization;
  const query = "SELECT eladók.nev,eladók.email,eladók.telefonszam,eladók.nyitvatartas FROM eladók WHERE Elado_ID=?";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
    db.query(query, [decoded.Elado_ID], (err, results) => {
      if (err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
      res.json(results);
    });
  });
});

//Rendelések lekérése eladoi oldalhoz

app.get("/orders",(req, res)=>{
  const token=req.headers.authorization;
  const query="SELECT megrendelések.Megrendeles_ID,megrendelések.Datum,megrendelések.Kedvezmenyes_Osszeg As Osszeg,vásárlók.Nev FROM megrendelések INNER JOIN termékek ON termékek.cikkszam=megrendelések.cikkszam INNER JOIN vásárlók ON vásárlók.Vasarlo_ID=megrendelések.Vasarlo_ID  GROUP BY megrendelések.Megrendeles_ID ORDER BY Datum Desc;";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
    console.log(results);
  });
});
});




//Egy adott megrendeléshez tartozó vásárlói adatok lekérdezése
app.get("/admin/orderdetails/userinf/:rendelesid", (req, res) => {
const {rendelesid}=req.params;
const token=req.headers.authorization;
const query="SELECT vásárlók.nev,vásárlók.email,vásárlók.telefonszam,vásárlók.Osztaly,megrendelések.Megrendeles_ID FROM vásárlók INNER JOIN megrendelések ON vásárlók.Vasarlo_ID = megrendelések.Vasarlo_ID WHERE megrendelések.Megrendeles_ID=? GROUP BY megrendelések.Megrendeles_ID;";
if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
jwt.verify(token, "secret", (err, decoded) => {
if (err) return res.status(403).json({ message: "Érvénytelen token" });
db.query(query, [rendelesid], (err, results) => {
    if (err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
  console.log(results);
});
});
});

//Adott megrendelésben lévő termékek lekérdezése
app.get('/admin/orderdetails/products/:rendelesid', (req, res) => {
  const {rendelesid} = req.params;
  const token=req.headers.authorization;
  const query = "SELECT termékek.termeknev,termékek.kategoria,termékek.tipus,termékek.egysegar,megrendelések.cikkszam,megrendelések.mennyiseg,SUM(termékek.egysegar*megrendelések.mennyiseg) As Osszeg,megrendelések.datum,termékek.kepurl FROM megrendelések INNER JOIN termékek ON megrendelések.cikkszam=termékek.cikkszam WHERE megrendelések.Megrendeles_ID=? GROUP By termékek.cikkszam;";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  
  db.query(query,[rendelesid],(err,results)=>{
    if (err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
    
  });
  });
});

app.get("/admin/teljesosszeg/:rendelesid",(req,res)=>{
  const {rendelesid} = req.params;
  const query="SELECT megrendelések.Megrendeles_ID,SUM(termékek.egysegar*megrendelések.mennyiseg) As Osszeg,megrendelések.Kedvezmenyes_osszeg,megrendelések.Kedvezmeny,megrendelések.Kuponkod,megrendelések.Szunet FROM megrendelések INNER JOIN termékek ON megrendelések.cikkszam=termékek.cikkszam WHERE megrendelések.Megrendeles_ID=?"
  const token=req.headers.authorization;
  
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) return res.status(403).json({ message: "Érvénytelen token" });
    db.query(query,[rendelesid],(err, results)=>{
      if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
      res.json(results);
      console.log(results);
    });
  });
  
  });


  const { sendStatuszChange } = require('./emailservice2');
//Rendelés Státuszának módosítása!
app.put("/admin/sendstatus/:rendelesid",(req, res)=>{
const {rendelesid} = req.params;
const token=req.headers.authorization;
const{Statusz,Megrendelo_email} = req.body;
const query="UPDATE rendelés_állapot SET Statusz=? Where rendelés_állapot.Megrendeles_ID=?;";
if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
jwt.verify(token, "secret", (err, decoded) => {
  if (err) return res.status(403).json({ message: "Érvénytelen token" });
db.query(query,[Statusz,rendelesid],(err,results)=>{
  if(err) throw err;
  sendStatuszChange(Statusz, Megrendelo_email,rendelesid, (emailErr) => {
    if (emailErr) {
      console.error('Hiba az email küldésekor:', emailErr);
      // Nem szakítjuk meg a választ, csak logoljuk a hibát
    }
    res.json({ message: "A rendelés állapotát sikeresen frissítettük!" });
  });
});
});
});

//Státuszlekérése

app.get("/admin/statusz/:rendelesid",(req, res)=>{
  const {rendelesid} = req.params;
  const token=req.headers.authorization;
  const query="SELECT Statusz,Modositas_datuma FROM rendelés_állapot WHERE Megrendeles_ID=?"
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[rendelesid],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
    console.log(results);
  });
});
});


//Kuponok lekérdezése

app.get("/admin/kuponok",(req,res)=>{
const query="SELECT * FROM kuponok";
const token=req.headers.authorization;
if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
jwt.verify(token, "secret", (err, decoded) => {
  if (err) return res.status(403).json({ message: "Érvénytelen token" });
db.query(query,(err,results)=>{
  if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
  res.json(results);
});
});
});

//Kupon hozzáadása
app.post("/admin/kuponok",(req, res)=>{
  const {Kuponkod,Arengedmeny} = req.body;
  const ellenorzo="SELECT * FROM kuponok WHERE Kuponkod = ?"
  const query="INSERT INTO kuponok (Kuponkod,Arengedmeny) VALUES (?,?)";
  const token=req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
    db.query(ellenorzo,[Kuponkod],(err, results)=>{

      if(results.length>0) return res.status(400).json({ error: "Ez a kuponkód már létezik!" });

      db.query(query,[Kuponkod,Arengedmeny],(err, results)=>{
        if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
        res.json({ message: "Sikeresen hozzáadott egy kuponot!" });
      });
  })
  
  });
});

//Kupon törlése
app.delete("/admin/kuponok/:kuponid",(req, res)=>{
  const {kuponid} = req.params;
  const query="DELETE FROM kuponok WHERE ID=?";
  const token=req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[kuponid],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json({ message: "Sikeresen törölted a kuponot!" });
  });
  });
});



//Vásárlói oldalhoz tartozó api-k

//Bejelentkezett felhasználó adatainak lekérdezése a Profilom oldalhoz
app.get("/userinfo",(req,res)=>{
  const token=req.headers.authorization;
  const query="SELECT vásárlók.nev,vásárlók.osztaly,vásárlók.email,vásárlók.telefonszam,vásárlók.lakcim From vásárlók WHERE vásárlók.Vasarlo_ID=?";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[decoded.Vasarlo_ID],(err,results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
  });
  });
});

//Bejelentkezett vásárló jelszavának módosítása
app.put("/userinfo/changepassword", async(req, res)=>{
  const token=req.headers.authorization;
  const {Jelszo} = req.body;
  const hashedPassword = await bcrypt.hash(Jelszo, 10);
  const query="UPDATE vásárlók SET Jelszo=? Where vásárlók.Vasarlo_ID=?;";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[hashedPassword,decoded.Vasarlo_ID],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json({ message: "A jelszót sikeresen frissítettük" });
  });
});
});

//Bejelentkezett vásárlóhoz tartozó rendelések
app.get("/userorders",(req, res)=>{
  const token=req.headers.authorization;
  const query="SELECT megrendelések.Megrendeles_ID,megrendelések.Datum,megrendelések.Kedvezmenyes_Osszeg As Osszeg FROM megrendelések INNER JOIN vásárlók ON vásárlók.Vasarlo_ID=megrendelések.Vasarlo_ID INNER JOIN termékek ON termékek.cikkszam=megrendelések.cikkszam WHERE vásárlók.Vasarlo_ID=? GROUP BY megrendelések.Megrendeles_ID ORDER BY megrendelések.Datum DESC";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[decoded.Vasarlo_ID],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
    console.log(results);
  });
});
});

//Bejelentkezett vásárló rendeléséhez tartozó részletes adatok
app.get("/userorders/details/:rendelesid",(req, res)=>{
  const {rendelesid} = req.params;
  const token=req.headers.authorization;
  const query="SELECT megrendelések.Megrendeles_ID,termékek.termeknev,termékek.kategoria,termékek.tipus,termékek.egysegar,megrendelések.cikkszam,megrendelések.mennyiseg,SUM(termékek.egysegar*megrendelések.mennyiseg) As Osszeg,megrendelések.datum,rendelés_állapot.Statusz,megrendelések.szunet,termékek.Kepurl,megrendelések.Kedvezmenyes_osszeg FROM megrendelések INNER JOIN termékek ON megrendelések.cikkszam=termékek.cikkszam INNER JOIN vásárlók ON vásárlók.Vasarlo_ID=megrendelések.Vasarlo_ID INNER JOIN rendelés_állapot On megrendelések.Megrendeles_ID=rendelés_állapot.Megrendeles_ID WHERE megrendelések.Megrendeles_ID=? and vásárlók.Vasarlo_ID=? GROUP BY Cikkszam;"
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[rendelesid,decoded.Vasarlo_ID],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
  });
});
});

//Teljes rendelés végosszeg
app.get("/teljesosszeg/:rendelesid",(req,res)=>{
const {rendelesid} = req.params;
const query="SELECT megrendelések.Megrendeles_ID,SUM(termékek.egysegar*megrendelések.mennyiseg) As Osszeg,megrendelések.Kedvezmenyes_osszeg,megrendelések.Kedvezmeny FROM megrendelések INNER JOIN termékek ON megrendelések.cikkszam=termékek.cikkszam INNER JOIN vásárlók ON vásárlók.Vasarlo_ID=megrendelések.Vasarlo_ID WHERE megrendelések.Megrendeles_ID=? and vásárlók.Vasarlo_ID=?;"
const token=req.headers.authorization;

if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
  db.query(query,[rendelesid,decoded.Vasarlo_ID],(err, results)=>{
    if(err) return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
    res.json(results);
  });
});

});

//Kedvencek lekérése
app.get('/api/kedvencek', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });

    const query = "SELECT Cikkszam FROM kedvencek WHERE Vasarlo_ID = ?";
    db.query(query, [decoded.Vasarlo_ID], (err, results) => {
      if (err) {
        console.error('Hiba:', err);
        return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
      }
      console.log('Results from DB:', results); // Debug
      const kedvencIds = results.map(row => row.Cikkszam); // Tömb számokkal
      res.json(kedvencIds);
    });
  });
});

// 2. Kedvenc hozzáadása
app.post('/api/kedvencek', (req, res) => {
  const token = req.headers.authorization;
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "Hiányzó productId" });
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });

    const query = "INSERT IGNORE INTO kedvencek (Vasarlo_ID, Cikkszam) VALUES (?, ?)";
    db.query(query, [decoded.Vasarlo_ID, productId], (err) => {
      if (err) {
        console.error('Hiba:', err);
        return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
      }
      res.status(201).json({ message: 'Kedvenc hozzáadva' });
    });
  });
});

// 3. Kedvenc eltávolítása
app.delete('/api/kedvencek/:productId', (req, res) => {
  const token = req.headers.authorization;
  const { productId } = req.params;
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });

    const query = "DELETE FROM kedvencek WHERE Vasarlo_ID = ? AND Cikkszam = ?";
    db.query(query, [decoded.Vasarlo_ID, productId], (err, result) => {
      if (err) {
        console.error('Hiba:', err);
        return res.status(500).json({ error: "Hiba az adatok lekérdezésekor" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Nem található ilyen kedvenc' });
      }
      res.status(204).send();
    });
  });
});

//Kuponkód ellenőrzés
app.post("/checkcoupon", (req, res) => {
  const { couponCode } = req.body; // A frontendről érkező kuponkód

  const sql = "SELECT Arengedmeny,Kuponkod FROM kuponok WHERE Kuponkod = ?";
  db.query(sql, [couponCode], (err, results) => {
    if (err) {
      console.error("SQL hiba a kupon ellenőrzésénél:", err);
      return res.status(500).json({ error: "Hiba a kupon ellenőrzésekor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Érvénytelen kuponkód" });
    }
 
    const discount = results[0].Arengedmeny;
    const discountcode = results[0].Kuponkod;
    
    res.json({ discount, discountcode}); // Visszaadjuk a kedvezményt
  });
});


const { sendOrderConfirmation } = require('./emailservice');
//Rendelés elküldése
app.post("/sendorder", (req, res) => {
  const {items, totalDiscountedPrice,Discount,Discountcode} = req.body;
  const token = req.headers.authorization;
  const sql1 = "INSERT INTO megrendelések(Megrendeles_ID, Vasarlo_ID, Cikkszam,Datum, Mennyiseg, Szunet,Fizetesi_mod,Kedvezmenyes_osszeg,Kedvezmeny,Kuponkod) VALUES ?";
  const sql2 = "INSERT INTO rendelés_állapot(Megrendeles_ID, Statusz) VALUES (?, 'Rendelés elküldve')";
  if (!token) return res.status(401).json({ message: "Nincs bejelentkezve" });
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Érvénytelen token" });
    const values = items.map(t => [t.Megrendeles_ID, decoded.Vasarlo_ID, t.Cikkszam,t.Datum, t.Mennyiseg, t.Szunet,t.Fizetesi_mod,totalDiscountedPrice,Discount,Discountcode]);
  db.query(sql1, [values], (err, results) => {
    if (err) {
      
      return res.status(500).json({ error: "Hiba a rendelés rögzítésekor" });
    }

  
    db.query(sql2, [items[0].Megrendeles_ID], (err2, results2) => {
      if (err2) {
        console.error("SQL hiba a rendelés állapot rögzítésekor:", err2); 
        return res.status(500).json({ error: "Hiba a rendelés állapot rögzítésekor" });
      }
    

      const orderDetails = {
        id: items[0].Megrendeles_ID,
        productName: items.map(item => `${item.Termeknev} (${item.Tipus})` || 'Ismeretlen termék').join(', '), // Ha nincs név, alapértelmezett szöveg
        quantity: items.reduce((total, item) => total + item.Mennyiseg, 0),
        totalPrice: totalDiscountedPrice,
        orderDate: items[0].Datum,
        statusz: 'Rendelés elküldve',
        fizetesimod: items[0].Fizetesi_mod,
        szunet: items[0].Szunet,
        felhasznalonev: decoded.Nev
      };

      sendOrderConfirmation(orderDetails, decoded.Email, (emailErr) => {
        if (emailErr) {
          
          // Nem szakítjuk meg a választ, csak logoljuk a hibát
        }
        res.json({ message: "A rendelést és az állapotot sikeresen rögzítettük, visszaigazolás elküldve!" });
      });
      
    });
  });
});
});


//Termékek betöltése a főoldalon

app.get("/products", (req, res) => {
  const query = "SELECT * FROM termékek";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Hiba a termékek lekérdezésekor" });
    res.json(results);
  });
});


module.exports = app;

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}









