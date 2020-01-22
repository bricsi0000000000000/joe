int buzzer_pin = 7;
int buzzer_in = 9;

void setup(){
  pinMode(buzzer_pin, OUTPUT);
  pinMode(buzzer_in, INPUT);
}

void loop(){
  if(digitalRead(buzzer_in)){
    noTone(buzzer_pin);
    delay(40);
    tone(buzzer_pin,500);
  }
  else{
    noTone(buzzer_pin);
  }
}
