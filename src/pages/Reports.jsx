 import { useEffect,useState } from "react";
import axios from "axios";

function Reports(){

 const [cracks,setCracks] = useState([]);

 useEffect(()=>{

   axios.get("http://localhost:8080/api/reports/cracks")
   .then(res=>setCracks(res.data));

 },[]);

 return(

   <div>

     <h2>Crack Report</h2>

     {cracks.map(t=>(
       <p key={t.id}>
         {t.name} - {t.location}
       </p>
     ))}

   </div>

 );

}

export default Reports;