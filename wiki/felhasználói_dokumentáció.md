# Felhasználói dokumentáció

## Minimális hardware/software követelmények

- Egy számítógép amin elfut a Thonny nevű program
- Egy webböngésző

---

## Rendszer indítása

1. Mikro USB kábelen keresztül csatlakoztassuk az esp8266-os kártyát egy számítógéphez.

2. A Thonny programban az Interpretert állítsuk át MicroPython-ra.

![interpreter](https://github.com/bricsi0000000000000/joe/blob/master/images/thonny_interpreter.PNG)
3. Az eszközön található `boot.py` és `main.py` megnyitása.

![boot es main py](https://github.com/bricsi0000000000000/joe/blob/master/images/boot_es_main_megnyitasa.PNG)
4. Kiválasztunk egy wifi access pointot, és ennek az ssid és jelszavát beleírjuk a `boot.py` fájlban
található `ssid` és `password` változókba.
```
ssid='joe'
password = 'Abc123456'
```

5. Először a `boot.py` fájlt kell elindítani, és a Shell-be ki fogja írni, ha sikeres a kapcsolat
és annak adatait.

![sikeres kapcsolat](https://github.com/bricsi0000000000000/joe/blob/master/images/boot_py.PNG)

Ha az alábbi hibaüzenetet írja ki, akkor indítsuk el újra.

![hiba üzenet](https://github.com/bricsi0000000000000/joe/blob/master/images/hiba_uzenet_boot_py.PNG)
6. A `main.py` fájlt kell elindítani.

---

## Játék indítása

1. Csatlakozzunk egy eszközzel ugyan arra az access pointra, mint az esp, és a böngészőbe írjuk
be a Shell-ben megjelenő IP címet.

![ip cim](https://github.com/bricsi0000000000000/joe/blob/master/images/IP_cim.PNG)

---

## Játék célja

Joe-t, az űrlényt minél tovább életben tartani.

---

## Játék menete

4 státusz bár található az első blokkban.

- Kedv
- Éhség
- Szomjúság
- Fáradtság

![státusz bárok](https://github.com/bricsi0000000000000/joe/blob/master/images/html_elso_resz_elso_resze.PNG)

Ezek mutatják, a játék állását. Ne engedd hogy ezek az értékek lemenjenek,
minél fentebb kell tartani őket, hogy Joe jól érezze magát.

Lentebb található a pénztárca és a tárgyak, amik segítségével életben kell tartani Joe-t.

![tárgyak](https://github.com/bricsi0000000000000/joe/blob/master/images/html_elso_resz_masodik_resze.PNG)

Alapból 50$-al indul a játékos. Minden perc elteltével kap 10$-t.
Minden étel, ital és pár szórakozás pénzbe kerül.

---

### Ételek

| --- |  név | költség | mennyi éhséget visz fel | mennyi kedvet visz fel |
| --- | --- | --- | --- | --- |
| ![kep](http://richard.bolya.eu/images/joe/croasan.png) | croissant | 8$ | 60 | 25 |
| ![kep](http://richard.bolya.eu/images/joe/pizza.png) | pizza | 4$ | 190 | 150 |
| ![kep](http://richard.bolya.eu/images/joe/sandwich.png) | szendvics | 10$ | 170 | 75 |
| ![kep](http://richard.bolya.eu/images/joe/hamburger.png) | hamburger | 15$ | 200 | 126 |
| ![kep](http://richard.bolya.eu/images/joe/toast.png) | pirítós | 3$ | 50 | 25 |
| ![kep](http://richard.bolya.eu/images/joe/ice_cream.png) | jégkrém | 5$ | 10 | 248 |
| ![kep](http://richard.bolya.eu/images/joe/taco.png) | taco | 9$ | 130 | 45 |
| ![kep](http://richard.bolya.eu/images/joe/donut.png) | fánk | 7$ | 40 | 52 |

---

### Italok

| --- | név | költség | mennyi szomjúságot visz fel | mennyi kedvet visz fel |
| --- | --- | --- | --- | --- |
| ![kep](http://richard.bolya.eu/images/joe/alien_juice.png) | alien szörp | 26$ | 200 | 368 |
| ![kep](http://richard.bolya.eu/images/joe/apple_juice.png) | almalé | 3$ | 110 | 26 |
| ![kep](http://richard.bolya.eu/images/joe/beer.png) | sör | 4$ | 10 | 284 |
| ![kep](http://richard.bolya.eu/images/joe/coffee.png) | kávé | 5$ | 50 | 136 |
| ![kep](http://richard.bolya.eu/images/joe/lemonade.png) | lemonádé | 5$ | 150 | 37 |

---

### Szórakozások

| név | költség | mennyi szomjúságot visz fel | mennyi éhséget visz fel | mennyi fáradtságot visz le | mennyi kedvet visz fel |
| --- | --- | --- | --- | --- | --- |
| kosárlabda | 0$ | -200 | 0 | 150 | 150 |
| horgászás | 0$ | 0 | 0 | -50 | 50 |
| mozi | 10$ | 80 | 80 | 0 | 400 |
| reddit | 0$ | 0 | 0 | 12 | 400 |
| minecraft | 0$ | 0 | 0 | 40 | 400 |

---

### Alvás

Az alvás 10 másodperig tart. Ez idő alatt nem változik egyik státuszbár értéke se.

Az alvás megkezdésekor a kedv és fáradtság értéke a maximumra változik, az éhség és szomjúság értéke pedig 100-ra.

---

### Kedvek

- **mosoly**

![mosoly](https://github.com/bricsi0000000000000/joe/blob/master/images/mosolyog.jpg)

- **szomorú**

![szomorú](https://github.com/bricsi0000000000000/joe/blob/master/images/szomoru.jpg)

- **éhes**

![éhes](https://github.com/bricsi0000000000000/joe/blob/master/images/ehes.jpg)

- **szomjas**

![szomlyas](https://github.com/bricsi0000000000000/joe/blob/master/images/szomlyas.jpg)

- **halott**

![halott](https://github.com/bricsi0000000000000/joe/blob/master/images/halott.jpg)

- **mérges**

![mérges](https://github.com/bricsi0000000000000/joe/blob/master/images/merges.jpg)

- **alvás**

![alvás](https://github.com/bricsi0000000000000/joe/blob/master/images/alszik.jpg)

**jó kedve** van ha: a szomlyúság és éhség értéke több mint a fele, és a kedv értéke több
mint a 2/3-a.

**szomorú**, ha: a szomlyúság és éhség értéke több mint a fele, viszont a kedv
1/3 és 2/3 között van.

**mérges**, ha: a szomlyúság és éhség értéke több mint a fele, és a kedv értéke
kevesebb mint 1/3. Vagy az éhség és a szomlyúság értéke kevesebb mint a fele.
Vagy amíg el van döntve.

**szomjas**, ha: a szomjúság értéke kevesebb mint a fele és az éhség értéke több mint a fele.

**éhes**, ha: az éhség értéke kevesebb mint a fele és a szomjúság értéke több mint a fele.

**alvás**, amíg alszik.

**halott**, ha a kedv értéke elérte a 0-t.

---

### Játék vége

Ha Joe meghal, véget ér a játék. Ilyenkor egy email érkezik a játékosnak, amiben a játék
időtartama és a játék során elköltött pénz mennyisége található.

![email](https://github.com/bricsi0000000000000/joe/blob/master/images/email.PNG)

Illetve egy diagram jelenik meg, amin a játék folyamata látható, 5 másodpercekre lebontva.

![grafikon](https://github.com/bricsi0000000000000/joe/blob/master/images/html_masodik_resz.PNG)

A játékosnak lehetősége van új játékot indítani, amit az Újra gomb megnyomásával tehet.
Ilyenkor minden érték alapértelmezettre állítódik.
