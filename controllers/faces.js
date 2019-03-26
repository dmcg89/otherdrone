var oxford = require('project-oxford');
var oxClient = new oxford.Client('28d68cd2760e47fc913b7b8619378b84');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

const say = require('say');

const arDrone = require('ar-drone');

const client = arDrone.createClient({
  ip: '172.30.1.96'
});


function includeASearchFace(groupname, imgpath, personname) {
  oxClient.face.faceList.addFace(groupname, {
      url: imgpath,
      name: personname
    })
    .catch(function(e) {
      console.log(e); // "Something went wrong!"
    }).then(function() {
      console.log("Face Added");
    });
};

function createNewFaceList(ListIdName, ListName) {
  oxClient.face.faceList.create(ListIdName, {
      name: ListName
    })
    .catch(function(e) {
      console.log(e); // "Something went wrong !"
    }).then(function() {
      console.log("Created Your FaceList");
    });
};

// function findKnownFaces(DetectId,searchFaceListName){
//   oxClient.face.similar(DetectId,{
//     candidateFaceListId : searchFaceListName,
//     maxNumOfCandidatesReturned: 10,
//     mode: "matchFace"
//   }).catch(function(e) {
//      console.log(e); // "oh, no!"
//   }).then(function (response) {
//     console.log(response);
//    if (response[0] != null) {
//         if (response[0].confidence > 0.5) {
//           console.log("Good Match - Found you");
//           console.log(response);
//        }
//    } else {
//      console.log("Poor or No Match");
//     console.log(response);
//   }
//   });
// }

function findKnownFaces(DetectId, searchFaceListName) {
  oxClient.face.similar(DetectId, {
    candidateFaceListId: searchFaceListName,
    mode: "matchFace"
  }).catch(function(e) {
    console.log(e); // "oh, no!"
  }).then(function(response) {
    if (response[0] != null) {
      if (response[0].confidence > 0.3) {
        say.speak('Hello ' + searchFaceListName)
        console.log("Good Match - Found you");
        console.log(response);
      } else {
        console.log("Poor match!");
        console.log(response);
      }
    } else {
      console.log("Poor or No Match");
      console.log(response);
    }
  });
};

function runAll(imageFileName, searchFaceListName) {
  oxClient.face.detect({
    path: imageFileName,
    analyzesAge: true,
    analyzesGender: true,
    returnFaceId: true
  }).then(function(response) {
    console.log(response);
    DetectId = response[0].faceId;
    findKnownFaces(DetectId, searchFaceListName);
  }).catch(function(e) {
    console.log(`no ${e}`);
  });
};

module.exports = function(app) {

  app.get('/detect', (req, res) => {

    // const facelist = 'myfaces'

    const facelist = ['ryan', 'sam'];

    for (item in facelist) {
      console.log('checking ' + facelist[item]);
      runAll('/Users/ryansmith/Documents/dev/spd/otherdrone/public/DroneImage.png', facelist[item])
    };
    const sam_url = 'https://cdn.filestackcontent.com/QGaBPrdFQnGKLXx9tGlX';
    const ryan_url = 'https://cdn.filestackcontent.com/pZKWut31Qd6uli06dqJw';


    //createNewFaceList(facelist,"students");
    console.log("**********************")

    //includeASearchFace(facelist,sam_url,'Sam');
    //includeASearchFace(facelist,ryan_url,'Ryan');

    // runAll('/Users/drew/dev/courses/drone/public/DroneImage.png',facelist)
  });

  app.get('/follow', (req, res) => {
    console.log('hit Follow');
    let faceInFrame = 0;
    while (faceInFrame < 10) {
      // console.log('while loop');
      oxClient.face.detect({
        path: '/Users/ryansmith/Documents/dev/spd/otherdrone/public/DroneImage.png',
        returnFaceId: true
      }).then(function(response) {
        console.log(response);
        const faceX = response[0].faceRectangle.left + response[0].faceRectangle.width / 2;
        const faceY = response[0].faceRectangle.top + response[0].faceRectangle.height / 2;
        console.log(faceX);
        console.log(faceY);
        if (faceX <= 155) {
          console.log('moving right');
          client.left(.2);
            .after(500, function() {
              client.stop();
            })
            faceInFrame += 1;
        } else if (faceX >= 225) {
          console.log('moving left');
          client.right(.2)
            .after(500, function() {
              client.stop();
            })
            faceInFrame += 1;
        } else {
          console.log('end');
          faceInFrame = true;
          client.stop();
          faceInFrame = 10;
        }
      }).catch(function(e) {
        console.log(`no ${e}`);
      });
    }
    res.send('Face In Frame');
  })

};
