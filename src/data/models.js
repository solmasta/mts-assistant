export const HVAC_SYSTEMS = {
  chillers: ['Carrier', 'Trane', 'York', 'Daikin'],
  air_handlers: ['AAON', 'McQuay', 'ClimateMaster'],
  rtus: ['Mitsubishi', 'LG', 'Fujitsu'],
  vrf: ['Daikin VRV', 'Mitsubishi City Multi'],
  boilers: ['Weil-McLain', 'Burnham', 'Lochinvar'],
};

export const PARTS_DATABASE = {
  filters: {
    'MERV-8': {
      sizes: ['16x25', '20x25', '24x24'],
      brands: ['Honeywell', '3M'],
    },
    HEPA: {
      sizes: ['24x24', '24x48'],
      brands: ['Camfil', 'AAF'],
    },
  },
  belts: {
    'AX-Series': {
      lengths: ['A38', 'A42', 'A46'],
      applications: ['AHUs', 'RTUs'],
    },
    '3L-Series': {
      lengths: ['3L300', '3L400'],
      applications: ['Small Fans'],
    },
  },
};

export const EQUIPMENT_TYPES = ['chiller', 'ahu', 'rtu', 'vrf'];

export const EQUIPMENT_SCHEMA = {
  id: 'string',
  type: 'chiller | ahu | rtu | vrf',
  brand: 'string',
  model: 'string',
  serial: 'string',
  location: {
    site: 'string',
    building: 'string',
    floor: 'string',
  },
  installation_date: 'Date',
  last_service: 'Date',
  service_history: 'Array<ServiceRecord>',
  specifications: 'Object',
  manual_url: 'string',
};

export const SERVICE_RECORD_SCHEMA = {
  id: 'string',
  equipment_id: 'string',
  date: 'Date',
  technician: 'string',
  work_performed: 'string',
  parts_used: 'Array<Part>',
  hours: 'number',
  notes: 'string',
  photos: 'Array<string>',
};

export const PARTS_INVENTORY_SCHEMA = {
  part_number: 'string',
  description: 'string',
  oem_number: 'string',
  generic_equivalent: 'string',
  quantity: 'number',
  location: 'string',
  suppliers: 'Array<Supplier>',
  price: 'number',
  last_ordered: 'Date',
};

export const SUPPLIER_SCHEMA = {
  name: 'string',
  contact: 'string',
  phone: 'string',
  lead_time_days: 'number',
};

export const SAMPLE_EQUIPMENT = [
  {
    id: 'EQ-1001',
    type: 'chiller',
    brand: 'Carrier',
    model: '30RB',
    serial: 'CH-001',
    location: { site: 'Main Campus', building: 'Plant', floor: 'Mechanical' },
    installation_date: '2022-01-01',
    last_service: '2025-06-15',
    service_history: [],
    specifications: { tonnage: '20', voltage: '460V' },
    manual_url: 'https://example.com/manuals/carrier-30rb',
  },
];

export const SAMPLE_SERVICE_RECORDS = [];
export const SAMPLE_PARTS = [];
