var money = 100;
var plusz_money = 45;
var max_stat = 400;
var dead = false;
var time_count_down = 1000;
var add_money_time = 5000;
var act_vibe = 0;
var act_hunger = 0;
var act_thirst = 0;
var act_tired = 0;
var hungerness = false;
var thirstness = false;
var tiredness = false;
var hunger_down = max_stat * .01;
var thirst_down = max_stat * .02;
var tired_up = max_stat * .01;
var vibe_hunger_down = max_stat * .01;
var vibe_thirst_down = max_stat * .03;
var vibe_tired_down = max_stat * .05;
var vibe_tired_up = max_stat * .01;
var happy_color = "#2bd13c";
var indifferent_color = "#e8d33a";
var sad_color = "#e84e3a";

const CROASAN = {price: 8, name: "croason", vibe: 25};
const DONUT = {price: 7, name: "fánk", vibe: 52};
const HAMBURGER = {price: 15, name: "hamburger", vibe: 126};
const ICE_CREAM = {price: 5, name: "jégkrém", vibe: 248};
const PIZZA = {price: 4, name: "pizza", vibe: 150};
const SANDWICH = {price: 10, name: "szendvics", vibe: 75};
const TACO = {price: 9, name: "taco", vibe: 45};
const TOAST = {price: 3, name: "pirítós", vibe: 25};
const ALIEN_JUICE = {price: 26, name: "alien juice", vibe: 368};
const APPLE_JUICE = {price: 3, name: "almalé", vibe: 26};
const BEER = {price: 4, name: "sör", vibe: 284};
const COFFEE = {price: 3, name: "kávé", vibe: 136};
const LEMONADE = {price: 2, name: "lemonádé", vibe: 37};

function spawn() {
    money = 100;
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

    life();
    addMoney();
}
function setVibe() {
    setStat("vibe_stat_inside", act_vibe);
    changeStatColor("vibe_stat_inside", act_vibe);
    setStatValue("vibe_stat_inside", act_vibe);
}
function buy(item){
    if(money - item.price >= 0){
        money -= item.price;
        if(act_vibe + item.vibe <= max_stat){
            act_vibe += item.vibe;
        }
        else{
            act_vibe = max_stat;
        }
        setVibe();
    }
    else{
        good = false;
        document.getElementById("food-info").innerHTML = "Nincs elég pénzed";
    }
}
function eat(food, name) {
    if(!dead){
        var good = true;

        if(name === "croasan"){
            buy(CROASAN);
        }
        else if(name === "donut"){
            buy(DONUT);
        }
        else if(name === "hamburger"){
            buy(HAMBURGER);
        }
        else if(name === "ice_cream"){
            buy(ICE_CREAM);
        }
        else if(name === "pizza"){
            buy(PIZZA);
        }
        else if(name === "sandwich"){
            buy(SANDWICH);
        }
        else if(name === "taco"){
            buy(TACO);
        }
        else if(name === "toast"){
            buy(TOAST);
        }

        if(good){
            if (act_hunger + food <= max_stat) {
                act_hunger += food;
            }
            else {
                act_hunger = max_stat;
            }
            setHunger();

            document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
        }
    }
}
function hunger(n) {
    if (act_hunger - n >= 0) {
        act_hunger -= n;
    }
    else {
        act_hunger = 0;
        //hungerness = true;
    }
    setHunger()
}
function setHunger() {
    setStat("hunger_stat_inside", act_hunger);
    changeStatColor("hunger_stat_inside", act_hunger);
    setStatValue("hunger_stat_inside", act_hunger);
}
function drink(d, name) {
    if(!dead){
        var good = true;

        if(name === "alien_juice"){
        buy(ALIEN_JUICE);
        }
        else if(name === "apple_juice"){
            buy(APPLE_JUICE);
        }
        else if(name === "beer"){
            buy(BEER);
        }
        else if(name === "coffee"){
            buy(COFFEE);
        }
        else if(name === "lemonade"){
            buy(LEMONADE);
        }

        if(good){
            if (act_thirst + d <= max_stat) {
                act_thirst += d
            }
            else {
                act_thirst = max_stat
            }
            setThirst();

            document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
        }
    }
}
function thirst(n) {
    if (act_thirst - n >= 0) {
        act_thirst -= n
    }
    else {
        act_thirst = 0;
        // thirstness = true
    }
    setThirst()
}
function tired(n) {
    if (act_tired + n <= max_stat) {
        act_tired += n;
    }
    else {
        act_tired = max_stat;
    }
    setTired();
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
        console.clear();
        await waitForSec(time_count_down);

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

        if(act_vibe <= 0){
            dead = true;
        }

        checkVibe();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", act_vibe + ";" + act_hunger + ";" + act_thirst + ";" + act_tired, true);
        xhr.send();
    }
    gameOver()
}
async function addMoney(){
    while(!dead){
        money += plusz_money;
        document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
        await waitForSec(add_money_time);
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
        }
    }
    else {
        if (act_vibe + vibe_tired_up <= max_stat) {
            act_vibe += vibe_tired_up;
        }
    }

    if(act_hunger <= 0  || act_thirst <= 0 || act_tired <= 10){
        if(act_vibe - max_stat * .1 >= 0){
            act_vibe -= max_stat * .1;
        }
        else{
            act_vibe = 0;
        }
    }

    setVibe();
}
function gameOver() {
    document.getElementById('joe').className = "dead";
    document.getElementById('new-game').className = "";
}
function waitForSec(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
function showInfo(text){
    var info = "";
    if(text === "alien_juice"){
        info = ALIEN_JUICE.name + " " + ALIEN_JUICE.price + "$";
    }
    else if(text === "apple_juice"){
        info = APPLE_JUICE.name + " " + APPLE_JUICE.price + "$";
    }
    else if(text === "beer"){
        info = BEER.name + " " + BEER.price + "$";
    }
    else if(text === "coffee"){
        info = COFFEE.name + " " + COFFEE.price + "$";
    }
    else if(text === "croasan"){
        info = CROASAN.name + " " + CROASAN.price + "$";
    }
    else if(text === "donut"){
        info = DONUT.name + " " + DONUT.price + "$";
    }
    else if(text === "hamburger"){
        info = HAMBURGER.name + " " + HAMBURGER.price + "$";
    }
    else if(text === "ice_cream"){
        info = ICE_CREAM.name + " " + ICE_CREAM.price + "$";
    }
    else if(text === "lemonade"){
        info = LEMONADE.name + " " + LEMONADE.price + "$";
    }
    else if(text === "pizza"){
        info = PIZZA.name + " " + PIZZA.price + "$";
    }
    else if(text === "sandwich"){
        info = SANDWICH.name + " " + SANDWICH.price + "$";
    }
    else if(text === "taco"){
        info = TACO.name + " " + TACO.price + "$";
    }
    else if(text === "toast"){
        info = TOAST.name + " " + TOAST.price + "$";
    }
    else if(text === "basketball"){
        info = "Kosárlabda";
    }
    else if(text === "fishing"){
        info = "Horgászás";
    }
    else if(text === "cinema"){
        info = "Mozi 10$";
    }
    else{
        info = "&nbsp";
    }

    document.getElementById("food-info").innerHTML = info;
}
function play(name, n) {
    if(!dead){
        if(name === 'cinema'){
            if(money - 10 >= 0){
                money -= 10;
                document.getElementById("wallet").innerHTML = "Pénz: " + money + "$";
                if (act_tired - n >= 0) {
                    act_tired -= n;
                }
                else {
                    act_tired = 0;
                    //tiredness = true;
                }
                setTired();

                if(act_vibe + n <= max_stat){
                    act_vibe += n;
                }
                else{
                    act_vibe = max_stat;
                }
                setVibe();
                }
            else{
                document.getElementById("food-info").innerHTML = "Nincs elég pénzed";
            }
        }
        else{
            if (act_tired - n >= 0) {
                act_tired -= n;
            }
            else {
                act_tired = 0;
                tiredness = true;
            }
            setTired();

            if(act_vibe + n <= max_stat){
                act_vibe += n;
            }
            else{
                act_vibe = max_stat;
            }
            setVibe();
        }
    }
}

function new_game(){
    spawn();

    document.getElementById('joe').className = "";
    document.getElementById('new-game').className = "secret";
}

spawn();
