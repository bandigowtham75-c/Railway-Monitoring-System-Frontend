import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTracks, updateTrack } from "../services/TrackService";

function EditTrack(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [track,setTrack] = useState({
    name:"",
    location:"",
    status:"SAFE"
  });

  useEffect(()=>{

    getTracks().then(res=>{

      const foundTrack = res.data.find(
        t => t.id === parseInt(id)
      );

      if(foundTrack){
        setTrack(foundTrack);
      }

    });

  },[id]);

  const handleChange = (e)=>{

    setTrack({
      ...track,
      [e.target.name]:e.target.value
    });

  };

  const handleUpdate = async()=>{

    await updateTrack(id,track);

    alert("Track Updated");

    navigate("/tracks");

  };

  return(

    <div style={{padding:"30px"}}>

      <h2>Edit Track</h2>

      <input
        name="name"
        value={track.name}
        placeholder="Track Name"
        onChange={handleChange}
      />

      <br/><br/>

      <input
        name="location"
        value={track.location}
        placeholder="Location"
        onChange={handleChange}
      />

      <br/><br/>

      <select
        name="status"
        value={track.status}
        onChange={handleChange}
      >

        <option value="SAFE">SAFE</option>
        <option value="CRACK">CRACK</option>

      </select>

      <br/><br/>

      <button onClick={handleUpdate}>
        Update Track
      </button>

    </div>

  );

}

export default EditTrack;