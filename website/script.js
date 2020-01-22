var alltime_money = 0;
var money = 50;
var plusz_money = 10;
var max_stat = 400;
var time = 0;

var dead = false;
var hungerness = false;
var thirstness = false;
var tiredness = false;

var time_count_down = 1000;
var add_money_time = 60000;
var sleep_time = 3000;
var save_data_time = 5000;

var act_vibe = 0;
var act_hunger = 0;
var act_thirst = 0;
var act_tired = 0;
var is_sleeping = 0;

var hunger_down = max_stat * .01;
var thirst_down = max_stat * .02;
var tired_up = max_stat * .01;
var vibe_hunger_down = max_stat * .01;
var vibe_thirst_down = max_stat * .03;
var vibe_tired_down = max_stat * .05;
var vibe_tired_up = max_stat * .01;
var after_eat_thirst_down = max_stat * .1;
var cinema_stats_up = max_stat * .2;
var basketball_thirst_down = max_stat * .5;
var reddit_tired_down = max_stat * .03;
var minecraft_tired_down = max_stat * .1;

var happy_color = "#2bd13c";
var indifferent_color = "#e8d33a";
var sad_color = "#e84e3a";

const CROISSANT = { price: 8, name: "croissant", vibe: 25 };
const PIZZA = { price: 4, name: "pizza", vibe: 150 };
const SANDWICH = { price: 10, name: "szendvics", vibe: 75 };
const HAMBURGER = { price: 15, name: "hamburger", vibe: 126 };
const TOAST = { price: 3, name: "pirítós", vibe: 25 };
const ICE_CREAM = { price: 5, name: "jégkrém", vibe: 248 };
const TACO = { price: 9, name: "taco", vibe: 45 };
const DONUT = { price: 7, name: "fánk", vibe: 52 };
const ALIEN_JUICE = { price: 26, name: "alien szörp", vibe: 368 };
const APPLE_JUICE = { price: 3, name: "almalé", vibe: 26 };
const BEER = { price: 4, name: "sör", vibe: 284 };
const COFFEE = { price: 5, name: "kávé", vibe: 136 };
const LEMONADE = { price: 5, name: "limonádé", vibe: 37 };

function spawn() {
    deleteDatas();

    money = 50;
    alltime_money = money;
    dead = false;
    hungerness = false;
    thirstness = false;
    tiredness = false;
    act_vibe = max_stat;
    act_hunger = max_stat;
    act_thirst = max_stat;
    act_tired = max_stat;
    setVibe();
    setHunger();
    setThirst();
    setTired();

    document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
    document.getElementById("chart").innerHTML = "";

    life();
    addMoney();
    saveDatas();
}
function setStat(id, act_stat) {
    document.getElementById(id).style.width = act_stat + "px";
}
function changeStatColor(id, act_stat) {
    if (act_stat > (max_stat * (2 / 3))) {
        document.getElementById(id).style.backgroundColor = happy_color;
    }
    else if (act_stat <= (max_stat * (2 / 3)) && act_stat >= (max_stat * (1 / 3))) {
        document.getElementById(id).style.backgroundColor = indifferent_color;
    }
    else {
        document.getElementById(id).style.backgroundColor = sad_color;
    }
}
function setStatValue(id, act_stat) {
    document.getElementById(id).innerHTML = ((act_stat / max_stat) * 100).toFixed(0) + "%";
}
function buy(item, eatable, food) {
    if (money - item.price >= 0) {
        money -= item.price;
        changeVibe(-item.vibe);

        if (eatable) {
            hunger(-food);
            thirst(after_eat_thirst_down);
        }
        else {
            thirst(-food);
        }

        document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
    }
    else {
        document.getElementById("food-info").innerHTML = "Nincs elég pénzed";
    }
}
function eat(food, name) {
    if (!dead) {
        if (name === "croissant") {
            buy(CROISSANT, true, food);
        }
        else if (name === "donut") {
            buy(DONUT, true, food);
        }
        else if (name === "hamburger") {
            buy(HAMBURGER, true, food);
        }
        else if (name === "ice_cream") {
            buy(ICE_CREAM, true, food);
        }
        else if (name === "pizza") {
            buy(PIZZA, true, food);
        }
        else if (name === "sandwich") {
            buy(SANDWICH, true, food);
        }
        else if (name === "taco") {
            buy(TACO, true, food);
        }
        else if (name === "toast") {
            buy(TOAST, true, food);
        }
    }
}
function drink(d, name) {
    if (!dead) {
        if (name === "alien_juice") {
            buy(ALIEN_JUICE, false, d);
        }
        else if (name === "apple_juice") {
            buy(APPLE_JUICE, false, d);
        }
        else if (name === "beer") {
            buy(BEER, false, d);
        }
        else if (name === "coffee") {
            buy(COFFEE, false, d);
            tired(-max_stat);
        }
        else if (name === "lemonade") {
            buy(LEMONADE, false, d);
        }
    }
}
function play(name, n) {
    if (!dead) {
        if (act_tired >= 10) {
            if (name === 'cinema') {
                if (money - 10 >= 0) {
                    money -= 10;
                    document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
                    tired(-cinema_stats_up);
                    thirst(-cinema_stats_up);
                    hunger(-cinema_stats_up);

                    changeVibe(n);
                }
                else {
                    document.getElementById("food-info").innerHTML = "Nincs elég pénzed";
                }
            }
            else {
                if (name === 'reddit') {
                    tired(reddit_tired_down);
                }
                else if (name === 'minecraft') {
                    tired(minecraft_tired_down);
                }
                else {
                    tired(n);
                }
                changeVibe(-n);
            }

            if (name === 'basketball') {
                thirst(basketball_thirst_down);
            }
        }
        else {
            document.getElementById("food-info").innerHTML = "Túl fáradt vagy";
        }
    }
}
async function sleep() {
    time_count_down = 10000;

    is_sleeping = 1;

    act_vibe = max_stat;
    act_tired = max_stat;
    act_hunger = 100;
    act_thirst = 100;

    setVibe();
    setHunger();
    setThirst();
    setTired();

    await waitForSec(sleep_time);

    time_count_down = 1000;
    is_sleeping = 0;
}
function changeVibe(n) {
    if (n > 0) {
        if (act_vibe - n >= 0) {
            act_vibe -= n;
        }
        else {
            act_vibe = 0;
        }
    }
    else if (n < 0) {
        if (act_vibe - n <= max_stat) {
            act_vibe -= n;
        }
        else {
            act_vibe = max_stat;
        }
    }
    setVibe();
}
function hunger(n) {
    if (n > 0) {
        if (act_hunger - n >= 0) {
            act_hunger -= n;
        }
        else {
            act_hunger = 0;
        }
    }
    else if (n < 0) {
        if (act_hunger - n <= max_stat) {
            act_hunger -= n;
        }
        else {
            act_hunger = max_stat;
        }
    }
    setHunger()
}
function thirst(n) {
    if (n > 0) {
        if (act_thirst - n >= 0) {
            act_thirst -= n;
        }
        else {
            act_thirst = 0;
        }
    }
    else if (n < 0) {
        if (act_thirst - n <= max_stat) {
            act_thirst -= n;
        }
        else {
            act_thirst = max_stat;
        }
    }
    setThirst()
}
function tired(n) {
    if (n > 0) {
        if (act_tired - n >= 0) {
            act_tired -= n;
        }
        else {
            act_tired = 0;
        }
    }
    else if (n < 0) {
        if (act_tired - n <= max_stat) {
            act_tired -= n;
        }
        else {
            act_tired = max_stat;
        }
    }
    setTired();
}
function setVibe() {
    setStat("vibe_stat_inside", act_vibe);
    changeStatColor("vibe_stat_inside", act_vibe);
    setStatValue("vibe_stat_inside", act_vibe);
}
function setHunger() {
    setStat("hunger_stat_inside", act_hunger);
    changeStatColor("hunger_stat_inside", act_hunger);
    setStatValue("hunger_stat_inside", act_hunger);
}
function setThirst() {
    setStat("thirst_stat_inside", act_thirst);
    changeStatColor("thirst_stat_inside", act_thirst);
    setStatValue("thirst_stat_inside", act_thirst)
}
function setTired() {
    setStat("tired_stat_inside", act_tired);
    changeStatColor("tired_stat_inside", act_tired);
    setStatValue("tired_stat_inside", act_tired)
}
async function life() {
    while (!dead) {
        await waitForSec(time_count_down);

        time++;

        if (!hungerness) {
            hunger(hunger_down);
        }
        else {
        }

        if (!thirstness) {
            thirst(thirst_down);
        }
        else {
        }

        tired(tired_up);

        if (act_vibe <= 0) {
            dead = true;
        }

        checkVibe();

        var xhr = new XMLHttpRequest();
        xhr.open("GET", act_vibe + ";" + act_hunger + ";" + act_thirst + ";" + act_tired + ";" + is_sleeping, true);
        xhr.send();
    }
    //console.log("life");
    //gameOver();
}
async function addMoney() {
    while (!dead) {
        await waitForSec(add_money_time);
        money += plusz_money;
        alltime_money += plusz_money;
        document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
    }
}
function checkVibe() {
    if (act_hunger <= max_stat * .5) {
        if (act_vibe - vibe_hunger_down >= 0) {
            act_vibe -= vibe_hunger_down;
        }
        else {
            act_vibe = 0;
            gameOver();
            return;
        }
    }
    else {
        if (act_vibe + vibe_hunger_down <= max_stat) {
            act_vibe += vibe_hunger_down;
        }
    }

    if (act_thirst <= max_stat * .5) {
        if (act_vibe - vibe_thirst_down >= 0) {
            act_vibe -= vibe_thirst_down;
        }
        else {
            act_vibe = 0;
            gameOver();
            return;
        }
    }
    else {
        if (act_vibe + vibe_thirst_down <= max_stat) {
            act_vibe += vibe_thirst_down;
        }
    }

    if (act_tired <= max_stat * (1 / 3)) {
        if (act_vibe - vibe_tired_down >= 0) {
            act_vibe -= vibe_tired_down;
        }
        else {
            act_vibe = 0;
            gameOver();
            return;
        }
    }
    else {
        if (act_vibe + vibe_tired_up <= max_stat) {
            act_vibe += vibe_tired_up;
        }
    }

    if (act_hunger <= 0 || act_thirst <= 0 || act_tired <= 10) {
        if (act_vibe - max_stat * .1 >= 0) {
            act_vibe -= max_stat * .1;
        }
        else {
            act_vibe = 0;
        }
    }

    setVibe();
}
function gameOver() {
    document.getElementById('joe').className = "dead";
    document.getElementById('new-game').className = "";

    sendMail();
    drawChart();
}
function waitForSec(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showInfo(text) {
    var info = "";
    if (text === "alien_juice") {
        info = ALIEN_JUICE.name + " " + ALIEN_JUICE.price + "$";
    }
    else if (text === "apple_juice") {
        info = APPLE_JUICE.name + " " + APPLE_JUICE.price + "$";
    }
    else if (text === "beer") {
        info = BEER.name + " " + BEER.price + "$";
    }
    else if (text === "coffee") {
        info = COFFEE.name + " " + COFFEE.price + "$";
    }
    else if (text === "croissant") {
        info = CROISSANT.name + " " + CROISSANT.price + "$";
    }
    else if (text === "donut") {
        info = DONUT.name + " " + DONUT.price + "$";
    }
    else if (text === "hamburger") {
        info = HAMBURGER.name + " " + HAMBURGER.price + "$";
    }
    else if (text === "ice_cream") {
        info = ICE_CREAM.name + " " + ICE_CREAM.price + "$";
    }
    else if (text === "lemonade") {
        info = LEMONADE.name + " " + LEMONADE.price + "$";
    }
    else if (text === "pizza") {
        info = PIZZA.name + " " + PIZZA.price + "$";
    }
    else if (text === "sandwich") {
        info = SANDWICH.name + " " + SANDWICH.price + "$";
    }
    else if (text === "taco") {
        info = TACO.name + " " + TACO.price + "$";
    }
    else if (text === "toast") {
        info = TOAST.name + " " + TOAST.price + "$";
    }
    else if (text === "basketball") {
        info = "Kosárlabda";
    }
    else if (text === "fishing") {
        info = "Horgászás";
    }
    else if (text === "cinema") {
        info = "Mozi 10$";
    }
    else if (text === "reddit") {
        info = "Reddit";
    }
    else if (text === "minecraft") {
        info = "Minecraft";
    }
    else {
        info = "&nbsp";
    }

    document.getElementById("food-info").innerHTML = info;
}
function newGame() {
    spawn();

    document.getElementById('joe').className = "";
    document.getElementById('new-game').className = "secret";
}
async function saveDatas() {
    var xmlhttp = new XMLHttpRequest();
    while (!dead) {
        xmlhttp.open("GET", "http://richard.bolya.eu/images/joe/backend.php?action=save_datas&act_vibe=" + act_vibe + "&act_hunger=" + act_hunger + "&act_thirst=" + act_thirst + "&act_tired=" + act_tired, true);
        xmlhttp.send();

        await waitForSec(save_data_time);
    }
}
function sendMail(){
    var minutes = Math.floor(+time / 60);
    minutes = "" + minutes;
    if(minutes.length === 1){
        minutes = "0" + minutes;
    }

    var seconds = time % 60;
    seconds = "" + seconds;
    if(seconds.length === 1){
        seconds = "0" + seconds;
    }

    var formated_time = minutes + ":" + seconds;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "backend.php?action=send_mail&time=" + formated_time + "&money=" + alltime_money, true);
    xmlhttp.send();
}
function deleteDatas() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "http://richard.bolya.eu/images/joe/backend.php?action=delete_datas", true);
    xmlhttp.send();
}
function drawChart() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var datas = [];
            var rows = this.responseText.split('}');
            rows.forEach(row => {
                var tmp_datas = row.split(',');
                var tmp_vibe = 0;
                var tmp_hunger = 0;
                var tmp_thirst = 0;
                var tmp_tired = 0;
                tmp_datas.forEach(data => {
                    var act_data = data.split(':');
                    if(act_data[0][1] === 'v'){
                        tmp_vibe = +act_data[1].substr(1, act_data[1].length - 2);
                    }
                    else if(act_data[0][1] === 'h'){
                        tmp_hunger = +act_data[1].substr(1, act_data[1].length - 2);
                    }
                    else if(act_data[0][1] === 't'){
                        if(act_data[0][2] === 'h'){
                            tmp_thirst = +act_data[1].substr(1, act_data[1].length - 2);
                        }
                        else if(act_data[0][2] === 'i'){
                            tmp_tired = +act_data[1].substr(1, act_data[1].length - 2);
                        }
                    }
                });
               datas.push({vibe: tmp_vibe, hunger: tmp_hunger, thirst: tmp_thirst, tired: tmp_tired});
            });

            var all_data = [];
            var index = 0;
            datas.forEach(data => {
                all_data.push([+index, +data.vibe, +data.hunger, +data.thirst, +data.tired]);
                index+= 5;
            });

            google.charts.load('current', {'packages':['line']});
            google.charts.setOnLoadCallback(draw);
        
            function draw() {
                var data = new google.visualization.DataTable();
                data.addColumn('number', 'Idő (másodpercben)');
                data.addColumn('number', 'Kedv');
                data.addColumn('number', 'Éhség');
                data.addColumn('number', 'Szomjúság');
                data.addColumn('number', 'Fáradtság');

                data.addRows(all_data);
          
                var options = {
                  chart: {
                    title: 'Játék menete',
                  },
                  width: 900,
                  height: 500
                };
          
                var chart = new google.charts.Line(document.getElementById('chart'));
          
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        }
    };
    xmlhttp.open("GET", "http://richard.bolya.eu/images/joe/backend.php?action=get_datas", true);
    xmlhttp.send();
}

spawn();
