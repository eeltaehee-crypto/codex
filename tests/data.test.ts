import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resultStatus,vehicleComplete,demoRecords,vehicles} from '../lib/data';
test('an abnormal additional check overrides normal pressure',()=>assert.equal(resultStatus('normal',['good','bad','good']),'issue'));
test('unknown pressure cannot be recorded as normal',()=>assert.equal(resultStatus('unknown',['good','good','good']),'unknown'));
test('unknown additional check requires follow-up',()=>assert.equal(resultStatus('normal',['good','unknown','good']),'unknown'));
test('issue takes precedence over unknown',()=>assert.equal(resultStatus('unknown',['bad','good','good']),'issue'));
test('one checked extinguisher does not complete a two-extinguisher vehicle',()=>assert.equal(vehicleComplete(demoRecords(),vehicles[0]),false));
test('latest result for every registered extinguisher must be normal today',()=>{const a=demoRecords()[0];const b={...a,id:'new-2',extinguisher:'BUS-1234-02'};assert.equal(vehicleComplete([b,a],vehicles[0]),true);assert.equal(vehicleComplete([{...b,id:'abnormal',status:'issue'},b,a],vehicles[0]),false);});
