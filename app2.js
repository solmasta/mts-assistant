SERIAL NUMBER DECODE
Carrier/Bryant furnaces: Same format as split systems — year letter in position 5.
Lennox: Year letter first, week second. G61MP = multi-position 1-stage. EL296V = 96% 2-stage variable.
Goodman/Amana: Year digit first, month letter second. GMVC = variable-speed modulating. GMSS = single-stage.
York/Johnson Controls: Serial starts with 4 factory letters. TMMV = modulating variable. TG8S = standard efficiency.
Rheem/Ruud: Week+year format. RGFJ = standard. R96V = 96% variable-speed.

Efficiency ratings decode:
80 in model = 80% AFUE (standard). 90/92/95/96/97/98 = high efficiency (condensing). Condensing units have PVC flue pipe and condensate drain.

FURNACE FAULT CODES — CARRIER/BRYANT WEATHERMAKER 9/10 SERIES
LED flash codes — count flashes, 2-second pause, repeat:
1-1 (1 pause 1) – Steady ON: Normal operation, no fault.
1-3 – Limit circuit open: High limit or rollout switch tripped. Check: dirty filter, blocked return/supply, blower motor, inducer RPM, cracked heat exchanger, oversized furnace for ductwork.
1-4 – Ignition failure: 3 failed ignition attempts → lockout. Check: gas pressure (3.5" WC NG, 11" WC LP), igniter resistance (normal silicon carbide: 45–90 ohms cold; normal hot surface igniter Norton 271 type: 40–75 ohms), flame sensor (clean with fine steel wool if coated/oxidised), gas valve output 24VAC on call.
2-1 – Control board fault: Replace.
2-2 – Inducer motor fault: RPM too low or not running. Check inducer motor, wiring, pressure switch hose.
2-3 – Pressure switch stuck open: Inducer running but pressure switch not proving. Check: clogged condensate trap (high efficiency), pinched/cracked pressure switch hose, failed pressure switch (normally open, closes on negative pressure ~0.5–1.5" WC depending on model).
2-4 – Pressure switch stuck closed: Check for pressure switch hose off inducer or pressure switch weld-closed.
3-1 – High limit switch open (persistent): Check ΔT across heat exchanger. Should be <60°F rise at design airflow. If >80°F: low airflow, dirty heat exchanger, gas overfired.
3-2 – Flame sensed without call for heat: Check gas valve (leaking), flame sensor wiring short to ground.
3-3 – Gas valve fault or open primary limit: Check primary limit switch continuity. Check gas valve coil resistance (40V coil: typically 25–40 ohms each stage).
3-4 – Rollout switch open: IMMEDIATE CONCERN — do not reset without full inspection. Causes: cracked heat exchanger, blocked flue, high gas pressure, dirty burners creating flame impingement.
4-1 – Inlet air fault (2-pipe sealed combustion): Check intake pipe for blockage (bird nest, ice, insects), verify pipe length vs model spec.
4-2 – TWINNING fault (if two furnaces wired in parallel).
4-3 – Control board memory fault: Replace board.
4-4 – Control board defective: Replace.
5-1 – Duplicate rollout: As above — heat exchanger inspection mandatory.

CARRIER/BRYANT FAULT CODES — INFINITY COMMUNICATING FURNACE
(Displayed on thermostat or furnace board LCD if equipped)
E01 – Low-stage pressure switch did not close: Check inducer, pressure switch, condensate.
E02 – High-stage pressure switch did not close: Low-stage only proving. Check high-stage pressure switch set point.
E03 – Rollout switch: As above.
E04 – Open limit switch: Filter, airflow, blower motor.
E05 – Flame lost after ignition: Check gas pressure, flame sensor, dirty burner ports.
E06 – Ignition failure lockout: Check igniter, gas valve, pilot orifice (standing pilot models).
E07 – Blower motor fault (variable speed ECM): Check motor winding, connector, control board signal.
E08 – Inducer motor fault.
E09 – Control board fault.

LENNOX MERIT/ELITE/DAVE LENNOX FURNACE FLASH CODES
2 flashes – System lockout: Ignition failure after 3 or 5 attempts. Manual reset required (cycle power or stat).
3 flashes – Draft pressure fault: Pressure switch won't close. Check inducer, blocked flue, condensate trap.
4 flashes – Open high-temperature limit: Filter, blower, ductwork restriction.
5 flashes – Flame sensed with gas valve closed: Gas valve leaking or flame sensor shorted.
6 flashes – 115V AC power reversed polarity: Check wiring, verify neutral and hot correct.
7 flashes – Rollout switch: Do not reset — inspect heat exchanger.
8 flashes – Ignition failure.
9 flashes – Low/high gas pressure switch open (if equipped).

GOODMAN/AMANA FURNACE FAULT CODES
2 flashes – System lockout (ignition failure × 3).
3 flashes – Pressure switch failure.
4 flashes – Open temperature limit switch.
5 flashes – Flame present with gas valve off: Possible shorted flame sensor wire.
6 flashes – Rollout switch open.
7 flashes – Low flame signal: Dirty flame sensor, weak flame (check gas pressure, burner orifice).
Continuous flashing – Normal operation (some Goodman boards blink continuously during normal run).

IGNITION SYSTEM TROUBLESHOOTING
Hot surface igniter (HSI) — silicon carbide (grey/black, brittle):
Cold resistance: 45–90 ohms. If >150 ohms or open → replace.
Check voltage at igniter terminals during ignition trial: 120V (most) or 240V (some older).
Do NOT touch igniter surface — skin oils cause premature failure. Handle with gloves.
Typical igniter life: 5–7 years. Replace proactively on 10-year+ furnaces during tune-up.

Silicon nitride igniter (ivory/white, more durable):
Cold resistance: 25–75 ohms. Less brittle than silicon carbide.
Same voltage check procedure.

Flame sensor (rectification type):
Measures microamp signal in flame: Normal reading 2–6 µA DC. Below 1 µA = replace or clean.
Check: Set multimeter to DC microamps. Connect in series between sensor lead and sensor terminal.
Clean with fine steel wool or Scotch-Brite — do NOT use sandpaper (too abrasive, damages coating).
Causes of low signal: Oxidised sensor, improper grounding, gas pressure too low (weak flame), wrong gas/air mix.

GAS PRESSURE — MANIFOLD AND SUPPLY
Natural gas: Supply pressure at gas valve inlet: 5–7" WC. Minimum: 4.5" WC.
LP gas: Supply pressure: 11–14" WC. Minimum: 11" WC.
Manifold pressure (at gas valve outlet, downstream):
- NG low fire: 1.5–2.0" WC. NG high fire: 3.2–3.5" WC.
- LP low fire: 4.5–5.0" WC. LP high fire: 10–11" WC.
Check with magnehelic or manometer at burner manifold test port.
Low gas pressure symptoms: Yellow/lazy flames, hard starts, ignition failure, incomplete combustion.
High gas pressure: Lifting flames, rollout risk, carbon monoxide.

HEAT EXCHANGER INSPECTION
Visual inspection with camera/mirror:
- Cracks around welds, ports, stress points.
- Rust scaling, holes visible.
- Soot deposits on outside of heat exchanger (combustion leak).
Test with flame: Light incense stick, hold at each supply register. If flame deflects or wavers when blower starts → combustion leak present.
CO measurement: Take CO reading in supply air stream. >9 ppm CO air-free = investigate. >100 ppm = shut down immediately.
Cracked heat exchanger: Lock out unit. Do not operate. CO poisoning risk.

CONDENSATE MANAGEMENT — HIGH EFFICIENCY (90%+)
Condensate pH: 3–4 (mildly acidic). Neutraliser recommended before entering floor drain in some jurisdictions.
Condensate production: 1–2 gallons per hour typical.
Condensate trap: Must be primed and clear. Blocked trap = pressure switch won't prove = no heat call.
Drain line: Must slope continuously to drain. No sags (standing water = blockage).
Freeze protection: Condensate drain must not be exposed to freezing temps.`
}, {
  id: "d8",
  name: "Boilers — Gas, Hot Water & Steam Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["boiler", "fault codes", "hydronic", "steam", "Burnham", "Weil-McLain", "Lochinvar", "Navien", "Viessmann", "serial decode"],
  content: `BOILERS — HOT WATER & STEAM FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE BY BRAND

Burnham:
Serial format: Year-Week-Sequence (e.g., 23-04-XXXXX = 2023, Week 4).
Model: ES2 = series 2 cast iron. MPO = oil-fired. Alpine = high-efficiency condensing.

Weil-McLain:
Serial: MMYYXXXXXX format (MM=month, YY=year).
Model: GV90 = 90% AFUE gas. Gold CGi = cast iron. Ultra = condensing. EG = Series Gold.

Lochinvar:
Serial: YYWWXXXXX (YY=year, WW=week).
Model: Knight = mod-con (modulating condensing). WHN = hot water. SYNC = storage combo.

Navien (condensing combi and boilers):
Model: NCB = combi boiler. NFB = boiler only. NFC = cascade. CH = combi heat.
Serial: 8-digit on rating plate.

Viessmann:
Model: Vitodens 200-W = condensing combi. Vitodens 100-W = heating only.
Serial: Production date stamped on unit rating plate.

Peerless:
Model: MI = cast iron gas. WBV = gas hot water. PUREFIRE = condensing.

BOILER CONTROLS & SAFETY DEVICES
Aquastat (hot water boiler): Controls burner based on boiler water temperature.
High limit: Typically set 200°F. Shuts burner if boiler overheats. Manual reset on some models.
Operating control (L8148): Differential setting — burner fires when temp drops X°F below setpoint.
LWCO (Low Water Cut-Off): Shuts burner if water level drops. McDonnell-Miller 67/157 common types. Test by slowly opening blow-down valve — burner should shut off. Probe type: Clean annually.
Pressure relief valve: 30 PSI rating standard residential. Test annually — lift lever, ensure valve reseats, no drip after test. Replace if leaking.
Pressure gauge: Normal operating: 12–25 PSI. Cold fill: 12–15 PSI. If pressure rises above 25 PSI: expansion tank waterlogged or system overfilled.
Expansion tank: Bladder/diaphragm type — check air charge with tire gauge (should equal cold fill pressure, typically 12 PSI). Bladder tank that is waterlogged = replace.
Backflow preventer: Required on domestic water makeup connection.

STEAM BOILER CONTROLS
Pressuretrol: Operating control set at 1.0–2.0 PSI (gravity systems). Cut-in differential: 0.5–1.0 PSI.
Vapourstat: For very low pressure systems (<0.5 PSI). More sensitive than pressuretrol.
LWCO: Critical on steam — boiler can go dry. McDonnell-Miller 157S for steam. Blowdown daily on commercial systems.
Sight glass: Shows water level. Should be ½ to ⅔ of sight glass height when boiler is cold. Rising and falling during operation is normal (surging).
Steam traps: Must be functional — test with infrared thermometer or ultrasonic detector. Failed-open trap: both inlet and outlet hot. Failed-closed trap: inlet hot, outlet cold.

HOT WATER BOILER FAULT CODES — LOCHINVAR KNIGHT
E01 – Ignition failure: Check gas pressure, igniter, flame sensor, gas valve.
E02 – Flame loss after ignition: Check gas pressure stability, flame sensor signal (<1 µA = clean/replace), combustion air.
E03 – High limit: Boiler water >210°F. Check circulator, air-bound system, setpoint.
E04 – Blocked flue/air intake: Check vent for blockage, bird/insect screens, condensate drain.
E05 – Temperature sensor fault (supply or return): Check 10K thermistor resistance. 77°F=10K, 140°F=3.8K, 200°F=1.5K.
E06 – Low water temperature differential: Check for short-cycling, incorrect piping, system flow.
E08 – Gas valve fault: Check 24V to gas valve, valve coil resistance.
E10 – Fan fault: Check combustion blower, blocked air intake.
E11 – Communication fault (cascade/BACnet).
E12 – Igniter fault: Check igniter continuity and voltage.
E27 – High water temperature: >185°F supply. Check high limit, strainer, flow.
E28 – Delta-T (supply-return differential) too high: Poor flow — check circulator, air separator, balance valves.
E32 – Return sensor fault.
E38 – Header sensor fault (cascade systems).

NAVIEN NCB/NFB COMBI BOILER FAULT CODES
E001 – No ignition: Check gas pressure, inlet, valve coil, igniter.
E002 – Abnormal flame: Unstable combustion. Check gas pressure, venting, combustion air.
E003 – Ignition failure after max retries: Lockout. Check all E001/E002 causes plus check for air in gas line.
E004 – False flame: Flame sensor signal without call. Check sensor, gas valve.
E010 – Overheated: Check flow rate, scale buildup, heat exchanger.
E012 – Flame loss during operation.
E016 – Exhaust temperature high: Check blocked vent, improper vent length.
E030 – Exhaust sensor fault.
E033 – Outgoing water temperature sensor fault.
E036 – Incoming cold water sensor fault.
E046 – Fan motor fault: Check combustion blower wiring, operation.
E047 – Air pressure sensor fault.
E060 – Domestic hot water (DHW) high temperature: Check DHW sensor, heat exchanger scale.
E067 – Flow sensor fault (domestic water).
E109 – Low water pressure (if equipped with pressure sensor): Check fill, pressure relief valve.
E110 – Water pressure sensor fault.
E351 – PC communication error.
E407 – PCB fault.

WEIL-MCLAIN/BURNHAM FAULT CODES (GV90/Ultra series)
E01 – Ignition lockout.
E02 – High limit open.
E03 – Pressure switch fault.
E04 – Low water.
E05 – Sensor fault (supply temp).
E06 – Sensor fault (return temp).
E07 – Flue sensor fault.
E08 – Blocked vent.
E11 – LWCO fault.

HYDRONIC SYSTEM TROUBLESHOOTING
No heat — single zone:
1. Check thermostat call — check for 24V from stat.
2. Check zone valve: 24V at coil, check actuator opens mechanically.
3. Check circulator: Verify operation, rotation direction (check arrow on pump housing), priming.
4. Check air in zone: Bleed radiators at high point. Gurgling = air-bound.
5. Check balance valves not shut.
No heat — all zones:
1. Check boiler operation, fault codes, reset.
2. Check LWCO — may need manual reset after blowdown.
3. Check main circulator (primary loop).
4. Check thermostat wiring.
5. Check gas supply.

Air bleeding procedure:
Start at lowest/closest zone, work to highest/farthest. Open bleed valve on each radiator until water flows steady without sputtering. Check pressure after bleeding — may need to add water.

System fill pressure: Cold system: 12–15 PSI. Hot system at 200°F: 18–25 PSI. If system loses pressure regularly: check pressure relief valve, expansion tank.

Condensate boiler flue pH: 3–5. Neutralizer required in most jurisdictions before drain.
Condensate production: 1–3 gallons/hour on large mod-con boilers.

COMBUSTION ANALYSIS TARGETS (Natural Gas)
O2: 4–6% (ideal). <4% = rich mix, possible CO. >8% = excessive dilution, heat loss.
CO2: 8–10%.
CO (air-free): <100 ppm ideal. >400 ppm = unsafe, adjust combustion air.
Flue temperature: <500°F (should be flue temp minus ambient). Condensing boiler: 100–130°F (condensing mode).
Efficiency: 80%+ standard, 90%+ condensing.`
}, {
  id: "d9",
  name: "Water Heaters — Commercial & Residential Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["water heater", "fault codes", "Rheem", "AO Smith", "Bradford White", "Navien", "Rinnai", "tankless", "commercial"],
  content: `WATER HEATERS — COMMERCIAL & RESIDENTIAL FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE BY BRAND

Rheem/Ruud:
Serial format: F (factory) + YY (year) + WW (week) + sequence.
Example: F2304xxxxx = 2023, Week 04.
Model: XG40 = 40-gallon standard gas. PROG50 = ProGlassPLUS 50-gallon. EcoNet = connected line.

AO Smith:
Serial: 4 digits + letter + 6 digits. Letter = year (A=2011 continuing).
Model: GCF = commercial gas. GPVH = tall gas. Vertex = high-efficiency power vent. Voltex = hybrid electric.

Bradford White:
Serial: Year + Month letter + sequence. Year: 9=2009 to present cycling. Month: A=Jan, B=Feb, C=Mar, D=Apr, E=May, F=Jun, G=Jul, H=Aug, J=Sep, K=Oct, L=Nov, M=Dec.
Model: MI50S6FBN = 50-gal standard natural gas. MITW = tall. MITS = short.

State/American/Kenmore:
Same AO Smith serial format (same parent company — Acuity Brands/Rheem for some).

Rinnai (tankless):
Model: V = value series. RL = luxury series. RSC = commercial. i = indoor, e = exterior.
Serial: 9 digits on rating plate.

Navien (tankless/combi):
NPE-A2 = tankless condensing. NPN = non-condensing.

Noritz (tankless):
NRCP = commercial. NRC = residential condensing.

TANK WATER HEATER COMPONENTS & SPECS
Thermocouple (standing pilot): Generates 25–30 mV when heated by pilot. If <20 mV → replace. Millivolt meter required for accurate test.
Thermopile (electronic spark): Generates 300–750 mV. Powers gas valve electronics. Test at gas valve terminals.
Gas valve (combination): Contains main valve, pilot valve, thermostat control, thermal cutoff. Test: 24V or millivolt signal at coil terminals. If no response → replace valve.
Anode rod: Sacrificial magnesium or aluminum rod. Inspect every 2–3 years. Replace when reduced to core wire or <50% original diameter. Extends tank life significantly.
Dip tube: Cold water inlet tube directs cold water to bottom of tank. If broken → cold and hot water mix → inconsistent temperature.
T&P relief valve: Rated 150 PSI and 210°F. Test annually. Replace every 5 years or if leaking.
Expansion tank: Required on closed systems (backflow preventer on supply). Sized per tank volume and supply pressure.

ELECTRIC WATER HEATER TROUBLESHOOTING
Upper thermostat: Controls upper element. Default setting: 120–125°F. High limit: 170°F manual reset.
Lower thermostat: Controls lower element. Set 5–10°F below upper.
Elements: 240VAC, 3500–5500W typical. Check resistance: 240V/5500W = 10.5 ohms. Open = failed. Short to ground = failed.
Test sequence:
1. Check 240V at disconnect.
2. Check both thermostats — reset upper limit (red button) if tripped.
3. Check element resistance (power off, element disconnected).
4. Upper thermostat provides 240V to upper element first. Upper stat shifts power to lower when upper zone satisfied.
Reset procedure: Power off, access upper thermostat panel, press red reset button firmly. If trips repeatedly → check element resistance, thermostat accuracy.

RHEEM/RUUD GAS WATER HEATER FAULT CODES
(LED on gas valve — 1 flash = one-second on/off cycle)
1 flash – Unit working normally.
2 flashes – Thermopile voltage low: Check pilot flame, thermopile condition.
3 flashes – Pilot outage: Check gas supply, pilot orifice, thermocouple/thermopile.
4 flashes – Flammable vapor sensor (FV sensor) lockout: Detect flammable vapors near unit. Ventilate area, remove source, reset.
5 flashes – Temperature exceeded 180°F: Check thermostat setting, scale buildup in tank.
6 flashes – Thermal cutoff: ECO (Energy Cutoff) tripped. Manual reset required — call service.
7 flashes – Gas valve fault: Check gas supply, valve coil.
Continuous flashing – Control module fault: Replace gas valve assembly.

AO SMITH PROLINE/VERTEX FAULT CODES (Power Vent models)
E1 – Ignition failure: Check gas pressure, igniter, flame sensor.
E2 – Overheating: Check scale, thermostat setting, sensor.
E3 – Pressure switch: Check blower, blocked vent.
E4 – Flue overheat: Blocked vent or excessive vent length.
E5 – Temperature sensor fault.
E6 – Gas valve fault.
E7 – Blower/fan fault.
Solid LED – Lockout mode: Power cycle to reset. If repeats → service required.

RINNAI TANKLESS FAULT CODES
11 – No ignition: Check gas pressure (3.5" WC NG minimum at full load), igniter spark, gas valve, air intake.
12 – Flame failure: Flame established then lost. Check gas pressure stability, dirty flame sensor.
14 – Thermal fuse open: Unit overheated. Check scale buildup on heat exchanger, ventilation.
16 – Outgoing temp too high: Check scale, setpoint, flow rate.
31 – Inlet temp sensor fault: Check thermistor, replace if open/shorted.
32 – Outlet temp sensor fault.
33 – Combustion air temp sensor fault.
34 – Outgoing temp sensor 2 fault.
35 – Flue temperature sensor fault.
41 – Bypassed supply water solenoid fault.
42 – Secondary hot water solenoid fault (combi models).
51 – Gas valve fault: Check 24V to valve, coil resistance.
52 – Modulating gas valve fault.
61 – Combustion fan fault: Check blower motor, blocked air intake.
65 – Water flow control valve fault.
66 – Bypass valve fault.
71 – Gas valve solenoid stuck open.
72 – False flame: Sensor detects flame without call.
79 – Inlet water temp too high: Cold supply >104°F (glycol system issue or cross-connection).
Code 10 series – Gas/ignition issues.
Code 30 series – Sensor issues.
Code 60 series – Mechanical component faults.

NAVIEN NPE TANKLESS FAULT CODES
E001 – Ignition failure.
E002 – Flame loss.
E003 – Ignition lockout after retries.
E004 – False flame.
E010 – Overheating.
E012 – Thermal fuse.
E016 – Exhaust high temp.
E030 – Exhaust thermistor.
E033 – Outlet thermistor.
E036 – Cold water thermistor.
E046 – Fan motor fault.
E047 – Air pressure sensor.
E060 – Domestic hot water high temp.
E110 – Water pressure sensor.

COMMERCIAL WATER HEATER — ADDITIONAL CHECKS
Power venting: Check vent motor operation, verify suction/pressure, clean motor screen annually.
Direct vent: Check both combustion air intake and exhaust for obstruction.
Scale/lime buildup: Scale insulates heat exchanger — reduces efficiency 20–40%. Flush annually with citric acid or white vinegar (commercial descalers preferred). Symptoms: Reduced hot water output, extended recovery, popping/rumbling sounds.
Expansion tank: Closed system requires expansion tank. Size per tank volume and system pressure. Air charge = cold supply pressure (typically 40–80 PSI). If waterlogged: replace.
Mixing valve (ASSE 1017): Commercial systems typically store at 140°F (Legionella prevention) and temper to 110–120°F at point of use. Check mixing valve operation and setpoint.
Legionella prevention: Store at 140°F minimum. Periodically heat to 160°F+ and flush all fixtures. Stagnant water >77°F is primary risk.
Sacrificial anode: Commercial tanks: inspect every 2 years, replace when spent. Some commercial tanks have multiple anodes.
Code clearances: 18" from combustibles front/sides, 6" top clearance. Gas connections: Flexible connector max 36" length, listed for gas service.`
}, {
  id: "d10",
  name: "Chillers — Air & Water Cooled, Fault Codes & Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["chiller", "fault codes", "Carrier", "Trane", "York", "Daikin", "McQuay", "Lennox", "centrifugal", "screw", "scroll", "serial decode", "R-134a", "R-410A", "HFO"],
  content: `CHILLERS — AIR-COOLED & WATER-COOLED FIELD SERVICE REFERENCE

CHILLER TYPES & APPLICATIONS
Scroll chiller: 10–60 tons typical. Multiple scroll compressors staged. Most common for small/medium commercial. Air-cooled or water-cooled. Brands: Carrier 30HX, Trane CGAM small, York YCAL, Daikin AWV.
Screw chiller: 60–500+ tons. Single or twin-screw compressor, slide valve capacity control. Air-cooled or water-cooled. Brands: Carrier 30XV, Trane CGAM/RTHD, York YVAA/YPAL, Daikin AGZ, McQuay ALR.
Centrifugal chiller: 150–2000+ tons. Single or two-stage. Water-cooled typical. High efficiency at full load, less efficient at part load without variable diffuser. Brands: Carrier 19XR/19XRV, Trane CenTraVac, York YK/YKK.
Absorption chiller: Fired by steam, hot water, or gas. No compressor. COP 0.6–1.2. Used where waste heat available.

SERIAL NUMBER DECODE BY BRAND

Carrier chillers:
Same format as other Carrier products — year letter + week + sequence.
Model: 30HXC = water-cooled scroll. 30XA = air-cooled scroll. 30XV = air-cooled screw. 19XR = water-cooled centrifugal.
Tonnage: 3 digits in model × 1000 BTU ÷ 12,000 = tons (e.g., 200 = 200 tons on large models; check model nomenclature guide for each series).

Trane chillers:
Serial: First 2 digits = year, next 2 = week.
Model: CGAM = air-cooled screw (20–130T). CGWM = water-cooled scroll. RTHD = water-cooled screw. CVHF = water-cooled centrifugal. RTAF = air-cooled screw (large).

York/Johnson Controls:
Model: YCAL = air-cooled scroll. YVAA = air-cooled screw with VFD. YPAL = air-cooled screw (large). YK = water-cooled centrifugal. YLAA = air-cooled screw.
Serial: Factory code + year digit + week + sequence.

Daikin/McQuay:
Model: AGZ = air-cooled scroll (Daikin). ALR = water-cooled screw (McQuay). WME = water-cooled scroll. PEH = water-cooled screw large.
Serial: Year + week format.

REFRIGERANTS USED IN CHILLERS
R-134a: Most common in centrifugal and large screw chillers. GWP=1430. Cylinder=light blue. Pressure at 77°F: 71 psig. Phasing down — replacement is R-1234ze or R-513A.
R-410A: Scroll and small screw air-cooled chillers. GWP=2088. Cylinder=pink/rose.
R-123: Low-pressure centrifugal chillers (Carrier 19XR older, Trane CenTraVac). GWP=77. Cylinder=grey. Boiling point=82°F — operates below atmospheric pressure. HCFC, being phased out.
R-1234ze(E): Low-GWP replacement for R-134a. GWP=7. A2L (mildly flammable). Increasingly common in new centrifugal chillers.
R-513A: R-134a replacement for screw/scroll chillers. GWP=631. Non-flammable (A1).
R-32 / R-454B: Used in newer air-cooled scroll chillers replacing R-410A. A2L — requires attention to charge limits in enclosed equipment rooms.
R-1233zd(E): Replaces R-123 in low-pressure centrifugals. GWP=1. ASHRAE A1 (non-flammable).

CARRIER 30HX/30XA SCROLL CHILLER FAULT CODES (Pro-Dialog controller)
A0 – Protection device activation: Check all safeties.
A1 – Control module fault.
A2 – Chilled water flow fault: Check flow switch, pump, strainer, delta-P.
A3 – Evaporator freeze protection: Leaving chilled water temp <35°F. Check setpoint, anti-freeze, flow.
A4 – High condenser pressure (air-cooled): >537 psig R-410A. Check condenser fans, coil, ambient.
A5 – High condenser water temperature (water-cooled): >105°F entering condenser water. Check cooling tower, condenser water pump.
A6 – Low evaporator refrigerant pressure: <55 psig R-410A. Check charge, evaporator flow, TXV/EEV.
A7 – Compressor overload: Check amp draw vs RLA. Check winding resistance.
A8 – Low oil pressure differential (screw models): Check oil filter, separator, oil level.
A9 – EEV (electronic expansion valve) fault.
AA – Compressor high discharge temperature: >250°F. Check charge, condenser, head pressure.
Ab – High pressure safety switch manual reset required.
AC – Compressor start failure: Check contactor, voltage, winding resistance.
Ad – Phase reversal/loss: Check all three phases.
AE – Communication fault (between modules or to BAS).
AF – Chilled water pump fault (if pump control enabled).
b0 – Evaporator water circuit sensor fault: Check thermistors.
b1 – Condenser water/air circuit sensor fault.
b2 – Refrigerant pressure transducer fault.
b3 – Discharge temperature sensor fault.
b4 – Liquid line temperature sensor fault.
b5 – Suction temperature sensor fault.
b6 – Oil temperature sensor fault (screw models).
b7 – Ambient temperature sensor fault.
b8 – Motor winding temp sensor fault.

TRANE CGAM AIR-COOLED SCREW CHILLER FAULT CODES (Tracer AdaptiView)
CH001 – Chilled water flow: Verify GPM vs design. Minimum flow typically 3 GPM/ton.
CH002 – Evaporator freeze protection: LWT <35°F. Check glycol concentration (if applicable), setpoint, flow.
CH003 – High discharge pressure: R-134a >445 psig. Check condenser fans, coil, ambient. R-410A >610 psig.
CH004 – Low suction pressure: R-134a <20 psig. Check charge, evaporator fouling, chilled water flow.
CH005 – Compressor motor overtemperature: Check cooling, discharge superheat, refrigerant charge.
CH006 – High motor amp draw: Check voltage, winding resistance.
CH007 – Oil pressure differential fault: Check oil filter differential. Replace filter if >15 psid.
CH008 – Compressor start failure: Check contactor, power, mechanical.
CH009 – High condenser leaving air temp: Recirculation issue. Check fan direction, unit spacing.
CH010 – Phase loss/reversal: Check power quality.
CH011 – Low refrigerant charge: Check charge, leak test.
CH012 – High discharge temperature: Check charge, condenser conditions, valve damage.
CH013 – Sensor failure (specify which): Check wiring, resistance.
CH014 – Communication loss (to BAS or remote panel).
CH015 – Condenser fan fault: Check motor, fuse, capacitor (single-phase fans).
CH016 – High evaporator refrigerant temperature: Possible flooding. Check EEV, charge.
CH017 – Capacity valve fault (screw slide valve): Check solenoid, actuator.
CH018 – Economizer fault (if equipped).

YORK YVAA VARIABLE SPEED AIR-COOLED SCREW (OptiView controller)
FLT001 – High discharge pressure: See above.
FLT002 – Low suction pressure.
FLT003 – Chilled water flow.
FLT004 – Compressor VFD fault: Check VFD display — common: OC (overcurrent), OV (overvoltage), OH (overheat), GF (ground fault).
FLT005 – Motor overtemperature.
FLT006 – High motor current.
FLT007 – Oil pressure.
FLT008 – High discharge temperature.
FLT009 – Phase loss.
FLT010 – Sensor fault.
FLT011 – Communication fault.
FLT012 – Condenser fan VFD fault.
FLT013 – Low refrigerant.

CARRIER 19XR CENTRIFUGAL CHILLER (PIC II/PIC III/Touch Pilot)
SPT – Surge protection trip: Chiller surging. Check: low load condition, low condenser pressure (good thing in centrifugal), chilled water setpoint, hot gas bypass.
HPS – High pressure safety: Condenser pressure exceeded limit. Check cooling tower, condenser water pump, water treatment (scale).
LPS – Low pressure safety: Evaporator pressure too low. Check chilled water flow, setpoint, freeze protection.
OTS – Oil temperature safety: Oil supply temp >180°F. Check oil cooler (water-cooled from condenser), oil heater (must energise 4 hours before start).
LOS – Low oil level: Check sight glass (2/3 full at rest). Add oil if needed — Carrier 6BF or approved.
MOS – Motor over-temperature: Check winding temps, cooling water to motor cooler.
CPA – Compressor motor amp protection: Check voltage balance, winding resistance.
HRT – High return chilled water temperature: Normal alarm only, not shutdown.
WFS – Water flow switch: Check chilled water pump, strainer, flow switch calibration.
FRZ – Freeze protection: LWT <36°F. Check setpoint, glycol, flow.
REV – Phase reversal: Check power.
STF – Start failure: Check prelubrication circuit, oil pressure, starter.
ILP – Inlet guide vane/VSD fault: Check actuator, signal, VSD display.

CHILLER STARTUP CHECKLIST
1. Verify chilled water system filled, purged of air, pressure at design (typically 15–25 psig at chiller).
2. Verify chilled water flow meets minimum GPM (typically 2.4–3.6 GPM/ton depending on ΔT design).
3. Condenser: Air-cooled — clear of debris, fans rotate correct direction. Water-cooled — cooling tower operating, condenser water flow verified, chemical treatment current.
4. Energise oil heater minimum 4 hours before startup (centrifugal and screw chillers). Verify heater operation.
5. Check refrigerant sight glass — full liquid, no bubbles at full load (indicates adequate charge).
6. Verify chilled water setpoint appropriate for load and outdoor conditions.
7. Record startup parameters: EWT/LWT chilled water, EWT/LWT condenser water or ambient, suction pressure, discharge pressure, motor amps (all phases), compressor kW, COP/EER.
8. Compare to design conditions. Adjust setpoints as needed.

CHILLER PERFORMANCE TARGETS
COP targets (at full load, ARI conditions 44°F LCW, 85°F ECW water-cooled):
Scroll: 2.8–3.5 COP (9.6–12 EER).
Screw: 3.2–4.2 COP (10.9–14.3 EER).
Centrifugal: 4.5–6.5 COP (15.4–22.2 EER).
kW/ton: Scroll = 0.97–1.26. Screw = 0.81–1.05. Centrifugal = 0.52–0.75.
IPLV (Integrated Part Load Value) typically 20–40% better than full load.

CONDENSER WATER SYSTEM
Typical design: 85°F entering, 95°F leaving, 3 GPM/ton.
Cooling tower approach: Leaving water temp minus outdoor wet bulb. Target 5–7°F approach.
Water treatment: Check conductivity (target 500–1500 µS/cm), pH (7.0–8.5), inhibitor concentration per water treatment provider spec. Scale reduces efficiency — each 1°F rise in approach = ~2% efficiency loss.
Blowdown: Maintain cycles of concentration 3–5 per water treatment plan.
Legionella: Water-cooled systems require active water management plan per ASHRAE 188.`
}, {
  id: "d11",
  name: "VFD / Variable Frequency Drives — Programming, Fault Codes & Service",
  brand: "General",
  type: "Service Manual",
  tags: ["VFD", "variable frequency drive", "fault codes", "ABB", "Danfoss", "Yaskawa", "Siemens", "Allen-Bradley", "Eaton", "programming", "commissioning"],
  content: `VFD / VARIABLE FREQUENCY DRIVES — HVAC FIELD REFERENCE

VFD OVERVIEW & HVAC APPLICATIONS
A VFD (also called ASD — adjustable speed drive, or inverter) converts fixed AC frequency to variable frequency/voltage to control motor speed. In HVAC: used on supply/return fans, pumps, cooling tower fans, compressors (inverter-driven), and condenser fans.
Energy savings: Fan/pump affinity laws — power varies with cube of speed. 80% speed = 51% power. 50% speed = 12.5% power.
Typical HVAC VFD brands: ABB (ACH/ACS series), Danfoss (FC series), Yaskawa (GA700/J1000), Siemens (G120/G115D), Allen-Bradley/Rockwell (PowerFlex), Eaton (DG1), Schneider/Square D (Altivar).

VFD COMPONENTS
Rectifier section: Converts AC input to DC. Three-phase bridge rectifier typical. DC bus voltage: 1.41 × AC input (e.g., 480V AC → 679V DC bus).
DC bus: Large electrolytic capacitors filter DC. Capacitors age — check ripple voltage. Bulging or leaking caps = replace drive or capacitor bank.
Inverter section: IGBTs switch DC bus to create variable AC output. IGBT failure = drive fault, usually OC or ground fault.
Control board: Microprocessor runs control logic, reads feedback signals, outputs to IGBTs.
Heat sink: Dissipates heat from IGBTs. Must be clean, fins clear, cooling fan operational.

COMMISSIONING A VFD — STANDARD PROCEDURE
1. Verify input voltage matches drive nameplate. Check all phases present and balanced.
2. Motor data entry: Enter motor nameplate data — voltage, FLA (full load amps), RPM, Hz, power factor if available.
3. Motor cable: Max cable length per drive spec (typically 50–300 feet before output reactors needed). Long cables cause reflected wave overvoltage — use output reactor or dV/dt filter if >100ft.
4. Control wiring: Verify analog input (0–10V or 4–20mA), digital inputs (run/stop, speed reference), output signals (run status, fault, actual speed/frequency).
5. Direction of rotation: Jog at low speed (5 Hz), verify motor rotation matches system requirement. Swap any two output phases (T1/T2/T3) to reverse direction — do NOT swap input phases.
6. Acceleration/deceleration ramp: HVAC fans — typically 30–60 seconds acceleration, 30–60 seconds deceleration. Too fast = OC fault. Too slow = extended start time.
7. Minimum speed: Set minimum Hz to prevent motor overheating at low speed. Typical: 15–20 Hz minimum for HVAC fans. Pumps: 20–25 Hz minimum.
8. Maximum speed: Typically 60 Hz (motor nameplate speed). Some systems run 65–70 Hz for additional airflow — verify motor and driven equipment can handle overspeed.
9. Motor protection: Set electronic overload based on motor FLA. Set to 100% of motor FLA.
10. Control source: LOCAL (drive keypad) for commissioning, then switch to REMOTE (BAS/DDC signal) for operation.

ABB ACS/ACH SERIES FAULT CODES (most common HVAC VFDs)
F0001 – Overcurrent (OC): Motor current exceeded trip level. Check: motor winding resistance (disconnect motor leads first — T1/T2/T3), output short circuit, acceleration too fast, motor overloaded. Trip level typically 200% FLA.
F0002 – DC bus overvoltage (OV): DC bus >800V (480V drive) or >400V (208/240V). Check: deceleration too fast (increase decel time), regenerative load (add braking resistor), input line overvoltage.
F0003 – DC bus undervoltage (UV): DC bus < threshold. Check: input voltage too low, momentary power interruption, blown fuse on input.
F0005 – Drive overtemperature (OH): Heat sink temp too high. Check: cooling fan (should spin freely, blowing air OUT of top of drive), ambient temp in panel (max typically 40°C/104°F), fin fouling (clean with compressed air — power off first), drive undersized for load.
F0006 – Motor overload: Drive's electronic overload tripped. Check: actual motor amp draw vs FLA, mechanical load (belt tension, bearing condition, dampers), verify motor FLA set correctly in drive parameters.
F0007 – Communication timeout: Lost signal from BAS/DDC. Check network wiring, termination, BAS output signal.
F0009 – Undervoltage on input: Check utility voltage, main breaker, drive input fuse/CB.
F0011 – Output phase loss: One of three output phases missing. Check T1/T2/T3 connections, motor leads, motor winding continuity.
F0012 – Input phase loss: One of three input phases missing. Check L1/L2/L3, input fuses, upstream breaker.
F0017 – Ground fault (GF): Motor winding shorted to ground, or motor cable insulation failure. Megohm test motor (disconnect VFD first — always). Check cable for physical damage.
F0023 – Earth fault (same as ground fault in some firmware).
F0033 – Drive fault — hardware: Internal drive fault. Cycle power. If persistent: replace drive.
A005 – Drive temperature warning (pre-fault alarm).
A022 – Motor temperature warning (if PTC thermistor connected).

DANFOSS FC102/FC202/FC301/FC302 FAULT CODES (HVAC common)
ALM 1 – 10V supply fault.
ALM 2 – Live zero fault (4–20mA signal lost). Check sensor, signal wiring.
ALM 4 – Mains phase loss: Check input supply.
ALM 5 – DC link voltage high (overvoltage): Add braking resistor or extend decel ramp.
ALM 6 – DC link voltage low (undervoltage): Check input.
ALM 7 – DC overvoltage.
ALM 8 – DC undervoltage.
ALM 9 – Inverter overloaded: Reduce load or increase drive size.
ALM 10 – Motor ETR temperature (electronic thermal relay): Motor overloaded. Check amp draw, mechanical.
ALM 11 – Motor thermistor (PTC): Motor winding overtemp. Check motor cooling, ambient, load.
ALM 12 – Torque limit: Load too heavy. Check mechanical system.
ALM 13 – Overcurrent: Same as F0001 above.
ALM 14 – Earth fault (ground fault): Megohm motor, check cable.
ALM 16 – Short circuit: Output short. Check motor and leads.
ALM 17 – Serial communication timeout: Check BACnet/Modbus/N2 wiring.
ALM 27 – Brake resistor fault (if equipped).
ALM 28 – Brake check fault.
ALM 29 – Drive overtemperature: Check cooling, ambient, fin fouling.
ALM 30 – Motor phase missing: Check T1/T2/T3 and motor connections.
ALM 34 – Fieldbus fault (BACnet/Modbus): Check communication board, wiring.
ALM 38 – Internal fault: Hardware failure. Cycle power, replace if persists.
ALM 47 – 24V supply fault (control card).
ALM 52 – AMA (automatic motor adaptation) failed: Re-run AMA, check motor connections.
ALM 58 – AMA internal fault.
ALM 59 – Current limit: Extended operation at current limit. Check load, size drive correctly.
ALM 65 – Control board overtemperature.
ALM 66 – Heat sink temperature: Check cooling fan in drive, panel temperature.
ALM 68 – Safe stop activated: Check STO (Safe Torque Off) wiring/jumper.
ALM 70 – Illegal frequency: Check setpoint signal and parameter limits.
ALM 80 – Drive initialised to default: All parameters reset — re-program drive.
ALM 90 – Feedback loss: PID feedback signal lost. Check pressure/flow sensor, signal wiring, supply voltage to sensor.
ALM 91 – Analog input out of range: 4–20mA signal <2mA (wiring break) or >21mA.

YASKAWA GA700 / J1000 FAULT CODES
oC (oPE01) – Overcurrent: Same causes as above.
oU – DC bus overvoltage.
Uv – Undervoltage.
oH – Drive overtemperature.
oH3 – Motor overtemperature (PTC).
OL1 – Motor overload (electronic thermal overload).
OL2 – Drive overload: Load exceeds drive rating.
GF – Ground fault.
PF – Input phase loss.
LF – Output phase loss.
CPF – Control circuit fault.
CALL – Communication error.
EF – External fault (digital input triggered fault).
STP – Coast to stop commanded.
bb – Baseblock (drive output disabled by external command).

SIEMENS G120 / SINAMICS FAULT CODES
F07900 – Motor stall/overload.
F07910 – Motor overcurrent.
F07920 – Overcurrent.
F30001 – Overcurrent at power unit.
F30002 – DC link overvoltage.
F30003 – DC link undervoltage.
F30004 – Power unit overtemperature.
F30011 – Input phase failure.
F30012 – Output phase failure.
F30021 – Ground fault.
F30025 – Power unit defect.
A07901 – Motor temperature warning.
A07910 – VFD overtemperature warning.
A30028 – Cooling fan fault.

ALLEN-BRADLEY POWERFLEX 400/525/755 FAULT CODES
F002 – Overcurrent hardware: Check motor, output cables.
F003 – Power loss: Input voltage too low.
F004 – Undervoltage: DC bus low.
F005 – Overvoltage: DC bus high.
F006 – Motor stall: Accelerating too slowly or load too heavy.
F007 – Motor overload (OL1).
F008 – Drive overload.
F012 – HW overcurrent.
F013 – Ground fault.
F021 – Decel inhibit: Overvoltage inhibiting deceleration (no braking resistor).
F025 – Precharge fault.
F033 – Drive overtemperature.
F038 – Phase loss input.
F059 – Output phase loss.
F069 – Speed feedback fault (encoder).
F070 – Communication fault.

VFD FIELD TROUBLESHOOTING QUICK GUIDE
Drive won't start:
1. Check REMOTE/LOCAL control source setting.
2. Verify enable/run input energised (check terminal block).
3. Verify speed reference signal present (0–10V or 4–20mA at reference terminal — measure with meter).
4. Check fault display for active fault. Reset if needed.
5. Check that motor thermal is not tripped.
Motor runs wrong direction: Swap T1/T2 or T2/T3 on OUTPUT terminals only. Never swap input phases to reverse direction.
Overcurrent on start: Increase acceleration time. Check for output short. Check motor windings.
Nuisance overtemperature: Clean heatsink fins with compressed air (drive powered off). Check panel cooling, add ventilation. Verify no recirculation of hot air in panel.
4–20mA signal lost (ALM91/similar): Check sensor supply voltage (typically 24VDC), check 2-wire vs 3-wire wiring, check signal cable for break or ground fault.
BAS communication lost: Check network wiring continuity (shield grounding — ground at one end only), termination resistors (last device on daisy chain must have terminator), device address settings, baud rate match.
Drive trips at high load only: Likely overload. Verify drive kW/HP rating matches or exceeds motor nameplate. Check ambient — every 10°C above 40°C = derate drive capacity ~10%.

VFD BYPASS CONFIGURATION
Manual bypass: Transfers motor directly to utility power. Useful for emergency operation if VFD fails.
Auto-bypass (automatic transfer): Drive faults → automatic transfer to across-the-line start. Program bypass operation carefully — across-the-line current 600% FLA, damaging to motor, load, and ductwork.
Isolation switches: Line side (isolates VFD from power), load side (isolates motor from VFD). Must be both open when servicing VFD. Verify de-energised and locked out.

POWER QUALITY & VFD
Input harmonics: VFDs create harmonic distortion on input. 5th, 7th, 11th, 13th harmonics. Mitigation: Line reactor (5% impedance recommended), 12-pulse converter, active harmonic filter.
Power factor: VFDs draw leading or lagging current depending on loading. Input power factor typically 0.95+ with line reactor.
EMI/RFI: VFDs generate high-frequency noise. Install EMC/EMI filter on input for sensitive environments. Use shielded motor cable for long runs (>50ft). Ground shield at drive end only for output cables.`
}];



function Docs() {
  const [view, setView] = useState("list");
  const [doc, setDoc] = useState(null);
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = DOCS.filter(d => !search || [d.name, d.brand, d.type, ...d.tags].join(" ").toLowerCase().includes(search.toLowerCase()));
  async function askDoc() {
    if (!q.trim()) return;
    setBusy(true);
    setAns("");
    const r = await ai("You are an HVAC technical documentation expert. Answer precisely from the document provided.", `Document: "${doc.name}"\nContent: ${doc.content}\n\nQuestion: ${q}`);
    setAns(r);
    setBusy(false);
  }
  if (view === "read" && doc) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `3px solid ${RED}`,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setView("list");
      setAns("");
      setQ("");
    },
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, doc.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: RED,
      fontWeight: 600
    }
  }, doc.brand, " \xB7 ", doc.type)), /*#__PURE__*/React.createElement("button", {
    onClick: () => _nav.go && _nav.go("home"),
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 12
    }
  }, doc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      background: "rgba(227,6,19,.12)",
      border: `1px solid rgba(227,6,19,.25)`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 10,
      color: RED,
      fontWeight: 600
    }
  }, t))), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2,
        fontWeight: 700,
        marginBottom: 8
      }
    }, "CONTENT"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: GTXT1,
        lineHeight: 1.7
      }
    }, doc.content))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      border: `1px solid rgba(227,6,19,.3)`
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        background: RED,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16
      }
    }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: TXT
      }
    }, "Ask AI About This Document"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2
      }
    }, "AI answers from this document specifically"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2,
        marginBottom: 6,
        fontWeight: 600
      }
    }, "QUICK QUESTIONS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, ["What are the fault codes?", "What PPE is required?", "Startup steps?", "Electrical specs?"].map(qk => /*#__PURE__*/React.createElement("button", {
      key: qk,
      onClick: () => {
        setQ(qk);
      },
      style: {
        background: GREY1,
        border: `1px solid ${GREY2}`,
        borderRadius: 20,
        padding: "5px 10px",
        cursor: "pointer",
        fontSize: 10,
        color: GTXT1
      }
    }, qk)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      onKeyDown: e => {
        if (e.key === "Enter") askDoc();
      },
      placeholder: "Ask a question\u2026",
      style: {
        flex: 1,
        background: GREY1,
        border: `1px solid ${GREY2}`,
        borderRadius: 10,
        padding: "10px 12px",
        color: TXT,
        fontSize: 13,
        outline: "none"
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: askDoc,
      disabled: !q.trim() || busy,
      style: {
        background: RED,
        border: "none",
        borderRadius: 10,
        padding: "0 16px",
        cursor: "pointer",
        color: TXT,
        fontWeight: 700,
        fontSize: 13,
        opacity: !q.trim() || busy ? .4 : 1
      }
    }, busy ? "…" : "Ask")), busy && /*#__PURE__*/React.createElement(Spin, {
      label: "Reading\u2026"
    }), ans && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(227,6,19,.06)",
        border: `1px solid rgba(227,6,19,.2)`,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 13,
        color: TXT,
        lineHeight: 1.7,
        whiteSpace: "pre-wrap"
      }
    }, ans))
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "DOCUMENT LIBRARY",
    sub: "MANUALS \xB7 FAULT CODES \xB7 SOPs",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "\uD83D\uDD0D Search\u2026",
    style: {
      width: "100%",
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "10px 12px",
      color: TXT,
      fontSize: 13,
      outline: "none",
      marginBottom: 12,
      fontFamily: "inherit"
    }
  }), filtered.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    onClick: () => {
      setDoc(d);
      setView("read");
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT,
      marginBottom: 5
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: RED,
      borderRadius: 5,
      padding: "2px 8px",
      fontSize: 10,
      color: TXT,
      fontWeight: 700
    }
  }, d.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: GTXT2,
      fontWeight: 600
    }
  }, d.brand), d.tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontSize: 9,
      background: GREY1,
      color: GTXT2,
      borderRadius: 10,
      padding: "2px 7px"
    }
  }, t)))))));
}

// ── DEMO MODE ─────────────────────────────────────────────────────────────
const DEMO_STEPS = [
  {
    id: "intro",
    title: "Welcome to MTS Assistant",
    subtitle: "JLL HVAC AI Field Tool",
    desc: "An AI expert in every engineer's pocket. Let's walk through a real job scenario.",
    icon: "🔧",
    duration: 3000,
  },
  {
    id: "problem",
    title: "The Problem",
    subtitle: "What techs face every day",
    desc: "A Carrier RTU showing fault code E79. High pressure lockout. Unit is down. Building is hot. What do you do?",
    icon: "⚠️",
    duration: 4000,
  },
  {
    id: "diagnosis",
    title: "Step 1 — Fault Diagnosis",
    subtitle: "AI DIAGNOSTIC AGENT",
    desc: "Enter the fault code, equipment, and symptoms. The AI ranks probable causes by likelihood and gives a step-by-step procedure.",
    icon: "🔍",
    duration: 3500,
    demo: {
      type: "agent",
      fields: [
        { label: "Equipment", value: "RTU — Carrier 48XC060" },
        { label: "Fault Code", value: "E79" },
        { label: "Refrigerant", value: "R-410A" },
        { label: "Symptoms", value: "High pressure lockout. Condenser fan running. Unit off on high pressure." },
      ],
      result: `TOP CAUSES — E79 HIGH PRESSURE LOCKOUT

1. 🔴 Dirty/blocked condenser coil (65%) — Check coil for debris, cottonwood, dirt buildup. Measure discharge pressure — target <430 psig at 95°F ambient.

2. 🟡 Condenser fan motor fault (20%) — Verify fan RPM, check amp draw vs nameplate (1.0–2.5A). Check capacitor µF within ±6%.

3. 🟢 Refrigerant overcharge (10%) — Check subcooling. Target 10–15°F. If >18°F, recover excess charge.

IMMEDIATE CHECKS
⚠️ Verify supply voltage within ±10% before starting
• Check discharge pressure with manifold gauges
• Inspect condenser coil — clean if needed
• Verify all condenser fans running correct direction

SAFETY
⚠️ Lock out / tag out before opening electrical panel
⚠️ R-410A at 95°F: discharge ~430 psig — wear safety glasses and gloves`
    }
  },
  {
    id: "safety",
    title: "Step 2 — Safety Briefing",
    subtitle: "PRE-JOB SAFETY AGENT",
    desc: "One tap pre-fills from the diagnosis. Generates task-specific PPE list, LOTO procedure, and hazard checklist.",
    icon: "🦺",
    duration: 3500,
    demo: {
      type: "agent",
      fields: [
        { label: "Job Type", value: "Fault Diagnosis — RTU" },
        { label: "Location", value: "Rooftop" },
        { label: "Refrigerant", value: "R-410A" },
        { label: "Hazards", value: "Electrical >50V · Refrigerant present · Height >6ft" },
      ],
      result: `⚠️ CRITICAL SAFETY WARNINGS
• Working at height on rooftop — fall arrest required
• R-410A at operating pressure — cryogenic PPE required
• Electrical panels >240V — NFPA 70E Category 2 minimum

🦺 REQUIRED PPE
• Safety glasses ANSI Z87.1 — mandatory
• Cryogenic gloves for refrigerant handling
• Hard hat — rooftop work
• High-vis vest — occupied building
• Steel-toe boots ASTM F2413
• Fall harness + lanyard — anchor to rated point
• Arc flash gear 8 cal/cm² for electrical work

🔐 LOTO PROCEDURE
1. Notify building manager — unit going offline
2. Locate main disconnect at unit
3. Turn to OFF position
4. Apply personal lock — tag with name and date
5. Verify de-energised with CAT III meter L1-L2-L3
6. Test before touch

✅ PRE-JOB CHECKLIST
☐ PPE donned and inspected
☐ Fall protection anchored
☐ LOTO applied and verified
☐ Manifold gauges connected
☐ Leak detector calibrated
☐ Phone charged, supervisor notified`
    }
  },
  {
    id: "parts",
    title: "Step 3 — Parts Finder",
    subtitle: "OEM PARTS + NEARBY SUPPLIERS",
    desc: "GPS locates nearby Johnstone, Wesco, and Grainger. AI returns OEM part numbers, compatible alternatives, and pricing.",
    icon: "🔩",
    duration: 3500,
    demo: {
      type: "parts",
      result: `CONDENSER FAN MOTOR — Carrier 48XC060

OEM PART: HC39GE237 (Carrier/Bryant)
• 1/4 HP, 208-230V, 1-phase, 1100 RPM
• 48 frame, 1 speed, CCW rotation
• Typical price: $185–$220

COMPATIBLE ALTERNATIVES
1. Fasco D7909 — Direct replacement, same specs — $95–$115
2. Mars 10587 — 1/4HP 1100RPM 48fr — $89–$105
3. AO Smith FD6001 — OEM equiv, 5yr warranty — $110–$130

KEY SPECS TO VERIFY
• Rotation: CCW (viewed from shaft end)
• Shaft diameter: 1/2"
• Frame: 48, totally enclosed

📍 STORES NEAR YOU
🔴 Johnstone Supply — 2.1 miles — open now
🟠 Grainger — 3.8 miles — open now
🔵 Wesco — 5.2 miles — open now`
    }
  },
  {
    id: "closing",
    title: "Step 4 — Closing Comment",
    subtitle: "WORK ORDER SUMMARY",
    desc: "AI writes a professional CMMS-ready closing comment. One tap to copy into any work order system.",
    icon: "📋",
    duration: 3500,
    demo: {
      type: "closing",
      result: `Responded to high pressure lockout fault (E79) on rooftop Carrier 48XC RTU. Found condenser coil heavily fouled with cottonwood and debris, causing restricted airflow and elevated head pressure. Cleaned condenser coil with coil cleaner and low-pressure rinse. Verified all three condenser fans operational with correct amp draw. Checked refrigerant charge — subcooling 12°F, within spec. Reset high pressure lockout and tested unit through full cooling cycle. Unit operating normally at time of departure with discharge pressure 415 psig at 92°F ambient. Recommend quarterly coil cleaning to prevent recurrence.`
    }
  },
  {
    id: "more",
    title: "And there's more…",
    subtitle: "FULL FEATURE SET",
    desc: "11 technical documents with AI Q&A · Belt & PT calculators · Equipment log · Refrigerant charging · Predictive maintenance",
    icon: "📱",
    duration: 3500,
  },
  {
    id: "impact",
    title: "The Impact",
    subtitle: "WHY THIS MATTERS FOR JLL MTS",
    desc: "Faster fault resolution · Consistent safety compliance · Accurate work orders · Knowledge in every engineer's hands · Zero paper, zero phone calls",
    icon: "🚀",
    duration: 4000,
  },
];

function DemoMode({ onExit }) {
  const [step, setStep] = React.useState(0);
  const [phase, setPhase] = React.useState("title"); // title | fields | result
  const [fieldIdx, setFieldIdx] = React.useState(0);
  const [typedText, setTypedText] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const timerRef = React.useRef(null);
  const typeRef = React.useRef(null);

  const current = DEMO_STEPS[step];
  const progress = ((step) / (DEMO_STEPS.length - 1)) * 100;

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typeRef.current) clearInterval(typeRef.current);
  }

  function typeText(text, onDone) {
    setTypedText("");
    let i = 0;
    const speed = text.length > 200 ? 8 : 18;
    typeRef.current = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typeRef.current);
        if (onDone) onDone();
      }
    }, speed);
  }

  function goToStep(idx) {
    clearTimers();
    setStep(idx);
    setPhase("title");
    setFieldIdx(0);
    setTypedText("");
    setShowResult(false);
  }

  function next() { if (step < DEMO_STEPS.length - 1) goToStep(step + 1); }
  function prev() { if (step > 0) goToStep(step - 1); }

  React.useEffect(() => {
    if (!autoPlay) return;
    const s = DEMO_STEPS[step];
    clearTimers();
    setPhase("title");
    setShowResult(false);
    setTypedText("");
    setFieldIdx(0);

    if (!s.demo) {
      // Simple slide — auto advance
      timerRef.current = setTimeout(() => {
        if (step < DEMO_STEPS.length - 1) goToStep(step + 1);
      }, s.duration);
    } else {
      // Demo slide — animate fields then result
      timerRef.current = setTimeout(() => {
        setPhase("fields");
        let fi = 0;
        function nextField() {
          if (fi < s.demo.fields.length) {
            setFieldIdx(fi);
            fi++;
            timerRef.current = setTimeout(nextField, 600);
          } else {
            timerRef.current = setTimeout(() => {
              setPhase("result");
              typeText(s.demo.result, () => {
                setShowResult(true);
                timerRef.current = setTimeout(() => {
                  if (step < DEMO_STEPS.length - 1) goToStep(step + 1);
                }, 2500);
              });
            }, 500);
          }
        }
        nextField();
      }, 1200);
    }
    return () => clearTimers();
  }, [step, autoPlay]);

  const isDark = _darkMode;
  const bg = isDark ? "#0a0a0a" : "#f4f4f5";
  const card = isDark ? "#161616" : "#ffffff";
  const border = isDark ? "#2a2a2a" : "#d4d4d8";
  const txt = isDark ? "#ffffff" : "#111111";
  const txt2 = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
  const txt3 = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  return React.createElement("div", {style:{
    position:"fixed", inset:0, zIndex:10000,
    background:bg, display:"flex", flexDirection:"column",
    fontFamily:"system-ui,-apple-system,sans-serif"
  }},

    /* Top bar */
    React.createElement("div", {style:{
      background: isDark?"#000":card,
      borderBottom:`3px solid ${RED}`,
      padding:"10px 16px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexShrink:0
    }},
      React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8}},
        React.createElement("div", {style:{
          background:RED, borderRadius:6, padding:"3px 8px",
          fontSize:10, fontWeight:900, color:"#fff", letterSpacing:".1em"
        }}, "▶ DEMO"),
        React.createElement("div", {style:{fontSize:12,fontWeight:700,color:RED}},
          `${step + 1} / ${DEMO_STEPS.length}`)
      ),
      React.createElement("div", {style:{display:"flex",gap:8,alignItems:"center"}},
        React.createElement("button", {
          onClick:()=>setAutoPlay(p=>!p),
          style:{background:autoPlay?"rgba(227,6,19,.15)":"rgba(255,255,255,.08)",
            border:`1px solid ${autoPlay?RED:border}`,
            borderRadius:20, padding:"4px 12px",
            fontSize:11, fontWeight:700,
            color:autoPlay?RED:txt2, cursor:"pointer", fontFamily:"inherit"}
        }, autoPlay ? "⏸ Pause" : "▶ Play"),
        React.createElement("button", {
          onClick:onExit,
          style:{background:"none",border:`1px solid ${border}`,
            borderRadius:20, padding:"4px 12px",
            fontSize:11, fontWeight:700, color:txt2,
            cursor:"pointer", fontFamily:"inherit"}
        }, "✕ Exit")
      )
    ),

    /* Progress bar */
    React.createElement("div", {style:{height:3,background:border,flexShrink:0}},
      React.createElement("div", {style:{
        height:"100%", background:RED,
        width:progress+"%",
        transition:"width 0.6s ease"
      }})
    ),

    /* Main content */
    React.createElement("div", {style:{
      flex:1, overflowY:"auto", padding:"20px 16px 16px",
      display:"flex", flexDirection:"column", gap:14
    }},

      /* Step icon + title */
      React.createElement("div", {style:{textAlign:"center",paddingBottom:4}},
        React.createElement("div", {style:{
          width:64,height:64,
          background:isDark?"rgba(227,6,19,.12)":"rgba(227,6,19,.08)",
          border:`2px solid rgba(227,6,19,.3)`,
          borderRadius:18,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:30,margin:"0 auto 12px"
        }}, current.icon),
        React.createElement("div", {style:{
          fontSize:20,fontWeight:900,color:txt,
          letterSpacing:".01em",lineHeight:1.2,marginBottom:4
        }}, current.title),
        React.createElement("div", {style:{
          fontSize:11,color:RED,fontWeight:700,letterSpacing:".1em"
        }}, current.subtitle)
      ),

      /* Description */
      React.createElement("div", {style:{
        background:card, border:`1px solid ${border}`,
        borderRadius:14,padding:"14px 16px",
        fontSize:14, color:txt2, lineHeight:1.7, textAlign:"center"
      }}, current.desc),

      /* Demo fields */
      current.demo && (phase==="fields"||phase==="result") && React.createElement("div", {style:{
        background:card, border:`1px solid ${border}`,
        borderRadius:14, padding:14
      }},
        React.createElement("div", {style:{
          fontSize:10,color:RED,fontWeight:700,
          letterSpacing:".1em",marginBottom:10
        }}, "INPUT"),
        current.demo.fields && current.demo.fields.slice(0, fieldIdx+1).map((f,i)=>
          React.createElement("div", {key:i,style:{
            display:"flex",gap:8,padding:"6px 0",
            borderBottom:i<fieldIdx?`1px solid ${border}`:"none",
            animation:"fadeIn 0.3s ease"
          }},
            React.createElement("div", {style:{
              fontSize:11,color:txt3,fontWeight:700,
              minWidth:90,flexShrink:0
            }}, f.label),
            React.createElement("div", {style:{
              fontSize:12,color:txt,fontWeight:600,flex:1
            }}, f.value)
          )
        )
      ),

      /* Typing result */
      phase==="result" && current.demo && React.createElement("div", {style:{
        background:isDark?"#0d0d0d":card,
        border:`1px solid ${showResult?RED:border}`,
        borderRadius:14, padding:14,
        fontSize:12, color:txt, lineHeight:1.8,
        whiteSpace:"pre-wrap",
        transition:"border-color 0.4s ease",
        position:"relative"
      }},
        showResult && React.createElement("div", {style:{
          position:"absolute",top:-10,right:14,
          background:RED,borderRadius:20,
          padding:"2px 10px",fontSize:9,fontWeight:700,color:"#fff"
        }}, "✓ COMPLETE"),
        typedText,
        !showResult && React.createElement("span", {style:{
          display:"inline-block",width:2,height:14,
          background:RED,marginLeft:2,
          animation:"bounce 0.7s infinite"
        }})
      ),

      /* Nav buttons */
      React.createElement("div", {style:{display:"flex",gap:10,marginTop:4}},
        React.createElement("button", {
          onClick:prev, disabled:step===0,
          style:{
            flex:1,background:card,border:`1px solid ${border}`,
            borderRadius:12,padding:"12px",cursor:step===0?"not-allowed":"pointer",
            fontSize:14,color:step===0?txt3:txt,fontFamily:"inherit",
            opacity:step===0?.4:1
          }
        }, "← Prev"),
        step < DEMO_STEPS.length-1
          ? React.createElement("button", {
              onClick:()=>{setAutoPlay(false);next();},
              style:{
                flex:2,background:RED,border:"none",
                borderRadius:12,padding:"12px",cursor:"pointer",
                fontSize:14,fontWeight:700,color:"#fff",fontFamily:"inherit",
                boxShadow:"0 4px 14px rgba(227,6,19,.4)"
              }
            }, "Next →")
          : React.createElement("button", {
              onClick:onExit,
              style:{
                flex:2,background:RED,border:"none",
                borderRadius:12,padding:"12px",cursor:"pointer",
                fontSize:14,fontWeight:700,color:"#fff",fontFamily:"inherit",
                boxShadow:"0 4px 14px rgba(227,6,19,.4)"
              }
            }, "🚀 Try It Live")
    ),

      /* Step dots */
      React.createElement("div", {style:{
        display:"flex",justifyContent:"center",gap:6,paddingBottom:8
      }},
        DEMO_STEPS.map((_,i)=>React.createElement("button",{
          key:i,
          onClick:()=>{setAutoPlay(false);goToStep(i);},
          style:{
            width:i===step?20:6,height:6,
            borderRadius:3,border:"none",cursor:"pointer",
            background:i===step?RED:border,
            transition:"all 0.3s ease",padding:0
          }
        }))
      )
    )
  );
}

// ── PT CHART ─────────────────────────────────────────────────────────────
const PT = {
  "R-410A": [[40, 83], [50, 102], [60, 123], [70, 147], [80, 174], [90, 205], [100, 238], [110, 275], [120, 315]],
  "R-22": [[20, 37], [30, 47], [40, 59], [50, 72], [60, 87], [70, 103], [80, 121], [90, 141], [100, 163]],
  "R-32": [[40, 90], [50, 111], [60, 134], [70, 160], [80, 189], [90, 221], [100, 256], [110, 294], [120, 335]],
  "R-454B": [[40, 83], [50, 102], [60, 124], [70, 148], [80, 175], [90, 205], [100, 238], [110, 274], [120, 314]],
  "R-407C": [[40, 72], [50, 89], [60, 108], [70, 129], [80, 152], [90, 178], [100, 207], [110, 238], [120, 272]],
  "R-134a": [[20, 26], [30, 35], [40, 46], [50, 59], [60, 73], [70, 90], [80, 110], [90, 132], [100, 157]]
};

// ── BELT CALCULATOR ─────────────────────────────────────────────────────
function BeltCalc() {
  const [dDriver, setDDriver] = React.useState("");
  const [dDriven, setDDriven] = React.useState("");
  const [cDist,   setCDist]   = React.useState("");
  const [unit,    setUnit]    = React.useState("in");
  const [result,  setResult]  = React.useState(null);

  const STD = {
    "A":  [26,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,52,54,56,58,60,62,64,66,68,72,75,78,80,84,90,96],
    "B":  [35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,78,80,81,82,83,84,85,86,87,88,90,92,95,96,100,103,105,108,110,112,120,128,144],
    "C":  [51,52,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,92,95,96,100,105,108,110,112,115,120,122,124,128,132,136,138,140,144,150,158,162,168,180,195,210,240,270],
    "D":  [90,96,102,105,108,110,112,115,120,122,124,128,133,136,138,140,144,150,158,162,168,180,195,210,240,270,300,330,360,390],
    "4L": [25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,64,66,68,70,72,75,78,80,84,90,96],
    "5L": [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,54,56,58,60,62,64,66,68,70,72,74,75,76,78,80,82,84,86,88,90,92,95,96,100,105,110,115,120,130,140],
  };
  const MIN_PULLEY = {A:3,B:5,C:7,D:12,"4L":3,"5L":4.5};

  function toIn(v) { const n=parseFloat(v); return unit==="mm"?n/25.4:n; }

  function calc() {
    const D=toIn(dDriver), d=toIn(dDriven), C=toIn(cDist);
    if ([D,d,C].some(x=>isNaN(x)||x<=0)) { setResult({err:"Enter valid positive values for all fields."}); return; }
    if (C < (D+d)/2) { setResult({err:"Center distance too small — pulleys would overlap. Check measurements."}); return; }
    const Lc = 2*C + (Math.PI/2)*(D+d) + Math.pow(D-d,2)/(4*C);
    const ratio = D/d;
    const wrap  = 180 - 60*(D-d)/C;
    const sects = Object.keys(MIN_PULLEY).filter(s=>D>=MIN_PULLEY[s]);
    let matches=[];
    sects.forEach(s=>{
      const sorted=[...STD[s]].sort((a,b)=>Math.abs(a-Lc)-Math.abs(b-Lc)).slice(0,3);
      sorted.forEach(sl=>{
        const bv=4*sl-2*Math.PI*(D+d);
        const disc=bv*bv-32*Math.pow(D-d,2);
        if(disc>=0){ const Ca=(bv+Math.sqrt(disc))/16; matches.push({s,sl,pn:s+sl,diff:sl-Lc,Ca,Cadj:Ca-C}); }
      });
    });
    matches.sort((a,b)=>Math.abs(a.diff)-Math.abs(b.diff));
    const seen=new Set(), top=matches.filter(m=>{if(seen.has(m.pn))return false;seen.add(m.pn);return true;}).slice(0,5);
    setResult({Lc:Lc.toFixed(2),ratio:ratio.toFixed(2),wrap:wrap.toFixed(1),top});
  }

  const u = unit==="in" ? '"' : "mm";

  return React.createElement("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},
    React.createElement(Hdr,{title:"BELT CALCULATOR",sub:"V-BELT SIZE FROM MEASUREMENTS"}),
    React.createElement("div",{style:{flex:1,overflowY:"auto",padding:14}},

      /* Unit toggle */
      React.createElement("div",{style:{display:"flex",gap:8,marginBottom:14}},
        ["in","mm"].map(u2=>React.createElement("button",{key:u2,
          onClick:()=>{setUnit(u2);setResult(null);},
          style:{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",
            fontWeight:700,fontSize:13,fontFamily:"inherit",
            background:unit===u2?RED:GREY1,color:unit===u2?"#fff":TXT}
        }, u2==="in"?"Inches":"Millimetres"))
      ),

      /* SVG diagram */
      React.createElement("div",{style:{background:GREY1,border:"1px solid "+GREY2,borderRadius:14,padding:14,marginBottom:14,textAlign:"center"}},
        React.createElement("svg",{viewBox:"0 0 300 120",width:"100%",style:{maxWidth:300,display:"block",margin:"0 auto"}},
          React.createElement("circle",{cx:62,cy:60,r:46,fill:"none",stroke:RED,strokeWidth:3}),
          React.createElement("circle",{cx:62,cy:60,r:3,fill:RED}),
          React.createElement("text",{x:62,y:118,textAnchor:"middle",fill:GTXT1,fontSize:10},"Driver (motor)"),
          React.createElement("text",{x:62,y:12,textAnchor:"middle",fill:RED,fontSize:11,fontWeight:"bold"},dDriver?dDriver+u:"D"),
          React.createElement("circle",{cx:228,cy:60,r:28,fill:"none",stroke:GTXT1,strokeWidth:3}),
          React.createElement("circle",{cx:228,cy:60,r:3,fill:GTXT1}),
          React.createElement("text",{x:228,y:104,textAnchor:"middle",fill:GTXT1,fontSize:10},"Driven (blower)"),
          React.createElement("text",{x:228,y:12,textAnchor:"middle",fill:GTXT1,fontSize:11,fontWeight:"bold"},dDriven?dDriven+u:"d"),
          React.createElement("line",{x1:62,y1:14,x2:228,y2:32,stroke:_darkMode?"rgba(255,200,0,.5)":"rgba(200,100,0,.5)",strokeWidth:2,strokeDasharray:"5,3"}),
          React.createElement("line",{x1:62,y1:106,x2:228,y2:88,stroke:_darkMode?"rgba(255,200,0,.5)":"rgba(200,100,0,.5)",strokeWidth:2,strokeDasharray:"5,3"}),
          React.createElement("line",{x1:62,y1:60,x2:228,y2:60,stroke:GREY2,strokeWidth:1,strokeDasharray:"4,3"}),
          React.createElement("text",{x:145,y:52,textAnchor:"middle",fill:GTXT2,fontSize:10},cDist?cDist+u+" C-C":"C = center-to-center")
        ),
        React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:6}},"Measure pulley OD and shaft-to-shaft center distance")
      ),

      /* Inputs */
      React.createElement("div",{style:{background:GREY1,border:"1px solid "+GREY2,borderTop:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:14,marginBottom:10,boxShadow:"0 2px 12px rgba(0,0,0,.4)"}},
        React.createElement("div",{style:{fontSize:11,color:RED,fontWeight:700,marginBottom:12,letterSpacing:".08em"}},"MEASUREMENTS"),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"DRIVER OD ("+u+")"),
            React.createElement("input",{type:"number",step:"0.125",min:"0",value:dDriver,
              onChange:e=>{setDDriver(e.target.value);setResult(null);},
              placeholder:unit==="in"?"e.g. 6.5":"e.g. 165",
              style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
            React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Motor / fan shaft side")
          ),
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"DRIVEN OD ("+u+")"),
            React.createElement("input",{type:"number",step:"0.125",min:"0",value:dDriven,
              onChange:e=>{setDDriven(e.target.value);setResult(null);},
              placeholder:unit==="in"?"e.g. 10":"e.g. 254",
              style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
            React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Blower / equipment side")
          )
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"CENTER-TO-CENTER DISTANCE ("+u+")"),
          React.createElement("input",{type:"number",step:"0.25",min:"0",value:cDist,
            onChange:e=>{setCDist(e.target.value);setResult(null);},
            placeholder:unit==="in"?"e.g. 22.5":"e.g. 572",
            style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
          React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Shaft center to shaft center")
        )
      ),

      React.createElement(Btn,{red:true,c:"⚙️  Calculate Belt Size",disabled:!dDriver||!dDriven||!cDist,
        style:{width:"100%",padding:13,marginBottom:14},onClick:calc}),

      /* Error */
      result&&result.err&&React.createElement("div",{style:{background:"rgba(227,6,19,.12)",border:"1px solid rgba(227,6,19,.4)",borderRadius:12,padding:14,fontSize:13,color:"#ff6b6b"}},result.err),

      /* Results */
      result&&!result.err&&React.createElement(React.Fragment,null,

        /* Stats row */
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}},
          [{l:"CALC LENGTH",v:result.Lc+'"',s:"outside circumference"},
           {l:"SPEED RATIO",v:result.ratio+":1",s:"driver : driven"},
           {l:"WRAP ANGLE",v:result.wrap+"°",s:"on smaller pulley"}
          ].map(x=>React.createElement("div",{key:x.l,style:{background:GREY1,border:"1px solid "+GREY2,borderTop:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"10px 6px",textAlign:"center"}},
            React.createElement("div",{style:{fontSize:15,fontWeight:900,color: TXT,lineHeight:1,marginBottom:3}},x.v),
            React.createElement("div",{style:{fontSize:9,color:GTXT2,letterSpacing:".04em"}},x.s)
          ))
        ),

        /* Match list */
        React.createElement("div",{style:{fontSize:11,color:RED,fontWeight:700,letterSpacing:".08em",marginBottom:8}},"RECOMMENDED BELT SIZES"),
        result.top.map((m,i)=>React.createElement("div",{key:m.pn,style:{
          background:i===0?"rgba(227,6,19,.1)":GREY1,
          border:"1px solid "+(i===0?RED:GREY2),
          borderLeft:"4px solid "+(i===0?RED:GREY3),
          borderRadius:12,padding:"12px 14px",marginBottom:8,
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }},
          React.createElement("div",null,
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4}},
              React.createElement("div",{style:{fontSize:20,fontWeight:900,color:i===0?RED:TXT}},m.pn),
              i===0&&React.createElement("div",{style:{background:RED,borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color: TXT}},"BEST MATCH")
            ),
            React.createElement("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
              React.createElement("div",{style:{fontSize:11,color:GTXT2}},"Length: ",React.createElement("span",{style:{color: TXT,fontWeight:600}},m.sl+'"')),
              React.createElement("div",{style:{fontSize:11,color:GTXT2}},"Section: ",React.createElement("span",{style:{color: TXT,fontWeight:600}},m.s)),
              React.createElement("div",{style:{fontSize:11,color:m.diff>0?"#F39C12":m.diff<0?"#2980B9":GTXT2}},
                m.diff>0?"+"+m.diff.toFixed(2)+'" longer':m.diff<0?m.diff.toFixed(2)+'" shorter':"Exact match")
            )
          ),
          React.createElement("div",{style:{textAlign:"right",flexShrink:0,marginLeft:8}},
            React.createElement("div",{style:{fontSize:10,color:GTXT3,marginBottom:2}},"adj C-C"),
            React.createElement("div",{style:{fontSize:13,fontWeight:700,color: TXT}},m.Ca.toFixed(2)+'"'),
            React.createElement("div",{style:{fontSize:10,color:m.Cadj>0?"#F39C12":"#2980B9"}},
              m.Cadj>0?"+"+m.Cadj.toFixed(2)+'" out':m.Cadj.toFixed(2)+'" in')
          )
        )),

        /* Tips */
        React.createElement("div",{style:{background:"rgba(39,174,96,.07)",border:"1px solid rgba(39,174,96,.25)",borderRadius:12,padding:12,marginTop:4}},
          React.createElement("div",{style:{fontSize:11,color:"#27AE60",fontWeight:700,marginBottom:6}},"⚙️  FIELD TIPS"),
          ["Wrap a tape or string around both pulleys to double-check the calculated length.",
           "Adjust motor base or tensioner to set the adjusted center distance for your chosen belt.",
           "Wrap angle below 120° — consider adding a belt idler to improve grip.",
           "Always replace matched sets together — never mix old and new on multi-belt drives.",
           "Correct tension: belt deflects ½\" per foot of span under moderate thumb pressure."
          ].map((t,i)=>React.createElement("div",{key:i,style:{fontSize:11,color: GTXT1,marginBottom:i<4?4:0,lineHeight:1.5,paddingLeft:12,position:"relative"}},
            React.createElement("span",{style:{position:"absolute",left:0,color:"#27AE60"}},"·"),t
          ))
        ),

        React.createElement("button",{onClick:()=>{setDDriver("");setDDriven("");setCDist("");setResult(null);},
          style:{width:"100%",background:GREY1,border:"1px solid "+GREY2,borderRadius:10,
            padding:11,cursor:"pointer",fontSize:13,color:GTXT1,fontFamily:"inherit",marginTop:12}
        },"↩  New Calculation")
      )
    )
  );
}

function PTChart() {
  const [ref, setRef] = useState("R-410A");
  const [temp, setTemp] = useState("");
  const [press, setPress] = useState("");
  const [result, setResult] = useState(null);
  function calc() {
    const d = PT[ref];
    if (temp !== "") {
      const t = parseFloat(temp);
      if (isNaN(t)) {
        setResult({
          type: "Error",
          output: "Invalid temperature"
        });
        return;
      }
      // Clamp to table range
      if (t <= d[0][0]) {
        setResult({
          type: "Temp→Press",
          input: t + "°F",
          output: d[0][1].toFixed(1) + " psig"
        });
        return;
      }
      if (t >= d[d.length - 1][0]) {
        setResult({
          type: "Temp→Press",
          input: t + "°F",
          output: d[d.length - 1][1].toFixed(1) + " psig"
        });
        return;
      }
      for (let i = 0; i < d.length - 1; i++) {
        if (t >= d[i][0] && t <= d[i + 1][0]) {
          const r = d[i][1] + (d[i + 1][1] - d[i][1]) * (t - d[i][0]) / (d[i + 1][0] - d[i][0]);
          setResult({
            type: "Temp→Press",
            input: t + "°F",
            output: r.toFixed(1) + " psig"
          });
          return;
        }
      }
    }
    if (press !== "") {
      const p = parseFloat(press);
      if (isNaN(p)) {
        setResult({
          type: "Error",
          output: "Invalid pressure"
        });
        return;
      }
      if (p <= d[0][1]) {
        setResult({
          type: "Press→Temp",
          input: p + " psig",
          output: d[0][0].toFixed(1) + "°F"
        });
        return;
      }
      if (p >= d[d.length - 1][1]) {
        setResult({
          type: "Press→Temp",
          input: p + " psig",
          output: d[d.length - 1][0].toFixed(1) + "°F"
        });
        return;
      }
      for (let i = 0; i < d.length - 1; i++) {
        if (p >= d[i][1] && p <= d[i + 1][1]) {
          const r = d[i][0] + (d[i + 1][0] - d[i][0]) * (p - d[i][1]) / (d[i + 1][1] - d[i][1]);
          setResult({
            type: "Press→Temp",
            input: p + " psig",
            output: r.toFixed(1) + "°F"
          });
          return;
        }
      }
    }
    setResult({
      type: "Error",
      output: "Out of range"
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "PT CHART",
    sub: "PRESSURE-TEMPERATURE",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Sel, {
    label: "REFRIGERANT",
    val: ref,
    set: r => {
      setRef(r);
      setResult(null);
    },
    opts: Object.keys(PT)
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: RED,
        fontWeight: 700,
        marginBottom: 12
      }
    }, "ENTER ONE VALUE"), /*#__PURE__*/React.createElement(Inp, {
      label: "TEMPERATURE (\xB0F)",
      val: temp,
      set: v => {
        setTemp(v);
        setPress("");
      },
      ph: "e.g. 45",
      type: "number"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        color: GTXT2,
        fontSize: 12,
        margin: "4px 0 12px"
      }
    }, "\u2014 or \u2014"), /*#__PURE__*/React.createElement(Inp, {
      label: "PRESSURE (psig)",
      val: press,
      set: v => {
        setPress(v);
        setTemp("");
      },
      ph: "e.g. 130",
      type: "number"
    }), /*#__PURE__*/React.createElement(Btn, {
      red: true,
      c: "Calculate",
      onClick: calc,
      disabled: !temp && !press,
      style: {
        width: "100%",
        marginTop: 4
      }
    }))
  }), result && /*#__PURE__*/React.createElement(Card, {
    style: {
      background: result.type === "Error" ? "rgba(227,6,19,.12)" : "rgba(39,174,96,.12)",
      border: `1px solid ${result.type === "Error" ? "rgba(227,6,19,.4)" : "rgba(39,174,96,.4)"}`
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT2,
        marginBottom: 4
      }
    }, ref, " \xB7 ", result.type), result.input && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: GTXT1,
        marginBottom: 4
      }
    }, "Input: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: TXT
      }
    }, result.input)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        color: result.type === "Error" ? RED : "#27AE60"
      }
    }, result.output))
  })));
}

// ── NOTES ────────────────────────────────────────────────────────────────
function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    S.get("notes").then(r => setNotes(JSON.parse(r.value))).catch(() => {});
  }, []);
  async function add() {
    if (!text.trim()) return;
    const n = [{
      id: gid(),
      title: title || "Note",
      body: text,
      ts: Date.now()
    }, ...notes];
    setNotes(n);
    setText("");
    setTitle("");
    await S.set("notes", JSON.stringify(n));
  }
  async function del(id) {
    const n = notes.filter(x => x.id !== id);
    setNotes(n);
    await S.set("notes", JSON.stringify(n));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "JOB NOTES",
    sub: "FIELD NOTES",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Inp, {
      label: "TITLE",
      val: title,
      set: setTitle,
      ph: "Optional"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "NOTE",
      val: text,
      set: setText,
      ph: "Write your note\u2026",
      rows: 3
    }), /*#__PURE__*/React.createElement(Btn, {
      red: true,
      c: "+ Add Note",
      onClick: add,
      disabled: !text.trim(),
      style: {
        width: "100%"
      }
    }))
  }), notes.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 40,
      color: GTXT2
    }
  }, "No notes yet"), notes.map(n => /*#__PURE__*/React.createElement(Card, {
    key: n.id,
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: TXT
      }
    }, n.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2
      }
    }, ago(n.ts), " ago"), /*#__PURE__*/React.createElement("button", {
      onClick: () => del(n.id),
      style: {
        background: "none",
        border: "none",
        color: GTXT3,
        cursor: "pointer",
        fontSize: 16
      }
    }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT1,
        lineHeight: 1.6
      }
    }, n.body))
  }))));
}

// ── MODELS ───────────────────────────────────────────────────────────────
// ── EQUIPMENT LOG ─────────────────────────────────────────────────────────
function EquipmentLog() {
  const [sites, setSites] = useState([]);
  const [view, setView] = useState("sites"); // sites | addSite | siteDetail | addEquip | equipDetail
  const [activeSite, setActiveSite] = useState(null);
  const [activeEquip, setActiveEquip] = useState(null);

  // Site form
  const [siteName, setSiteName] = useState("");
  const [siteAddr, setSiteAddr] = useState("");
  const [siteContact, setSiteContact] = useState("");

  // Equipment form
  const [eqBrand, setEqBrand] = useState("");
  const [eqModel, setEqModel] = useState("");
  const [eqSerial, setEqSerial] = useState("");
  const [eqType, setEqType] = useState("");
  const [eqLocation, setEqLocation] = useState("");
  const [eqVoltage, setEqVoltage] = useState("");
  const [eqRefrig, setEqRefrig] = useState("");
  const [eqTonnage, setEqTonnage] = useState("");
  const [eqFilterSize, setEqFilterSize] = useState("");
  const [eqFilterQty, setEqFilterQty] = useState("");
  const [eqFilterType, setEqFilterType] = useState("");
  const [eqBeltSize, setEqBeltSize] = useState("");
  const [eqBeltQty, setEqBeltQty] = useState("");
  const [eqNotes, setEqNotes] = useState("");
  useEffect(() => {
    S.get("equip-log").then(r => setSites(JSON.parse(r.value))).catch(() => {});
  }, []);
  async function persist(updated) {
    setSites(updated);
    await S.set("equip-log", JSON.stringify(updated));
  }
  function resetEqForm() {
    setEqBrand("");
    setEqModel("");
    setEqSerial("");
    setEqType("");
    setEqLocation("");
    setEqVoltage("");
    setEqRefrig("");
    setEqTonnage("");
    setEqFilterSize("");
    setEqFilterQty("");
    setEqFilterType("");
    setEqBeltSize("");
    setEqBeltQty("");
    setEqNotes("");
  }
  async function addSite() {
    if (!siteName.trim()) return;
    const s = {
      id: gid(),
      name: siteName,
      address: siteAddr,
      contact: siteContact,
      equipment: [],
      ts: Date.now()
    };
    const updated = [s, ...sites];
    await persist(updated);
    setSiteName("");
    setSiteAddr("");
    setSiteContact("");
    setView("sites");
  }
  async function delSite(id) {
    await persist(sites.filter(s => s.id !== id));
  }
  async function addEquip() {
    if (!eqModel.trim() && !eqBrand.trim()) return;
    const eq = {
      id: gid(),
      brand: eqBrand,
      model: eqModel,
      serial: eqSerial,
      type: eqType,
      location: eqLocation,
      voltage: eqVoltage,
      refrigerant: eqRefrig,
      tonnage: eqTonnage,
      filterSize: eqFilterSize,
      filterQty: eqFilterQty,
      filterType: eqFilterType,
      beltSize: eqBeltSize,
      beltQty: eqBeltQty,
      notes: eqNotes,
      ts: Date.now()
    };
    const updated = sites.map(s => s.id === activeSite.id ? {
      ...s,
      equipment: [eq, ...s.equipment]
    } : s);
    await persist(updated);
    setActiveSite(updated.find(s => s.id === activeSite.id));
    resetEqForm();
    setView("siteDetail");
  }
  async function delEquip(siteId, eqId) {
    const updated = sites.map(s => s.id === siteId ? {
      ...s,
      equipment: s.equipment.filter(e => e.id !== eqId)
    } : s);
    await persist(updated);
    setActiveSite(updated.find(s => s.id === siteId));
    setView("siteDetail");
  }
  const ROW = (label, val) => val ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${GREY2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2,
      fontWeight: 700,
      minWidth: 110,
      flexShrink: 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: TXT,
      flex: 1,
      wordBreak: "break-word"
    }
  }, val)) : null;
  const SECTION = (title, color = RED) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: color,
      fontWeight: 700,
      letterSpacing: ".1em",
      marginTop: 14,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottom: `1px solid ${color}33`
    }
  }, title);

  // ── SITE LIST ──
  if (view === "sites") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "EQUIPMENT LOG",
    sub: "BY SITE / ADDRESS",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "+ Add Site",
    onClick: () => setView("addSite"),
    style: {
      width: "100%",
      marginBottom: 14
    }
  }), sites.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 40,
      color: GTXT2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83C\uDFE2"), /*#__PURE__*/React.createElement("div", null, "No sites yet. Add a site to start logging equipment.")), sites.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => {
      setActiveSite(s);
      setView("siteDetail");
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      cursor: "pointer",
      textAlign: "left",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: TXT,
      marginBottom: 3
    }
  }, s.name), s.address && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT1,
      marginBottom: 2
    }
  }, "\uD83D\uDCCD ", s.address), s.contact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2
    }
  }, "\uD83D\uDC64 ", s.contact)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 4,
      marginLeft: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `rgba(227,6,19,.15)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      color: RED,
      fontWeight: 700
    }
  }, s.equipment.length, " unit", s.equipment.length !== 1 ? "s" : ""), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      delSite(s.id);
    },
    style: {
      background: "none",
      border: "none",
      color: GTXT3,
      cursor: "pointer",
      fontSize: 16,
      padding: "2px 4px"
    }
  }, "\xD7")))))));

  // ── ADD SITE ──
  if (view === "addSite") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "ADD SITE",
    sub: "NEW LOCATION",
    onBack: () => setView("sites")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Inp, {
    label: "SITE NAME *",
    val: siteName,
    set: setSiteName,
    ph: "e.g. Tower One, 123 Main St"
  }), /*#__PURE__*/React.createElement(Inp, {
    label: "ADDRESS",
    val: siteAddr,
    set: setSiteAddr,
    ph: "Full address"
  }), /*#__PURE__*/React.createElement(Inp, {
    label: "CONTACT / MANAGER",
    val: siteContact,
    set: setSiteContact,
    ph: "Name and phone"
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "Save Site",
    onClick: addSite,
    disabled: !siteName.trim(),
    style: {
      width: "100%",
      marginTop: 4
    }
  })));

  // ── SITE DETAIL ──
  if (view === "siteDetail" && activeSite) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: activeSite.name,
    sub: activeSite.address || "SITE EQUIPMENT",
    onBack: () => setView("sites")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, activeSite.contact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: GTXT2,
      marginBottom: 12
    }
  }, "\uD83D\uDC64 ", activeSite.contact), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "+ Add Equipment",
    onClick: () => {
      resetEqForm();
      setView("addEquip");
    },
    style: {
      width: "100%",
      marginBottom: 14
    }
  }), activeSite.equipment.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 30,
      color: GTXT2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", null, "No equipment logged yet.")), activeSite.equipment.map(eq => /*#__PURE__*/React.createElement("button", {
    key: eq.id,
    onClick: () => {
      setActiveEquip(eq);
      setView("equipDetail");
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left",
      borderLeft: `3px solid ${RED}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT
    }
  }, eq.brand, " ", eq.model), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 3,
      flexWrap: "wrap"
    }
  }, eq.type && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      background: "rgba(227,6,19,.12)",
      color: RED,
      borderRadius: 4,
      padding: "1px 7px",
      fontWeight: 700
    }
  }, eq.type), eq.location && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT2
    }
  }, "\uD83D\uDCCD ", eq.location), eq.serial && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT2
    }
  }, "S/N ", eq.serial)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 4,
      flexWrap: "wrap"
    }
  }, eq.filterSize && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT1
    }
  }, "\uD83D\uDD32 Filter: ", eq.filterSize, eq.filterQty ? " ×" + eq.filterQty : ""), eq.beltSize && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT1
    }
  }, "\u2699\uFE0F Belt: ", eq.beltSize, eq.beltQty ? " ×" + eq.beltQty : ""))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: GTXT2,
      fontSize: 16,
      marginLeft: 8
    }
  }, "\u203A"))))));

  // ── ADD EQUIPMENT ──
  if (view === "addEquip") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "ADD EQUIPMENT",
    sub: activeSite?.name || "",
    onBack: () => setView("siteDetail")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: RED,
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "UNIT INFO"), /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT TYPE",
      val: eqType,
      set: setEqType,
      opts: ["RTU", "Chiller", "Split System", "Heat Pump", "VRF/VRV", "Air Handler", "FCU", "Furnace", "Boiler", "Condenser", "Mini-Split", "DOAS", "Cooling Tower", "Exhaust Fan"]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "BRAND",
      val: eqBrand,
      set: setEqBrand,
      opts: BRANDS
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "MODEL #",
      val: eqModel,
      set: setEqModel,
      ph: "e.g. 48XC024"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "SERIAL #",
      val: eqSerial,
      set: setEqSerial,
      ph: "e.g. 1234A"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "TONNAGE / CAPACITY",
      val: eqTonnage,
      set: setEqTonnage,
      ph: "e.g. 5T / 100MBH"
    })), /*#__PURE__*/React.createElement(Inp, {
      label: "LOCATION ON SITE",
      val: eqLocation,
      set: setEqLocation,
      ph: "e.g. Rooftop NW corner, Rm 202"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "REFRIGERANT",
      val: eqRefrig,
      set: setEqRefrig,
      opts: REFS
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "VOLTAGE",
      val: eqVoltage,
      set: setEqVoltage,
      ph: "e.g. 208/230V 3ph"
    })))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#F39C12",
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "\uD83D\uDD32 FILTERS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "FILTER SIZE",
      val: eqFilterSize,
      set: setEqFilterSize,
      ph: "e.g. 20\xD725\xD72, 16\xD725\xD71"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "QTY",
      val: eqFilterQty,
      set: setEqFilterQty,
      ph: "e.g. 4",
      type: "number"
    })), /*#__PURE__*/React.createElement(Sel, {
      label: "FILTER TYPE",
      val: eqFilterType,
      set: setEqFilterType,
      opts: ["MERV 8 Pleated", "MERV 11 Pleated", "MERV 13 Pleated", "MERV 16 Pleated", "HEPA", "Fiberglass 1\"", "Washable", "Carbon / Odor", "Bag Filter", "Mini-Pleat", "Electrostatic"]
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#2980B9",
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "\u2699\uFE0F BELTS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "BELT SIZE / PART #",
      val: eqBeltSize,
      set: setEqBeltSize,
      ph: "e.g. A38, 4L380, B-section"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "QTY",
      val: eqBeltQty,
      set: setEqBeltQty,
      ph: "e.g. 2",
      type: "number"
    })))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT1,
        fontWeight: 700,
        marginBottom: 8,
        letterSpacing: ".08em"
      }
    }, "NOTES"), /*#__PURE__*/React.createElement(Inp, {
      label: "",
      val: eqNotes,
      set: setEqNotes,
      ph: "Special notes, last service date, known issues\u2026",
      rows: 3
    }))
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "Save Equipment",
    onClick: addEquip,
    disabled: !eqModel.trim() && !eqBrand.trim(),
    style: {
      width: "100%",
      padding: 13
    }
  })));

  // ── EQUIPMENT DETAIL ──
  if (view === "equipDetail" && activeEquip) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: `${activeEquip.brand || ""} ${activeEquip.model || "Equipment"}`.trim(),
    sub: activeSite?.name || "",
    onBack: () => setView("siteDetail")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, activeEquip.type && /*#__PURE__*/React.createElement("span", {
    style: {
      background: `rgba(227,6,19,.15)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      color: RED,
      fontWeight: 700
    }
  }, activeEquip.type), activeEquip.location && /*#__PURE__*/React.createElement("span", {
    style: {
      background: GREY1,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      color: GTXT1
    }
  }, "\uD83D\uDCCD ", activeEquip.location)), /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("UNIT INFO"), ROW("Brand", activeEquip.brand), ROW("Model", activeEquip.model), ROW("Serial #", activeEquip.serial), ROW("Tonnage", activeEquip.tonnage), ROW("Voltage", activeEquip.voltage), ROW("Refrigerant", activeEquip.refrigerant))
  }), (activeEquip.filterSize || activeEquip.filterType) && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("FILTERS", "#F39C12"), ROW("Filter size", activeEquip.filterSize), ROW("Quantity", activeEquip.filterQty), ROW("Filter type", activeEquip.filterType))
  }), activeEquip.beltSize && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("BELTS", "#2980B9"), ROW("Belt size / part #", activeEquip.beltSize), ROW("Quantity", activeEquip.beltQty))
  }), activeEquip.notes && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("NOTES", "rgba(255,255,255,.4)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT1,
        lineHeight: 1.7,
        marginTop: 6
      }
    }, activeEquip.notes))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => delEquip(activeSite.id, activeEquip.id),
    style: {
      width: "100%",
      background: "rgba(227,6,19,.08)",
      border: `1px solid rgba(227,6,19,.3)`,
      borderRadius: 12,
      padding: 12,
      color: RED,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Delete Equipment"))));
  return null;
}

// ── MAIN APP ─────────────────────────────────────────────────────────────
function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [chatView, setChatView] = useState("list");
  const [agentView, setAgentView] = useState("hub");
  const [toolView, setToolView] = useState("hub");
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [wCtx, setWCtx] = useState({});
  const [showDemo, setShowDemo] = useState(false);
  useTheme(); // re-render App on theme change, which re-renders all children
  useEffect(() => {
    init();
  }, []);
  const busyRef = useRef(false);
  const newChatInProgress = useRef(false);
  useEffect(() => {
    _nav.go = nav;
  }); // keep global nav ref current every render
  async function init() {
    try {
      const p = await S.get("profile");
      if (p?.value) setProfile(JSON.parse(p.value));
    } catch {}
    try {
      const keys = await S.list("chat:");
      const loaded = [];
      for (const k of keys) {
        try {
          const r = await S.get(k);
          if (r?.value) loaded.push(JSON.parse(r.value));
        } catch {}
      }
      loaded.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(loaded);
    } catch {}
    setLoading(false);
    setTimeout(() => {
      const s = document.getElementById("splash");
      if (s) {
        s.style.opacity = "0";
        setTimeout(() => s.remove(), 500);
      }
    }, 2200);
  }
  async function doOnboard(p) {
    setProfile(p);
    await S.set("profile", JSON.stringify(p));
  }
  async function startChat(prompt) {
    if (busyRef.current || newChatInProgress.current) return;
    newChatInProgress.current = true;
    const c = {id: gid(), title: prompt.length > 40 ? prompt.slice(0,40)+"…" : prompt, messages: [], updatedAt: Date.now()};
    const snapshot = [c, ...chats];
    setChats(snapshot);
    setActiveId(c.id);
    setChatView("chat");
    setTab("chat");
    newChatInProgress.current = false;
    try { await S.set("chat:" + c.id, JSON.stringify(c)); } catch(e) {}
    await sendMsg(prompt, c.id, snapshot);
  }
  async function newChat() {
    if (newChatInProgress.current) return;
    newChatInProgress.current = true;
    try {
      const c = {
        id: gid(),
        title: "New Job",
      messages: [],
      updatedAt: Date.now()
    };
    setChats(prev => [c, ...prev]);
    setActiveId(c.id);
    setChatView("chat");
    setTab("chat");
      try { await S.set("chat:" + c.id, JSON.stringify(c)); } catch(e) {}
    } finally {
      newChatInProgress.current = false;
    }
  }
  async function delChat(id) {
    const u = chats.filter(c => c.id !== id);
    setChats(u);
    if (activeId === id) {
      setActiveId(null);
      setChatView("list");
    }
    await S.del("chat:" + id);
  }
  const activeChat = chats.find(c => c.id === activeId);
  async function sendMsg(text, _chatId, _chats) {
    const currentId = _chatId || activeId;
    const currentChats = _chats || chats;
    if (!text || !currentId) return;
    if (busyRef.current) return; // prevent double-send
    busyRef.current = true;
    setBusy(true);
    const currentChat = currentChats.find(c => c.id === currentId);
    if (!currentChat) {
      busyRef.current = false;
      setBusy(false);
      return;
    }
    try {
    const msg = {
      role: "user",
      content: text
    };
    const msgs = [...(currentChat.messages || []), msg];
    const title = (currentChat.messages || []).length === 0 ? text.length > 40 ? text.slice(0, 40) + "…" : text : currentChat.title;
    const updated = {
      ...currentChat,
      title,
      messages: msgs,
      updatedAt: Date.now()
    };
    setChats(prev => prev.map(c => c.id === currentId ? updated : c));
    try { await S.set("chat:" + currentId, JSON.stringify(updated)); } catch(e) {}
    const sys = `You are MTS Assistant — an expert AI field assistant for JLL Managed Technology Services HVAC engineers.

Your role: help technicians in the field solve problems fast. Be their expert colleague on the job.

You specialize in:
- HVAC fault diagnosis (RTUs, chillers, split systems, VRF/VRV, heat pumps, boilers, furnaces, FCUs)
- Refrigerant systems (R-410A, R-22, R-32, R-454B, R-407C, R-134a) — charging, leak detection, EPA 608
- Electrical troubleshooting (controls, contactors, capacitors, boards, low-voltage wiring)
- Preventive maintenance procedures and schedules
- OEM and compatible part numbers (Carrier, Trane, York, Lennox, Daikin, Mitsubishi, Rheem, Burnham)
- Safety protocols — PPE, LOTO, NFPA 70E arc flash, OSHA, confined space
- Service report writing and job documentation
- Pressure-temperature relationships, superheat and subcooling calculations
- Belt and filter sizing, equipment specifications

Response style:
- Be concise and direct — techs are in the field, not at a desk
- Use numbered steps for procedures
- Flag ALL safety hazards with ⚠️ at the start of the relevant step
- Give specific values, part numbers, and torque specs when you know them
- If you're not certain about a specific model detail, say so clearly
- Prioritize safety over speed — never skip safety steps to save time
${profile ? `\nTechnician: ${profile.name}${profile.region ? `, ${profile.region}` : ""}` : ""}`;

    // Build full conversation history for multi-turn context
    const history = msgs.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{
        text: m.content
      }]
    }));
    const reply = await ai(sys, text, 2, history);
    const withReply = {
      ...updated,
      messages: [...msgs, {
        role: "assistant",
        content: reply
      }],
      updatedAt: Date.now()
    };
    setChats(prev => prev.map(c => c.id === currentId ? withReply : c).sort((a, b) => b.updatedAt - a.updatedAt));
    try { await S.set("chat:" + currentId, JSON.stringify(withReply)); } catch(e) {}
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function nav(t, sub) {
    setTab(t);
    if (t === "chat") setChatView("list");
    if (t === "agents") setAgentView(sub || "hub");
    if (t === "tools") setToolView(sub || "hub");
  }
  if (loading) return null;
  if (!profile) return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: doOnboard
  });
  if (showDemo) return /*#__PURE__*/React.createElement(DemoMode, {
    onExit: () => setShowDemo(false)
  });
  const TABS = [{
    id: "home",
    i: "🏠",
    l: "Home"
  }, {
    id: "chat",
    i: "💬",
    l: "Chat"
  }, {
    id: "agents",
    i: "🤖",
    l: "Agents"
  }, {
    id: "docs",
    i: "📚",
    l: "Docs"
  }, {
    id: "tools",
    i: "🛠️",
    l: "Tools"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: BG,
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      width: "100%",
      overflow: "hidden",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, tab === "home" && /*#__PURE__*/React.createElement(Dashboard, {
    profile: profile,
    jobs: chats.length,
    onNewJob: newChat,
    onStartChat: startChat,
    onNav: nav,
    onDemo: () => setShowDemo(true)
  }), tab === "chat" && chatView === "list" && /*#__PURE__*/React.createElement(ChatList, {
    chats: chats,
    onOpen: id => {
      setActiveId(id);
      setChatView("chat");
    },
    onCreate: newChat,
    onStartChat: startChat,
    onDel: delChat
  }), tab === "chat" && chatView === "chat" && /*#__PURE__*/React.createElement(ChatConvo, {
    chat: activeChat,
    onBack: () => setChatView("list"),
    onSend: sendMsg,
    busy: busy,
  }), tab === "agents" && agentView === "hub" && /*#__PURE__*/React.createElement(AgentsHub, {
    onSel: v => setAgentView(v),
    onHome: () => nav("home")
  }), tab === "agents" && agentView !== "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `1px solid ${BORDER}`,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: "none",
      border: "none",
      borderRight: `1px solid ${BORDER}`,
      padding: "10px 14px",
      color: GTXT1,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAgentView("hub"),
    style: {
      background: "none",
      border: "none",
      padding: "10px 16px",
      color: RED,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      flex: 1,
      textAlign: "left"
    }
  }, "\u2190 All Agents")), agentView === "diag" && /*#__PURE__*/React.createElement(DiagAgent, {
    ctx: wCtx,
    setCtx: c => setWCtx(p => ({
      ...p,
      ...c
    })),
    onChain: id => setAgentView(id)
  }), agentView === "predict" && /*#__PURE__*/React.createElement(PredAgent, null), agentView === "parts" && /*#__PURE__*/React.createElement(PartsAgent, {
    ctx: wCtx
  }), agentView === "refcalc" && /*#__PURE__*/React.createElement(RefAgent, null), agentView === "safety" && /*#__PURE__*/React.createElement(SafetyAgent, {
    ctx: wCtx
  }), agentView === "report" && /*#__PURE__*/React.createElement(ClosingComment, {
    ctx: wCtx,
    profile: profile
  })), tab === "docs" && /*#__PURE__*/React.createElement(Docs, null), tab === "tools" && toolView === "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `3px solid ${RED}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: TXT
    }
  }, "TOOLS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 600,
      marginTop: 2
    }
  }, "FIELD TOOLS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 14,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      alignContent: "start"
    }
  }, [{
    id: "pt",
    i: "🌡️",
    l: "PT Chart",
    d: "Pressure-temp calculator"
  }, {
    id: "belt",
    i: "⚙️",
    l: "Belt Calculator",
    d: "Size belt from pulley measurements"
  }, {
    id: "equip",
    i: "🏢",
    l: "Equipment Log",
    d: "Sites, units, filters, belts"
  }, {
    id: "notes",
    i: "📝",
    l: "Job Notes",
    d: "Field notes"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setToolView(t.id),
    style: {
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: 16,
      cursor: "pointer",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, t.i), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT
    }
  }, t.l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: GTXT2,
      lineHeight: 1.4
    }
  }, t.d))))), tab === "tools" && toolView !== "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `1px solid ${BORDER}`,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: "none",
      border: "none",
      borderRight: `1px solid ${BORDER}`,
      padding: "10px 14px",
      color: GTXT1,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setToolView("hub"),
    style: {
      background: "none",
      border: "none",
      padding: "10px 16px",
      color: RED,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      flex: 1,
      textAlign: "left"
    }
  }, "\u2190 All Tools")), toolView === "pt" && /*#__PURE__*/React.createElement(PTChart, null), toolView === "belt" && /*#__PURE__*/React.createElement(BeltCalc, null), toolView === "equip" && /*#__PURE__*/React.createElement(EquipmentLog, null), toolView === "notes" && /*#__PURE__*/React.createElement(Notes, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: _darkMode?"linear-gradient(180deg,#0a0a0a 0%,#000 100%)":"#ffffff",
      borderTop: `1px solid rgba(227,6,19,${_darkMode?".25":".3"})`,
      display: "flex",
      flexShrink: 0,
      boxShadow: "0 -1px 0 rgba(227,6,19,.15), 0 -20px 40px rgba(0,0,0,.8), inset 0 1px 0 rgba(227,6,19,.08)"
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => nav(t.id),
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      padding: "8px 2px 6px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      color: tab === t.id ? RED : _darkMode ? GTXT2 : "rgba(0,0,0,0.45)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, t.i), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".03em"
    }
  }, t.l), tab === t.id && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 2,
      background: RED,
      borderRadius: 1,
      marginTop: 1
    }
  })))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));

