
import usocket as socket
from machine import Pin
import network
import esp
esp.osdebug(None)
import gc
gc.collect()
ssid = 'joe'
password = 'Abc123456'
station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)
while station.isconnected() == False:
    pass
print('Sikeres kapcsolat')
print(station.ifconfig())

