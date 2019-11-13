import socket
from machine import Pin
import random
import time

DIN = Pin(4, Pin.OUT) #D2 - szürke
CLK = Pin(2, Pin.OUT) #D4 - fekete
CS = Pin(0, Pin.OUT)  #D3 - fehér

MOZOG = Pin(14, Pin.IN)

#joe
nyitott_szem = bytes([0x81, 0x18, 0x3c, 0x7e, 0x7e, 0x3c, 0x18, 0x81])
pislog1 = bytes([0x87, 0x1b, 0x3d, 0x7f, 0x7f, 0x3d, 0x1b, 0x87])
pislog2 = bytes([0x8f, 0x1f, 0x3f, 0x7f, 0x7f, 0x3f, 0x1f, 0x8f])
csukott_szem = bytes([0xbf, 0x3f, 0x7f, 0x7f, 0x7f, 0x7f, 0x3f, 0xbf])
mosoly = bytes([0x00, 0x40, 0x8c, 0x9e, 0x9e, 0x8c, 0x40, 0x00])
szomor = bytes([0x00, 0x80, 0x4c, 0x5e, 0x5e, 0x4c, 0x80, 0x00])
ehesseg = bytes([0x00, 0x40, 0x4c, 0x5e, 0x5e, 0x4c, 0x40, 0x00])
szomlyassag = bytes([0x00, 0x40, 0xe6, 0xaf, 0xaf, 0xe6, 0x40, 0x00])
ko = bytes([0x00, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x00])

def mosolyog():
     for i in range(1, 9):
        write(i, mosoly[i - 1])
def szomoru():
     for i in range(1, 9):
        write(i, szomor[i - 1])
def ehes():
     for i in range(1, 9):
        write(i, ehesseg[i - 1])
def szomlyas():
     for i in range(1, 9):
        write(i, szomlyassag[i - 1])
def szemNyit():
    for i in range(1, 9):
        write(i, nyitott_szem[i - 1])
def pislogFazis1():
    for i in range(1, 9):
        write(i, pislog1[i - 1])
def pislogFazis2():
    for i in range(1, 9):
        write(i, pislog2[i - 1])
def szemCsuk():
    for i in range(1, 9):
        write(i, csukott_szem[i - 1])
def KO():
    for i in range(1, 9):
        write(i, ko[i - 1])
pislog_wait = .3
def pislog():
    szemNyit()
    time.sleep(pislog_wait)
    pislogFazis1()
    time.sleep(pislog_wait)
    pislogFazis2()
    time.sleep(pislog_wait)
    szemCsuk()
    time.sleep(pislog_wait)
    pislogFazis2()
    time.sleep(pislog_wait)
    pislogFazis1()
    time.sleep(pislog_wait)
    szemNyit()

def writeByte(DATA):
    i = 0
    CS.value(0)
    for i in range(8, 0, -1):
        CLK.value(0)
        DIN.value(DATA&0x80)
        DATA = DATA << 1
        CLK.value(1)
        
def write(address, dat):
    CS.value(0)
    writeByte(address)
    writeByte(dat)
    CS.value(1)
    
def init():
    write(0x09,0x00)
    write(0x0a,0x03)
    write(0x0b,0x07)
    write(0x0c,0x01)
    write(0x0f,0x00)
    
init()

def web_page():
    """
    f = open("index.html", "r")
    html = f.read()"""
    html = "<!DOCTYPE html><!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Joe</title><style>.stat{text-align:center}.stat,.stat_outside{width:400px;height:50px;background-color:rgb(48, 48, 48)}#stat_inside,.stat{width:300px;height:50px;background-color:rgb(79, 212, 52)}button{height:40px}</style></head><body> Vibe: <div class=\"stat, stat_outside\"><div id=\"vibe_stat_inside\" class=\"stat\">100%</div></div><br> Hunger: <div class=\"stat, stat_outside\"><div id=\"hunger_stat_inside\" class=\"stat\">100%</div></div><button onclick=\"eat(10)\">EAT</button><br> Thirst: <div class=\"stat, stat_outside\"><div id=\"thirst_stat_inside\" class=\"stat\">100%</div></div><button onclick=\"drink(20)\">DRINK</button><br> Tired: <div class=\"stat, stat_outside\"><div id=\"tired_stat_inside\" class=\"stat\">100%</div></div><script>var max_stat=400;var dead=false;var time_count_down=1000;var act_vibe=0;var act_hunger=0;var act_thirst=0;var act_tired=0;var hungerness=false;var thirstness=false;var hunger_down=max_stat*.01;var thirst_down=max_stat*.06;var vibe_hunger_down=max_stat*.01;var vibe_thirst_down=max_stat*.02;var happy_color=\"#2bd13c\";var indifferent_color=\"#e8d33a\";var sad_color=\"#e84e3a\";function spawn(){act_vibe=max_stat;act_hunger=max_stat;act_thirst=max_stat;act_tired=max_stat;setVibe();setHunger();setThirst();setTired()}function setVibe(){setStat(\"vibe_stat_inside\",act_vibe);changeStatColor(\"vibe_stat_inside\",act_vibe);setStatValue(\"vibe_stat_inside\",act_vibe)}function eat(food){if(act_hunger+food<=max_stat){act_hunger+=food}else{act_hunger=max_stat}setHunger()}function hunger(n){if(act_hunger-n>=0){act_hunger-=n}else{act_hunger=0;hungerness=true}setHunger()}function setHunger(){setStat(\"hunger_stat_inside\",act_hunger);changeStatColor(\"hunger_stat_inside\",act_hunger);setStatValue(\"hunger_stat_inside\",act_hunger)}function drink(d){if(act_thirst+d<=max_stat){act_thirst+=d}else{act_thirst=max_stat}setThirst()}function thirst(n){if(act_thirst-n>=0){act_thirst-=n}else{act_thirst=0;thirstness=true}setThirst()}function setThirst(){setStat(\"thirst_stat_inside\",act_thirst);changeStatColor(\"thirst_stat_inside\",act_thirst);setStatValue(\"thirst_stat_inside\",act_thirst)}function setTired(){setStat(\"tired_stat_inside\",act_tired);changeStatColor(\"tired_stat_inside\",act_tired);setStatValue(\"tired_stat_inside\",act_tired)}async function life(){while(!dead){await waitForSec(time_count_down);if(!hungerness){hunger(hunger_down)}else{console.log(\"HUNGER\")}if(!thirstness){thirst(thirst_down)}else{console.log(\"THIRST\")}checkVibe();var xhr=new XMLHttpRequest();xhr.open(\"GET\",\"%\"+act_hunger+\";\"+act_thirst +\"%%\",true);xhr.send()}gameOver()}function checkVibe(){if(act_hunger<=max_stat*.5){act_vibe-=vibe_hunger_down;if(act_vibe<=0){act_vibe=0;gameOver()}}else{if(act_vibe+vibe_hunger_down<=max_stat){act_vibe+=vibe_hunger_down}}if(act_thirst<=max_stat*.5){act_vibe-=vibe_thirst_down;if(act_vibe<=0){act_vibe=0;gameOver()}}else{if(act_vibe+vibe_thirst_down<=max_stat){act_vibe+=vibe_thirst_down}}setVibe()}function gameOver(){console.log(\"DEAD\")}function waitForSec(ms){return new Promise(resolve=>setTimeout(resolve,ms))}function setStat(id,act_stat){document.getElementById(id).style.width=act_stat+\"px\"}function changeStatColor(id,act_stat){if(act_stat>(max_stat*(2/3))){document.getElementById(id).style.backgroundColor=happy_color}else if(act_stat<=(max_stat*(2/3))&&act_stat>=(max_stat*(1/3))){document.getElementById(id).style.backgroundColor=indifferent_color}else{document.getElementById(id).style.backgroundColor=sad_color}}function setStatValue(id,act_stat){document.getElementById(id).innerHTML=((act_stat/max_stat)*100).toFixed(0)+\"%\"}spawn();life();</script> ; kedv: <div id=\"kedv\">jó</div><button onclick=\"valt()\">kedv változtatása</button></body></html>;"
    return html

max_vibe = 400;
vibe = 0;

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80))
s.listen(5)
while True:
    conn, addr = s.accept()
    #print('Kliens IP: %s' % str(addr))
    request = conn.recv(1024)
    request = str(request)
    print('Content = %s' % str(request))

    try:
        t = request.split('%')
        #print(t[1])
        datas = t[1].split(';')
       
        #vibe = int(datas[0])
        hunger = int(datas[0])
        thirst = int(datas[1])
     
        #print("vibe: ")
        #print(vibe)
        
        print("hunger: ")
        print(hunger)
        
        print("thirst: ")
        print(thirst)
        
        if(thirst >= 200 and hunger >= 200):
            mosolyog()
        elif(thirst <= 0 and hunger <= 0):
            KO()
       
        
      
        """
        if(vibe >= 200):
            if(thirts < 200):
               szomlyas()
            else:
                if(hunger < 200):
                    ehes()
                else:
                    mosolyog()
        else:
            szomoru()
        """
    except:
        print(len(t))
    
    response = web_page()
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type: text/html\n')
    conn.send('Connection: close\n\n')
    conn.sendall(response)
    conn.close()