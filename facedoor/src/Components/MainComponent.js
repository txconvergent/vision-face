import React, { Component } from 'react'
import AWS from 'aws-sdk'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import CardHeader from '@material-ui/core/CardHeader';
import '../index.css';
import ImgToBase64 from 'react-native-image-base64';
 
class App extends Component {
    onTakePhoto (dataUri) {
        // Make rest call
        var rekognition = new AWS.Rekognition();
        var targetBytes = null;

        // Convert test image to base64... should really be done once on startup(look at react-html5-camera-photo' api)
        ImgToBase64.getBase64String('../Images/alan.jpg', (err, base64string) => setValue(base64string));
        const setValue = ({base64}) => (
          targetBytes = base64
        )
        if (targetBytes === null) {
          console.log("FAIL");
          return;
        }
        var params = {
          SimilarityThreshold: 90, 
          SourceImage: {
           Bytes:dataUri
          }, 
          TargetImage: {
           Bytes:targetBytes
          }
         };
        rekognition.compareFaces(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
        
      }

    render() {
      return (
        <div className="App">
        <CardHeader id='cardHeader' title='Take a photo!'/>
        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        />
        </div>
      );
    }
  }
  
  export default App;
