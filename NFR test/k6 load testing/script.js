import http from 'k6/http';
import { sleep } from 'k6';
// options below to scale load



export let options = {
    vus: 50,
    duration: '30s',
  }



export default function () {
  var s =http.get('https://smartgrade1.herokuapp.com/api/admin/getCount');
  console.log(s.data[0]);
  sleep(1);
}
