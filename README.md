Webbteknik_II-Lab03
===================
###Vad finns det för krav du måste anpassa dig efter i de olika API:erna?
Google:
- Använda nyckel (inte riktigt ett krav då det tydligen går utan (?)) 
- 25 000 anrop på en dag.
SR:
- Var snäll och Cacha gärna datan 
- Inga andra begränsningar
###Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?
Jag har haft problem med cachning, den slutgiltiga produkten har inte cachening. 
Jag stötte på problem i slutet av mitt kodande som gjorde att jag satt i ungefär 5 timmar och letade efter problem med cachening,
som tur var så hittade jag problemet och det hade inget att göra med cacheningen. 
Det borde bara vara att avkommentera (cirka) 5 rader i min javascript. 

Cacheningen som jag jobbat med befann sig först på servern, men jag stötte på problem så jag flyttade cacheningen till javascripten. 
Här använder jag localStorage och cachar i cirkus 20 minuter ( har ändrat så det är kanske runt 4 sekunder för tillfället).
Anledningen att jag bara cachar i 20min är för att jag tror att en applikation som ska visa trafikfaror/etc måste ge rätt
snabb respons, en cachening på 2 timmar skulle bli för mycket om man väl var ute och åkte.

###Vad finns det för risker med din applikation?
Då cachening inte är implemtnetrat till 100% än så finns det en risk att användare gör för många anrop till sr-apiet. 
Just nu ligger väl min GoogleMaps nyckel öppet i HTML-filen, det är nog inte så bra.

###Hur har du tänkt kring säkerheten i din applikation?
Vet inte hur mycket jag tänkt kring säkerheten. Det finns ju ingen chans för injection då jag inte låter användaren mata in någonting.
Hur kan man tänka kring säkerheten här? 
Jag känner inte att det finns så mycket att skydda, ingen känslig data och inget känsligt att hacka sig in i; det värsta som
kan hända är nog att någon tar min GoogleMaps nyckel.

###Hur har du tänkt kring optimeringen i din applikation?
Jag har försökt att köra rätt "lätt", inte speciellt många eller tunga filer, bara en javascriptfil. 
Inga bildfiler som var tunga (annars är ju sprite an lösning till många bildfiler).
