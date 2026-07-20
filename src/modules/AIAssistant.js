// HVAC AI Assistant
export class AIAssistant {
    constructor() {
      this.context = { userRole: "technician", experienceLevel: "intermediate" };
      this.knowledgeBase = {
        troubleshooting: {
          'no cooling': ['Check thermostat settings','Verify condenser fan operation','Check compressor amp draw','Measure refrigerant pressures','Inspect filter condition'],
          'no heat': ['Check gas valve operation','Verify igniter spark','Check flame sensor','Test limit switches','Inspect heat exchanger']
        },
        maintenanceChecklists: {
          monthly: ['Change filters','Check thermostat operation','Listen for unusual noises','Check condensate drain','Verify proper airflow']
        }
      };
    }
    async processQuery(query, context) {
      var q = (query||'').toLowerCase();
      if (q.includes('pressure') || q.includes('psi')) return this.handlePressureQuery(query);
      if (q.includes('belt') || q.includes('pulley')) return this.handleBeltQuery(query);
      // fallback
      return { type: 'general', message: "I can help with belt calculations, pressure conversions, troubleshooting, and parts lookup." };
    }
    handleBeltQuery(query) {
      return { type: 'belt_info', formula: 'V-Belt Length = 2C + 1.57(D+d) + (D-d)^2/4C', variables: { C: 'Center distance (in)', D: 'Large pulley (in)', d: 'Small pulley (in)' } };
    }
    handlePressureQuery() {
      return { type: 'pressure_data', commonPressures: { 'R410A @70F':201,'R410A @75F':217,'R410A @80F':233 }, unit: 'PSIG' };
    }
  }

export default AIAssistant;
