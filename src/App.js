import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank.js/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Clarifai from "clarifai";

function App() {
  const [data, setData] = React.useState({
    input: "",
    imageUrl: "",
    box: {},
  });
  console.log(data)

  const app = new Clarifai.App({
    apiKey: '713b9aceeba0424e85061d2360cb4899'
   });

  const onInputChangeHandler = (event) => {
    const userInput = event.target.value
    setData(val => ({
      ...val,
      input: userInput
    }))
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("imageInput")
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);
    console.log(clarifaiFace)
    return{
      leftCol: clarifaiFace.left_col * imageWidth,
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth),
      topRow: clarifaiFace.top_row * imageHeight,
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight)
    }
  }

  const displayBoundingBox = (coordinates) => {
    setData(val => ({
      ...val,
      box: coordinates
    }))
  }

  const onButtonSubmit = () => {
    setData(val => ({
      ...val,
      imageUrl: data.input
    }))
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      data.input)
    .then(response => displayBoundingBox(calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  


  const particlesInit = useCallback(async engine => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await container;  
  }, []);

  return (
    <div className="App">
      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fpsLimit: 120,
                // interactivity: {
                //     events: {
                //         onClick: {
                //             enable: true,
                //             mode: "push",
                //         },
                //         onHover: {
                //             enable: true,
                //             mode: "repulse",
                //         },
                //         resize: true,
                //     },
                //     modes: {
                //         push: {
                //             quantity: 4,
                //         },
                //         repulse: {
                //             distance: 200,
                //             duration: 0.4,
                //         },
                //     },
                // },
                particles: {
                    links: {
                        color: "#ffffff",
                        distance: 200,
                        enable: true,
                        opacity: 0.5,
                        width: 2,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 2,
                        straight: false,
                    },
                }
            }}
        />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={onInputChangeHandler} onButtonSubmit={onButtonSubmit}/>
      <FaceRecognition imageUrl={data.imageUrl} box={data.box}/>
    </div>
  );
}

export default App;
