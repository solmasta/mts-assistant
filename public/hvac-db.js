// HVAC Equipment Database
window.HVAC_EQUIPMENT_DB = {
  manufacturers: [
    { id: 'trane', name: 'Trane', logo: 'trane.png' },
    { id: 'carrier', name: 'Carrier', logo: 'carrier.png' },
    { id: 'york', name: 'York', logo: 'york.png' },
    { id: 'daikin', name: 'Daikin', logo: 'daikin.png' },
    { id: 'lennox', name: 'Lennox', logo: 'lennox.png' },
    { id: 'mitsubishi', name: 'Mitsubishi Electric', logo: 'mitsubishi.png' },
    { id: 'fujitsu', name: 'Fujitsu', logo: 'fujitsu.png' },
    { id: 'goodman', name: 'Goodman', logo: 'goodman.png' },
    { id: 'rheem', name: 'Rheem', logo: 'rheem.png' },
    { id: 'american_standard', name: 'American Standard', logo: 'american_standard.png' }
  ],
  equipmentTypes: [
    {
      id: 'rtu',
      name: 'Roof Top Unit',
      subtypes: ['Single Zone', 'Multi Zone', 'VAV', 'Heat Pump'],
      commonIssues: ['Compressor failure', 'Fan motor issues', 'Capacitor failure', 'Refrigerant leaks', 'Control board problems'],
      maintenanceSchedule: {
        monthly: ['Check filters', 'Clean coils', 'Check belts'],
        quarterly: ['Check electrical connections', 'Test safety controls'],
        annually: ['Full system inspection', 'Refrigerant charge check']
      }
    },
    {
      id: 'ahu',
      name: 'Air Handling Unit',
      subtypes: ['Draw-thru', 'Blow-thru', 'Horizontal', 'Vertical'],
      commonIssues: ['Blower motor failure', 'Coil freezing', 'Drain pan clogging', 'Damper motor failure']
    },
    { id: 'chiller', name: 'Chiller', subtypes: ['Centrifugal', 'Screw', 'Scroll', 'Absorption'], commonIssues: ['Low refrigerant', 'Oil pressure problems', 'Condenser fouling'] },
    { id: 'boiler', name: 'Boiler', subtypes: ['Fire-tube', 'Water-tube', 'Condensing', 'Electric'], commonIssues: ['Heat exchanger cracks', 'Burner problems', 'Water level issues'] },
    { id: 'vrf', name: 'VRF System', subtypes: ['Heat Pump', 'Heat Recovery', '2-pipe', '3-pipe'], commonIssues: ['Communication errors', 'Refrigerant leaks', 'Expansion valve failure'] }
  ],
  partsDatabase: [
    {
      id: 'compressor_001',
      name: 'Scroll Compressor',
      type: 'compressor',
      manufacturer: 'Copeland',
      models: ['ZP21K5E-PFV', 'ZR28K5E-PFV'],
      specs: { refrigerant: 'R410A', voltage: '208-230V', phase: '1', capacity: '2-5 tons' },
      crossReference: [{ brand: 'Trane', part: 'CGTN2421ALC' }, { brand: 'Carrier', part: 'HPS24G241A' }],
      troubleshooting: ['Check for grounded windings', 'Verify proper voltage', 'Check capacitor']
    },
    { id: 'motor_001', name: 'Blower Motor', type: 'motor', manufacturer: 'GE', models: ['5KCP39PG'], specs: { hp: '1/3', rpm: '1075', voltage: '115V' } },
    { id: 'capacitor_001', name: 'Dual Run Capacitor', type: 'capacitor', manufacturer: 'AmRad', models: ['RUND44'], specs: { mfd: '44+5', voltage: '440V' } }
  ],
  beltCalculations: {
    calculateVbeltLength: function(pulley1, pulley2, centerDistance) {
      var L = 2 * centerDistance + 1.57 * (pulley1 + pulley2) + Math.pow((pulley2 - pulley1), 2) / (4 * centerDistance);
      return Math.round(L * 100) / 100;
    },
    calculateBeltSpeed: function(motorRPM, motorPulley, fanPulley) {
      var ratio = motorPulley / fanPulley;
      var fanRPM = motorRPM * ratio;
      return Math.round(fanRPM);
    },
    calculateBeltTension: function(hp, rpm, beltLength) {
      var torque = (hp * 5252) / rpm;
      var tension = (2 * torque) / (beltLength / 12);
      return Math.round(tension);
    }
  },
  refrigerants: [
    { type: 'R410A', pressureTemp: [{ temp: 40, pressure: 118 }, { temp: 60, pressure: 172 }], properties: { gwp: 2088, safety: 'A1', oil: 'POE' } },
    { type: 'R134a', pressureTemp: [{ temp: 40, pressure: 37 }, { temp: 60, pressure: 59 }], properties: { gwp: 1430, safety: 'A1', oil: 'POE/PAG' } }
  ],
  faultCodes: {
    trane: [{ code: 'E01', description: 'Room Temperature Sensor Fault', solution: 'Check sensor wiring and resistance' }, { code: 'E03', description: 'High Pressure Fault', solution: 'Check refrigerant charge' }],
    carrier: [{ code: '33', description: 'Low Pressure Switch Open', solution: 'Check refrigerant charge' }],
    daikin: [{ code: 'E6', description: 'Communication Error', solution: 'Check wiring between indoor/outdoor units' }]
  }
};
