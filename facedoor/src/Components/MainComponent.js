import React, { Component } from 'react'
import AWS from 'aws-sdk'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import CardHeader from '@material-ui/core/CardHeader';
import '../index.css';
import alan_image from './DatabaseImage.js'
import credentials from '../creds';
require('dotenv').config() //process.env.SECRET_KEY
//import ImgToBase64 from 'react-native-image-base64';
 
function getBinary(base64Image) {
        var binaryImg = atob(base64Image);
        var length = binaryImg.length;
        var ab = new ArrayBuffer(length);
        var ua = new Uint8Array(ab);
        for (var i = 0; i < length; i++) {
          ua[i] = binaryImg.charCodeAt(i);
        }

        var blob = new Blob([ab], {
          type: "image/jpeg"
        });

        return ab;
      }

class App extends Component {
    onTakePhoto (dataUri) {
        // Make rest call
        // Convert test image to base64... should really be done once on startup(look at react-html5-camera-photo' api)
        var targetBytes = alan_image;
        AWS.config.update(credentials);
        dataUri = dataUri.split("data:image/png;base64,")[1];

       // ImgToBase64.getBase64String('../Images/alan.jpg', (err, base64string) => setValue(base64string));
        if (targetBytes === null) {
          console.log("FAIL");
          return;
        }
        var params = {
          SourceImage: {
           Bytes: getBinary(dataUri)
          }, 
          TargetImage: {
           Bytes: getBinary(targetBytes)
          },
          SimilarityThreshold: 90,
         };
        var rekognition = new AWS.Rekognition();
        rekognition.compareFaces(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
            console.log(data)
            if (data.FaceMatches.length > 0) {
              alert("ACCESS GRANTED!")
            } else {
              alert ("ACCESS DENIED!")
            }
          }        // successful response
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
