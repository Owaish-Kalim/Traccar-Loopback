'use strict';
const ObjectsToCsv = require('objects-to-csv');
var pdf = require('html-pdf');
var jspdf = require('jspdf');
const xnml2js = require('xml2js')
const tokml = require('geojson-to-kml')
const createGpx = require('gps-to-gpx').default;

module.exports = function(Poi) {

    Poi.csvFile = async function(cb)   {
        const data = [
            {code: 'CA', name: 'California'},
            {code: 'TX', name: 'Texas'},
            {code: 'NY', name: 'New York'},
          ];

        const csv = new ObjectsToCsv(data);

        var response = await csv.toString() ;
        // console.log(response); 
        cb(null, response , 'application/csv', 'attachment;filename=Data.csv')
        
    }

    Poi.remoteMethod('csvFile', {
        isStatic: true,
        http: {path: '/csvFile', verb: 'get'},
        returns: [
            {arg: 'body', type: 'file', root: true},
            {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
            { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
            // { arg: 'filename', type: 'string', http: { target: 'header' } }
          ]
    });

    Poi.pdfFile = async function(cb)   {
        const data = [
            {code: 'CA', name: 'California'},
            {code: 'TX', name: 'Texas'},
            {code: 'NY', name: 'New York'},
          ];

          var doc = new jspdf(
            {orientation: "landscape",
          unit: "in",
          format: [4, 2]});
          data.forEach(function(employee, i){
              doc.text(20, 10 + (i * 10), 
                  "Code: " + employee.code +
                  "Name: " + employee.name);
          });
          doc.save('Test.pdf');
          var response = {}

        cb(null, response , 'application/pdf', 'attachment;filename=Data.pdf')
        
    }

    Poi.remoteMethod('pdfFile', {
        isStatic: true,
        http: {path: '/pdfFile', verb: 'get'},
        returns: [
            {arg: 'body', type: 'file', root: true},
            {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
            { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
            // { arg: 'filename', type: 'string', http: { target: 'header' } }
          ]
    });

    Poi.xmlFile = async function(cb)   {
      const data = [
          {code: 'CA', name: 'California'},
          {code: 'TX', name: 'Texas'},
          {code: 'NY', name: 'New York'},
        ];

      const xmlObject =  {
        demo : {
          name:{
            _:'test.xml',
            $: {
              desc:'Name'
            }
          }, content: {
              items : [
                 data
              ] 
          }
        }
      };

      const builder = new xnml2js.Builder() ;
      const xml = builder.buildObject(xmlObject) 

      console.log(xml) ;

      cb(null, xml , 'application/xml', 'attachment;filename=Data.xml')
      
  }

  Poi.remoteMethod('xmlFile', {
      isStatic: true,
      http: {path: '/xmlFile', verb: 'get'},
      returns: [
          {arg: 'body', type: 'file', root: true},
          {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
          { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
          // { arg: 'filename', type: 'string', http: { target: 'header' } }
        ]
  });

Poi.kmlFile = async function(cb)   {
  const geojsonObject = 
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [102.0, 0.5]
          },
          "properties": {
            "prop0": "value0"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
          },
          "properties": {
            "prop0": "value0",
            "prop1": 0.0
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                [100.0, 1.0], [100.0, 0.0]
              ]
            ]
          },
          "properties": {
            "prop0": "value0",
            "prop1": { "this": "that" }
          }
        }
      ]
    }

  const kml = tokml(geojsonObject);

  const kmlNameDescription = tokml(geojsonObject, {
    name: "name",
    description: "description"
  });

  const kmlDocumentName = tokml(geojsonObject, {
    documentName: "My List Of Markers",
    documentDescription: "One of the many places you are not I am"
  });

  console.log(kml) ;

  cb(null, kml , 'application/kml', 'attachment;filename=Data.kml')
  
}

Poi.remoteMethod('kmlFile', {
  isStatic: true,
  http: {path: '/kmlFile', verb: 'get'},
  returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
      // { arg: 'filename', type: 'string', http: { target: 'header' } }
    ]
});

Poi.gpxFile = async function(cb)   {
  const data = {
    "activityType": "RUN",
    "startTime": "2016-07-06T12:36:00Z",
    "waypoints": [
      {
        "latitude": 26.852324,
        "longitude": -80.08045,
        "elevation": 0,
        "time": "2016-07-06T12:36:00Z"
      }
    ]
  }
  
  const gpx = createGpx(data.waypoints, {
    activityName: data.activityType,
    startTime: data.startTime,
  });
   
  console.log(gpx);

  cb(null, gpx , 'application/gpx', 'attachment;filename=Data.gpx')
  
}

Poi.remoteMethod('gpxFile', {
  isStatic: true,
  http: {path: '/gpxFile', verb: 'get'},
  returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Type', type: 'string', http: { target: 'header' }},
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' }}
      // { arg: 'filename', type: 'string', http: { target: 'header' } }
    ]
});

};

