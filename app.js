"use strict";
/* ---------- Season codes ---------- */
const CODES = {
  D:{label:"Dry season", short:"Dry", fit:1},
  M:{label:"Mini dry window", short:"Mini dry", fit:.75},
  H:{label:"Dry but hot", short:"Hot", fit:.6},
  K:{label:"Dry but freezing nights", short:"Freezing", fit:.6},
  B:{label:"Shoulder / bearable", short:"Shoulder", fit:.5},
  W:{label:"Wet season", short:"Wet", fit:0},
  C:{label:"Winter cold", short:"Cold", fit:0},
};
const CODE_ORDER = ["D","M","H","K","B","W","C"];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const cs = s => s.split(",");

/* ---------- Regions: monthly code, avg high, night low, rain mm ---------- */
const REGIONS = {
  baja:{name:"Baja California", codes:cs("D,D,D,B,H,H,H,H,W,B,D,D"), hi:[22,24,26,29,32,36,38,38,36,32,27,23], lo:[10,11,12,14,17,21,25,26,24,19,14,11], rain:[12,6,3,1,0,0,6,25,45,15,10,15], lat:27},
  mexhigh:{name:"Mexican highlands", codes:cs("D,D,D,D,B,W,W,W,W,B,D,D"), hi:[23,25,28,29,29,27,25,25,24,24,24,23], lo:[5,6,9,11,12,13,12,12,12,9,7,5], rain:[10,6,10,20,50,140,160,150,130,55,12,8], lat:22},
  smex:{name:"Oaxaca & Chiapas", codes:cs("D,D,H,H,B,W,W,W,W,B,D,D"), hi:[27,29,31,32,31,28,27,28,27,27,27,26], lo:[12,13,15,17,18,18,17,17,17,16,14,12], rain:[3,5,10,30,80,180,120,130,170,60,12,4], lat:17},
  guate:{name:"Guatemala", codes:cs("D,D,D,D,W,W,W,W,W,W,D,D"), hi:[23,24,26,27,26,25,25,25,24,23,23,23], lo:[11,11,12,13,14,15,15,15,15,14,13,12], rain:[3,4,10,30,130,250,180,170,230,130,30,6], lat:15},
  belize:{name:"Belize", codes:cs("D,D,D,D,B,W,W,W,W,W,W,B"), hi:[28,29,30,31,32,32,31,32,31,30,29,28], lo:[20,21,22,23,24,24,24,24,23,22,21,20], rain:[120,60,40,40,100,200,170,170,230,250,200,170], lat:17, offRoute:true},
  elsal:{name:"El Salvador & Honduras", codes:cs("D,D,H,H,W,W,W,W,W,W,D,D"), hi:[34,35,36,36,32,31,31,31,30,30,30,31], lo:[19,20,21,22,22,21,21,21,21,21,20,19], rain:[5,5,10,45,180,300,280,300,320,220,45,10], lat:13.6},
  nica:{name:"Nicaragua", codes:cs("D,D,H,H,W,W,B,W,W,W,D,D"), hi:[31,32,34,35,34,31,31,31,31,31,31,31], lo:[22,22,23,24,24,23,23,23,22,22,22,22], rain:[2,1,3,10,180,250,150,180,300,300,60,8], lat:12.5},
  cr:{name:"Costa Rica", codes:cs("D,D,H,H,W,W,B,W,W,W,W,B"), hi:[28,29,30,30,29,28,28,28,28,27,27,27], lo:[17,17,18,18,19,19,18,18,18,18,18,17], rain:[10,10,15,60,250,280,200,250,330,330,150,40], lat:9.9},
  pan:{name:"Panama", codes:cs("D,D,H,H,W,W,W,W,W,W,W,B"), hi:[32,32,33,33,31,30,31,31,30,30,30,31], lo:[22,22,23,24,24,24,24,24,23,23,23,23], rain:[30,10,15,70,220,210,180,210,200,260,250,120], lat:8.5},
  ven:{name:"Venezuela", codes:cs("D,D,D,B,W,W,W,W,W,W,W,B"), hi:[30,31,31,31,31,30,30,31,31,31,31,30], lo:[20,20,21,22,22,22,21,21,21,21,21,20], rain:[20,15,20,60,120,140,150,140,110,110,80,40], lat:8, offRoute:true},
  colcarib:{name:"Colombian Caribbean", codes:cs("D,D,D,H,W,B,B,W,W,W,W,D"), hi:[31,31,31,32,32,32,32,32,32,31,31,31], lo:[24,24,25,25,26,26,26,26,25,25,25,24], rain:[5,2,3,25,90,90,80,110,140,240,140,40], lat:9},
  colombia:{name:"Colombian Andes north", codes:cs("D,D,B,W,W,M,M,M,B,W,W,D"), hi:[25,25,25,24,24,24,25,25,24,23,23,24], lo:[13,13,14,14,14,13,13,13,13,13,13,13], rain:[70,90,130,180,190,110,80,100,150,210,170,100], lat:4},
  colsur:{name:"Colombian Andes south", codes:cs("W,B,W,W,W,B,D,D,D,W,W,W"), hi:[21,21,21,21,21,21,21,22,22,22,21,21], lo:[11,11,12,12,12,11,11,10,10,11,12,12], rain:[144,116,147,147,125,64,45,38,71,175,221,177], lat:2},
  ecuador:{name:"Ecuador Andes", codes:cs("M,W,W,W,B,D,D,D,D,B,W,M"), hi:[19,19,19,19,19,19,19,20,20,20,20,19], lo:[8,8,8,8,8,7,6,6,7,8,8,8], rain:[110,130,160,170,110,45,20,25,70,110,100,90], lat:-1.5},
  peru:{name:"Peruvian Andes", codes:cs("W,W,W,B,D,D,D,D,D,B,W,W"), hi:[16,16,16,17,17,17,17,17,18,18,18,17], lo:[2,2,2,0,-3,-6,-7,-5,-2,0,1,2], rain:[150,145,125,55,15,5,5,10,25,55,80,120], lat:-10},
  bolivia:{name:"Altiplano (S Peru & Bolivia)", codes:cs("W,W,W,B,D,K,K,D,D,D,B,W"), hi:[15,15,15,15,13,11,11,13,15,17,18,17], lo:[0,0,-2,-6,-11,-14,-15,-13,-9,-5,-3,-1], rain:[110,90,60,20,5,2,2,8,20,30,40,80], lat:-18},
  puna:{name:"Puna & N Chile", codes:cs("B,B,B,D,K,C,C,C,K,D,D,D"), hi:[24,23,22,20,16,13,13,15,18,21,23,24], lo:[4,4,2,-2,-7,-11,-12,-10,-6,-2,1,3], rain:[35,30,12,3,1,1,1,1,1,2,4,12], lat:-25},
  lakes:{name:"Cuyo & the Lakes", codes:cs("D,D,D,B,W,C,C,C,W,B,D,D"), hi:[27,26,22,17,12,9,8,10,13,17,21,25], lo:[11,10,7,4,2,0,-1,0,2,5,8,10], rain:[35,35,45,70,140,150,140,110,70,45,35,30], lat:-37},
  austral:{name:"Carretera Austral", codes:cs("D,D,D,B,C,C,C,C,C,B,B,D"), hi:[19,19,16,12,8,5,5,7,10,13,16,18], lo:[7,7,5,3,1,-1,-2,-1,1,3,5,6], rain:[55,50,70,90,130,150,140,110,75,60,55,55], lat:-45.5},
  patagonia:{name:"Southern Patagonia", codes:cs("D,D,D,B,C,C,C,C,C,B,D,D"), hi:[17,16,14,10,6,3,3,5,9,12,14,16], lo:[5,5,3,1,-2,-4,-5,-3,-1,1,3,4], rain:[30,30,35,40,40,40,35,35,30,25,30,35], lat:-52},
};

/* ---------- Legs, north to south. km = dirt route, pkm = main-road distance between the same towns (OSRM); f/pf = pace factor vs your road pace.
   named: a mapped bikepacking.com dirt route, which auto-pick never moves onto a main road. risk: a current government travel warning on the line.
   dwp/dstay: a dirt line that differs from the main road. N: northbound dirt override where a route is one-way. ---------- */
const SEGS = [
 {id:"baja", stay:"Loreto", name:"Baja Divide", country:"Mexico", region:"baja", km:2784, f:.72, pkm:1687, pf:.95, named:true,
  wp:[["San Diego",32.72,-117.16],["Tecate",32.57,-116.63],["Ensenada",31.87,-116.6],["San Quintín",30.56,-115.94],["Cataviña",29.73,-114.72],["Bahía de los Ángeles",28.95,-113.56],["San Ignacio",27.28,-112.9],["Mulegé",26.89,-111.98],["Loreto",26.01,-111.35],["Ciudad Constitución",25.03,-111.66],["La Paz",24.14,-110.31]],
  note:"Sand, washboard and 100 km+ water carries: 2,784 km, about 42 days on the guide, 95% unpaved. Best Nov to Mar. Summer runs 38 to 40°C inland, and Aug to Oct is hurricane season.",
  src:[["Baja Divide","https://bikepacking.com/routes/baja-divide"]]},
 {id:"sierra", stay:"Guanajuato", name:"Sierra Madre to Mexico City", country:"Mexico", region:"mexhigh", km:1500, f:.75, pkm:1200, pf:.92,
  wp:[["Mazatlán",23.25,-106.41],["Durango",24.02,-104.66],["Zacatecas",22.77,-102.58],["Guanajuato",21.02,-101.26],["Querétaro",20.59,-100.39],["Mexico City",19.43,-99.13]],
  risk:"Sinaloa and Zacatecas are on the US \"do not travel\" list (Oct 2026), and the Trans-Mexico Norte page (May 2026) advises against cycling Mazatlán to Durango. Auto-pick takes the bus here; check current advice before you ride it.",
  note:"Climbs off the hot Pacific coast to the 2,000 m plateau. The Jun to Sep rains are mostly afternoon storms, so early starts still work. The line drawn here follows the main towns; the mapped dirt route is Trans-Mexico Norte (Mazatlán to Oaxaca, 2,363 km, about 40 days, Dec to Apr, half unpaved), the Trans Mexico on your chart.",
  src:[["Trans-Mexico Norte","https://bikepacking.com/routes/trans-mexico-norte/"]]},
 {id:"oaxaca", stay:"Oaxaca", name:"Oaxaca & Chiapas", country:"Mexico", region:"smex", km:1450, f:.68, pkm:1150, pf:.9,
  wp:[["Mexico City",19.43,-99.13],["Puebla",19.04,-98.2],["Oaxaca",17.07,-96.72],["Tehuantepec",16.32,-95.24],["Tuxtla Gutiérrez",16.75,-93.12],["San Cristóbal",16.74,-92.64],["Comitán",16.25,-92.13]],
  note:"Sierra Norte dirt, then the Isthmus of Tehuantepec, which is hot and has strong crosswinds Nov to Feb. San Cristóbal sits at 2,200 m with cold nights. Trans-Mexico Sur is the mapped dirt option (Oaxaca to Frontera Corozal, 1,094 km, about 18 days, Nov to Mar). Chiapas is on the US \"reconsider travel\" list.",
  src:[["Dan Camp: Across Mexico (Oaxaca to the Guatemala border)","https://bikepacking.com/news/bikepacking-across-mexico-video/"],["Dan Camp: Backroads of Oaxaca","https://bikepacking.com/news/bikepacking-backroads-of-oaxaca-video/"],["Trans-Mexico Sur","https://bikepacking.com/routes/trans-mexico-sur/"]]},
 {id:"guate", stay:"Lake Atitlán", name:"Guatemalan highlands", country:"Guatemala", region:"guate", km:600, f:.6, pkm:420, pf:.8,
  wp:[["La Mesilla",15.62,-91.98],["Huehuetenango",15.32,-91.47],["Quetzaltenango",14.84,-91.52],["Lake Atitlán",14.74,-91.16],["Antigua",14.56,-90.73]],
  note:"Very steep. The Cuchumatanes top 3,000 m. May to Oct brings heavy afternoon rain and muddy tracks; October still averages 160 to 360 mm in the highlands.",
  src:[]},
 {id:"elsal", stay:"Suchitoto", name:"El Salvador & Honduras", country:"El Salvador / Honduras", region:"elsal", km:600, f:.8, pkm:566, pf:1,
  wp:[["Antigua",14.56,-90.73],["Ahuachapán",13.92,-89.85],["Suchitoto",13.94,-89.03],["San Miguel",13.48,-88.18],["Choluteca",13.3,-87.19]],
  note:"Ruta de las Flores, then hot Pacific lowlands. Jan to Apr highs run 34 to 36°C and humid, so ride from dawn.",
  src:[]},
 {id:"nica", stay:"Granada", name:"Nicaragua", country:"Nicaragua", region:"nica", km:560, f:.85, pkm:470, pf:1,
  wp:[["Somoto",13.48,-86.58],["Estelí",13.09,-86.35],["León",12.43,-86.88],["Granada",11.93,-85.96],["San Juan del Sur",11.25,-85.87],["Peñas Blancas",11.21,-85.61]],
  note:"Cooler northern hills, then volcano lowlands. Mar and Apr are dry but 35°C. A short dry spell (canícula) often comes in July.",
  src:[["Dan Camp: 300 miles across Nicaragua","https://bikepacking.com/news/300-miles-across-nicaragua-video/"]]},
 {id:"cr", stay:"Monteverde", name:"Costa Rica", country:"Costa Rica", region:"cr", km:700, f:.65, pkm:560, pf:.85,
  wp:[["Liberia",10.63,-85.44],["Monteverde",10.3,-84.82],["San José",9.93,-84.08],["Cerro de la Muerte",9.56,-83.75],["San Isidro",9.37,-83.7],["Paso Canoas",8.53,-82.84]],
  note:"Brutal gradients and a 3,300 m pass at Cerro de la Muerte. The Pacific side is dry Dec to Apr; Sep and Oct are the wettest months. The heat of Mar and Apr is a lowland problem, not one for Monteverde or the pass.",
  src:[]},
 {id:"pan", stay:"Boquete", name:"Panama", country:"Panama", region:"pan", km:620, f:.85, pkm:578, pf:1,
  wp:[["Paso Canoas",8.53,-82.84],["David",8.43,-82.43],["Boquete",8.78,-82.44],["Santiago",8.1,-80.98],["Panama City",8.98,-79.52]],
  hwy:"Panama has few through roads, so the main-road version is the Pan-American Highway: busy, hot and shadeless.",
  note:"Hot and humid. Use the old roads through the Chiriquí highlands around Boquete, and quiet back roads where they link up, but expect some Pan-American Highway: there is often no other way through. The dry season runs mid-Dec to Apr.",
  src:[]},
 {id:"colcarib", stay:"Medellín", name:"Caribbean coast to Medellín", country:"Colombia", region:"colcarib", km:760, f:.8, pkm:732, pf:.95,
  wp:[["Cartagena",10.39,-75.51],["Sincelejo",9.3,-75.4],["Caucasia",7.99,-75.2],["Santa Fe de Antioquia",6.56,-75.83],["Medellín",6.24,-75.58]],
  hwy:"The main-road version follows Highway 25 through the lowlands, with heavy truck traffic.",
  risk:"UK advice (30 Oct 2026) is against all but essential travel to the Bajo Cauca region of Antioquia, around Caucasia on this line. Auto-pick takes the bus to Medellín.",
  note:"Flat, hot and humid lowlands (32°C, sticky), then a big climb into the Andes at Medellín. Quiet roads are scarce until the climb, so most riders take the bus to the hills.",
  src:[]},
 {id:"colandes", stay:"Salento", name:"Colombian Andes north", country:"Colombia", region:"colombia", km:520, f:.58, pkm:450, pf:.85,
  wp:[["Medellín",6.24,-75.58],["Jardín",5.6,-75.82],["Manizales",5.07,-75.52],["Salento",4.64,-75.57],["Ibagué",4.44,-75.23]],
  note:"Coffee-country back roads via Jardín and Salento. North of Ibagué the driest months are Dec to Feb, with a shorter, less reliable dry spell Jun to Aug. Apr, May, Oct and Nov are wet, with landslides on dirt roads. Your chart lists 3 Colombia routes.",
  src:[["Iohan in Colombia, Dec 2016 to May 2017","https://www.bikewanderer.com/on-the-road/tag/colombia"]]},
 {id:"colsur", stay:"San Agustín", name:"Colombian Andes south", country:"Colombia", region:"colsur", km:1180, f:.58, pkm:966, pf:.85,
  wp:[["Ibagué",4.44,-75.23],["Tatacoa",3.23,-75.17],["San Agustín",1.88,-76.27],["Popayán",2.44,-76.61],["Pasto",1.21,-77.28],["Ipiales",0.83,-77.64]],
  note:"Through the Tatacoa desert, San Agustín and Popayán to the Ecuador border. The seasons run the other way from the north: Popayán is driest in Jul and Aug (about 52 mm) and wettest Oct to Jan (210 to 330 mm). UK advice (30 Oct 2026) says to reach San Agustín on the main roads via Neiva or Popayán, and is against all but essential travel to western Cauca.",
  src:[["Iohan in Colombia, Dec 2016 to May 2017","https://www.bikewanderer.com/on-the-road/tag/colombia"]]},
 {id:"ecuador", stay:"Cuenca", name:"Trans Ecuador MTB Route", country:"Ecuador", region:"ecuador", km:1530, f:.5, pkm:1246, pf:.8, named:true,
  wp:[["Tulcán",.81,-77.72],["Ibarra",.35,-78.12],["Quito",-.18,-78.47],["Cotopaxi",-.68,-78.44],["Quilotoa",-.86,-78.9],["Riobamba",-1.67,-78.65],["Cuenca",-2.9,-79.0],["Loja",-3.99,-79.2],["Vilcabamba",-4.26,-79.22],["Zumba",-4.87,-79.13]],
  note:"Cobbles, mud and steep climbs past Cotopaxi and Chimborazo. The guide gives 1,381 km to Vilcabamba in about 23 days, mid-June to mid-September; this leg runs on to the La Balsa border. The route page reports a 2023 robbery at the Laguna Chiquita campsite south of Otavalo, so lock bikes at night.",
  src:[["TEMBR dirt road version","https://bikepacking.com/routes/trans-ecuador-dirt-road/"],["Iohan on the Trans Ecuador (singletrack version)","https://bikepacking.com/plog/iohan-trans-ecuador"]]},
 {id:"perun", stay:"Huaraz", name:"Northern Peru", country:"Peru", region:"peru", km:1480, f:.5, pkm:1375, pf:.75,
  wp:[["La Balsa",-5.0,-79.05],["Jaén",-5.71,-78.81],["Chachapoyas",-6.23,-77.87],["Celendín",-6.87,-78.15],["Cajamarca",-7.16,-78.51],["Huamachuco",-7.81,-78.05],["Cañón del Pato",-8.8,-77.8],["Huaraz",-9.53,-77.53]],
  note:"Huge canyon climbs (Chachapoyas to Celendín drops to 800 m and climbs back over 3,000 m), then the Cañón del Pato tunnels into the Cordillera Blanca. Chachapoyas and Cajamarca have a shorter dry season, Jun to Aug.",
  src:[]},
 {id:"perudiv", stay:"Cusco", name:"Peru Great Divide", country:"Peru", region:"peru", km:1850, f:.48, pkm:1583, pf:.75, named:true,
  wp:[["Huaraz",-9.53,-77.53],["Conococha",-10.12,-77.28],["Huallanca",-9.9,-76.95],["Cerro de Pasco",-10.68,-76.26],["Huancayo",-12.07,-75.2],["Huancavelica",-12.79,-74.97],["Ayacucho",-13.16,-74.22],["Andahuaylas",-13.66,-73.38],["Abancay",-13.64,-72.88],["Cusco",-13.53,-71.97]],
  note:"Passes at 4,500 to 5,000 m and remote villages. The guide gives 1,605 km Huaraz to Abancay in about 32 days at 50 to 60 km a day, dry April or May to September; this leg adds the road on to Cusco. The guide suggests a bag rated to −5°C, but plan on −10°C at the highest camps Jun to Aug. Dec to Mar means daily storms and mud.",
  src:[["Peru Great Divide","https://bikepacking.com/routes/peru-great-divide/"]]},
 {id:"titicaca", stay:"La Paz", name:"Cusco to La Paz", country:"Peru / Bolivia", region:"bolivia", km:1040, f:.5, pkm:650, pf:1,
  wp:[["Cusco",-13.53,-71.97],["Sicuani",-14.27,-71.23],["Puno",-15.84,-70.02],["Copacabana",-16.17,-69.09],["La Paz",-16.5,-68.15]],
  dwp:[["Cusco",-13.53,-71.97],["Pitumarca",-13.98,-71.42],["Macusani",-14.07,-70.43],["La Rinconada",-14.63,-69.45],["Sorata",-15.77,-68.65],["La Paz",-16.5,-68.15]],
  note:"Up onto the Altiplano at 3,800 m, with cold nights. The main road runs via Puno and Lake Titicaca. The dirt option is the Ruta de las Tres Cordilleras (Pitumarca to Sorata, 793 km, 16 to 20 days, 98% unpaved, mid-May to early Sep) past Ausangate and La Rinconada at 5,100 m, the country Iohan rode.",
  src:[["Ruta de las Tres Cordilleras","https://bikepacking.com/routes/tres-cordilleras-boliva-peru"],["Iohan: Las Tres Cordilleras","https://www.bikewanderer.com/on-the-road//las-tres-cordilleras"],["Iohan: To Titicaca via the Land of Gold (the hard dirt line)","https://www.bikewanderer.com/on-the-road//to-titicaca-via-the-land-of-gold"]]},
 {id:"bolivia", stay:"Uyuni", name:"Salar & Lagunas", country:"Bolivia", region:"bolivia", km:1150, f:.45, pkm:1000, pf:.75, named:true, noPaved:true, busLbl:"Jeep",
  wp:[["La Paz",-16.5,-68.15],["Oruro",-17.97,-67.11],["Salar (Tahua)",-19.9,-67.68],["Uyuni",-20.46,-66.83],["Laguna Colorada",-22.2,-67.78],["Laguna Verde",-22.79,-67.82],["San Pedro de Atacama",-22.91,-68.2]],
  note:"The salt flat is only firm in the dry season; Jan to Mar it floods. Lagunas y Salares is 734 km of sand and washboard at 4,000 to 4,900 m (about 15 days, May to Oct), with −15°C nights Jun and Jul and strong winds in Aug. There is no paved road through: the alternative is a jeep transfer, or Uyuni to Tupiza and Villazón into Argentina. Your chart calls this Ruta Toro.",
  src:[["Lagunas y Salares","https://bikepacking.com/routes/lagunas-y-salares/"],["Dan Camp: Wild southern Bolivia","https://bikepacking.com/news/bikepacking-wild-southern-bolivia-video/"]]},
 {id:"puna", stay:"Salta", dstay:"Fiambalá", name:"Puna & Ruta de los Seis Miles", country:"Chile / Argentina", region:"puna", km:1740, f:.5, pkm:1996, pf:.95, named:true,
  wp:[["San Pedro de Atacama",-22.91,-68.2],["Paso de Jama",-23.24,-67.03],["Susques",-23.4,-66.37],["Salta",-24.78,-65.41],["Cafayate",-26.07,-65.98],["Belén",-27.65,-67.03],["Fiambalá",-27.69,-67.62],["Chilecito",-29.16,-67.5],["San Juan",-31.54,-68.53],["Mendoza",-32.89,-68.84]],
  dwp:[["San Pedro de Atacama",-22.91,-68.2],["Peine",-23.68,-68.06],["Paso Socompa",-24.45,-68.3],["Tolar Grande",-24.59,-67.4],["Antofagasta de la Sierra",-26.06,-67.41],["Fiambalá",-27.69,-67.62],["Laguna Brava",-28.35,-68.8],["Guandacol",-29.52,-68.55],["Jáchal",-30.24,-68.75],["San Juan",-31.54,-68.53],["Mendoza",-32.89,-68.84]],
  N:{km:1610, f:.58, dwp:[["San Pedro de Atacama",-22.91,-68.2],["Peine",-23.68,-68.06],["Paso Socompa",-24.45,-68.3],["Tolar Grande",-24.59,-67.4],["Antofagasta de la Sierra",-26.06,-67.41],["Fiambalá",-27.69,-67.62],["Tinogasta",-28.07,-67.57],["Chilecito",-29.16,-67.5],["Villa Unión",-29.31,-68.22],["Guandacol",-29.52,-68.55],["Jáchal",-30.24,-68.75],["San Juan",-31.54,-68.53],["Mendoza",-32.89,-68.84]],
     note:"Northbound, the dirt line skips Seis Miles Sur, which is ridden north to south only, and takes Ruta 40 between Guandacol and Fiambalá."},
  note:"Very dry high desert with long water carries. The dirt line is the Seis Miles: Norte from San Pedro de Atacama over Paso Socompa to Fiambalá (784 km, about 21 days, Nov to Mar), then Sur from Fiambalá to Guandacol (526 km, about 12 days, Oct to Apr, north to south only because of immigration at Pircas Negras). Guides average 37 to 44 km a day. Valley storms run mid-Jan to late Mar; winter brings −12°C nights and closed passes. Confirm Paso Socompa is open (a 2022 alert said it was not processing crossings); Paso de Jama is the fallback. The main-road version crosses Paso de Jama to Salta and follows Ruta 40.",
  src:[["Seis Miles Norte","https://bikepacking.com/routes/ruta-seis-miles-norte/"],["Seis Miles Sur","https://bikepacking.com/routes/ruta-seis-miles-sur/"],["Iohan: Seis Miles","https://bikepacking.com/plog/bikepacking-ruta-seis-miles-iohan/"],["Dan Camp: Bikepacking Chile (Atacama and puna)","https://bikepacking.com/news/dan-camp-bikepacking-chile-video/"]]},
 {id:"lakes", stay:"Bariloche", name:"Cuyo to the Lakes", country:"Argentina / Chile", region:"lakes", km:1750, f:.75, pkm:1550, pf:1,
  wp:[["Mendoza",-32.89,-68.84],["Malargüe",-35.47,-69.58],["Chos Malal",-37.38,-70.27],["Junín de los Andes",-39.95,-71.07],["San Martín de los Andes",-40.16,-71.35],["Bariloche",-41.13,-71.31],["Paso Cardenal Samoré",-40.7,-71.95],["Puerto Varas",-41.32,-72.98],["Puerto Montt",-41.47,-72.94]],
  note:"Ruta 40 down the Andes front is paved apart from about 106 km of gravel south of Bardas Blancas, and that is being paved, so the dirt version needs side roads. Then the Lakes District. Nov to Apr is pleasant; Jun to Aug brings snow on the passes.",
  src:[["Ruta 40 paved and gravel sections","https://turismoruta40.com.ar/en/paved-gravel.html"]]},
 {id:"austral", stay:"Coyhaique", name:"Carretera Austral", country:"Chile", region:"austral", km:1250, f:.68, pkm:1250, pf:.72,
  wp:[["Puerto Montt",-41.47,-72.94],["Hornopirén",-41.96,-72.46],["Chaitén",-42.92,-72.71],["Puyuhuapi",-44.33,-72.56],["Coyhaique",-45.57,-72.07],["Cerro Castillo",-46.06,-72.15],["Río Tranquilo",-46.62,-72.67],["Cochrane",-47.25,-72.57],["Villa O'Higgins",-48.47,-72.56]],
  note:"Gravel, ferries and rain in any month. Dec to Mar is the season; services thin out from April. The rain bars are Coyhaique's, the driest town on the road; Chaitén in the north gets about 4 times as much (212 mm in January, 3,619 mm a year).",
  src:[]},
 {id:"patagonia", stay:"El Chaltén", name:"Southern Patagonia & Tierra del Fuego", country:"Argentina / Chile", region:"patagonia", km:1650, f:.7, pkm:1585, pf:.8,
  wp:[["El Chaltén",-49.33,-72.89],["El Calafate",-50.34,-72.27],["Torres del Paine",-51.0,-73.0],["Puerto Natales",-51.73,-72.5],["Punta Arenas",-53.16,-70.91],["Porvenir",-53.3,-70.37],["Río Grande",-53.79,-67.7],["Tolhuin",-54.51,-67.19],["Ushuaia",-54.8,-68.3]],
  note:"Westerlies of 60 to 100 km/h from the west and north-west, so any stretch heading west is a headwind whichever way you ride: El Chaltén to El Calafate is about 80 km of tailwind and 120 km of head and crosswind. Daylight is 15 to 17 hours Nov to Jan, about 13.5 hours by 1 March, and 7 in June.",
  src:[["TDA Global Cycling on Patagonia","https://tdaglobalcycling.com/2016/10/cycling-patagonia-everything-you-need-to-know/"]]},
];
const SEG_BY = Object.fromEntries(SEGS.map((s,i)=>[s.id,Object.assign(s,{idx:i})]));
const TRANSFERS = {
  baja:{id:"ferry", name:"Ferry La Paz to Mazatlán", nameN:"Ferry Mazatlán to La Paz", days:2, note:"Baja Ferries sails Mazatlán to La Paz on Wednesdays, Fridays and Sundays (2026), about 14 to 16 hours and around 1,850 pesos, plus a day either side for tickets and the port."},
  pan:{id:"darien", name:"Panama City to Cartagena", nameN:"Cartagena to Panama City", days:6, note:"No road crosses the Darién Gap. Planned as the San Blas sailing: 5 to 6 days with two days of open sea, about US$400 to 550. Flying with the bike boxed takes 1 to 2 days instead."},
  austral:{id:"ohiggins", name:"Lago O'Higgins crossing", nameN:"Lago O'Higgins crossing", days:3, note:"Boat across Lago O'Higgins, then 16 km of gravel track and a 5.4 km trail over the border to the Lago del Desierto boat and El Chaltén. Austral Bikes lists boats Nov to Apr (Mondays and Thursdays, plus Saturdays in Jan and Feb); the Lago del Desierto boat runs until 15 April.", months:[10,11,0,1,2,3]},
};
const segIx = id => SEGS.findIndex(s=>s.id===id);
const ROUTES = [
  {id:"sd-ush", name:"San Diego ⇄ Ushuaia (via Baja)", a:"San Diego", b:"Ushuaia", from:segIx("baja"), to:segIx("patagonia")},
  {id:"cdmx-ush", name:"Mexico City ⇄ Ushuaia", a:"Mexico City", b:"Ushuaia", from:segIx("oaxaca"), to:segIx("patagonia")},
  {id:"ctg-ush", name:"Cartagena ⇄ Ushuaia", a:"Cartagena", b:"Ushuaia", from:segIx("colcarib"), to:segIx("patagonia")},
  {id:"sd-ctg", name:"San Diego ⇄ Cartagena", a:"San Diego", b:"Cartagena", from:segIx("baja"), to:segIx("pan"), endXfer:true},
  {id:"cdmx-ctg", name:"Mexico City ⇄ Cartagena", a:"Mexico City", b:"Cartagena", from:segIx("oaxaca"), to:segIx("pan"), endXfer:true},
];
const DEFAULT_BREAKS = ["baja","oaxaca","guate","nica","colandes","ecuador","perudiv","puna","lakes","patagonia"];

/* ---------- state ---------- */
const DEF = {route:"ctg-ush", dir:"S", start:"2027-07-01", auto:true, preset:"jul-ctg", kmpd:100, rest:6, ramp:true, brk:4, dirtPref:true, modes:{}, breaks:Object.fromEntries(DEFAULT_BREAKS.map(b=>[b,true]))};
let S = JSON.parse(JSON.stringify(DEF));
let SEL = 0; // selected day index
let SIM = null;

/* ---------- helpers ---------- */
const DAY = 864e5;
const parseD = s => { const [y,m,d]=s.split("-").map(Number); return Date.UTC(y,m-1,d); };
const isoD = t => new Date(t).toISOString().slice(0,10);
const fmtD = (t,yr=true) => { const d=new Date(t); return d.getUTCDate()+" "+MON[d.getUTCMonth()]+(yr?" "+d.getUTCFullYear():""); };

const fmtKm = n => Math.round(n).toLocaleString("en-US");
function hav(a,b){ const R=6371, toR=Math.PI/180; const dLa=(b[1]-a[1])*toR, dLo=(b[0]-a[0])*toR; const x=Math.sin(dLa/2)**2+Math.cos(a[1]*toR)*Math.cos(b[1]*toR)*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(x)); }
function daylight(lat, t){ const d=new Date(t); const start=Date.UTC(d.getUTCFullYear(),0,0); const n=(t-start)/DAY; const decl=23.44*Math.sin(2*Math.PI*(284+n)/365)*Math.PI/180; const phi=lat*Math.PI/180; let c=-Math.tan(phi)*Math.tan(decl); c=Math.max(-1,Math.min(1,c)); return 24*Math.acos(c)/Math.PI; }

/* polyline per segment in travel direction */
function legLine(seg, dir){ const pts = seg.wp.map(w=>[w[2],w[1]]); return dir==="N"?pts.slice().reverse():pts; }
function lineFor(wp, dir, stay){ const w = dir==="N" ? wp.slice().reverse() : wp; const L=prepLine(w.map(x=>[x[2],x[1]])); const si=Math.max(0, w.map(x=>x[0]).indexOf(stay)); return {L, stayFrac: L.len? L.cum[si]/L.len : 1, stayPt: L.pts[si], stay}; }
function prepLine(pts){ const cum=[0]; for(let i=1;i<pts.length;i++) cum.push(cum[i-1]+hav(pts[i-1],pts[i])); return {pts,cum,len:cum[cum.length-1]}; }
function pointAt(L,f){ const d=f*L.len; let i=1; while(i<L.cum.length-1 && L.cum[i]<d) i++; const a=L.pts[i-1], b=L.pts[i]; const seg=L.cum[i]-L.cum[i-1]||1; const u=Math.max(0,Math.min(1,(d-L.cum[i-1])/seg)); return [a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u]; }
function pointsBetween(L,f0,f1){ const out=[pointAt(L,f0)]; const d0=f0*L.len, d1=f1*L.len; for(let i=1;i<L.cum.length-1;i++){ if(L.cum[i]>d0 && L.cum[i]<d1) out.push(L.pts[i]); } out.push(pointAt(L,f1)); return out; }

/* ---------- build legs for route ---------- */
function buildLegs(routeId, dir){
  const r = ROUTES.find(x=>x.id===routeId);
  const legs=[];
  for(let i=r.from;i<=r.to;i++){
    const seg=SEGS[i];
    const gm=lineFor(seg.wp, dir, seg.stay), dN=dir==="N" && seg.N;
    const dwp=(dN && seg.N.dwp) || seg.dwp, gd = dwp ? lineFor(dwp, dir, seg.dstay||seg.stay) : gm;
    legs.push({type:"seg", seg, gm, gd, dkm:(dN && seg.N.km)||seg.km, df:(dN && seg.N.f)||seg.f, dnote:dN && seg.N.note || "", L:gm.L, stayFrac:gm.stayFrac, stayPt:gm.stayPt, stay:gm.stay});
    const t=TRANSFERS[seg.id];
    if(t && (i<r.to || r.endXfer)) legs.push({type:"xfer", t, after:seg.id});
  }
  if(dir==="N") legs.reverse();
  // endpoints for transfers
  legs.forEach((lg,i)=>{
    if(lg.type!=="xfer") return;
    const prev=legs[i-1], next=legs[i+1];
    const a = prev ? prev.L.pts[prev.L.pts.length-1] : null;
    const b = next ? next.L.pts[0] : null;
    let fallback = lg.t.id==="darien" ? [-75.51,10.39] : null; // Cartagena
    lg.a = a || (dir==="N"? fallback : null); lg.b = b || (dir==="S"? fallback : null);
    if(!lg.a) lg.a = lg.b; if(!lg.b) lg.b = lg.a;
  });
  return legs;
}
function legName(lg, dir){ if(lg.type==="xfer") return dir==="N"?lg.t.nameN:lg.t.name; return lg.seg.name; }
function legFromTo(lg, dir){ if(lg.type!=="seg") return ""; const w=lg.seg.wp; const a=dir==="N"?w[w.length-1][0]:w[0][0], b=dir==="N"?w[0][0]:w[w.length-1][0]; return a+" → "+b; }
function legEndCity(lg){ return lg.stay || lg.seg.stay; }
function modeOf(p, seg){ const m=p.modes[seg.id]||"dirt"; return m==="paved" && seg.noPaved ? "dirt" : m; }

/* ---------- simulation ---------- */
function codeFor(region, t){ return REGIONS[region].codes[monthOf(t)]; }
/* fast month lookup: table of UTC months by epoch day for 2000-2060, Date fallback outside */
const MO_BASE = Math.floor(Date.UTC(2000,0,1)/DAY), MO_TAB = (()=>{ const n=Math.floor(Date.UTC(2060,0,1)/DAY)-MO_BASE; const a=new Int8Array(n); for(let i=0;i<n;i++) a[i]=new Date((MO_BASE+i)*DAY).getUTCMonth(); return a; })();
function monthOf(t){ const k=Math.floor(t/DAY)-MO_BASE; return (k>=0 && k<MO_TAB.length) ? MO_TAB[k] : new Date(t).getUTCMonth(); }
const LEG_CACHE = {};
function legsFor(routeId, dir){ const k=routeId+"|"+dir; const c=LEG_CACHE[k]||(LEG_CACHE[k]=buildLegs(routeId,dir)); return c.map(l=>Object.assign({},l)); }
function Day(li,type,region,code,km,frac){ this.i=0; this.t=0; this.cum=0; this.li=li; this.type=type; this.region=region; this.code=code; this.km=km; this.frac=frac; }
function simulate(p){
  const legs = legsFor(p.route, p.dir);
  const t0 = parseD(p.start);
  const days=[]; let sinceRest=0, rideN=0, cum=0;
  const push = o => { o.i=days.length; o.t=t0+days.length*DAY; o.cum=cum; days.push(o); return o; };
  const codeAt = region => REGIONS[region].codes[monthOf(t0+days.length*DAY)];
  legs.forEach((lg,li)=>{
    lg.startDay = days.length;
    if(lg.type==="xfer"){
      for(let k=0;k<lg.t.days;k++) push(new Day(li,"xfer",null,"T",0,(k+1)/lg.t.days));
    } else {
      const seg=lg.seg; const mode=modeOf(p,seg); lg.mode=mode;
      const g = mode==="dirt" ? lg.gd : lg.gm; lg.L=g.L; lg.stayFrac=g.stayFrac; lg.stayPt=g.stayPt; lg.stay=g.stay;
      if(mode==="bus"){
        const km=seg.pkm; const n=Math.max(1,Math.round(km/450)); lg.km=0; lg.busKm=km;
        for(let k=0;k<n;k++) push(new Day(li,"bus",seg.region,codeAt(seg.region),0,(k+1)/n));
      } else {
        const km = mode==="dirt"?lg.dkm:seg.pkm, f = mode==="dirt"?lg.df:seg.pf; lg.km=km; let done=0;
        let guard=0; let brkDue = p.breaks[seg.id] && !(li===legs.length-1 && lg.stayFrac>.98);
        const doBreak=()=>{ for(let k=0;k<p.brk;k++) push(new Day(li,"break",seg.region,codeAt(seg.region),0,done/km)); sinceRest=0; brkDue=false; };
        while(done < km-0.5 && guard++<2000){
          if(brkDue && done/km >= lg.stayFrac-1e-6){ doBreak(); continue; }
          const code=codeAt(seg.region);
          if(sinceRest>=p.rest){ push(new Day(li,"rest",seg.region,code,0,done/km)); sinceRest=0; continue; }
          let ramp=1; if(p.ramp){ ramp = rideN<14 ? .65 : rideN<42 ? .65+.35*(rideN-14)/28 : 1; }
          const wf = (code==="W"||code==="C")?.82 : (code==="H"||code==="K"||code==="B")?.93 : 1;
          let dk = Math.min(km-done, p.kmpd*f*ramp*wf);
          if(km-done-dk < p.kmpd*f*.25) dk = km-done;
          done+=dk; cum+=dk; rideN++; sinceRest++;
          push(new Day(li,"ride",seg.region,code,dk,Math.min(1,done/km)));
        }
        if(brkDue) doBreak();
      }
      if(mode==="bus" && p.breaks[seg.id] && li<legs.length-1){
        for(let k=0;k<p.brk;k++) push(new Day(li,"break",seg.region,codeAt(seg.region),0,1));
        sinceRest=0;
      }
    }
    lg.endDay = days.length-1;
  });
  const ride=[]; const cnt={D:0,M:0,H:0,K:0,B:0,W:0,C:0}; let fitSum=0, nRest=0, nBrk=0, nX=0, goodKm=0;
  for(const d of days){ if(d.type==="ride"){ ride.push(d); cnt[d.code]++; fitSum+=CODES[d.code].fit; goodKm+=CODES[d.code].fit*d.km; } else if(d.type==="rest") nRest++; else if(d.type==="break") nBrk++; else nX++; }
  const fit = ride.length ? fitSum/ride.length : 0;
  legs.forEach(lg=>{ lg.days=days.slice(lg.startDay, lg.endDay+1); lg.ride=lg.days.filter(d=>d.type==="ride"); lg.cnt={D:0,M:0,H:0,K:0,B:0,W:0,C:0}; let fs=0; lg.ride.forEach(d=>{ lg.cnt[d.code]++; fs+=CODES[d.code].fit; }); lg.fit = lg.ride.length? fs/lg.ride.length : null; });
  let refKm=0, busKm=0; legs.forEach(lg=>{ if(lg.type!=="seg") return; if(lg.mode==="bus"){ refKm+=lg.seg.pkm; busKm+=lg.seg.pkm; } else refKm+=lg.km; });
  return {legs, days, ride, cnt, fit, inSeason: refKm? goodKm/refKm : 0, busKm, total:days.length, km:cum, t0, end:t0+(days.length-1)*DAY, rest:nRest, brk:nBrk, xfer:nX};
}

/* ---------- optimiser: choose dirt / paved / bus per leg ---------- */
const STAR=new Set(["baja","oaxaca","colandes","colsur","ecuador","perudiv","titicaca","bolivia","puna","austral","patagonia"]);
/* what auto-pick may choose per leg: named dirt routes never go onto a main road; legs with a travel warning are bussed */
function autoModes(seg){ if(seg.risk) return ["bus"]; return (seg.named||seg.noPaved) ? ["dirt","bus"] : ["dirt","paved","bus"]; }
let DIRT_W = 1.7; // dirt bonus in the auto-pick; 1.7 when favouring dirt and B roads, 1.25 otherwise
function planValue(sim){
  let v=0;
  sim.days.forEach(d=>{ if(d.type!=="ride") return; const l=sim.legs[d.li]; v += (CODES[d.code].fit-.3)*d.km/100*(l.mode==="dirt"?DIRT_W:1)*(STAR.has(l.seg.id)?1.3:1); });
  sim.legs.forEach(l=>{ if(l.type==="seg" && l.mode==="bus") v-=3; });
  if(sim.total>365) v -= 50+(sim.total-365)*2;
  return v;
}
function climb(p, ids){
  let best=planValue(simulate(p));
  for(let it=0;it<30;it++){
    let mv=null, mvV=best;
    ids.forEach(id=>{ const cur=p.modes[id]; autoModes(SEG_BY[id]).forEach(m=>{ if(m===cur) return; p.modes[id]=m; const v=planValue(simulate(p)); if(v>mvV+1e-6){ mvV=v; mv=[id,m]; } p.modes[id]=cur; }); });
    if(!mv) break; p.modes[mv[0]]=mv[1]; best=mvV;
  }
  return best;
}
function optimize(p0){
  DIRT_W = p0.dirtPref===false ? 1.25 : 1.7;
  const r=ROUTES.find(x=>x.id===p0.route);
  const ids=[]; for(let i=r.from;i<=r.to;i++) ids.push(SEGS[i].id);
  let bestV=-1e9, bestModes=null;
  ["dirt","paved"].forEach(init=>{
    const p=Object.assign({},p0,{modes:Object.assign({},p0.modes)});
    ids.forEach(id=>{ const ok=autoModes(SEG_BY[id]); p.modes[id]= ok.includes(init) ? init : ok[0]; });
    const v=climb(p, ids);
    if(v>bestV){ bestV=v; bestModes=p.modes; }
  });
  return bestModes;
}
function fitTo12(){ S.modes=Object.assign({},S.modes,optimize(S)); }


/* ---------- persistence ---------- */
try{ const saved = JSON.parse(localStorage.getItem("dsrp-v3")||"null"); if(saved && saved.route) S = Object.assign(S, saved); }catch(e){}
if(typeof S.dirtPref!=="boolean") S.dirtPref = true;
if(!ROUTES.some(r=>r.id===S.route)) S.route = DEF.route;
if(!/^\d{4}-\d{2}-\d{2}$/.test(S.start||"")) S.start = DEF.start;
/* a plan shared as a link (?plan=...) overrides the saved one; only the app build makes these links */
const PLAN_KEYS=["route","dir","start","kmpd","rest","ramp","brk","dirtPref","auto","modes","breaks"];
const b64u = str => btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const unb64u = str => decodeURIComponent(escape(atob(str.replace(/-/g,"+").replace(/_/g,"/"))));
function planParam(){ const o={}; PLAN_KEYS.forEach(k=>o[k]=S[k]); return b64u(JSON.stringify(o)); }
let SHARED=false;
try{ const q=new URLSearchParams(location.search).get("plan"); if(q){ const o=JSON.parse(unb64u(q)); if(o && ROUTES.some(r=>r.id===o.route)){ PLAN_KEYS.forEach(k=>{ if(o[k]!==undefined) S[k]=o[k]; }); S.preset=null; SHARED=true; } } }catch(e){}
if(!ROUTES.some(r=>r.id===S.route)) S.route = DEF.route;
if(!/^\d{4}-\d{2}-\d{2}$/.test(S.start||"")) S.start = DEF.start;
const clampN=(v,a,b,d)=> Number.isFinite(+v) ? Math.min(b,Math.max(a,Math.round(+v))) : d;
S.dir = S.dir==="N" ? "N" : "S"; S.kmpd=clampN(S.kmpd,50,170,DEF.kmpd); S.rest=clampN(S.rest,3,12,DEF.rest); S.brk=clampN(S.brk,1,10,DEF.brk);
["ramp","dirtPref","auto"].forEach(k=>S[k]=!!S[k]);
S.modes = (S.modes && typeof S.modes==="object") ? S.modes : {}; S.breaks = (S.breaks && typeof S.breaks==="object") ? S.breaks : {};
for(const k of Object.keys(S.modes)) if(!SEG_BY[k] || !["dirt","paved","bus"].includes(S.modes[k])) delete S.modes[k];
for(const k of Object.keys(S.breaks)) { if(!SEG_BY[k]) delete S.breaks[k]; else S.breaks[k]=!!S.breaks[k]; }
function save(){ try{ localStorage.setItem("dsrp-v3", JSON.stringify(S)); }catch(e){} }
let PINS = []; try{ PINS = JSON.parse(localStorage.getItem("dsrp-pins")||"[]")||[]; if(!Array.isArray(PINS)) PINS=[]; }catch(e){ PINS = []; }
function savePins(){ try{ localStorage.setItem("dsrp-pins", JSON.stringify(PINS)); }catch(e){} }

const $ = id => document.getElementById(id);
const mm = q => window.matchMedia ? window.matchMedia(q).matches : false;
const REDUCE = mm("(prefers-reduced-motion: reduce)");
const FINE = mm("(pointer: fine)");
const yearOf = iso => +iso.slice(0,4);
const routeOf = () => ROUTES.find(x=>x.id===S.route);
const tripName = (r,dir) => dir==="S" ? r.a+" → "+r.b : r.b+" → "+r.a;
const MODE_LBL = {dirt:"Dirt & trails", paved:"Main road", bus:"Bus"};
const modeLbl = (s,m) => m==="bus" && s.busLbl ? s.busLbl : MODE_LBL[m];

function tween(el, to, fmt){
  if(!el) return;
  const from = (el._v==null || REDUCE) ? to : el._v; el._v = to; cancelAnimationFrame(el._raf);
  if(from===to){ el.textContent = fmt(to); return; }
  const t0 = performance.now(), D = 420;
  const step = t => { const u = Math.min(1,(t-t0)/D), e = 1-Math.pow(1-u,3); el.textContent = fmt(from+(to-from)*e); if(u<1) el._raf = requestAnimationFrame(step); };
  el._raf = requestAnimationFrame(step);
}
function setFill(el){ const mn=+el.min||0, mx=+el.max||100, v=+el.value; el.style.setProperty("--p", ((v-mn)/((mx-mn)||1)*100)+"%"); }
let hintT = null;
function showHint(msg){ const h=$("mapHint"); h.textContent = msg; h.classList.add("on"); clearTimeout(hintT); hintT = setTimeout(()=>h.classList.remove("on"), 2400); }

/* ---------- controls ---------- */
const PRESETS = [
  {k:"jul-ctg", t:"Jul 1", s:"Cartagena → Ushuaia", set:{route:"ctg-ush",dir:"S",start:"2027-07-01"}},
  {k:"jul-cdmx", t:"Jul 1", s:"Mexico City → Ushuaia", set:{route:"cdmx-ush",dir:"S",start:"2027-07-01"}},
  {k:"feb-sd", t:"Feb 1", s:"San Diego → Ushuaia", set:{route:"sd-ush",dir:"S",start:"2027-02-01"}},
  {k:"oct-sd-ctg", t:"Oct 15", s:"San Diego → Cartagena", set:{route:"sd-ctg",dir:"S",start:"2027-10-15"}},
  {k:"dec-ush", t:"Dec 1", s:"Ushuaia → Cartagena", set:{route:"ctg-ush",dir:"N",start:"2027-12-01"}},
  {k:"jan-ush-cdmx", t:"Jan 1", s:"Ushuaia → Mexico City", set:{route:"cdmx-ush",dir:"N",start:"2027-01-01"}},
];
const ROUTE_SUB = {"sd-ush":"via the Baja Divide","cdmx-ush":"Mexico to the Andes","ctg-ush":"South America end to end","sd-ctg":"Mexico and Central America","cdmx-ctg":"Central America"};
function routeKm(r){ let k=0; for(let i=r.from;i<=r.to;i++) k+=SEGS[i].km; return k; }
const DATE_BTNS = [["Jul 1",6,1],["Sep 1",8,1],["Oct 1",9,1],["Nov 1",10,1],["Dec 1",11,1],["Jan 1",0,1],["Mar 1",2,1]];

function initControls(){
  $("routes").innerHTML = ROUTES.map(r=>`<button type="button" class="chip" role="radio" aria-checked="false" data-r="${r.id}"><b>${r.a} ⇄ ${r.b}</b><small>${ROUTE_SUB[r.id]} · ${fmtKm(Math.round(routeKm(r)/100)*100)} km of dirt</small></button>`).join("");
  $("routes").querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(S.route===b.dataset.r) return; S.route=b.dataset.r; S.preset=null; update({geom:true}); });
  $("dirS").onclick=()=>{ if(S.dir==="S") return; S.dir="S"; update({geom:true}); };
  $("dirN").onclick=()=>{ if(S.dir==="N") return; S.dir="N"; update({geom:true}); };
  $("start").onchange=e=>{ const v=e.target.value; if(/^\d{4}-\d{2}-\d{2}$/.test(v)){ const y=yearOf(v); S.start = y<2025? "2025"+v.slice(4) : y>2040? "2040"+v.slice(4) : v; update(); } };
  $("dateBtns").innerHTML = DATE_BTNS.map(([l,m,d])=>`<button type="button" data-m="${m}" data-d="${d}" aria-pressed="false">${l}</button>`).join("");
  $("dateBtns").querySelectorAll("button").forEach(b=>b.onclick=()=>{ const y=yearOf(S.start); S.start=isoD(Date.UTC(y,+b.dataset.m,+b.dataset.d)); update(); });
  const slide = (id,key) => { const el=$(id); el.oninput=()=>{ S[key]=+el.value; setFill(el); schedule(); }; };
  slide("kmpd","kmpd"); slide("rest","rest"); slide("brk","brk");
  $("ramp").onchange=e=>{ S.ramp=e.target.checked; update(); };
  $("auto").onchange=e=>{ S.auto=e.target.checked; update(); };
  $("dirtPref").onchange=e=>{ S.dirtPref=e.target.checked; if(!S.auto && S.dirtPref){ /* leave manual picks alone */ } update(); };
  $("allDirt").onclick=()=>{ S.auto=false; SEGS.forEach(s=>S.modes[s.id]="dirt"); update(); };
  $("allPaved").onclick=()=>{ S.auto=false; SEGS.forEach(s=>S.modes[s.id]="paved"); update(); };
  $("presets").innerHTML = PRESETS.map(p=>`<button type="button" class="chip" data-k="${p.k}" aria-pressed="false"><b>${p.t}</b><small>${p.s}</small></button>`).join("");
  $("presets").querySelectorAll("button").forEach(b=>b.onclick=()=>{ const p=PRESETS.find(x=>x.k===b.dataset.k); const geom = p.set.route!==S.route || p.set.dir!==S.dir; Object.assign(S,p.set); S.auto=true; S.preset=p.k; update({geom}); });
  $("day").oninput=e=>{ SEL=+e.target.value; setFill(e.target); drawSel(); };
  $("play").onclick=togglePlay;
  $("speed").onclick=()=>{ SPEED=(SPEED+1)%SPEEDS.length; $("speed").textContent=SPEEDS[SPEED].l; };
  $("follow").onclick=()=>{ FOLLOW=!FOLLOW; $("follow").setAttribute("aria-pressed",FOLLOW); if(FOLLOW){ FOCUS_LI=null; drawSel(true); } else zoomFit(); };
  $("pinBtn").onclick=pinCurrent;
  $("copyBtn").onclick=copyItinerary;
  if(window.DSRP_APP){ const sb=$("shareBtn"); sb.hidden=false; sb.onclick=async()=>{
    const url=location.origin+location.pathname+"?plan="+planParam(), title="Bikepacking Route Planner", text=`${tripName(routeOf(),S.dir)}, from ${fmtD(parseD(S.start))}`;
    if(navigator.share){ try{ await navigator.share({title,text,url}); }catch(e){} return; }
    try{ await navigator.clipboard.writeText(url); $("shareLbl").textContent="Link copied"; setTimeout(()=>$("shareLbl").textContent="Share plan",1800); }catch(e){ window.prompt && window.prompt("Copy this link", url); } };
    if(SHARED){ try{ history.replaceState(null,"",location.pathname); }catch(e){} }
  }
  $("expandAll").onclick=()=>{ const all = SIM.legs.filter(l=>l.type==="seg").map(l=>l.seg.id); const allOpen = all.every(id=>OPEN.has(id)); if(allOpen) OPEN.clear(); else all.forEach(id=>OPEN.add(id)); renderLegs(SIM); drawSel(); };
  $("yPrev").onclick=()=>shiftYear(-1); $("yNext").onclick=()=>shiftYear(1);
  $("useBest").onclick=()=>{ if(STRIP_BEST){ S.start=isoD(STRIP_BEST.t); update({keepStrip:true}); } };
}
function shiftYear(n){ const y=yearOf(S.start)+n; if(y<2025||y>2040) return; S.start=String(y)+S.start.slice(4); if(S.start.endsWith("02-29")) S.start=String(y)+"-02-28"; update(); }
function syncControls(){
  $("routes").querySelectorAll("button").forEach(b=>b.setAttribute("aria-checked", b.dataset.r===S.route));
  $("dirS").setAttribute("aria-pressed",S.dir==="S"); $("dirN").setAttribute("aria-pressed",S.dir==="N");
  $("start").value=S.start; $("startOut").textContent=new Date(parseD(S.start)).toLocaleDateString("en-GB",{weekday:"short",timeZone:"UTC"});
  const sd=new Date(parseD(S.start));
  $("dateBtns").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed", +b.dataset.m===sd.getUTCMonth() && +b.dataset.d===sd.getUTCDate()));
  $("kmpd").value=S.kmpd; $("kmpdOut").textContent=S.kmpd+" km";
  $("rest").value=S.rest; $("restOut").textContent=S.rest+" riding days";
  $("brk").value=S.brk; $("brkOut").textContent=S.brk+(S.brk===1?" day":" days");
  ["kmpd","rest","brk"].forEach(id=>setFill($(id)));
  $("ramp").checked=!!S.ramp; $("auto").checked=!!S.auto; $("dirtPref").checked=!!S.dirtPref;
  document.querySelectorAll("#presets .chip").forEach(b=>{ const p=PRESETS.find(x=>x.k===b.dataset.k); b.setAttribute("aria-pressed", !!S.auto && p.set.route===S.route && p.set.dir===S.dir && p.set.start===S.start); });
}

/* ---------- trip bar + summary ---------- */
const TILES = [["dur","Duration"],["fit","In season"],["km","Distance ridden"],["wet","Wet or winter days"],["hot","Hot or freezing"],["off","Off the bike"]];
function buildSummary(){
  $("summary").innerHTML = TILES.map(([k,l])=>`<div class="stat" id="st-${k}"><span class="k">${l}</span><span class="v"><span id="sv-${k}">0</span><small id="su-${k}"></small></span><span class="s" id="ss-${k}"></span>${k==="dur"||k==="fit"?`<span class="bar" aria-hidden="true"><i id="sb-${k}" style="width:0"></i></span>`:""}</div>`).join("");
}
function setTile(k, v, fmt, unit, sub, cls, bar){
  $("st-"+k).className = "stat "+(cls||""); tween($("sv-"+k), v, fmt); $("su-"+k).textContent = unit||""; $("ss-"+k).innerHTML = sub;
  if(bar!=null) $("sb-"+k).style.width = (Math.max(0,Math.min(1,bar))*100)+"%";
}
const R0 = v => Math.round(v);
function renderSummary(sim){
  const over = sim.total>365, months = sim.total/30.44, pct = Math.round(sim.inSeason*100);
  const wet = sim.cnt.W+sim.cnt.C, hot = sim.cnt.H, cold = sim.cnt.K, avg = sim.ride.length? sim.km/sim.ride.length : 0;
  const dirtKm = sim.ride.filter(d=>sim.legs[d.li].mode==="dirt").reduce((a,d)=>a+d.km,0);
  setTile("dur", sim.total, R0, "days", `${months.toFixed(1)} months · finish ${fmtD(sim.end)}${over?` · <b style="color:var(--bad)">${sim.total-365} over a year</b>`:""}`, over?"alert":"ok", sim.total/365);
  setTile("fit", pct, v=>R0(v)+"%", "", `${sim.cnt.D+sim.cnt.M} of ${sim.ride.length} riding days in the dry season`, pct>=75?"ok":pct<55?"alert":"", sim.inSeason);
  setTile("km", Math.round(sim.km), v=>fmtKm(v), "km", `${sim.ride.length} riding days · ${Math.round(avg)} km avg · ${sim.km? Math.round(dirtKm/sim.km*100):0}% dirt${sim.busKm?` · ${fmtKm(sim.busKm)} km by bus`:""}`);
  setTile("wet", wet, R0, "days", `${sim.cnt.W} wet · ${sim.cnt.C} winter`, wet>40?"alert":"");
  setTile("hot", hot+cold, R0, "days", `${hot} hot · ${cold} freezing nights`);
  setTile("off", sim.rest+sim.brk+sim.xfer, R0, "days", `${sim.rest} rest · ${sim.brk} breaks · ${sim.xfer} transit`);
}
function renderTripbar(sim){
  const r = routeOf(); $("tbRoute").textContent = tripName(r,S.dir);
  $("tbStart").textContent = `From ${fmtD(sim.t0)} · ${S.kmpd} km days`;
  tween($("tbDays"), sim.total, R0); tween($("tbFit"), Math.round(sim.inSeason*100), v=>R0(v)+"%");
  $("tbEnd").textContent = fmtD(sim.end);
  const over = sim.total>365, p = $("tbPill"); p.className = "pill "+(over?"bad":"good");
  p.querySelector(".pl").textContent = over? `${sim.total-365} days over a year` : "Inside 12 months";
  p.title = over? `${sim.total} days, over the 12-month cap` : `${sim.total} days, inside 12 months`;
}

/* ---------- start-date strip ---------- */
function fitColor(v){
  const stops=[[0,"#b8402b"],[.45,"#d98a2b"],[.65,"#d9c24f"],[.8,"#8cc271"],[1,"#2f8a4a"]];
  for(let i=1;i<stops.length;i++){ if(v<=stops[i][0]){ const a=stops[i-1],b=stops[i]; return d3.interpolateRgb(a[1],b[1])((v-a[0])/(b[0]-a[0])); } }
  return stops[stops.length-1][1];
}
let STRIP=[], stripJob=0, STRIP_CACHE={}, STRIP_STARTS=[], STRIP_BEST=null, rT=null;
function stripKey(y){ return JSON.stringify([S.route,S.dir,S.kmpd,S.rest,S.ramp,S.brk,S.breaks,S.dirtPref,S.auto?"auto":S.modes,y]); }
function renderStrip(){
  const y=yearOf(S.start), base=Date.UTC(y,0,1);
  STRIP_STARTS=[]; for(let w=0;w<53;w++){ const t=base+w*7*DAY; if(new Date(t).getUTCFullYear()!==y) break; STRIP_STARTS.push(t); }
  const key=stripKey(y);
  if(Object.keys(STRIP_CACHE).length>40) STRIP_CACHE={};
  const arr = STRIP_CACHE[key] || (STRIP_CACHE[key]=new Array(STRIP_STARTS.length).fill(null));
  const job=++stripJob; let i=0;
  const step=()=>{ if(job!==stripJob) return; const t1=performance.now();
    while(i<STRIP_STARTS.length && performance.now()-t1<22){ if(!arr[i]){ const p=Object.assign({},S,{start:isoD(STRIP_STARTS[i]),modes:Object.assign({},S.modes)}); if(S.auto) p.modes=optimize(p); const sim=simulate(p); arr[i]={fit:sim.inSeason,total:sim.total}; } i++; }
    drawStrip(arr, y); if(i<STRIP_STARTS.length) setTimeout(step,0); };
  step();
}
function drawStrip(arr, y){
  STRIP = STRIP_STARTS.map((t,i)=>Object.assign({t},arr[i]||{pending:true}));
  const el=$("strip");
  if(el.children.length!==STRIP.length) el.innerHTML = STRIP.map(()=>"<div></div>").join("");
  STRIP.forEach((s,i)=>{ const d=el.children[i];
    if(s.pending){ d.style.backgroundColor=""; d.className=""; d.title=""; }
    else { d.style.backgroundColor=fitColor(s.fit); d.className = s.total>365?"over":""; d.title=`${fmtD(s.t)} · ${Math.round(s.fit*100)}% in season · ${s.total} days`; } });
  if(!$("stripMonths").childElementCount) $("stripMonths").innerHTML = MON.map(m=>`<span>${m}</span>`).join("");
  $("stripYear").textContent = y;
  const done = STRIP.filter(s=>!s.pending).length;
  const ok = STRIP.filter(s=>!s.pending && s.total<=365).sort((a,b)=>b.fit-a.fit);
  STRIP_BEST = done===STRIP.length ? (ok[0]||null) : null;
  const bm=$("stripBest");
  if(STRIP_BEST){ const bi=STRIP.indexOf(STRIP_BEST); bm.hidden=false; bm.style.left=((bi+.5)/STRIP.length*100)+"%"; } else bm.hidden=true;
  $("useBest").disabled = !STRIP_BEST;
  $("useBest").textContent = STRIP_BEST ? `Start on the best week, ${fmtD(STRIP_BEST.t,false)}` : "Finding the best week…";
  drawStripCursor();
  if(done<STRIP.length){ $("stripText").innerHTML=`Scoring every start week for this route and pace… ${done} of ${STRIP.length}`; return; }
  let txt = STRIP_BEST ? `For this route and pace, the best start is around <b>${fmtD(STRIP_BEST.t,false)}</b>, with ${Math.round(STRIP_BEST.fit*100)}% of the route ridden in season over ${STRIP_BEST.total} days.` : `No start date in ${y} fits inside 12 months with these settings. Try a longer riding day or fewer breaks.`;
  txt += ` Your ${fmtD(parseD(S.start),false)} start scores <b>${Math.round(SIM.inSeason*100)}%</b>.`;
  txt += S.auto ? " Each week uses its own best mix of dirt, main roads and bus." : " Each week uses your current leg choices.";
  txt += " Drag along the strip to change your start.";
  $("stripText").innerHTML = txt;
  $("gradSw").style.background = `linear-gradient(90deg,${[0,.45,.65,.8,1].map(fitColor).join(",")})`;
}
function drawStripCursor(){
  const y=yearOf(S.start), base=Date.UTC(y,0,1), n=STRIP_STARTS.length||52;
  const ci=(parseD(S.start)-base)/DAY/7, f=Math.max(0,Math.min(1,(ci+.5)/n));
  const cur=$("stripCur"); cur.style.left=(f*100)+"%";
  const lab=cur.querySelector("span"); lab.textContent=`${fmtD(parseD(S.start),false)} · ${SIM?Math.round(SIM.inSeason*100):0}%`;
  lab.style.transform = `translateX(${f<.1?-12:f>.9?-88:-50}%)`;
  const el=$("strip"); el.setAttribute("aria-valuenow",Math.round(ci)); el.setAttribute("aria-valuetext",fmtD(parseD(S.start)));
}
function stripPick(ev){
  if(!STRIP.length) return;
  const r=$("strip").getBoundingClientRect(); const i=Math.max(0,Math.min(STRIP.length-1,Math.floor((ev.clientX-r.left)/r.width*STRIP.length)));
  const t=STRIP[i].t; if(isoD(t)!==S.start){ S.start=isoD(t); update({keepStrip:true}); }
}
function initStrip(){
  const el=$("strip"); let down=false;
  el.addEventListener("pointerdown",e=>{ down=true; try{ el.setPointerCapture(e.pointerId); }catch(_){} stripPick(e); });
  el.addEventListener("pointermove",e=>{ if(down) stripPick(e); });
  const up=()=>{ down=false; }; el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up);
  el.addEventListener("keydown",e=>{ const d=e.key==="ArrowRight"?7:e.key==="ArrowLeft"?-7:0; if(d){ e.preventDefault(); const t=parseD(S.start)+d*DAY; if(new Date(t).getUTCFullYear()===yearOf(S.start)){ S.start=isoD(t); update({keepStrip:true}); } } });
}

/* ---------- map ---------- */
const COUNTRY_REGION = {"484":"mexhigh","320":"guate","084":"belize","222":"elsal","340":"elsal","558":"nica","188":"cr","591":"pan","170":"colombia","862":"ven","218":"ecuador","604":"peru","068":"bolivia"};
const BANDS = [["puna",-17,-31.5],["lakes",-31.5,-43.6],["austral",-43.6,-49.3],["patagonia",-49.3,-60]];
const FEAT = GEO.map(g=>({type:"Feature",id:g.id,properties:{name:g.n},geometry:{type:g.t,coordinates:g.c}}));
FEAT.forEach(f=>{ f.bb=d3.geoBounds(f); });
let MAP={}, ZT=d3.zoomIdentity, MAPKEY="", MAPFULL=false, FOCUS_LI=null, FOLLOW=false, DAYPTS=[];
function routePts(sim){ const pts=[]; sim.legs.forEach(l=>{ if(l.type==="seg") pts.push(...l.L.pts); else { if(l.a) pts.push(l.a); if(l.b) pts.push(l.b);} }); return pts; }
function buildMapBase(sim, W, H){
  const pts=routePts(sim), lons=pts.map(p=>p[0]), lats=pts.map(p=>p[1]), pad=1.8;
  const bb={type:"MultiPoint",coordinates:[[d3.min(lons)-pad,d3.min(lats)-pad],[d3.max(lons)+pad,d3.max(lats)+pad]]};
  const top = W<420? 80 : 76;
  const proj=d3.geoMercator().fitExtent([[18,top],[W-62,H-18]],bb);
  const path=d3.geoPath(proj);
  const tl=proj.invert([-W*.4,-H*.4]), br=proj.invert([W*1.4,H*1.4]);
  const vx0=Math.min(tl[0],br[0]), vx1=Math.max(tl[0],br[0]), vy0=Math.min(tl[1],br[1]), vy1=Math.max(tl[1],br[1]);
  const vis = FEAT.filter(f=>{ const [[x0,y0],[x1,y1]]=f.bb; const lonOK = x0>x1 ? true : (x1>=vx0 && x0<=vx1); return lonOK && y1>=vy0 && y0<=vy1; });
  const svg=d3.create("svg").attr("viewBox",`0 0 ${W} ${H}`).attr("width",W).attr("height",H).attr("role","img").attr("aria-label","Map of the route across the Americas, coloured by season");
  const defs=svg.append("defs");
  const gZ=svg.append("g").attr("class","zl");
  gZ.append("path").attr("class","grat").attr("d",path(d3.geoGraticule().step([10,10])()));
  const gL=gZ.append("g");
  vis.forEach(f=>gL.append("path").attr("class","land").attr("data-id",f.id).attr("d",path(f)));
  BANDS.forEach(([rid,la1,la2])=>{ const y1=proj([-70,la1])[1], y2=proj([-70,la2])[1]; defs.append("clipPath").attr("id","band-"+rid).append("rect").attr("x",-W).attr("width",W*3).attr("y",y1).attr("height",Math.max(0,y2-y1)); });
  const gB=gZ.append("g").attr("id","bands");
  BANDS.forEach(([rid])=>{ const g=gB.append("g").attr("clip-path",`url(#band-${rid})`).attr("data-region",rid); vis.filter(f=>f.id==="152"||f.id==="032").forEach(f=>g.append("path").attr("class","land tint").attr("d",path(f))); });
  const gR=gZ.append("g");
  /* ghost lines are drawn in drawRoute, since a leg's line can change with its mode */
  const gK=gZ.append("g").attr("id","casing");
  const gD=gZ.append("g").attr("id","days");
  const gO=svg.append("g").attr("id","overlay");
  const gC=gO.append("g").attr("id","cities");
  const gRi=gO.append("g").attr("id","rider");
  gRi.append("circle").attr("class","rider-halo").attr("r",15);
  gRi.append("circle").attr("class","rider-pulse").attr("r",9);
  gRi.append("circle").attr("class","rider").attr("r",7);
  const zoom=d3.zoom().scaleExtent([1,16]).extent([[0,0],[W,H]]).translateExtent([[-W*.3,-H*.3],[W*1.3,H*1.3]])
    .filter(ev=>{ if(ev.type==="wheel") return MAPFULL || ev.ctrlKey || ev.metaKey; if(ev.type.startsWith("touch")) return MAPFULL; return !ev.button; })
    .on("zoom",ev=>{ ZT=ev.transform; gZ.attr("transform",ZT); placeOverlay(); hideTip(); if(ev.sourceEvent && FOLLOW && ev.sourceEvent.type!=="wheel"){ /* manual pan stops follow */ FOLLOW=false; $("follow").setAttribute("aria-pressed","false"); } });
  svg.call(zoom).on("dblclick.zoom", function(ev){ const p=d3.pointer(ev,this); svg.transition().duration(REDUCE?0:300).call(zoom.scaleBy,1.8,p); });
  const node=svg.node();
  node.addEventListener("wheel",e=>{ if(!MAPFULL && !e.ctrlKey && !e.metaKey) showHint("Hold Ctrl and scroll to zoom, or open the full screen map"); },{passive:true});
  node.addEventListener("touchstart",e=>{ if(!MAPFULL && e.touches.length>1) showHint("Tap the full screen button to pinch and pan"); },{passive:true});
  node.addEventListener("click",e=>{ const p=d3.pointer(e,node); const d=nearestDay(p, FINE?16:28); if(d){ SEL=d.i; $("day").value=SEL; setFill($("day")); drawSel(); } });
  if(FINE){ node.addEventListener("pointermove",e=>{ if(e.buttons) return; const p=d3.pointer(e,node); const d=nearestDay(p,14); if(d) showTip(d,p); else hideTip(); }); node.addEventListener("pointerleave",hideTip); }
  MAP={svg,node,proj,path,W,H,gZ,gR,gK,gD,gC,gRi,zoom};
  const box=$("map"); box.innerHTML=""; box.appendChild(node);
}
function drawRoute(sim){
  const {gR,gK,gD,gC,proj,path,W}=MAP; gR.selectAll("*").remove(); gK.selectAll("*").remove();
  sim.legs.forEach(l=>{ if(l.type==="seg") gR.append("path").attr("class","ghost").attr("d",path({type:"LineString",coordinates:l.L.pts})); else if(l.a&&l.b&&(l.a[0]!==l.b[0]||l.a[1]!==l.b[1])) gR.append("path").attr("class","xfer").attr("d",path({type:"LineString",coordinates:[l.a,l.b]})); });
  gD.selectAll("*").remove(); gC.selectAll("*").remove();
  sim.legs.forEach((l,li)=>{ if(l.type==="seg") gK.append("path").attr("class","rcase"+(l.mode==="bus"?" bus":l.mode==="paved"?" paved":"")).attr("data-li",li).attr("d",path({type:"LineString",coordinates:l.L.pts})); });
  const prevF={}; DAYPTS=[];
  sim.days.forEach(d=>{
    const l=sim.legs[d.li]; if(l.type!=="seg"){ return; }
    const xy=proj(dayPoint(sim,d)); if(d.type==="ride"||d.type==="bus") DAYPTS.push({i:d.i,xy});
    if(d.type!=="ride" && d.type!=="bus") return;
    const f0=prevF[d.li]??0; prevF[d.li]=d.frac;
    gD.append("path").attr("class",`rday s-${d.code}${d.type==="bus"?" bus":l.mode==="paved"?" paved":""}`).attr("data-i",d.i).attr("data-li",d.li).attr("d",path({type:"LineString",coordinates:pointsBetween(l.L,f0,d.frac)}));
  });
  const r=routeOf(), cities=[], l0=sim.legs[0], lastLeg=sim.legs[sim.legs.length-1];
  cities.push({p:l0.type==="seg"?l0.L.pts[0]:l0.a, n:S.dir==="S"?r.a:r.b, big:true});
  cities.push({p:lastLeg.type==="seg"?lastLeg.L.pts[lastLeg.L.pts.length-1]:lastLeg.b, n:S.dir==="S"?r.b:r.a, big:true});
  sim.legs.forEach(l=>{ if(l.type==="seg" && S.breaks[l.seg.id] && l.days.some(d=>d.type==="break")) cities.push({p:l.stayPt, n:legEndCity(l)}); });
  MAP.cities = cities.map(c=>{ const xy=proj(c.p); const g=gC.append("g"); g.append("circle").attr("class","city"+(c.big?" big":"")).attr("r",c.big?6:4); const left = xy[0]>W*.6; g.append("text").attr("class","city-l").attr("x",left?-9:9).attr("y",4).attr("text-anchor",left?"end":"start").style("font-size",c.big?"13px":"11px").text(c.n); return {xy,g}; });
  placeOverlay();
}
function placeOverlay(){ if(!MAP.cities) return; MAP.cities.forEach(c=>{ const [x,y]=ZT.apply(c.xy); c.g.attr("transform",`translate(${x},${y})`); }); placeRider(); }
function placeRider(){ if(!SIM||!MAP.proj) return; const d=SIM.days[Math.min(SEL,SIM.days.length-1)]; const [x,y]=ZT.apply(MAP.proj(dayPoint(SIM,d))); MAP.gRi.attr("transform",`translate(${x},${y})`); }
function nearestDay(p, tol){ const q=ZT.invert(p); let best=null, bd=(tol/ZT.k)**2; for(const d of DAYPTS){ const dx=d.xy[0]-q[0], dy=d.xy[1]-q[1], dd=dx*dx+dy*dy; if(dd<bd){ bd=dd; best=d; } } return best; }
function showTip(dp,p){ const d=SIM.days[dp.i], l=SIM.legs[d.li], tip=$("mapTip"); const R=d.region?REGIONS[d.region]:null; tip.innerHTML=`<b>Day ${d.i+1} · ${fmtD(d.t)}</b><br>${R?`${CODES[d.code].label} · ${R.name}`:legName(l,S.dir)}`; tip.style.left=p[0]+"px"; tip.style.top=p[1]+"px"; tip.hidden=false; }
function hideTip(){ const t=$("mapTip"); if(t) t.hidden=true; }
function renderMap(sim, reset){
  const mb=$("mapBox"); const W=Math.max(260, Math.round(mb.clientWidth)), H=Math.max(300, Math.round(mb.clientHeight));
  const key=[S.route,S.dir,W,H].join("|");
  if(key!==MAPKEY){ buildMapBase(sim,W,H); MAPKEY=key; reset=true; }
  drawRoute(sim);
  if(reset){ FOCUS_LI=null; ZT=d3.zoomIdentity; MAP.svg.call(MAP.zoom.transform, d3.zoomIdentity); }
}
function dayPoint(sim,d){ const l=sim.legs[d.li]; if(l.type==="seg") return pointAt(l.L,d.frac); return [l.a[0]+(l.b[0]-l.a[0])*d.frac, l.a[1]+(l.b[1]-l.a[1])*d.frac]; }
function zoomTo(t, ms){ MAP.svg.transition().duration(REDUCE?0:(ms??450)).call(MAP.zoom.transform, t); }
function zoomFit(){ FOCUS_LI=null; zoomTo(d3.zoomIdentity); drawSel(); }
function zoomToLeg(li){
  const l=SIM.legs[li]; if(!l || l.type!=="seg") return; const xs=l.L.pts.map(p=>MAP.proj(p));
  const x0=d3.min(xs,p=>p[0]), x1=d3.max(xs,p=>p[0]), y0=d3.min(xs,p=>p[1]), y1=d3.max(xs,p=>p[1]);
  const k=Math.max(1,Math.min(16,.8/Math.max((x1-x0+1)/MAP.W,(y1-y0+1)/MAP.H)));
  FOLLOW=false; $("follow").setAttribute("aria-pressed","false"); FOCUS_LI=li;
  zoomTo(d3.zoomIdentity.translate(MAP.W/2-k*(x0+x1)/2, MAP.H/2-k*(y0+y1)/2).scale(k), 650);
  drawSel();
}
function followRider(){ const d=SIM.days[SEL]; const [x,y]=MAP.proj(dayPoint(SIM,d)); const k=Math.max(ZT.k,3.2); MAP.svg.call(MAP.zoom.transform, d3.zoomIdentity.translate(MAP.W/2-k*x, MAP.H/2-k*y).scale(k)); }
function setFull(on){
  MAPFULL=on; $("s-map").classList.toggle("full",on); document.documentElement.classList.toggle("noscroll",on);
  $("zFull").setAttribute("aria-pressed",on); $("zFull").setAttribute("aria-label", on?"Close full screen map":"Full screen map");
  MAPKEY=""; renderMap(SIM,true); drawSel();
  if(on) showHint(FINE? "Scroll to zoom, drag to pan, Esc to close" : "Pinch to zoom, drag to pan");
}
function initMapTools(){
  $("zIn").onclick=()=>MAP.svg.transition().duration(REDUCE?0:250).call(MAP.zoom.scaleBy,1.7);
  $("zOut").onclick=()=>MAP.svg.transition().duration(REDUCE?0:250).call(MAP.zoom.scaleBy,1/1.7);
  $("zFit").onclick=()=>{ FOLLOW=false; $("follow").setAttribute("aria-pressed","false"); zoomFit(); };
  $("zFull").onclick=()=>setFull(!MAPFULL);
  document.addEventListener("keydown",e=>{ if(e.key==="Escape" && MAPFULL) setFull(false); });
}

/* ---------- weather chart ---------- */
let CH={}, chDown=false;
window.addEventListener("pointerup",()=>{ chDown=false; });
function renderChart(sim){
  const box=$("chart"); const W=Math.max(280, box.clientWidth||600); const small=W<520;
  const H=small?240:290; const m={l:small?30:38,r:small?32:40,t:22,b:46};
  const x=d3.scaleLinear().domain([0,sim.total]).range([m.l,W-m.r]);
  const yR=d3.scaleLinear().domain([0,340]).range([H-m.b,m.t]).clamp(true);
  const yT=d3.scaleLinear().domain([-20,40]).range([H-m.b,m.t]);
  CH={x,W,H,m};
  const svg=d3.create("svg").attr("viewBox",`0 0 ${W} ${H}`).attr("role","img").attr("aria-label","Rain and temperature for each day of the trip");
  const gM=svg.append("g").attr("class","axis");
  const d0=new Date(sim.t0); let t=Date.UTC(d0.getUTCFullYear(),d0.getUTCMonth()+1,1);
  const every = small && sim.total>240 ? 2 : 1; let k=0;
  while(t<=sim.end){ const i=(t-sim.t0)/DAY; gM.append("line").attr("class","gridl").attr("x1",x(i)).attr("x2",x(i)).attr("y1",m.t-6).attr("y2",H-m.b); if(k++%every===0){ const dd=new Date(t); gM.append("text").attr("x",x(i)+3).attr("y",m.t-8).text(MON[dd.getUTCMonth()]+(dd.getUTCMonth()===0?" "+String(dd.getUTCFullYear()).slice(2):"")); } t=Date.UTC(new Date(t).getUTCFullYear(),new Date(t).getUTCMonth()+1,1); }
  const gy=svg.append("g").attr("class","axis");
  [0,100,200,300].forEach(v=>gy.append("text").attr("x",m.l-4).attr("y",yR(v)+3).attr("text-anchor","end").text(v));
  gy.append("text").attr("x",m.l-4).attr("y",H-m.b+14).attr("text-anchor","end").text("mm");
  [-20,-10,0,10,20,30,40].forEach(v=>gy.append("text").attr("x",W-m.r+4).attr("y",yT(v)+3).text(v+"°"));
  gy.append("line").attr("class","gridl").attr("x1",m.l).attr("x2",W-m.r).attr("y1",yT(0)).attr("y2",yT(0)).style("stroke-dasharray","1 0").style("opacity",.8);
  const bw=Math.max(.5,(W-m.l-m.r)/sim.total), gBars=svg.append("g");
  sim.days.forEach(d=>{ if(!d.region){ gBars.append("rect").attr("class","f-T").attr("x",x(d.i)).attr("width",bw+.3).attr("y",H-m.b-4).attr("height",4); return; }
    const R=REGIONS[d.region], mo=monthOf(d.t), v=Math.max(3,R.rain[mo]);
    gBars.append("rect").attr("class","f-"+d.code).attr("x",x(d.i)).attr("width",bw+.3).attr("y",yR(v)).attr("height",H-m.b-yR(v)).attr("opacity",d.type==="ride"?.9:.4); });
  const hi=[],lo=[]; sim.days.forEach(d=>{ if(!d.region) return; const R=REGIONS[d.region], mo=monthOf(d.t); hi.push([x(d.i+.5),yT(R.hi[mo])]); lo.push([x(d.i+.5),yT(R.lo[mo])]); });
  const line=d3.line().curve(d3.curveMonotoneX);
  svg.append("path").attr("d",line(hi)).attr("fill","none").style("stroke","var(--c-H)").attr("stroke-width",2.4);
  svg.append("path").attr("d",line(lo)).attr("fill","none").style("stroke","var(--c-K)").attr("stroke-width",2.4);
  svg.append("path").attr("d",line(hi)).attr("fill","none").style("stroke","var(--ink)").attr("stroke-width",.6).attr("opacity",.45);
  const gLg=svg.append("g");
  const SHORT={"El Salvador":"ES/HN","Costa Rica":"CR","Guatemala":"GT","Nicaragua":"NI","Panama":"PA","Mexico":"MX","Colombia":"CO","Ecuador":"EC","Peru":"PE","Bolivia":"BO","Chile":"CL","Argentina":"AR"};
  sim.legs.forEach((l,i)=>{ const x0=x(l.startDay), x1=x(l.endDay+1); gLg.append("rect").attr("x",x0).attr("width",Math.max(0,x1-x0-1)).attr("y",H-m.b+6).attr("height",16).attr("rx",3).style("fill", i%2?"var(--sunk)":"var(--rule)");
    const nm = l.type==="xfer" ? "" : l.seg.country.split(" / ")[0]; const label = (x1-x0) > nm.length*6.2 ? nm : ((x1-x0)>18? (SHORT[nm]||nm) : "");
    if(label) gLg.append("text").attr("class","lbl-s").attr("x",(x0+x1)/2).attr("y",H-m.b+18).attr("text-anchor","middle").text(label); });
  gLg.append("text").attr("class","lbl-s").attr("x",m.l).attr("y",H-6).text("Day 1");
  gLg.append("text").attr("class","lbl-s").attr("x",W-m.r).attr("y",H-6).attr("text-anchor","end").text("Day "+sim.total);
  if(sim.total>365){ const xx=x(365); svg.append("line").attr("x1",xx).attr("x2",xx).attr("y1",m.t).attr("y2",H-m.b).style("stroke","var(--bad)").attr("stroke-width",2).attr("stroke-dasharray","4 3"); svg.append("text").attr("x",xx-4).attr("y",m.t+12).attr("text-anchor","end").style("fill","var(--bad)").style("font","700 11px var(--f-mono)").text("1 year"); }
  svg.append("line").attr("id","scrub").attr("class","scrubline").attr("y1",m.t-4).attr("y2",H-m.b+22);
  svg.append("circle").attr("id","scrubHi").attr("r",4).style("fill","var(--c-H)").style("stroke","var(--surface)").attr("stroke-width",2);
  svg.append("circle").attr("id","scrubLo").attr("r",4).style("fill","var(--c-K)").style("stroke","var(--surface)").attr("stroke-width",2);
  box.innerHTML=""; box.appendChild(svg.node());
  const node=svg.node();
  const pick=e=>{ const r=node.getBoundingClientRect(); const px=(e.clientX-r.left)/r.width*W; SEL=Math.max(0,Math.min(sim.total-1,Math.floor(x.invert(px)))); $("day").value=SEL; setFill($("day")); drawSel(); };
  node.addEventListener("pointerdown",e=>{ chDown=true; pick(e); });
  node.addEventListener("pointermove",e=>{ if(chDown || e.pointerType==="mouse") pick(e); });
  $("legend").innerHTML = CODE_ORDER.map(c=>`<span><i class="sw bg-${c}"></i>${CODES[c].short}</span>`).join("") + `<span><i class="sw" style="background:var(--c-H);height:3px"></i>Day high</span><span><i class="sw" style="background:var(--c-K);height:3px"></i>Night low</span><span><i class="sw bg-T"></i>Transit</span>`;
}

/* ---------- how long ---------- */
function neededPace(targetDays){
  const base=Object.assign({},S,{modes:Object.assign({},S.modes)});
  const tot=k=>{ base.kmpd=k; return simulate(base).total; };
  if(tot(400)>targetDays) return null;
  let lo=20, hi=400; if(tot(lo)<=targetDays) return lo;
  for(let it=0;it<14;it++){ const mid=(lo+hi)/2; if(tot(mid)<=targetDays) hi=mid; else lo=mid; }
  return hi;
}
function renderLength(sim){
  const box=$("lenChart"); const W=Math.max(280, box.clientWidth||560), small=W<480, H=small?190:210;
  const M=[6,7,8,9,10,11,12], need=M.map(n=>({n, v:neededPace(Math.floor(n*30.44))}));
  const m={l:small?30:36,r:12,t:22,b:30};
  const ymax=Math.max(180, S.kmpd+20, ...need.map(d=>d.v?Math.min(d.v,320):0))*1.08;
  const x=d3.scaleBand().domain(M).range([m.l,W-m.r]).padding(.28), y=d3.scaleLinear().domain([0,ymax]).range([H-m.b,m.t]);
  const svg=d3.create("svg").attr("viewBox",`0 0 ${W} ${H}`).attr("role","img").attr("aria-label","Daily distance needed for each trip length");
  const ga=svg.append("g").attr("class","axis");
  y.ticks(4).forEach(v=>{ ga.append("line").attr("class","gridl").attr("x1",m.l).attr("x2",W-m.r).attr("y1",y(v)).attr("y2",y(v)); ga.append("text").attr("x",m.l-5).attr("y",y(v)+3).attr("text-anchor","end").text(v); });
  ga.append("text").attr("x",2).attr("y",m.t-9).attr("text-anchor","start").text("km a day");
  need.forEach(d=>{
    const g=svg.append("g").attr("class","lenbar").attr("tabindex",0).attr("role","button").attr("aria-label",d.v?`${d.n} months: about ${Math.round(d.v)} km per riding day`:`${d.n} months: not possible with these breaks`);
    const col = d.v==null? "var(--bad)" : d.v<=S.kmpd+.5 ? "var(--good)" : d.v<=160 ? "var(--warn)" : "var(--bad)";
    const v = d.v==null? ymax*.97 : Math.min(d.v, ymax*.97);
    g.append("rect").attr("x",x(d.n)).attr("width",x.bandwidth()).attr("y",y(v)).attr("height",H-m.b-y(v)).attr("rx",5).style("fill",col).attr("opacity",d.v==null?.35:.88);
    g.append("text").attr("class","len-lbl").attr("x",x(d.n)+x.bandwidth()/2).attr("y",y(v)-5).attr("text-anchor","middle").text(d.v==null?"n/a":d.v>ymax*.97?Math.round(d.v)+"+":Math.round(d.v));
    svg.append("text").attr("class","len-x").attr("x",x(d.n)+x.bandwidth()/2).attr("y",H-m.b+16).attr("text-anchor","middle").text(d.n+" mo");
    const go=()=>{ if(d.v==null) return; if(d.v>170){ $("lenText").innerHTML=`Finishing in ${d.n} months needs about <b>${Math.round(d.v)} km</b> every riding day, which is past the slider's 170 km. Take fewer breaks or ride a shorter route instead.`; return; } S.kmpd=Math.max(50,Math.min(170,Math.ceil(d.v/5)*5)); update(); };
    g.on("click",go).on("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } });
  });
  const ref=(v,cls,label,dash)=>{ if(v>ymax) return; svg.append("line").attr("x1",m.l).attr("x2",W-m.r).attr("y1",y(v)).attr("y2",y(v)).style("stroke",cls).attr("stroke-width",2).attr("stroke-dasharray",dash||null); svg.append("text").attr("x",W-m.r).attr("y",y(v)-5).attr("text-anchor","end").style("fill",cls).style("font","700 11px var(--f-mono)").text(label); };
  ref(160,"var(--ink-3)","Your peak 160","5 4"); ref(S.kmpd,"var(--accent)",`Your pace ${S.kmpd}`);
  const mo=sim.total/30.44, cx=n=>x(n)+x.bandwidth()/2, f=Math.max(6,Math.min(12,mo)), xi=cx(6)+(cx(12)-cx(6))*(f-6)/6;
  svg.append("path").attr("d",`M${xi-6},${H-m.b+2}L${xi+6},${H-m.b+2}L${xi},${H-m.b-7}z`).style("fill","var(--ink)");
  box.innerHTML=""; box.appendChild(svg.node());
  const shortest = need.find(d=>d.v!=null && d.v<=160);
  let txt=`At <b>${S.kmpd} km</b> a riding day this plan takes <b>${sim.total} days</b> (${mo.toFixed(1)} months, marked ▲).`;
  txt += shortest ? ` Within your 160 km peak, the shortest version is about <b>${shortest.n} months</b> at ${Math.round(shortest.v)} km a day.` : " Even at 160 km a day it would not fit in 12 months; drop some breaks or bus a leg.";
  $("lenText").innerHTML = txt;
}

/* ---------- selected day ---------- */
function drawSel(forceFollow){
  const sim=SIM; if(!sim || !MAP.svg) return; const d=sim.days[Math.min(SEL,sim.days.length-1)];
  if(FOLLOW && (playing || forceFollow)) followRider();
  placeRider();
  MAP.gZ.selectAll("path.land[data-id]").each(function(){ const rid=COUNTRY_REGION[this.getAttribute("data-id")]; this.setAttribute("class", rid? `land tint f-${codeFor(rid,d.t)}` : "land"); });
  MAP.gZ.selectAll("#bands > g").each(function(){ const c=codeFor(this.getAttribute("data-region"),d.t); d3.select(this).selectAll("path").attr("class",`land tint f-${c}`); });
  MAP.gK.selectAll("path.rcase").attr("opacity",function(){ return FOCUS_LI!=null && +this.getAttribute("data-li")!==FOCUS_LI ? .2 : null; });
  MAP.gD.selectAll("path.rday").attr("opacity",function(){ const i=+this.getAttribute("data-i"), li=+this.getAttribute("data-li"); if(FOCUS_LI!=null && li!==FOCUS_LI) return .14; return i<=d.i?1:.38; });
  if(CH.x){ const xx=CH.x(d.i+.5); d3.select("#scrub").attr("x1",xx).attr("x2",xx);
    if(d.region){ const R=REGIONS[d.region], mo=monthOf(d.t), yT=d3.scaleLinear().domain([-20,40]).range([CH.H-CH.m.b,CH.m.t]); d3.select("#scrubHi").attr("cx",xx).attr("cy",yT(R.hi[mo])).attr("opacity",1); d3.select("#scrubLo").attr("cx",xx).attr("cy",yT(R.lo[mo])).attr("opacity",1); }
    else { d3.select("#scrubHi").attr("opacity",0); d3.select("#scrubLo").attr("opacity",0); } }
  const l=sim.legs[d.li];
  const what={ride:"Riding",rest:"Rest day",break:"Long break",xfer:"In transit",bus:"On the bus"}[d.type];
  let line3="", cap="";
  if(d.region){ const R=REGIONS[d.region], mo=monthOf(d.t), lat=dayPoint(sim,d)[1], humid=R.hi[mo]>=30 && R.rain[mo]>=90, dl=daylight(lat,d.t).toFixed(1);
    line3=`${R.name} · <b>${CODES[d.code].label}</b> · ${R.hi[mo]}° / ${R.lo[mo]}° · ~${R.rain[mo]} mm in ${MON[mo]} · ${dl} h daylight${humid?" · hot and humid":""}`;
    cap=`<i class="dot bg-${d.code}"></i><span><b>Day ${d.i+1} · ${fmtD(d.t)}</b> · ${R.name} · ${CODES[d.code].label} · ${R.hi[mo]}° / ${R.lo[mo]}° · ~${R.rain[mo]} mm${humid?" · hot and humid":""}</span>`; }
  else { line3=l.t.note; cap=`<i class="dot bg-T"></i><span><b>Day ${d.i+1} · ${fmtD(d.t)}</b> · ${legName(l,S.dir)}</span>`; }
  const badge = d.region? CODES[d.code].short : "Transit";
  $("readout").innerHTML=`<span class="badge bg-${d.region?d.code:"T"}">${badge}</span><span class="t">Day ${d.i+1} of ${sim.total} · ${fmtD(d.t)}</span><span class="d">${what}${d.type==="ride"?" <b>"+Math.round(d.km)+" km</b>":""} · ${legName(l,S.dir)} · ${fmtKm(d.cum)} km so far</span><span class="d">${line3}</span>`;
  $("chartCap").innerHTML = cap;
  document.querySelectorAll(".leg").forEach(e=>e.classList.toggle("sel", +e.dataset.li===d.li));
}
const SPEEDS=[{l:"1×",ms:80},{l:"2×",ms:40},{l:"4×",ms:16}]; let SPEED=1, playing=null;
function togglePlay(){
  if(playing){ cancelAnimationFrame(playing); playing=null; $("playIcon").innerHTML='<path d="M7 4l13 8-13 8z"/>'; $("play").setAttribute("aria-label","Play the trip"); return; }
  if(SEL>=SIM.total-1) SEL=0;
  $("playIcon").innerHTML='<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>'; $("play").setAttribute("aria-label","Pause");
  let last=0; const step=t=>{ const ms=REDUCE?140:SPEEDS[SPEED].ms; if(t-last>ms){ last=t; SEL+=REDUCE?7:1; if(SEL>=SIM.total-1){ SEL=SIM.total-1; $("day").value=SEL; setFill($("day")); drawSel(); togglePlay(); return; } $("day").value=SEL; setFill($("day")); drawSel(); } if(playing) playing=requestAnimationFrame(step); };
  playing=requestAnimationFrame(step);
}

/* ---------- tight spots ---------- */
function monthsSpan(days){ if(!days.length) return ""; const a=monthOf(days[0].t), b=monthOf(days[days.length-1].t); return a===b?MON[a]:MON[a]+"–"+MON[b]; }
function renderFlags(sim){
  let F=[]; const WETS=[];
  if(sim.total>365) F.push(["bad","Too long",`The plan takes <b>${sim.total} days</b>, ${sim.total-365} over a year. Turn on <b>Auto-pick each leg</b>, raise your daily distance or take fewer breaks.`]);
  sim.legs.forEach(l=>{
    if(l.type==="xfer"){ if(l.t.months){ const d=l.days[0]; if(d && !l.t.months.includes(monthOf(d.t))) F.push(["bad","Boat closed",`You reach the <b>Lago O'Higgins crossing</b> in ${MON[monthOf(d.t)]}. The boats run Nov to Apr, so plan to loop back through Argentina on Ruta 40 instead.`]); else if(d && monthOf(d.t)===3) F.push(["warn","Last boats",`You reach the <b>Lago O'Higgins crossing</b> in April, at the end of the boat season. The Lago del Desierto boat runs until 15 April.`]); } return; }
    if(l.seg.risk){ const bus=l.mode==="bus", why=l.seg.risk.replace(/ Auto-pick[^.]*\./,""); F.push([bus?"info":"bad","Safety",`<b>${l.seg.name}</b>: ${bus?"on the bus. ":""}${why}${bus?"":" Check current advice, or take the bus."}`]); }
    const n=l.ride.length; if(!n) return;
    const wet=l.cnt.W+l.cnt.C, hot=l.cnt.H, frz=l.cnt.K, nm=`<b>${l.seg.name}</b> (${monthsSpan(l.ride)})`;
    if(wet/n>=.5){ const f=["bad", l.cnt.C>l.cnt.W?"Winter":"Wet", `${nm}: ${wet} of ${n} riding days fall in ${l.cnt.C>l.cnt.W?"winter":"the wet season"}. ${l.mode==="dirt"?(l.seg.named||l.seg.noPaved?"Consider the bus for this leg, or another start date.":"Consider the main road or the bus for this leg."):""}`]; f.short=`${nm} ${wet}/${n}`; f.kind=f[1]; WETS.push(f); F.push(f); }
    else if(wet/n>=.2) F.push(["warn","Partly wet",`${nm}: ${wet} of ${n} riding days in ${l.cnt.C>l.cnt.W?"cold":"wet"} months, at the edge of the season.`]);
    if(hot/n>=.5) F.push(["warn","Heat",`${nm}: mostly in the hot dry months. Ride from first light and rest through the middle of the day.`]);
    if(frz>0 || (["perudiv","bolivia"].includes(l.seg.id) && l.ride.some(d=>REGIONS[d.region].lo[monthOf(d.t)]<=-5))) F.push(["warn","Cold nights",`${nm}: camp nights around ${Math.min(...l.ride.map(d=>REGIONS[d.region].lo[monthOf(d.t)]))}°C. Bring a −10°C sleeping bag and a stove that works at altitude.`]);
    if(l.seg.hwy && l.mode==="paved") F.push(["warn","Main road",`${nm}: ${l.seg.hwy} The bus is a fair option here.`]);
    if(l.seg.named && l.mode==="paved") F.push(["warn","Main road",`${nm}: this is a mapped dirt route, and the main-road version misses most of it.`]);
    if(l.seg.id==="colandes" && l.ride.some(d=>d.code==="M")) F.push(["info","Mini dry",`${nm}: you are using Colombia's shorter Jun to Aug dry spell. It is less reliable than Dec to Mar, so expect some showers.`]);
    if(l.seg.id==="patagonia" && S.dir==="N") F.push(["warn","Headwind",`${nm}: northbound means riding into the westerlies on the stretches that head west, toward El Calafate and El Chaltén.`]);
    if(l.seg.id==="bolivia" && l.ride.some(d=>[0,1,2].includes(monthOf(d.t)))) F.push(["bad","Salar flooded",`${nm}: Jan to Mar the Salar de Uyuni is usually flooded and the Lagunas tracks turn to mud.`]);
  });
  if(WETS.length>3){ const at=F.indexOf(WETS[0]); F=F.filter(f=>!WETS.includes(f)); const kinds=[...new Set(WETS.map(w=>w.kind.toLowerCase()))].join(" or "); F.splice(Math.max(0,at),0,["bad",`${WETS.length} legs`,`${WETS.length} legs are mostly ridden in the ${kinds} season (riding days out of season shown): ${WETS.map(w=>w.short).join(", ")}. Try another start date, or turn on <b>Auto-pick each leg</b>.`]); }
  const fin=sim.legs[sim.legs.length-1], finM=monthOf(sim.end);
  if(fin.type==="seg" && fin.seg.region==="patagonia" && [4,5,6,7,8].includes(finM)) F.push(["bad","Late finish",`You reach Ushuaia in ${MON[finM]}, in the southern winter. Start earlier or shorten the plan.`]);
  if(S.ramp) F.push(["info","Fitness","Pace starts at 65% for the first two weeks and builds to full by about week six."]);
  if(sim.legs.some(l=>l.type==="xfer"&&l.t.id==="darien")) F.push(["info","Darién Gap",TRANSFERS.pan.note]);
  if(!F.some(f=>f[0]==="bad")) F.unshift(["good","Looks good",`No leg is mostly in its wet or winter season. ${Math.round(sim.inSeason*100)}% of the route is ridden in season.`]);
  $("flags").innerHTML=F.map(f=>`<li class="${f[0]}"><span class="tag">${f[1]}</span><span>${f[2]}</span></li>`).join("");
  const nb=F.filter(f=>f[0]==="bad").length, nw=F.filter(f=>f[0]==="warn").length;
  $("flagCount").textContent=`${nb} serious · ${nw} to watch`;
}

/* ---------- season chart ---------- */
function renderSeason(sim){
  const regs=[]; sim.legs.forEach(l=>{ if(l.type==="seg" && !regs.includes(l.seg.region)) regs.push(l.seg.region); });
  if(!regs.includes("belize") && regs.includes("guate")) regs.splice(regs.indexOf("guate")+1,0,"belize");
  const d0=new Date(sim.t0); const months=[]; let y=d0.getUTCFullYear(), mo=d0.getUTCMonth();
  while(Date.UTC(y,mo,1)<=sim.end || months.length<12){ months.push([y,mo]); mo++; if(mo>11){mo=0;y++;} if(months.length>26) break; }
  const used={}; sim.days.forEach(d=>{ if(!d.region) return; const dt=new Date(d.t); const k=d.region+"|"+dt.getUTCFullYear()+"|"+dt.getUTCMonth(); used[k]=(used[k]||0)+1; });
  let h="<thead><tr><th class='rh'></th>"+months.map(([yy,mm])=>`<th class="${mm===0?"yr":""}">${MON[mm]}${mm===0||months[0][0]===yy&&months[0][1]===mm?"<br>"+yy:""}</th>`).join("")+"</tr></thead><tbody>";
  regs.forEach(r=>{ const R=REGIONS[r]; h+=`<tr><th class="rh" scope="row">${R.name}</th>`+months.map(([yy,mm])=>{ const c=R.codes[mm], n=used[r+"|"+yy+"|"+mm]; return `<td class="bg-${c}${n?" on":""}" title="${R.name}, ${MON[mm]} ${yy}: ${CODES[c].label}${n?` · you are here ${n} days`:""}">${n||""}</td>`; }).join("")+"</tr>"; });
  $("mx").innerHTML=h+"</tbody>";
}

/* ---------- legs ---------- */
const OPEN=new Set(); let FOCUS_AFTER=null;
function renderLegs(sim){
  const el=$("legs"); let segN=0, html="";
  sim.legs.forEach((l,li)=>{
    const a=l.days[0], b=l.days[l.days.length-1], when = a? `${fmtD(a.t,false)} – ${fmtD(b.t)}` : "";
    if(l.type==="xfer"){ html+=`<article class="leg xfer-leg" data-li="${li}"><div class="leg-head"><span class="n" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h16l-2.6 4.5H6.6z"/><path d="M7 14V9h7.5l3 5"/><path d="M10 9V6h3"/><path d="M2 21.5c1.7 0 1.7-1 3.3-1s1.7 1 3.4 1 1.6-1 3.3-1 1.7 1 3.3 1 1.7-1 3.4-1 1.6 1 3.3 1"/></svg></span><span class="tt"><b>${legName(l,S.dir)}</b><span>${when}</span></span><span class="rt"><b>${l.days.length}</b><span class="mtag">days</span></span></div><div class="leg-body" style="border-top:0;padding-top:0"><p class="note">${l.t.note}</p></div></article>`; return; }
    segN++;
    const s=l.seg, mode=l.mode, rideD=mode==="bus"? l.days.filter(d=>d.type==="bus").length : l.ride.length, off=l.days.length-rideD, km = mode==="bus"? s.pkm : l.km, pace = rideD? Math.round(l.km/rideD) : 0, fit = l.fit==null? "–" : Math.round(l.fit*100)+"%";
    const open=OPEN.has(s.id), id="lb-"+s.id, isLast = li===sim.legs.length-1;
    const mini=l.days.map(d=>`<i class="bg-${d.code}${d.type!=="ride"?" rest":""}"></i>`).join("");
    html+=`<article class="leg" data-li="${li}" data-seg="${s.id}">
      <button type="button" class="leg-head" aria-expanded="${open}" aria-controls="${id}">
        <span class="n">${String(segN).padStart(2,"0")}</span>
        <span class="tt"><b>${s.name}</b><span>${legFromTo(l,S.dir)} · ${when}</span></span>
        <span class="rt"><b>${fmtKm(km)} km</b><span class="mtag ${mode}">${modeLbl(s,mode)}</span></span>
        <span class="mini" aria-hidden="true">${mini}</span>
      </button>
      <div class="leg-body" id="${id}"${open?"":" hidden"}>
        <div><p class="note">${s.note}${l.dnote?" "+l.dnote:""}</p>${s.risk?`<p class="note risk"><b>Safety.</b> ${s.risk}</p>`:""}
          <div class="nums"><span><b>${rideD}</b> ${mode==="bus"?"days on the bus":"riding days"}</span><span><b>${off}</b> off the bike</span>${rideD&&mode!=="bus"?`<span><b>${pace}</b> km/day</span>`:""}<span>season fit <b>${fit}</b></span></div>
          ${s.src.length?`<p class="src">See: ${s.src.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join(" · ")}</p>`:""}</div>
        <div class="opts">
          <div class="seg sm" role="group" aria-label="How to cover ${s.name}">
            <button type="button" data-m="dirt" aria-pressed="${mode==="dirt"}">Dirt &amp; trails<small>${fmtKm(l.dkm)} km</small></button>
            ${s.noPaved?"":`<button type="button" data-m="paved" aria-pressed="${mode==="paved"}">Main road<small>${fmtKm(s.pkm)} km</small></button>`}
            <button type="button" data-m="bus" aria-pressed="${mode==="bus"}">${s.busLbl||"Bus"}<small>${s.busLbl?"transfer":"skip it"}</small></button>
          </div>
          ${s.hwy?`<p class="hwy">${s.hwy}</p>`:""}${s.named&&mode==="paved"?`<p class="hwy">This is a mapped dirt route; on the main road you miss most of it.</p>`:""}
          ${isLast&&l.stayFrac>.98?"":`<label class="switch" for="brk-${s.id}"><input type="checkbox" id="brk-${s.id}" ${S.breaks[s.id]?"checked":""}><span><b>${S.brk}-day break</b> in ${legEndCity(l)}</span></label>`}
          <button type="button" class="btn ghost" data-map="${li}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>Show on map</button>
        </div>
      </div></article>`;
  });
  el.innerHTML=html;
  el.querySelectorAll(".leg[data-seg]").forEach(art=>{
    const li=+art.dataset.li, sid=art.dataset.seg, l=sim.legs[li];
    art.querySelector(".leg-head").onclick=()=>{ const open=!OPEN.has(sid); if(open) OPEN.add(sid); else OPEN.delete(sid); art.querySelector(".leg-head").setAttribute("aria-expanded",open); art.querySelector(".leg-body").hidden=!open; SEL=l.startDay; $("day").value=SEL; setFill($("day")); drawSel(); };
    art.querySelectorAll(".seg button").forEach(btn=>btn.onclick=()=>{ S.auto=false; S.preset=null; S.modes[sid]=btn.dataset.m; FOCUS_AFTER=`.leg[data-seg="${sid}"] .seg button[data-m="${btn.dataset.m}"]`; update(); });
    const cb=art.querySelector("input[type=checkbox]"); if(cb) cb.onchange=()=>{ S.breaks[sid]=cb.checked; FOCUS_AFTER=`#brk-${sid}`; update(); };
    art.querySelector("[data-map]").onclick=()=>{ if(window.innerWidth<980) $("s-map").scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"start"}); SEL=l.startDay; $("day").value=SEL; setFill($("day")); setTimeout(()=>zoomToLeg(li), window.innerWidth<980?350:0); };
  });
  const nB = sim.legs.filter(l=>l.type==="seg"&&l.days.some(d=>d.type==="break")).length;
  $("brkCount").textContent = `${nB} stops chosen, ${nB*S.brk} days in total.`;
  $("expandAll").textContent = sim.legs.filter(l=>l.type==="seg").every(l=>OPEN.has(l.seg.id)) ? "Close all" : "Open all";
}

/* ---------- compare: routes x months ---------- */
const RM_ROWS=[]; ROUTES.forEach(r=>["S","N"].forEach(dir=>RM_ROWS.push({r,dir})));
const RM_CACHE={}; let RM={key:null,data:null,y:null,job:0,visible:false};
function rmKey(y){ return JSON.stringify([S.kmpd,S.rest,S.ramp,S.brk,S.breaks,S.dirtPref,y]); }
function renderCompare(){
  const y=yearOf(S.start), key=rmKey(y);
  if(RM.key!==key){ RM.key=key; RM.y=y; RM.data=RM_CACHE[key]||(RM_CACHE[key]=new Array(RM_ROWS.length*12).fill(null)); RM.job++; buildRm(); if(RM.visible) runRm(); }
  paintRm();
}
function buildRm(){
  let h=`<thead><tr><th class="rh">Start on the 1st of</th>${MON.map(m=>`<th>${m}</th>`).join("")}</tr></thead><tbody>`;
  RM_ROWS.forEach((row,ri)=>{ h+=`<tr><th class="rh" scope="row">${tripName(row.r,row.dir)}<small>${row.dir==="S"?"southbound":"northbound"}</small></th>`; for(let m=0;m<12;m++) h+=`<td><button type="button" data-i="${ri*12+m}">…</button></td>`; h+="</tr>"; });
  $("rm").innerHTML=h+"</tbody>";
  $("rm").querySelectorAll("button").forEach(b=>b.onclick=()=>{ const i=+b.dataset.i, row=RM_ROWS[Math.floor(i/12)], m=i%12; const geom = row.r.id!==S.route || row.dir!==S.dir; S.route=row.r.id; S.dir=row.dir; S.start=isoD(Date.UTC(RM.y,m,1)); S.auto=true; S.preset=null; update({geom}); if(window.innerWidth<980) $("s-summary").scrollIntoView({behavior:REDUCE?"auto":"smooth"}); });
  $("rmCap").textContent=`Share of route ridden in season, for a start on the 1st of each month in ${RM.y}`;
}
function paintRm(){
  if(!RM.data) return; const sd=new Date(parseD(S.start));
  $("rm").querySelectorAll("button").forEach(b=>{ const i=+b.dataset.i, v=RM.data[i], row=RM_ROWS[Math.floor(i/12)], m=i%12;
    const on = row.r.id===S.route && row.dir===S.dir && sd.getUTCDate()===1 && sd.getUTCMonth()===m && sd.getUTCFullYear()===RM.y;
    b.classList.toggle("on",on);
    if(!v){ b.textContent="…"; b.style.background=""; b.classList.remove("over"); b.title="Scoring…"; return; }
    b.textContent=Math.round(v.fit*100); b.style.background=fitColor(v.fit); b.classList.toggle("over",v.total>365);
    b.title=`${tripName(row.r,row.dir)}, start 1 ${MON[m]} ${RM.y}: ${Math.round(v.fit*100)}% in season, ${v.total} days${v.total>365?" (over a year)":""}, finish ${fmtD(v.end)}`; });
  const done=RM.data.filter(Boolean).length;
  if(done<RM.data.length) $("rmText").textContent=`Scoring every route in both directions with your pace and breaks… ${done} of ${RM.data.length}`;
  else { let best=null; RM.data.forEach((v,i)=>{ if(v.total<=365 && (!best || v.fit>best.v.fit)) best={v,i}; });
    $("rmText").innerHTML = best ? `Every route in both directions, scored with your pace and breaks and the best mix of dirt, main roads and bus for each start. The top pick for ${RM.y} is <b>${tripName(RM_ROWS[Math.floor(best.i/12)].r,RM_ROWS[Math.floor(best.i/12)].dir)} from 1 ${MON[best.i%12]}</b> at ${Math.round(best.v.fit*100)}%. Tap any cell to load it.` : "None of these fit inside 12 months with your settings. Try a longer riding day or fewer breaks."; }
}
function runRm(){
  const job=RM.job; const data=RM.data, y=RM.y;
  const step=()=>{ if(job!==RM.job) return; const t1=performance.now(); let idx;
    while(performance.now()-t1<20 && (idx=data.indexOf(null))>=0){ const row=RM_ROWS[Math.floor(idx/12)]; const p=Object.assign({},S,{route:row.r.id,dir:row.dir,start:isoD(Date.UTC(y,idx%12,1)),modes:{}}); p.modes=optimize(p); const s=simulate(p); data[idx]={fit:s.inSeason,total:s.total,end:s.end}; }
    paintRm(); if(data.indexOf(null)>=0) setTimeout(step,12); };
  step();
}
function initCompare(){
  if("IntersectionObserver" in window){ new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting && !RM.visible){ RM.visible=true; runRm(); } }); },{rootMargin:"600px 0px"}).observe($("s-compare")); }
  else { RM.visible=true; setTimeout(runRm,1500); }
}

/* ---------- pins ---------- */
function pinCurrent(){
  const sim=SIM, r=routeOf();
  const pin={id:Date.now(), name:tripName(r,S.dir), route:S.route, dir:S.dir, start:S.start, kmpd:S.kmpd, rest:S.rest, ramp:S.ramp, brk:S.brk, auto:S.auto, dirtPref:S.dirtPref, modes:Object.assign({},S.modes), breaks:Object.assign({},S.breaks), total:sim.total, fit:sim.inSeason, end:sim.end, km:Math.round(sim.km), wet:sim.cnt.W+sim.cnt.C};
  const dup=PINS.findIndex(p=>JSON.stringify([p.route,p.dir,p.start,p.kmpd,p.rest,p.brk,p.ramp,p.auto,p.dirtPref])===JSON.stringify([pin.route,pin.dir,pin.start,pin.kmpd,pin.rest,pin.brk,pin.ramp,pin.auto,pin.dirtPref]));
  if(dup>=0) PINS.splice(dup,1); PINS.push(pin); while(PINS.length>4) PINS.shift(); savePins(); renderPins();
  const b=$("pinBtn"); b.lastChild.textContent="Pinned below"; setTimeout(()=>{ b.lastChild.textContent="Pin to compare"; },1600);
}
function renderPins(){
  const el=$("pins");
  if(!PINS.length){ el.innerHTML=`<p class="empty">Pin a plan from Your trip to compare it here. You can keep up to four.</p>`; return; }
  const bestFit=Math.max(...PINS.filter(p=>p.total<=365).map(p=>p.fit), -1);
  el.innerHTML=PINS.map(p=>`<div class="pin"><h3>${p.name}</h3><span class="cap">from ${fmtD(parseD(p.start))} · ${p.kmpd} km days</span>
    <dl><dt>Length</dt><dd${p.total>365?' style="color:var(--bad)"':""}>${p.total} days · ${(p.total/30.44).toFixed(1)} mo</dd><dt>In season</dt><dd class="${p.fit===bestFit?"best":""}">${Math.round(p.fit*100)}%</dd><dt>Wet or winter</dt><dd>${p.wet} days</dd><dt>Ridden</dt><dd>${fmtKm(p.km)} km</dd><dt>Finish</dt><dd>${fmtD(p.end)}</dd></dl>
    <div class="row"><button class="btn" type="button" data-load="${p.id}">Load</button><button class="btn ghost" type="button" data-del="${p.id}" aria-label="Remove ${p.name} pin">Remove</button></div></div>`).join("");
  el.querySelectorAll("[data-load]").forEach(b=>b.onclick=()=>{ const p=PINS.find(x=>String(x.id)===b.dataset.load); if(!p) return; const geom=p.route!==S.route||p.dir!==S.dir; ["route","dir","start","kmpd","rest","ramp","brk","auto","dirtPref"].forEach(k=>S[k]=p[k]); S.modes=Object.assign({},p.modes); S.breaks=Object.assign({},p.breaks); S.preset=null; update({geom}); if(window.innerWidth<980) $("s-summary").scrollIntoView({behavior:REDUCE?"auto":"smooth"}); });
  el.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ PINS=PINS.filter(x=>String(x.id)!==b.dataset.del); savePins(); renderPins(); });
}

/* ---------- copy itinerary ---------- */
function itineraryText(sim){
  const r=routeOf(); const L=[];
  L.push(`Bikepacking Route Planner: ${tripName(r,S.dir)}`);
  L.push(`Start ${fmtD(sim.t0)} · ${sim.total} days (${(sim.total/30.44).toFixed(1)} months) · finish ${fmtD(sim.end)}`);
  L.push(`${S.kmpd} km riding days · rest every ${S.rest} days · ${S.brk}-day breaks · ${Math.round(sim.inSeason*100)}% of the route in season`);
  L.push("");
  let n=0; sim.legs.forEach(l=>{ const a=l.days[0], b=l.days[l.days.length-1]; const when=a?`${fmtD(a.t,false)} – ${fmtD(b.t)}`:"";
    if(l.type==="xfer"){ L.push(`   ${legName(l,S.dir)}: ${when} (${l.days.length} days)`); return; }
    n++; const km=l.mode==="bus"?l.seg.pkm:l.km; L.push(`${String(n).padStart(2,"0")} ${l.seg.name}: ${when} · ${MODE_LBL[l.mode]} ${fmtKm(km)} km · ${l.ride.length} ${l.mode==="bus"?"bus days":"riding days"} · season fit ${l.fit==null?"–":Math.round(l.fit*100)+"%"}${S.breaks[l.seg.id]&&l.days.some(d=>d.type==="break")?` · ${S.brk}-day break in ${l.seg.stay}`:""}`); });
  return L.join("\n");
}
function copyItinerary(){
  const txt=itineraryText(SIM), lbl=$("copyLbl");
  const done=ok=>{ lbl.textContent= ok? "Copied" : "Copy didn't work here"; setTimeout(()=>{ lbl.textContent="Copy itinerary"; },1800); };
  const fallback=()=>{ const ta=document.createElement("textarea"); ta.value=txt; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); let ok=false; try{ ok=document.execCommand("copy"); }catch(e){} ta.remove(); done(ok); };
  try{ if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(()=>done(true), fallback); else fallback(); }catch(e){ fallback(); }
}

/* ---------- tab bar ---------- */
function initTabs(){
  const links=[...document.querySelectorAll(".tabbar a")];
  links.forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); const t=$(a.dataset.s); if(MAPFULL) setFull(false); t.scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"start"}); }));
  if(!("IntersectionObserver" in window)) return;
  const ids=links.map(a=>a.dataset.s), vis={};
  const io=new IntersectionObserver(es=>{ es.forEach(e=>vis[e.target.id]=e.isIntersecting); const cur=ids.find(id=>vis[id]); if(cur) links.forEach(a=>a.classList.toggle("on",a.dataset.s===cur)); },{rootMargin:"-40% 0px -55% 0px"});
  ids.forEach(id=>io.observe($(id)));
}

/* ---------- update ---------- */
let schedRaf=0;
function schedule(){ if(schedRaf) return; schedRaf=requestAnimationFrame(()=>{ schedRaf=0; update(); }); }
function update(o){
  o=o||{};
  if(S.auto) fitTo12();
  syncControls();
  SIM=simulate(S);
  SEL=Math.min(SEL, SIM.total-1);
  const de=$("day"); de.max=SIM.total-1; de.value=SEL; setFill(de);
  renderTripbar(SIM); renderSummary(SIM);
  renderMap(SIM, !!o.geom);
  renderChart(SIM); renderLength(SIM); renderFlags(SIM); renderSeason(SIM); renderLegs(SIM); renderCompare();
  if(!o.keepStrip){ clearTimeout(rT); rT=setTimeout(renderStrip,60); } else { drawStripCursor(); const txt=$("stripText"); if(STRIP_BEST && txt) drawStrip(STRIP_CACHE[stripKey(yearOf(S.start))]||[], yearOf(S.start)); }
  drawSel(); save();
  if(FOCUS_AFTER){ const f=document.querySelector(FOCUS_AFTER); FOCUS_AFTER=null; if(f) f.focus({preventScroll:true}); }
}
buildSummary(); initControls(); initStrip(); initMapTools(); initTabs(); initCompare(); renderPins();
update({geom:true});
let rw=null, lastW=window.innerWidth;
window.addEventListener("resize",()=>{ if(Math.abs(window.innerWidth-lastW)<4 && !MAPFULL) return; lastW=window.innerWidth; clearTimeout(rw); rw=setTimeout(()=>{ MAPKEY=""; renderMap(SIM,true); renderChart(SIM); renderLength(SIM); drawSel(); },150); });

