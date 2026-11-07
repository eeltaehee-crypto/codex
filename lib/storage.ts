import { demoRecords, RecordItem } from './data';
const KEY='busafe.records.v1';
export const recordRepository={
 load():RecordItem[]{const raw=localStorage.getItem(KEY);if(!raw)return demoRecords();const parsed=JSON.parse(raw);if(!Array.isArray(parsed)||!parsed.every(r=>r&&typeof r.id==='string'&&typeof r.date==='string'&&Array.isArray(r.checks)&&['normal','issue','unknown'].includes(r.status)))throw new Error('저장된 기록을 읽을 수 없습니다. 브라우저 데이터를 확인해 주세요.');return parsed;},
 save(records:RecordItem[]){localStorage.setItem(KEY,JSON.stringify(records));}
};
