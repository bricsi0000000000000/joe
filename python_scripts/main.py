import socket
from machine import Pin
import random
import time


DIN = Pin(4, Pin.OUT) #D2 - szürke
CLK = Pin(2, Pin.OUT) #D4 - fekete
CS = Pin(0, Pin.OUT)  #D3 - fehér

MOZOG = Pin(14, Pin.IN) #D5
HANG = Pin(12, Pin.OUT) #D6

mosoly = bytes([0x3c, 0x42, 0x99, 0xbd, 0xbd, 0x99, 0x42, 0x3c])
szomor = bytes([0x00, 0x00, 0x00, 0xc3, 0xff, 0x7e, 0x3c, 0x18])
ehesseg = bytes([0x3c, 0x42, 0x81, 0x81, 0xbd, 0x99, 0x42, 0x3c])
szomlyassag = bytes([0x3c, 0x42, 0x99, 0xad, 0xa5, 0x99, 0x42, 0x3c])
death = bytes([0x00, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x00])
gonosz = bytes([0x00, 0x00, 0x81, 0xe7, 0xff, 0xbd, 0x42, 0x3c])
alszik = bytes([0x00, 0x00, 0x00, 0x7e, 0xbd, 0x99, 0x42, 0x3c])


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
def merges():
     for i in range(1, 9):
        write(i, gonosz[i - 1])
def dead():
    for i in range(1, 9):
        write(i, death[i - 1])
def sleep():
    for i in range(1, 9):
        write(i, alszik[i - 1])

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
    html = "<!DOCTYPE html><head><meta charset=\"utf-8\"><title>Joe</title><link rel=\"stylesheet\" href=\"http://richard.bolya.eu/images/joe/style.css\"><script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/loader.js\"></script></head><body><div id=\"joe\" class=\"\"><div class=\"bars\"><span class=\"text\">Kedv</span><div class=\"stat, stat_outside\"><div id=\"vibe_stat_inside\" class=\"stat\">100%</div></div><br><span class=\"text\">Éhség</span><div class=\"stat, stat_outside\"><div id=\"hunger_stat_inside\" class=\"stat\">100%</div></div><br><span class=\"text\">Szomjúság</span><div class=\"stat, stat_outside\"><div id=\"thirst_stat_inside\" class=\"stat\">100%</div></div><br><span class=\"text\">Fáradtság</span><div class=\"stat, stat_outside\"><div id=\"tired_stat_inside\" class=\"stat\">100%</div></div></div><div class=\"menu\"><div class=\"datas\"><span class=\"text\" id=\"wallet\"></span></div><span class=\"text\">Ételek</span><div class=\"inventory\"><img class=\"item\" onclick=\"eat(60, 'croissant')\" onmouseover=\"showInfo('croissant')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/croasan.png\" alt=\"\"><img class=\"item\" onclick=\"eat(190, 'pizza')\" onmouseover=\"showInfo('pizza')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/pizza.png\" alt=\"\"><img class=\"item\" onclick=\"eat(170, 'sandwich')\" onmouseover=\"showInfo('sandwich')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/sandwich.png\" alt=\"\"><img class=\"item\" onclick=\"eat(200, 'hamburger')\" onmouseover=\"showInfo('hamburger')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/hamburger.png\" alt=\"\"><img class=\"item\" onclick=\"eat(50, 'toast')\" onmouseover=\"showInfo('toast')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/toast.png\" alt=\"\"><img class=\"item\" onclick=\"eat(10, 'ice_cream')\" onmouseover=\"showInfo('ice_cream')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/ice_cream.png\" alt=\"\"><img class=\"item\" onclick=\"eat(130, 'taco')\" onmouseover=\"showInfo('taco')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/taco.png\" alt=\"\"><img class=\"item\" onclick=\"eat(40, 'donut')\" onmouseover=\"showInfo('donut')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/donut.png\" alt=\"\"></div><span class=\"text\">Italok</span><div class=\"inventory\"><img class=\"item\" onclick=\"drink(200, 'alien_juice')\" onmouseover=\"showInfo('alien_juice')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/alien_juice.png\" alt=\"\"><img class=\"item\" onclick=\"drink(110, 'apple_juice')\" onmouseover=\"showInfo('apple_juice')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/apple_juice.png\" alt=\"\"><img class=\"item\" onclick=\"drink(10, 'beer')\" onmouseover=\"showInfo('beer')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/beer.png\" alt=\"\"><img class=\"item\" onclick=\"drink(50, 'coffee')\" onmouseover=\"showInfo('coffee')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/coffee.png\" alt=\"\"><img class=\"item\" onclick=\"drink(150, 'lemonade')\" onmouseover=\"showInfo('lemonade')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/lemonade.png\" alt=\"\"></div><span class=\"text\">Szórakozás</span><div class=\"inventory\"><img class=\"item\" onclick=\"play('basketball', 150)\" onmouseover=\"showInfo('basketball')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/basketball.png\" alt=\"\"><img class=\"item\" onclick=\"play('fishing', 50)\" onmouseover=\"showInfo('fishing')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/fishing.png\" alt=\"\"><img class=\"item\" onclick=\"play('cinema', 0)\" onmouseover=\"showInfo('cinema')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/cinema.png\" alt=\"\"><img class=\"item\" onclick=\"play('reddit', 400)\" onmouseover=\"showInfo('reddit')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/reddit.png\" alt=\"\"><img class=\"item\" onclick=\"play('minecraft', 400)\" onmouseover=\"showInfo('minecraft')\" onmouseleave=\"showInfo('')\" src=\"http://richard.bolya.eu/images/joe/minecraft.png\" alt=\"\"></div><span class=\"text\">Alvás</span><div class=\"inventory\"><img class=\"item\" onclick=\"sleep()\" src=\"http://richard.bolya.eu/images/joe/bed.png\" alt=\"\"></div><span class=\"text\" id=\"food-info\">&nbsp</span></div></div><div id=\"new-game\" class=\"secret\"><button onclick=\"newGame()\">Újra</button></div><div id=\"footer\"><div id=\"chart\"></div></div><script src=\"http://richard.bolya.eu/images/joe/script.js\"></script></body></html>"
    return html

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('',80))
s.listen(5)

while True: 
    conn, addr = s.accept()
    request = conn.recv(1024)
    request = str(request)
    print("-------------------")
    try:
        splitted_by_space = request.split(' ')
        
        datas = splitted_by_space[1][1:].split(';')

        act_vibe = datas[0]
        act_hunger = datas[1]
        act_thirst = datas[2]
        act_tired = datas[3]
        is_sleeping = datas[4]

        print("act_vibe: " + act_vibe)
        print("act_hunger: " + act_hunger)
        print("act_thirst: " + act_thirst)
        print("act_tired: " + act_tired)
        print("is_sleeping: " + is_sleeping)
        
        
        if(int(act_vibe) <= 0):
            dead()
            HANG.value(0)
        else:
            if(MOZOG.value() == 1):
                merges()
                HANG.value(1)
            else:
                HANG.value(0)
                if(int(is_sleeping) == 1):
                    sleep()
                elif(int(act_thirst) >= 200 and int(act_hunger) >= 200):
                    if(int(act_vibe) >= 266):
                        mosolyog()
                    elif (int(act_vibe) < 266 and int(act_vibe) >= 133):
                        szomoru()
                    else:
                        merges()
                elif(int(act_thirst) < 200 and int(act_hunger) >= 200):
                    szomlyas()
                elif(int(act_hunger) < 200 and int(act_thirst) >= 200):
                    ehes()
                elif(int(act_hunger) < 200 and int(act_thirst) < 200):
                    merges()

    except:
        print("Nem találhatóak adatok")
    
    response = web_page()
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type: text/html\n')
    conn.send('Connection: close\n\n')
    conn.sendall(response)
    conn.close()