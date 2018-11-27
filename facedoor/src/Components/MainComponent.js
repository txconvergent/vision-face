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
  console.log(base64Image);
  console.log(typeof base64Image);
  base64Image = base64Image.split("base64,")[1];
  console.log(base64Image);
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
function readImage(url, dataUri, callback) {
  var request = new
  XMLHttpRequest();   request.onload = function() {
    var file = new FileReader();
    file.onloadend = function() {
      compare(file.result, dataUri, callback);
    }
    file.readAsDataURL(request.response);
  };
  request.open('GET', url);
  request.responseType = 'blob';
  request.send();
}

function compare(targetBytes, dataUri, callback){
  AWS.config.update(credentials);

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
        callback(true)
      } else {
        callback(false)
      }
    }        // successful response
  });
}
class App extends Component {



  onTakePhoto (dataUri) {
    var TOTAL_COUNT = 2
    for (var i = 1; i <= TOTAL_COUNT; i++){
      readImage("faces/image"+i+".jpg", dataUri, function(wasMatch) {
          if (wasMatch){
            alert("Access Granted");
          }
          else {
            TOTAL_COUNT--;
            if (TOTAL_COUNT == 0){
              alert("Access Denied");
            }
          }
      });
    }
  }
// callback(base64, dataUri) {
//     console.log(base64);
//     var tgt = base64.split(',')[1];
//     this.compare(dataUri, tgt);
//  }

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
