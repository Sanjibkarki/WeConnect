import { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, getDoc, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyBnCBydxc8Hd_VVErnk4wkYZMKNFEJ72oE",

  authDomain: "portal-fdf39.firebaseapp.com",

  projectId: "portal-fdf39",

  storageBucket: "portal-fdf39.appspot.com",

  messagingSenderId: "670648852494",

  appId: "1:670648852494:web:1a0277d94c771e77119c5f",

  measurementId: "G-646MJ0H3HW"

};


// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Home() {
  const webcamVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callButtonDisabled, setCallButtonDisabled] = useState(true);
  const [answerButtonDisabled, setAnswerButtonDisabled] = useState(true);
  const [webcamButtonDisabled, setWebcamButtonDisabled] = useState(false);
  const [hangupButtonDisabled, setHangupButtonDisabled] = useState(true);

  const callInputRef = useRef(null); // Using useRef for DOM reference

  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302', },
      
    ]
  };


  const pc = new RTCPeerConnection(servers);
  let localStream = null;
  let remoteStream = null;

  const setupMediaSources = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true,video: false });
      remoteStream = new MediaStream();

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = localStream;
      } else {
        console.error('webcamVideoRef.current is null');
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      } else {
        console.error('remoteVideoRef.current is null');
      }

      console.log('Audio stream setup successful');
    } catch (error) {
      console.error('Error setting up audio stream:', error);
    }

    setWebcamButtonDisabled(true);
    setAnswerButtonDisabled(false);
    setCallButtonDisabled(false);
    setHangupButtonDisabled(false);
  };

  const createCall = async () => {
    console.log("Creating call...");

    try {

      const callDoc = doc(collection(db, 'calls'));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');
      callInputRef.current.value = callDoc.id;

      pc.onicecandidate = function (event) {
        if (event.candidate) {
          console.log('offer')
          addDoc(offerCandidates, event.candidate.toJSON());
        }
      }

      const offerDescription = await pc.createOffer({offerToReceiveAudio:true,offerToReceiveVideo:false});
      await pc.setLocalDescription(offerDescription);


      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });
      console.log('Call offer saved to Firestore');

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.offer && !pc.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.offer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {

        snapshot.docChanges().forEach((change) => {
          console.log('answer')
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });


    } catch (error) {
      console.error('Error creating call:', error);
    }
  };

  const answerCall = async () => {
    try {
      console.log('Answering call with ID:', callInputRef.current.value);

      const callDoc = doc(db, 'calls', callInputRef.current.value);
      console.log(callDoc)
      const answerCandidates = collection(callDoc, 'answerCandidates');
      const offerCandidates = collection(callDoc, 'offerCandidates');

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(answerCandidates, event.candidate.toJSON());
        }
      };

      const callData = (await getDoc(callDoc)).data();
      console.log(callData)
      if (!callData) {
        console.error('No call data found!');
        return;
      }

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };
      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const hangupCall = () => {
    pc.close();
    setCallButtonDisabled(true);
    setAnswerButtonDisabled(true);
    setWebcamButtonDisabled(false);
    setHangupButtonDisabled(true);
    console.log('Call ended');
  };

  return (
    <>
      <center>
        <h1 style={{ color: 'grey' }}>WE CONNECT YOU</h1>
      </center>
      <h2>1. Start your Audio</h2>
      <div className="videos">
      <span>
        <h3>Local Stream</h3>
      <video ref={webcamVideoRef}  autoPlay playsInline muted="muted"></video>
        
      </span>
      <span>
        <h3>Remote Stream</h3>
      <video ref={remoteVideoRef}  autoPlay playsInline></video>
        
      </span>


    </div>
      <button disabled={webcamButtonDisabled} onClick={setupMediaSources}>Start Audio</button>

      <h2>2. Create a new Call</h2>
      <button disabled={callButtonDisabled} onClick={createCall}>Create Call (offer)</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>
      <input ref={callInputRef} id="callInputRef" />
      <button disabled={answerButtonDisabled} onClick={answerCall}>Answer</button>

      <h2>4. Hangup</h2>
      <button disabled={hangupButtonDisabled} onClick={hangupCall}>Hangup</button>
    </>
  );
}

export default Home;
