export type Status = 'normal' | 'issue' | 'unknown';
export type Check = 'good' | 'bad' | 'unknown';
export type RecordItem = { id: string; vehicle: string; extinguisher: string; location: string; inspector: string; date: string; pressure: Status; checks: Check[]; status: Status; photo?: string; note: string; demo: boolean; reported: boolean; resolved: boolean; resolvedAt?: string };
export const statusText: Record<Status,string> = { normal: '정상', issue: '이상', unknown: '확인 불가' };
export const vehicles = ['서울 74사 1234','서울 74사 5678','서울 75사 9012','서울 70사 3456','서울 74사 7890','서울 71사 2468'];
export const extinguishers = [{id:'BUS-1234-01',location:'운전석 뒤',kind:'축압식 분말 소화기',size:'3.3 kg', vehicle:vehicles[0]}, {id:'BUS-1234-02',location:'뒷문 옆',kind:'축압식 분말 소화기',size:'3.3 kg',vehicle:vehicles[0]}];
export const registeredExtinguishers = [...extinguishers,...vehicles.slice(1).map((vehicle,i)=>({id:`BUS-${i+1}-01`,location:'운전석 뒤',kind:'축압식 분말 소화기',size:'3.3 kg',vehicle}))];
export function resultStatus(pressure:Status, checks:Check[]):Status { return pressure==='issue'||checks.includes('bad')?'issue':pressure==='unknown'||checks.includes('unknown')?'unknown':'normal'; }
export function demoRecords(): RecordItem[] { const today=new Date(); return [0,1,2,3,4].map((n)=>({id:`demo-${n}`,vehicle:vehicles[n],extinguisher:n===0?'BUS-1234-01':`BUS-${n}-01`,location:'운전석 뒤',inspector:['김안전','이민준','박지훈','최서연','정현우'][n],date:new Date(today.getFullYear(),today.getMonth(),today.getDate()-(n===4?1:0),8,40-n*8).toISOString(),pressure:n===2?'issue':'normal',checks:['good','good','good'],status:n===2?'issue':'normal',note:n===2?'압력계 바늘이 정상 범위 아래에 있어요.':'',demo:true,reported:n===2,resolved:false})); }
export function formatDate(date:string, time=true) { return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',...(time?{hour:'2-digit',minute:'2-digit'}:{})}).format(new Date(date)); }
export function isToday(date:string){return new Date(date).toDateString()===new Date().toDateString();}
export function vehicleComplete(records:RecordItem[],vehicle:string){const latest=registeredExtinguishers.filter(e=>e.vehicle===vehicle);return latest.length>0&&latest.every(e=>{const r=records.find(r=>r.vehicle===vehicle&&r.extinguisher===e.id);return r&&isToday(r.date)&&r.status==='normal';});}
