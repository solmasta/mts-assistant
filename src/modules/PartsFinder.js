// Parts Finder System
import { HVACEquipmentDB } from './HVACEquipmentDB';

export class PartsFinder {
    constructor() {
      this.partsDatabase = (HVACEquipmentDB && HVACEquipmentDB.partsDatabase) || [];
      this.crossReferenceDB = this.buildCrossReference();
    }
    buildCrossReference() {
      var crossRef = {};
      (this.partsDatabase||[]).forEach(function(part){
        if (part.crossReference) part.crossReference.forEach(function(ref){
          crossRef[ref.brand] = crossRef[ref.brand] || {};
          crossRef[ref.brand][ref.part] = { original: part.name, manufacturer: part.manufacturer, originalPart: part.id, specs: part.specs };
        });
      });
      return crossRef;
    }
    search(query, filters) {
      filters = filters || {};
      var results = [];
      var q = (query||'').toLowerCase();
      (this.partsDatabase||[]).forEach(function(part){
        if (((part.id||'')+ ' ' + (part.name||'') + ' ' + (part.models||[]).join(' ')).toLowerCase().includes(q)) {
          if (PartsFinder.prototype.matchesFilters(part, filters)) results.push(Object.assign({matchType:'direct',relevance:100},part));
        }
      });
      // cross-ref
      Object.entries(this.crossReferenceDB||{}).forEach(([brand, parts])=>{
        Object.entries(parts).forEach(([partNum, info])=>{
          if (partNum.toLowerCase().includes(q) || brand.toLowerCase().includes(q)) {
            var originalPart = (this.partsDatabase||[]).find(p=>p.id===info.originalPart);
            if (originalPart && PartsFinder.prototype.matchesFilters(originalPart, filters)) results.push(Object.assign({crossReference:[{brand,part:partNum}],matchType:'cross-reference',relevance:90}, originalPart));
          }
        });
      });
      return results.sort((a,b)=>(b.relevance||0)-(a.relevance||0));
    }
    matchesFilters(part, filters){
      if (!filters) return true;
      if (filters.type && part.type!==filters.type) return false;
      if (filters.manufacturer && part.manufacturer!==filters.manufacturer) return false;
      if (filters.voltage && part.specs && part.specs.voltage!==filters.voltage) return false;
      return true;
    }
    getAlternativeParts(partId){
      var part = (this.partsDatabase||[]).find(p=>p.id===partId);
      if (!part) return [];
      var alternatives = [];
      alternatives = alternatives.concat((this.partsDatabase||[]).filter(p=>p.type===part.type && p.id!==partId && p.specs && part.specs && Math.abs(parseFloat((p.specs.capacity||'0').toString().match(/(\d+(?:\.\d+)?)/)||[0,0])[1] - parseFloat(((part.specs||{}).capacity||'0').toString().match(/(\d+(?:\.\d+)?)/)||[0,0])[1])<=0.5));
      if (part.crossReference) part.crossReference.forEach(function(ref){
        alternatives = alternatives.concat((this.partsDatabase||[]).filter(p=>p.crossReference && p.crossReference.some(r=>r.brand===ref.brand && r.part===ref.part)));
      }.bind(this));
      var map = {};
      alternatives.forEach(function(a){ if (a && a.id) map[a.id]=a; });
      return Object.values(map);
    }
  }

export default PartsFinder;
