import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Host(){
    const uuid = useSelector(state => state.auth.uuid);
    const [username, setUsername] = useState("yashpz");
  const [roomId, setRoomId] = useState("95069");

    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        navigate(`/room/${roomId}?username=${username}`);
      };
    return(
        <>
        <center>
            <form onSubmit={submit}>
            <input
          type="text"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
                <button>CREATE A ROOM</button>
            </form>
        </center>
        </>
    )
}

export default Host;