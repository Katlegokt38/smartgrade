const { Assessment, Sequelize } = require("../models");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { Marks } = require("../models");
const { validationResult } = require('express-validator/check');
const { Op, DATE } = require("sequelize");
const math = require("mathjs");



exports.interquartile = async (req,res) => {

    var obj = [];
    var averageMark = 0;

    await Marks.findAll({
        where : {
            assessmentId : req.body.details.assessmentId
        },
        attributes : ["studentNumber", "mark", "totalMark"]
    }).then(async(data) => {

        for(var i = 0; i < data.length; i++)
        {
            averageMark = averageMark + data[i].dataValues.mark;
            obj.push(data[i].dataValues)
        }
        // console.log(obj);
        averageMark = averageMark / data.length;

        //Outlier detection

        //Get average

        // Then sort
        obj.sort( (a, b) => (a.mark > b.mark ? 1 : -1));
        /* Then find a generous IQR. This is generous because if (obj.length / 4) 
        * is not an int, then really you should average the two elements on either 
        * side to find q1.
        */     
        var q1 = obj[Math.floor((obj.length / 4))].mark;

        // Likewise for q3. 
        var q3
        // Likewise for q3. 
        if(obj[Math.ceil((obj.length * (3 / 4)))] == null)
        {
            q3 = obj[Math.floor((obj.length * (3 / 4)))].mark
        }
        else{
            q3 = obj[Math.ceil((obj.length * (3 / 4)))].mark;

        }
        var iqr = q3 - q1;

        // Then find min and max data
        var maxValue = q3 + iqr*1.5;
        var minValue = q1 - iqr*1.5;

        // Then filter anything beyond or beneath these values.
        var filteredValues = obj.filter(function(x) {
            return (x.mark >= maxValue) || (x.mark <= minValue);
        });

        // Then return
        

        //Only store average values
        var average = [];
        var belowAverage = [];
        var aboveAverage = [];
        if(filteredValues.length > 0)
        {
            for(var i = 0; i < obj.length; i++)
            {
                for(var j = 0; j < filteredValues.length; j++)
                {
                    if(filteredValues[j] != obj[i])
                    {
                        average.push(obj[i]);
                    }
                }
            }
        }
        else {
            average = obj;
        }
        

        //Get below and above average
        for(var i = 0; i < filteredValues.length; i++)
        {
            if(filteredValues[i].mark < averageMark)
            {
                belowAverage.push(filteredValues[i]);
            }

            else if(filteredValues[i].mark > averageMark)
            {
                aboveAverage.push(filteredValues[i])
            }
        }

        //get average percentage
        console.log(obj[0])
        var mark = 0;
        var total = 0;
        for(var i = 0; i < obj.length; i++)
        {
            mark = mark + obj[i].mark;
            total = total + obj[i].totalMark;
        }
        console.log(mark);
        console.log(total);

        var avgPerc =  (mark / total)*100;
        avgPerc = Math.ceil(avgPerc)

        //Package json object to send to client
        var outlierInfo = new Object;
        outlierInfo['below'] = belowAverage;
        outlierInfo['average'] = average;
        outlierInfo['above'] = aboveAverage;
        outlierInfo['averageMark'] = avgPerc;
        // outlierInfo.push({below : belowAverage, average : average, above : aboveAverage });
        console.log(outlierInfo);

        res.status(200).json(outlierInfo);

        })

}

exports.zscore = async (req,res) => {

    var obj = [];
    var marks = [];
    var outliers = [];
    var threshold = 3;

    await Marks.findAll({
        where : {
            assessmentId : req.body.details.assessmentId
        },
        attributes : ["studentNumber", "mark", "totalMark"]
    }).then(async(data) => {

            for(var i = 0; i < data.length; i++)
            {
                obj.push(data[i].dataValues);
                marks.push(data[i].dataValues.mark);
            }
            console.log(obj);
            console.log(marks);
            var temp = [1, 2, 2, 2, 3, 1, 1, 15, 2, 2, 2, 3, 1, 1, 2] 
            //Get mean
            var mean = math.mean(marks)
            console.log(mean);

            //Get standard deviation
            var std = math.std(marks)
            console.log(std);

            //Calculate Z score. If Z score>3, print it as an outlier.
            for(var j = 0; j < obj.length; j++){
                var z = (obj[j].mark -mean)/std;
                console.log(z);
                if (z > threshold){
                    outliers.push(obj[j]);
                }
            }

            console.log(outliers);

            var average = [];
            var belowAverage = [];
            var aboveAverage = [];

            if(outliers.length > 0)
            {
                for(var i = 0; i < obj.length; i++)
                {
                    for(var j = 0; j < outliers.length; j++)
                    {
                        if(outliers[j] != obj[i])
                        {
                            average.push(obj[i]);
                        }
                    }
                }
            }
            else {
                average = obj;
            }
            

        //Get below and above average
        for(var i = 0; i < outliers.length; i++)
        {
            if(outliers[i].mark < averageMark)
            {
                belowAverage.push(outliers[i]);
            }

            else if(outliers[i].mark > averageMark)
            {
                aboveAverage.push(outliers[i])
            }
        }
        console.log(obj)

        var mark = 0;
        var total = 0;
        for(var i = 0; i < obj.length; i++)
        {
            mark = mark + obj[i].mark;
            total = total + obj[i].totalMark;
        }
        console.log(mark);
        console.log(total);

        var avgPerc =  (mark / total)*100;
        avgPerc = Math.ceil(avgPerc)

        var outlierInfo = new Object;
        outlierInfo['below'] = belowAverage;
        outlierInfo['average'] = average;
        outlierInfo['above'] = aboveAverage;
        outlierInfo['averageMark'] = avgPerc;
        // outlierInfo.push({below : belowAverage, average : average, above : aboveAverage });
        console.log(outlierInfo);

        res.status(200).json(outlierInfo);
    });



}