import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams,useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Room() {
    const email = useSelector(state => state.auth.user);
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
    let mymeeting = async (element) => {
        const AppID = 1896822726;
        const ServerSecret = "9f32f84c7b505d71a84cbfb74a665e11";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            AppID,
            ServerSecret,
            roomId,
            username,
            username
        );
        console.log(kitToken)
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });


    };



    return (
        <div
            className="myCallContainer" ref={mymeeting} 
            style={{ width: '100vw', height: '100vh' }}
        >
        
        </div>
    );
}

export default Room;

