'use strict';

/**
 * @ngdoc overview
 * @name colderThanMarsYqr2016App
 * @description
 * # colderThanMarsYqr2016App
 *
 * Main module of the application.
 */
angular
  .module('colderThanMarsYqr2016App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .directive('custom-graph', [function() {


    var
     margin = {top: 10, right: 10, bottom: 100, left: 40},
    // margin = {top: 20, right: 80, bottom: 30, left: 50},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        height2 = 500 - margin2.top - margin2.bottom;
    var parseDate = d3.time.format("%Y%m%d").parse;



    return {
      template: '',
      restrict: 'E',
      scope: {

      },
      link: function(scope, element, attrs)
       {
var  htmlelement=element[0];

d3.csv("SKByYear.csv", function(error, data) {
  if (error) throw error;
var x = d3.time.scale()
    .range([0, width]);
    var x2 = d3.time.scale()
        .range([0, width]);


var y = d3.scale.linear()
    .range([height, 0]);

    var y2 = d3.scale.linear()
        .range([height2, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");





var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {


       return x(d.date);

     })
    .y(function(d) { return y(d.co2); });

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", function (){

          // once brushed - change the x domain and update the viwe
          x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.selectAll(".category").select(".line").attr("d", function(d) { return line(d.values); });
        //context.selectAll(".categorycontext").select(".line").attr("d", function(d) { return linecontext(d.values); });
          focus.select(".x.axis").call(xAxis);
        // event to do when brushed ..


        });

  var linecontext =
            d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {
              return x2(d.date); })
            .y(function(d) { return y2(d.co2); });


    var svg = d3.select(htmlelement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // add a g where I am going to add the foucs inside the svg..
    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // add another g for the context.
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "YEAR"; }));

        // data.forEach(function(d) {
        //   d.date = parseDate(d.YEAR);
        // });

        categories = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {


              var temp=new Date();
              temp.setYear(+d.YEAR);
              return {date: temp, co2: +d[name]};
            })
          };
        });

        x.domain(d3.extent(data, function(d) {
          var temp=new Date();
          temp.setYear(+d.YEAR);
           return temp; }));

       x2.domain( d3.extent(data, function(d) {
         var temp=new Date();
         temp.setYear(+d.YEAR);
          return temp; }));


        y.domain([
          d3.min(categories, function(c) { return d3.min(c.values, function(v) { return v.co2; }); }),
          d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.co2; }); })
        ]);


        y2.domain(y.domain());


        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("co2 emission ");



            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);


          context.append("g")
                    .attr("class", "x brush")
                    .call(brush)
                  .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", height2 + 7);



        var category = focus.selectAll(".category")
            .data(categories)
          .enter().append("g")
            .attr("class", "category");

        category.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        category.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.co2) + ")"; })
            .attr("x", - 2*margin .left)
            .attr("dy", function (d){
            if (d.name=='WASTE')
              return "-0.95em";
              else
              return ".45em";
            })
            // .attr("y",  function (d,i){
            // if (i%2==0)
            //   return "9";
            //   else
            //   return "-9";
            // })
            .text(function(d) { return d.name; })
            .attr('overflow',"visible")
            .style("stroke", function(d) { return color(d.name); })
            .on("click", function (d){
               console.log("  adding the   "+d.name);


            })

            ;
            var series = category.selectAll("g.series")
          	// convert the object to an array of d3 entries
          							.data(categories).enter()
          							// create a container for each series
          							.append("g").attr('fill', function(d) {
          								return color(d.name);

          							})
          							.attr('stroke-color', function(d) {
          								return color(d.name);

          							})
          							.attr("class", 'series')
          							.attr("id", function(d) {
          								return "series-" + d.name
          							})

        series.selectAll("circle")
                  // do a data join for each series' values
                  .data(function(d) {
                    return d.values ;
                  })
                  .enter()
                  .append("circle")

                  .attr("cx", function(d) {
                    return  x(d.date);
                  })
                  .attr("r", "4")
                  .classed("selected", false)
                  .attr("cy", function(d) {
                    return y(d.co2)
                  })

                  // / this mouse over copied from
                  // /http://chimera.labs.oreilly.com/books/1230000000345/ch10.html#_html_div_tooltips
                  //
                  .on( "mouseover",
                      function(d, i, j) {

                        // Get this bar's x/y values, then augment for the tooltip
                        var xPosition = parseFloat(d3.select(this).attr("cx")) + 40;
                        var yPosition = parseFloat(d3.select(this).attr("cy")) + 60;
                        if (yPosition > height) {
                          yPosition = yPosition - 120;
                        }

                        //console.log(" this position is "+xPosition +" y "+ yPosition
                    //    +" rate tis "+d.rate);
                        //Update the tooltip position and value
                        d3.select("#tooltip").style("left", xPosition + "px").style(
                            "top", yPosition + "px").select("#value")

                        .text(d.co2);

                        d3.select("#tooltip").select("#category").text(
                            "  " + categories.values[i].name);

                        d3.select("#tooltip").select("#date").text(d.date);
                        ;

                        // Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);

                      })

                  .on("mouseout", function() {
                    // Hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);

                  })


      			 .on ("click",function (d,i,j){

               console.log(" the click on this "+d.co2);
             }


           );

           // add the brush on the context with the new domain and scale...

             var categorycontext = context.selectAll(".categorycontext")
                 .data(categories)
               .enter().append("g")
                 .attr("class", "categorycontext");

            categorycontext .append("path")
                 .attr("class", "line")
                 .attr("d", function(d) { return linecontext(d.values); })
                 .style("stroke", function(d) { return color(d.name); });




});  /// d3 .csv ... 



       },
       controller: function($scope) {

       }
     };
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/1990.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/1990', {
        templateUrl: 'views/1990.html',
        controller: 'MainCtrl',
        controllerAs: 'mail'
      })
      .when('/1995', {
        templateUrl: 'views/1995.html',
        controller: 'MainCtrl',
        activetab: '1995',
        controllerAs: 'mail'
      })
      .when('/2000', {
        templateUrl: 'views/2000.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/2005', {
        templateUrl: 'views/2005.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/2010', {
        templateUrl: 'views/2010.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/2011', {
        templateUrl: 'views/2011.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/2012', {
        templateUrl: 'views/2012.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/2013', {
        templateUrl: 'views/2013.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
