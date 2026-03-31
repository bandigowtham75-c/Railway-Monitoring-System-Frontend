import { useEffect,useState } from "react";
import axios from "axios";

function Sensors(){

 const [data,setData] = useState([]);

 useEffect(()=>{

   axios.get("http://localhost:8080/api/sensors")
   .then(res=>setData(res.data));

 },[]);

 return(

   <div>

     <h2>Sensor Monitoring</h2>

     {data.map(s=>(
       <p key={s.id}>
         Track {s.trackId} | Vibration: {s.vibration}
       </p>
     ))}

   </div>

 );

}

export default Sensors;