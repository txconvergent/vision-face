import React, { Component } from 'react'
import AWS from 'aws-sdk'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import CardHeader from '@material-ui/core/CardHeader';
import '../index.css';
import image from './DatabaseImage.js' // file contains valid(target) faces, export as an array if you want multiple
import credentials from '../creds';
require('dotenv').config() //process.env.SECRET_KEY
//import ImgToBase64 from 'react-native-image-base64';
 
/* Conversion function for base64 images to be used in AWS method call */
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
        var targetBytes = image;
        AWS.config.update(credentials);
        dataUri = dataUri.split("data:image/png;base64,")[1]; /* trim excess lines from base64 image */

       // ImgToBase64.getBase64String('../Images/alan.jpg', (err, base64string) => setValue(base64string));
        if (targetBytes === null) {
          console.log("FAIL");
          return;
        }
        /* Ideally with a database of images, you create an array of target images(base64 format) to run api calls on */
        /* Set Params */
        var params = {
          SourceImage: {
           Bytes: getBinary(dataUri) // data from camera
          }, 
          TargetImage: {
           Bytes: getBinary(targetBytes) // saved target data
          },
          SimilarityThreshold: 90, // minimum threshold for a match
         };
        var rekognition = new AWS.Rekognition();
        // you get 5000 free method calls per month
        // each image comparison is one call, keep that in mind
        rekognition.compareFaces(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else  {
            console.log(data) // JSON data for API call output
            // https://docs.aws.amazon.com/rekognition/latest/dg/API_CompareFaces.html
            /* Edit this to be better */
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
        <CardHeader title='Take a photo!'/>
        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
        />
        </div>
      );
    }
  }
  
  export default App;
