# Fejlesztői dokumentáció

## Hardware

A hardware 2 mikrokontrollerből és 3 szenzorból áll.

### hardwarek

- esp8266
- arduino UNO

### szenzorok

- passive buzzer
- tilt switch module
- 8x8 led matrix

### Áramköri rajz

![áramköri rajz](https://github.com/bricsi0000000000000/joe/blob/master/images/%C3%A1ramk%C3%B6ri_rajz.png)

| esp8266 | Arduino UNO |
| --- | ----------- |
|  | passive buzzer |
| tilt switch module |  |
| 8x8 led matrix |  |

Az egész rendszert az esp8266 működteti. Erről kap áramot az Arduino is.

## Software

7 fájlból áll

### Arduino UNO

- buzzer.ino

### esp8266

- boot.py
- main.py

### website

**frontend**

- index.html
- style.css
- script.js

**backend**

- backend.php

---

## Arduino UNO

### buzzer.ino

Ez a fájl kezeli a passive buzzert.

A 7-es pin-en kommunikál kifele (`buzzer_pin`) és a 9-es pin-en befele (`buzzer_in`).

A `setup()` függvényben beállítom a 2 pin-t.

A `loop()` függvényben pedig amíg jel érkezik a `buzzer_in`-re, megszólaltatja a buzzert.

## esp8266

Ezen a hardware-en egy webszerver fut.

A kártya Wi-Fi-n keresztül kapcsolódik egy routerhez.

Ahhoz hogy el tudjuk érni a webszerveren futó weblapot, nekünk is ugyan arra a wifire kell kapcsolódnunk.

Ez után ha beírjuk a kártya IP címét a böngészőbe, látni fogjuk a rajta futó honlapot.

A kártya állomásként van beállítva, nem pedig hozzáférési pontként.

---

### boot.py

A boot.py fájl olyan információkat tartalmaz, amelyeket csak egyszer kell futtatni a rendszerindításkor.
Ez magában foglalja a könyvtárak, hálózati hitelesítő adatok, és tűbeállítások, valamint a hálózathoz való csatlakozási és egyéb konfigurációkat.

Beállítjuk annak a wifinek az ssid és jelszavát, amihez csatlakozni fogunk.

```
ssid = 'joe'
password = 'Abc123456'
```

Ezután a script kapcsolódik a wifihez. Ha sikeres volt a kapcsolat, kiírja hogy *Sikeres kapcsolat* és a kapcsolat adatait.

```
station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)
while station.isconnected() == False:
    pass
print('Sikeres kapcsolat')
print(station.ifconfig())
```

![kapcsolat adatai](https://github.com/bricsi0000000000000/joe/blob/master/images/boot_py.PNG)

---

### main.py

A main.py fájl tartalmazza azt a kódot, amely a webkiszolgálót futtatja a fájlok kiszolgálásához az ügyféltől kapott kérések alapján.

Ebben a fájlban először definiálom a pin-eket.

```
DIN = Pin(4, Pin.OUT) #D2 - szürke
CLK = Pin(2, Pin.OUT) #D4 - fekete
CS = Pin(0, Pin.OUT)  #D3 - fehér

MOZOG = Pin(14, Pin.IN) #D5
HANG = Pin(12, Pin.OUT) #D6
```

A D2, D3... az esp-n lévő pinek.
A MicroPython máshogy kezeli a pin-eket, ezért vannak odakommentelve hogy fizikálisan melyik pin melyik.
A szín ami a pin-ek mellé van írva az pedig annak a drótnak a színe ami oda van bekötve.

Utána a ledmátrixon megjelenő képek vannak definiálva.
Minden ilyen kép egy byte tömbben van eltárolva, amiben 8 darab hexadecimális szám található.
Minden ilyen szám az adott sornak az értéke.

```
mosoly = bytes([0x00, 0x40, 0x8c, 0x9e, 0x9e, 0x8c, 0x40, 0x00])
szomor = bytes([0x00, 0x80, 0x4c, 0x5e, 0x5e, 0x4c, 0x80, 0x00])
ehesseg = bytes([0x00, 0x40, 0x4c, 0x5e, 0x5e, 0x4c, 0x40, 0x00])
szomlyassag = bytes([0x00, 0x40, 0xe6, 0xaf, 0xaf, 0xe6, 0x40, 0x00])
death = bytes([0x00, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x00])
gonosz = bytes([0x00, 0x81, 0x9a, 0xbc, 0xbc, 0x9a, 0x81, 0x00])
```

Alatta van implementálva a ledmátrix vezérlője, amit a `writeByte(DATA)` és a `write(address, dat)` függvények valósítanak meg.
Az `init()` függvény pedig beállítja a ledmátrixot alaphelyzetbe.

Ahhoz hogy a korábban definiált képeket meg lehessen jeleníteni, végig kell menni mind a 8 soron és kirajzolni az adott sort.
Ezért minden képhez definiálva van egy függvény ami ezt megteszi.

```
def mosolyog():
     for i in range(1, 9):
        write(i, mosoly[i - 1])
```

A `web_page()` függvény egy html kódot ad vissza, ami maga a honlap.
Itt azért van egy sorban az egész kód, mert máshogy nem engedte az eszköz. Fájlból beolvasni se engedi.

A következő 3 sor felelős a kliens szerver kapcsolat kiépítéséért.

```
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80))
s.listen(5)
```

Végül, egy végtelen ciklus kezeli a honlap és az esp közötti adatok forgalmának lebonyolítását.

Az elején az alábbi 3 sor lekéri a honlaptól a kérést

```
conn, addr = s.accept()
#print('Kliens IP: %s' % str(addr))
request = conn.recv(1024)
request = str(request)
```

És a ciklus legvégén pedig elküli azt

```
response = web_page()
conn.send('HTTP/1.1 200 OK\n')
conn.send('Content-Type: text/html\n')
conn.send('Connection: close\n\n')
conn.sendall(response)
conn.close()
```

A ciklus közepében található a szenzorok kezelése és a honlapról átadott adatok feldolgozása.
A javascript kódban egy `XMLHttpRequest` segítségével küldi el a kedv, éhség, szomjúság, fáradtság és az alvás értékét.
```
var xhr = new XMLHttpRequest();
xhr.open("GET", act_vibe + ";" + act_hunger + ";" + act_thirst + ";" + act_tired + ";" + is_sleeping, true);
xhr.send();
```

Ezeket dolgozza fel az alábbi pár sor.

```
splitted_by_space = request.split(' ')
datas = splitted_by_space[1][1:].split(';')

act_vibe = datas[0]
act_hunger = datas[1]
act_thirst = datas[2]
act_tired = datas[3]
```

Utána látható ezeknek az adatoknak a kiértékelése, és a szenzorok működtetése.

A ledmátrixon megjelenő képek az űrlény kedvétől, éhségétől és szomlyúságától függően változik.
Ha a kedve lement 0-ra akkor meghalt.
```
if(int(act_vibe) <= 0):
    dead()
```
Ha eldöntik Joe-t, akkor a passive buzzer szólal meg. Ezt a tilt switch érzékeli.
Ilyenkor az Arduino-nak küld jelet az esp, és a buzzer megszólaltatása ott történik.

```
 if(MOZOG.value() == 1):
    merges()
    HANG.value(1)
else:
    HANG.value(0)
```

Ha ezek egyike se történik meg, akkor történik a honlapról érkező adatok kiértékelése.
Ha a jés az éhség is a `max_stat` felénél több, akkor megnézi hogy a kedv értéke több e mint a
`max_stat` 2/3-a. Ha igen akkor mosolyog. Ha az 1/3-a és a 2/3-a között van, akkor szomorú. Ha az 1/3-a alatt van
akkor mérges lesz.

```
if(int(act_thirst) >= 200 and int(act_hunger) >= 200):
    if(int(act_vibe) >= 266):
        mosolyog()
    elif (int(act_vibe) < 266 and int(act_vibe) >= 133):
        szomoru()
    else:
        merges()
```

Ha a jértéke a `max_stat` felénél kisebb és az éhség értéke a `max_stat` felénél több, akkor szomlyas.
Ha ez fordítva van akkor éhes.
Ha pedig mind a 2 a `max_stat` felénél kevesebb, akkor merges.

```
elif(int(act_thirst) < 200 and int(act_hunger) >= 200):
    szomlyas()
elif(int(act_hunger) < 200 and int(act_thirst) >= 200):
    ehes()
elif(int(act_hunger) < 200 and int(act_thirst) < 200):
    merges()
```

A `max_stat` értéke 400. Erre a javascript részben térek ki részletesebben.

Ez az egész egy try-catch blokkba van rakva, mivel a honlaphoz való csatlakozáskor nem kap rögtön adatot az eszköz és ilyenkor
nem tud a kód semmilyen adattal számolni.

![try-catch blokk](https://github.com/bricsi0000000000000/joe/blob/master/images/main_py_0.PNG)

---

## frontend

### index.html

A html 2 részre bontható.
**az első rész maga a játék**

![első rész](https://github.com/bricsi0000000000000/joe/blob/master/images/html_eslo_resz.PNG)

Ez a rész egy `div`-ben található, mivel amikor vége a játéknak, ez a rész elszürkül.
`<div id="joe" class="">`

Ez rész további 2 részre bontható.

- státusz bárok

![státusz bárok](https://github.com/bricsi0000000000000/joe/blob/master/images/html_elso_resz_elso_resze.PNG)

Ez a rész a következő `div`-ben található: `<div class="bars">`

Ezen belül minden státusz bár a következő struktúra szerint épül fel.
```
<span class="text">Kedv</span>
<div class="stat, stat_outside">
    <div id="vibe_stat_inside" class="stat">100%</div>
</div>
```
Először is a cím egy `span`-ban található, aminek `text` az osztály azanosítója.
Alatta található maga a státusz bár, ami 2 részből áll. Egy külső és egy belső részből.

![státusz bár](https://github.com/bricsi0000000000000/joe/blob/master/images/st%C3%A1tusz_b%C3%A1r.PNG)

A belső részben található a státusz bár értéke %-os értékben megadva.

- menü

![menü](https://github.com/bricsi0000000000000/joe/blob/master/images/html_elso_resz_masodik_resze.PNG)

A menüben található a pénztárca, az ételek, italok, szórakozási lehetőségek és az alvás.
A pénztárca az alábbi képpen néz ki:
```
<div class="datas">
    <span class="text" id="wallet"></span>
</div>
```
A maradék 4 kategóri ugyan azon a séma szerint épül fel.
Először is ki van írva a kategória neve: `<span class="text">Ételek</span>`. Ez ugyan úgy van mint a státusz bároknál.

Alatta pedig található az inventory: `<div class="inventory">`.
Az inventory-ban találhatóak a tárgyak. (ételek, italok...)
Egy ilyen tárgy az alábbi képpen néz ki.
`<img class="item" onclick="eat(60, 'croissant')" onmouseover="showInfo('croissant')" onmouseleave="showInfo('')" src="http://richard.bolya.eu/images/joe/croasan.png" alt="">`
Először is az `item` osztály azonosító van megadva rá.
Az `onclick` eseményben van megadva az adott kategória eseménye.

- Ételeknék `eat`
- Italoknál `drink`
- Szórakozásoknál `play`
- Alvásnál `sleep`

Utána az `onmouseove` esemény található, ami a `showInfo` függvényt hívja meg.
Ez teszi lehetővé az adott tárgy nevének és információjának kiírását a képernyőre.
Ez az alábbi `span`-ba történik. `<span class="text" id="food-info">&nbsp</span>`

Az `onmouseleave` esemény azért szükséges, mert különben mindaddig ottmaradna a képernyőn az adott tárgy neve és információja,
amíg másik fölé nem vinnénk az egeret. Ez tulajdonképpen egy üres szövegre cseréli ki a az előbbi `span` `innerHTML`-ét.

Végül pedig a tárgy képe van beszúrva.

- a második rész a játék végén található adatok

![második rész](https://github.com/bricsi0000000000000/joe/blob/master/images/html_masodik_resz.PNG)

Új játék gomb
```
div id="new-game" class="secret">
    <button onclick="new_game()">Újra</button>
</div>
```

és a diagram
```
<div id="footer">
    <div id="chart"></div>
</div>
```

Ezen a diagrammon az egész játék tartalma 5 másodperces lebontásban látható.

### style.css

---

Ebben a stylesheet-ben találhatóak az `index.html` tartalmának formázása.

---

### script.js

Ez a script az egész rendszer lelke. Ez üzemelteti a weblapot, és itt történik az esp-vel való kommunikáció is.

Az elején található `max_stat` változó fontos szerepet játszik, mivel ez aitt megadott érték lesz a státuszoknak a maximális értéke.
Ez az érték itt 400.

**`spawn()`**

A script futása ennek a függvénynek a meghívásával kezdődik, ami az utolsó (560.) sorban található.

Ez a függvény hívódik meg minden játék elején.

Először az adatbázisban található adatokat törli ki, amit a `deleteDatas()` függvény végzi.
Utána a változókat alapértelmezettre állítja, majd meghívja a `life()`, `addMoney()` és `saveDatas()` függvényeket.
Mind a három függvény bizonyos időközönként hívódik meg.

| függvény | idő másodpercben |
| --- | ----------- |
| `life()` | 1 |
| `addMoney()` | 60 |
| `saveDatas()` | 5 |

**`setStat(id, act_stat)`**

Ez a függvény méretezi a státusz bár belsejét az `index.html`-ben.

`document.getElementById(id).style.width = act_stat + "px";`

**`changeStatColor(id, act_stat)`**

Ez a függvény változtatja a megkapott id-val rendelkező státusz bár belsejének a színét.

`document.getElementById(id).style.backgroundColor = happy_color;`

**`setStatValue(id, act_stat)`**

Ez a függvény írja ki a megkapott id-val rendelkező státusz bár értékét.

`document.getElementById(id).innerHTML = ((act_stat / max_stat) * 100).toFixed(0) + "%";`

**`buy(item, eatable, food)`**

Ez a függvény végzi a tárgyak megvásárlását.
Le van kezelve hogy van e a játékosnak elég pénze a vásárlásra, vagy nincs.

**`eat(food, name)`**

Ez a függvény hívódik meg az `index.html`-ben az ételeknél az `onclick` esemény hatására.

A függvény kap egy tárgyat, és azzal a tárgyal meghívja a `buy` függvényt, ami eldönti hogy a vásárlás sikeres volt e.

**`drink(d, name)`**

Ez a függvény hívódik meg az `index.html`-ben az italoknál az `onclick` esemény hatására.

A függvény kap egy tárgyat, és azzal a tárgyal meghívja a `buy` függvényt, ami eldönti hogy a vásárlás sikeres volt e.

**`play(name, n)`**

Ez a függvény hívódik meg az `index.html`-ben a szórakozási lehetőségeknél az `onclick` esemény hatására.

A függvény eldönti, hogy az adott szórakozási lehetőségre van e elég pénze a játékosnak, vagy van e elég ereje Joe-nak.

**`sleep()`**

Ez a függvény hívódik meg az `index.html`-ben az alvás `onclick` eseményén.

Ez a függvény 10 másodpercig szünetelteti a program futását, ezzel az alvást imitálva.

Ilyenkor az `is_sleeping` értéke 1 lesz, ezzel jelezve a program többi részének hogy jelenleg alszik Joe.

A kedv és a fáradtság a `max_stat` értéke lesz, tehát 400.
Az éhség és a jértéke pedig 100.

```
act_vibe = max_stat;
act_tired = max_stat;
act_hunger = 100;
act_thirst = 100;
```

**`changeVibe(n)`**

Ez a függvény akkor hívódik meg, amikor a kedv értéke változik, és a kedv értékét változtatja.

**`hunger(n)`**

Ez a függvény akkor hívódik meg, amikor az éhség értéke változik, és az éhség értékét változtatja.

**`thirst(n)`**

Ez a függvény akkor hívódik meg, amikor a jértéke változik, és a jértékét változtatja.

**`tired(n)`**

Ez a függvény akkor hívódik meg, amikor a fáradtásg értéke változik, és a fáradtság értékét változtatja.

**`setVibe()`**

Ez a függvény beállítja a kedv státusz bárt az `index.html`-ben.

**`setHunger()`**

Ez a függvény beállítja az éhesség státusz bárt az `index.html`-ben.

**`setThirst()`**

Ez a függvény beállítja a jstátusz bárt az `index.html`-ben.

**`setTired()`**

Ez a függvény beállítja a fáradtság státusz bárt az `index.html`-ben.

**`life()`**

Ez a függvény addig fut amíg Joe meg nem hal. `while (!dead)`

Itt fogy folyamatosan az éhesség és a j

Illetve itt küldi el az esp-nek a már említett 5 változó értékét.
```
var xhr = new XMLHttpRequest();
xhr.open("GET", act_vibe + ";" + act_hunger + ";" + act_thirst + ";" + act_tired + ";" + is_sleeping, true);
xhr.send();
```

**`addMoney()`**

Ez a függvény minden percben 10$-t ad a pénztárcába. `money += plusz_money;`

**`checkVibe()`**

Ez a függvény a `life()` függvény-ben hívódik meg minden másodpercben. Ez ellenőrzi az éhség, jés
fáradtság értékét, és ha ezek kevesebbek mint a `max_stat` fele, akkor a kedv értékét elkezdi csökkenteni.
Ha a kedv értéke lemegy 0-ra, vége a játéknak.

**`gameOver()`**

Ez a függvény akkor hívódik meg, amikor véget ér a játék.

Elszürkíti az `index.html` első részét (lsd.: az `index.html` részletes tárgyalásában).

Küld egy emailt a `bolya.richard@gmail.com` email címre.

Megjeleníti a játék során elmentett adatokat vonal diagram formályában.

![játék vége](https://github.com/bricsi0000000000000/joe/blob/master/images/jatek_vege.PNG)

**`waitForSec(ms)`**

Ez a függvény állítja meg a program futását annyi tizedmásodpercre, amennyivel meghívják.

**`showInfo(text)`**

Ez a függvény írja ki a képernyőre a paraméterként megkapott szöveget az adott tárgyról.

`document.getElementById("food-info").innerHTML = info;`

**`newGame()`**

Ez a függvény hívódik meg az `index.html`-ben található Újra gomb `onclick` eseményére.
Ez hívja meg a `spawn()` függvényt és kikapcsolja az `index.html` első részének leszürkítését.

**`saveDatas()`**

Ez a függvény elmenti 5 másodpercenként a játék aktuális állását egy sql adatbázisba. Ezt a `backend.php` script segítségével teszi meg.
Az adatokat egy `XMLHttpRequest` kéréssel teszi meg.
```
var xmlhttp = new XMLHttpRequest();
while (!dead) {
    xmlhttp.open("GET", "backend.php?action=save_datas&act_vibe=" + act_vibe + "&act_hunger=" + act_hunger + "&act_thirst=" + act_thirst + "&act_tired=" + act_tired, true);
    xmlhttp.send();

    await waitForSec(save_data_time);
}
```

![adatbázis](https://github.com/bricsi0000000000000/joe/blob/master/images/sql.PNG)

**`sendMail()`**

Ez a függvény a játék végén emailt küld a `bolya.richard@gmail.com` email címre. Az emailben a játék ideje és az elköltött pénz található.
```
var formated_time = Math.floor(+time / 60) + ":" + (time % 60);

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "backend.php?action=send_mail&time=" + formated_time + "&money=" + alltime_money, true);
xmlhttp.send();
```

**`deleteDatas()`**

Ez a függvény az sql adatbázis tartalmát üríti ki.

**`drawChart()`**

Ez a függvény rajzolja ki a játék végén a játék menetét vonaldiagram formájában.

A diagram rajzoló program amit használok a [Google Charts](https://developers.google.com/chart/).

Először is lekérem az sql adatbázis tartalmát egy `XMLHttpRequest` használatával a `backend.php` scripten keresztül.

Az adatokat JSON formátumban kéri le a program. `var datas = JSON.parse(this.responseText);`

Ezeket az adatokat szétszedi olyan formátumba, hogy a [Google Charts](https://developers.google.com/chart/)
diagram kezelője értelmezni tudja azokat.

```
var all_data = [];
var i = 0;
datas.forEach(data => {
    all_data.push([+i, +data.vibe, +data.hunger, +data.thirst, +data.tired]);
    i+= 5;
});
```

Majd előkészíti a diagrammot.

```
google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(draw);
```

Itt meghívódik egy `draw` függvény, ami a diagrammot tölti fel adatokkal, és a végén ki is rajzolja ezt.
A `draw` függvényben hozzáadom a vízszintes tengelyt (Idő), és a 4 értéket(kedv, éhség, szomjúság, fáradtság).
```
var data = new google.visualization.DataTable();
data.addColumn('number', 'Idő (másodpercben)');
data.addColumn('number', 'Kedv');
data.addColumn('number', 'Éhség');
data.addColumn('number', 'Szomjúság');
data.addColumn('number', 'Fáradtság');
```

Utána pedig az előbb előkészített adatokat.

`data.addRows(all_data);`

Végül beállítom a diagramm címét és méreteit és ezután kirajzolódik a diagram.
```
var options = {
    chart: {
    title: 'Játék menete',
    },
    width: 900,
    height: 500
};

var chart = new google.charts.Line(document.getElementById('chart'));  
chart.draw(data, google.charts.Line.convertOptions(options));
```
